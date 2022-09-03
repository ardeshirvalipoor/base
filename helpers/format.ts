import { NUMBERS_DELIMITER_REGEX } from "./regex";

export const fformat = (v: number, options: any = {}) => {
    // const rawValue = options.fix ? 
    return v.toFixed(options.fix ? options.fix : v < 10 ? 3 : 0).replace(NUMBERS_DELIMITER_REGEX, ',')
}