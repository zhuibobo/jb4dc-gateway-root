var WLDCT_DeleteButton= {
    _ListTableContainerInstance:null,
    RendererChain: HTMLControl.RendererChain,
    ResolveSelf:function (_rendererChainParas) {
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        var caption=$singleControlElem.attr("buttoncaption");
        var $button=$("<button class='wldct-list-button'>"+caption+"</button>");

        var attributes = $singleControlElem.prop("attributes");

        $.each(attributes, function() {
            $button.attr(this.name, this.value);
        });

        $button.bind("click",{"buttonElem":$button,"selfInstance":this},this.ClickEvent);

        var isshow=$button.attr("isshow");
        if(isshow=="false"){
            $button.hide();
        }

        return $button;
    },
    RendererDataChain:function (_rendererDataChainParas) {
        var $singleControlElem=_rendererDataChainParas.$singleControlElem;
        var $WLDCT_ListButtonContainer = $singleControlElem.parents("[singlename='WLDCT_ListButtonContainer']");
        var $WLDCT_ListTableContainerElem = $WLDCT_ListButtonContainer.nextAll("[client_resolve='WLDCT_ListTableContainer']");
        this._ListTableContainerInstance = HTMLControl.GetControlInstanceByElem($WLDCT_ListTableContainerElem);
    },
    ClickEvent:function (sender) {
        //debugger;
        var $button = sender.data.buttonElem;
        var _self = sender.data.selfInstance;

        var bindauthority = $button.attr("bindauthority");
        var buttoncaption = $button.attr("buttoncaption");
        var buttontype = $button.attr("buttontype");
        var custclientclickbeforemethod = $button.attr("custclientclickbeforemethod");
        var custclientclickbeforemethodpara = $button.attr("custclientclickbeforemethodpara");
        var custclientrendereraftermethodpara = $button.attr("custclientrendereraftermethodpara");
        var custclientrendereraftermethodparapara = $button.attr("custclientrendereraftermethodparapara");
        var custclientrenderermethod = $button.attr("custclientrenderermethod");
        var custclientrenderermethodpara = $button.attr("custclientrenderermethodpara");
        var custserverresolvemethod = $button.attr("custserverresolvemethod");
        var custserverresolvemethodpara = $button.attr("custserverresolvemethodpara");
        var elemid = $button.attr("id");
        var buttonid = $button.attr("buttonid");
        var opentype = $button.attr("opentype");
        var operation = $button.attr("operation");
        var singlename = $button.attr("singlename");
        var windowcaption = $button.attr("windowcaption");
        var client_resolve = $button.attr("client_resolve");
        var isConfirm = $button.attr("isconfirm");
        var deleteTableAt = $button.attr("deletetableat");
        var deleteType = $button.attr("deletetype");
        var confirmField = $button.attr("confirmfield");
        var confirmFormat = $button.attr("confirmformat");
        var bindDataSetId = $button.attr("binddatasetid");
        var recordId = "";
        //var checkedRecordObjs="";
        if (operation == "delete") {
            var checkedRecordObjs = _self._ListTableContainerInstance.GetCheckedRecord();
            if (checkedRecordObjs.length == 0) {
                DialogUtility.AlertText("请选择需要进行操作的记录!");
                return;
            } else if (checkedRecordObjs.length > 1) {
                DialogUtility.AlertText("一次只能操作一条记录!");
                return;
            } else {
                recordId = checkedRecordObjs[0].Id;
            }
        }

        if (StringUtility.toUpperCase(isConfirm) == "TRUE") {
            DialogUtility.Confirm(window, "您确认要删除吗?", function () {
                //WLDCT_ListTableContainer.TryReloadForListFormButton(listFormButtonElemId);
                /*AjaxUtility.Post("/Rest/Builder/RunTime/DataSetRuntime/DeleteDataSetRecord",{dataSetId:bindDataSetId,pkValue:recordId},function (result) {
                    if(result.success) {
                        WLDCT_ListTableContainer.TryReloadForListFormButton(elemid);
                    }
                },this);*/
                RuntimeGeneralInstance.DeleteDataSetRecord(elemid,bindDataSetId,recordId,this);
                //console.log(WLDCT_ListTableContainer.TryReloadForListFormButton);
            }, this);
        }
        //console.log("删除记录!@");
    }
}