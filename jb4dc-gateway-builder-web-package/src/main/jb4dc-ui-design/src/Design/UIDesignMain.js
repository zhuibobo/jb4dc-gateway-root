import { createApp } from 'vue';
import uiDesignMain from './ui-design-main.vue'
import "../Less/UIDesignMain.less";
import "../Less/UIRuntimeMain.less";

import uidWysiwygComponent from './Component/uid-wysiwyg-component.vue'
import uidHtmlEditorComponent from './Component/uid-html-editor-component.vue'
import uidJsEditorComponent from './Component/uid-js-editor-component.vue'
import uidWysiwygPluginListComponent from './Component/uid-wysiwyg-plugin-list-component.vue'
import uidEmptyComponent from './Component/uid-empty-component.vue'

import AFDCT_TextBoxProperty from './Plugins/AppFormDesign/AFDCT_TextBox/AFDCT_TextBoxProperty.vue'
//import AFDCT_SingleTableLayoutPlugin from './Plugins/AppFormDesign/AFDCT_SingleTableLayout/AFDCT_SingleTableLayoutPlugin.vue'
import allPluginsPropertyVue  from './Plugins/IndexVue'

const app = createApp(uiDesignMain) // 通过 createApp 初始化 app
app.component('uid-wysiwyg-component', uidWysiwygComponent)
app.component('uid-html-editor-component', uidHtmlEditorComponent)
app.component('uid-js-editor-component', uidJsEditorComponent)
app.component('uid-wysiwyg-plugin-list-component', uidWysiwygPluginListComponent)
app.component('uid-empty-component', uidEmptyComponent)
//app.component('AFDCT_TextBoxProperty', AFDCT_TextBoxProperty)
//console.log(allPluginsPropertyVue);
for (const allPluginsPropertyVueKey in allPluginsPropertyVue) {
    app.component(allPluginsPropertyVueKey, allPluginsPropertyVue[allPluginsPropertyVueKey])
}

app.mount('#root')