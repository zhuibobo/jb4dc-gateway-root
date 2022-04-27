import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractContainerPlugin from "../../AbstractContainerPlugin";

let innerHTML = `<div class="uid-wfdct-vue-component-container-wrap"></div>`;
let singleName="WFDCT_VueComponent";

function CustomizePlugin() {
    AbstractContainerPlugin.call(this, singleName,innerHTML);
};

ClassUtility.inheritPrototype(CustomizePlugin, AbstractContainerPlugin);

let WFDCT_VueComponentPlugin=new CustomizePlugin();
GeneralPlugin.registeredPlugin(singleName, WFDCT_VueComponentPlugin);
export { WFDCT_VueComponentPlugin as default };