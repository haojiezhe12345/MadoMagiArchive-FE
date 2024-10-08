export { }

declare global {
    interface Window {
        lastClickedElement: HTMLElement | HTMLImageElement | null
    }
}