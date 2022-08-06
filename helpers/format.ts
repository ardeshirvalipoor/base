import { NUMBERS_DELIMITER_REGEX } from "./regex";

export const fformat = (v: number, options : any = {}) => v.toFixed(v < 10 ? 3: 0).replace(NUMBERS_DELIMITER_REGEX, ',')