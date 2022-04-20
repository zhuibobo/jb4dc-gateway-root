import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractTableLayoutBasePlugin from "../../AbstractTableLayoutBasePlugin";

let tempId= new Date().getTime();

let innerHTML = `<div jbuild4dc_custom="true" class="uid-layout-container-wrap uid-layout-tab-layout-wrap">
                        <ul>
                            <li><a href="#${tempId}-base">基础信息</a></li>
                            <li><a href="#${tempId}-extend">扩展信息</a></li>
                            <li><a href="#${tempId}-files">相关附件</a></li>
                        </ul>
                        <div id="${tempId}-base" class="uid-layout-tab-panel-outer-wrap">
                            <div>
                            </div>
                        </div>
                        <div id="${tempId}-extend" class="uid-layout-tab-panel-outer-wrap">
                            <div>
                            </div>
                        </div>
                        <div id="${tempId}-files" class="uid-layout-tab-panel-outer-wrap">
                            <div>
                            </div>
                        </div>
                    </div>`;
let singleName="WFDCT_TabLayout";

function CustomizePlugin() {
    AbstractTableLayoutBasePlugin.call(this, singleName, innerHTML);
};

ClassUtility.inheritPrototype(CustomizePlugin, AbstractTableLayoutBasePlugin);

CustomizePlugin.prototype.registeredEvent=function ($elem){
    $( "#"+$elem.attr("id") ).tabs();
}

let WFDCT_TabLayoutPlugin=new CustomizePlugin();

GeneralPlugin.registeredPlugin(singleName, WFDCT_TabLayoutPlugin);
export { WFDCT_TabLayoutPlugin as default };