import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractTableLayoutBasePlugin from "../../AbstractTableLayoutBasePlugin";

let innerHTML = `<div class="uid-wfdct-layout-single-table-layout-wrap">
                    <div class="uid-container-inner-wrap">
                        <table contenteditable="true">
                            <colgroup><col style="width: 8%" /><col style="width: 15%" /><col style="width: 8%"><col style="width: 15%"><col style="width: 8%"><col style="width: 16%"></colgroup>
                            <tr><td colspan="6"></td></tr>
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

let WFDCT_SingleTableLayoutPlugin=new CustomizePlugin();
GeneralPlugin.registeredPlugin(singleName, WFDCT_SingleTableLayoutPlugin);
export { WFDCT_SingleTableLayoutPlugin as default };