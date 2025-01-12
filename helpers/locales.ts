export function isRTL(char: string) {
    var rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(char);
}

// Replace Persian and Arabic digits with Latin digits
export function replaceDigits(value: string = ''): string {
    return value.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, (d: string) =>
        (d.charCodeAt(0) - (d >= '۰' ? 0x06F0 : 0x0660)).toString()
    )
}