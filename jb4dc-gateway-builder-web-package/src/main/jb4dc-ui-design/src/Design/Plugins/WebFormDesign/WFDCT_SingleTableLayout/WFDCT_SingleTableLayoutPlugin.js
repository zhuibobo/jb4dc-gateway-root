import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractTableLayoutBasePlugin from "../../AbstractTableLayoutBasePlugin";
import TableEditor from "../../../ExComponent/TableEditor/TableEditor";
import StorageUtility from "../../../Utility/StorageUtility";
import DialogUtility from "../../../../Utility/DialogUtility";
import RemoteRestInterface from "../../../Remote/RemoteRestInterface";

let innerHTML = `<div class="uid-wfdct-layout-single-table-layout-wrap">
                    <div class="uid-container-inner-wrap">
                        <table contenteditable="true">
                            <colgroup><col style="width: 8%" /><col style="width: 15%" /><col style="width: 8%"><col style="width: 15%"><col style="width: 8%"><col style="width: 16%"></colgroup>
                            <tr><td colspan="6" style="font-size: 30px">表单标题</td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        </table>
                    </div>
                 </div>`;
let singleName="WFDCT_SingleTableLayout";

function CustomizePlugin() {
    AbstractTableLayoutBasePlugin.call(this, singleName, innerHTML);
};

ClassUtility.inheritPrototype(CustomizePlugin, AbstractTableLayoutBasePlugin);

CustomizePlugin.prototype.getContextMenu = function (sender, $elem){
    let generalContextMenu = GeneralPlugin.getGeneralContextMenu(sender, $elem);
    let tableContextMenu = TableEditor.getTableEditorContextMenu(sender, $elem);

    tableContextMenu.AutoLoadMainTableFieldLabel= {
        name: "自动加载主表字段名称",
        icon: function (opt, $itemElement, itemKey, item) {
            return 'context-menu-icon context-menu-icon-edit';
        },
        callback: (key, opt) => {
            //this.autoLoadMainTableFieldLabel(sender, $elem, key, opt);
            //console.log($elem);
            let mainTableId=StorageUtility.getFormDataRelationConfigMainTableId();
            if(mainTableId){
                RemoteRestInterface.getTableFieldsSync({"tableId": mainTableId}).then((response)=>{
                    let result=response.data;
                    let fields=result.data;
                    let tds=$elem.find("td");
                    for (let i = 0; i < fields.length; i++) {
                        let field=fields[i];
                        tds.eq(i+(i+1)).text(field.fieldCaption+"：");
                    }
                    console.log(result);

                });
            }
            else{
                DialogUtility.AlertText("请先设置关联主表!");
            }
        }
    }
    tableContextMenu.sepTableEditorL2= "---------";
    for (const generalContextMenuKey in generalContextMenu) {
        tableContextMenu[generalContextMenuKey] = generalContextMenu[generalContextMenuKey];
    }

    return tableContextMenu;
}

let WFDCT_SingleTableLayoutPlugin=new CustomizePlugin();
GeneralPlugin.registeredPlugin(singleName, WFDCT_SingleTableLayoutPlugin);
export { WFDCT_SingleTableLayoutPlugin as default };