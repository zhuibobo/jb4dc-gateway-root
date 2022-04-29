import GeneralPlugin from "./GeneralPlugin";
import JsonUtility from "../../Utility/JsonUtility";

function AbstractContainerPlugin(singleName,innerHTML,constructionElemExAttrs) {
    this.singleName = singleName;
    this.config = GeneralPlugin.configProp;
    this._$elem = null;
    this.id = null;
    this.props = JsonUtility.CloneStringify(GeneralPlugin.defaultProps);
    this.settings = JsonUtility.CloneStringify(GeneralPlugin.settings);
    this.innerHTML=innerHTML;
    this.constructionElemExAttrs={};
    if(constructionElemExAttrs){
        this.constructionElemExAttrs=constructionElemExAttrs;
    }
}
AbstractContainerPlugin.prototype.buildInstanceObj = function (instanceId) {
    return GeneralPlugin.newControlInstance(this, instanceId);
}
AbstractContainerPlugin.prototype.constructionElem = function () {
    this._$elem = $(this.innerHTML);
    GeneralPlugin.serializePropsToElemForNewControl(this._$elem, this.config, {
        designControlInstanceName: this.id,
        id: this.id
    });
    return this._$elem;
}
AbstractContainerPlugin.prototype.setElem = function ($elem) {
    this._$elem = $elem;
}
AbstractContainerPlugin.prototype.registeredEvent = function ($elem) {
    GeneralPlugin.registeredGeneralEvent(this._$elem, this);
}
AbstractContainerPlugin.prototype.resetWysiwygElemProps = function ($elem, props) {
    GeneralPlugin.serializePropsToElem(this._$elem, props, this.config, GeneralPlugin.buildInputControlGeneralText(this.config, props));
}
AbstractContainerPlugin.prototype.getContextMenu = GeneralPlugin.getGeneralContextMenu

export {AbstractContainerPlugin as default};