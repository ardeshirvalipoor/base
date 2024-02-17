import { IBaseComponent } from '../components/base'
import emitter, { createEmitter } from '../utils/emitter'

let __emitter = createEmitter()
// let __routes: { [key: string]: any } = {}
// let __components: { [key: string]: IPage } = {}
// let __currentRoute = ''
let __views: IView[] = []

function init({ routes, view, home, root, preventAutoStart }: IRouteInitParams) {
    console.log('\n\n\n');
    
    let _view = {} as IView
    _view.routes = routes
    _view.components = {}
    _view.currentRoute = ''
    _view.view = view
    _view.root = root || ''
    __views.push(_view)
    setupLinkClickListener()
    console.log('INIT ROUTER', { routes, view, home, root, preventAutoStart });
    
    // if (!preventAutoStart) {
    //     console.log('******GOING TO HOME', home || location.pathname + location.search);
        
    //     goto(home || location.pathname + location.search)
    // }
}

function goto(path: string, data?: any, options?: any) {
    console.log('GOTO', { path, data, options });
    
    for (const _view of __views) {
        console.log('----------------')

        const url = new URL(path, location.origin)
        console.log({ url });
        
        const pathname = url.pathname
        const query = extractQuery(url)
        const routeKey = extractRouteKey(pathname, _view.routes, _view.root)
        console.log(0, { routeKey, pathname, path, _view })

        if (!routeKey) {
            console.log('Route not found:', { path, pathname })
            continue    
        }
        const regex = createRouteRegex(routeKey)
        console.log(1, regex) // /^\/courses$/

        // 1. Find the matching route
        const match = pathname.match(regex)
        console.log(2, match) //['/menu/23/test/best', '23', 'best', index: 0, input: '/menu/23/test/best', groups: undefined]

        const paramNames = Array.from((_view.root + routeKey).matchAll(/:([a-zA-Z0-9_]+)/g)).map(match => match[1])
        console.log(3, paramNames, _view.root + routeKey) //  ['id', 'title']
        const params = extractParams(match, paramNames)
        console.log(4, params) // {id: '23', title: 'best'}

        if (routeKey.includes('*')) {
            params.wildcard = match ? match[match.length - 1] : ''
        }
        // const currentRouteKey = extractRouteKey(_view.currentRoute)
        // console.log(5, { currentRouteKey, routeKey }); //{currentRouteKey: undefined, routeKey: '/menu/:id/test/:title'}
        console.log(_view.currentRouteKey, routeKey, 'CURRENT CHECK');

        if (_view.currentRouteKey === routeKey) {
            continue // Skip navigation if the route and params are the same
        }
        console.log('TRY TO EXIT CURRENT ROUTE', _view.currentRoute, _view.components[_view.currentRoute])

        if (_view.currentComponent) {
            _view.currentComponent.exit({
                to: pathname,
                from: _view.currentRoute,
                params: params,
                query,
                data,
            })
        }

        if (options?.mode !== 'popstate') {
            history.pushState(data, '', path || '.')
        }
        emitter.emit('route-changed', path) // will be deprecated
        __emitter.emit('change', { path, params, route: routeKey, from: _view.currentRoute, to: pathname, query, data })
        _view.currentRoute = pathname
        console.log(6, routeKey, _view.routes[routeKey]) // /menu/:id/test/:title, ƒ MenuPage() { return html `<div>Menu</div>` }
        let component = _view.components?.[routeKey]
        if (!component) {
            console.log('ABOUFT TO',routeKey, _view.routes);
            
            component = _view.routes[routeKey]()
            console.log('no component, addding', routeKey, component)

            _view.components[routeKey] = component
            _view.view.append(component)
        }
        _view.currentComponent = component
        _view.currentRouteKey = routeKey
        component.enter({
            params,
            from: _view.currentRoute,
            to: pathname,
            query,
            data,
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
    console.log('EXTRACT PARAMS', { match, paramNames });
    
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
    goto(location.pathname, null, { mode: 'popstate' })
})

export default {
    init,
    goto,
    back,
    ...__emitter
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