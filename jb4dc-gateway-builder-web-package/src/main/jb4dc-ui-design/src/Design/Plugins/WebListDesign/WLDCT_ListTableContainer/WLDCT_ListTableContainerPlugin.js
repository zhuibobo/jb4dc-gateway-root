import GeneralPlugin from "../../GeneralPlugin";
import WLDCT_ListTableInnerButtonContainerPlugin from "../WLDCT_ListTableInnerButtonContainer/WLDCT_ListTableInnerButtonContainerPlugin";
import JsonUtility from "../../../../Utility/JsonUtility";

let innerHTML = `<div class="uid-wldct-list-table-container-wrap">
                    <div class="uid-container-inner-wrap">
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
                                            
                                         </td>
                                     </tr>
                                 </tbody>
                             </table>
                    </div>
                 </div>`;

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

        //debugger;
        let listTableInnerButtonContainerInstance = WLDCT_ListTableInnerButtonContainerPlugin.buildInstanceObj(GeneralPlugin.newControlInstanceId(WLDCT_ListTableInnerButtonContainerPlugin.singleName)).instance;
        let $listTableInnerButtonContainerInstanceElem = listTableInnerButtonContainerInstance.constructionElem();

        this._$elem.find(".op-button-container-outer-td").append($listTableInnerButtonContainerInstanceElem);

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