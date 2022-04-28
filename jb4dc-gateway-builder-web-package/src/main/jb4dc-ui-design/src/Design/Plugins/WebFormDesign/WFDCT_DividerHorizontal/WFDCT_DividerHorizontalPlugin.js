import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractContainerPlugin from "../../AbstractContainerPlugin";

let innerHTML = `<div class="uid-divider-horizontal-outer uid-divider-horizontal-outer-center" classname="uid-divider-horizontal-outer-center"><span class="uid-divider-horizontal-text" contenteditable="true">Text</span></div>`;
let singleName="WFDCT_DividerHorizontal";

function CustomizePlugin() {
    AbstractContainerPlugin.call(this, singleName,innerHTML);
};

ClassUtility.inheritPrototype(CustomizePlugin, AbstractContainerPlugin);

CustomizePlugin.prototype.resetWysiwygElemProps=function ($elem, props) {
    GeneralPlugin.serializePropsToElem(this._$elem, props, this.config, GeneralPlugin.buildInputControlGeneralText(this.config, props));
    //debugger;
    $elem.removeClass("uid-divider-horizontal-outer-center").removeClass("uid-divider-horizontal-outer-left").removeClass("uid-divider-horizontal-outer-right");
    if(props.baseInfo.className=="uid-divider-horizontal-outer-left"){
        $elem.addClass("uid-divider-horizontal-outer-left");
    }
    else if(props.baseInfo.className=="uid-divider-horizontal-outer-right"){
        $elem.addClass("uid-divider-horizontal-outer-right");
    }
    else{
        $elem.addClass("uid-divider-horizontal-outer-center");
    }
}

let WFDCT_DividerHorizontalPlugin=new CustomizePlugin();
GeneralPlugin.registeredPlugin(singleName, WFDCT_DividerHorizontalPlugin);
export { WFDCT_DividerHorizontalPlugin as default };