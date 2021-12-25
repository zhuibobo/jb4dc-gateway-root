import { createApp } from 'vue';
import uiDesignMain from './ui-design-main.vue'
import "../Less/UIDesignMain.less";

import uidWysiwygComponent from './Component/uid-wysiwyg-component.vue'
import uidHtmlEditorComponent from './Component/uid-html-editor-component.vue'
import uidJsEditorComponent from './Component/uid-js-editor-component.vue'

const app = createApp(uiDesignMain) // 通过 createApp 初始化 app
app.component('uid-wysiwyg-component', uidWysiwygComponent)
app.component('uid-html-editor-component', uidHtmlEditorComponent)
app.component('uid-js-editor-component', uidJsEditorComponent)
app.mount('#root')