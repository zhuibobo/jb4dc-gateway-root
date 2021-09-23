import queryString from "query-string";

var WpsClientUtility={
    getActionOption:function (){
        /*let urlParas=queryString.parse(location.search);
        return JSON.parse(urlParas.actionOptionUrl);*/
        let wpsDocObjectInstance = wps.WpsApplication().ActiveDocument
        let currentRsid=wpsDocObjectInstance.CurrentRsid;
        let actionOptionString=localStorage.getItem("actionOption_"+currentRsid);
        return JSON.parse(actionOptionString);
    },
    isJb4dcDocument:function (){
        console.log("2");
        let wpsDocObjectInstance = wps.WpsApplication().ActiveDocument
        if(wpsDocObjectInstance) {
            let currentRsid = wpsDocObjectInstance.CurrentRsid;
            let isJb4dcDocumentVar = localStorage.getItem("isJb4dcDocument_" + currentRsid);
            if (isJb4dcDocumentVar) {
                return true;
            }
        }
        return false;
    },
    /**
     * 上传一个文件到远程服务器
     * @param name 上传后的文件名称
     * @param path 文件绝对路径
     * @param url 上传地址
     * @param field 请求中name的值
     * @param onSuccess 下载成功的回调函数
     * @param onFail 下载失败的回调函数
     */
    uploadFile:function (doc, onSuccess, onFail){
        console.log(doc);
        let openDialog = wps.WpsApplication().Dialogs.Item(wps.Enum.wdDialogInsertFile);
        let dlgAnswer = openDialog.Show();
        console.log(dlgAnswer);
        console.log(openDialog);
        doc.SaveAsUrl(doc.Name,"http://127.0.0.1:9104/JB4DCBuilder/Rest/Builder/File/UploadCKE4Image","1.doc");
        /*wps.OAAssist.UploadFile(doc.Name, "C:\\22.aip", "http://127.0.0.1:9104/JB4DCBuilder/Rest/Builder/File/UploadCKE4Image*", "123", (result)=>{

        }, ()=>{

        });*/
    }
}

export {WpsClientUtility}