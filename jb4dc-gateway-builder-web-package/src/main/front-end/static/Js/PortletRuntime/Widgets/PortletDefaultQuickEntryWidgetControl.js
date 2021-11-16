let PortletDefaultQuickEntryWidgetControl= {
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
    getContextMenuConfig:WidgetControl.getEmptyContextMenuConfig,
    //private
    _buildTitleElem: WidgetControl._buildTitleElem,
    _buildBodyElem: function () {
        //debugger;
        let widgetProps = WidgetDemoData.getQuickEntryDemoProps();
        let $widgetBody = $("<div class='widget-body'><div class='widget-quick-entry-outer-wrap'><div class='widget-quick-entry-inner-wrap'></div></div></div>");
        let $quickEntryInnerWrap = $widgetBody.find(".widget-quick-entry-inner-wrap");
        for (let i = 0; i < widgetProps.QuickEntries.length; i++) {
            let quickEntry = widgetProps.QuickEntries[i];
            let $quickElem = this._buildSingleQuickEntry(quickEntry);
            $quickEntryInnerWrap.append($quickElem);
        }
        //console.log(444444);
        return $widgetBody;
    },
    _buildSingleQuickEntry: function (quickEntry) {
        let $quickElemWrap = $("<div class='widget-quick-elem-wrap'><div style='margin: auto;text-align: center'><img src='/Themes/Png32X32/" + quickEntry.image + "' /></div><div>" + quickEntry.caption + "</div></div>");
        $quickElemWrap.bind("click", {quickEntry: quickEntry, "host": this}, function (sender) {
            sender.data.host._bindSingleQuickEntryClickEvent.call(sender.data.host, sender.data.quickEntry);
        });
        return $quickElemWrap;
    },
    _bindSingleQuickEntryClickEvent: function (quickEntry) {
        console.log(quickEntry);
        if (quickEntry.type == "innerIframe") {
            DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, quickEntry.url, {}, 1);
        }
    }
}