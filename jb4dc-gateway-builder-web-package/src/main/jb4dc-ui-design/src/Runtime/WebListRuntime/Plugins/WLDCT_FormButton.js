import HTMLControl from '../../HTMLControl.js'

let WLDCT_FormButton= {

    _ListTableContainerInstance:null,
    RendererChain: HTMLControl.RendererChain,
    ResolveSelf:function (_rendererChainParas) {
        let $singleControlElem=_rendererChainParas.$singleControlElem;
        //console.log($singleControlElem);
        let caption=$singleControlElem.attr("buttoncaption")?$singleControlElem.attr("buttoncaption"):"未设置";
        let $button=$("<button>"+caption+"</button>");

        let attributes = $singleControlElem.prop("attributes");

        $.each(attributes, function() {
            $button.attr(this.name, this.value);
        });

        $button.addClass("wldct-list-button");

        $button.bind("click",{"buttonElem":$button,"selfInstance":this},this.ClickEvent);
        //debugger;
        //console.log($WLDCT_ListButtonContainer.html());
        let isshow=$button.attr("isshow");
        if(isshow=="false"){
            $button.hide();
        }
        return $button;
    },
    RendererDataChain:function (_rendererDataChainParas) {
        let $singleControlElem=_rendererDataChainParas.$singleControlElem;
        let $WLDCT_ListButtonContainer = $singleControlElem.parents("[singlename='WLDCT_ListButtonContainer']");
        let $WLDCT_ListTableContainerElem = $WLDCT_ListButtonContainer.nextAll("[client_resolve='WLDCT_ListTableContainer']");
        this._ListTableContainerInstance = HTMLControl.GetControlInstanceByElem($WLDCT_ListTableContainerElem);
    },
    ClickEvent:function (sender) {
        let $button=sender.data.buttonElem;
        let _self=sender.data.selfInstance;
        //console.log($button);
        let bindauthority=$button.attr("bindauthority");
        let buttoncaption=$button.attr("buttoncaption");
        let buttontype=$button.attr("buttontype");
        let custclientclickbeforemethod=$button.attr("custclientclickbeforemethod");
        let custclientclickbeforemethodpara=$button.attr("custclientclickbeforemethodpara");
        let custclientrendereraftermethodpara=$button.attr("custclientrendereraftermethodpara");
        let custclientrendereraftermethodparapara=$button.attr("custclientrendereraftermethodparapara");
        let custclientrenderermethod=$button.attr("custclientrenderermethod");
        let custclientrenderermethodpara=$button.attr("custclientrenderermethodpara");
        let custserverresolvemethod=$button.attr("custserverresolvemethod");
        let custserverresolvemethodpara=$button.attr("custserverresolvemethodpara");
        let formcode=$button.attr("formcode");
        let formid=$button.attr("formid");
        let formmoduleid=$button.attr("formmoduleid");
        let formmodulename=$button.attr("formmodulename");
        let formname=$button.attr("formname");
        let elemid=$button.attr("id");
        let buttonid=$button.attr("buttonid");
        let innerbuttonjsonstring=$button.attr("innerbuttonjsonstring");
        let opentype=$button.attr("opentype");
        let operation=$button.attr("operation");
        let singlename=$button.attr("singlename");
        let windowcaption=$button.attr("windowcaption");
        let windowheight=$button.attr("windowheight");
        let windowwidth=$button.attr("windowwidth");
        let client_resolve=$button.attr("client_resolve");

        let recordId="";
        //let checkedRecordObjs="";
        if(operation=="update"||operation=="view") {
            let checkedRecordObjs = _self._ListTableContainerInstance.GetCheckedRecord();
            if(checkedRecordObjs.length==0){
                DialogUtility.AlertText("请选择需要进行操作的记录!");
                return;
            }
            else if(checkedRecordObjs.length>1){
                DialogUtility.AlertText("一次只能操作一条记录!");
                return;
            }
            else{
                recordId=checkedRecordObjs[0].Id;
            }
        }

        let paraStr=BaseUtility.GetUrlParaValue("menuRightUrlPara");
        //debugger;
        DialogUtility.Frame_OpenIframeWindow(window,DialogUtility.DialogId,BaseUtility.BuildView("/UIRuntimeWebFormMain.html",{
            "formId":formid,
            "buttonId":buttonid,
            "listFormButtonElemId":elemid,
            "recordId":recordId,
            "operationType":operation,
            "windowWidth":windowwidth,
            "windowHeight":windowheight,
            "menuRightUrlPara":paraStr
        }), {
            "width": windowwidth,
            "height": windowheight,
            "title":windowcaption
        },1,true);
    }
}

export {WLDCT_FormButton as default}