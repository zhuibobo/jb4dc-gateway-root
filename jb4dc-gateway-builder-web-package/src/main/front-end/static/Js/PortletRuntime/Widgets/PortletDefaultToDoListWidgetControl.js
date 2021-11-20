let PortletDefaultToDoListWidgetControl= {
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
    createWidgetElem:function () {
        return WidgetControl.createWidgetElem.call(this);
    },
    refresh: WidgetControl.notRefresh,
    getContextMenuConfig:WidgetControl.getDefaultContextMenuConfig,
    //private
    _buildTitleElem: WidgetControl._buildTitleElem,
    _buildBodyElem: function () {
        //console.log(this.widgetContainerWidth);
        //console.log(this.widgetContainerHeight);
        let widgetProps = WidgetDemoData.getToDoListWidgetProps();
        this.widgetPO.widgetProperties=widgetProps;
        let restUrl=this.widgetPO.widgetProperties.list.getListDateRest;
        let restParas=this.widgetPO.widgetProperties.list.getListDateRestParas;
        AjaxUtility.Post(restUrl,restParas,function (result){
            if(result.success){
                console.log(result);
                let widgetProperties = this.widgetPO.widgetProperties;

                let $listInnerWrap = this.$widgetBody.find(".widget-list-inner-wrap");
                for (let i = 0; i < result.data.length; i++) {
                    let rowData = result.data[i];
                    let $singleRowElem = this._buildSingleRow(rowData);
                    $listInnerWrap.append($singleRowElem);
                }
            }
        },this);
        let $widgetBody = $("<div class='widget-body'><div class='widget-list-outer-wrap'><div class='widget-list-inner-wrap'></div></div></div>");
        //let widgetProps = this.widgetPO.widgetProperties;
        //console.log(widgetProps);
        //let listData = WidgetDemoData.getDemoToDoListData();
        //console.log(123);
        return $widgetBody;
    },
    _buildSingleRow:function (rowData) {
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
            sender.data.widgetInstance._buildSingleRowClickEvent.call(sender.data.widgetInstance, sender.data.rowData);
        });
        return $rowElem;
    },
    _buildSingleRowClickEvent:function (rowData) {
        let listProp = this.widgetPO.widgetProperties.list;
        let dialogConfig = listProp.dialogConfig;
        if (listProp.openType == "frameIframe") {
            let openUrl=listProp.openUrl;
            openUrl = StringUtility.FormatWithDefaultValue(openUrl,true, rowData,null);
            DialogUtility.Frame_OpenIframeWindow(window,DialogUtility.DialogId06,openUrl,dialogConfig,1,true);
        }
        console.log(rowData);
    }
}