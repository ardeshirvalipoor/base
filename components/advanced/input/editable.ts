import { editable } from '../../../utils/editable'
import { Base } from '../../base'

export interface IEditableOptions {
    text?: string
    timeout?: number
    removeFormattingOnPaste?: boolean
    selectOnClick?: boolean
}


export const Editable = (options: IEditableOptions = {}) => {
    let t: NodeJS.Timeout

    const base = Base('div')
    if (options.text) base.el.innerHTML = options.text
    base.el.contentEditable = 'true'
    base.el.dir = 'auto'
    base.el.addEventListener('input', () => {
        base.emit('typing')
        if (options.timeout === undefined) return base.emit('input')
        clearTimeout(t)
        t = setTimeout(() => base.emit('input'), options.timeout ?? 500) // Todo: use debounce
    })
    // base.el.addEventListener('paste', (e) => {
    //     if (options.removeFormattingOnPaste) {
    //         // Get HTML content from clipboard
    //         const htmlContent = e.clipboardData?.getData('text/html');
    
    //         // Sanitize the HTML content to only keep <b>, <i>, and new lines
    //         const sanitizedContent = sanitizeHtml(htmlContent);
    
    //         // Use selection API to get the selected text
    //         const selection = window.getSelection();
    //         const range = selection?.getRangeAt(0);
    //         if (!range) return;
            
    //         range.deleteContents();
    //         const div = document.createElement('div');
    //         div.innerHTML = sanitizedContent;
    //         range.insertNode(div);
    //         range.setStartAfter(range.endContainer);
    //         e.preventDefault();
    //     } 
    //     base.emit('paste', e);
    // });
    
    // function sanitizeHtml(html) {
    //     // Remove all tags except <b>, <i>, and <br>
    //     const tempDiv = document.createElement('div');
    //     tempDiv.innerHTML = html;
    
    //     // Convert new lines to <br>
    //     const text = tempDiv.textContent || tempDiv.innerText || "";
    //     const formattedText = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    
    //     // Preserve <b> and <i> tags
    //     const brElements = [...tempDiv.getElementsByTagName('br')];
    //     const bElements = [...tempDiv.getElementsByTagName('b')];
    //     const iElements = [...tempDiv.getElementsByTagName('i')];
    
    //     brElements.forEach(el => {
    //         formattedText.replace(el.textContent, '<br>');
    //     });
    //     bElements.forEach(el => {
    //         formattedText = formattedText.replace(el.textContent, `<b>${el.textContent}</b>`);
    //     });
    
    //     iElements.forEach(el => {
    //         formattedText = formattedText.replace(el.textContent, `<i>${el.textContent}</i>`);
    //     });
    
    //     return formattedText;
    // }
    base.el.addEventListener('paste', (e) => {
        if (options.removeFormattingOnPaste) {
            // Get plain text from clipboard
            const text = e.clipboardData?.getData('text/plain');
    
            // Convert new line characters to HTML line breaks
            const formattedText = text?.replace(/(\r\n|\n|\r)/gm, '<br>') || '';
    
            // Use selection API to get the selected text
            const selection = window.getSelection();
            const range = selection?.getRangeAt(0);
            if (!range) return;
            
            range.deleteContents();
            const node = document.createElement('div');
            node.innerHTML = formattedText;
            range.insertNode(node);
            range.setStartAfter(range.endContainer);
            e.preventDefault();
        } 
        base.emit('paste', e);
    });

    base.el.addEventListener('blur', () => {
        base.emit('blur', base.el.innerHTML)
    })
    if (options.selectOnClick) {
        base.el.onclick = () => {
            const range = document.createRange()
            range.selectNodeContents(base.el)
            const selection = window.getSelection()
            selection?.removeAllRanges()
            selection?.addRange(range)
        }
    }
    // Input debounce
    // https://medium.com/@joshua_e_steele/debouncing-and-throttling-in-javascript-b01cad5d6dcf
    //
    // const debounce = (func: any, wait: number) => {
    //     let timeout: any
    //     return function (...args: any[]) {
    //         const context = this
    //         const later = () => {
    //             timeout = null
    //             func.apply(context, args)
    //         }
    //         clearTimeout(timeout)
    //         timeout = setTimeout(later, wait)
    //     }
    // }
    //
    // const debounced = debounce(() => {
    //     console.log('debounced')
    // }, 500)
    //
    // base.el.addEventListener('input', debounced)

    base.cssClass({
        // pointerEvents: 'inherit',
        userSelect: 'text', // IOS
        overflow: 'auto',
        overflowX: 'hidden',
        // height: '100%'
    })


    return Object.assign(
        base,
        editable(base)
    )
}