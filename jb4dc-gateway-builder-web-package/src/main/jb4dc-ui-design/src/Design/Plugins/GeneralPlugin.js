import TableEditor from "../ExComponent/TableEditor/TableEditor";

let GeneralPlugin = {
    _controlInstances: {},
    _wysiwygComponent: null,
    _uiDesignMain: null,
    _baseInfoBindToDataSetId: null,
    _wysiwygLastSelectedElem: null,
    _prevWysiwygHtml: "",

    dropControlToContainer(plugin, $dropToTarget, $dropToLayout) {
        //let dropToObjectId=$dropToObject.attr("id");
        //console.log(dragSourceSingleName);
        //console.log($dropToObject);
        //console.log(dropToObjectId);
        //let pluginInstance=this.getPluginInstanceName(dragSourceSingleName);
        //debugger;
        let controlInstance = plugin.buildInstanceObj(this.newControlInstanceId(plugin.singleName)).instance;
        let $elem = controlInstance.constructionElem();
        console.log($elem);
        $dropToTarget.append($elem);
        if (typeof (controlInstance.registeredEvent) == "function") {
            controlInstance.registeredEvent($elem);
        }
    },
    newControlInstanceId(singleName, append) {
        let instanceId = singleName + "_" + StringUtility.Timestamp();
        return append ? instanceId + "_" + append : instanceId;
    },
    newControlInstance(plugin, instanceId) {
        let newControlInstance = Object.create(plugin);
        newControlInstance.id = instanceId;
        //let instanceId=plugin.singleName+"_"+StringUtility.Timestamp();

        let instanceObj = {
            id: instanceId,
            name: instanceId,
            instance: newControlInstance
        }

        GeneralPlugin.registeredControl(instanceId, instanceObj);
        return instanceObj;
    },
    registeredPlugin(pluginName, plugin) {
        let instanceObj = {
            id: pluginName,
            name: pluginName,
            instance: plugin
        }
        this._controlInstances[pluginName] = instanceObj;
    },
    registeredControl(newControlInstanceId, controlInstance) {
        this._controlInstances[newControlInstanceId] = controlInstance;
    },
    getControlInstanceObj(instanceId) {
        return this._controlInstances[instanceId];
    },
    getControlDescriptionElem: function (text, $elem, config, props) {
        //console.log(pluginSetting);
        //console.log(props);
        /*console.log(props);
        let detailTip = "类型:【" + config.text + "】&#10;绑定:【" + props.bindToField.tableCaption + "-" + props.bindToField.fieldCaption + "】";
        if (props.defaultValue) {
            if (props.defaultValue.defaultText) {
                detailTip += "&#10;默认:【" + props.defaultValue.defaultType + ":" + props.defaultValue.defaultText + "】";
            }
        }
        //debugger;
        if (props.validateRules) {
            if (props.validateRules.rules) {
                if (props.validateRules.rules.length > 0) {
                    detailTip += "&#10;验证:【"
                    for (let i = 0; i < props.validateRules.rules.length; i++) {
                        detailTip += props.validateRules.rules[i].validateType + ";";
                    }
                    detailTip = StringUtility.RemoveLastChar(result);
                    detailTip += "】"
                }
            }
        }*/
        if (!props) {

        }
        if (!text) {
            text = config.text;
        }
        let $descriptionElemWrap = $(`<div runtime_auto_remove="true" class="wysiwyg-auto-remove-tip"><div name="elem-display-name" class="elem-display-name">${text}</div><div class="wysiwyg-control-tip las la-question-circle" tip-with-instance="${$elem.attr("designControlInstanceName")}"></div></div>`);
        return $descriptionElemWrap;
    },
    regTooltipEvent() {
        $("[tip-with-instance]").hover(function () {
                let instanceId = $(this).attr("tip-with-instance");
                let instanceObj = GeneralPlugin.getControlInstanceObj(instanceId);
                GeneralPlugin.createControlDescriptionPanel($(this), instanceId, instanceObj);
            },
            function () {
                GeneralPlugin.clearControlDescriptionPanel();
            });
        $("[tip-with-instance]").on("click", {}, function (event) {
            event.preventDefault();
            event.stopPropagation();
            $($(this).parent()).trigger("click");
        });
        $("[tip-with-instance]").on("mousedown", {}, function (event) {
            event.preventDefault();
            event.stopPropagation();
        });
    },
    constructionGeneralInputElem(controlInstance, exAttrs) {
        //let newControl=GeneralPlugin.newControlInstance(plugin);
        let classNames = "uid-design-input-control redips-drag";
        if (controlInstance.config.class) {
            classNames += " " + controlInstance.config.class;
        }
        let html = `<div jbuild4dc_custom="true" singlename="${controlInstance.singleName}" designControlInstanceName="${controlInstance.id}" class="${classNames}" contenteditable="false" id="${controlInstance.id}"></div>`;
        let $elem = $(html);
        if (exAttrs) {
            for (let attrKey in exAttrs) {
                $elem.attr(attrKey, exAttrs[attrKey]);
            }
        }
        controlInstance._$elem = $elem;
        //this.serializePropsToElem(controlInstance._$elem,controlInstance.props,controlInstance.config)
        //newControl
        let $descriptionElem = this.getControlDescriptionElem(controlInstance.config.text, $elem, controlInstance.config, controlInstance.props);
        $elem.append($descriptionElem);

        GeneralPlugin.serializePropsToElemForNewControl(controlInstance._$elem, controlInstance.config, {
            designControlInstanceName: controlInstance.id,
            id: controlInstance.id
        });
        return $elem;
    },
    registeredGeneralEvent($elem, sender) {
        $elem.on("click", {}, function (event) {
            event.preventDefault();
            event.stopPropagation();
            console.log(1234);
            //debugger;
            //GeneralPlugin.createControlEditInnerPanel($(this));
            GeneralPlugin._wysiwygLastSelectedElem = $(this);
        });
        /*$elem.on("contextmenu", {}, function (event) {
            console.log(event);
            console.log(event.which);
            if (event.which == 3) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }
        });*/
        //debugger;
        $elem.on("dblclick", {_this: sender}, function (event) {
            //alert("1");
            event.preventDefault();
            event.stopPropagation();
            GeneralPlugin.clearHelperPanel();
            GeneralPlugin.showPluginPropEditDialog(event.data._this, event.data._this.singleName + "Property", $(this))
        });

        if (typeof (sender.getContextMenu) == "function") {
            let contentMenu = sender.getContextMenu(sender, $elem);
            this.initContextMenu(sender, $elem, contentMenu);
        }
    },
    registeredRedipsInit($elem, sender) {
        let rd = REDIPS.drag;
        rd.init($elem.attr("id"));
        rd.event.dropped = () => {
            GeneralPlugin.clearControlEditInnerPanel();
        }
        rd.enableDrag('init');
    },
    buildListSearchControlGeneralText(config, props) {
        return config.text + "[" + props.bindToSearchField.columnCaption + "]";
    },

    clearHelperPanel() {
        this.clearControlEditInnerPanel();
        this.clearControlDescriptionPanel();
    },
    clearControlDescriptionPanel() {
        $(".control-description-tip-inner-panel").remove();
    },
    /*autoClearHelperPanel(currentWysiwygHtml){
        if(!this._prevWysiwygHtml){
            this._prevWysiwygHtml=currentWysiwygHtml;
        }
        if(this._prevWysiwygHtml!=currentWysiwygHtml){
            this.clearHelperPanel();
            this._prevWysiwygHtml=currentWysiwygHtml;
        }
    },*/
    createControlDescriptionPanel($elem, instanceId, instanceObj) {
        this.clearControlDescriptionPanel();
        let panel = $('<div></div>');
        panel.addClass("control-description-tip-inner-panel");
        $(document.body).append(panel);
        panel.position({
            my: "left top",
            at: "left+2 bottom+4",
            of: $elem
        });
        console.log(instanceId);
    },
    clearControlEditInnerPanel() {
        $(".control-edit-inner-panel").remove();
        //console.log("1");
    },
    createControlEditInnerPanel($elem) {
        //console.log($elem);
        this.clearControlEditInnerPanel();
        //debugger;
        let pluginInnerPanel = $('<div></div>');
        pluginInnerPanel.addClass("control-edit-inner-panel");
        $(document.body).append(pluginInnerPanel);
        pluginInnerPanel.position({
            of: $elem,
            my: "left top",
            at: "left+2 bottom+4",
        });


        let selectAllButton = $('<div></div>');
        selectAllButton.addClass(["button", "select-img"]);
        //selectAllButton.addClass("select-img");
        selectAllButton.attr('title', '选中');
        pluginInnerPanel.append(selectAllButton);
        selectAllButton.on('click', function (event) {
            alert("暂不支持!");
            //The DOM event object is passed by the 'data' property.
            //let domEvent = ev.data;
            //Prevent the click to chave any effect in the element.
            event.preventDefault();
            event.stopPropagation();
        });

        let delButton = $('<div></div>');
        delButton.addClass("button");
        delButton.addClass("del-img");
        delButton.attr('title', '删除');
        pluginInnerPanel.append(delButton);
        delButton.on('click', function (event) {
            $elem.remove();
            GeneralPlugin.clearHelperPanel();
            //The DOM event object is passed by the 'data' property.
            //let domEvent = ev.data;
            //Prevent the click to chave any effect in the element.
            event.preventDefault();
            event.stopPropagation();
        });

        let copyIdButton = $('<div></div>');
        copyIdButton.addClass("button");
        copyIdButton.addClass("copy-id-img");
        copyIdButton.attr('title', '复制ID');
        //copyIdButton.setAttribute( 'data-clipboard-text', "123");
        pluginInnerPanel.append(copyIdButton);
        copyIdButton.on('click', function (event) {
            let id = $elem.attr("id");
            BaseUtility.CopyValueClipboard(id);
            //alert(elem.getAttribute("id"));
            //The DOM event object is passed by the 'data' property.
            //let domEvent = ev.data;
            //Prevent the click to chave any effect in the element.
            event.preventDefault();
            event.stopPropagation();
        });
    },
    createControlTooltipPanel($elem) {

    },

    configProp: {
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
        "dialogHeight": "",
        "isJBuild4DCData": "",
        "controlCategory": "",
        "serverDynamicBind": "",
        "showRemoveButton": "",
        "showInEditorToolbar": ""
    },
    defaultProps: {
        bindToField: {
            relationId: "",
            tableId: "",
            tableName: "",
            tableCaption: "",
            fieldName: "",
            fieldCaption: "",
            fieldDataType: "",
            fieldLength: ""
        },
        defaultValue: {
            defaultType: "",
            defaultValue: "",
            defaultText: ""
        },
        validateRules: {
            msg: "",
            rules: []
        },
        baseInfo: {
            id: "",
            serialize: "true",
            name: "",
            className: "",
            placeholder: "",
            custReadonly: "noreadonly",
            custDisabled: "nodisabled",
            style: "",
            desc: "",
            status: "enable",
            groupName: "",
            designControlInstanceName: ""
        },
        bindToSearchField: {
            columnTitle: "",
            columnTableName: "",
            columnName: "",
            columnCaption: "",
            columnDataTypeName: "",
            columnOperator: "匹配"
        },
        normalDataSource: {
            defaultIsNull: "true",
            sqlDataSource: "",
            dictionaryGroupDataSourceId: "",
            dictionaryGroupDataSourceText: "",
            restDataSource: "",
            interfaceDataSource: "",
            staticDataSource: "",
            defaultSelected: "",
            layoutDirection: "vertical",
            rowNum: "0",
            displayValueInText: "false"
        },
        multilevelProps: {
            level2BindControlId: ""
        }
    },
    setWysiwygComponent(wysiwygComponent) {
        this._wysiwygComponent = wysiwygComponent;
    },
    showPluginPropEditDialog(controlInstance, pluginPropEditVueName, $elem) {
        let props = this.deserializePropsFromElem($elem);
        this._wysiwygComponent.showPluginPropEditDialog(controlInstance, pluginPropEditVueName, $elem, props);
    },
    deserializePropsFromElem($elem) {
        let props = {};

        //let $elem=$(elem);

        function attrToProp($elem, props, groupName) {
            let groupProp = {};
            for (let key in this.defaultProps[groupName]) {
                if ($elem.attr(key)) {
                    groupProp[key] = $elem.attr(key);
                } else {
                    groupProp[key] = this.defaultProps[groupName][key];
                }
            }
            props[groupName] = groupProp;
            return props;
        }

        props = attrToProp.call(this, $elem, props, "baseInfo");
        props = attrToProp.call(this, $elem, props, "bindToField");
        props = attrToProp.call(this, $elem, props, "defaultValue");
        props = attrToProp.call(this, $elem, props, "bindToSearchField");
        props = attrToProp.call(this, $elem, props, "normalDataSource");
        props = attrToProp.call(this, $elem, props, "multilevelProps");

        if ($elem.attr("validateRules")) {
            props.validateRules = JsonUtility.StringToJson(decodeURIComponent($elem.attr("validateRules")));
        }

        return props;
    },
    serializePropsToElemForNewControl($elem, config, props) {
        $elem.attr("jbuild4dc_custom", "true");
        $elem.attr("singlename", config.singleName);
        $elem.attr("is_jbuild4dc_data", config.isJBuild4DCData);
        $elem.attr("control_category", config.controlCategory);
        $elem.attr("show_remove_button", config.showRemoveButton);
        $elem.attr("group", config.group);

        $elem.attr("designControlInstanceName", props.designControlInstanceName);
        $elem.attr("id", props.id);
    },
    serializePropsToElem($elem, props, config, innerHTMl) {
        //debugger;
        $elem.attr("jbuild4dc_custom", "true");
        $elem.attr("singlename", config.singleName);
        $elem.attr("is_jbuild4dc_data", config.isJBuild4DCData);
        $elem.attr("control_category", config.controlCategory);
        $elem.attr("show_remove_button", config.showRemoveButton);
        //elem.attr("clientresolve",controlSetting.ClientResolve);

        //将服务端解析方法,动态绑定属性设置,移到服务端进行解析时处理
        //elem.attr("serverresolve",controlSetting.ServerResolve);
        //elem.attr("server_dynamic_bind",controlSetting.ServerDynamicBind);
        if (innerHTMl) {
            $elem.find("[name='elem-display-name']").html(innerHTMl);
        }

        if (props["baseInfo"]) {
            for (let key in props["baseInfo"]) {
                if (key == "readonly") {
                    if (props["baseInfo"][key] == "readonly") {
                        $elem.attr(key.toLocaleLowerCase(), props["baseInfo"][key]);
                    } else {
                        $elem.removeAttr("readonly");
                    }
                } else if (key == "disabled") {
                    if (props["baseInfo"][key] == "disabled") {
                        $elem.attr(key.toLocaleLowerCase(), props["baseInfo"][key]);
                    } else {
                        $elem.removeAttr("disabled");
                    }
                } else {
                    $elem.attr(key.toLocaleLowerCase(), props["baseInfo"][key]);
                }
            }
        }

        if (props["bindToField"]) {
            for (let key in props["bindToField"]) {
                $elem.attr(key.toLocaleLowerCase(), props["bindToField"][key]);
            }
        }

        if (props["defaultValue"]) {
            for (let key in props["defaultValue"]) {
                $elem.attr(key.toLocaleLowerCase(), props["defaultValue"][key]);
            }
        }

        if (props["validateRules"]) {
            if (props["validateRules"].rules) {
                if (props["validateRules"].rules.length > 0) {
                    $elem.attr("validaterules", encodeURIComponent(JsonUtility.JsonToString(props["validateRules"])));
                } else {
                    console.log("没有验证规则");
                    $elem.removeAttr("validaterules");
                }
            }
        }

        if (props["normalProps"]) {
            for (let key in props["normalProps"]) {
                $elem.attr(key.toLocaleLowerCase(), props["normalProps"][key]);
            }
        }

        if (props["bindToSearchField"]) {
            for (let key in props["bindToSearchField"]) {
                $elem.attr(key.toLocaleLowerCase(), props["bindToSearchField"][key]);
            }
        }

        if (props["normalDataSource"]) {
            for (let key in props["normalDataSource"]) {
                $elem.attr(key.toLocaleLowerCase(), props["normalDataSource"][key]);
            }
        }

        if (props["multilevelProps"]) {
            for (let key in props["multilevelProps"]) {
                $elem.attr(key.toLocaleLowerCase(), props["multilevelProps"][key]);
            }
        }

        return $elem;
    },
    validateSerializeControlDialogCompletedEnable(returnResult) {
        //debugger;
        if (returnResult.baseInfo.serialize == "true" && returnResult.bindToField.fieldName == "") {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "序列化的控件必须绑定字段!", null);
            return {success: false};
        }
        return returnResult;
    },
    setUIDesignMain(_uiDesignMain) {
        this._uiDesignMain = _uiDesignMain;
    },
    selectBindToSingleFieldDialogBeginProxy(oldBindFieldData, caller) {
        this._uiDesignMain.selectBindToSingleFieldDialogBegin(oldBindFieldData, caller);
    },
    selectDefaultValueDialogBeginProxy(oldData, caller) {
        this._uiDesignMain.selectDefaultValueDialogBegin(oldData, caller);
    },
    selectValidateRuleDialogBeginProxy(oldData, caller) {
        this._uiDesignMain.selectValidateRuleDialogBegin(oldData, caller);
    },

    setBaseInfoBindToDataSetId(dataSetId) {
        this._baseInfoBindToDataSetId = dataSetId;
    },
    tryGetDataSetId($elem, parents) {
        //从html中查找datasetId;
        if ($elem && $elem.length > 0) {
            for (let i = parents.length - 1; i--; i >= 0) {
                if (parents[i].getAttribute("datasetid") != null && parents[i].getAttribute("datasetid") != "") {
                    //console.log(parents[i].getAttribute("datasetid"));
                    //this.dataSetId=parents[i].getAttribute("datasetid");
                    return parents[i].getAttribute("datasetid");
                }
            }
        }
        //如果查找不到,则使用基础属性中的dataSetId
        //if (!this.dataSetId) {
        //console.log(window.parent.listDesign.listResourceEntity.listDatasetId);
        //this.dataSetId=window.parent.listDesign.listResourceEntity.listDatasetId;
        //return window.parent.listDesign.listResourceEntity.listDatasetId;
        return this._baseInfoBindToDataSetId;
        //}
        //return null;
        /*if(!this.dataSetId){
            DialogUtility.AlertText("请先设定DataSet");
        }
        else{
            this.bindDataSetFieldTree(this.dataSetId);
        }*/
    },
    tryGetListButtonsInPluginPage($elem) {
        //debugger;
        let buttons = [];
        let listTemplateElem = $elem.parents("[singlename='WLDCT_ListTemplate']");
        let $buttons = $(listTemplateElem).find("[isopbutton]");
        $buttons.each(function () {
            let buttonCaption = $(this).attr("buttoncaption") ? $(this).attr("buttoncaption") : "未设置按钮名称";
            let buttonId = $(this).attr("id");
            buttons.push({
                buttonCaption: buttonCaption,
                buttonId: buttonId
            })
        });
        return buttons;
    },

    getWysiwygLastSelectedElem() {
        return this._wysiwygLastSelectedElem;
    },

    initContextMenu(sender, $elem, contentMenu) {
        $.contextMenu({
            selector: "#" + $elem.attr("id") + " td,#" + $elem.attr("id") + " th,#" + $elem.attr("id"),
            callback: function (key, opt) {
                let m = "clicked: " + key;
                //console.log($tableElem);
                //window.console && console.log(m) || alert(m);
                console.log(m);
            },
            items: contentMenu
        });
    },
    getTableEditorContextMenu(sender, $elem) {
        let generalContextMenu = GeneralPlugin.getGeneralContextMenu(sender, $elem);
        let tableContextMenu = TableEditor.getTableEditorContextMenu(sender, $elem);
        for (const generalContextMenuKey in generalContextMenu) {
            tableContextMenu[generalContextMenuKey] = generalContextMenu[generalContextMenuKey];
        }
        return tableContextMenu;
    },
    getGeneralContextMenu(sender, $elem) {
        return {
            "SelectedElem": {
                name: "SelectedElem",
                icon: function (opt, $itemElement, itemKey, item) {
                    // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                    // $itemElement.html('<i class="las la-closed-captioning"></i> ' + item.name);
                    // Add the context-menu-icon-updated class to the item
                    return 'context-menu-icon context-menu-icon-edit';
                }
            },
            "CopyId": {name: "CopyId", icon: "copy"},
            "Delete": {
                name: "Delete",
                icon: "delete",
                callback: (key, opt) => {
                    $elem.remove();
                }
            },
            "sep1": "---------",
            "Quit": {
                name: "Quit", icon: function () {
                    return 'context-menu-icon context-menu-icon-quit';
                }
            }
        }
    }
}

//提供给EditTable_SelectDefaultValue使用
window.GeneralPlugin = GeneralPlugin;

export {GeneralPlugin as default};