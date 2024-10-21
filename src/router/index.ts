/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHashHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
    history: createWebHashHistory(),
    routes: setupLayouts(routes),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
    if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
        if (!localStorage.getItem('vuetify:dynamic-reload')) {
            console.log('Reloading page to fix dynamic import error')
            localStorage.setItem('vuetify:dynamic-reload', 'true')
            location.assign(to.fullPath)
        } else {
            console.error('Dynamic import error, reloading page did not fix it', err)
        }
    } else {
        console.error(err)
    }
})

router.isReady().then(() => {
    localStorage.removeItem('vuetify:dynamic-reload')
})


{
    let lastPosition: number | null | undefined
    const positionFocusedElements: { [position: number]: HTMLElement } = {}

    router.beforeEach(() => {
        if (lastPosition != null && document.activeElement instanceof HTMLElement) positionFocusedElements[lastPosition] = document.activeElement
        console.log(positionFocusedElements)
    })

    router.afterEach(() => {
        const currentPosition: number | null | undefined = history.state?.position

        const isBackwards = currentPosition != null && lastPosition != null
            ? currentPosition < lastPosition
            : false

        console.log(history.state)
        console.log(isBackwards)

        if (isBackwards && currentPosition != null) {
            positionFocusedElements[currentPosition].focus()
        }

        lastPosition = currentPosition
    })
}


export default router
