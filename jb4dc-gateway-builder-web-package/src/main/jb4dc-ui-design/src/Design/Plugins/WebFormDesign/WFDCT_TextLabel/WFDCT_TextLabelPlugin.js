import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractInputBasePlugin from "../../AbstractInputBasePlugin";

let singleName="WFDCT_TextLabel";

function CustomizePlugin() {
    AbstractInputBasePlugin.call(this, singleName, {
        contenteditable:"true"
    });
};

ClassUtility.inheritPrototype(CustomizePlugin, AbstractInputBasePlugin);

let WFDCT_TextLabelPlugin=new CustomizePlugin();
GeneralPlugin.registeredPlugin(singleName, WFDCT_TextLabelPlugin);
export { WFDCT_TextLabelPlugin as default };