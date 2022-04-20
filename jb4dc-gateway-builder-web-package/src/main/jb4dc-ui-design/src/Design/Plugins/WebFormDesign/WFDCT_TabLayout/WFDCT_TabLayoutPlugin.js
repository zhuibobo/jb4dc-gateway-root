import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractTableLayoutBasePlugin from "../../AbstractTableLayoutBasePlugin";

let innerHTML = `<div class="uid-wldct-table-container-wrap uid-wldct-list-simple-search-container-wrap">
                    <div class="uid-wldct-table-container-inner-wrap uid-wldct-list-simple-search-container-inner-wrap">
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
                            </table></div></div>`;
let singleName="WLDCT_ListSimpleSearchContainer";

function CustomizePlugin() {
    AbstractTableLayoutBasePlugin.call(this, singleName, innerHTML);
};

ClassUtility.inheritPrototype(CustomizePlugin, AbstractTableLayoutBasePlugin);

let WLDCT_ListSimpleSearchContainer=new CustomizePlugin();
GeneralPlugin.registeredPlugin(singleName, WLDCT_ListSimpleSearchContainer);
export { WLDCT_ListSimpleSearchContainer as default };