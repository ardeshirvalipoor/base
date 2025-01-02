import { IBaseComponent } from '../components/base'
import { emitter, createEmitter } from '../utils/emitter'

const __emitter = createEmitter()
const __views: IView[] = []
const __history: string[] = []

function init({ routes, view, home, root = '', preventAutoStart }: IRouteInitParams) {
    const _view: IView = {
        routes,
        components: {},
        currentRoute: '',
        view,
        root,
    }
    __views.push(_view)
    setupLinkClickListener()

    if (!preventAutoStart) {
        goto(home || location.pathname + location.search)
    }
}

interface IGotoOptions {
    replace?: boolean
    data?: any
    from?: string // todo handle it
}

function goto(path: string, options: IGotoOptions = {}) {
    const url = new URL(path, location.origin)
    const pathname = url.pathname
    const query = Object.fromEntries(url.searchParams.entries())
    const fromPath = location.pathname

    __views.forEach(_view => {
        const routeKey = matchRoute(pathname, _view.routes, _view.root)
        if (!routeKey) {
            __emitter.emit('error', { path, message: 'Route not found' })
            return
        }

        const { regex, paramNames } = createRoutePattern(_view.root + routeKey)
        const match = pathname.match(regex)
        if (!match) return

        const params = paramNames.reduce((acc, name, idx) => {
            acc[name] = match[idx + 1]
            return acc
        }, {} as Record<string, string>)

        if (shouldSkipNavigation(_view, routeKey, params, query)) return

        _view.currentComponent?.exit({ to: pathname, from: _view.currentRoute, params, query, data: options.data })

        if (!options.replace) {
            __history.push(pathname)
            history.pushState(options.data, '', path)
        } else {
            __history[__history.length - 1] = pathname
            history.replaceState(options.data, '', path)
        }

        __emitter.emit('change', { path, params, route: routeKey, from: _view.currentRoute, to: pathname, query, data: options.data })

        let component = _view.components[routeKey]
        if (!component) {
            component = _view.routes[routeKey]()
            _view.components[routeKey] = component
            _view.view.append(component)
        }

        _view.currentComponent = component
        _view.currentRouteKey = routeKey
        _view.currentParams = params
        _view.currentQuery = query
        _view.currentRoute = pathname

        component.enter({ params, from: fromPath, to: pathname, query, data: options.data })
    })
}

function back() {
    __history.pop()
    history.back()
}

function matchRoute(pathname: string, routes: Routes, root: string) {
    return Object.keys(routes).find(route => {
        const pattern = createRoutePattern(root + route).regex
        return pattern.test(pathname)
    })
}

function createRoutePattern(route: string) {
    const paramNames: string[] = []
    const pattern = route.replace(/:[^\/]+/g, (match) => {
        paramNames.push(match.slice(1))
        return '([^/]+)'
    }).replace(/\*/g, '.*')

    const regex = new RegExp(`^${pattern}$`)
    return { regex, paramNames }
}

function shouldSkipNavigation(_view: IView, routeKey: string, params: Params, query: Query) {
    return _view.currentRouteKey === routeKey &&
        JSON.stringify(_view.currentParams) === JSON.stringify(params) &&
        JSON.stringify(_view.currentQuery) === JSON.stringify(query)
}

function setupLinkClickListener() {
    document.addEventListener('click', (event) => {
        let element = event.target as HTMLElement
        while (element && !(element instanceof HTMLAnchorElement)) {
            element = element.parentElement as HTMLElement
        }
        if (element instanceof HTMLAnchorElement) {
            const href = element.getAttribute('href')
            if (href && isInternalLink(element)) {
                event.preventDefault()
                goto(href)
            }
        }
    })
}

function isInternalLink(link: HTMLAnchorElement) {
    return link.origin === location.origin || link.getAttribute('href')?.startsWith('/')
}

window.addEventListener('popstate', () => {
    goto(location.pathname + location.search, { replace: true })
})

function getQuery(key: string) {
    return Object.fromEntries(new URLSearchParams(location.search).entries())[key]
}

export default {
    init,
    goto,
    back,
    getQuery,
    history: __history,
    ...__emitter,
    removePreviousPath: () => history.replaceState(null, '', location.pathname),
}

// Interfaces and Types
export interface IPage extends IBaseComponent<any> {
    enter: (params: IRouteParams) => any | Promise<any>
    exit: (params: IRouteParams) => any | Promise<any>
}

export interface IRouteParams<T = any> {
    from?: string
    to?: string
    params?: T
    query: Query
    data?: T
}

export interface IRouteInitParams {
    routes: Routes
    view: IBaseComponent<any>
    home?: string
    root?: string
    preventAutoStart?: boolean
}

interface IView {
    currentRoute: string
    currentRouteKey?: string
    currentParams?: Params
    currentQuery?: Query
    currentComponent?: IPage
    routes: Routes
    components: { [key: string]: IPage }
    view: IBaseComponent<any>
    root: string
}

type Routes = { [key: string]: () => IPage }
type Params = { [key: string]: string }
type Query = { [key: string]: string }
