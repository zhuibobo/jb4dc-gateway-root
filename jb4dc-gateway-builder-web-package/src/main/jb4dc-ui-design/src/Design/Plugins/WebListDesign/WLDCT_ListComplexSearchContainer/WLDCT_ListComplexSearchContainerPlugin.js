import GeneralPlugin from "../../GeneralPlugin";

let WLDCT_ListComplexSearchContainerPlugin = {
    singleName: "WLDCT_ListComplexSearchContainer",
    config: GeneralPlugin.configProp,
    _$elem: null,
    id: null,
    props: JsonUtility.CloneStringify(GeneralPlugin.defaultProps),
    buildInstanceObj(instanceId) {
        return GeneralPlugin.newControlInstance(this, instanceId);
    },
    constructionElem() {
        this._$elem = $(`<div class="uid-wldct-container-wrap uid-wldct-list-complex-search-container-wrap">
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
                            </table></div>`);
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
    resetWysiwygElemProps($elem, props) {
        GeneralPlugin.serializePropsToElem(this._$elem, props, this.config, "");
    },
    dropControlToContainer(plugin, $dropToTarget, $dropToLayout) {
        let controlInstance = plugin.buildInstanceObj(GeneralPlugin.newControlInstanceId(plugin.singleName)).instance;
        let $elem = controlInstance.constructionElem();
        console.log($elem);
        $dropToTarget.append($elem);
        if (typeof (controlInstance.registeredEvent) == "function") {
            controlInstance.registeredEvent($elem);
        }
        GeneralPlugin.registeredRedipsInit($dropToLayout, this);
        /*let rd = REDIPS.drag;
        rd.init($dropToLayout.attr("id"));
        REDIPS.drag.enableDrag('init');*/
    },
    getContextMenu: GeneralPlugin.getTableEditorContextMenu
}

GeneralPlugin.registeredPlugin(WLDCT_ListComplexSearchContainerPlugin.singleName, WLDCT_ListComplexSearchContainerPlugin);

export {WLDCT_ListComplexSearchContainerPlugin as default};