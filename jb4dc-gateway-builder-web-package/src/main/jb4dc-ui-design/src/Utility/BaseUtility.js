//基础工具
var BaseUtility = {
    GetRootPath: function () {
        var fullHref = window.document.location.href;
        var pathName = window.document.location.pathname;
        var lac = fullHref.indexOf(pathName);
        var localhostPath = fullHref.substring(0, lac);
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return (localhostPath + projectName);
    },
    GetContextPath:function (){
        //var fullHref = window.document.location.href;
        var pathName = window.document.location.pathname;
        //var lac = fullHref.indexOf(pathName);
        //var localhostPath = fullHref.substring(0, lac);
        var projectName = pathName.substring(1, pathName.substr(1).indexOf('/') + 1);
        return projectName;
    },
    GetTopWindow: function () {
        alert("BaseUtility.GetTopWindow 已停用");
    },
    TrySetControlFocus:function () {
        alert("BaseUtility.TrySetControlFocus 已停用");
    },
    BuildView:function (action,para) {
        return this.BuildAction(action,para);
    },
    BuildAction:function (action,para) {
        var urlPara = "";
        if (para) {
            urlPara = $.param(para);
        }
        var _url;
        if (action.indexOf("../") == 0) {
            _url = action;
        } else if (action.indexOf(StringUtility.FormatWithNames.AppContextPath) >= 0) {
            _url = StringUtility.FormatWithDefaultValue(action);
        } else {
            _url = this.GetRootPath() + action;
        }
        if (urlPara != "") {
            if (_url.indexOf("?") > -1) {
                _url += "&" + urlPara;
            } else {
                _url += "?" + urlPara;
            }
        }
        return this.AppendTimeStampUrl(_url);
    },
    BuildActionNotAppendRootPath:function (action,para) {
        var urlPara = "";
        if (para) {
            urlPara = $.param(para);
        }
        var _url = action;
        if (urlPara != "") {
            if (_url.indexOf("?") > -1) {
                _url += "&" + urlPara;
            } else {
                _url += "?" + urlPara;
            }
        }
        return this.AppendTimeStampUrl(_url);
    },
    RedirectToLogin:function () {
        var url=BaseUtility.GetRootPath()+"/PlatForm/LoginView.do";
        window.parent.parent.location.href=url;
    },
    AppendTimeStampUrl:function (url) {
        if (url.indexOf("timestamp") > "0") {
            return url;
        }
        var getTimestamp = new Date().getTime();
        if (url.indexOf("?") > -1) {
            url = url + "&timestamp=" + getTimestamp
        } else {
            url = url + "?timestamp=" + getTimestamp
        }
        return url;
    },
    GetUrlParaValue: function (paraName) {
        return this.GetUrlParaValueByString(paraName,window.location.search);
    },
    GetUrlOPParaValue:function(){
        return this.GetUrlParaValue("op");
    },
    GetUrlParaValueByString:function (paraName,urlString) {
        var reg = new RegExp("(^|&)" + paraName + "=([^&]*)(&|$)");
        var r = urlString.substr(1).match(reg);
        if (r != null)return decodeURIComponent(r[2]);
        return "";
    },
    CopyValueClipboard:function (value) {
        //debugger;
        var transfer = document.getElementById('J_CopyTransfer');
        if (!transfer) {
            transfer = document.createElement('textarea');
            transfer.id = 'J_CopyTransfer';
            transfer.style.position = 'absolute';
            transfer.style.left = '-9999px';
            transfer.style.top = '-9999px';
            transfer.style.zIndex = 9999;
            document.body.appendChild(transfer);
        }
        //$(transfer).val(value);
        transfer.value = value;
        transfer.focus();
        transfer.select();
        document.execCommand('copy');
    },
    SetSystemFavicon:function () {
        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = BaseUtility.GetRootPath()+'/favicon.ico';
        document.getElementsByTagName('head')[0].appendChild(link);
    },
    SetSystemTitle:function () {
        document.title=JBuild4DCYaml.GetClientSystemTitle();
    },
    SetSystemCaption:function(){
        $("#systemCaption").text(JBuild4DCYaml.GetClientSystemCaption());
    },
    IsFunction:function (func) {
        if(typeof(func)=="function"){
            return true;
        }
        return false;
    },
    GetElemAllAttr:function ($elem) {
        var attrs={};
        $elem.each(function() {
            $.each(this.attributes, function() {
                // this.attributes is not a plain object, but an array
                // of attribute nodes, which contain both the name and value
                if(this.specified) {
                    //console.log(this.name, this.value);
                    attrs[this.name]=this.value;
                }
            });
        });
        return attrs;
    },
    GetViewOperationName:function(){
        return "view";
    },
    IsViewOperation:function (operationType) {
        return operationType && operationType == this.GetViewOperationName();
    },
    GetAddOperationName:function(){
        return "add";
    },
    IsAddOperation:function (operationType) {
        return operationType && operationType == this.GetAddOperationName();
    },
    GetUpdateOperationName:function(){
        return "update";
    },
    IsUpdateOperation:function (operationType) {
        return operationType && operationType == this.GetUpdateOperationName();
    },
    GetDeleteOperationName:function(){
        return "delete";
    },
    IsDeleteOperation:function (operationType) {
        return operationType && operationType == this.GetDeleteOperationName();
    },

    IsAddOperationByUrl(){
        if (this.GetUrlParaValue("op")){
            if(this.GetUrlParaValue("op")==this.GetAddOperationName()){
                return true;
            }
        }
        return false;
    },
    IsUpdateOperationByUrl(){
        if (this.GetUrlParaValue("op")){
            if(this.GetUrlParaValue("op")==this.GetUpdateOperationName()){
                return true;
            }
        }
        return false;
    },
    IsViewOperationByUrl(){
        if (this.GetUrlParaValue("op")){
            if(this.GetUrlParaValue("op")==this.GetViewOperationName()){
                return true;
            }
        }
        return false;
    },
    ThrowMessage:function (message) {
        DialogUtility.AlertText(message);
        throw message;
    }
};

export { BaseUtility as default};