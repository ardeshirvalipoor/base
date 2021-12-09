import { emitter, globalEmitter } from '../../utils/emitter'
import { PASSIVE } from '../../utils/passive-support'
import { findPossibleLink, parseQuery } from './helpers'
import { IRoutes, TRouteHandler } from './interfaces'

const Router = () => {
    const routerEmitter = emitter()
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

    async function replace(to: string = '', data = {}) {
        window.history.replaceState({ data, to }, '', prefix + to)
        history.shift()
    }

    async function goto(_to: string = '', data = {}, from = location.pathname) {
        let [to] = _to.split('?')
        if (to === '') to = '/'

        if (to.includes('tel:')) return // Todo: find a better way to handle isBusy
        if (isBusy) return

        const match = to.match(/([^\s]+)/)

        current = to
        if (!match) return
        let found = findRouteByReg(match[0])
        if (!found) {
            found = findRouteByReg('/404')
            // to = '/404' // Todo: fix this
        }
        if (_to !== history?.[0]?._to) {
            window.history.pushState({ data, _to }, '', prefix + _to)
            history.unshift({ data, _to })
        }
        let params: { [index: string]: string } = {}
        Object.keys(found.params).map(key => {
            const exec = found.params[key].exec(to)
            if (exec) params[key] = exec[1]
        })
        found.handler({ route: { params, query: parseQuery() }, from: from.replace(prefix, ''), _to, data })
        routerEmitter.emit('route-changed', _to, from, data)
    }

    function findRouteByReg(route: string): any {
        let results = Object.keys(routes).filter(r => routes[r].reg.test(route))
        if (results.length > 1) return routes[route] // Todo: fix it
        return routes[results[0]]
    }

    function init(options: any = {}) {
        if (options.prefix) prefix = options.prefix
        window.onpopstate = (event) => {
            if (history.length === 0) return // Fix me deeply
            // window.history.back()
            const data = history.shift().data
            const { _to } = history[0] || {}
            goto(_to, data, current)
        }


        globalEmitter.on('set-new-back-target', (target: string) => {
            window.onpopstate = null
        })
        globalEmitter.on('reset-back-target', (target: string) => {
            window.onpopstate = (event) => {
                // window.history.back()
                const data = history.shift().data
                const { to } = history[0]
                goto(to, data, current)
            }
        })
        document.addEventListener('click', (e: MouseEvent) => {
            const possibleLink = findPossibleLink(e)
            if (!possibleLink) return
            if (possibleLink === '/' || possibleLink.href.indexOf(location.origin) == 0 || /(\/|^)\w+\.\w+/.test(possibleLink.href) == false) {
                e.preventDefault()
                // let route = possibleLink.href.replace(location.origin, '')
                // if (route.charAt(0) != '/') route = '/' + route
                // goto(route)
                goto(location.pathname)
            } else {
                window.open(possibleLink.href, possibleLink.target)
            }
        }, PASSIVE)
    }

    return {
        back,
        when,
        replace,
        goto,
        init,
        busy() {
            isBusy = true
        },
        free() {
            isBusy = false
        },
        ...routerEmitter
    }
}

export default Router()

function notFound() {
    throw new Error('Function not implemented.')
}

