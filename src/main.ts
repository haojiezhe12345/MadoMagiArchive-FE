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

import { setupRequests } from '@/requests'
import { useUserStore } from '@/stores/user'

const app = createApp(App)

registerPlugins(app)

setupRequests()
useUserStore().loadUser()

app.mount('#app')
