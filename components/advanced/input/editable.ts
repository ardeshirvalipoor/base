import { editable } from '../../../utils/editable'
import { Base } from '../../base'
import { Div } from '../../native/div'

export interface IEditableOptions {
    text?: string
    timeout?: number
    removeFormattingOnPaste?: boolean
    selectOnClick?: boolean,
    placeholder?: string
    maxHeight?: number
}

export const Editable = (options: IEditableOptions = {}) => {
    let t: NodeJS.Timeout

    const base = Base('div')

    const placeholder = Div(options.placeholder || '')
    const editor = Div('')
    base.append(placeholder, editor)

    if (options.text) editor.el.innerHTML = options.text
    editor.el.contentEditable = 'true'
    editor.el.dir = 'auto'
    editor.el.addEventListener('input', (e) => {
        if (editor.el.innerHTML === '') placeholder.style({ display: 'block' })
        else placeholder.style({ display: 'none' })
        editor.emit('typing')
        if (options.timeout === undefined) return editor.emit('input')
        clearTimeout(t)
        t = setTimeout(() => editor.emit('input'), options.timeout ?? 500) // Todo: use debounce
    })
    // base.el.addEventListener('paste', (e) => {
    editor.el.addEventListener('paste', (e) => {
        placeholder.style({ display: 'none' })
        // temp
    })
    base.el.addEventListener('click', () => editor.el.focus())
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
            const text = e.clipboardData?.getData('text/plain')
            const formattedText = text?.replace(/(\r\n|\n|\r)/gm, '<br>') || ''
            const selection = window.getSelection()
            const range = selection?.getRangeAt(0)
            if (!range) return

            range.deleteContents()
            const node = document.createElement('div')
            node.innerHTML = formattedText
            range.insertNode(node)
            range.setStartAfter(range.endContainer)
            e.preventDefault()
        }
        base.emit('paste', e)
    })

    editor.el.addEventListener('blur', () => {
        base.emit('blur', base.el.innerHTML)
    })
    editor.el.addEventListener('focus', () => {
        base.emit('focus')
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
    editor.cssClass({
        // pointerEvents: 'inherit',
        userSelect: 'text', // IOS
        overflow: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        minWidth: '100%',
        minHeight: '20px',
        // backgroundColor: 'yellow',

    })
    base.cssClass({
        // pointerEvents: 'inherit',
        userSelect: 'text', // IOS
        overflow: 'auto',
        overflowX: 'hidden',
        position: 'relative',

    })
    placeholder.cssClass({
        position: 'absolute',
        top: '50px',
        left: '50px',
        color: '#aaa',
        pointerEvents: 'none',
        userSelect: 'none',
        fontSize: '18px',
    })


    return Object.assign(
        base,
        editable(editor)
    )
}