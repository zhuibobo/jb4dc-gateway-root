import GeneralPlugin from "../../GeneralPlugin";

let AFDCT_TabLayoutPlugin={
    singleName:"AFDCT_TabLayout",
    config:GeneralPlugin.configProp,
    _$elem:null,
    id:null,
    props:JsonUtility.CloneStringify(GeneralPlugin.defaultProps),
    buildInstanceObj(instanceId){
        return GeneralPlugin.newControlInstance(this,instanceId);
    },
    constructionElem(){
        this._$elem=$(`<div jbuild4dc_custom="true" class="uid-afdct-tab-layout-wrap">
                        <ul>
                            <li><a href="#${this.id}-base">基础信息</a></li>
                            <li><a href="#${this.id}-extend">扩展信息</a></li>
                            <li><a href="#${this.id}-files">相关附件</a></li>
                        </ul>
                        <div id="${this.id}-base" class="uid-afdct-tab-panel-outer-wrap">
                            <div>
                            </div>
                        </div>
                        <div id="${this.id}-extend" class="uid-afdct-tab-panel-outer-wrap">
                            <div>
                            </div>
                        </div>
                        <div id="${this.id}-files" class="uid-afdct-tab-panel-outer-wrap">
                            <div>
                            </div>
                        </div>
                    </div>`);
        GeneralPlugin.serializePropsToElemForNewControl(this._$elem,this.config,{
            designControlInstanceName:this.id,
            id:this.id
        });
        return this._$elem;
    },
    setElem($elem){
        this._$elem=$elem;
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