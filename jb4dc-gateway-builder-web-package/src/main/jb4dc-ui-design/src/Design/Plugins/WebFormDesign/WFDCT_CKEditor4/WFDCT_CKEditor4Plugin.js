import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractInputBasePlugin from "../../AbstractInputBasePlugin";

let singleName="WFDCT_CKEditor4";

function CustomizePlugin() {
    AbstractInputBasePlugin.call(this, singleName);
};

ClassUtility.inheritPrototype(CustomizePlugin, AbstractInputBasePlugin);

let WFDCT_CKEditor4Plugin=new CustomizePlugin();
GeneralPlugin.registeredPlugin(singleName, WFDCT_CKEditor4Plugin);
export { WFDCT_CKEditor4Plugin as default };