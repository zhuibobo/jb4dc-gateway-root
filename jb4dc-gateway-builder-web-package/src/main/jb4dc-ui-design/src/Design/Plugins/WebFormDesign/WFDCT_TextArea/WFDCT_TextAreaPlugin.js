import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractInputBasePlugin from "../../AbstractInputBasePlugin";

let singleName="WFDCT_TextArea";

function CustomizePlugin() {
    AbstractInputBasePlugin.call(this, singleName);
};

ClassUtility.inheritPrototype(CustomizePlugin, AbstractInputBasePlugin);

let WFDCT_TextAreaPlugin=new CustomizePlugin();
GeneralPlugin.registeredPlugin(singleName, WFDCT_TextAreaPlugin);
export { WFDCT_TextAreaPlugin as default };