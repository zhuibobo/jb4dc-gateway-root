import HTMLControlAttrs from './HTMLControlAttrs.js'
import ValidateRulesRuntime from './ValidateRulesRuntime.js'

let HTMLControl={
    //_formRuntimeInstance:null,
    _InstanceMap:{},
    _GetInstance:function(name){
        for(let key in this._InstanceMap){
            if(key==name){
                return this._InstanceMap[key];
            }
        }
        let instance=eval(name);
        this._InstanceMap[name]=instance;
        return instance;
    },
    GetInstance:function(name) {
        alert("GetInstance改方法已经废弃,改为服务端创建初始化脚本1!");
        return this._GetInstance(name);
    },
    SaveControlNewInstanceToPool:function($elem,instance){
        alert("SaveControlNewInstanceToPool改方法已经废弃,改为服务端创建初始化脚本1!");
        return null;
        let instanceName=$elem.attr("client_resolve")+"_"+StringUtility.GuidSplit("");
        //HTMLControl.SaveControlInstancePool(instanceName,instance);
        $elem.attr("client_instance_name",instanceName);
        this._InstanceMap[instanceName]=instance;
        return instanceName;
    },
    _SaveControlNewInstanceToPool:function(instanceName,instance){
        this._InstanceMap[instanceName]=instance;
        return instanceName;
    },
    GetControlInstanceByElem:function($elem){
        //console.log($elem);
        //console.log($elem.attr("client_instance_name"));
        /*let instanceName="";
        if($elem.attr("client_instance_name")&&$elem.attr("client_instance_name").length>0){
            instanceName=$elem.attr("client_instance_name");
        }
        else {
            instanceName=$elem.attr("client_resolve");
        }
        return this._GetInstance(instanceName);*/
        //return this._InstanceMap[instanceName];
        return this._GetInstance(this.GetControlInstanceNameByElem($elem));
    },
    GetControlInstanceNameByElem:function($elem){
        let instanceName="";
        if($elem.attr("client_instance_name")&&$elem.attr("client_instance_name").length>0){
            instanceName=$elem.attr("client_instance_name");
        }
        else {
            instanceName=$elem.attr("client_resolve");
        }
        return instanceName;
    },
    RendererChainParas:{
        listEntity:null,
        sourceHTML:null,
        $rootElem:null,
        $parentControlElem:null,
        $singleControlElem:null,
        runtimeRootHostInstance:null
    },
    RendererDataChainParas:{
        listEntity:null,
        sourceHTML:null,
        $rootElem:null,
        $parentControlElem:null,
        $singleControlElem:null,
        topDataSet:null,
        runtimeRootHostInstance:null
    },
    RendererChain:function (_rendererChainParas) {
        try {
            let $singleControlElem = _rendererChainParas.$singleControlElem;
            let runtimeRootHostInstance=_rendererChainParas.runtimeRootHostInstance;
            //console.log($singleControlElem);
            //debugger;
            for (let i = 0; i < $singleControlElem.children().length; i++) {
                try {
                    let $childSingleElem = $($singleControlElem.children()[i]);

                    let _cloneRendererChainParas = {};
                    JsonUtility.SimpleCloneAttr(_cloneRendererChainParas, _rendererChainParas);
                    _cloneRendererChainParas.$singleControlElem = $childSingleElem;
                    //console.log($childSingleElem.html());
                    if ($childSingleElem.attr(HTMLControlAttrs.JBUILD4DC_CUSTOM) == "true" && $childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE)) {
                        //debugger;
                        //let clientResolveName=$childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
                        let instance = HTMLControl.GetControlInstanceByElem($childSingleElem);

                        if (typeof (instance.Initialize) == "function") {
                            instance.Initialize();
                        }

                        HTMLControl.TryBindElementAttrToInstanceProp($childSingleElem, instance);
                        HTMLControl.TryBindDefaultPropToInstanceProp(instance);

                        runtimeRootHostInstance.AddRendererControlInstance(instance);
                        //初始化控件实例属性
                        /*if (instance._objectType == "Instance") {
                            if (instance._prop) {
                                let instanceProp = HTMLControl.TryBindElementAttrToInstanceProp($childSingleElem, instance._prop);
                                instance._prop = instanceProp;
                            }
                        } else {
                            let elemId = $childSingleElem.attr("id");
                            if (elemId && instance._propMap && instance._prop) {
                                if (!instance._propMap[elemId]) {
                                    let instanceProp = HTMLControl.TryBindElementAttrToInstanceProp($childSingleElem, instance._prop);
                                    instance._propMap[elemId] = instanceProp;
                                }
                            }
                        }*/

                        instance.RendererChain(_cloneRendererChainParas);
                        if (typeof (instance.InitStyle) == "function") {
                            instance.InitStyle(_cloneRendererChainParas);
                        }
                    } else {
                        HTMLControl.RendererChain(_cloneRendererChainParas);
                    }
                } catch (e) {
                    console.error($singleControlElem);
                    throw e;
                }
            }
        }
        catch (e){
            //console.error(_rendererChainParas);
            throw e;
        }
    },
    RendererDataChain:function (_rendererDataChainParas) {
        //console.log(_rendererDataChainParas);
        //debugger;
        let $singleControlElem=_rendererDataChainParas.$singleControlElem;
        //debugger;
        for (let i = 0; i < $singleControlElem.children().length; i++) {
            try {
                let $childSingleElem = $($singleControlElem.children()[i]);

                let _cloneRendererDataChainParas = {};
                JsonUtility.SimpleCloneAttr(_cloneRendererDataChainParas, _rendererDataChainParas);
                _cloneRendererDataChainParas.$singleControlElem = $childSingleElem;
                //console.log($childSingleElem.html());
                if ($childSingleElem.attr(HTMLControlAttrs.JBUILD4DC_CUSTOM) == "true" && $childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE)) {
                    //debugger;
                    //let clientResolveInstanceName = $childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
                    let instance=HTMLControl.GetControlInstanceByElem($childSingleElem);
                    instance.RendererDataChain(_cloneRendererDataChainParas);

                    let fieldPO;
                    if(typeof(instance.SetValue)=="function") {
                        fieldPO = HTMLControl.TryGetFieldPOInRelationFormRecordComplexPo($childSingleElem,_rendererDataChainParas.relationFormRecordComplexPo);
                        instance.SetValue($childSingleElem,fieldPO,_rendererDataChainParas.relationFormRecordComplexPo,_rendererDataChainParas);
                    }

                    //console.log(_rendererDataChainParas.callToViewStatusFunc);
                    if(_rendererDataChainParas.callToViewStatusFunc) {
                        if(typeof(instance.ToViewStatus)=="function") {
                            instance.ToViewStatus($childSingleElem,fieldPO,_rendererDataChainParas.relationFormRecordComplexPo,_rendererDataChainParas);
                        }
                    }
                } else {
                    HTMLControl.RendererDataChain(_cloneRendererDataChainParas);
                }
            }
            catch (e){
                console.error($singleControlElem);
                throw e;
            }
        }
    },
    //region 样式设置
    InitStyle:function(_rendererChainParas){
        let $singleControlElem=_rendererChainParas.$singleControlElem;
        HTMLControl.TryAppendValidateStyle($singleControlElem);
    },
    TryAppendValidateStyle:function($singleControlElem){
        let validateRules=ValidateRulesRuntime.getValidateRules($singleControlElem);
        //debugger;
        if(validateRules&&validateRules.rules.length>0){
            for (let i = 0; i < validateRules.rules.length; i++) {
                if(validateRules.rules[i].validateType==ValidateRulesRuntime.NoEmpty) {
                    let $tdTxt = $singleControlElem.parent().prev();
                    let newTxt = ValidateRulesRuntime.getValidateTipElem() + $tdTxt.text();
                    $tdTxt.html(newTxt);
                    //console.log(tdTxt);
                }
            }
            //console.log(validateRules);
        }
    },
    //endregion
    GetValue:function ($elem,originalData, paras) {
        originalData.value=$elem.val();
        return originalData;
    },
    SetValue:function ($elem,fieldPO,relationFormRecordComplexPo,_rendererDataChainParas) {
        //debugger;
        //console.log(fieldPO);
        if(fieldPO){
            //console.log(fieldPO.value);
            $elem.val(fieldPO.value);
            $elem.attr("control_value",fieldPO.value);
        }
    },
    ToViewStatus:function($elem,fieldPO,relationFormRecordComplexPo,_rendererDataChainParas){
        let oldAllAttrs=BaseUtility.GetElemAllAttr($elem);
        let $viewElem=$("<label />");
        $viewElem.attr(oldAllAttrs);

        $viewElem.removeClass();

        if($elem.prop("tagName")=="SELECT"){
            //debugger;
            let text=$elem.find("option:selected").text();
            $viewElem.text(text);
        }
        else{
            $viewElem.text($elem.val());
        }
        $elem.replaceWith($viewElem);
    },
    TryBindUrlValue:function (_rendererChainParas) {
        //debugger;
        let $singleControlElem=_rendererChainParas.$singleControlElem;
        let columnName=$singleControlElem.attr("columnname");
        if(!columnName){
            columnName=$singleControlElem.attr("fieldname");
        }
        let urlValue=RuntimeGeneralInstance.TryGetUrlParaValueByFieldName("BindToField",columnName);
        if(urlValue) {
            $singleControlElem.val(urlValue);
            console.log(urlValue);
        }
    },
    TryGetFieldPOInRelationFormRecordComplexPo:function($elem,relationFormRecordComplexPo) {
        let relationId = HTMLControl.GetControlBindRelationId($elem);
        let bindTableName = HTMLControl.GetControlBindTableName($elem);
        let bindFieldName = HTMLControl.GetControlBindFieldName($elem);
        if (relationId && bindFieldName) {
            let fieldPO = FormRelationPOUtility.FindFieldPOInRelationFormRecordComplexPoOneDataRecord(relationFormRecordComplexPo, relationId, bindTableName, bindFieldName);
            return fieldPO;
        } else {
            return null
        }
    },
    FindALLControls:function ($parent) {
        if ($parent) {
            return $parent.find("[jbuild4dc_custom='true']");
        }
        return $("[jbuild4dc_custom='true']");
    },
    GetControlBindTableName:function($controlElem){
        return $controlElem.attr("tablename");
    },
    GetControlBindFieldName:function($controlElem){
        return $controlElem.attr("fieldname");
    },
    GetControlBindRelationId:function($controlElem){
        return $controlElem.attr("relationid");
    },
    GetControlProp:function ($controlElem) {
        let props= {
            singleName: "",
            tableName: "",
            tableCaption: "",
            tableId: "",
            fieldTableId: "",
            fieldName: "",
            fieldDataType: "",
            fieldDataLength: "",
            defaultType: "",
            defaultValue: "",
            id: "",
            serialize: "",
            value:""
        };
        //debugger;
        for(let key in props){
            let propValue=$controlElem.attr(StringUtility.ToLowerCase(key));
            if(!StringUtility.IsNullOrEmpty(propValue)) {
                props[key] = propValue;
            }
        }
        props.fieldDataLength=$controlElem.attr("fieldlength");
        return props;
    },
    BuildSerializationOriginalData:function(props,relationId,relationSingleName,relationType){
        //let props=this.GetControlProp($controlElem);
        let originalData = {
            relationId: relationId,
            relationSingleName: relationSingleName,
            relationType: relationType,
            singleName: props.singleName,
            tableName:  props.tableName,
            tableCaption: props.tableCaption,
            tableId: props.tableId,
            fieldTableId: props.fieldTableId,
            fieldName: props.fieldName,
            fieldDataType: props.fieldDataType,
            fieldDataLength: props.fieldDataLength,
            serialize: props.serialize,
            id: props.id,
            defaultType: props.defaultType,
            defaultValue: props.defaultValue,
            value: "",
            success: true,
            msg: ""
        };
        return originalData;
    },
    GetSerializationOneDataRecordFieldValue:function (oneDataRecord,tableName,fieldName) {
        for (let i = 0; i < oneDataRecord.length; i++) {
            if (oneDataRecord[i].tableName == tableName && oneDataRecord[i].fieldName == fieldName) {
                return oneDataRecord[i].value;
            }
        }
        return "";
    },
    TryGetFieldTransferPO:function ($controlElem,relationId,relationSingleName,relationType) {
        let props=HTMLControl.GetControlProp($controlElem);
        let originalData=HTMLControl.BuildSerializationOriginalData(props,relationId,relationSingleName,relationType);
        let controlInstance = HTMLControl.GetControlInstanceByElem($controlElem);

        if (BaseUtility.IsFunction(controlInstance.GetValue)) {
            let fieldTransferPO = controlInstance.GetValue($controlElem, originalData, {});
            if (fieldTransferPO.success) {
                return fieldTransferPO;
            } else {
                return null;
            }
        } else {
            DialogUtility.AlertText("控件:" + $controlElem.attr("singlename") + "未包含GetValue的方法!");
        }
    },
    GetSimpleControlValue:function (tableId, fieldName) {
        let elem = $("[tableid='" + tableId + "'][fieldname='" + fieldName + "']");
        if (elem.length == 0) {
            return null;
        }
        return elem.val();
    },
    TryBindDefaultPropToInstanceProp:function (instance) {
        if (!instance._prop) {
            instance._prop = {};
        }
        instance._prop._RendererChainIsCompleted = true;
        instance._prop._RendererDataChainIsCompleted = true;
    },
    TryBindElementAttrToInstanceProp:function ($elem,instance) {
        //console.log($elem.attrs());
        $($elem).each(function() {
            $.each(this.attributes, function() {
                // this.attributes is not a plain object, but an array
                // of attribute nodes, which contain both the name and value
                if(this.specified) {
                    if(!instance._prop){
                        instance._prop={};
                    }
                    instance._prop[this.name]=this.value;
                    //console.log(this.name, this.value);
                }
            });
        });
        /*let result={};
        for(let key in objProp){
            if($elem.attr(key)){
                result[key]=$elem.attr(key);
            }
            else if(key=="elemId"){
                result.elemId = $elem.attr("id");
            }
            else if(key=="instanceName"){
                result.instanceName = $elem.attr("client_instance_name");
            }
            else{
                result[key]=objProp[key];
            }
        }
        result.$singleControlElem=$elem;
        return result;*/
    }
}

export {HTMLControl as default};