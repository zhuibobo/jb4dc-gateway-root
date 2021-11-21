let WidgetControl= {
    CreateWidgetElem:function (){
        this.$widgetContainerInnerWrap = $("<div class='widget-container-inner-wrap'></div>");
        this.$widgetContainerInnerWrap.append(this._BuildTitleElem(this.widgetPO));
        this.$widgetBody = this._BuildBodyElem();
        this.$widgetContainerInnerWrap.append(this.$widgetBody);
        return this.$widgetContainerInnerWrap;
    },
    NotRefresh:function (innerVersion){

    },
    _BuildTitleElem: function (widgetPO) {
        return $("<div class='widget-title'><i class=\"las la-angle-right\"></i>" + widgetPO.widgetTitle + "</div>");
    },
    GetInstructionsContextMenuConfig:function () {
        return [
            {
                id: "widgetInstructions",
                value: "详情",
                click: function () {
                    this.OnContextMenuInstructionsEvent();
                }
            }
        ]
    },
    GetDefaultContextMenuConfig:function () {
        return [
            {
                id: "widgetInstructions",
                value: "详情",
                click: function () {
                    this.OnContextMenuInstructionsEvent();
                }
            },
            {
                id: "widgetMore",
                value: "更多",
                click: function () {
                    this.OnContextMenuMoreEvent();
                }
            }
        ]
    },
    GetEmptyContextMenuConfig:function () {
        return []
    }
}