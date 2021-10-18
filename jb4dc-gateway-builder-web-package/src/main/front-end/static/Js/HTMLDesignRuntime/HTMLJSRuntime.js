let HTMLJSRuntime={
    _Prop_Config:{
    },
    _$RendererToElem:null,
    _JsContent:null,
    _ReplaceContextPath:function(source){
        try {
            var contextPath = BaseUtility.GetRootPath();
            //return source.replaceAll("${contextPath}", contextPath);
            return source.replace(/\$\{contextPath\}/g, contextPath);
        }
        catch (e){
            throw "_ReplaceContextPath:"+e;
        }
    },
    _ReplaceTimeStamp:function(source){
        try {
            var timestamp=new Date().getTime();
            //return source.replaceAll("${timeStamp}",timestamp);
            return source.replace(/\$\{timeStamp\}/g, timestamp);
        }
        catch (e){
            throw "_ReplaceTimeStamp:"+e;
        }
    },
    ReplaceJSParas:function(source){
        try {
            var resultJs = this._ReplaceContextPath(source);
            resultJs = this._ReplaceTimeStamp(resultJs);
            return resultJs;
        }
        catch (e){
            throw "ReplaceJSParas:"+e;
        }
    },
    Initialization:function (_config,$rendererToElem,jsContent) {
        this._Prop_Config= $.extend(true,{},this._Prop_Config,_config);
        this._$RendererToElem=$rendererToElem;
        this._JsContent=jsContent;
        this._LoadJSToEl()
    },
    _LoadJSToEl:function () {
        //console.log("引入脚本:")
        //console.log(this._FormPO.formJsContent);
        this._$RendererToElem.append(this.ReplaceJSParas(this._JsContent));
        /*if(!FormPageObjectInstance){
            throw "引入顺序错误!";
        }*/
        //FormPageObjectInstance.formEntity=this._FormPO;
        //console.log(FormPageObjectInstance.formEntity);
        //alert(1);
    }
}