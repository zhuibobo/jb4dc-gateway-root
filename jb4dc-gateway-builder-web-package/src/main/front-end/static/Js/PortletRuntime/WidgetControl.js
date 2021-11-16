let WidgetControl= {
    createWidgetElem:function (){
        this.$widgetContainerInnerWrap = $("<div class='widget-container-inner-wrap'></div>");
        this.$widgetContainerInnerWrap.append(this._buildTitleElem(this.widgetPO));
        this.$widgetBody = this._buildBodyElem();
        this.$widgetContainerInnerWrap.append(this.$widgetBody);
        return this.$widgetContainerInnerWrap;
    },
    notRefresh:function (innerVersion){

    },
    _buildTitleElem: function (widgetPO) {
        return $("<div class='widget-title'><i class=\"las la-angle-right\"></i>" + widgetPO.widgetTitle + "</div>");
    },
    getInstructionsContextMenuConfig:function () {
        return [
            {
                id: "widgetInstructions",
                value: "详情",
                click: function () {
                    this.contextMenuInstructionsEvent();
                }
            }
        ]
    },
    getDefaultContextMenuConfig:function () {
        return [
            {
                id: "widgetInstructions",
                value: "详情",
                click: function () {
                    this.contextMenuInstructionsEvent();
                }
            },
            {
                id: "widgetMore",
                value: "更多",
                click: function () {
                    this.contextMenuMoreEvent();
                }
            }
        ]
    },
    getEmptyContextMenuConfig:function () {
        return []
    }
}