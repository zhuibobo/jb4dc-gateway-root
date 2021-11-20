let PortletPageRuntime={
    pagePO:null,
    widgetList:null,
    widgetInstanceCacheArray:[],
    dashboardView:null,
    panelMenu:null,
    counter:1,
    acInterface:{
        getTemplatePageWithSSOMenu:"/Rest/Portlet/RunTime/Client/TemplatePageRuntime/GetTemplatePageWithSSOMenu"
    },
    getPagePOAndWidgetPOListThenRender: function () {
        AjaxUtility.Get(this.acInterface.getTemplatePageWithSSOMenu, {
            menuId:BaseUtility.GetUrlParaValue("menuId"),
        }, function (result) {

            if (result.success) {
                //console.log(result);
                this.pagePO = result.data;
                this.widgetList=result.exKVData.Widgets;

                for (let i = 0; i < this.widgetList.length; i++) {
                    if(this.widgetList[i].widgetProperties){
                        this.widgetList[i].widgetProperties=JsonUtility.StringToJson(this.widgetList[i].widgetProperties);
                    }
                }

                this.pagePO.pageConfig = JsonUtility.StringToJson(this.pagePO.pageConfig);
                this.pagePO.pageProperties = JsonUtility.StringToJson(this.pagePO.pageProperties);
                this.pagePO.pageRefCssConfig = JsonUtility.StringToJson(this.pagePO.pageRefCssConfig);
                this.pagePO.pageRefJsConfig = JsonUtility.StringToJson(this.pagePO.pageRefJsConfig);
                if (this.pagePO.pageWidgetConfig) {
                    this.pagePO.pageWidgetConfig = JsonUtility.StringToJson(this.pagePO.pageWidgetConfig);
                } else {
                    this.pagePO.pageWidgetConfig = [];
                }

                console.log(this);

                let initFunc;
                if(this.pagePO.pageRefJsConfig&&this.pagePO.pageRefJsConfig.length>0){
                    let initFuncStr="let _this=this;$LAB";
                    for (let i = 0; i < this.pagePO.pageRefJsConfig.length; i++) {
                        let refJs=this.pagePO.pageRefJsConfig[i].refJsPath;
                        refJs=StringUtility.FormatWithDefaultValue(refJs,null);
                        refJs=BaseUtility.AppendTimeStampUrl(refJs);
                        initFuncStr+=".script('"+refJs+"')"
                    }
                    initFuncStr+=".wait(function(){_this.renderPage();});"
                    //console.log(initFuncStr);
                    initFunc=Function(initFuncStr);
                }
                else{
                    initFunc=Function("this.renderPage();");
                }

                initFunc.call(this);

                if(this.pagePO.pageRefCssConfig&&this.pagePO.pageRefCssConfig.length>0){
                    for (let i = 0; i < this.pagePO.pageRefCssConfig.length; i++) {
                        let refCss=this.pagePO.pageRefCssConfig[i].refCSSPath;
                        refCss=StringUtility.FormatWithDefaultValue(refCss,null);
                        //console.log(refCss);
                        LoadJsCssUtility(refCss);
                    }
                }
            }
        }, this);
    },
    renderPage:function (){
        //console.log(this.pagePO);
        //console.log(this.widgetList);

        //let _self=this;

        let dashboardView=this.buildDashboardView();
        //this.panelMenu=this.buildWidgetMenu();

        webix.ui({
            type: "space", cols: [
                {view: "scrollview", body: dashboardView}
            ]
        });
        webix.event(document.body, "click", function (ev) {
            let css = ev.target.className;
            //console.log(css);
            if (css && css.toString().indexOf("panel_icon") != -1) {
                let classNameArray=css.split(" ");
                for (let i = 0; i < classNameArray.length; i++) {
                    if(classNameArray[i].indexOf("widgetInstanceId_")==0){
                        let widgetInstanceId=classNameArray[i].replace("widgetInstanceId_","");
                        //console.log(widgetInstanceId);
                        let widgetContextMenu=PortletPageRuntime.getWidgetInstanceCache(widgetInstanceId).widgetContextMenu;
                        if(widgetContextMenu) {
                            widgetContextMenu.setContext(webix.$$(ev.target));
                            widgetContextMenu.show(ev.target);
                        }
                    }
                }
                //_self.panelMenu.setContext(webix.$$(ev.target));
                //_self.panelMenu.show(ev.target);
            }
        });

        if(this.pagePO.pageWidgetConfig) {
            $$("dashboardViewLayout").restore(this.pagePO.pageWidgetConfig);
        }

        portletUtility.initRefreshStatus();
        portletUtility.startAutoRefreshControl(this.refreshALLWidget,this);

        var user = {
            u1: {
                name: "zzz"
            },
            u2: {
                name: "aa'a\"a"
            }
        }
        console.log(sprintf('a.do?a=%(u1.name)s&b=%(u2.name)s', user));
    },
    refreshALLWidget:function (innerVersion){
        console.log(innerVersion);
        try {
            let allWidgetInstanceArray = this.widgetInstanceCacheArray;
            for (let i = 0; i < allWidgetInstanceArray.length; i++) {
                let widgetInstance = allWidgetInstanceArray[i].instance;
                widgetInstance.refresh(innerVersion);
            }
        }
        catch (e){
            throw e;
        }
    },
    buildDashboardView:function () {
        let pagePO = this.pagePO;
        let dashboard = {
            view: "gridlayout", id: "dashboardViewLayout",
            gridColumns: pagePO.pageConfig.gridColumns,
            gridRows: pagePO.pageConfig.gridRows,
            cellHeight: pagePO.pageConfig.cellHeight,
            factory: function (obj) {
                //console.log(7777777);
                //console.log(obj);
                let widgetId = obj.name;
                let widgetInstanceId = obj.id;
                obj.view = "panel";
                obj.resize = false;
                obj.icon = "las la-bars widgetInstanceId_" + widgetInstanceId;
                obj.body = {
                    view: "template",
                    css: "webix_template_for_widget",
                    template: function (data) {
                        //let widgetPO = $$("widgetTree").getItem(data.obj.name);
                        //console.log(data);
                        return "<div name='widgetContainer' class='widget-container-outer-wrap'></div>";
                    },
                    data: {
                        pagePO: pagePO,
                        widgetId: widgetId,
                        widgetInstanceId: widgetInstanceId
                    },
                    on: {
                        //region
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
                        //endregion
                        onAfterRender: function (data) {
                            //console.log(data);
                            //console.log(555555);
                            //return;
                            //debugger;
                            let pagePO = this.data.pagePO;
                            let widgetId = this.data.widgetId;
                            let widgetInstanceId = this.data.widgetInstanceId;
                            let widgetPO = ArrayUtility.WhereSingle(PortletPageRuntime.widgetList, item => item.widgetId == widgetId);
                            let $widgetContainer=$(this.$view).find("[name='widgetContainer']");
                            let widgetContainerWidth=$widgetContainer.width();
                            let widgetContainerHeight=$widgetContainer.height();
                            //console.log($widgetContainer);
                            //console.log(widgetPO);
                            //console.log("------------onAfterRender-------------");
                            try {
                                let widgetInstance = PortletPageRuntime.newWidgetInstance(widgetInstanceId, widgetPO, pagePO,$widgetContainer,widgetContainerWidth,widgetContainerHeight);
                                if(widgetInstance) {
                                    PortletPageRuntime.counter++;
                                    $widgetContainer.append(widgetInstance.createWidgetElem());
                                    //console.log(PortletPageRuntime.counter)
                                    //$widgetContainer.append(PortletPageRuntime.counter);
                                }
                                else{
                                    $widgetContainer.append("实例化Widget失败,请检查代码1!");
                                }
                            }
                            catch (e){
                                $widgetContainer.append("实例化Widget失败,请检查代码!"+e.toString());
                                //throw e;
                            }
                            //console.log("------------onAfterRender-------------");
                        }
                    }
                };

                return obj;
            },
            on: {
                /*onChange: function () {
                    //var state = this.serialize();
                    //webix.storage.local.put("grid-dashboard-state", state);
                }
                onBeforeDrag:function (context, native_event){
                    return false;
                }*/
            }
        };
        return dashboard;
    },
    buildWidgetContextMenu:function (widgetInstanceId,menuConfig) {
        if(menuConfig.length==0){
            return null;
        }
        let menu = webix.ui({
            view: "contextmenu",
            click: function (id) {
                //console.log(widgetInstanceId);
                for (let i = 0; i < menuConfig.length; i++) {
                    if (menuConfig[i].id==id) {
                        let widgetInstance=PortletPageRuntime.getWidgetInstanceCache(widgetInstanceId).instance;
                        menuConfig[i].click.call(widgetInstance);
                    }
                }
            },
            data: menuConfig
        });
        return menu;
    },
    newWidgetInstance:function (widgetInstanceId,widgetPO,pagePO,$widgetContainer,widgetContainerWidth,widgetContainerHeight) {
        try {
            let widgetInstance = Object.create(eval(widgetPO.widgetClientRender));
            widgetInstance.widgetInstanceId = widgetInstanceId;
            widgetInstance.widgetPO = widgetPO;
            widgetInstance.pagePO = pagePO;
            widgetInstance.$widgetContainer=$widgetContainer;
            widgetInstance.widgetContainerWidth=widgetContainerWidth;
            widgetInstance.widgetContainerHeight=widgetContainerHeight;

            let widgetContextMenu = PortletPageRuntime.buildWidgetContextMenu(widgetInstanceId, widgetInstance.getContextMenuConfig());

            this.widgetInstanceCacheArray.push({
                "widgetInstanceId": widgetInstanceId,
                "instance": widgetInstance,
                "widgetContextMenu": widgetContextMenu
            })

            return widgetInstance;
        }
        catch (e){
            throw e;
        }
    },
    getWidgetInstanceCache:function (widgetInstanceId){
        for (let i = 0; i < this.widgetInstanceCacheArray.length; i++) {
            if(this.widgetInstanceCacheArray[i].widgetInstanceId==widgetInstanceId){
                return this.widgetInstanceCacheArray[i];
            }
        }
        return null;
    }
}