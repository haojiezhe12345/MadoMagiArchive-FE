/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          background: '#fffbfc',
          surface: '#ffd9dd',
          primary: '#f34',
          secondary: '#ff979f',
          // success: string,
          // warning: string,
          // error: string,
          // info: string,
        }
      }
    }
  },
})
