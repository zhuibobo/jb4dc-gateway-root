let RuntimeGeneralInstance = {
    TryGetMenuOuterId: function () {
        return BaseUtility.GetUrlParaValue("menuOuterId");
    },
    GetUrlParas:function () {
        //debugger
        if(this["menuRightUrlParaJson"]){
            return this["menuRightUrlParaJson"];
        }
        else{
            var paraStr=BaseUtility.GetUrlParaValue("menuRightUrlPara");
            if(StringUtility.IsNullOrEmpty(paraStr)){
                return "";
            }
            if(paraStr.charAt(0)=="{"||paraStr.charAt(0)=="["){
                try {
                    var json=JsonUtility.StringToJson(paraStr);
                    return json;
                }
                catch (e) {

                }
            }
            this["menuRightUrlParaJson"]=paraStr;
            return paraStr;
        }
    },
    TryGetUrlParaViewOnly:function () {
        var paraJson=this.GetUrlParas();
        if(paraJson&&typeof(paraJson)!="string"){
            for (var i = 0; i < paraJson.length; i++) {
                var singlePara=paraJson[i];
                if(singlePara.ActionType=="ViewOnly"){
                    return true;
                }
            }
        }
        return false;
    }
    /*TryGetUrlParaValueByFieldName:function (actionName,fieldName) {
        var paraJson=this.GetUrlParas();
        if(paraJson&&typeof(paraJson)!="string"){
            for (var i = 0; i < paraJson.length; i++) {
                var singlePara=paraJson[i];
                if(singlePara.ActionType==actionName&&singlePara.FieldName==fieldName){
                    return singlePara.Value;
                }
            }
        }
        return "";
    }*/
}

export {RuntimeGeneralInstance as default};