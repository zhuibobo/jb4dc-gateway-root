import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractInputBasePlugin from "../../AbstractInputBasePlugin";

let singleName="WFDCT_DropDownSelect";

function CustomizePlugin() {
    AbstractInputBasePlugin.call(this, singleName);
};

ClassUtility.inheritPrototype(CustomizePlugin, AbstractInputBasePlugin);

let WFDCT_DropDownSelectPlugin=new CustomizePlugin();
GeneralPlugin.registeredPlugin(singleName, WFDCT_DropDownSelectPlugin);
export { WFDCT_DropDownSelectPlugin as default };