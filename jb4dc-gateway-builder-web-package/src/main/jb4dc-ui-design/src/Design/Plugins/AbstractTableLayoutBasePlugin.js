import GeneralPlugin from "./GeneralPlugin";

function AbstractTableLayoutBasePlugin(singleName, innerHTML) {
    this.singleName = singleName;
    this.config = GeneralPlugin.configProp;
    this._$elem = null;
    this.id = null;
    this.props = JsonUtility.CloneStringify(GeneralPlugin.defaultProps);
    this.settings = JsonUtility.CloneStringify(GeneralPlugin.settings);
    this.innerHTML=innerHTML;
}
AbstractTableLayoutBasePlugin.prototype.buildInstanceObj = function (instanceId) {
    return GeneralPlugin.newControlInstance(this, instanceId);
}
AbstractTableLayoutBasePlugin.prototype.constructionElem = function () {
    this._$elem = $(this.innerHTML);
    GeneralPlugin.serializePropsToElemForNewControl(this._$elem, this.config, {
        designControlInstanceName: this.id,
        id: this.id
    });
    return this._$elem;
}
AbstractTableLayoutBasePlugin.prototype.setElem = function ($elem) {
    this._$elem = $elem;
}
AbstractTableLayoutBasePlugin.prototype.registeredEvent = function ($elem) {
    GeneralPlugin.registeredRedipsInit(this._$elem, this);
    GeneralPlugin.registeredGeneralEvent(this._$elem, this);
}
AbstractTableLayoutBasePlugin.prototype.resetWysiwygElemProps = function ($elem, props) {
    GeneralPlugin.serializePropsToElem(this._$elem, props, this.config, "");
}
AbstractTableLayoutBasePlugin.prototype.dropControlToContainer = function (dragPlugin, $dropToTarget, $dropToLayout) {
    GeneralPlugin.dropControlToTableContainer(this, dragPlugin, $dropToTarget, $dropToLayout);
}
AbstractTableLayoutBasePlugin.prototype.getContextMenu = GeneralPlugin.getTableEditorContextMenu

export {AbstractTableLayoutBasePlugin as default};