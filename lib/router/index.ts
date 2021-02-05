import emitter from '../../utils/emitter'
import { PASSIVE } from '../../utils/passive-support'
import { findPossibleLink, parseQuery } from './helpers'
import { IRoutes, TRouteHandler } from './interfaces'

const router = () => {

    let prefix = ''
    let routes: IRoutes = {}
    let current = ''
    let isBusy = false
    let history: any[] = [{ data: {}, to: '/' }]

    function when(route: string, handler: TRouteHandler): void {
        routes[route] = {
            params: {},
            reg: new RegExp('^' + route.replace(/^\/$/, '\/([^\s/]+)?').replace(/\/:[^\s/]+/g, '/[^\\s/]+') + '$'),
            handler
        }
        const paramsPlaceholder = route.match(/\/:([\w-]+)/g) || []
        paramsPlaceholder.forEach(param => {
            routes[route].params[param.replace('/:', '')] = new RegExp(route
                .replace(param, '/\([\\w-]+)')
                .replace(/:[^\s/]+/g, '[^\\s/]+')) // This one is to ignore the other param and focus on the wanted, delete?
        })
    }

    // function otherwise(handler: IRouteParams) {
    //     notFound = handler
    // }
    function back(data?: any) {
        if (data) history[0].data = { ...history[0].data, ...data }
        window.history.back()
    }

    async function goto(to: string = '', data = {}, from = location.pathname) {
        if (to.includes('tel:')) return
        if (isBusy) return
        if (to !== history[0].to) {
            window.history.pushState({ data, to }, '', prefix + to)
            history.unshift({ data, to })
        }
        const match = to.match(/([^\s]+)/)
        current = to
        if (!match) return
        const found = findRouteByReg(match[0])

        // if (!found) {
        //     if (notFound) notFound()
        //     return
        // }
        let params: { [index: string]: string } = {}
        Object.keys(found.params).map(key => {
            const exec = found.params[key].exec(to)
            if (exec) params[key] = exec[1]
        })
        found.handler({ route: { params, query: parseQuery(to) }, from: from.replace(prefix, ''), to, data })
        emitter.emit('route-changed', to, from, data)
    }

    function findRouteByReg(route: string): any {
        let results = Object.keys(routes).filter(r => routes[r].reg.test(route))
        if (results.length > 1) return routes[route] // Todo: fix it
        return routes[results[0]]
    }

    function init(options: any = {}) {
        if (options.prefix) prefix = options.prefix
        window.addEventListener('popstate', (event) => {
            const data = history.shift().data
            const { to } = history[0]
            goto(to, data, current)
        })
        document.addEventListener('click', (e: MouseEvent) => {
            const possibleLink = findPossibleLink(e)
            if (!possibleLink) return
            if (possibleLink.href.indexOf(location.origin) == 0 || /(\/|^)\w+\.\w+/.test(possibleLink.href) == false) {
                e.preventDefault()
                let route = possibleLink.href.replace(location.origin, '')
                if (route.charAt(0) != '/') route = '/' + route
                goto(route)
            } else {
                window.open(possibleLink.href, possibleLink.target)
            }
        }, PASSIVE)
    }

    return {
        back,
        when,
        goto,
        init,
        busy() {
            isBusy = true
        },
        free(){
            isBusy = false
        }
    }
}

export default router()

