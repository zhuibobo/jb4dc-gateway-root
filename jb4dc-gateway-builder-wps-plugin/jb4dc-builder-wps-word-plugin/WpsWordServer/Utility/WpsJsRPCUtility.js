import wps_rpc from 'wpsjs-rpc-sdk';

var projInfo = {"name":"jb4dc-builder-wps-word-plugin","type":"wps"}

let WpsJsRPCUtility={
    _wpsInvoke:function (provideForServerCallInvokeParam,showToFront,invokeCompleted){
        var invokeAs = this.isHttps() ? wps_rpc.WpsInvoke.InvokeAsHttps : wps_rpc.WpsInvoke.InvokeAsHttp;
        invokeAs(
            projInfo.type,
            projInfo.name, //wps加载项的名字，在实际项目中写上对应的名字
            "provideForServerCall", //要调用的在wps加载项中的函数名
            JSON.stringify(provideForServerCallInvokeParam), //调用的在wps加载项中的函数要传递的数据，是一个json对象，根据业务系统需求任意定义
            invokeCompleted, //回调函数，wps加载项中InvokeFromSystemDemo这个函数的返回值作为这个函数的参数
            showToFront) //设置wps是否显示到最前面来
    },
    printWpsRpc:function (){
        console.log(wps_rpc);
        //var wpsClient = new wps_rpc.WpsClient(projInfo.type);
        //console.log(window);
    },
    invokeCompletedResultHandler:function (result){
        console.log(result);
        if(result.status==0){
            result.response=JSON.parse(result.response);
        }
        return result;
    },
    isHttps:function () {
        if (window.location.href.indexOf("https://") == 0) {
            return true;
        }
        return false;
    },
    getProvideForServerCallInvokeParam:function (action,actionOption){
        var provideForServerCallInvokeParam = {
            action: action,
            actionOption:actionOption,
            projInfo: projInfo
        }
        return provideForServerCallInvokeParam;
    },
    newDocument:function (actionOption,invokeCompleted){
        var provideForServerCallInvokeParam=this.getProvideForServerCallInvokeParam("newDocument",actionOption);
        this._wpsInvoke(provideForServerCallInvokeParam,true, (result)=>{
            result=this.invokeCompletedResultHandler(result);
            invokeCompleted(result);
        });
    },
    getDocumentName:function (invokeCompleted) {
        var provideForServerCallInvokeParam = this.getProvideForServerCallInvokeParam("getDocumentName", {});
        this._wpsInvoke(provideForServerCallInvokeParam, false, (result) => {
            result = this.invokeCompletedResultHandler(result);
            invokeCompleted(result);
        });
    },
    openSmallSizeDocument:function (fileUrl,invokeCompleted){
        var provideForServerCallInvokeParam=this.getProvideForServerCallInvokeParam("openSmallSizeDocument",{
            fileUrl:fileUrl
        });
        this._wpsInvoke(provideForServerCallInvokeParam, false,(result)=>{
            result=this.invokeCompletedResultHandler(result);
            invokeCompleted(result);
        });
    },
    openBigSizeDocument:function (fileUrl,invokeCompleted){
        var provideForServerCallInvokeParam=this.getProvideForServerCallInvokeParam("openBigSizeDocument",{
            fileUrl:fileUrl
        });
        this._wpsInvoke(provideForServerCallInvokeParam, false,(result)=>{
            result=this.invokeCompletedResultHandler(result);
            invokeCompleted(result);
        });
    },
    regWebNotify:function (notifyFunc){
        wps_rpc.WpsInvoke.RegWebNotify(projInfo.type, projInfo.name, function (messageText) {
            notifyFunc(messageText);
            //var span = document.getElementById("webnotifyspan")
            //span.innerHTML = "(次数：" + ++WebNotifycount + ")：" + messageText;
        });
    }
}

export { WpsJsRPCUtility }