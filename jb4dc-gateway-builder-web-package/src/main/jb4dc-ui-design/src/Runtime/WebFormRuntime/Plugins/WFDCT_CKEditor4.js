
let _ref_filePath=$("script").first().attr("src");
console.log(_ref_filePath);

let WFDCT_CKEditor4={
    ckeditorInstance:null,
    /*ResolveSelf:function (_rendererChainParas) {

    },*/
    RendererChain:function (_rendererChainParas) {
        //debugger;
        let $singleControlElem=_rendererChainParas.$singleControlElem;
        let areaHeight=$singleControlElem.height();
        //$singleControlElem.val("22222");
        //加载默认配置文件

        if(BaseUtility.IsViewOperation(_rendererChainParas.runtimeRootHostInstance.GetOperationType())) {

        }
        else {
            //let filename = _ref_filePath.substr(_ref_filePath.lastIndexOf('/') + 1);
            let editorConfigUrl=$singleControlElem.attr("customconfig")?$singleControlElem.attr("customconfig"):"customizeConfig/WFDCT_CKEditor4_Min_Config.js";

            //let editorConfigUrl = BaseUtility.AppendTimeStampUrl(_ref_filePath.replace(filename, "Control/WebFormControl/"+$singleControlElem.attr("customconfig")));
            console.log(editorConfigUrl);
            //editorConfigUrl=1;
            this.ckeditorInstance = CKEDITOR.replace($singleControlElem.attr("id"), {
                customConfig: editorConfigUrl,
                //formRuntimeInstance:_rendererChainParas.formRuntimeInstance
            });
            this.ckeditorInstance.config.height = areaHeight;
            //console.log(this.ckeditorInstance.config.plugins);
        }
    },
    RendererDataChain:function () {

    },
    GetValue:function ($elem,originalData, paras) {
        originalData.value=this.ckeditorInstance.getData();
        //console.log(originalData.value);
        return originalData;
    },
    SetValue:function ($elem,fieldPO,relationFormRecordComplexPo,_rendererDataChainParas) {
        //debugger;
        if(fieldPO){
            //console.log(fieldPO);1
            $elem.val(fieldPO.value);
            $elem.attr("control_value",fieldPO.value);
        }
    },
    ToViewStatus:function($elem,fieldPO,relationFormRecordComplexPo,_rendererDataChainParas){
        //let htmlData=this.ckeditorInstance.getData();
        //console.log(htmlData);
        //debugger;
        let $viewElem=$("<div></div>");
        let oldAllAttrs=BaseUtility.GetElemAllAttr($elem);
        $viewElem.attr(oldAllAttrs);
        $viewElem.removeClass();
        $viewElem.html(fieldPO.value);
        $viewElem.css("overflow","auto");
        $viewElem.height($viewElem.height()+100);
        $elem.replaceWith($viewElem);
    }
}

export {WFDCT_CKEditor4 as default};