import { IBaseComponent } from '../components/base'
import emitter, { createEmitter } from '../utils/emitter'

export function createRouter() {
    let __emitter = createEmitter()
    let __routes: { [key: string]: any } = {}
    let __components: { [key: string]: IPage } = {}
    let __currentRoute = ''
    let __view: IBaseComponent<any>

    function init({ routes, view, home, preventAutoStart }: { routes: any, view: IBaseComponent<any>, home?: string, preventAutoStart?: boolean }) {
        __routes = routes
        __view = view
        setupLinkClickListener()
        if (!preventAutoStart) goto(home || location.pathname + location.search)
    }

    function goto(path: string, data?: any) {
        const url = new URL(path, location.origin)
        const pathname = url.pathname
        const query = extractQuery(url)
        const routeKey = extractRouteKey(pathname)
        
        if (!routeKey) {
            console.error('Route not found:', { path, pathname, __routes })
            return
        }
        const regex = new RegExp(`^${routeKey.replace(/:[^\s/]+/g, '([\\w-]+)').replace(/\*/g, '?(.*)')}$`)
        const match = pathname.match(regex)
        const paramNames = Array.from(routeKey.matchAll(/:([a-zA-Z0-9_]+)/g)).map(match => match[1])
        const params = extractParams(match, paramNames)

        if (routeKey.includes('*')) {
            params.wildcard = match ? match[match.length - 1] : ''
        }
        const currentRouteKey = extractRouteKey(__currentRoute)
        if (currentRouteKey === routeKey) {
            return // Skip navigation if the route and params are the same
        }

        if (currentRouteKey && __components[currentRouteKey]) {
            // const currentUrl = new URL(__currentRoute, location.origin);
            // const currentQuery = extractQuery(currentUrl);
            // const currentRegex = new RegExp(`^${currentRouteKey.replace(/:[^\s/]+/g, '([\\w-]+)')}$`);
            // const currentMatch = __currentRoute.match(currentRegex);
            // const currentParamNames = Array.from(currentRouteKey.matchAll(/:([a-zA-Z0-9_]+)/g)).map(match => match[1]);
            // const currentParams = extractParams(currentMatch, currentParamNames);
            __components[currentRouteKey].exit({
                to: pathname,
                from: __currentRoute,
                params: params,
                query,
                data,
            })
        }

        history.pushState(data, '', path  || '.' )
        emitter.emit('route-changed', path)
        __emitter.emit('change', { params, route: routeKey, from: __currentRoute, to: pathname, query, data })

        let component = __components[routeKey]
        if (!component) {
            component = __routes[routeKey]()
            __components[routeKey] = component
            __view.append(component)
        }

        component.enter({
            params,
            from: __currentRoute,
            to: pathname,
            query,
            data,
        })
        __currentRoute = pathname
    }

    function back(data?: any) {
        window.history.back()
    }

    function extractRouteKey(pathname: string) {
        return Object.keys(__routes).find(route => {
            const pattern = route.replace(/\*/g, '?.*')
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

    window.addEventListener('popstate', () => {
        goto(location.pathname)
    })

    return  {
        init,
        goto,
        back,
        ...__emitter
    }
}

const router = createRouter()

export default router

export interface IPage extends IBaseComponent<any> {
    enter: (params: IRouteParams) => Promise<any>
    exit: (params: IRouteParams) => Promise<any>
}

export interface IRouteParams<T = any> {
    params?: T
    from?: string
    to?: string
    query: any
    data?: T
}