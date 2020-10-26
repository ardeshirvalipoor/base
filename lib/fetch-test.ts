import { fetch } from './fetch'

export const TestService = {
    async query(q: string) {
        const results = await fetch<any>(`test-${q}`, `url/${q}`)
        return results?.data?.results || []
    }
}