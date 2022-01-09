import GeneralPlugin from "../../GeneralPlugin";

let WLDCT_ListTableContainerPlugin={
    singleName:"WLDCT_ListTableContainer",
    config:GeneralPlugin.configProp,
    _$elem:null,
    id:null,
    props:JsonUtility.CloneStringify(GeneralPlugin.defaultProps),
    buildInstanceObj(instanceId){
        return GeneralPlugin.newControlInstance(this,instanceId);
    },
    constructionElem() {
        this._$elem = $(`<div class="uid-wldct-container-wrap uid-wldct-list-table-container-wrap">
                             <table class="list-table" contenteditable="true">
                                 <thead>
                                     <tr>
                                         <th></th>
                                         <th></th>
                                         <th></th>
                                         <th></th>
                                         <th></th>
                                         <th></th>
                                         <th></th>
                                         <th></th>
                                         <th>操作</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     <tr>
                                         <td></td>
                                         <td></td>
                                         <td></td>
                                         <td></td>
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
                             </table></div>`);
        GeneralPlugin.serializePropsToElemForNewControl(this._$elem, this.config, {
            designControlInstanceName: this.id,
            id: this.id
        });
        return this._$elem;
    },
    setElem($elem){
        this._$elem=$elem;
    },
    registeredEvent($elem){
        let rd = REDIPS.drag;
        rd.init(this._$elem.attr("id"));
        GeneralPlugin.registeredGeneralEvent(this._$elem,this);
    },
    dropControlToContainer(plugin,$dropToTarget,$dropToLayout){
        let controlInstance=plugin.buildInstanceObj(GeneralPlugin.newControlInstanceId(plugin.singleName)).instance;
        let $elem=controlInstance.constructionElem();
        console.log($elem);
        $dropToTarget.append($elem);
        if(typeof(controlInstance.registeredEvent)=="function"){
            controlInstance.registeredEvent($elem);
        }

        let rd = REDIPS.drag;
        rd.init($dropToLayout.attr("id"));
        REDIPS.drag.enableDrag('init');
    }
}

GeneralPlugin.registeredPlugin(WLDCT_ListTableContainerPlugin.singleName,WLDCT_ListTableContainerPlugin);

export { WLDCT_ListTableContainerPlugin as default};