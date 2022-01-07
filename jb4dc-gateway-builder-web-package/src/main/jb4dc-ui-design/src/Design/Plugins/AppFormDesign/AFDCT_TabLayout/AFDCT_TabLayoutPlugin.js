import GeneralPlugin from "../../GeneralPlugin";

let AFDCT_TabLayoutPlugin={
    singleName:"AFDCT_TabLayout",
    config:GeneralPlugin.configProp,
    _$elem:null,
    id:null,
    buildInstanceObj(instanceId){
        return GeneralPlugin.newControlInstance(this,instanceId);
    },
    constructionElem(){
        this._$elem=$(`<div class="uid-tab-layout-wrap-runtime" group="${this.config.group}" singlename="${this.singleName}" design-control-instance-name="${this.id}" id="${this.id}">
                        <ul>
                            <li><a href="#${this.id}-base">基础信息</a></li>
                            <li><a href="#${this.id}-extend">扩展信息</a></li>
                            <li><a href="#${this.id}-files">相关附件</a></li>
                        </ul>
                        <div id="${this.id}-base" class="uid-tab-panel-outer-wrap-runtime">
                            <div>
                            </div>
                        </div>
                        <div id="${this.id}-extend" class="uid-tab-panel-outer-wrap-runtime">
                            <div>
                            </div>
                        </div>
                        <div id="${this.id}-files" class="uid-tab-panel-outer-wrap-runtime">
                            <div>
                            </div>
                        </div>
                    </div>`);
        return this._$elem;
    },
    registeredEvent($elem){
        $( "#"+$elem.attr("id") ).tabs();
    },
    dropControlToContainer(plugin,$dropToTarget,$dropToLayout){
        let controlInstance=plugin.buildInstanceObj(GeneralPlugin.newControlInstanceId(plugin.singleName)).instance;
        let $elem=controlInstance.constructionElem();
        console.log($elem);
        $dropToTarget.append($elem);
        if(typeof(controlInstance.registeredEvent)=="function"){
            controlInstance.registeredEvent($elem);
        }
    }
}

GeneralPlugin.registeredPlugin(AFDCT_TabLayoutPlugin.singleName,AFDCT_TabLayoutPlugin);

export { AFDCT_TabLayoutPlugin as default};