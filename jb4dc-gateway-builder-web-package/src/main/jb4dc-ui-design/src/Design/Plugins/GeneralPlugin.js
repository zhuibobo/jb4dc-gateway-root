
let GeneralPlugin={
    _controlInstances:{},
    _wysiwygComponent:null,
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

    clearControlEditInnerPanel(){
        $(".control-edit-inner-panel").remove();
        console.log("1");
    },
    createControlEditInnerPanel($elem){
        this.clearControlEditInnerPanel();
        let pluginInnerPanel = $('<div></div>');
        pluginInnerPanel.addClass("control-edit-inner-panel");
        $(document.body).append(pluginInnerPanel);
        pluginInnerPanel.position({
            my: "left top",
            at: "left+2 bottom+4",
            of: $elem
        });


        let selectAllButton = $('<div></div>');
        selectAllButton.addClass(["button","select-img"]);
        //selectAllButton.addClass("select-img");
        selectAllButton.attr( 'title', '选中' );
        pluginInnerPanel.append(selectAllButton);
        selectAllButton.on('click', function (ev) {
            alert("暂不支持!");
            //The DOM event object is passed by the 'data' property.
            let domEvent = ev.data;
            //Prevent the click to chave any effect in the element.
            domEvent.preventDefault();
            domEvent.stopPropagation();
        });

        let delButton = $('<div></div>');
        delButton.addClass("button");
        delButton.addClass("del-img");
        delButton.attr( 'title', '删除' );
        pluginInnerPanel.append(delButton);
        delButton.on('click', function (ev) {
            elem.remove();
            //The DOM event object is passed by the 'data' property.
            let domEvent = ev.data;
            //Prevent the click to chave any effect in the element.
            domEvent.preventDefault();
            domEvent.stopPropagation();
        });

        let copyIdButton = $('<div></div>');
        copyIdButton.addClass("button");
        copyIdButton.addClass("copy-id-img");
        copyIdButton.attr( 'title', '复制ID' );
        //copyIdButton.setAttribute( 'data-clipboard-text', "123");
        pluginInnerPanel.append(copyIdButton);
        copyIdButton.on('click', function (ev) {
            let id=elem.getAttribute("id");
            BaseUtility.CopyValueClipboard(id);
            //alert(elem.getAttribute("id"));
            //The DOM event object is passed by the 'data' property.
            let domEvent = ev.data;
            //Prevent the click to chave any effect in the element.
            domEvent.preventDefault();
            domEvent.stopPropagation();
        });
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
    },
    defaultProps:{
        bindToField:{
            relationId:"",
            tableId: "",
            tableName: "",
            tableCaption: "",
            fieldName: "",
            fieldCaption: "",
            fieldDataType: "",
            fieldLength:""
        },
        defaultValue:{
            defaultType: "",
            defaultValue: "",
            defaultText: ""
        },
        validateRules:{
            msg:"",
            rules:[]
        },
        baseInfo:{
            id:"",
            serialize:"true",
            name:"",
            className:"",
            placeholder:"",
            custReadonly:"noreadonly",
            custDisabled:"nodisabled",
            style:"",
            desc:"",
            status:"enable",
            groupName:""
        },
        bindToSearchField:{
            columnTitle:"",
            columnTableName: "",
            columnName: "",
            columnCaption: "",
            columnDataTypeName: "",
            columnOperator: "匹配"
        },
        normalDataSource:{
            defaultIsNull:"true",
            sqlDataSource:"",
            dictionaryGroupDataSourceId:"",
            dictionaryGroupDataSourceText:"",
            restDataSource:"",
            interfaceDataSource:"",
            staticDataSource:"",
            defaultSelected:"",
            layoutDirection:"vertical",
            rowNum:"0",
            displayValueInText:"false"
        },
        multilevelProps:{
            level2BindControlId:""
        }
    },
    setWysiwygComponent(wysiwygComponent) {
        this._wysiwygComponent=wysiwygComponent;
    },
    showPluginPropEditDialog(pluginPropEditVueName){
        this._wysiwygComponent.showPluginPropEditDialog(pluginPropEditVueName);
    }
}

export { GeneralPlugin as default};