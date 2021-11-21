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
    CreateWidgetElem:function () {
        return WidgetControl.CreateWidgetElem.call(this);
    },
    Refresh: WidgetControl.NotRefresh,
    GetContextMenuConfig:WidgetControl.GetEmptyContextMenuConfig,
    //private
    _BuildTitleElem: WidgetControl._BuildTitleElem,
    _BuildBodyElem: function () {
        //debugger;
        let widgetProps = this.widgetPO.widgetProperties;
        let $widgetBody = $("<div class='widget-body'><div class='widget-quick-entry-outer-wrap'><div class='widget-quick-entry-inner-wrap'></div></div></div>");
        let $quickEntryInnerWrap = $widgetBody.find(".widget-quick-entry-inner-wrap");
        for (let i = 0; i < widgetProps.QuickEntries.length; i++) {
            let quickEntry = widgetProps.QuickEntries[i];
            let $quickElem = this._BuildSingleQuickEntry(quickEntry);
            $quickEntryInnerWrap.append($quickElem);
        }
        //console.log(444444);
        return $widgetBody;
    },
    _BuildSingleQuickEntry: function (quickEntry) {
        let $quickElemWrap = $("<div class='widget-quick-elem-wrap'><div style='margin: auto;text-align: center'><img src='/Themes/Png32X32/" + quickEntry.image + "' /></div><div>" + quickEntry.caption + "</div></div>");
        $quickElemWrap.bind("click", {quickEntry: quickEntry, "widgetInstance": this}, function (sender) {
            sender.data.widgetInstance._BindSingleQuickEntryClickEvent.call(sender.data.widgetInstance, sender.data.quickEntry);
        });
        return $quickElemWrap;
    },
    _BindSingleQuickEntryClickEvent: function (quickEntry) {
        console.log(quickEntry);
        if (quickEntry.openType == "innerIframe") {
            DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, quickEntry.url, {}, 1);
        }
    }
}