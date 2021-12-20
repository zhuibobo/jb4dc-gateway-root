let PortletDefaultListWidgetControl= {
    //Props
    widgetInstanceId: "",
    widgetPO: null,
    pagePO: null,
    host: null,
    $widgetBody: null,
    $widgetContainerInnerWrap: null,
    $widgetContainer:null,
    widgetContainerWidth:null,
    widgetContainerHeight:null,
    //public
    CreateWidgetElem:function () {
        return WidgetControl.CreateWidgetElem.call(this,this.GetContextMenuConfig());
    },
    Refresh: function (){
        this.$widgetBody.remove();
        this.$widgetBody = this._BuildBodyElem();
        this.$widgetContainerInnerWrap.append(this.$widgetBody);
        console.log("PortletDefaultListWidgetControl.Refresh");
    },
    GetContextMenuConfig:function () {
        return WidgetControl.GetDefaultContextMenuConfig.call(this);
    },
    OnContextMenuInstructionsEvent:function (){
        console.log("暂无介绍!");
    },
    OnContextMenuMoreEvent:function (){
        let moreProp = this.widgetPO.widgetProperties.more;
        let dialogConfig = moreProp.dialogConfig;
        if (moreProp.openType == "frameIframe") {
            let openUrl=moreProp.openUrl;
            openUrl = StringUtility.FormatWithDefaultValue(openUrl,true, null,null);
            DialogUtility.Frame_OpenIframeWindow(window,DialogUtility.DialogId05,openUrl,dialogConfig,1,true);
        }
    },
    //private
    _BuildToolBar: WidgetControl._BuildToolBar,
    _BuildBodyElem: function () {
        //let widgetProps = WidgetDemoData.GetToDoListWidgetProps();
        //this.widgetPO.widgetProperties=widgetProps;
        let restUrl=this.widgetPO.widgetProperties.list.getListDateRest;
        let restParas=this.widgetPO.widgetProperties.list.getListDateRestParas;
        AjaxUtility.Post(restUrl,restParas,function (result){
            if(result.success){
                console.log(result);
                let widgetProperties = this.widgetPO.widgetProperties;

                let $listInnerWrap = this.$widgetBody.find(".widget-list-inner-wrap");
                for (let i = 0; i < result.data.list.length; i++) {
                    let rowData = result.data.list[i];
                    let $singleRowElem = this._BuildSingleRow(rowData);
                    $listInnerWrap.append($singleRowElem);
                }
            }
        },this);
        let $widgetBody = $("<div class='widget-body'><div class='widget-list-outer-wrap'><div class='widget-list-inner-wrap'></div></div></div>");
        return $widgetBody;
    },
    _BuildSingleRow:function (rowData) {
        if (this.widgetPO.widgetProperties.list.printRowData) {
            console.log(rowData);
        }
        let fieldParsing = this.widgetPO.widgetProperties.list.fieldParsing;
        let titleWidth = this.widgetContainerWidth - 66;

        let timeStr = StringUtility.FormatSprintfJsonObj(fieldParsing.timeFormat, rowData);
        let timeObj = DateUtility.ConvertFromString(timeStr);
        let dateShort = DateUtility.Format(timeObj, "MM-dd");

        let titleStr = StringUtility.FormatSprintfJsonObj(fieldParsing.titleFormat, rowData);

        let $rowElem = $("<div class='widget-list-row-wrap'><div class='widget-list-title' style='width: " + titleWidth + "px;margin-right: 4px'><i class=\"las la-chevron-right\"></i>" + titleStr + "</div><div class='widget-list-date' style='width: 40px;'>" + dateShort + "</div></div>");
        $rowElem.bind("click", {rowData: rowData, "widgetInstance": this}, function (sender) {
            sender.data.widgetInstance._BuildSingleRowClickEvent.call(sender.data.widgetInstance, sender.data.rowData);
        });
        return $rowElem;
    },
    _BuildSingleRowClickEvent:function (rowData) {
        let listProp = this.widgetPO.widgetProperties.list;
        let dialogConfig = listProp.dialogConfig;
        function openUrlFunc(openUrl,dialogConfig){
            DialogUtility.Frame_OpenIframeWindow(window,DialogUtility.DialogId06,openUrl,dialogConfig,1,true);
        }
        if(listProp.openUrlFormatRest){

        }
        else{
            if (listProp.openType == "frameIframe") {
                let openUrl=listProp.openUrl;
                openUrl = StringUtility.FormatWithDefaultValue(openUrl,true, rowData,null);
                openUrlFunc(openUrl,dialogConfig);
            }
        }
        console.log(rowData);
    }
}