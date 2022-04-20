import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractTableLayoutBasePlugin from "../../AbstractTableLayoutBasePlugin";

let innerHTML = `<div class="uid-wldct-list-table-inner-button-container-wrap">
                                                <div class="uid-wldct-table-container-inner-wrap uid-wldct-list-table-inner-button-inner-wrap">
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
                                            </div>`;
let singleName="WLDCT_ListTableInnerButtonContainer";

function CustomizePlugin() {
    AbstractTableLayoutBasePlugin.call(this, singleName, innerHTML);
};

ClassUtility.inheritPrototype(CustomizePlugin, AbstractTableLayoutBasePlugin);

let WLDCT_ListTableInnerButtonContainerPlugin=new CustomizePlugin();
GeneralPlugin.registeredPlugin(singleName, WLDCT_ListTableInnerButtonContainerPlugin);
export { WLDCT_ListTableInnerButtonContainerPlugin as default };