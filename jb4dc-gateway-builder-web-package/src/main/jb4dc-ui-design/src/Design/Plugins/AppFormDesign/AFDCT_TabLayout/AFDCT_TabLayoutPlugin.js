import GeneralPlugin from "../../GeneralPlugin";

let AFDCT_TabLayoutPlugin={
    singleName:"AFDCT_TabLayout",
    config:GeneralPlugin.configProp,
    getElem(){
        let newControl=GeneralPlugin.newControlInstance(AFDCT_TabLayoutPlugin);
        let html=`<div class="uid-tab-layout-wrap-runtime" group="${this.config.group}" singlename="${this.singleName}" design-control-instance-name="${newControl.name}" id="${newControl.name}">
            <ul>
                <li><a href="#${newControl.name}-base">基础信息</a></li>
                <li><a href="#${newControl.name}-extend">扩展信息</a></li>
                <li><a href="#${newControl.name}-files">相关附件</a></li>
            </ul>
            <div id="${newControl.name}-base" class="uid-tab-panel-outer-wrap-runtime">
                <div>
                </div>
            </div>
            <div id="${newControl.name}-extend" class="uid-tab-panel-outer-wrap-runtime">
                <div>
                </div>
            </div>
            <div id="${newControl.name}-files" class="uid-tab-panel-outer-wrap-runtime">
                <div>
                </div>
            </div>
        </div>`;
        return $(html);
    },
    registeredEvent($elem){
        $( "#"+$elem.attr("id") ).tabs();
    },
    dropControlToContainer(pluginInstance,$dropToTarget,$dropToLayout){
        let $elem=pluginInstance.getElem();
        console.log($elem);
        $dropToTarget.append($elem);
        if(typeof(pluginInstance.registeredEvent)=="function"){
            pluginInstance.registeredEvent($elem);
        }
    }
}

GeneralPlugin.registeredPlugin(AFDCT_TabLayoutPlugin.singleName,AFDCT_TabLayoutPlugin);

export { AFDCT_TabLayoutPlugin as default};