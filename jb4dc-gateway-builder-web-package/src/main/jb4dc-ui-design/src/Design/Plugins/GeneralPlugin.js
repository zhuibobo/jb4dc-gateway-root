
let GeneralPlugin={
    _controlInstances:{},
    _wysiwygComponent:null,
    _uiDesignMain:null,
    dropControlToContainer(plugin,$dropToTarget,$dropToLayout){
        //let dropToObjectId=$dropToObject.attr("id");
        //console.log(dragSourceSingleName);
        //console.log($dropToObject);
        //console.log(dropToObjectId);
        //let pluginInstance=this.getPluginInstanceName(dragSourceSingleName);
        //debugger;
        let controlInstance=plugin.buildInstanceObj(this.newControlInstanceId(plugin.singleName)).instance;
        let $elem=controlInstance.constructionElem();
        console.log($elem);
        $dropToTarget.append($elem);
        if(typeof(controlInstance.registeredEvent)=="function"){
            controlInstance.registeredEvent($elem);
        }
    },
    newControlInstanceId(singleName){
        let instanceId=singleName+"_"+StringUtility.Timestamp();
        return instanceId;
    },
    newControlInstance(plugin,instanceId){
        let newControlInstance=Object.create(plugin);
        newControlInstance.id=instanceId;
        //let instanceId=plugin.singleName+"_"+StringUtility.Timestamp();

        let instanceObj={
            id:instanceId,
            name:instanceId,
            instance:newControlInstance
        }

        GeneralPlugin.registeredControl(instanceId,instanceObj);
        return instanceObj;
    },
    registeredPlugin(pluginName,plugin){
        let instanceObj={
            id:pluginName,
            name:pluginName,
            instance:plugin
        }
        this._controlInstances[pluginName]=instanceObj;
    },
    registeredControl(newControlInstanceId,controlInstance){
        this._controlInstances[newControlInstanceId]=controlInstance;
    },
    getControlInstanceObj(instanceId){
        return this._controlInstances[instanceId];
    },
    getControlDescriptionElem:function ($elem,config,props){
        //console.log(pluginSetting);
        //console.log(props);
        console.log(props);
        let detailTip="类型:【"+config.text+"】&#10;绑定:【"+props.bindToField.tableCaption+"-"+props.bindToField.fieldCaption+"】";
        if(props.defaultValue) {
            if (props.defaultValue.defaultText) {
                detailTip += "&#10;默认:【" + props.defaultValue.defaultType + ":" + props.defaultValue.defaultText + "】";
            }
        }
        //debugger;
        if(props.validateRules){
            if(props.validateRules.rules){
                if(props.validateRules.rules.length>0) {
                    detailTip += "&#10;验证:【"
                    for (let i = 0; i < props.validateRules.rules.length; i++) {
                        detailTip += props.validateRules.rules[i].validateType + ";";
                    }
                    detailTip = StringUtility.RemoveLastChar(result);
                    detailTip += "】"
                }
            }
        }

        let text=config.text;
        let $descriptionElemWrap=$(`<div runtime_auto_remove="true" class="wysiwyg-auto-remove-tip">${text}<div class="wysiwyg-control-tip las la-question-circle" tip-with-id="${$elem.attr("id")}"></div></div>`);
        //this.regTooltipEvent();
        return $descriptionElemWrap;
    },
    regTooltipEvent() {
        $("[tip-with-id]").hover(function () {
                let id = $(this).attr("tip-with-id");

                let instanceObj=GeneralPlugin.getControlInstance(id);
                //GeneralPlugin.createControlTooltipPanel(instanceObj.)
                console.log("1");
            },
            function () {

            });

        /*.tooltip({
            content: "111",
            position: {
                my: "left top",
                at: "right+5 top-5",
                collision: "none"
            }
        });*/
    },
    constructionGeneralInputElem(controlInstance){
        //let newControl=GeneralPlugin.newControlInstance(plugin);
        let html=`<div singlename="${controlInstance.singleName}" design-control-instance-name="${controlInstance.id}" class="uid-design-input-control redips-drag" contenteditable="false" id="${controlInstance.id}"></div>`;
        let $elem=$(html);
        controlInstance._$elem=$elem;
        //newControl
        let $descriptionElem=this.getControlDescriptionElem($elem,controlInstance.config,this.defaultProps);
        $elem.append($descriptionElem);
        return $elem;
    },
    registeredGeneralEvent($elem,sender){
        $elem.on("click", {}, function (event) {
            GeneralPlugin.createControlEditInnerPanel($(this));
            event.preventDefault();
            event.stopPropagation();
        });
        $elem.on("dblclick",{_this:sender},function (event){
            //alert("1");
            GeneralPlugin.showPluginPropEditDialog(event.data._this,event.data._this.singleName+"Property",$(this))
            event.preventDefault();
            event.stopPropagation();
        });
    },

    clearControlEditInnerPanel(){
        $(".control-edit-inner-panel").remove();
        //console.log("1");
    },
    createControlEditInnerPanel($elem){
        this.clearControlEditInnerPanel();
        //debugger;
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
    createControlTooltipPanel($elem){

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
    showPluginPropEditDialog(controlInstance,pluginPropEditVueName,$elem){
        let props=this.deserializePropsFromElem($elem);
        this._wysiwygComponent.showPluginPropEditDialog(controlInstance,pluginPropEditVueName,$elem,props);
    },
    deserializePropsFromElem($elem){
        let props={};
        //let $elem=$(elem);

        function attrToProp($elem,props,groupName) {
            let groupProp={};
            for(let key in this.defaultProps[groupName]){
                if($elem.attr(key)){
                    groupProp[key]=$elem.attr(key);
                }
                else{
                    groupProp[key]=this.defaultProps[groupName][key];
                }
            }
            props[groupName]=groupProp;
            return props;
        }

        props=attrToProp.call(this,$elem,props,"baseInfo");
        props=attrToProp.call(this,$elem,props,"bindToField");
        props=attrToProp.call(this,$elem,props,"defaultValue");
        props=attrToProp.call(this,$elem,props,"bindToSearchField");
        props=attrToProp.call(this,$elem,props,"normalDataSource");
        props=attrToProp.call(this,$elem,props,"multilevelProps");

        if($elem.attr("validateRules")){
            props.validateRules=JsonUtility.StringToJson(decodeURIComponent($elem.attr("validateRules")));
        }

        return props;
    },
    validateSerializeControlDialogCompletedEnable (returnResult) {
        //debugger;
        if (returnResult.baseInfo.serialize == "true" && returnResult.bindToField.fieldName == "") {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "序列化的控件必须绑定字段!", null);
            return {success: false};
        }
        return returnResult;
    },
    setUIDesignMain(_uiDesignMain){
        this._uiDesignMain=_uiDesignMain;
    },
    selectBindToSingleFieldDialogBeginProxy(oldBindFieldData,caller){
        this._uiDesignMain.selectBindToSingleFieldDialogBegin(oldBindFieldData,caller);
    },
    selectDefaultValueDialogBeginProxy(oldData,caller){
        this._uiDesignMain.selectDefaultValueDialogBegin(oldData,caller);
    },
    selectValidateRuleDialogBeginProxy(oldData,caller){
        this._uiDesignMain.selectValidateRuleDialogBegin(oldData,caller);
    }
}

export { GeneralPlugin as default};