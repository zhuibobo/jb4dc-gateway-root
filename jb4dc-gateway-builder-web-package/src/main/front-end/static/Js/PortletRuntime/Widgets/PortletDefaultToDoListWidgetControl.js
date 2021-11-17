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
        let listData = WidgetDemoData.getDemoToDoListData();
        let $widgetBody = $("<div class='widget-body'><div class='widget-list-outer-wrap'><div class='widget-list-inner-wrap'></div></div></div>");
        let $listInnerWrap = $widgetBody.find(".widget-list-inner-wrap");
        for (let i = 0; i < listData.length; i++) {
            let rowData = listData[i];
            let $singleRowElem = this._buildSingleRow(rowData);
            $listInnerWrap.append($singleRowElem);
        }
        //console.log(123);
        return $widgetBody;
    },
    _buildSingleRow:function (rowData){
        let titleWidth=this.widgetContainerWidth-80;
        let rowDate=DateUtility.ConvertFromString(rowData.date);
        let dateShort=DateUtility.Format(rowDate,"MM-dd");
        let $rowElem=$("<div class='widget-list-row-wrap'><div class='widget-list-title' style='width: "+titleWidth+"px'><i class=\"las la-chevron-right\"></i>"+rowData.title+"</div><div class='widget-list-date' style='width: 40px;'>"+dateShort+"</div></div>");
        $rowElem.bind("click", {rowData: rowData, "widgetInstance": this}, function (sender) {
            sender.data.widgetInstance._buildSingleRowClickEvent.call(sender.data.widgetInstance, sender.data.rowData);
        });
        return $rowElem;
    },
    _buildSingleRowClickEvent:function (rowData){
        console.log(rowData);
    }
}