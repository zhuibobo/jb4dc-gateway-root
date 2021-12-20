let WidgetControl= {
    CreateWidgetElem:function (menuConfig){
        this.$widgetContainerInnerWrap = $("<div class='widget-container-inner-wrap'></div>");
        this.$widgetContainerInnerWrap.append(this._BuildToolBar(this.widgetPO,this.widgetInstanceId,menuConfig));
        this.$widgetBody = this._BuildBodyElem();
        this.$widgetContainerInnerWrap.append(this.$widgetBody);
        return this.$widgetContainerInnerWrap;
    },
    NotRefresh:function (innerVersion){

    },
    _BuildToolBar: function (widgetPO,widgetInstanceId,menuConfig) {
        //let _this=this;
        let menuElemId = "menu_" + widgetInstanceId;
        let widgetToolBar = $("<div class='widget-tool-bar'><div class='widget-title'><i class='las la-angle-right'></i>" + widgetPO.widgetTitle + "</div><div class='widget-menu' id='" + menuElemId + "'><i class='las la-align-justify context-menu-one'></i></div></div>");
        if(JsonUtility.JsonToString(menuConfig)!="{}") {
            $.contextMenu({
                selector: "#" + menuElemId,
                trigger: 'left',
                items: menuConfig
            });
        }
        return widgetToolBar;
    },
    GetDefaultContextMenuConfig:function (){
        let _this=this;
        return {
            "instructions": {
                name: "详情", icon: "edit", callback: function (itemKey, opt, e) {
                    _this.OnContextMenuInstructionsEvent();
                    console.log(_this.widgetInstanceId);
                }
            },
            "more": {
                name: "更多", icon: "edit", callback: function (itemKey, opt, e) {
                    _this.OnContextMenuMoreEvent();
                    console.log(_this.widgetInstanceId);
                }
            },
            "sep1": "---------",
            "quit": {
                name: "退出",
                icon: "context-menu-icon context-menu-icon-quit", callback: function (itemKey, opt, e) {}
            }
        }
    },
    GetEmptyContextMenuConfig:function (){
        return {};
    }
    /*,
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
    }*/
}