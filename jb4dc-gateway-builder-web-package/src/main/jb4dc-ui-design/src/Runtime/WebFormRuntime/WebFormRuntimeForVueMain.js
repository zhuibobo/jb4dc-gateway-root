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
        //console.log("RendererDataChainCompletedFunc")

        return;

        //暂不开启Vue初始化
        let vueObj=Vue.createApp({
            data() {
                return {
                    message: 'Hello Vue!'
                }
            },
            mounted() {
                //alert(1);
            }
        });

        for (const allComponentVueVueKey in allComponentVue) {
            console.log(allComponentVueVueKey);
            vueObj.component(allComponentVueVueKey,allComponentVue[allComponentVueVueKey]);
        };

        vueObj.mount('#htmlDesignRuntimeVueOuterWrap')
    },
    getWebFormRTParasFunc: WebFormRuntimeUtility.getWebFormRTParasWithListButtonId,
    pageHostInstance: null,
    rendererToId:"htmlDesignRuntimeWrap",
    rendererInnerButtonsToId:"innerButtonWrapOuter",
});