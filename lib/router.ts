import { IBaseComponent } from '../components/base'
import emitter, { createEmitter } from '../utils/emitter'

let __emitter = createEmitter()
// let __routes: { [key: string]: any } = {}
// let __components: { [key: string]: IPage } = {}
// let __currentRoute = ''
let __views: IView[] = []

function init({ routes, view, home, root, preventAutoStart }: IRouteInitParams) {
    
    let _view = {} as IView
    _view.routes = routes
    _view.components = {}
    _view.currentRoute = ''
    _view.view = view
    _view.root = root || ''
    __views.push(_view)
    setupLinkClickListener()
    
    if (!preventAutoStart) {
        goto(home || location.pathname + location.search)
    }
}

interface IGotoOptions {
    replace?: boolean,
    from?: string,
    mode?: string,
    data?: any
}

function goto(path: string, options: IGotoOptions = {}) {
    for (const _view of __views) {
        const url = new URL(path, location.origin)
        const pathname = url.pathname
        const query = extractQuery(url)
        const routeKey = extractRouteKey(pathname, _view.routes, _view.root)
        const fromPath = location.pathname
        
        if (!routeKey) {
            continue    
        }
        const regex = createRouteRegex(routeKey)

        // 1. Find the matching route
        const match = pathname.match(regex)

        const paramNames = Array.from((_view.root + routeKey).matchAll(/:([a-zA-Z0-9_]+)/g)).map(match => match[1])
        const params = extractParams(match, paramNames)

        if (routeKey.includes('*')) {
            params.wildcard = match ? match[match.length - 1] : ''
        }
        // const currentRouteKey = extractRouteKey(_view.currentRoute)

        if (_view.currentRouteKey === routeKey) {
            continue // Skip navigation if the route and params are the same
        }

        if (_view.currentComponent) {
            _view.currentComponent.exit({
                to: pathname,
                from: _view.currentRoute,
                params: params,
                query,
                data: options.data,
            })
        }

        if (options?.mode !== 'popstate') {
            if (options.replace) {
                window.history.replaceState(options.data, '', path || '.')
            } else {
                window.history.pushState(options.data, '', path || '.')
            }
        }
        __emitter.emit('change', { path, params, route: routeKey, from: _view.currentRoute, to: pathname, query, data: options.data })
        _view.currentRoute = pathname
        let component = _view.components?.[routeKey]
        if (!component) {
            component = _view.routes[routeKey]()
            _view.components[routeKey] = component
            _view.view.append(component)
        }
        _view.currentComponent = component
        _view.currentRouteKey = routeKey
        component.enter({
            params,
            from: fromPath,
            to: pathname,
            query,
            data: options.data,
        })
        _view.currentRoute = pathname
    }
}

function back(data?: any) {
    window.history.back()
}

function extractRouteKey(pathname: string, routes = {}, root = '') {
    return Object.keys(routes).find(route => {
        const pattern = (root + route).replace(/\*/g, '?.*')
        const regex = new RegExp(`^${pattern.replace(/:[^\s/]+/g, '([\\w-]+)')}$`)
        return regex.test(pathname)
    })
}

function extractQuery(url: URL) {
    return Array.from(url.searchParams.entries()).reduce((acc: { [key: string]: string }, [key, value]) => {
        acc[key] = value
        return acc
    }, {})
}

function extractParams(match: RegExpMatchArray | null, paramNames: string[]) {
    return match ? paramNames.reduce((params, paramName, index) => {
        params[paramName] = match[index + 1]
        return params
    }, {} as { [key: string]: string }) : {}
}

function createRouteRegex(routeKey: string) {
    return new RegExp(`^${routeKey
        .replace(/:[^\s/]+/g, '([\\w-]+)')
        .replace(/\*/g, '?(.*)')}$`)
}

function setupLinkClickListener() {
    document.addEventListener('click', (event) => {
        if (event.target instanceof HTMLAnchorElement) {
            const link = event.target
            const href = link.getAttribute('href')
            const isInternalLink = href && !link.hostname && !link.protocol && !link.port
            if (isInternalLink) {
                event.preventDefault()
                goto(href)
            }
        }
    })
}

window.addEventListener('popstate', (e) => {
    goto(location.pathname, { mode: 'popstate' })
})

export default {
    init,
    goto,
    back,
    ...__emitter, // ...emitter<K>,
    removePreviousPath: () => {
        history.replaceState(null, '', location.pathname)
    }
}

export interface IPage extends IBaseComponent<any> {
    enter: (params: IRouteParams) => Promise<any>
    exit: (params: IRouteParams) => Promise<any>
}

export interface IRouteParams<T = any> {
    from?: string
    to?: string
    params?: T
    query: any
    data?: T
}

export interface IRouteInitParams {
    routes: any
    view: IBaseComponent<any>
    home?: string
    root?: string
    preventAutoStart?: boolean
}

interface IView {
    currentRoute: string
    currentRouteKey: string
    currentComponent: IPage
    routes: { [key: string]: any }
    components: { [key: string]: IPage }
    view: IBaseComponent<any>
    root: string
}