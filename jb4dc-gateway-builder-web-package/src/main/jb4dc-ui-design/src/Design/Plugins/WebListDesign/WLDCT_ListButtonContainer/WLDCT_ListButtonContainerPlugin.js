import GeneralPlugin from "../../GeneralPlugin";

let WLDCT_ListButtonContainerPlugin = {
    singleName: "WLDCT_ListButtonContainer",
    config: GeneralPlugin.configProp,
    _$elem: null,
    id: null,
    props: JsonUtility.CloneStringify(GeneralPlugin.defaultProps),
    buildInstanceObj(instanceId) {
        return GeneralPlugin.newControlInstance(this, instanceId);
    },
    constructionElem() {
        this._$elem = $(`<div class="uid-wldct-container-wrap uid-wldct-list-button-container-wrap">
                             <table is-op-button-wrap-table="true">
                                <colgroup>
                                    <col style="width: 10%" />
                                    <col style="width: 10%" />
                                    <col style="width: 10%" />
                                    <col style="width: 10%" />
                                    <col style="width: 10%" />
                                    <col style="width: 10%" />
                                    <col style="width: 10%" />
                                    <col style="width: 10%" />
                                </colgroup>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
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

GeneralPlugin.registeredPlugin(WLDCT_ListButtonContainerPlugin.singleName, WLDCT_ListButtonContainerPlugin);

export {WLDCT_ListButtonContainerPlugin as default};