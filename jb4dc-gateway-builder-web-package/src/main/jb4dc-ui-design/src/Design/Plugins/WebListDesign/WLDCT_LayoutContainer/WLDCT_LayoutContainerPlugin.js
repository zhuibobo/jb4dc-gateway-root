import GeneralPlugin from "../../GeneralPlugin";

let WLDCT_LayoutContainerPlugin={
    singleName:"WLDCT_LayoutContainer",
    config:GeneralPlugin.configProp,
    _$elem:null,
    id:null,
    props:JsonUtility.CloneStringify(GeneralPlugin.defaultProps),
    buildInstanceObj(instanceId){
        return GeneralPlugin.newControlInstance(this,instanceId);
    },
    constructionElem(){
        this._$elem=$(`<div class="uid-wldct-layout-container"></div>`);
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
        GeneralPlugin.registeredGeneralEvent(this._$elem,this);
    },
    dropControlToContainer(plugin,$dropToTarget,$dropToLayout){}
}

GeneralPlugin.registeredPlugin(WLDCT_LayoutContainerPlugin.singleName,WLDCT_LayoutContainerPlugin);

export { WLDCT_LayoutContainerPlugin as default};