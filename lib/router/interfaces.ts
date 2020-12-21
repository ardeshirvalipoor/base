
export interface IRoute {
    params: any
    reg: RegExp
    handler: TRouteHandler
}

export interface IRoutes {
    [index: string]: IRoute
}
export interface IRouteParams {
    route?: IRoute
    from?: string
    to?: string | undefined
    data?: any
}

// export interface IRoute {
//     params: any
//     query: string
// }

export type TRouteHandler = (routeParams: IRouteParams) => Promise<void>
