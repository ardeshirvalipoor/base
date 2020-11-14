import { ISelf } from '../components/self'
import emitter from '../utils/emitter'

const router = () => {

    let prefix = ''
    let routes: any = {}
    let currentRoute = ''
    let states: any[] = []
    let notFound: any = null
    let history: any[] = []
    let isBusy = false //Todo: check this

    function when(route: string, handler: (params: IRouteParams) => any): void {
        routes[route] = { params: {}, reg: new RegExp('^' + route.replace(/^\/$/, '\/([^\s/]+)?').replace(/\/:[^\s/]+/g, '/[^\\s/]+') + '$'), handler }
        const params = <string[]>route.match(/\/:(\w+)/g) || [] //like /:product so dash not allowd
        params.map(param => {
            // To make regexp like this /\/eat\/\w+\/once\/(\w+)/ one matching group
            routes[route].params[param.replace('/:', '')] = new RegExp(route
                .replace(param, '/\([\\w-]+)')
                .replace(/:[^\s/]+/g, '[^\\s/]+')) // This one is to ignore the other param and focus on the wanted
        })
        // if (route == location.pathname) {
        //     goto(route)
        // }
    }

    function otherwise(handler: IRouteParams) {
        notFound = handler
    }

    function back() {
        window.history.back()
        // goto(history[history.length - 1]) // Todo: temp
        // handle navigator back
    }

    async function goto(to: string, data = {}, fromBack?: string) {
        console.log('GOTO', data)

        if (isBusy) return
        if (to[0] == '?') to = '/' + to
        history.unshift(to)
        let [, query = ''] = to.split('?')
        const from = fromBack ? fromBack : (location.pathname + location.search)
        states.unshift(data) // Todo: check deeper
        if (prefix + to != location.pathname) window.history.pushState(data, '', prefix + to)
        currentRoute = to
        const match = to.match(/([^\s]+)/)

        if (match) {
            const found = findRouteByReg(match[0])
            if (!found) {
                if (notFound) notFound()
                return
            }
            let params: { [index: string]: string } = {}
            Object.keys(found.params).map(key => {
                const exec = found.params[key].exec(to)
                if (exec) params[key] = exec[1]
            })
            console.log({data}, '----->');
            
            found.handler({ route: { params, query: parseQuery(query) }, from: from.replace(prefix, ''), to, data })
            emitter.emit('route-changed', to, from, data)
        }
    }

    function findRouteByReg(route: string): any {
        let results = Object.keys(routes).filter(r => routes[r].reg.test(route))
        if (results.length > 1) return routes[route] // Todo: fix it
        return routes[results[0]]
    }

    function init(options: any = {}) {
        if (options.prefix) prefix = options.prefix
        window.addEventListener('popstate', (event) => {
            
            const current = history[history.length - 2]
            if (isBusy) window.history.pushState(current, '', current)
            console.log('running goto', states, states[0]);
            goto(event.state || '/', states[0], currentRoute)
        })
        document.addEventListener('click', (e: MouseEvent) => {
            const possibleLink = findPossibleLink(e)
            if (possibleLink) {
                if (possibleLink.href.indexOf(location.origin) == 0 || /(\/|^)\w+\.\w+/.test(possibleLink.href) == false) {
                    e.preventDefault()
                    let route = possibleLink.href.replace(location.origin, '')
                    if (route.charAt(0) != '/') route = '/' + route
                    goto(route)
                } else {
                    window.open(possibleLink.href, possibleLink.target)
                }
            }
        }, true)
        // window.onpopstate = state => {
        //     console.log('popstate', state);
        // }
        const path = location.pathname + location.search
        // goto('/menu')
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

    function fill(container: ISelf<HTMLElement>) {
        return {
            with: (routes: any, { currentRoute = '/' } = { currentRoute: '/' }) => {
                const pages: { [index: string]: any } = {}
                let currentPage = routes[currentRoute]()
                container.append(currentPage)
                currentPage.enter()
                pages[currentRoute] = currentPage
                Object.entries(routes).map(([route, P]: any) => {
                    when(route, async (routeParams: IRouteParams) => await switchPage(route, P, routeParams))
                })
                async function switchPage(route: string, P: any, routeParams: any) {
                    if (route == currentRoute) return
                    isBusy = true
                    await currentPage.exit(routeParams)
                    currentPage = await findOrAppendPage(route, P)
                    await currentPage.enter(routeParams)
                    isBusy = false
                    currentRoute = route
                }
                async function findOrAppendPage(route: string, P: any) {
                    if (pages[route] == undefined) {
                        pages[route] = await P()
                        container.append(pages[route])
                    }
                    return pages[route]
                }
            }
        }
    }

    function parseQuery(q: string) {
        return q.split('&').reduce((query: any, item: string) => {
            const [key, value] = item.split('=')
            if (key) query[key] = value
            return query
        }, {})
    }

    return {
        back,
        when,
        goto,
        init,
        fill
    }
}

export default router()


export interface IRouteParams {
    route?: IRoute,
    from?: string,
    to?: string | undefined,
    data?: any
}

interface IRoute {
    params: any, query: string
}