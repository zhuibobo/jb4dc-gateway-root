import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractContainerPlugin from "../../AbstractContainerPlugin";

let innerHTML = `<div class="ant-divider-with-text1"><span class="ant-divider-inner-text1" contenteditable="true">Text</span></div>`;
let singleName="WFDCT_DividerHorizontal";

function CustomizePlugin() {
    AbstractContainerPlugin.call(this, singleName,innerHTML);
};

ClassUtility.inheritPrototype(CustomizePlugin, AbstractContainerPlugin);

CustomizePlugin.prototype.resetWysiwygElemProps=function ($elem){
    GeneralPlugin.serializePropsToElem(this._$elem, props, this.config, GeneralPlugin.buildInputControlGeneralText(this.config, props));
}

let WFDCT_DividerHorizontalPlugin=new CustomizePlugin();
GeneralPlugin.registeredPlugin(singleName, WFDCT_DividerHorizontalPlugin);
export { WFDCT_DividerHorizontalPlugin as default };