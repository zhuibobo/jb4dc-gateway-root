import GeneralPlugin from "./GeneralPlugin";
import constructionGeneralInputElem from "./GeneralPlugin";

function AbstractInputBasePlugin(singleName,constructionElemExAttrs) {
    this.singleName = singleName;
    this.config = GeneralPlugin.configProp;
    this._$elem = null;
    this.id = null;
    this.props = JsonUtility.CloneStringify(GeneralPlugin.defaultProps);
    this.settings = JsonUtility.CloneStringify(GeneralPlugin.settings);
    this.constructionElemExAttrs={};
    if(constructionElemExAttrs){
        this.constructionElemExAttrs=constructionElemExAttrs;
    }
}
AbstractInputBasePlugin.prototype.buildInstanceObj = function (instanceId) {
    return GeneralPlugin.newControlInstance(this, instanceId);
}
AbstractInputBasePlugin.prototype.constructionElem = function () {
    return GeneralPlugin.constructionGeneralInputElem(this,this.constructionElemExAttrs);
}
AbstractInputBasePlugin.prototype.setElem = function ($elem) {
    this._$elem = $elem;
}
AbstractInputBasePlugin.prototype.registeredEvent = function ($elem) {
    GeneralPlugin.registeredGeneralEvent(this._$elem, this);
}
AbstractInputBasePlugin.prototype.resetWysiwygElemProps = function ($elem, props) {
    GeneralPlugin.serializePropsToElem(this._$elem, props, this.config, GeneralPlugin.buildInputControlGeneralText(this.config, props));
}
AbstractInputBasePlugin.prototype.getContextMenu = GeneralPlugin.getGeneralContextMenu

export {AbstractInputBasePlugin as default};