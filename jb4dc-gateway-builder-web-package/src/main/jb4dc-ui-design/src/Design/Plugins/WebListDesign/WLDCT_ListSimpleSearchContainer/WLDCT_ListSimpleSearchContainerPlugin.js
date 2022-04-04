import GeneralPlugin from "../../GeneralPlugin";

let innerHTML = `<div class="uid-wldct-container-wrap uid-wldct-list-simple-search-container-wrap">
                            <table contenteditable="true">
                                <colgroup>
                                   <col style="width: 8%" />
                                   <col style="width: 17%" />
                                   <col style="width: 8%" />
                                   <col style="width: 17%" />
                                   <col style="width: 8%" />
                                   <col style="width: 17%" />
                                   <col style="width: 8%" />
                                   <col style="width: 17%" />
                               </colgroup>
                               <tr>
                                   <td class="label">名称:</td>
                                   <td></td>
                                   <td class="label">标题:</td>
                                   <td></td>
                                   <td class="label">时间(从):</td>
                                   <td></td>
                                   <td class="label">(到):</td>
                                   <td></td>
                               </tr>
                            </table></div>`

let WLDCT_ListSimpleSearchContainerPlugin = {
    singleName: "WLDCT_ListSimpleSearchContainer",
    config: GeneralPlugin.configProp,
    _$elem: null,
    id: null,
    props: JsonUtility.CloneStringify(GeneralPlugin.defaultProps),
    settings: JsonUtility.CloneStringify(GeneralPlugin.settings),
    buildInstanceObj(instanceId) {
        this.props._$elem
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
        GeneralPlugin.registeredRedipsInit(this._$elem, this);
        GeneralPlugin.registeredGeneralEvent(this._$elem, this);
    },
    resetWysiwygElemProps($elem, props) {
        GeneralPlugin.serializePropsToElem(this._$elem, props, this.config, "");
    },
    dropControlToContainer(dragPlugin, $dropToTarget, $dropToLayout) {
        GeneralPlugin.dropControlToTableContainer(this, dragPlugin, $dropToTarget, $dropToLayout);
    },
    getContextMenu: GeneralPlugin.getTableEditorContextMenu
}

GeneralPlugin.registeredPlugin(WLDCT_ListSimpleSearchContainerPlugin.singleName, WLDCT_ListSimpleSearchContainerPlugin);

export {WLDCT_ListSimpleSearchContainerPlugin as default};