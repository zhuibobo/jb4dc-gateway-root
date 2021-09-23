let DocumentContentUploadConvertToPDFPlugin={
    onchangeFile:function (sender){
        //console.log($(sender).val());
        $("#doc-selected-file").html($(sender).val());
    },
    uploadAndConvertToPDF:function (sender,instanceId,businessKey){
        if(!$("#sourceFile").val()){
            DialogUtility.AlertText("请选择要上传的文件!",this);
        }
        else {
            var formData = new FormData();
            formData.append("file", document.getElementById('sourceFile').files[0]);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', BaseUtility.BuildAction("/Rest/Workflow/RunTime/Client/DocumentFileRuntime/UploadFileAndConvertToPDF?instanceId="+instanceId+"&businessKey="+businessKey));
            // 上传完成后的回调函数
            xhr.onload = function () {
                console.log(xhr);
                if (xhr.status === 200) {
                    //console.log('上传成功');
                    let result=JsonUtility.StringToJson(xhr.response);
                    //console.log(result);
                    DocumentContentUploadConvertToPDFPlugin.loadPDFFileToViewer(result.data.fileId);
                    DialogUtility.CloseByElemId(DialogUtility.DialogLoadingId);
                } else {
                    DialogUtility.AlertText("执行出错!"+xhr.responseText);
                    DialogUtility.CloseByElemId(DialogUtility.DialogLoadingId);
                    //console.log('上传出错');
                }
            };
            // 获取上传进度
            xhr.upload.onprogress = function (event) {
                if (event.lengthComputable) {
                    DialogUtility.AlertLoading(window,DialogUtility.DialogLoadingId,{},"");
                    var percent = Math.floor(event.loaded / event.total * 100);
                    // 设置进度显示
                    $("#upload-process").html(percent+"%");
                }
            };
            xhr.send(formData);
        }
    },
    tryLoadHistoryDocument:function (propConfig){
        AjaxUtility.Get("/Rest/Workflow/RunTime/Client/DocumentFileRuntime/TryGetLastOnlineDocument",{
            instanceId:propConfig.InstanceId
        },function (result){
            console.log(result);
            if(result.success&&result.data) {
                this.loadPDFFileToViewer(result.data.fileId);
            }
        },this);
    },
    loadPDFFileToViewer:function (fileId) {
        //debugger;
        //window.location.origin+"/"+
        let fileUrl = BaseUtility.GetRootPath() + "/Rest/Workflow/RunTime/Client/DocumentFileRuntime/DownLoadPdfDocumentByFileId?fileId=" + fileId;
        //console.log(fileUrl);
        $("#pdfViewer").attr("src", "/Js/External/PDFJS-2.9.359-dist/web/viewer.html?file=" + encodeURIComponent(fileUrl));
        //let fileUrl=pageUrl.substring(0,pageUrl.lastIndexOf("/"));
    },
    getHtmlElem:function (propConfig){
        console.log(propConfig);
        let instanceId=propConfig.InstanceId;
        let businessKey=propConfig.RecordId;
        this.tryLoadHistoryDocument(propConfig);
        return `<div class="document-outer-wrap">
                    <div class="document-buttons-outer">
                        <div class="document-buttons-inner">
                            <button type="button" class="upload-and-convert-button" disabled>下载PDF文件</button>
                            <button type="button" class="upload-and-convert-button" disabled>下载原始文件</button>
                            <button type="button" class="upload-and-convert-button" onclick="DocumentContentUploadConvertToPDFPlugin.uploadAndConvertToPDF(this,'${instanceId}','${businessKey}')">上传并转换为pdf</button>
                            <div class="file-upload">选择文件
                               <input
                                   id="sourceFile"
                                   type="file"
                                   name="inputFile" accept=".doc,.docx,.pdf" onchange="DocumentContentUploadConvertToPDFPlugin.onchangeFile(this)" />
                            </div>
                            <div class="selected-file-message">已选文件:<span id="doc-selected-file"></span></div>
                            <div class="upload-process" id="upload-process"></div>
                        </div>
                    </div>
                    <div class="document-content">
                        <iframe id="pdfViewer" src="" style="width: 100%;height: 100%;border: 0px"></iframe>
                    </div>
                </div>`
    }
}