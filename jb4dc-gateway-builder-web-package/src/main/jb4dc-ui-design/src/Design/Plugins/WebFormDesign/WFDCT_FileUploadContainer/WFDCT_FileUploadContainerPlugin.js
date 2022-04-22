import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractInputBasePlugin from "../../AbstractInputBasePlugin";

let singleName="WFDCT_FileUploadContainer";

function CustomizePlugin() {
    AbstractInputBasePlugin.call(this, singleName);
};

ClassUtility.inheritPrototype(CustomizePlugin, AbstractInputBasePlugin);

let WFDCT_FileUploadContainerPlugin=new CustomizePlugin();
GeneralPlugin.registeredPlugin(singleName, WFDCT_FileUploadContainerPlugin);
export { WFDCT_FileUploadContainerPlugin as default };