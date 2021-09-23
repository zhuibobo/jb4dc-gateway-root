import { WpsClientUtility } from './Utility/WpsClientUtility'

function getCallResult(provideForServerCallInvokeParam,success,message,code,data){
    provideForServerCallInvokeParam.success=success;
    provideForServerCallInvokeParam.message=message;
    provideForServerCallInvokeParam.code=code;
    provideForServerCallInvokeParam.data=data;
    return provideForServerCallInvokeParam;
}

function getUrlPath() {
    let e = document.location.toString()
    return -1 != (e = decodeURI(e)).indexOf("/") && (e = e.substring(0, e.lastIndexOf("/"))), e
}

function getImage(control) {
    const eleId = control.Id
    switch (eleId) {
        case "btnSaveToServer":
            return "WpsWordClient/dist/Images/upload.svg";
        case "btnShowDialog":
            return "WpsWordClient/dist/Images/computer.svg";
        case "btnShowDevPanel":
            return "WpsWordClient/dist/Images/computer.svg";
        case "btnDialogOpenClientFile":
            return "WpsWordClient/dist/Images/open.svg";
        case "btnDialogInsertFile":
            return "WpsWordClient/dist/Images/insert.svg";
        default:
            ;
    }
    return "WpsWordClient/dist/Images/computer.svg";
}

function onGetVisible(control){
    console.log(control);
    return WpsClientUtility.isJb4dcDocument();
    //return false;
}

function onWPSWorkTabLoad(ribbonUI) {
    //wps.alert("onWPSWorkTabLoad");
    if (typeof (wps.ribbonUI) != "object") {
        wps.ribbonUI = ribbonUI
    }

    //if (typeof (wps.Enum) != "object") { // 如果没有内置枚举值
    //    wps.Enum = WPS_Enum
    //}

    //wps.PluginStorage.setItem("EnableFlag", false) //往PluginStorage中设置一个标记，用于控制两个按钮的置灰
    //wps.PluginStorage.setItem("ApiEventFlag", false) //往PluginStorage中设置一个标记，用于控制ApiEvent的按钮label
    addDocumentEventListener();
    //setTimeout(function (){
    //    wps.alert("onWPSWorkTabLoad");
    //}, 4000); // 激活页面必须要页签显示出来，所以做1秒延迟
    return true
}

//挂载WPS的文档事件
function addDocumentEventListener() {
    wps.ApiEvent.AddApiEventListener("WindowActivate", onWindowActivateListener);
    //wps.ApiEvent.AddApiEventListener("DocumentBeforeSave", OnDocumentBeforeSave);
    //wps.ApiEvent.AddApiEventListener("DocumentBeforeClose", OnDocumentBeforeClose);
    //wps.ApiEvent.AddApiEventListener("DocumentAfterClose", OnDocumentAfterClose);
    //wps.ApiEvent.AddApiEventListener("DocumentBeforePrint", OnDocumentBeforePrint);
    //wps.ApiEvent.AddApiEventListener("DocumentOpen", OnDocumentOpen);
    //wps.ApiEvent.AddApiEventListener("DocumentNew", OnDocumentNew);
    console.log("AddDocumentEvent");
}

//切换窗口时触发的事件
function onWindowActivateListener() {
    var l_doc = wps.WpsApplication().ActiveDocument;
    //SetCurrDocEnvProp(l_doc); // 设置当前文档对应的用户名
    wps.ribbonUI.Invalidate();
    setTimeout(function (){
         // 根据文件是否为OA文件来显示OA菜单再进行刷新按钮
    }, 4000); // 激活页面必须要页签显示出来，所以做1秒延迟
    return;
}

/*function onGetEnabled(control) {
    const eleId = control.Id
    switch (eleId) {
        case "btnShowMsg":
            return true
            break
        case "btnShowDialog":
        {
            let bFlag = wps.PluginStorage.getItem("EnableFlag")
            return bFlag
            break
        }
        case "btnShowTaskPane":
        {
            let bFlag = wps.PluginStorage.getItem("EnableFlag")
            return bFlag
            break
        }
        default:
            break
    }
    return true
}

function onGetVisible(control){
    return true
}

function onGetLabel(control){
    const eleId = control.Id
    switch (eleId) {
        case "btnIsEnbable":
        {
            let bFlag = wps.PluginStorage.getItem("EnableFlag")
            return bFlag ?  "按钮Disable" : "按钮Enable"
            break
        }
        case "btnApiEvent":
        {
            let bFlag = wps.PluginStorage.getItem("ApiEventFlag")
            return bFlag ? "清除新建文件事件" : "注册新建文件事件"
            break
        }
    }
    return ""
}

function onNewDocumentApiEvent(doc){
    alert("新建文件事件响应，取文件名: " + doc.Name)
}

function onAddinLoad(ribbonUI){
    if (typeof (wps.ribbonUI) != "object"){
        wps.ribbonUI = ribbonUI
    }

    if (typeof (wps.Enum) != "object") { // 如果没有内置枚举值
        wps.Enum = WPS_Enum
    }

    wps.PluginStorage.setItem("EnableFlag", false) //往PluginStorage中设置一个标记，用于控制两个按钮的置灰
    wps.PluginStorage.setItem("ApiEventFlag", false) //往PluginStorage中设置一个标记，用于控制ApiEvent的按钮label
    return true
}*/

function onAction(control) {
    var eleId = control.Id;
    //var actionOptionUrl =encodeURIComponent(JSON.stringify(getActionOptionWithThisWindow()));
    switch (eleId) {
        case "btnDialogOpenClientFile": {
            let oldDocument=wps.WpsApplication().ActiveDocument;
            console.log(oldDocument);
            let openDialog = wps.WpsApplication().Dialogs.Item(wps.Enum.wdDialogFileOpen);
            let dlgAnswer = openDialog.Show();
            if(dlgAnswer==-1) {
                //传递参数
                let actionOption = WpsClientUtility.getActionOption();
                let newDocument = wps.WpsApplication().ActiveDocument;
                setActionOptionToLocalStorage(newDocument.CurrentRsid,actionOption);
                oldDocument.Close();
                console.log(newDocument);
            }
        } break;
        case "btnDialogInsertFile": {
            //let oldDocument=wps.WpsApplication().ActiveDocument;
            //console.log(oldDocument);
            let openDialog = wps.WpsApplication().Dialogs.Item(wps.Enum.wdDialogInsertField);
            let dlgAnswer = openDialog.Show();
        } break;
        case "btnSaveToServer": {
            const doc = wps.WpsApplication().ActiveDocument;
            if (!doc) {
                alert("当前没有打开任何文档");
                return;
            }
            WpsClientUtility.uploadFile(doc);
            //alert(doc.Name)
        } break;
        case "btnShowDialog": {
            wps.ShowDialog(getUrlPath() + "/WpsWordClient/dist/DevPanel.html", "JBuildWordPlugin", 400 * window.devicePixelRatio, 400 * window.devicePixelRatio, false)
        } break;
        case "btnShowDevPanel": {
            let tsId = wps.PluginStorage.getItem("taskpane_id")
            if (!tsId) {
                let tskpane = wps.CreateTaskPane(getUrlPath() + "/WpsWordClient/dist/DevPanel.html");
                let id = tskpane.ID
                wps.PluginStorage.setItem("taskpane_id", id)
                tskpane.Visible = true
            } else {
                let tskpane = wps.GetTaskPane(tsId)
                tskpane.Visible = !tskpane.Visible
            }
        } break
        default:
            break
    }
    return true
}

function setActionOptionToLocalStorage(currentRsid,actionOption) {
    //window.WpsClientAdditionActionOption = actionOption;
    localStorage.setItem("actionOption_"+currentRsid,JSON.stringify(actionOption));
    localStorage.setItem("isJb4dcDocument_"+currentRsid,"true");
}

function provideForServerCall(param) {
    let jsonObj = (typeof (param) == 'string' ? JSON.parse(param) : param)
    let action = jsonObj.action
    let actionOption = jsonObj.actionOption;
    let wpsDocObjectInstance=null;

    switch (action) {
        case "getDocumentName": {
            if (wps.WpsApplication().ActiveDocument) {
                wpsDocObjectInstance = wps.WpsApplication().ActiveDocument
            }
        } break;
        case "newDocument": {
            let wpsDocObjectInstance = wps.WpsApplication().Documents.Add();
        } break;
        case "openSmallSizeDocument": {
            let fileUrl = actionOption.fileUrl;
            wps.WpsApplication().Documents.OpenFromUrl(fileUrl);
            wpsDocObjectInstance = wps.WpsApplication().ActiveDocument
        } break;
        case "openBigSizeDocument": {
            let fileUrl = actionOption.fileUrl;
            wps.WpsApplication().Documents.OpenFromUrl(fileUrl);
            wpsDocObjectInstance = wps.WpsApplication().ActiveDocument
        } break;
    }

    //return;
    if(wpsDocObjectInstance){
        let resultData={
            Name: wpsDocObjectInstance.Name,
            DocID:  wpsDocObjectInstance.DocID,
            CurrentRsid: wpsDocObjectInstance.CurrentRsid
        }
        console.log("1");
        setActionOptionToLocalStorage(wpsDocObjectInstance.CurrentRsid,actionOption);
        return getCallResult(param, true, "操作成功!", "00000", resultData);
    }

    return getCallResult(param, false, "操作失败!", "10000", {});
}

window.getImage=getImage;
//window.onGetEnabled=onGetEnabled;
window.onGetVisible=onGetVisible;
//window.onGetLabel=onGetLabel;
//window.onNewDocumentApiEvent=onNewDocumentApiEvent;
window.onWPSWorkTabLoad=onWPSWorkTabLoad;
window.onAction=onAction;
window.provideForServerCall=provideForServerCall;