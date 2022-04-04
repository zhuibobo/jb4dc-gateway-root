import GeneralPlugin from "../../GeneralPlugin";

let innerHTML = `<div class="uid-wldct-container-wrap uid-wldct-list-table-container-wrap">
                             <table class="list-table" contenteditable="true">
                                 <colgroup>
                                    <col style="width: 8%" />
                                    <col style="width: 68%" />
                                    <col style="width: 8%" />
                                    <col style="width: 8%" />
                                    <col style="width: 8%" />
                                 </colgroup>
                                 <thead>
                                     <tr>
                                         <th>编号</th>
                                         <th>标题</th>
                                         <th>状态</th>
                                         <th>更新时间</th>
                                         <th>操作</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     <tr>
                                         <td></td>
                                         <td></td>
                                         <td></td>
                                         <td></td>
                                         <td class="op-button-container-outer-td">
                                            <div class="uid-wldct-list-table-inner-button-container-wrap">
                                                <div class="uid-wldct-container-wrap uid-wldct-list-table-inner-button-inner-wrap">
                                                    <table is-inner-op-button-wrap-table="true">
                                                        <colgroup>
                                                            <col style="width: 33%" />
                                                            <col style="width: 33%" />
                                                            <col style="width: 33%" />
                                                        </colgroup>
                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                         </td>
                                     </tr>
                                 </tbody>
                             </table></div>`;

let WLDCT_ListTableContainerPlugin = {
    singleName: "WLDCT_ListTableContainer",
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

GeneralPlugin.registeredPlugin(WLDCT_ListTableContainerPlugin.singleName, WLDCT_ListTableContainerPlugin);

export {WLDCT_ListTableContainerPlugin as default};