import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractTableLayoutBasePlugin from "../../AbstractTableLayoutBasePlugin";

let innerHTML = `<div class="uid-wfdct-hide-container-wrap">
                    <div class="uid-container-inner-wrap">
                        <table contenteditable="true">
                            <colgroup><col style="width: 8%" /><col style="width: 15%" /><col style="width: 8%"><col style="width: 15%"><col style="width: 8%"><col style="width: 16%"></colgroup>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        </table>
                    </div>
                 </div>`;
let singleName="WFDCT_HideContainer";

function CustomizePlugin() {
    AbstractTableLayoutBasePlugin.call(this, singleName, innerHTML);
};

ClassUtility.inheritPrototype(CustomizePlugin, AbstractTableLayoutBasePlugin);

let WFDCT_HideContainerPlugin=new CustomizePlugin();
GeneralPlugin.registeredPlugin(singleName, WFDCT_HideContainerPlugin);
export { WFDCT_HideContainerPlugin as default };