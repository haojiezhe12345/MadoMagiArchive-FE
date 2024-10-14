
export const rootSnackbar = reactive({
    showing: false,
    timeout: NaN,
    text: '',
    text_close: '',
    onClose: () => undefined,

    show(text: string, timeout?: number, text_close?: string, onClose?: () => undefined) {
        let t = 0
        if (this.showing) {
            this.showing = false
            t = 200
        }
        setTimeout(() => {
            this.showing = true
            this.text = text
            this.timeout = timeout ?? 3000
            this.text_close = text_close ?? ''
            this.onClose = onClose ?? (() => undefined)
        }, t)
    },

    close() {
        this.onClose()
        this.showing = false
    },
})

export const showSnackbar = rootSnackbar.show.bind(rootSnackbar)

export function parseHexPermission(permission?: number) {
    return {
        read: permission != null ? (permission & 0x00ff0000) / 0x10000 : NaN,
        write: permission != null ? (permission & 0x0000ff00) / 0x100 : NaN,
        delete: permission != null ? (permission & 0x000000ff) : NaN,
    }
}
