import { IBaseComponent } from '../components/base'
import emitter from '../utils/emitter'
import { PASSIVE } from '../utils/passive-support'

export default (() => {
    let _routes: IRoute[] = []
    // let _isBusy = false
    let _root = ''
    let _current: string
    let _container: IBaseComponent<keyof HTMLElementTagNameMap>
    let _currentPages: IPage[] = []
    function when(path: string, handler: TRouteHandler): void {
        // parse params: Example: replace /:id with /([^/]+) per placeholder
        const paramMatch = new RegExp(':([^/]+)', 'g')
        const route: IRoute = {
            path,
            handler,
            params: {},
            reg: new RegExp('^' +_root + path.replace(paramMatch, '[^/]+') + '$'),
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
        // if (_isBusy) return
        window.history.back( )
        setTimeout(() => {
            history.replaceState(data, '', ''); // Todo: fix
        }, 10);
        console.log('back', history.state);
        
    }

    function forward(data?: any) {
        history.replaceState(data, '', '');
        window.history.forward()
    }

    async function replace(to: string = '', data = {}) {
        window.history.replaceState({ data, to }, '', to)
    }

    async function goto(to: string = '', data = {}) {
        // Todo: trim to?
        const from = location.pathname
        window.history.pushState({ data, to, from }, '', _root + to)
        navigate(_root + to, data, from)
    }

    async function navigate(to: string = '', data = {}, from: string) {
        if (to.includes('tel:')) return
        
        const found = _routes.find(route => route.reg.exec(to.split('?')[0]))
        
        if (found) {
            // Todo: 404calling transit through handler
            // Todo: fix 
            found.handler({ params: parseParams(found), query: parseQuery(), from, to: to.replace(_root, ''), data })
            // return
        }
        emitter.emit('route-changed', to.replace(_root, ''), { to, from, data })
    }

    async function transit(route: string, P: () => IPage, routeParams: IRouteParams) {

        while (_currentPages.length) {
            const p = <IPage>_currentPages.pop()
            
            p.exit({ from: location.pathname, to: route.replace('/' + _root, ''), ...routeParams })
        }
        // Todo: fix later
        
        const next = _routes.find(_route => {
            return _route.reg.test(_root + route)
        })
        if (!next) {
            console.log('404', { next, _root, route })
            // Todo: 404
            return
        }
        if (!next.page) {
            next.page = P()
            _container.append(next.page)
        }
        
        await next.page.enter({ from: location.pathname, to: route, ...routeParams })
        _currentPages.unshift(next.page)
        next.page.emit('enter', { from: location.pathname, to: route, ...routeParams })
        _current = _root + route
    }

    function handleClickOnLinks(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        const possibleLink = findPossibleLink(e)
        
        if (!possibleLink) {
            return
        }
        if (possibleLink.href.includes('tel:')) {
            window.location.href = possibleLink.href
            return
        }
        if (possibleLink.href.includes('mailto:')) {
            window.location.href = possibleLink.href
            return
        }
        if (possibleLink.target !== '_self') {
            window.open(possibleLink.href, possibleLink.target)
        }
        if (possibleLink === '/' || possibleLink.href.indexOf(location.origin) == 0 || /(\/|^)\w+\.\w+/.test(possibleLink.href) == false) {
            let route = possibleLink.href.replace(location.origin, '')
            // if (route.charAt(0) != '/') route = '/' + route
            goto(route)
        } else {
            window.open(possibleLink.href, possibleLink.target)
        }
    }

    function init({ routes, view, root = '', home = location.pathname }: any) {
        _root = root
        _container = view
        Object.entries(routes).map(([route, Page]: any) => {
            when(route, async (routeParams: IRouteParams) => await transit(route, Page, routeParams)) //66
        })
        setTimeout(() => {
            goto(home.replace(root, '') || '/')
        }, 300); // Todo use default page transition
        window.addEventListener('popstate', (event) => {
            navigate(location.pathname, history?.state?.data, _current)
        }, PASSIVE)
        window.addEventListener('click', handleClickOnLinks)
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
    params?: T
    route?: IRoute
    from?: string
    to?: string | undefined
    query: any
    data?: T
}

export interface IPage extends IBaseComponent<any> {
    enter: (params: IRouteParams) => Promise<any>
    exit: (params: IRouteParams) => Promise<any>
}

export type TRouteHandler = (routeParams: IRouteParams) => Promise<void>
