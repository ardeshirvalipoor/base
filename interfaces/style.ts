import { IBaseComponent, IBaseSVGComponent } from './base'

export type Style = {
    [P in keyof CSSStyleDeclaration]?: any
}

export type CS = Style & { [index: string]: Style }

export interface IStyleOptions {
    delay?: number,
    name?: string,
}
export interface IStyler {
    cssClass: (style: CS, options?: IStyleOptions | number) => IBaseComponent<any> | IBaseSVGComponent<any>
    style: (style: CS, options?: IStyleOptions | number) => IBaseComponent<any> | IBaseSVGComponent<any>,
}