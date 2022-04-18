import { IBaseComponent } from '../components/base'
import emitter from '../utils/emitter'
import { PASSIVE } from '../utils/passive-support'

export default (() => {
    let _routes: IRoute[] = []
    let _isBusy = false
    let _root = ''
    let _current: string
    let _container: IBaseComponent<any>

    function when(path: string, handler: TRouteHandler): void {
        // parse params: Example: replace /:id with /([^/]+) per placeholder
        const paramMatch = new RegExp(':([^/]+)', 'g')
        const route: IRoute = {
            path,
            handler,
            params: {},
            reg: new RegExp(_root + path.replace(paramMatch, '[^/]+') + '$'),
            page: undefined
        }

        let match
        while ((match = paramMatch.exec(path)) !== null) {
            // converts /:param1/test/:param2 to /([^/]+)/test/[^/]+ for example
            const [replacer, param] = match
            const paramReg = path.replace(replacer, '([^/]+)').replace(/(:[^/]+)/g, '[^/]+')
            route.params[param] = new RegExp(paramReg)
        }
        _routes.push(route)
    }

    function back(data?: any) {
        if (_isBusy) return
        window.history.back()
    }

    function forward(data?: any) {
        if (_isBusy) return
        window.history.forward()
    }

    async function replace(to: string = '', data = {}) {
        window.history.replaceState({ data, to }, '', to)
    }

    async function goto(to: string = '', data = {}) {
        if (_isBusy) return

        const from = location.pathname
        window.history.pushState({ data, to, from }, '', _root + to)
        navigate(_root + to, data, from)
    }

    async function navigate(to: string = '', data = {}, from: string) {
        if (to.includes('tel:')) return
        const found = _routes.find(route => route.reg.exec(to.split('?')[0]))
        console.log('found', found, 'to', to, 'in navigate');
        
        if (found) {
            // Todo: 404calling transit through handler
            // Todo: fix 
            console.log('in found handler', found.handler);
            
            found.handler({ route: { params: parseParams(found), query: parseQuery() }, from, to, data })
            // return
        }
        emitter.emit('route-changed', to.replace(_root, ''), { to, from, data })
    }

    async function transit(route: string, Page: () => IPage, routeParams: IRouteParams) {
        const current = _routes.find(_route => _route.reg.test(_current || routeParams.from || ''))
        if (_isBusy) return
        _isBusy = true
        if (!current) {
            _isBusy = false
            // Todo: 404
            return
        }
        if (!current.page) {
            current.page = Page()
            _container.append(current.page)
            await current.page.enter(routeParams)
            _isBusy = false

            return
        }

        current.page.exit({ from: location.pathname, to: route, ...routeParams })
        const next = _routes.find(_route => {
            return _route.reg.test(_root + route)
        })
        if (!next) {
            console.log('404', {next, _root , route})
            
            // Todo: 404
            return
        }
        if (!next.page) {
            next.page = Page()
            _container.append(next.page)
        }
        await next.page.enter({ from: location.pathname, to: route, ...routeParams })
        _current = _root + route
        _isBusy = false
    }

    function handleClickOnLinks(e: MouseEvent) {
        const possibleLink = findPossibleLink(e)
        if (!possibleLink)
            return
        if (possibleLink === '/' || possibleLink.href.indexOf(location.origin) == 0 || /(\/|^)\w+\.\w+/.test(possibleLink.href) == false) {
            e.preventDefault()
            e.stopPropagation()
            let route = possibleLink.href.replace(location.origin, '')
            // if (route.charAt(0) != '/') route = '/' + route
            goto(route)
        } else {
            window.open(possibleLink.href, possibleLink.target)
        }
    }

    function init({ routes, view, root }: any) {
        _root = root
        _container = view
        Object.entries(routes).map(([route, Page]: any) => {
            when(route, async (routeParams: IRouteParams) => await transit(route, Page, routeParams)) //66
        })
        navigate(location.pathname, {}, location.pathname)
        window.addEventListener('popstate', (event) => {
            console.log('in popstate', event, location.pathname, _current);
            
            navigate(location.pathname, history?.state?.data, _current)
        }, PASSIVE)

        window.addEventListener('click', handleClickOnLinks, PASSIVE)
    }

    return {
        back,
        when,
        replace,
        goto,
        init
    }
})()

function parseParams(found: IRoute) {
    return Object.entries(found.params).reduce((p: any, [key, reg]) => {
        p[key] = location.pathname.match(reg)?.[1]
        return p
    }, {})
}

function parseQuery() {
    const q = location.search
    if (!q) return {}
    return q.split(/&|\?/).reduce((query: any, item: string) => {
        const [key, value] = item.split('=')
        if (key) query[key] = value
        return query
    }, {})
}

function findPossibleLink(e: MouseEvent) {
    if (!e.target) return undefined
    return findParent(e.target)
    // TODO: for touch handling
    function findParent(el: HTMLElement | any): any | undefined {
        if (!el) return undefined
        if (el.getAttribute('href')) return { href: el.getAttribute('href'), target: el.getAttribute('target') }
        return findParent(el.parentElement)
        //TODO return target
    }
}



export interface IRoute {
    path: string
    params: { [key: string]: RegExp }
    reg: RegExp
    handler: TRouteHandler
    page?: IPage
}

export interface IRoutes {
    [index: string]: IRoute
}
export interface IRouteParams<T = any> {
    route?: IRoute
    from?: string
    to?: string | undefined
    query?: any
    data?: T
}

export interface IPage extends IBaseComponent<any> {
    enter: (params: IRouteParams) => Promise<any>
    exit: (params: IRouteParams) => Promise<any>
}

export type TRouteHandler = (routeParams: IRouteParams) => Promise<void>
