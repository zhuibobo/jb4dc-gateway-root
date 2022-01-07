import { createApp } from 'vue';
import uiDesignMain from './ui-design-main.vue'
import "../Less/UIDesignMain.less";
import "../Less/UIRuntimeMain.less";
import "../Less/ANTVueCust.less";
//import uidWysiwygComponent from './Component/MainTab/uid-wysiwyg-component.vue'
//import uidHtmlEditorComponent from './Component/MainTab/uid-html-editor-component.vue'
//import uidJsEditorComponent from './Component/MainTab/uid-js-editor-component.vue'
//import uidWysiwygPluginListComponent from './Component/MainTab/uid-wysiwyg-plugin-list-component.vue'

import uidEmptyComp from './Component/uid-empty-comp.vue'

//import uidAppFormBaseInfoComponent from './Component/BaseInfo/uid-app-form-base-info-component.vue'
//import uidAppListBaseInfoComponent from './Component/BaseInfo/uid-app-list-base-info-component.vue'
//import uidWebFormBaseInfoComponent from './Component/BaseInfo/uid-web-form-base-info-component.vue'
//import uidWebListBaseInfoComponent from './Component/BaseInfo/uid-web-list-base-info-component.vue'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import * as Icons from '@ant-design/icons-vue';

import allPluginsPropertyVue  from './Plugins/IndexVue'
import allComponentVue  from './Component/IndexVue'

const app = createApp(uiDesignMain) // 通过 createApp 初始化 app
//app.component('uid-wysiwyg-component', uidWysiwygComponent)
//app.component('uid-html-editor-component', uidHtmlEditorComponent)
//app.component('uid-js-editor-component', uidJsEditorComponent)
//app.component('uid-wysiwyg-plugin-list-component', uidWysiwygPluginListComponent)
app.component('uid-empty-comp', uidEmptyComp)
//app.component('uid-app-form-base-info-component', uidAppFormBaseInfoComponent)
//app.component('uid-app-list-base-info-component', uidAppListBaseInfoComponent)
//app.component('uid-web-form-base-info-component', uidWebFormBaseInfoComponent)
//app.component('uid-web-list-base-info-component', uidWebListBaseInfoComponent)
app.use(Antd)

// 全局使用图标
const icons = Icons;
for (const i in icons) {
    app.component(i, icons[i]);
}

//app.component('AFDCT_TextBoxProperty', AFDCT_TextBoxProperty)
//console.log(allPluginsPropertyVue);
for (const allPluginsPropertyVueKey in allPluginsPropertyVue) {
    app.component(allPluginsPropertyVueKey, allPluginsPropertyVue[allPluginsPropertyVueKey])
}

for (const allComponentVueVueKey in allComponentVue) {
    app.component(allComponentVueVueKey, allComponentVue[allComponentVueVueKey])
}

app.mount('#root')