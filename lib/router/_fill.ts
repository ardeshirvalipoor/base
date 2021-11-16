import { ISelf } from '../../components/base'
import { IRouteParams } from './interfaces'
import Router from './router'

export function fill(container: ISelf<HTMLElement>) {
    return {
        with: async (routes: any, { currentRoute = '/' } = { currentRoute: '/' }) => {
            const pages: { [index: string]: any } = {}
            let currentPage = routes[currentRoute]()
            container.append(currentPage)
            await currentPage.enter({})
            pages[currentRoute] = currentPage
            Object.entries(routes).map(([route, P]: any) => {
                Router.when(route, async (routeParams: IRouteParams) => await switchPage(route, P, routeParams))
            })
            async function switchPage(route: string, P: any, routeParams: any = {}) {
                // if (route == currentRoute) return
                Router.busy()
                setTimeout(() => {
                    Router.free() // In case we can't reach free after awaits
                }, 1000);
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