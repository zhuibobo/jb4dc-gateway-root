let PortletPageRuntime={
    pagePO:null,
    widgetList:null,
    widgetInstanceCache:{},
    dashboardView:null,
    panelMenu:null,
    acInterface:{
        getTemplatePageWithSSOMenu:"/Rest/Portlet/RunTime/Client/TemplatePageRuntime/GetTemplatePageWithSSOMenu"
    },
    getPagePOAndWidgetPOListThenRender: function () {
        AjaxUtility.Get(this.acInterface.getTemplatePageWithSSOMenu, {
            menuId:BaseUtility.GetUrlParaValue("menuId"),
        }, function (result) {
            console.log(result);
            if (result.success) {
                //console.log(result);
                this.pagePO = result.data;
                this.widgetList=result.exKVData.Widgets;
                this.pagePO.pageConfig = JsonUtility.StringToJson(this.pagePO.pageConfig);
                this.pagePO.pageProperties = JsonUtility.StringToJson(this.pagePO.pageProperties);
                if (this.pagePO.pageWidgetConfig) {
                    this.pagePO.pageWidgetConfig = JsonUtility.StringToJson(this.pagePO.pageWidgetConfig);
                } else {
                    this.pagePO.pageWidgetConfig = [];
                }
                this.renderPage();
            }
        }, this);
    },
    renderPage:function (){
        console.log(this.pagePO);
        console.log(this.widgetList);
        let _self=this;

        let dashboardView=this.buildDashboardView();
        this.panelMenu=this.buildWidgetMenu();

        webix.ui({
            type: "space", cols: [
                {view: "scrollview", body: dashboardView}
            ]
        });
        webix.event(document.body, "click", function (ev) {
            var css = ev.target.className;
            if (css && css.toString().indexOf("panel_icon") != -1) {
                _self.panelMenu.setContext(webix.$$(ev.target));
                _self.panelMenu.show(ev.target);
            }
        });

        if(this.pagePO.pageWidgetConfig) {
            $$("dashboardViewLayout").restore(this.pagePO.pageWidgetConfig);
        }
    },
    buildDashboardView:function () {
        let pagePO = this.pagePO;
        let dashboard = {
            view: "dashboard", id: "dashboardViewLayout",
            gridColumns: pagePO.pageConfig.gridColumns,
            gridRows: pagePO.pageConfig.gridRows,
            cellHeight: pagePO.pageConfig.cellHeight,
            factory: function (obj) {
                //console.log(obj);
                let widgetId=obj.name;
                let widgetInstanceId=obj.id;
                obj.view = "panel";
                obj.resize = false;
                obj.icon = "las la-align-justify";
                obj.body = {
                    view: "template",
                    template: function (data) {
                        //let widgetPO = $$("widgetTree").getItem(data.obj.name);
                        return "<div name='widgetContainer'></div>";
                    },
                    data: {
                        pagePO: pagePO,
                        widgetId:widgetId,
                        widgetInstanceId:widgetInstanceId
                    },
                    on: {
                        onViewShow: function () {
                            /*console.log("------------onViewShow-------------");
                            console.log(this);
                            console.log("------------onViewShow-------------");*/
                        },
                        onAfterLoad: function () {
                            /*console.log("------------onAfterLoad-------------");
                            console.log(this);
                            console.log("------------onAfterLoad-------------");*/
                        },
                        onBlur: function (prev_view) {
                            /*console.log("------------onBlur-------------");
                            console.log(this);
                            console.log("------------onBlur-------------");*/
                        },
                        onBeforeRender: function (data) {
                            /*console.log("------------onBeforeRender-------------");
                            console.log(this);
                            console.log(data);
                            console.log("------------onBeforeRender-------------");*/
                        },
                        onAfterRender: function (data) {
                            //console.log(data);
                            //console.log(this);
                            let pagePO=this.data.pagePO;
                            let widgetId=this.data.widgetId;
                            let widgetInstanceId=this.data.widgetInstanceId;
                            let widgetPO=ArrayUtility.WhereSingle(PortletPageRuntime.widgetList,item=>item.widgetId==widgetId);
                            console.log(widgetPO);
                            //console.log("------------onAfterRender-------------");
                            let _this = this;
                            /*let ele = $("<div>"+widgetPo.widgetName+"</div>");
                            ele.click(function () {
                                alert(widgetInstanceId);
                            });*/
                            let widgetInstance=PortletPageRuntime.newWidgetInstance(widgetInstanceId,widgetPO,pagePO);
                            $(this.$view).find("[name='widgetContainer']").append(widgetInstance.renderElem());
                            //console.log("------------onAfterRender-------------");
                        }
                    }
                };
                /*if (obj.name == "b") {
                    obj.body.content = "myDiv";
                }*/
                return obj;
            },
            on: {
                onChange: function () {
                    //var state = this.serialize();
                    //webix.storage.local.put("grid-dashboard-state", state);
                },
                onBeforeDrag:function (context, native_event){
                    return false;
                }
            }
        };
        return dashboard;
    },
    buildWidgetMenu:function () {
        let menu = webix.ui({
            view: "contextmenu",
            click: function (id) {
                if (id === "deleteWidget") {
                    let view = this.getContext();
                    view.getParentView().removeView(view);
                }
            },
            data: [
                {id: "widgetInstructions", value: "详情"},
                {id: "widgetMore", value: "更多"}
            ]
        });
        return menu;
    },
    newWidgetInstance:function (widgetInstanceId,widgetPO,pagePO) {
        let widgetInstance = Object.create(eval(widgetPO.widgetClientRender));
        widgetInstance.widgetInstanceId = widgetInstanceId;
        widgetInstance.widgetPO = widgetPO;
        widgetInstance.pagePO = pagePO;
        this.widgetInstanceCache[widgetInstanceId] = widgetInstance;
        return widgetInstance;
    },
    getWidgetInstance:function (widgetInstanceId){

    }
}