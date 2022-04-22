import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractInputBasePlugin from "../../AbstractInputBasePlugin";

let singleName="WFDCT_TextDateTime";

function CustomizePlugin() {
    AbstractInputBasePlugin.call(this, singleName);
};

ClassUtility.inheritPrototype(CustomizePlugin, AbstractInputBasePlugin);

let WFDCT_TextDateTimePlugin=new CustomizePlugin();
GeneralPlugin.registeredPlugin(singleName, WFDCT_TextDateTimePlugin);
export { WFDCT_TextDateTimePlugin as default };