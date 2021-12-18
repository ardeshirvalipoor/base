
export interface IRoute {
    params: any
    reg: RegExp
    handler: TRouteHandler
}

export interface IRoutes {
    [index: string]: IRoute
}
export interface IRouteParams<T = any> {
    route: IRoute
    from: string
    to: string | undefined
    data: T
}

// export interface IRoute {
//     params: any
//     query: string
// }

export type TRouteHandler = (routeParams: IRouteParams) => Promise<void>
