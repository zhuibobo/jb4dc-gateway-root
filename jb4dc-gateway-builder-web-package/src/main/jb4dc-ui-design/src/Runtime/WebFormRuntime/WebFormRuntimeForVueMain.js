import {createApp} from 'vue';
import uiRuntimeRoot from './ui-runtime-root.vue'
import "../../Less/UIRuntimeMain.less";

const app = createApp(uiRuntimeRoot)
app.mount('#htmlDesignRuntimeVueOuterWrap')