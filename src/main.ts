import './main.css'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import { createApp } from 'vue'
import App from './App.vue'

dayjs.extend(duration)
dayjs.extend(customParseFormat)

createApp(App).mount('#app')
