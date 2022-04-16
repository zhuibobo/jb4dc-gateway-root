import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractInputBasePlugin from "../../AbstractInputBasePlugin";

let singleName="WLDCT_Search_TextDateTime";

function CustomizePlugin() {
    AbstractInputBasePlugin.call(this, singleName);
};

ClassUtility.inheritPrototype(CustomizePlugin, AbstractInputBasePlugin);

let WLDCT_Search_TextDateTime=new CustomizePlugin();
GeneralPlugin.registeredPlugin(singleName, WLDCT_Search_TextDateTime);
export { WLDCT_Search_TextDateTime as default };