import "./Less/WpsWordClient.less";
import Vue from "Vue";

import DevPanelApp from "./VueComponent/dev-panel-app.vue";

//EditTable_SelectDefaultValue.Get_CompletedStatus_HtmlElem();
new Vue({
    el: '#appForm',
    render: h => h(DevPanelApp),
});
