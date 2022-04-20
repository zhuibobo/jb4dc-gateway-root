import GeneralPlugin from "../../GeneralPlugin";

let innerHTML = `<div class="uid-wldct-table-container-wrap uid-wldct-hide-container-wrap">
                    <div class="uid-wldct-table-container-inner-wrap uid-wldct-hide-container-inner-wrap">
                        <table contenteditable="true">
                            <colgroup><col style="width: 8%" /><col style="width: 15%" /><col style="width: 8%"><col style="width: 15%"><col style="width: 8%"><col style="width: 16%"></colgroup>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        </table>
                    </div>
                 </div>`;

let WLDCT_HideContainerPlugin = {
    singleName: "WLDCT_HideContainer",
    config: GeneralPlugin.configProp,
    _$elem: null,
    id: null,
    props: JsonUtility.CloneStringify(GeneralPlugin.defaultProps),
    settings: JsonUtility.CloneStringify(GeneralPlugin.settings),
    buildInstanceObj(instanceId) {
        return GeneralPlugin.newControlInstance(this, instanceId);
    },
    constructionElem() {
        this._$elem = $(innerHTML);
        GeneralPlugin.serializePropsToElemForNewControl(this._$elem, this.config, {
            designControlInstanceName: this.id,
            id: this.id
        });
        return this._$elem;
    },
    setElem($elem) {
        this._$elem = $elem;
    },
    registeredEvent($elem) {
        /*let rd = REDIPS.drag;
        rd.init(this._$elem.attr("id"));*/
        GeneralPlugin.registeredRedipsInit(this._$elem, this);
        GeneralPlugin.registeredGeneralEvent(this._$elem, this);
    },
    dropControlToContainer(dragPlugin, $dropToTarget, $dropToLayout) {
        GeneralPlugin.dropControlToTableContainer(this, dragPlugin, $dropToTarget, $dropToLayout);
    },
    getContextMenu: GeneralPlugin.getTableEditorContextMenu
}

GeneralPlugin.registeredPlugin(WLDCT_HideContainerPlugin.singleName, WLDCT_HideContainerPlugin);

export {WLDCT_HideContainerPlugin as default};