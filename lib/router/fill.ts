import { IBaseComponent } from '../../components/base'
import { IRouteParams } from './interfaces'
import Router from './router'

export function fill(container: IBaseComponent<HTMLElement>) {
    return {
        with: (routes: any, { currentRoute = '/' } = { currentRoute: '/' }) => {
            const pages: { [index: string]: any } = {}
            let currentPage = routes[currentRoute]()
            container.append(currentPage)
            currentPage.enter({})
            pages[currentRoute] = currentPage
            Object.entries(routes).map(([route, P]: any) => {
                Router.when(route, async (routeParams: IRouteParams) => await switchPage(route, P, routeParams))
            })
            async function switchPage(route: string, P: any, routeParams: IRouteParams) {
                if (route == currentRoute) return
                Router.busy()
                await currentPage.exit(routeParams)
                currentPage = await findOrAppendPage(route, P)
                await currentPage.enter(routeParams)
                Router.free()
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