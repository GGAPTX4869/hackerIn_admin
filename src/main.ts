import { createApp } from 'vue'

import App from './App.vue'
import ElementPlus from 'element-plus'

import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'virtual:svg-icons-register'

import globalComponent from '@/components/index.ts'
import '@/styles/index.scss'
import router from './router'
import pinia from './store'
import 'element-plus/dist/index.css'
import './router/permisstion.ts'

import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
// highlightjs
import hljs from 'highlight.js'

VMdEditor.use(githubTheme, {
  Hljs: hljs,
})

import VMdPreview from '@kangc/v-md-editor/lib/preview'
// import '@kangc/v-md-editor/lib/style/preview.css'
// import githubTheme from '@kangc/v-md-editor/lib/theme/github';
import '@kangc/v-md-editor/lib/theme/style/github.css'
// import hljs from 'highlight.js';

VMdPreview.use(githubTheme, {
  Hljs: hljs,
})

const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn,
})
// app.use(Clipboard)
app.use(VMdEditor)
app.use(VMdPreview)
app.use(router)
app.use(pinia)
app.use(globalComponent)
app.mount('#app')
