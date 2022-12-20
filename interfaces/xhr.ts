export interface IResponse {
    data: any,
    status: number,
    error: any
}

export interface IXHROptoins {
    method?: string,
    type?: string,
    cache?: number,
    auth?: string
}