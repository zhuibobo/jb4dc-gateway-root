import {createApp} from 'vue';
import uiRuntimeRoot from './ui-runtime-root.vue'
import "../../Less/UIRuntimeMain.less";
import allPlugins from '../IndexPlugin';
import allComponentVue from '../IndexVue';
import HTMLControl from "../HTMLControl";
import WebFormRuntimeUtility from "./WebFormRuntimeUtility";

for (let pluginKey in allPlugins) {
    //console.log(pluginKey);
    window[pluginKey]=allPlugins[pluginKey];
}
window.HTMLControl=HTMLControl;

let formRuntimeInst = WebFormRuntimeUtility.pageReady({
    isPreview: false,
    rendererChainCompletedFunc: null,
    RendererDataChainCompletedFunc:function (){
        //debugger;
        console.log("htmlDesignRuntimeVueOuterWraphtmlDesignRuntimeVueOuterWraphtmlDesignRuntimeVueOuterWraphtmlDesignRuntimeVueOuterWraphtmlDesignRuntimeVueOuterWraphtmlDesignRuntimeVueOuterWrap")

        /*const app = createApp(uiRuntimeRoot)

        for (const allComponentVueVueKey in allComponentVue) {
            console.log(allComponentVueVueKey);
            app.component(allComponentVueVueKey, allComponentVue[allComponentVueVueKey])
        }

        app.mount('#htmlDesignRuntimeVueOuterWrap');*/
        Vue.createApp({
            data() {
                return {
                    message: 'Hello Vue!'
                }
            },
            mounted() {
                //alert(1);
            }
        }).mount('#htmlDesignRuntimeVueOuterWrap')
    },
    getWebFormRTParasFunc: WebFormRuntimeUtility.getWebFormRTParasWithListButtonId,
    pageHostInstance: null,
    rendererToId:"htmlDesignRuntimeWrap",
    rendererInnerButtonsToId:"innerButtonWrapOuter",
});

/*
const app = createApp(uiRuntimeRoot)
app.mount('#htmlDesignRuntimeVueOuterWrap')*/

/*for (const allComponentVueVueKey in allComponentVue) {
    console.log(allComponentVueVueKey);
    app.component(allComponentVueVueKey, allComponentVue[allComponentVueVueKey])
}*/
