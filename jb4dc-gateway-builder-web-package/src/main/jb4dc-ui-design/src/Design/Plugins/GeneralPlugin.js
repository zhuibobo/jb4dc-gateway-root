
let GeneralPlugin={
    _controlInstances:{},
    dropControlToContainer(pluginInstance,$dropToTarget,$dropToLayout){
        //let dropToObjectId=$dropToObject.attr("id");
        //console.log(dragSourceSingleName);
        //console.log($dropToObject);
        //console.log(dropToObjectId);
        //let pluginInstance=this.getPluginInstanceName(dragSourceSingleName);
        //debugger;
        let $elem=pluginInstance.getElem();
        console.log($elem);
        $dropToTarget.append($elem);
        if(typeof(pluginInstance.registeredEvent)=="function"){
            pluginInstance.registeredEvent($elem);
        }
    },
    newControlInstance(plugin){
        let newControlInstance=Object.create(plugin);
        let newControlInstanceName=plugin.singleName+"_"+StringUtility.Timestamp();
        GeneralPlugin.registeredControl(newControlInstanceName,newControlInstance);
        return {
            name:newControlInstanceName,
            instance:newControlInstance
        }
    },
    registeredPlugin(pluginName,plugin){
        this._controlInstances[pluginName]=plugin;
    },
    registeredControl(controlInstanceName,controlInstance){
        this._controlInstances[controlInstanceName]=controlInstance;
    },
    getControlInstances(instanceName){
        return this._controlInstances[instanceName];
    },
    configProp:{
        "group": "",
        "singleName": "",
        "text": "",
        "class": "",
        "dragTo": "",
        "serverResolve": "",
        "clientResolve": "",
        "clientResolveJs": "",
        "enableChildControls": "",
        "dialogWidth": "",
        "dialogHeight":"",
        "isJBuild4DCData":"",
        "controlCategory":"",
        "serverDynamicBind":"",
        "showRemoveButton":"",
        "showInEditorToolbar":""
    }
}

export { GeneralPlugin as default};