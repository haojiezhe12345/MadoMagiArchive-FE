/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { useUserStore } from '@/stores/user'

const app = createApp(App)

registerPlugins(app)

axios.defaults.baseURL =
    location.hostname.includes('localhost') || location.hostname.includes('haojiezhe12345.top')
        ? 'api'
        : 'https://haojiezhe12345.top:82/madohomu/archive/api'
axios.defaults.headers.token = localStorage.getItem('token')
document.cookie = `token=${localStorage.getItem('token')}`

const userStore = useUserStore()
userStore.loadUser()

app.mount('#app')
