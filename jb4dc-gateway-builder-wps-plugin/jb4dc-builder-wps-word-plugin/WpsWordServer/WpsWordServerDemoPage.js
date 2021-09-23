import "./Less/WpsWordServer.less";
import Vue from "Vue";

import WpsWordServerDemo from "./VueComponent/wps-word-server-demo.vue";

//EditTable_SelectDefaultValue.Get_CompletedStatus_HtmlElem();
new Vue({
    el: '#appForm',
    render: h => h(WpsWordServerDemo),
});