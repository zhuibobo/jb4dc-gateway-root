let PortletPageRuntimeDependGridStack={
    pagePO:null,
    widgetList:null,
    widgetInstanceCacheArray:[],
    dashboardView:null,
    panelMenu:null,
    counter:1,
    acInterface:{
        getTemplatePageWithSSOMenu:"/Rest/Portlet/RunTime/Client/TemplatePageRuntime/GetTemplatePageWithSSOMenu"
    },
    GetPagePOAndWidgetPOListThenRender: function () {
        AjaxUtility.Get(this.acInterface.getTemplatePageWithSSOMenu, {
            menuId:BaseUtility.GetUrlParaValue("menuId"),
        }, function (result) {

            if (result.success) {
                //console.log(result);
                this.pagePO = result.data;
                this.widgetList=result.exKVData.Widgets;

                //return;
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

                //console.log(this);

                let initFunc;
                if(this.pagePO.pageRefJsConfig&&this.pagePO.pageRefJsConfig.length>0){
                    let initFuncStr="let _this=this;$LAB";
                    for (let i = 0; i < this.pagePO.pageRefJsConfig.length; i++) {
                        let refJs=this.pagePO.pageRefJsConfig[i].refJsPath;
                        refJs=StringUtility.FormatWithDefaultValue(refJs,null);
                        refJs=BaseUtility.AppendTimeStampUrl(refJs);
                        initFuncStr+=".script('"+refJs+"')"
                    }
                    initFuncStr+=".wait(function(){_this.RenderPage();});"
                    //console.log(initFuncStr);
                    initFunc=Function(initFuncStr);
                }
                else{
                    initFunc=Function("this.RenderPage();");
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
    RenderPage:function (){
        console.log(this.pagePO);
        console.log(this.widgetList);

        let dashboardView=this.BuildDashboardView();

        /*webix.ui({
            type: "space", cols: [
                {view: "scrollview", body: dashboardView}
            ]
        });
        webix.event(document.body, "click", function (ev) {
            let css = ev.target.className;
            if (css && css.toString().indexOf("panel_icon") != -1) {
                let classNameArray=css.split(" ");
                for (let i = 0; i < classNameArray.length; i++) {
                    if(classNameArray[i].indexOf("widgetInstanceId_")==0){
                        let widgetInstanceId=classNameArray[i].replace("widgetInstanceId_","");
                        let widgetContextMenu=PortletPageRuntimeDependGridStack.GetWidgetInstanceCache(widgetInstanceId).widgetContextMenu;
                        if(widgetContextMenu) {
                            widgetContextMenu.setContext(webix.$$(ev.target));
                            widgetContextMenu.show(ev.target);
                        }
                    }
                }
            }
        });*/

        if(this.pagePO.pageWidgetConfig) {
            //$$("dashboardViewLayout").restore(this.pagePO.pageWidgetConfig);
        }

        portletUtility.InitRefreshStatus();
        portletUtility.StartAutoRefreshControl(this.RefreshALLWidget,this);
    },
    RefreshALLWidget:function (innerVersion){
        console.log(innerVersion);
        try {
            let allWidgetInstanceArray = this.widgetInstanceCacheArray;
            for (let i = 0; i < allWidgetInstanceArray.length; i++) {
                let widgetInstance = allWidgetInstanceArray[i].instance;
                widgetInstance.Refresh(innerVersion);
            }
        }
        catch (e){
            throw e;
        }
    },
    BuildDashboardView:function () {
        let pagePO = this.pagePO;
        pagePO.pageConfig = $.extend(true, {}, pagePO.pageConfig, {
            disableDrag:true,
            disableResize:true
        });
        this.dashboardView = GridStack.init(pagePO.pageConfig);
        this.dashboardView.on('added',  (event, items)=>{
            console.log(items);
            for (let i = 0; i < items.length; i++) {
                this.CreateWidget(items[i]);
            }
            //pageObj.buildContextMenu(".widget-menu");
        });
        let pageWidgetConfig = pagePO.pageWidgetConfig;
        this.dashboardView.load(pageWidgetConfig, true);
    },
    CreateWidget:function (node){
        let pagePO = this.pagePO;
        let widgetId = node.widgetId;
        let widgetInstanceId = node.widgetSingleId;
        let widgetPO = ArrayUtility.WhereSingle(this.widgetList, item => item.widgetId == widgetId);
        let $widgetContainer=$(node.el).find(".grid-stack-item-content");
        let widgetContainerWidth=$widgetContainer.width();
        let widgetContainerHeight=$widgetContainer.height();
        $(node.el).find(".grid-stack-item-content").html("");
        //console.log(widgetContainerWidth);
        //console.log(widgetContainerHeight);
        //console.log($widgetContainer);
        //console.log(widgetPO);
        //console.log("------------onAfterRender-------------");
        try {
            let widgetInstance = this.NewWidgetInstance(widgetInstanceId, widgetPO, pagePO,$widgetContainer,widgetContainerWidth,widgetContainerHeight);
            if(widgetInstance) {
                this.counter++;
                $widgetContainer.append(widgetInstance.CreateWidgetElem());
                //console.log(PortletPageRuntimeDependWebix.counter)
                //$widgetContainer.append(PortletPageRuntimeDependWebix.counter);
            }
            else{
                $widgetContainer.append("实例化Widget失败,请检查代码!");
            }
        }
        catch (e){
            $widgetContainer.append("实例化Widget失败,请检查代码!"+e.toString());
            //throw e;
        }
    },
    NewWidgetInstance:function (widgetInstanceId, widgetPO, pagePO, $widgetContainer, widgetContainerWidth, widgetContainerHeight) {
        try {
            let widgetInstance = Object.create(eval(widgetPO.widgetClientRender));
            widgetInstance.widgetInstanceId = widgetInstanceId;
            widgetInstance.widgetPO = widgetPO;
            widgetInstance.pagePO = pagePO;
            widgetInstance.$widgetContainer=$widgetContainer;
            widgetInstance.widgetContainerWidth=widgetContainerWidth;
            widgetInstance.widgetContainerHeight=widgetContainerHeight;

            //let widgetContextMenu = PortletPageRuntimeDependGridStack.BuildWidgetContextMenu(widgetInstanceId, widgetInstance.GetContextMenuConfig());
            let widgetContextMenu = null;

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
    GetWidgetInstanceCache:function (widgetInstanceId){
        for (let i = 0; i < this.widgetInstanceCacheArray.length; i++) {
            if(this.widgetInstanceCacheArray[i].widgetInstanceId==widgetInstanceId){
                return this.widgetInstanceCacheArray[i];
            }
        }
        return null;
    }
}