
let GeneralPlugin={
    _pluginObjects:{},
    dropControlToContainer(pluginInstance,$dropToObject){
        //let dropToObjectId=$dropToObject.attr("id");
        //console.log(dragSourceSingleName);
        //console.log($dropToObject);
        //console.log(dropToObjectId);
        //let pluginInstance=this.getPluginInstanceName(dragSourceSingleName);
        let html=pluginInstance.getTemplate();
        console.log(html);
        $dropToObject.append(html);
    },
    registeredPlugin(instanceName,plugin){
        this._pluginObjects[instanceName]=plugin;
    },
    getPluginInstanceName(instanceName){
        return this._pluginObjects[instanceName];
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