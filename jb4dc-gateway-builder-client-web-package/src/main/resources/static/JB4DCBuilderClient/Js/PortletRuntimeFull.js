"use strict";

var PortletPageRuntimeDependGridStack = {
  pagePO: null,
  widgetList: null,
  widgetInstanceCacheArray: [],
  dashboardView: null,
  panelMenu: null,
  counter: 1,
  acInterface: {
    getTemplatePageWithSSOMenu: "/Rest/Portlet/RunTime/Client/TemplatePageRuntime/GetTemplatePageWithSSOMenu"
  },
  GetPagePOAndWidgetPOListThenRender: function GetPagePOAndWidgetPOListThenRender() {
    AjaxUtility.Get(this.acInterface.getTemplatePageWithSSOMenu, {
      menuId: BaseUtility.GetUrlParaValue("menuId")
    }, function (result) {
      if (result.success) {
        this.pagePO = result.data;
        this.widgetList = result.exKVData.Widgets;

        for (var i = 0; i < this.widgetList.length; i++) {
          if (this.widgetList[i].widgetProperties) {
            this.widgetList[i].widgetProperties = JsonUtility.StringToJson(this.widgetList[i].widgetProperties);
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

        var initFunc;

        if (this.pagePO.pageRefJsConfig && this.pagePO.pageRefJsConfig.length > 0) {
          var initFuncStr = "let _this=this;$LAB";

          for (var _i = 0; _i < this.pagePO.pageRefJsConfig.length; _i++) {
            var refJs = this.pagePO.pageRefJsConfig[_i].refJsPath;
            refJs = StringUtility.FormatWithDefaultValue(refJs, null);
            refJs = BaseUtility.AppendTimeStampUrl(refJs);
            initFuncStr += ".script('" + refJs + "')";
          }

          initFuncStr += ".wait(function(){_this.RenderPage();});";
          initFunc = Function(initFuncStr);
        } else {
          initFunc = Function("this.RenderPage();");
        }

        initFunc.call(this);

        if (this.pagePO.pageRefCssConfig && this.pagePO.pageRefCssConfig.length > 0) {
          for (var _i2 = 0; _i2 < this.pagePO.pageRefCssConfig.length; _i2++) {
            var refCss = this.pagePO.pageRefCssConfig[_i2].refCSSPath;
            refCss = StringUtility.FormatWithDefaultValue(refCss, null);
            LoadJsCssUtility(refCss);
          }
        }
      }
    }, this);
  },
  RenderPage: function RenderPage() {
    console.log(this.pagePO);
    console.log(this.widgetList);
    var dashboardView = this.BuildDashboardView();

    if (this.pagePO.pageWidgetConfig) {}

    portletUtility.InitRefreshStatus();
    portletUtility.StartAutoRefreshControl(this.RefreshALLWidget, this);
  },
  RefreshALLWidget: function RefreshALLWidget(innerVersion) {
    console.log(innerVersion);

    try {
      var allWidgetInstanceArray = this.widgetInstanceCacheArray;

      for (var i = 0; i < allWidgetInstanceArray.length; i++) {
        var widgetInstance = allWidgetInstanceArray[i].instance;
        widgetInstance.Refresh(innerVersion);
      }
    } catch (e) {
      throw e;
    }
  },
  BuildDashboardView: function BuildDashboardView() {
    var _this = this;

    var pagePO = this.pagePO;
    pagePO.pageConfig = $.extend(true, {}, pagePO.pageConfig, {
      disableDrag: true,
      disableResize: true
    });
    this.dashboardView = GridStack.init(pagePO.pageConfig);
    this.dashboardView.on('added', function (event, items) {
      console.log(items);

      for (var i = 0; i < items.length; i++) {
        _this.CreateWidget(items[i]);
      }
    });
    var pageWidgetConfig = pagePO.pageWidgetConfig;
    this.dashboardView.load(pageWidgetConfig, true);
  },
  CreateWidget: function CreateWidget(node) {
    var pagePO = this.pagePO;
    var widgetId = node.widgetId;
    var widgetInstanceId = node.widgetSingleId;
    var widgetPO = ArrayUtility.WhereSingle(this.widgetList, function (item) {
      return item.widgetId == widgetId;
    });
    var $widgetContainer = $(node.el).find(".grid-stack-item-content");
    var widgetContainerWidth = $widgetContainer.width();
    var widgetContainerHeight = $widgetContainer.height();
    $(node.el).find(".grid-stack-item-content").html("");

    try {
      var widgetInstance = this.NewWidgetInstance(widgetInstanceId, widgetPO, pagePO, $widgetContainer, widgetContainerWidth, widgetContainerHeight);

      if (widgetInstance) {
        this.counter++;
        $widgetContainer.append(widgetInstance.CreateWidgetElem());
      } else {
        $widgetContainer.append("实例化Widget失败,请检查代码!");
      }
    } catch (e) {
      $widgetContainer.append("实例化Widget失败,请检查代码!" + e.toString());
    }
  },
  NewWidgetInstance: function NewWidgetInstance(widgetInstanceId, widgetPO, pagePO, $widgetContainer, widgetContainerWidth, widgetContainerHeight) {
    try {
      var widgetInstance = Object.create(eval(widgetPO.widgetClientRender));
      widgetInstance.widgetInstanceId = widgetInstanceId;
      widgetInstance.widgetPO = widgetPO;
      widgetInstance.pagePO = pagePO;
      widgetInstance.$widgetContainer = $widgetContainer;
      widgetInstance.widgetContainerWidth = widgetContainerWidth;
      widgetInstance.widgetContainerHeight = widgetContainerHeight;
      var widgetContextMenu = null;
      this.widgetInstanceCacheArray.push({
        "widgetInstanceId": widgetInstanceId,
        "instance": widgetInstance,
        "widgetContextMenu": widgetContextMenu
      });
      return widgetInstance;
    } catch (e) {
      throw e;
    }
  },
  GetWidgetInstanceCache: function GetWidgetInstanceCache(widgetInstanceId) {
    for (var i = 0; i < this.widgetInstanceCacheArray.length; i++) {
      if (this.widgetInstanceCacheArray[i].widgetInstanceId == widgetInstanceId) {
        return this.widgetInstanceCacheArray[i];
      }
    }

    return null;
  }
};
"use strict";

var PortletPageRuntimeDependWebix = {
  pagePO: null,
  widgetList: null,
  widgetInstanceCacheArray: [],
  dashboardView: null,
  panelMenu: null,
  counter: 1,
  acInterface: {
    getTemplatePageWithSSOMenu: "/Rest/Portlet/RunTime/Client/TemplatePageRuntime/GetTemplatePageWithSSOMenu"
  },
  GetPagePOAndWidgetPOListThenRender: function GetPagePOAndWidgetPOListThenRender() {
    AjaxUtility.Get(this.acInterface.getTemplatePageWithSSOMenu, {
      menuId: BaseUtility.GetUrlParaValue("menuId")
    }, function (result) {
      if (result.success) {
        this.pagePO = result.data;
        this.widgetList = result.exKVData.Widgets;

        for (var i = 0; i < this.widgetList.length; i++) {
          if (this.widgetList[i].widgetProperties) {
            this.widgetList[i].widgetProperties = JsonUtility.StringToJson(this.widgetList[i].widgetProperties);
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
        var initFunc;

        if (this.pagePO.pageRefJsConfig && this.pagePO.pageRefJsConfig.length > 0) {
          var initFuncStr = "let _this=this;$LAB";

          for (var _i = 0; _i < this.pagePO.pageRefJsConfig.length; _i++) {
            var refJs = this.pagePO.pageRefJsConfig[_i].refJsPath;
            refJs = StringUtility.FormatWithDefaultValue(refJs, null);
            refJs = BaseUtility.AppendTimeStampUrl(refJs);
            initFuncStr += ".script('" + refJs + "')";
          }

          initFuncStr += ".wait(function(){_this.RenderPage();});";
          initFunc = Function(initFuncStr);
        } else {
          initFunc = Function("this.RenderPage();");
        }

        initFunc.call(this);

        if (this.pagePO.pageRefCssConfig && this.pagePO.pageRefCssConfig.length > 0) {
          for (var _i2 = 0; _i2 < this.pagePO.pageRefCssConfig.length; _i2++) {
            var refCss = this.pagePO.pageRefCssConfig[_i2].refCSSPath;
            refCss = StringUtility.FormatWithDefaultValue(refCss, null);
            LoadJsCssUtility(refCss);
          }
        }
      }
    }, this);
  },
  RenderPage: function RenderPage() {
    var dashboardView = this.BuildDashboardView();
    webix.ui({
      type: "space",
      cols: [{
        view: "scrollview",
        body: dashboardView
      }]
    });
    webix.event(document.body, "click", function (ev) {
      var css = ev.target.className;

      if (css && css.toString().indexOf("panel_icon") != -1) {
        var classNameArray = css.split(" ");

        for (var i = 0; i < classNameArray.length; i++) {
          if (classNameArray[i].indexOf("widgetInstanceId_") == 0) {
            var widgetInstanceId = classNameArray[i].replace("widgetInstanceId_", "");
            var widgetContextMenu = PortletPageRuntimeDependWebix.GetWidgetInstanceCache(widgetInstanceId).widgetContextMenu;

            if (widgetContextMenu) {
              widgetContextMenu.setContext(webix.$$(ev.target));
              widgetContextMenu.show(ev.target);
            }
          }
        }
      }
    });

    if (this.pagePO.pageWidgetConfig) {
      $$("dashboardViewLayout").restore(this.pagePO.pageWidgetConfig);
    }

    portletUtility.InitRefreshStatus();
    portletUtility.StartAutoRefreshControl(this.RefreshALLWidget, this);
    var user = {
      u1: {
        name: "zzz"
      },
      u2: {
        name: "aa'a\"a"
      }
    };
    console.log(sprintf('a.do?a=%(u1.name)s&b=%(u2.name)s', user));
  },
  RefreshALLWidget: function RefreshALLWidget(innerVersion) {
    console.log(innerVersion);

    try {
      var allWidgetInstanceArray = this.widgetInstanceCacheArray;

      for (var i = 0; i < allWidgetInstanceArray.length; i++) {
        var widgetInstance = allWidgetInstanceArray[i].instance;
        widgetInstance.Refresh(innerVersion);
      }
    } catch (e) {
      throw e;
    }
  },
  BuildDashboardView: function BuildDashboardView() {
    var pagePO = this.pagePO;
    var dashboard = {
      view: "gridlayout",
      id: "dashboardViewLayout",
      gridColumns: pagePO.pageConfig.gridColumns,
      gridRows: pagePO.pageConfig.gridRows,
      cellHeight: pagePO.pageConfig.cellHeight,
      factory: function factory(obj) {
        var widgetId = obj.name;
        var widgetInstanceId = obj.id;
        obj.view = "panel";
        obj.resize = false;
        obj.icon = "las la-bars widgetInstanceId_" + widgetInstanceId;
        obj.body = {
          view: "template",
          css: "webix_template_for_widget",
          template: function template(data) {
            return "<div name='widgetContainer' class='widget-container-outer-wrap'></div>";
          },
          data: {
            pagePO: pagePO,
            widgetId: widgetId,
            widgetInstanceId: widgetInstanceId
          },
          on: {
            onViewShow: function onViewShow() {},
            onAfterLoad: function onAfterLoad() {},
            onBlur: function onBlur(prev_view) {},
            onBeforeRender: function onBeforeRender(data) {},
            onAfterRender: function onAfterRender(data) {
              var pagePO = this.data.pagePO;
              var widgetId = this.data.widgetId;
              var widgetInstanceId = this.data.widgetInstanceId;
              var widgetPO = ArrayUtility.WhereSingle(PortletPageRuntimeDependWebix.widgetList, function (item) {
                return item.widgetId == widgetId;
              });
              var $widgetContainer = $(this.$view).find("[name='widgetContainer']");
              var widgetContainerWidth = $widgetContainer.width();
              var widgetContainerHeight = $widgetContainer.height();

              try {
                var widgetInstance = PortletPageRuntimeDependWebix.NewWidgetInstance(widgetInstanceId, widgetPO, pagePO, $widgetContainer, widgetContainerWidth, widgetContainerHeight);

                if (widgetInstance) {
                  PortletPageRuntimeDependWebix.counter++;
                  $widgetContainer.append(widgetInstance.CreateWidgetElem());
                } else {
                  $widgetContainer.append("实例化Widget失败,请检查代码1!");
                }
              } catch (e) {
                $widgetContainer.append("实例化Widget失败,请检查代码!" + e.toString());
              }
            }
          }
        };
        return obj;
      },
      on: {}
    };
    return dashboard;
  },
  BuildWidgetContextMenu: function BuildWidgetContextMenu(widgetInstanceId, menuConfig) {
    if (menuConfig.length == 0) {
      return null;
    }

    var menu = webix.ui({
      view: "contextmenu",
      click: function click(id) {
        for (var i = 0; i < menuConfig.length; i++) {
          if (menuConfig[i].id == id) {
            var widgetInstance = PortletPageRuntimeDependWebix.GetWidgetInstanceCache(widgetInstanceId).instance;
            menuConfig[i].click.call(widgetInstance);
          }
        }
      },
      data: menuConfig
    });
    return menu;
  },
  NewWidgetInstance: function NewWidgetInstance(widgetInstanceId, widgetPO, pagePO, $widgetContainer, widgetContainerWidth, widgetContainerHeight) {
    try {
      var widgetInstance = Object.create(eval(widgetPO.widgetClientRender));
      widgetInstance.widgetInstanceId = widgetInstanceId;
      widgetInstance.widgetPO = widgetPO;
      widgetInstance.pagePO = pagePO;
      widgetInstance.$widgetContainer = $widgetContainer;
      widgetInstance.widgetContainerWidth = widgetContainerWidth;
      widgetInstance.widgetContainerHeight = widgetContainerHeight;
      var widgetContextMenu = PortletPageRuntimeDependWebix.BuildWidgetContextMenu(widgetInstanceId, widgetInstance.GetContextMenuConfig());
      this.widgetInstanceCacheArray.push({
        "widgetInstanceId": widgetInstanceId,
        "instance": widgetInstance,
        "widgetContextMenu": widgetContextMenu
      });
      return widgetInstance;
    } catch (e) {
      throw e;
    }
  },
  GetWidgetInstanceCache: function GetWidgetInstanceCache(widgetInstanceId) {
    for (var i = 0; i < this.widgetInstanceCacheArray.length; i++) {
      if (this.widgetInstanceCacheArray[i].widgetInstanceId == widgetInstanceId) {
        return this.widgetInstanceCacheArray[i];
      }
    }

    return null;
  }
};
"use strict";

var portletUtility = {
  refreshVersionKey: "portletUtility-RefreshVersion",
  innerVersion: null,
  autoRefreshControlFunc: null,
  GetRefreshVersion: function GetRefreshVersion() {
    var refreshVersion = LocalStorageUtility.getItem(this.refreshVersionKey);

    if (!refreshVersion) {
      refreshVersion = 1;
    }

    return refreshVersion;
  },
  UpdateRefreshVersion: function UpdateRefreshVersion() {
    var refreshVersion = this.GetRefreshVersion();
    refreshVersion++;
    LocalStorageUtility.setItem(this.refreshVersionKey, refreshVersion);
  },
  InitRefreshStatus: function InitRefreshStatus() {
    LocalStorageUtility.setItem(this.refreshVersionKey, 1);
    this.UpdateRefreshVersion();
    this.innerVersion = this.GetRefreshVersion();
  },
  NeedToBeRefresh: function NeedToBeRefresh() {
    var newRefreshVersion = this.GetRefreshVersion();

    if (newRefreshVersion > this.innerVersion) {
      this.innerVersion = newRefreshVersion;
      return true;
    }

    return false;
  },
  StartAutoRefreshControl: function StartAutoRefreshControl(refreshFunc, caller) {
    portletUtility.autoRefreshControlFunc = refreshFunc;
    window.setInterval(function () {
      if (portletUtility.NeedToBeRefresh()) {
        portletUtility.autoRefreshControlFunc.call(caller, portletUtility.innerVersion);
      }
    }, 1000);
  }
};
"use strict";

var WidgetControl = {
  CreateWidgetElem: function CreateWidgetElem(menuConfig) {
    this.$widgetContainerInnerWrap = $("<div class='widget-container-inner-wrap'></div>");
    this.$widgetContainerInnerWrap.append(this._BuildToolBar(this.widgetPO, this.widgetInstanceId, menuConfig));
    this.$widgetBody = this._BuildBodyElem();
    this.$widgetContainerInnerWrap.append(this.$widgetBody);
    return this.$widgetContainerInnerWrap;
  },
  NotRefresh: function NotRefresh(innerVersion) {},
  _BuildToolBar: function _BuildToolBar(widgetPO, widgetInstanceId, menuConfig) {
    var menuElemId = "menu_" + widgetInstanceId;
    var widgetToolBar = $("<div class='widget-tool-bar'><div class='widget-title'><i class='las la-angle-right'></i>" + widgetPO.widgetTitle + "</div><div class='widget-menu' id='" + menuElemId + "'><i class='las la-align-justify context-menu-one'></i></div></div>");

    if (JsonUtility.JsonToString(menuConfig) != "{}") {
      $.contextMenu({
        selector: "#" + menuElemId,
        trigger: 'left',
        items: menuConfig
      });
    }

    return widgetToolBar;
  },
  GetDefaultContextMenuConfig: function GetDefaultContextMenuConfig() {
    var _this = this;

    return {
      "instructions": {
        name: "详情",
        icon: "edit",
        callback: function callback(itemKey, opt, e) {
          _this.OnContextMenuInstructionsEvent();

          console.log(_this.widgetInstanceId);
        }
      },
      "more": {
        name: "更多",
        icon: "edit",
        callback: function callback(itemKey, opt, e) {
          _this.OnContextMenuMoreEvent();

          console.log(_this.widgetInstanceId);
        }
      },
      "sep1": "---------",
      "quit": {
        name: "退出",
        icon: "context-menu-icon context-menu-icon-quit",
        callback: function callback(itemKey, opt, e) {}
      }
    };
  },
  GetEmptyContextMenuConfig: function GetEmptyContextMenuConfig() {
    return {};
  }
};
"use strict";

var WidgetDemoData = {
  GetDemoBody: function GetDemoBody() {
    return "winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。";
  },
  GetQuickEntryDemoProps: function GetQuickEntryDemoProps() {
    return {
      QuickEntries: [{
        name: "事务发起",
        caption: "事务发起",
        openType: "innerIframe",
        url: "/QCSystem/JB4DCBuilderClient/HTML/WorkFlow/Runtime/MyBootableMyModels.html?menuId=QCSystem-WorkFlow-Client-Bootable",
        image: "0265.png"
      }, {
        name: "发文发起",
        caption: "发文发起",
        openType: "menu",
        image: "0223.png"
      }, {
        name: "收文发起",
        caption: "收文发起",
        openType: "menu",
        image: "0255.png"
      }, {
        name: "文件传递",
        caption: "文件传递",
        openType: "menu",
        image: "0247.png"
      }]
    };
  },
  GetToDoListWidgetProps: function GetToDoListWidgetProps() {
    return {
      list: {
        getListDateRest: "/%(appContextPath)s/Rest/Extension/Portlet/WorkflowTransform/GetMyProcessTaskList",
        getListDateRestParas: {
          modelCategory: "GeneralProcess",
          pageSize: 12
        },
        openType: "frameIframe",
        dialogConfig: {
          height: 0,
          width: 0,
          title: "JB4DC",
          modal: true
        },
        fieldParsing: {
          timeFormat: "%(instanceEntity.instCreateTime)s",
          titleFormat: "[标题]%(instanceEntity.instTitle)s-%(extaskCurNodeName)s"
        },
        openUrl: "/%(appContextPath)s/JB4DCBuilderClient/HTML/WorkFlow/Runtime/MyProcessInstanceMainTask.html?op=update&extaskId=%(extaskId)s",
        printRowData: false
      },
      more: {
        openType: "frameIframe",
        dialogConfig: {
          height: 0,
          width: 0,
          title: "JB4DC",
          modal: true
        },
        openUrl: "/%(appContextPath)s/JB4DCBuilderClient/HTML/WorkFlow/Runtime/MyProcessInstanceMainTaskList.html?menuId=QCSystem-WorkFlow-Client-MyTask"
      }
    };
  },
  GetDemoToDoListData: function GetDemoToDoListData() {
    return [{
      prefix: "正常",
      title: "winsw的使用比较简单。",
      date: "2021-05-06 12:55:12"
    }, {
      prefix: "加急",
      title: "winsw的使用比较简单。要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；",
      date: "2021-05-05 12:55:12"
    }, {
      prefix: "重要",
      title: "winsw的使用比较简单。",
      date: "2021-05-05 12:55:12"
    }, {
      prefix: "重要",
      title: "winsw的使用比较简单。要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；",
      date: "2021-05-05 12:55:12"
    }, {
      prefix: "正常",
      title: "winsw的使用比较简单。",
      date: "2021-05-05 12:55:12"
    }, {
      prefix: "正常",
      title: "winsw的使用比较简单。sw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。w",
      date: "2021-05-05 12:55:12"
    }, {
      prefix: "正常",
      title: "winsw的使用比较简单。.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置",
      date: "2021-05-05 12:55:12"
    }, {
      prefix: "正常",
      title: "winsw的使用比较简单。sw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。w",
      date: "2021-05-05 12:55:12"
    }, {
      prefix: "正常",
      title: "winsw的使用比较简单。.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置",
      date: "2021-05-05 12:55:12"
    }, {
      prefix: "正常",
      title: "winsw的使用比较简单。.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置",
      date: "2021-05-05 12:55:12"
    }, {
      prefix: "正常",
      title: "winsw的使用比较简单。",
      date: "2021-05-05 12:55:12"
    }, {
      prefix: "正常",
      title: "winsw的使用比较简单。sw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。w",
      date: "2021-05-05 12:55:12"
    }, {
      prefix: "正常",
      title: "winsw的使用比较简单。",
      date: "2021-05-05 12:55:12"
    }];
  }
};
"use strict";

var PortletDefaultListWidgetControl = {
  widgetInstanceId: "",
  widgetPO: null,
  pagePO: null,
  host: null,
  $widgetBody: null,
  $widgetContainerInnerWrap: null,
  $widgetContainer: null,
  widgetContainerWidth: null,
  widgetContainerHeight: null,
  CreateWidgetElem: function CreateWidgetElem() {
    return WidgetControl.CreateWidgetElem.call(this, this.GetContextMenuConfig());
  },
  Refresh: function Refresh() {
    this.$widgetBody.remove();
    this.$widgetBody = this._BuildBodyElem();
    this.$widgetContainerInnerWrap.append(this.$widgetBody);
    console.log("PortletDefaultListWidgetControl.Refresh");
  },
  GetContextMenuConfig: function GetContextMenuConfig() {
    return WidgetControl.GetDefaultContextMenuConfig.call(this);
  },
  OnContextMenuInstructionsEvent: function OnContextMenuInstructionsEvent() {
    console.log("暂无介绍!");
  },
  OnContextMenuMoreEvent: function OnContextMenuMoreEvent() {
    var moreProp = this.widgetPO.widgetProperties.more;
    var dialogConfig = moreProp.dialogConfig;

    if (moreProp.openType == "frameIframe") {
      var openUrl = moreProp.openUrl;
      openUrl = StringUtility.FormatWithDefaultValue(openUrl, true, null, null);
      DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId05, openUrl, dialogConfig, 1, true);
    }
  },
  _BuildToolBar: WidgetControl._BuildToolBar,
  _BuildBodyElem: function _BuildBodyElem() {
    var restUrl = this.widgetPO.widgetProperties.list.getListDateRest;
    var restParas = this.widgetPO.widgetProperties.list.getListDateRestParas;
    AjaxUtility.Post(restUrl, restParas, function (result) {
      if (result.success) {
        console.log(result);
        var widgetProperties = this.widgetPO.widgetProperties;
        var $listInnerWrap = this.$widgetBody.find(".widget-list-inner-wrap");

        for (var i = 0; i < result.data.list.length; i++) {
          var rowData = result.data.list[i];

          var $singleRowElem = this._BuildSingleRow(rowData);

          $listInnerWrap.append($singleRowElem);
        }
      }
    }, this);
    var $widgetBody = $("<div class='widget-body'><div class='widget-list-outer-wrap'><div class='widget-list-inner-wrap'></div></div></div>");
    return $widgetBody;
  },
  _BuildSingleRow: function _BuildSingleRow(rowData) {
    if (this.widgetPO.widgetProperties.list.printRowData) {
      console.log(rowData);
    }

    var fieldParsing = this.widgetPO.widgetProperties.list.fieldParsing;
    var titleWidth = this.widgetContainerWidth - 66;
    var timeStr = StringUtility.FormatSprintfJsonObj(fieldParsing.timeFormat, rowData);
    var timeObj = DateUtility.ConvertFromString(timeStr);
    var dateShort = DateUtility.Format(timeObj, "MM-dd");
    var titleStr = StringUtility.FormatSprintfJsonObj(fieldParsing.titleFormat, rowData);
    var $rowElem = $("<div class='widget-list-row-wrap'><div class='widget-list-title' style='width: " + titleWidth + "px;margin-right: 4px'><i class=\"las la-chevron-right\"></i>" + titleStr + "</div><div class='widget-list-date' style='width: 40px;'>" + dateShort + "</div></div>");
    $rowElem.bind("click", {
      rowData: rowData,
      "widgetInstance": this
    }, function (sender) {
      sender.data.widgetInstance._BuildSingleRowClickEvent.call(sender.data.widgetInstance, sender.data.rowData);
    });
    return $rowElem;
  },
  _BuildSingleRowClickEvent: function _BuildSingleRowClickEvent(rowData) {
    var listProp = this.widgetPO.widgetProperties.list;
    var dialogConfig = listProp.dialogConfig;

    function openUrlFunc(openUrl, dialogConfig) {
      DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId06, openUrl, dialogConfig, 1, true);
    }

    if (listProp.openUrlFormatRest) {} else {
      if (listProp.openType == "frameIframe") {
        var openUrl = listProp.openUrl;
        openUrl = StringUtility.FormatWithDefaultValue(openUrl, true, rowData, null);
        openUrlFunc(openUrl, dialogConfig);
      }
    }

    console.log(rowData);
  }
};
"use strict";

var PortletDefaultQuickEntryWidgetControl = {
  widgetInstanceId: "",
  widgetPO: null,
  pagePO: null,
  host: null,
  $widgetBody: null,
  $widgetContainerInnerWrap: null,
  $widgetContainer: null,
  widgetContainerWidth: null,
  widgetContainerHeight: null,
  CreateWidgetElem: function CreateWidgetElem() {
    return WidgetControl.CreateWidgetElem.call(this, this.GetContextMenuConfig());
  },
  Refresh: WidgetControl.NotRefresh,
  GetContextMenuConfig: function GetContextMenuConfig() {
    return WidgetControl.GetEmptyContextMenuConfig.call(this);
  },
  _BuildToolBar: WidgetControl._BuildToolBar,
  _BuildBodyElem: function _BuildBodyElem() {
    var widgetProps = this.widgetPO.widgetProperties;
    var $widgetBody = $("<div class='widget-body'><div class='widget-quick-entry-outer-wrap'><div class='widget-quick-entry-inner-wrap'></div></div></div>");
    var $quickEntryInnerWrap = $widgetBody.find(".widget-quick-entry-inner-wrap");

    for (var i = 0; i < widgetProps.QuickEntries.length; i++) {
      var quickEntry = widgetProps.QuickEntries[i];

      var $quickElem = this._BuildSingleQuickEntry(quickEntry);

      $quickEntryInnerWrap.append($quickElem);
    }

    return $widgetBody;
  },
  _BuildSingleQuickEntry: function _BuildSingleQuickEntry(quickEntry) {
    var $quickElemWrap = $("<div class='widget-quick-elem-wrap'><div style='margin: auto;text-align: center'><img src='/Themes/Png32X32/" + quickEntry.image + "' /></div><div>" + quickEntry.caption + "</div></div>");
    $quickElemWrap.bind("click", {
      quickEntry: quickEntry,
      "widgetInstance": this
    }, function (sender) {
      sender.data.widgetInstance._BindSingleQuickEntryClickEvent.call(sender.data.widgetInstance, sender.data.quickEntry);
    });
    return $quickElemWrap;
  },
  _BindSingleQuickEntryClickEvent: function _BindSingleQuickEntryClickEvent(quickEntry) {
    console.log(quickEntry);

    if (quickEntry.openType == "innerIframe") {
      DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, quickEntry.url, {}, 1);
    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBvcnRsZXRQYWdlUnVudGltZURlcGVuZEdyaWRTdGFjay5qcyIsIlBvcnRsZXRQYWdlUnVudGltZURlcGVuZFdlYml4LmpzIiwiUG9ydGxldFV0aWxpdHkuanMiLCJXaWRnZXRDb250cm9sLmpzIiwiV2lkZ2V0RGVtb0RhdGEuanMiLCJXaWRnZXRzL1BvcnRsZXREZWZhdWx0TGlzdFdpZGdldENvbnRyb2wuanMiLCJXaWRnZXRzL1BvcnRsZXREZWZhdWx0UXVpY2tFbnRyeVdpZGdldENvbnRyb2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJQb3J0bGV0UnVudGltZUZ1bGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIFBvcnRsZXRQYWdlUnVudGltZURlcGVuZEdyaWRTdGFjayA9IHtcbiAgcGFnZVBPOiBudWxsLFxuICB3aWRnZXRMaXN0OiBudWxsLFxuICB3aWRnZXRJbnN0YW5jZUNhY2hlQXJyYXk6IFtdLFxuICBkYXNoYm9hcmRWaWV3OiBudWxsLFxuICBwYW5lbE1lbnU6IG51bGwsXG4gIGNvdW50ZXI6IDEsXG4gIGFjSW50ZXJmYWNlOiB7XG4gICAgZ2V0VGVtcGxhdGVQYWdlV2l0aFNTT01lbnU6IFwiL1Jlc3QvUG9ydGxldC9SdW5UaW1lL0NsaWVudC9UZW1wbGF0ZVBhZ2VSdW50aW1lL0dldFRlbXBsYXRlUGFnZVdpdGhTU09NZW51XCJcbiAgfSxcbiAgR2V0UGFnZVBPQW5kV2lkZ2V0UE9MaXN0VGhlblJlbmRlcjogZnVuY3Rpb24gR2V0UGFnZVBPQW5kV2lkZ2V0UE9MaXN0VGhlblJlbmRlcigpIHtcbiAgICBBamF4VXRpbGl0eS5HZXQodGhpcy5hY0ludGVyZmFjZS5nZXRUZW1wbGF0ZVBhZ2VXaXRoU1NPTWVudSwge1xuICAgICAgbWVudUlkOiBCYXNlVXRpbGl0eS5HZXRVcmxQYXJhVmFsdWUoXCJtZW51SWRcIilcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgdGhpcy5wYWdlUE8gPSByZXN1bHQuZGF0YTtcbiAgICAgICAgdGhpcy53aWRnZXRMaXN0ID0gcmVzdWx0LmV4S1ZEYXRhLldpZGdldHM7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLndpZGdldExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAodGhpcy53aWRnZXRMaXN0W2ldLndpZGdldFByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIHRoaXMud2lkZ2V0TGlzdFtpXS53aWRnZXRQcm9wZXJ0aWVzID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKHRoaXMud2lkZ2V0TGlzdFtpXS53aWRnZXRQcm9wZXJ0aWVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBhZ2VQTy5wYWdlQ29uZmlnID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKHRoaXMucGFnZVBPLnBhZ2VDb25maWcpO1xuICAgICAgICB0aGlzLnBhZ2VQTy5wYWdlUHJvcGVydGllcyA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbih0aGlzLnBhZ2VQTy5wYWdlUHJvcGVydGllcyk7XG4gICAgICAgIHRoaXMucGFnZVBPLnBhZ2VSZWZDc3NDb25maWcgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24odGhpcy5wYWdlUE8ucGFnZVJlZkNzc0NvbmZpZyk7XG4gICAgICAgIHRoaXMucGFnZVBPLnBhZ2VSZWZKc0NvbmZpZyA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbih0aGlzLnBhZ2VQTy5wYWdlUmVmSnNDb25maWcpO1xuXG4gICAgICAgIGlmICh0aGlzLnBhZ2VQTy5wYWdlV2lkZ2V0Q29uZmlnKSB7XG4gICAgICAgICAgdGhpcy5wYWdlUE8ucGFnZVdpZGdldENvbmZpZyA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbih0aGlzLnBhZ2VQTy5wYWdlV2lkZ2V0Q29uZmlnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnBhZ2VQTy5wYWdlV2lkZ2V0Q29uZmlnID0gW107XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW5pdEZ1bmM7XG5cbiAgICAgICAgaWYgKHRoaXMucGFnZVBPLnBhZ2VSZWZKc0NvbmZpZyAmJiB0aGlzLnBhZ2VQTy5wYWdlUmVmSnNDb25maWcubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHZhciBpbml0RnVuY1N0ciA9IFwibGV0IF90aGlzPXRoaXM7JExBQlwiO1xuXG4gICAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IHRoaXMucGFnZVBPLnBhZ2VSZWZKc0NvbmZpZy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciByZWZKcyA9IHRoaXMucGFnZVBPLnBhZ2VSZWZKc0NvbmZpZ1tfaV0ucmVmSnNQYXRoO1xuICAgICAgICAgICAgcmVmSnMgPSBTdHJpbmdVdGlsaXR5LkZvcm1hdFdpdGhEZWZhdWx0VmFsdWUocmVmSnMsIG51bGwpO1xuICAgICAgICAgICAgcmVmSnMgPSBCYXNlVXRpbGl0eS5BcHBlbmRUaW1lU3RhbXBVcmwocmVmSnMpO1xuICAgICAgICAgICAgaW5pdEZ1bmNTdHIgKz0gXCIuc2NyaXB0KCdcIiArIHJlZkpzICsgXCInKVwiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGluaXRGdW5jU3RyICs9IFwiLndhaXQoZnVuY3Rpb24oKXtfdGhpcy5SZW5kZXJQYWdlKCk7fSk7XCI7XG4gICAgICAgICAgaW5pdEZ1bmMgPSBGdW5jdGlvbihpbml0RnVuY1N0cik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5pdEZ1bmMgPSBGdW5jdGlvbihcInRoaXMuUmVuZGVyUGFnZSgpO1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRGdW5jLmNhbGwodGhpcyk7XG5cbiAgICAgICAgaWYgKHRoaXMucGFnZVBPLnBhZ2VSZWZDc3NDb25maWcgJiYgdGhpcy5wYWdlUE8ucGFnZVJlZkNzc0NvbmZpZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9yICh2YXIgX2kyID0gMDsgX2kyIDwgdGhpcy5wYWdlUE8ucGFnZVJlZkNzc0NvbmZpZy5sZW5ndGg7IF9pMisrKSB7XG4gICAgICAgICAgICB2YXIgcmVmQ3NzID0gdGhpcy5wYWdlUE8ucGFnZVJlZkNzc0NvbmZpZ1tfaTJdLnJlZkNTU1BhdGg7XG4gICAgICAgICAgICByZWZDc3MgPSBTdHJpbmdVdGlsaXR5LkZvcm1hdFdpdGhEZWZhdWx0VmFsdWUocmVmQ3NzLCBudWxsKTtcbiAgICAgICAgICAgIExvYWRKc0Nzc1V0aWxpdHkocmVmQ3NzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgUmVuZGVyUGFnZTogZnVuY3Rpb24gUmVuZGVyUGFnZSgpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnBhZ2VQTyk7XG4gICAgY29uc29sZS5sb2codGhpcy53aWRnZXRMaXN0KTtcbiAgICB2YXIgZGFzaGJvYXJkVmlldyA9IHRoaXMuQnVpbGREYXNoYm9hcmRWaWV3KCk7XG5cbiAgICBpZiAodGhpcy5wYWdlUE8ucGFnZVdpZGdldENvbmZpZykge31cblxuICAgIHBvcnRsZXRVdGlsaXR5LkluaXRSZWZyZXNoU3RhdHVzKCk7XG4gICAgcG9ydGxldFV0aWxpdHkuU3RhcnRBdXRvUmVmcmVzaENvbnRyb2wodGhpcy5SZWZyZXNoQUxMV2lkZ2V0LCB0aGlzKTtcbiAgfSxcbiAgUmVmcmVzaEFMTFdpZGdldDogZnVuY3Rpb24gUmVmcmVzaEFMTFdpZGdldChpbm5lclZlcnNpb24pIHtcbiAgICBjb25zb2xlLmxvZyhpbm5lclZlcnNpb24pO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciBhbGxXaWRnZXRJbnN0YW5jZUFycmF5ID0gdGhpcy53aWRnZXRJbnN0YW5jZUNhY2hlQXJyYXk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsV2lkZ2V0SW5zdGFuY2VBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgd2lkZ2V0SW5zdGFuY2UgPSBhbGxXaWRnZXRJbnN0YW5jZUFycmF5W2ldLmluc3RhbmNlO1xuICAgICAgICB3aWRnZXRJbnN0YW5jZS5SZWZyZXNoKGlubmVyVmVyc2lvbik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH0sXG4gIEJ1aWxkRGFzaGJvYXJkVmlldzogZnVuY3Rpb24gQnVpbGREYXNoYm9hcmRWaWV3KCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgcGFnZVBPID0gdGhpcy5wYWdlUE87XG4gICAgcGFnZVBPLnBhZ2VDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgcGFnZVBPLnBhZ2VDb25maWcsIHtcbiAgICAgIGRpc2FibGVEcmFnOiB0cnVlLFxuICAgICAgZGlzYWJsZVJlc2l6ZTogdHJ1ZVxuICAgIH0pO1xuICAgIHRoaXMuZGFzaGJvYXJkVmlldyA9IEdyaWRTdGFjay5pbml0KHBhZ2VQTy5wYWdlQ29uZmlnKTtcbiAgICB0aGlzLmRhc2hib2FyZFZpZXcub24oJ2FkZGVkJywgZnVuY3Rpb24gKGV2ZW50LCBpdGVtcykge1xuICAgICAgY29uc29sZS5sb2coaXRlbXMpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIF90aGlzLkNyZWF0ZVdpZGdldChpdGVtc1tpXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIHBhZ2VXaWRnZXRDb25maWcgPSBwYWdlUE8ucGFnZVdpZGdldENvbmZpZztcbiAgICB0aGlzLmRhc2hib2FyZFZpZXcubG9hZChwYWdlV2lkZ2V0Q29uZmlnLCB0cnVlKTtcbiAgfSxcbiAgQ3JlYXRlV2lkZ2V0OiBmdW5jdGlvbiBDcmVhdGVXaWRnZXQobm9kZSkge1xuICAgIHZhciBwYWdlUE8gPSB0aGlzLnBhZ2VQTztcbiAgICB2YXIgd2lkZ2V0SWQgPSBub2RlLndpZGdldElkO1xuICAgIHZhciB3aWRnZXRJbnN0YW5jZUlkID0gbm9kZS53aWRnZXRTaW5nbGVJZDtcbiAgICB2YXIgd2lkZ2V0UE8gPSBBcnJheVV0aWxpdHkuV2hlcmVTaW5nbGUodGhpcy53aWRnZXRMaXN0LCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIGl0ZW0ud2lkZ2V0SWQgPT0gd2lkZ2V0SWQ7XG4gICAgfSk7XG4gICAgdmFyICR3aWRnZXRDb250YWluZXIgPSAkKG5vZGUuZWwpLmZpbmQoXCIuZ3JpZC1zdGFjay1pdGVtLWNvbnRlbnRcIik7XG4gICAgdmFyIHdpZGdldENvbnRhaW5lcldpZHRoID0gJHdpZGdldENvbnRhaW5lci53aWR0aCgpO1xuICAgIHZhciB3aWRnZXRDb250YWluZXJIZWlnaHQgPSAkd2lkZ2V0Q29udGFpbmVyLmhlaWdodCgpO1xuICAgICQobm9kZS5lbCkuZmluZChcIi5ncmlkLXN0YWNrLWl0ZW0tY29udGVudFwiKS5odG1sKFwiXCIpO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciB3aWRnZXRJbnN0YW5jZSA9IHRoaXMuTmV3V2lkZ2V0SW5zdGFuY2Uod2lkZ2V0SW5zdGFuY2VJZCwgd2lkZ2V0UE8sIHBhZ2VQTywgJHdpZGdldENvbnRhaW5lciwgd2lkZ2V0Q29udGFpbmVyV2lkdGgsIHdpZGdldENvbnRhaW5lckhlaWdodCk7XG5cbiAgICAgIGlmICh3aWRnZXRJbnN0YW5jZSkge1xuICAgICAgICB0aGlzLmNvdW50ZXIrKztcbiAgICAgICAgJHdpZGdldENvbnRhaW5lci5hcHBlbmQod2lkZ2V0SW5zdGFuY2UuQ3JlYXRlV2lkZ2V0RWxlbSgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICR3aWRnZXRDb250YWluZXIuYXBwZW5kKFwi5a6e5L6L5YyWV2lkZ2V05aSx6LSlLOivt+ajgOafpeS7o+eggSFcIik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgJHdpZGdldENvbnRhaW5lci5hcHBlbmQoXCLlrp7kvovljJZXaWRnZXTlpLHotKUs6K+35qOA5p+l5Luj56CBIVwiICsgZS50b1N0cmluZygpKTtcbiAgICB9XG4gIH0sXG4gIE5ld1dpZGdldEluc3RhbmNlOiBmdW5jdGlvbiBOZXdXaWRnZXRJbnN0YW5jZSh3aWRnZXRJbnN0YW5jZUlkLCB3aWRnZXRQTywgcGFnZVBPLCAkd2lkZ2V0Q29udGFpbmVyLCB3aWRnZXRDb250YWluZXJXaWR0aCwgd2lkZ2V0Q29udGFpbmVySGVpZ2h0KSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciB3aWRnZXRJbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoZXZhbCh3aWRnZXRQTy53aWRnZXRDbGllbnRSZW5kZXIpKTtcbiAgICAgIHdpZGdldEluc3RhbmNlLndpZGdldEluc3RhbmNlSWQgPSB3aWRnZXRJbnN0YW5jZUlkO1xuICAgICAgd2lkZ2V0SW5zdGFuY2Uud2lkZ2V0UE8gPSB3aWRnZXRQTztcbiAgICAgIHdpZGdldEluc3RhbmNlLnBhZ2VQTyA9IHBhZ2VQTztcbiAgICAgIHdpZGdldEluc3RhbmNlLiR3aWRnZXRDb250YWluZXIgPSAkd2lkZ2V0Q29udGFpbmVyO1xuICAgICAgd2lkZ2V0SW5zdGFuY2Uud2lkZ2V0Q29udGFpbmVyV2lkdGggPSB3aWRnZXRDb250YWluZXJXaWR0aDtcbiAgICAgIHdpZGdldEluc3RhbmNlLndpZGdldENvbnRhaW5lckhlaWdodCA9IHdpZGdldENvbnRhaW5lckhlaWdodDtcbiAgICAgIHZhciB3aWRnZXRDb250ZXh0TWVudSA9IG51bGw7XG4gICAgICB0aGlzLndpZGdldEluc3RhbmNlQ2FjaGVBcnJheS5wdXNoKHtcbiAgICAgICAgXCJ3aWRnZXRJbnN0YW5jZUlkXCI6IHdpZGdldEluc3RhbmNlSWQsXG4gICAgICAgIFwiaW5zdGFuY2VcIjogd2lkZ2V0SW5zdGFuY2UsXG4gICAgICAgIFwid2lkZ2V0Q29udGV4dE1lbnVcIjogd2lkZ2V0Q29udGV4dE1lbnVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHdpZGdldEluc3RhbmNlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9LFxuICBHZXRXaWRnZXRJbnN0YW5jZUNhY2hlOiBmdW5jdGlvbiBHZXRXaWRnZXRJbnN0YW5jZUNhY2hlKHdpZGdldEluc3RhbmNlSWQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMud2lkZ2V0SW5zdGFuY2VDYWNoZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy53aWRnZXRJbnN0YW5jZUNhY2hlQXJyYXlbaV0ud2lkZ2V0SW5zdGFuY2VJZCA9PSB3aWRnZXRJbnN0YW5jZUlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndpZGdldEluc3RhbmNlQ2FjaGVBcnJheVtpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFBvcnRsZXRQYWdlUnVudGltZURlcGVuZFdlYml4ID0ge1xuICBwYWdlUE86IG51bGwsXG4gIHdpZGdldExpc3Q6IG51bGwsXG4gIHdpZGdldEluc3RhbmNlQ2FjaGVBcnJheTogW10sXG4gIGRhc2hib2FyZFZpZXc6IG51bGwsXG4gIHBhbmVsTWVudTogbnVsbCxcbiAgY291bnRlcjogMSxcbiAgYWNJbnRlcmZhY2U6IHtcbiAgICBnZXRUZW1wbGF0ZVBhZ2VXaXRoU1NPTWVudTogXCIvUmVzdC9Qb3J0bGV0L1J1blRpbWUvQ2xpZW50L1RlbXBsYXRlUGFnZVJ1bnRpbWUvR2V0VGVtcGxhdGVQYWdlV2l0aFNTT01lbnVcIlxuICB9LFxuICBHZXRQYWdlUE9BbmRXaWRnZXRQT0xpc3RUaGVuUmVuZGVyOiBmdW5jdGlvbiBHZXRQYWdlUE9BbmRXaWRnZXRQT0xpc3RUaGVuUmVuZGVyKCkge1xuICAgIEFqYXhVdGlsaXR5LkdldCh0aGlzLmFjSW50ZXJmYWNlLmdldFRlbXBsYXRlUGFnZVdpdGhTU09NZW51LCB7XG4gICAgICBtZW51SWQ6IEJhc2VVdGlsaXR5LkdldFVybFBhcmFWYWx1ZShcIm1lbnVJZFwiKVxuICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICB0aGlzLnBhZ2VQTyA9IHJlc3VsdC5kYXRhO1xuICAgICAgICB0aGlzLndpZGdldExpc3QgPSByZXN1bHQuZXhLVkRhdGEuV2lkZ2V0cztcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMud2lkZ2V0TGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh0aGlzLndpZGdldExpc3RbaV0ud2lkZ2V0UHJvcGVydGllcykge1xuICAgICAgICAgICAgdGhpcy53aWRnZXRMaXN0W2ldLndpZGdldFByb3BlcnRpZXMgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24odGhpcy53aWRnZXRMaXN0W2ldLndpZGdldFByb3BlcnRpZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucGFnZVBPLnBhZ2VDb25maWcgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24odGhpcy5wYWdlUE8ucGFnZUNvbmZpZyk7XG4gICAgICAgIHRoaXMucGFnZVBPLnBhZ2VQcm9wZXJ0aWVzID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKHRoaXMucGFnZVBPLnBhZ2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgdGhpcy5wYWdlUE8ucGFnZVJlZkNzc0NvbmZpZyA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbih0aGlzLnBhZ2VQTy5wYWdlUmVmQ3NzQ29uZmlnKTtcbiAgICAgICAgdGhpcy5wYWdlUE8ucGFnZVJlZkpzQ29uZmlnID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKHRoaXMucGFnZVBPLnBhZ2VSZWZKc0NvbmZpZyk7XG5cbiAgICAgICAgaWYgKHRoaXMucGFnZVBPLnBhZ2VXaWRnZXRDb25maWcpIHtcbiAgICAgICAgICB0aGlzLnBhZ2VQTy5wYWdlV2lkZ2V0Q29uZmlnID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKHRoaXMucGFnZVBPLnBhZ2VXaWRnZXRDb25maWcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucGFnZVBPLnBhZ2VXaWRnZXRDb25maWcgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICB2YXIgaW5pdEZ1bmM7XG5cbiAgICAgICAgaWYgKHRoaXMucGFnZVBPLnBhZ2VSZWZKc0NvbmZpZyAmJiB0aGlzLnBhZ2VQTy5wYWdlUmVmSnNDb25maWcubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHZhciBpbml0RnVuY1N0ciA9IFwibGV0IF90aGlzPXRoaXM7JExBQlwiO1xuXG4gICAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IHRoaXMucGFnZVBPLnBhZ2VSZWZKc0NvbmZpZy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciByZWZKcyA9IHRoaXMucGFnZVBPLnBhZ2VSZWZKc0NvbmZpZ1tfaV0ucmVmSnNQYXRoO1xuICAgICAgICAgICAgcmVmSnMgPSBTdHJpbmdVdGlsaXR5LkZvcm1hdFdpdGhEZWZhdWx0VmFsdWUocmVmSnMsIG51bGwpO1xuICAgICAgICAgICAgcmVmSnMgPSBCYXNlVXRpbGl0eS5BcHBlbmRUaW1lU3RhbXBVcmwocmVmSnMpO1xuICAgICAgICAgICAgaW5pdEZ1bmNTdHIgKz0gXCIuc2NyaXB0KCdcIiArIHJlZkpzICsgXCInKVwiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGluaXRGdW5jU3RyICs9IFwiLndhaXQoZnVuY3Rpb24oKXtfdGhpcy5SZW5kZXJQYWdlKCk7fSk7XCI7XG4gICAgICAgICAgaW5pdEZ1bmMgPSBGdW5jdGlvbihpbml0RnVuY1N0cik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5pdEZ1bmMgPSBGdW5jdGlvbihcInRoaXMuUmVuZGVyUGFnZSgpO1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRGdW5jLmNhbGwodGhpcyk7XG5cbiAgICAgICAgaWYgKHRoaXMucGFnZVBPLnBhZ2VSZWZDc3NDb25maWcgJiYgdGhpcy5wYWdlUE8ucGFnZVJlZkNzc0NvbmZpZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9yICh2YXIgX2kyID0gMDsgX2kyIDwgdGhpcy5wYWdlUE8ucGFnZVJlZkNzc0NvbmZpZy5sZW5ndGg7IF9pMisrKSB7XG4gICAgICAgICAgICB2YXIgcmVmQ3NzID0gdGhpcy5wYWdlUE8ucGFnZVJlZkNzc0NvbmZpZ1tfaTJdLnJlZkNTU1BhdGg7XG4gICAgICAgICAgICByZWZDc3MgPSBTdHJpbmdVdGlsaXR5LkZvcm1hdFdpdGhEZWZhdWx0VmFsdWUocmVmQ3NzLCBudWxsKTtcbiAgICAgICAgICAgIExvYWRKc0Nzc1V0aWxpdHkocmVmQ3NzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgUmVuZGVyUGFnZTogZnVuY3Rpb24gUmVuZGVyUGFnZSgpIHtcbiAgICB2YXIgZGFzaGJvYXJkVmlldyA9IHRoaXMuQnVpbGREYXNoYm9hcmRWaWV3KCk7XG4gICAgd2ViaXgudWkoe1xuICAgICAgdHlwZTogXCJzcGFjZVwiLFxuICAgICAgY29sczogW3tcbiAgICAgICAgdmlldzogXCJzY3JvbGx2aWV3XCIsXG4gICAgICAgIGJvZHk6IGRhc2hib2FyZFZpZXdcbiAgICAgIH1dXG4gICAgfSk7XG4gICAgd2ViaXguZXZlbnQoZG9jdW1lbnQuYm9keSwgXCJjbGlja1wiLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgIHZhciBjc3MgPSBldi50YXJnZXQuY2xhc3NOYW1lO1xuXG4gICAgICBpZiAoY3NzICYmIGNzcy50b1N0cmluZygpLmluZGV4T2YoXCJwYW5lbF9pY29uXCIpICE9IC0xKSB7XG4gICAgICAgIHZhciBjbGFzc05hbWVBcnJheSA9IGNzcy5zcGxpdChcIiBcIik7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc05hbWVBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChjbGFzc05hbWVBcnJheVtpXS5pbmRleE9mKFwid2lkZ2V0SW5zdGFuY2VJZF9cIikgPT0gMCkge1xuICAgICAgICAgICAgdmFyIHdpZGdldEluc3RhbmNlSWQgPSBjbGFzc05hbWVBcnJheVtpXS5yZXBsYWNlKFwid2lkZ2V0SW5zdGFuY2VJZF9cIiwgXCJcIik7XG4gICAgICAgICAgICB2YXIgd2lkZ2V0Q29udGV4dE1lbnUgPSBQb3J0bGV0UGFnZVJ1bnRpbWVEZXBlbmRXZWJpeC5HZXRXaWRnZXRJbnN0YW5jZUNhY2hlKHdpZGdldEluc3RhbmNlSWQpLndpZGdldENvbnRleHRNZW51O1xuXG4gICAgICAgICAgICBpZiAod2lkZ2V0Q29udGV4dE1lbnUpIHtcbiAgICAgICAgICAgICAgd2lkZ2V0Q29udGV4dE1lbnUuc2V0Q29udGV4dCh3ZWJpeC4kJChldi50YXJnZXQpKTtcbiAgICAgICAgICAgICAgd2lkZ2V0Q29udGV4dE1lbnUuc2hvdyhldi50YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMucGFnZVBPLnBhZ2VXaWRnZXRDb25maWcpIHtcbiAgICAgICQkKFwiZGFzaGJvYXJkVmlld0xheW91dFwiKS5yZXN0b3JlKHRoaXMucGFnZVBPLnBhZ2VXaWRnZXRDb25maWcpO1xuICAgIH1cblxuICAgIHBvcnRsZXRVdGlsaXR5LkluaXRSZWZyZXNoU3RhdHVzKCk7XG4gICAgcG9ydGxldFV0aWxpdHkuU3RhcnRBdXRvUmVmcmVzaENvbnRyb2wodGhpcy5SZWZyZXNoQUxMV2lkZ2V0LCB0aGlzKTtcbiAgICB2YXIgdXNlciA9IHtcbiAgICAgIHUxOiB7XG4gICAgICAgIG5hbWU6IFwienp6XCJcbiAgICAgIH0sXG4gICAgICB1Mjoge1xuICAgICAgICBuYW1lOiBcImFhJ2FcXFwiYVwiXG4gICAgICB9XG4gICAgfTtcbiAgICBjb25zb2xlLmxvZyhzcHJpbnRmKCdhLmRvP2E9JSh1MS5uYW1lKXMmYj0lKHUyLm5hbWUpcycsIHVzZXIpKTtcbiAgfSxcbiAgUmVmcmVzaEFMTFdpZGdldDogZnVuY3Rpb24gUmVmcmVzaEFMTFdpZGdldChpbm5lclZlcnNpb24pIHtcbiAgICBjb25zb2xlLmxvZyhpbm5lclZlcnNpb24pO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciBhbGxXaWRnZXRJbnN0YW5jZUFycmF5ID0gdGhpcy53aWRnZXRJbnN0YW5jZUNhY2hlQXJyYXk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsV2lkZ2V0SW5zdGFuY2VBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgd2lkZ2V0SW5zdGFuY2UgPSBhbGxXaWRnZXRJbnN0YW5jZUFycmF5W2ldLmluc3RhbmNlO1xuICAgICAgICB3aWRnZXRJbnN0YW5jZS5SZWZyZXNoKGlubmVyVmVyc2lvbik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH0sXG4gIEJ1aWxkRGFzaGJvYXJkVmlldzogZnVuY3Rpb24gQnVpbGREYXNoYm9hcmRWaWV3KCkge1xuICAgIHZhciBwYWdlUE8gPSB0aGlzLnBhZ2VQTztcbiAgICB2YXIgZGFzaGJvYXJkID0ge1xuICAgICAgdmlldzogXCJncmlkbGF5b3V0XCIsXG4gICAgICBpZDogXCJkYXNoYm9hcmRWaWV3TGF5b3V0XCIsXG4gICAgICBncmlkQ29sdW1uczogcGFnZVBPLnBhZ2VDb25maWcuZ3JpZENvbHVtbnMsXG4gICAgICBncmlkUm93czogcGFnZVBPLnBhZ2VDb25maWcuZ3JpZFJvd3MsXG4gICAgICBjZWxsSGVpZ2h0OiBwYWdlUE8ucGFnZUNvbmZpZy5jZWxsSGVpZ2h0LFxuICAgICAgZmFjdG9yeTogZnVuY3Rpb24gZmFjdG9yeShvYmopIHtcbiAgICAgICAgdmFyIHdpZGdldElkID0gb2JqLm5hbWU7XG4gICAgICAgIHZhciB3aWRnZXRJbnN0YW5jZUlkID0gb2JqLmlkO1xuICAgICAgICBvYmoudmlldyA9IFwicGFuZWxcIjtcbiAgICAgICAgb2JqLnJlc2l6ZSA9IGZhbHNlO1xuICAgICAgICBvYmouaWNvbiA9IFwibGFzIGxhLWJhcnMgd2lkZ2V0SW5zdGFuY2VJZF9cIiArIHdpZGdldEluc3RhbmNlSWQ7XG4gICAgICAgIG9iai5ib2R5ID0ge1xuICAgICAgICAgIHZpZXc6IFwidGVtcGxhdGVcIixcbiAgICAgICAgICBjc3M6IFwid2ViaXhfdGVtcGxhdGVfZm9yX3dpZGdldFwiLFxuICAgICAgICAgIHRlbXBsYXRlOiBmdW5jdGlvbiB0ZW1wbGF0ZShkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gXCI8ZGl2IG5hbWU9J3dpZGdldENvbnRhaW5lcicgY2xhc3M9J3dpZGdldC1jb250YWluZXItb3V0ZXItd3JhcCc+PC9kaXY+XCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBwYWdlUE86IHBhZ2VQTyxcbiAgICAgICAgICAgIHdpZGdldElkOiB3aWRnZXRJZCxcbiAgICAgICAgICAgIHdpZGdldEluc3RhbmNlSWQ6IHdpZGdldEluc3RhbmNlSWRcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICBvblZpZXdTaG93OiBmdW5jdGlvbiBvblZpZXdTaG93KCkge30sXG4gICAgICAgICAgICBvbkFmdGVyTG9hZDogZnVuY3Rpb24gb25BZnRlckxvYWQoKSB7fSxcbiAgICAgICAgICAgIG9uQmx1cjogZnVuY3Rpb24gb25CbHVyKHByZXZfdmlldykge30sXG4gICAgICAgICAgICBvbkJlZm9yZVJlbmRlcjogZnVuY3Rpb24gb25CZWZvcmVSZW5kZXIoZGF0YSkge30sXG4gICAgICAgICAgICBvbkFmdGVyUmVuZGVyOiBmdW5jdGlvbiBvbkFmdGVyUmVuZGVyKGRhdGEpIHtcbiAgICAgICAgICAgICAgdmFyIHBhZ2VQTyA9IHRoaXMuZGF0YS5wYWdlUE87XG4gICAgICAgICAgICAgIHZhciB3aWRnZXRJZCA9IHRoaXMuZGF0YS53aWRnZXRJZDtcbiAgICAgICAgICAgICAgdmFyIHdpZGdldEluc3RhbmNlSWQgPSB0aGlzLmRhdGEud2lkZ2V0SW5zdGFuY2VJZDtcbiAgICAgICAgICAgICAgdmFyIHdpZGdldFBPID0gQXJyYXlVdGlsaXR5LldoZXJlU2luZ2xlKFBvcnRsZXRQYWdlUnVudGltZURlcGVuZFdlYml4LndpZGdldExpc3QsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0ud2lkZ2V0SWQgPT0gd2lkZ2V0SWQ7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB2YXIgJHdpZGdldENvbnRhaW5lciA9ICQodGhpcy4kdmlldykuZmluZChcIltuYW1lPSd3aWRnZXRDb250YWluZXInXVwiKTtcbiAgICAgICAgICAgICAgdmFyIHdpZGdldENvbnRhaW5lcldpZHRoID0gJHdpZGdldENvbnRhaW5lci53aWR0aCgpO1xuICAgICAgICAgICAgICB2YXIgd2lkZ2V0Q29udGFpbmVySGVpZ2h0ID0gJHdpZGdldENvbnRhaW5lci5oZWlnaHQoKTtcblxuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciB3aWRnZXRJbnN0YW5jZSA9IFBvcnRsZXRQYWdlUnVudGltZURlcGVuZFdlYml4Lk5ld1dpZGdldEluc3RhbmNlKHdpZGdldEluc3RhbmNlSWQsIHdpZGdldFBPLCBwYWdlUE8sICR3aWRnZXRDb250YWluZXIsIHdpZGdldENvbnRhaW5lcldpZHRoLCB3aWRnZXRDb250YWluZXJIZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHdpZGdldEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgICBQb3J0bGV0UGFnZVJ1bnRpbWVEZXBlbmRXZWJpeC5jb3VudGVyKys7XG4gICAgICAgICAgICAgICAgICAkd2lkZ2V0Q29udGFpbmVyLmFwcGVuZCh3aWRnZXRJbnN0YW5jZS5DcmVhdGVXaWRnZXRFbGVtKCkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAkd2lkZ2V0Q29udGFpbmVyLmFwcGVuZChcIuWunuS+i+WMlldpZGdldOWksei0pSzor7fmo4Dmn6Xku6PnoIExIVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAkd2lkZ2V0Q29udGFpbmVyLmFwcGVuZChcIuWunuS+i+WMlldpZGdldOWksei0pSzor7fmo4Dmn6Xku6PnoIEhXCIgKyBlLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfSxcbiAgICAgIG9uOiB7fVxuICAgIH07XG4gICAgcmV0dXJuIGRhc2hib2FyZDtcbiAgfSxcbiAgQnVpbGRXaWRnZXRDb250ZXh0TWVudTogZnVuY3Rpb24gQnVpbGRXaWRnZXRDb250ZXh0TWVudSh3aWRnZXRJbnN0YW5jZUlkLCBtZW51Q29uZmlnKSB7XG4gICAgaWYgKG1lbnVDb25maWcubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBtZW51ID0gd2ViaXgudWkoe1xuICAgICAgdmlldzogXCJjb250ZXh0bWVudVwiLFxuICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKGlkKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWVudUNvbmZpZy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChtZW51Q29uZmlnW2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgICB2YXIgd2lkZ2V0SW5zdGFuY2UgPSBQb3J0bGV0UGFnZVJ1bnRpbWVEZXBlbmRXZWJpeC5HZXRXaWRnZXRJbnN0YW5jZUNhY2hlKHdpZGdldEluc3RhbmNlSWQpLmluc3RhbmNlO1xuICAgICAgICAgICAgbWVudUNvbmZpZ1tpXS5jbGljay5jYWxsKHdpZGdldEluc3RhbmNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkYXRhOiBtZW51Q29uZmlnXG4gICAgfSk7XG4gICAgcmV0dXJuIG1lbnU7XG4gIH0sXG4gIE5ld1dpZGdldEluc3RhbmNlOiBmdW5jdGlvbiBOZXdXaWRnZXRJbnN0YW5jZSh3aWRnZXRJbnN0YW5jZUlkLCB3aWRnZXRQTywgcGFnZVBPLCAkd2lkZ2V0Q29udGFpbmVyLCB3aWRnZXRDb250YWluZXJXaWR0aCwgd2lkZ2V0Q29udGFpbmVySGVpZ2h0KSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciB3aWRnZXRJbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoZXZhbCh3aWRnZXRQTy53aWRnZXRDbGllbnRSZW5kZXIpKTtcbiAgICAgIHdpZGdldEluc3RhbmNlLndpZGdldEluc3RhbmNlSWQgPSB3aWRnZXRJbnN0YW5jZUlkO1xuICAgICAgd2lkZ2V0SW5zdGFuY2Uud2lkZ2V0UE8gPSB3aWRnZXRQTztcbiAgICAgIHdpZGdldEluc3RhbmNlLnBhZ2VQTyA9IHBhZ2VQTztcbiAgICAgIHdpZGdldEluc3RhbmNlLiR3aWRnZXRDb250YWluZXIgPSAkd2lkZ2V0Q29udGFpbmVyO1xuICAgICAgd2lkZ2V0SW5zdGFuY2Uud2lkZ2V0Q29udGFpbmVyV2lkdGggPSB3aWRnZXRDb250YWluZXJXaWR0aDtcbiAgICAgIHdpZGdldEluc3RhbmNlLndpZGdldENvbnRhaW5lckhlaWdodCA9IHdpZGdldENvbnRhaW5lckhlaWdodDtcbiAgICAgIHZhciB3aWRnZXRDb250ZXh0TWVudSA9IFBvcnRsZXRQYWdlUnVudGltZURlcGVuZFdlYml4LkJ1aWxkV2lkZ2V0Q29udGV4dE1lbnUod2lkZ2V0SW5zdGFuY2VJZCwgd2lkZ2V0SW5zdGFuY2UuR2V0Q29udGV4dE1lbnVDb25maWcoKSk7XG4gICAgICB0aGlzLndpZGdldEluc3RhbmNlQ2FjaGVBcnJheS5wdXNoKHtcbiAgICAgICAgXCJ3aWRnZXRJbnN0YW5jZUlkXCI6IHdpZGdldEluc3RhbmNlSWQsXG4gICAgICAgIFwiaW5zdGFuY2VcIjogd2lkZ2V0SW5zdGFuY2UsXG4gICAgICAgIFwid2lkZ2V0Q29udGV4dE1lbnVcIjogd2lkZ2V0Q29udGV4dE1lbnVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHdpZGdldEluc3RhbmNlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9LFxuICBHZXRXaWRnZXRJbnN0YW5jZUNhY2hlOiBmdW5jdGlvbiBHZXRXaWRnZXRJbnN0YW5jZUNhY2hlKHdpZGdldEluc3RhbmNlSWQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMud2lkZ2V0SW5zdGFuY2VDYWNoZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy53aWRnZXRJbnN0YW5jZUNhY2hlQXJyYXlbaV0ud2lkZ2V0SW5zdGFuY2VJZCA9PSB3aWRnZXRJbnN0YW5jZUlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndpZGdldEluc3RhbmNlQ2FjaGVBcnJheVtpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHBvcnRsZXRVdGlsaXR5ID0ge1xuICByZWZyZXNoVmVyc2lvbktleTogXCJwb3J0bGV0VXRpbGl0eS1SZWZyZXNoVmVyc2lvblwiLFxuICBpbm5lclZlcnNpb246IG51bGwsXG4gIGF1dG9SZWZyZXNoQ29udHJvbEZ1bmM6IG51bGwsXG4gIEdldFJlZnJlc2hWZXJzaW9uOiBmdW5jdGlvbiBHZXRSZWZyZXNoVmVyc2lvbigpIHtcbiAgICB2YXIgcmVmcmVzaFZlcnNpb24gPSBMb2NhbFN0b3JhZ2VVdGlsaXR5LmdldEl0ZW0odGhpcy5yZWZyZXNoVmVyc2lvbktleSk7XG5cbiAgICBpZiAoIXJlZnJlc2hWZXJzaW9uKSB7XG4gICAgICByZWZyZXNoVmVyc2lvbiA9IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlZnJlc2hWZXJzaW9uO1xuICB9LFxuICBVcGRhdGVSZWZyZXNoVmVyc2lvbjogZnVuY3Rpb24gVXBkYXRlUmVmcmVzaFZlcnNpb24oKSB7XG4gICAgdmFyIHJlZnJlc2hWZXJzaW9uID0gdGhpcy5HZXRSZWZyZXNoVmVyc2lvbigpO1xuICAgIHJlZnJlc2hWZXJzaW9uKys7XG4gICAgTG9jYWxTdG9yYWdlVXRpbGl0eS5zZXRJdGVtKHRoaXMucmVmcmVzaFZlcnNpb25LZXksIHJlZnJlc2hWZXJzaW9uKTtcbiAgfSxcbiAgSW5pdFJlZnJlc2hTdGF0dXM6IGZ1bmN0aW9uIEluaXRSZWZyZXNoU3RhdHVzKCkge1xuICAgIExvY2FsU3RvcmFnZVV0aWxpdHkuc2V0SXRlbSh0aGlzLnJlZnJlc2hWZXJzaW9uS2V5LCAxKTtcbiAgICB0aGlzLlVwZGF0ZVJlZnJlc2hWZXJzaW9uKCk7XG4gICAgdGhpcy5pbm5lclZlcnNpb24gPSB0aGlzLkdldFJlZnJlc2hWZXJzaW9uKCk7XG4gIH0sXG4gIE5lZWRUb0JlUmVmcmVzaDogZnVuY3Rpb24gTmVlZFRvQmVSZWZyZXNoKCkge1xuICAgIHZhciBuZXdSZWZyZXNoVmVyc2lvbiA9IHRoaXMuR2V0UmVmcmVzaFZlcnNpb24oKTtcblxuICAgIGlmIChuZXdSZWZyZXNoVmVyc2lvbiA+IHRoaXMuaW5uZXJWZXJzaW9uKSB7XG4gICAgICB0aGlzLmlubmVyVmVyc2lvbiA9IG5ld1JlZnJlc2hWZXJzaW9uO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBTdGFydEF1dG9SZWZyZXNoQ29udHJvbDogZnVuY3Rpb24gU3RhcnRBdXRvUmVmcmVzaENvbnRyb2wocmVmcmVzaEZ1bmMsIGNhbGxlcikge1xuICAgIHBvcnRsZXRVdGlsaXR5LmF1dG9SZWZyZXNoQ29udHJvbEZ1bmMgPSByZWZyZXNoRnVuYztcbiAgICB3aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHBvcnRsZXRVdGlsaXR5Lk5lZWRUb0JlUmVmcmVzaCgpKSB7XG4gICAgICAgIHBvcnRsZXRVdGlsaXR5LmF1dG9SZWZyZXNoQ29udHJvbEZ1bmMuY2FsbChjYWxsZXIsIHBvcnRsZXRVdGlsaXR5LmlubmVyVmVyc2lvbik7XG4gICAgICB9XG4gICAgfSwgMTAwMCk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXaWRnZXRDb250cm9sID0ge1xuICBDcmVhdGVXaWRnZXRFbGVtOiBmdW5jdGlvbiBDcmVhdGVXaWRnZXRFbGVtKG1lbnVDb25maWcpIHtcbiAgICB0aGlzLiR3aWRnZXRDb250YWluZXJJbm5lcldyYXAgPSAkKFwiPGRpdiBjbGFzcz0nd2lkZ2V0LWNvbnRhaW5lci1pbm5lci13cmFwJz48L2Rpdj5cIik7XG4gICAgdGhpcy4kd2lkZ2V0Q29udGFpbmVySW5uZXJXcmFwLmFwcGVuZCh0aGlzLl9CdWlsZFRvb2xCYXIodGhpcy53aWRnZXRQTywgdGhpcy53aWRnZXRJbnN0YW5jZUlkLCBtZW51Q29uZmlnKSk7XG4gICAgdGhpcy4kd2lkZ2V0Qm9keSA9IHRoaXMuX0J1aWxkQm9keUVsZW0oKTtcbiAgICB0aGlzLiR3aWRnZXRDb250YWluZXJJbm5lcldyYXAuYXBwZW5kKHRoaXMuJHdpZGdldEJvZHkpO1xuICAgIHJldHVybiB0aGlzLiR3aWRnZXRDb250YWluZXJJbm5lcldyYXA7XG4gIH0sXG4gIE5vdFJlZnJlc2g6IGZ1bmN0aW9uIE5vdFJlZnJlc2goaW5uZXJWZXJzaW9uKSB7fSxcbiAgX0J1aWxkVG9vbEJhcjogZnVuY3Rpb24gX0J1aWxkVG9vbEJhcih3aWRnZXRQTywgd2lkZ2V0SW5zdGFuY2VJZCwgbWVudUNvbmZpZykge1xuICAgIHZhciBtZW51RWxlbUlkID0gXCJtZW51X1wiICsgd2lkZ2V0SW5zdGFuY2VJZDtcbiAgICB2YXIgd2lkZ2V0VG9vbEJhciA9ICQoXCI8ZGl2IGNsYXNzPSd3aWRnZXQtdG9vbC1iYXInPjxkaXYgY2xhc3M9J3dpZGdldC10aXRsZSc+PGkgY2xhc3M9J2xhcyBsYS1hbmdsZS1yaWdodCc+PC9pPlwiICsgd2lkZ2V0UE8ud2lkZ2V0VGl0bGUgKyBcIjwvZGl2PjxkaXYgY2xhc3M9J3dpZGdldC1tZW51JyBpZD0nXCIgKyBtZW51RWxlbUlkICsgXCInPjxpIGNsYXNzPSdsYXMgbGEtYWxpZ24tanVzdGlmeSBjb250ZXh0LW1lbnUtb25lJz48L2k+PC9kaXY+PC9kaXY+XCIpO1xuXG4gICAgaWYgKEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyhtZW51Q29uZmlnKSAhPSBcInt9XCIpIHtcbiAgICAgICQuY29udGV4dE1lbnUoe1xuICAgICAgICBzZWxlY3RvcjogXCIjXCIgKyBtZW51RWxlbUlkLFxuICAgICAgICB0cmlnZ2VyOiAnbGVmdCcsXG4gICAgICAgIGl0ZW1zOiBtZW51Q29uZmlnXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gd2lkZ2V0VG9vbEJhcjtcbiAgfSxcbiAgR2V0RGVmYXVsdENvbnRleHRNZW51Q29uZmlnOiBmdW5jdGlvbiBHZXREZWZhdWx0Q29udGV4dE1lbnVDb25maWcoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHJldHVybiB7XG4gICAgICBcImluc3RydWN0aW9uc1wiOiB7XG4gICAgICAgIG5hbWU6IFwi6K+m5oOFXCIsXG4gICAgICAgIGljb246IFwiZWRpdFwiLFxuICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gY2FsbGJhY2soaXRlbUtleSwgb3B0LCBlKSB7XG4gICAgICAgICAgX3RoaXMuT25Db250ZXh0TWVudUluc3RydWN0aW9uc0V2ZW50KCk7XG5cbiAgICAgICAgICBjb25zb2xlLmxvZyhfdGhpcy53aWRnZXRJbnN0YW5jZUlkKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwibW9yZVwiOiB7XG4gICAgICAgIG5hbWU6IFwi5pu05aSaXCIsXG4gICAgICAgIGljb246IFwiZWRpdFwiLFxuICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gY2FsbGJhY2soaXRlbUtleSwgb3B0LCBlKSB7XG4gICAgICAgICAgX3RoaXMuT25Db250ZXh0TWVudU1vcmVFdmVudCgpO1xuXG4gICAgICAgICAgY29uc29sZS5sb2coX3RoaXMud2lkZ2V0SW5zdGFuY2VJZCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcInNlcDFcIjogXCItLS0tLS0tLS1cIixcbiAgICAgIFwicXVpdFwiOiB7XG4gICAgICAgIG5hbWU6IFwi6YCA5Ye6XCIsXG4gICAgICAgIGljb246IFwiY29udGV4dC1tZW51LWljb24gY29udGV4dC1tZW51LWljb24tcXVpdFwiLFxuICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gY2FsbGJhY2soaXRlbUtleSwgb3B0LCBlKSB7fVxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIEdldEVtcHR5Q29udGV4dE1lbnVDb25maWc6IGZ1bmN0aW9uIEdldEVtcHR5Q29udGV4dE1lbnVDb25maWcoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV2lkZ2V0RGVtb0RhdGEgPSB7XG4gIEdldERlbW9Cb2R5OiBmdW5jdGlvbiBHZXREZW1vQm9keSgpIHtcbiAgICByZXR1cm4gXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAglwiO1xuICB9LFxuICBHZXRRdWlja0VudHJ5RGVtb1Byb3BzOiBmdW5jdGlvbiBHZXRRdWlja0VudHJ5RGVtb1Byb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBRdWlja0VudHJpZXM6IFt7XG4gICAgICAgIG5hbWU6IFwi5LqL5Yqh5Y+R6LW3XCIsXG4gICAgICAgIGNhcHRpb246IFwi5LqL5Yqh5Y+R6LW3XCIsXG4gICAgICAgIG9wZW5UeXBlOiBcImlubmVySWZyYW1lXCIsXG4gICAgICAgIHVybDogXCIvUUNTeXN0ZW0vSkI0RENCdWlsZGVyQ2xpZW50L0hUTUwvV29ya0Zsb3cvUnVudGltZS9NeUJvb3RhYmxlTXlNb2RlbHMuaHRtbD9tZW51SWQ9UUNTeXN0ZW0tV29ya0Zsb3ctQ2xpZW50LUJvb3RhYmxlXCIsXG4gICAgICAgIGltYWdlOiBcIjAyNjUucG5nXCJcbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogXCLlj5Hmloflj5HotbdcIixcbiAgICAgICAgY2FwdGlvbjogXCLlj5Hmloflj5HotbdcIixcbiAgICAgICAgb3BlblR5cGU6IFwibWVudVwiLFxuICAgICAgICBpbWFnZTogXCIwMjIzLnBuZ1wiXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6IFwi5pS25paH5Y+R6LW3XCIsXG4gICAgICAgIGNhcHRpb246IFwi5pS25paH5Y+R6LW3XCIsXG4gICAgICAgIG9wZW5UeXBlOiBcIm1lbnVcIixcbiAgICAgICAgaW1hZ2U6IFwiMDI1NS5wbmdcIlxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiBcIuaWh+S7tuS8oOmAklwiLFxuICAgICAgICBjYXB0aW9uOiBcIuaWh+S7tuS8oOmAklwiLFxuICAgICAgICBvcGVuVHlwZTogXCJtZW51XCIsXG4gICAgICAgIGltYWdlOiBcIjAyNDcucG5nXCJcbiAgICAgIH1dXG4gICAgfTtcbiAgfSxcbiAgR2V0VG9Eb0xpc3RXaWRnZXRQcm9wczogZnVuY3Rpb24gR2V0VG9Eb0xpc3RXaWRnZXRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGlzdDoge1xuICAgICAgICBnZXRMaXN0RGF0ZVJlc3Q6IFwiLyUoYXBwQ29udGV4dFBhdGgpcy9SZXN0L0V4dGVuc2lvbi9Qb3J0bGV0L1dvcmtmbG93VHJhbnNmb3JtL0dldE15UHJvY2Vzc1Rhc2tMaXN0XCIsXG4gICAgICAgIGdldExpc3REYXRlUmVzdFBhcmFzOiB7XG4gICAgICAgICAgbW9kZWxDYXRlZ29yeTogXCJHZW5lcmFsUHJvY2Vzc1wiLFxuICAgICAgICAgIHBhZ2VTaXplOiAxMlxuICAgICAgICB9LFxuICAgICAgICBvcGVuVHlwZTogXCJmcmFtZUlmcmFtZVwiLFxuICAgICAgICBkaWFsb2dDb25maWc6IHtcbiAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgdGl0bGU6IFwiSkI0RENcIixcbiAgICAgICAgICBtb2RhbDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBmaWVsZFBhcnNpbmc6IHtcbiAgICAgICAgICB0aW1lRm9ybWF0OiBcIiUoaW5zdGFuY2VFbnRpdHkuaW5zdENyZWF0ZVRpbWUpc1wiLFxuICAgICAgICAgIHRpdGxlRm9ybWF0OiBcIlvmoIfpophdJShpbnN0YW5jZUVudGl0eS5pbnN0VGl0bGUpcy0lKGV4dGFza0N1ck5vZGVOYW1lKXNcIlxuICAgICAgICB9LFxuICAgICAgICBvcGVuVXJsOiBcIi8lKGFwcENvbnRleHRQYXRoKXMvSkI0RENCdWlsZGVyQ2xpZW50L0hUTUwvV29ya0Zsb3cvUnVudGltZS9NeVByb2Nlc3NJbnN0YW5jZU1haW5UYXNrLmh0bWw/b3A9dXBkYXRlJmV4dGFza0lkPSUoZXh0YXNrSWQpc1wiLFxuICAgICAgICBwcmludFJvd0RhdGE6IGZhbHNlXG4gICAgICB9LFxuICAgICAgbW9yZToge1xuICAgICAgICBvcGVuVHlwZTogXCJmcmFtZUlmcmFtZVwiLFxuICAgICAgICBkaWFsb2dDb25maWc6IHtcbiAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgdGl0bGU6IFwiSkI0RENcIixcbiAgICAgICAgICBtb2RhbDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBvcGVuVXJsOiBcIi8lKGFwcENvbnRleHRQYXRoKXMvSkI0RENCdWlsZGVyQ2xpZW50L0hUTUwvV29ya0Zsb3cvUnVudGltZS9NeVByb2Nlc3NJbnN0YW5jZU1haW5UYXNrTGlzdC5odG1sP21lbnVJZD1RQ1N5c3RlbS1Xb3JrRmxvdy1DbGllbnQtTXlUYXNrXCJcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBHZXREZW1vVG9Eb0xpc3REYXRhOiBmdW5jdGlvbiBHZXREZW1vVG9Eb0xpc3REYXRhKCkge1xuICAgIHJldHVybiBbe1xuICAgICAgcHJlZml4OiBcIuato+W4uFwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgIJcIixcbiAgICAgIGRhdGU6IFwiMjAyMS0wNS0wNiAxMjo1NToxMlwiXG4gICAgfSwge1xuICAgICAgcHJlZml4OiBcIuWKoOaApVwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybXCIsXG4gICAgICBkYXRlOiBcIjIwMjEtMDUtMDUgMTI6NTU6MTJcIlxuICAgIH0sIHtcbiAgICAgIHByZWZpeDogXCLph43opoFcIixcbiAgICAgIHRpdGxlOiBcIndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CCXCIsXG4gICAgICBkYXRlOiBcIjIwMjEtMDUtMDUgMTI6NTU6MTJcIlxuICAgIH0sIHtcbiAgICAgIHByZWZpeDogXCLph43opoFcIixcbiAgICAgIHRpdGxlOiBcIndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8m1wiLFxuICAgICAgZGF0ZTogXCIyMDIxLTA1LTA1IDEyOjU1OjEyXCJcbiAgICB9LCB7XG4gICAgICBwcmVmaXg6IFwi5q2j5bi4XCIsXG4gICAgICB0aXRsZTogXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAglwiLFxuICAgICAgZGF0ZTogXCIyMDIxLTA1LTA1IDEyOjU1OjEyXCJcbiAgICB9LCB7XG4gICAgICBwcmVmaXg6IFwi5q2j5bi4XCIsXG4gICAgICB0aXRsZTogXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAgnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3XCIsXG4gICAgICBkYXRlOiBcIjIwMjEtMDUtMDUgMTI6NTU6MTJcIlxuICAgIH0sIHtcbiAgICAgIHByZWZpeDogXCLmraPluLhcIixcbiAgICAgIHRpdGxlOiBcIndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CCLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572uXCIsXG4gICAgICBkYXRlOiBcIjIwMjEtMDUtMDUgMTI6NTU6MTJcIlxuICAgIH0sIHtcbiAgICAgIHByZWZpeDogXCLmraPluLhcIixcbiAgICAgIHRpdGxlOiBcIndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CCc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndcIixcbiAgICAgIGRhdGU6IFwiMjAyMS0wNS0wNSAxMjo1NToxMlwiXG4gICAgfSwge1xuICAgICAgcHJlZml4OiBcIuato+W4uFwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgIIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva5cIixcbiAgICAgIGRhdGU6IFwiMjAyMS0wNS0wNSAxMjo1NToxMlwiXG4gICAgfSwge1xuICAgICAgcHJlZml4OiBcIuato+W4uFwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgIIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva5cIixcbiAgICAgIGRhdGU6IFwiMjAyMS0wNS0wNSAxMjo1NToxMlwiXG4gICAgfSwge1xuICAgICAgcHJlZml4OiBcIuato+W4uFwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgIJcIixcbiAgICAgIGRhdGU6IFwiMjAyMS0wNS0wNSAxMjo1NToxMlwiXG4gICAgfSwge1xuICAgICAgcHJlZml4OiBcIuato+W4uFwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgIJzd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd1wiLFxuICAgICAgZGF0ZTogXCIyMDIxLTA1LTA1IDEyOjU1OjEyXCJcbiAgICB9LCB7XG4gICAgICBwcmVmaXg6IFwi5q2j5bi4XCIsXG4gICAgICB0aXRsZTogXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAglwiLFxuICAgICAgZGF0ZTogXCIyMDIxLTA1LTA1IDEyOjU1OjEyXCJcbiAgICB9XTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFBvcnRsZXREZWZhdWx0TGlzdFdpZGdldENvbnRyb2wgPSB7XG4gIHdpZGdldEluc3RhbmNlSWQ6IFwiXCIsXG4gIHdpZGdldFBPOiBudWxsLFxuICBwYWdlUE86IG51bGwsXG4gIGhvc3Q6IG51bGwsXG4gICR3aWRnZXRCb2R5OiBudWxsLFxuICAkd2lkZ2V0Q29udGFpbmVySW5uZXJXcmFwOiBudWxsLFxuICAkd2lkZ2V0Q29udGFpbmVyOiBudWxsLFxuICB3aWRnZXRDb250YWluZXJXaWR0aDogbnVsbCxcbiAgd2lkZ2V0Q29udGFpbmVySGVpZ2h0OiBudWxsLFxuICBDcmVhdGVXaWRnZXRFbGVtOiBmdW5jdGlvbiBDcmVhdGVXaWRnZXRFbGVtKCkge1xuICAgIHJldHVybiBXaWRnZXRDb250cm9sLkNyZWF0ZVdpZGdldEVsZW0uY2FsbCh0aGlzLCB0aGlzLkdldENvbnRleHRNZW51Q29uZmlnKCkpO1xuICB9LFxuICBSZWZyZXNoOiBmdW5jdGlvbiBSZWZyZXNoKCkge1xuICAgIHRoaXMuJHdpZGdldEJvZHkucmVtb3ZlKCk7XG4gICAgdGhpcy4kd2lkZ2V0Qm9keSA9IHRoaXMuX0J1aWxkQm9keUVsZW0oKTtcbiAgICB0aGlzLiR3aWRnZXRDb250YWluZXJJbm5lcldyYXAuYXBwZW5kKHRoaXMuJHdpZGdldEJvZHkpO1xuICAgIGNvbnNvbGUubG9nKFwiUG9ydGxldERlZmF1bHRMaXN0V2lkZ2V0Q29udHJvbC5SZWZyZXNoXCIpO1xuICB9LFxuICBHZXRDb250ZXh0TWVudUNvbmZpZzogZnVuY3Rpb24gR2V0Q29udGV4dE1lbnVDb25maWcoKSB7XG4gICAgcmV0dXJuIFdpZGdldENvbnRyb2wuR2V0RGVmYXVsdENvbnRleHRNZW51Q29uZmlnLmNhbGwodGhpcyk7XG4gIH0sXG4gIE9uQ29udGV4dE1lbnVJbnN0cnVjdGlvbnNFdmVudDogZnVuY3Rpb24gT25Db250ZXh0TWVudUluc3RydWN0aW9uc0V2ZW50KCkge1xuICAgIGNvbnNvbGUubG9nKFwi5pqC5peg5LuL57uNIVwiKTtcbiAgfSxcbiAgT25Db250ZXh0TWVudU1vcmVFdmVudDogZnVuY3Rpb24gT25Db250ZXh0TWVudU1vcmVFdmVudCgpIHtcbiAgICB2YXIgbW9yZVByb3AgPSB0aGlzLndpZGdldFBPLndpZGdldFByb3BlcnRpZXMubW9yZTtcbiAgICB2YXIgZGlhbG9nQ29uZmlnID0gbW9yZVByb3AuZGlhbG9nQ29uZmlnO1xuXG4gICAgaWYgKG1vcmVQcm9wLm9wZW5UeXBlID09IFwiZnJhbWVJZnJhbWVcIikge1xuICAgICAgdmFyIG9wZW5VcmwgPSBtb3JlUHJvcC5vcGVuVXJsO1xuICAgICAgb3BlblVybCA9IFN0cmluZ1V0aWxpdHkuRm9ybWF0V2l0aERlZmF1bHRWYWx1ZShvcGVuVXJsLCB0cnVlLCBudWxsLCBudWxsKTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQwNSwgb3BlblVybCwgZGlhbG9nQ29uZmlnLCAxLCB0cnVlKTtcbiAgICB9XG4gIH0sXG4gIF9CdWlsZFRvb2xCYXI6IFdpZGdldENvbnRyb2wuX0J1aWxkVG9vbEJhcixcbiAgX0J1aWxkQm9keUVsZW06IGZ1bmN0aW9uIF9CdWlsZEJvZHlFbGVtKCkge1xuICAgIHZhciByZXN0VXJsID0gdGhpcy53aWRnZXRQTy53aWRnZXRQcm9wZXJ0aWVzLmxpc3QuZ2V0TGlzdERhdGVSZXN0O1xuICAgIHZhciByZXN0UGFyYXMgPSB0aGlzLndpZGdldFBPLndpZGdldFByb3BlcnRpZXMubGlzdC5nZXRMaXN0RGF0ZVJlc3RQYXJhcztcbiAgICBBamF4VXRpbGl0eS5Qb3N0KHJlc3RVcmwsIHJlc3RQYXJhcywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgIHZhciB3aWRnZXRQcm9wZXJ0aWVzID0gdGhpcy53aWRnZXRQTy53aWRnZXRQcm9wZXJ0aWVzO1xuICAgICAgICB2YXIgJGxpc3RJbm5lcldyYXAgPSB0aGlzLiR3aWRnZXRCb2R5LmZpbmQoXCIud2lkZ2V0LWxpc3QtaW5uZXItd3JhcFwiKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5kYXRhLmxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgcm93RGF0YSA9IHJlc3VsdC5kYXRhLmxpc3RbaV07XG5cbiAgICAgICAgICB2YXIgJHNpbmdsZVJvd0VsZW0gPSB0aGlzLl9CdWlsZFNpbmdsZVJvdyhyb3dEYXRhKTtcblxuICAgICAgICAgICRsaXN0SW5uZXJXcmFwLmFwcGVuZCgkc2luZ2xlUm93RWxlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgICB2YXIgJHdpZGdldEJvZHkgPSAkKFwiPGRpdiBjbGFzcz0nd2lkZ2V0LWJvZHknPjxkaXYgY2xhc3M9J3dpZGdldC1saXN0LW91dGVyLXdyYXAnPjxkaXYgY2xhc3M9J3dpZGdldC1saXN0LWlubmVyLXdyYXAnPjwvZGl2PjwvZGl2PjwvZGl2PlwiKTtcbiAgICByZXR1cm4gJHdpZGdldEJvZHk7XG4gIH0sXG4gIF9CdWlsZFNpbmdsZVJvdzogZnVuY3Rpb24gX0J1aWxkU2luZ2xlUm93KHJvd0RhdGEpIHtcbiAgICBpZiAodGhpcy53aWRnZXRQTy53aWRnZXRQcm9wZXJ0aWVzLmxpc3QucHJpbnRSb3dEYXRhKSB7XG4gICAgICBjb25zb2xlLmxvZyhyb3dEYXRhKTtcbiAgICB9XG5cbiAgICB2YXIgZmllbGRQYXJzaW5nID0gdGhpcy53aWRnZXRQTy53aWRnZXRQcm9wZXJ0aWVzLmxpc3QuZmllbGRQYXJzaW5nO1xuICAgIHZhciB0aXRsZVdpZHRoID0gdGhpcy53aWRnZXRDb250YWluZXJXaWR0aCAtIDY2O1xuICAgIHZhciB0aW1lU3RyID0gU3RyaW5nVXRpbGl0eS5Gb3JtYXRTcHJpbnRmSnNvbk9iaihmaWVsZFBhcnNpbmcudGltZUZvcm1hdCwgcm93RGF0YSk7XG4gICAgdmFyIHRpbWVPYmogPSBEYXRlVXRpbGl0eS5Db252ZXJ0RnJvbVN0cmluZyh0aW1lU3RyKTtcbiAgICB2YXIgZGF0ZVNob3J0ID0gRGF0ZVV0aWxpdHkuRm9ybWF0KHRpbWVPYmosIFwiTU0tZGRcIik7XG4gICAgdmFyIHRpdGxlU3RyID0gU3RyaW5nVXRpbGl0eS5Gb3JtYXRTcHJpbnRmSnNvbk9iaihmaWVsZFBhcnNpbmcudGl0bGVGb3JtYXQsIHJvd0RhdGEpO1xuICAgIHZhciAkcm93RWxlbSA9ICQoXCI8ZGl2IGNsYXNzPSd3aWRnZXQtbGlzdC1yb3ctd3JhcCc+PGRpdiBjbGFzcz0nd2lkZ2V0LWxpc3QtdGl0bGUnIHN0eWxlPSd3aWR0aDogXCIgKyB0aXRsZVdpZHRoICsgXCJweDttYXJnaW4tcmlnaHQ6IDRweCc+PGkgY2xhc3M9XFxcImxhcyBsYS1jaGV2cm9uLXJpZ2h0XFxcIj48L2k+XCIgKyB0aXRsZVN0ciArIFwiPC9kaXY+PGRpdiBjbGFzcz0nd2lkZ2V0LWxpc3QtZGF0ZScgc3R5bGU9J3dpZHRoOiA0MHB4Oyc+XCIgKyBkYXRlU2hvcnQgKyBcIjwvZGl2PjwvZGl2PlwiKTtcbiAgICAkcm93RWxlbS5iaW5kKFwiY2xpY2tcIiwge1xuICAgICAgcm93RGF0YTogcm93RGF0YSxcbiAgICAgIFwid2lkZ2V0SW5zdGFuY2VcIjogdGhpc1xuICAgIH0sIGZ1bmN0aW9uIChzZW5kZXIpIHtcbiAgICAgIHNlbmRlci5kYXRhLndpZGdldEluc3RhbmNlLl9CdWlsZFNpbmdsZVJvd0NsaWNrRXZlbnQuY2FsbChzZW5kZXIuZGF0YS53aWRnZXRJbnN0YW5jZSwgc2VuZGVyLmRhdGEucm93RGF0YSk7XG4gICAgfSk7XG4gICAgcmV0dXJuICRyb3dFbGVtO1xuICB9LFxuICBfQnVpbGRTaW5nbGVSb3dDbGlja0V2ZW50OiBmdW5jdGlvbiBfQnVpbGRTaW5nbGVSb3dDbGlja0V2ZW50KHJvd0RhdGEpIHtcbiAgICB2YXIgbGlzdFByb3AgPSB0aGlzLndpZGdldFBPLndpZGdldFByb3BlcnRpZXMubGlzdDtcbiAgICB2YXIgZGlhbG9nQ29uZmlnID0gbGlzdFByb3AuZGlhbG9nQ29uZmlnO1xuXG4gICAgZnVuY3Rpb24gb3BlblVybEZ1bmMob3BlblVybCwgZGlhbG9nQ29uZmlnKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkMDYsIG9wZW5VcmwsIGRpYWxvZ0NvbmZpZywgMSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKGxpc3RQcm9wLm9wZW5VcmxGb3JtYXRSZXN0KSB7fSBlbHNlIHtcbiAgICAgIGlmIChsaXN0UHJvcC5vcGVuVHlwZSA9PSBcImZyYW1lSWZyYW1lXCIpIHtcbiAgICAgICAgdmFyIG9wZW5VcmwgPSBsaXN0UHJvcC5vcGVuVXJsO1xuICAgICAgICBvcGVuVXJsID0gU3RyaW5nVXRpbGl0eS5Gb3JtYXRXaXRoRGVmYXVsdFZhbHVlKG9wZW5VcmwsIHRydWUsIHJvd0RhdGEsIG51bGwpO1xuICAgICAgICBvcGVuVXJsRnVuYyhvcGVuVXJsLCBkaWFsb2dDb25maWcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKHJvd0RhdGEpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUG9ydGxldERlZmF1bHRRdWlja0VudHJ5V2lkZ2V0Q29udHJvbCA9IHtcbiAgd2lkZ2V0SW5zdGFuY2VJZDogXCJcIixcbiAgd2lkZ2V0UE86IG51bGwsXG4gIHBhZ2VQTzogbnVsbCxcbiAgaG9zdDogbnVsbCxcbiAgJHdpZGdldEJvZHk6IG51bGwsXG4gICR3aWRnZXRDb250YWluZXJJbm5lcldyYXA6IG51bGwsXG4gICR3aWRnZXRDb250YWluZXI6IG51bGwsXG4gIHdpZGdldENvbnRhaW5lcldpZHRoOiBudWxsLFxuICB3aWRnZXRDb250YWluZXJIZWlnaHQ6IG51bGwsXG4gIENyZWF0ZVdpZGdldEVsZW06IGZ1bmN0aW9uIENyZWF0ZVdpZGdldEVsZW0oKSB7XG4gICAgcmV0dXJuIFdpZGdldENvbnRyb2wuQ3JlYXRlV2lkZ2V0RWxlbS5jYWxsKHRoaXMsIHRoaXMuR2V0Q29udGV4dE1lbnVDb25maWcoKSk7XG4gIH0sXG4gIFJlZnJlc2g6IFdpZGdldENvbnRyb2wuTm90UmVmcmVzaCxcbiAgR2V0Q29udGV4dE1lbnVDb25maWc6IGZ1bmN0aW9uIEdldENvbnRleHRNZW51Q29uZmlnKCkge1xuICAgIHJldHVybiBXaWRnZXRDb250cm9sLkdldEVtcHR5Q29udGV4dE1lbnVDb25maWcuY2FsbCh0aGlzKTtcbiAgfSxcbiAgX0J1aWxkVG9vbEJhcjogV2lkZ2V0Q29udHJvbC5fQnVpbGRUb29sQmFyLFxuICBfQnVpbGRCb2R5RWxlbTogZnVuY3Rpb24gX0J1aWxkQm9keUVsZW0oKSB7XG4gICAgdmFyIHdpZGdldFByb3BzID0gdGhpcy53aWRnZXRQTy53aWRnZXRQcm9wZXJ0aWVzO1xuICAgIHZhciAkd2lkZ2V0Qm9keSA9ICQoXCI8ZGl2IGNsYXNzPSd3aWRnZXQtYm9keSc+PGRpdiBjbGFzcz0nd2lkZ2V0LXF1aWNrLWVudHJ5LW91dGVyLXdyYXAnPjxkaXYgY2xhc3M9J3dpZGdldC1xdWljay1lbnRyeS1pbm5lci13cmFwJz48L2Rpdj48L2Rpdj48L2Rpdj5cIik7XG4gICAgdmFyICRxdWlja0VudHJ5SW5uZXJXcmFwID0gJHdpZGdldEJvZHkuZmluZChcIi53aWRnZXQtcXVpY2stZW50cnktaW5uZXItd3JhcFwiKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd2lkZ2V0UHJvcHMuUXVpY2tFbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcXVpY2tFbnRyeSA9IHdpZGdldFByb3BzLlF1aWNrRW50cmllc1tpXTtcblxuICAgICAgdmFyICRxdWlja0VsZW0gPSB0aGlzLl9CdWlsZFNpbmdsZVF1aWNrRW50cnkocXVpY2tFbnRyeSk7XG5cbiAgICAgICRxdWlja0VudHJ5SW5uZXJXcmFwLmFwcGVuZCgkcXVpY2tFbGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJHdpZGdldEJvZHk7XG4gIH0sXG4gIF9CdWlsZFNpbmdsZVF1aWNrRW50cnk6IGZ1bmN0aW9uIF9CdWlsZFNpbmdsZVF1aWNrRW50cnkocXVpY2tFbnRyeSkge1xuICAgIHZhciAkcXVpY2tFbGVtV3JhcCA9ICQoXCI8ZGl2IGNsYXNzPSd3aWRnZXQtcXVpY2stZWxlbS13cmFwJz48ZGl2IHN0eWxlPSdtYXJnaW46IGF1dG87dGV4dC1hbGlnbjogY2VudGVyJz48aW1nIHNyYz0nL1RoZW1lcy9QbmczMlgzMi9cIiArIHF1aWNrRW50cnkuaW1hZ2UgKyBcIicgLz48L2Rpdj48ZGl2PlwiICsgcXVpY2tFbnRyeS5jYXB0aW9uICsgXCI8L2Rpdj48L2Rpdj5cIik7XG4gICAgJHF1aWNrRWxlbVdyYXAuYmluZChcImNsaWNrXCIsIHtcbiAgICAgIHF1aWNrRW50cnk6IHF1aWNrRW50cnksXG4gICAgICBcIndpZGdldEluc3RhbmNlXCI6IHRoaXNcbiAgICB9LCBmdW5jdGlvbiAoc2VuZGVyKSB7XG4gICAgICBzZW5kZXIuZGF0YS53aWRnZXRJbnN0YW5jZS5fQmluZFNpbmdsZVF1aWNrRW50cnlDbGlja0V2ZW50LmNhbGwoc2VuZGVyLmRhdGEud2lkZ2V0SW5zdGFuY2UsIHNlbmRlci5kYXRhLnF1aWNrRW50cnkpO1xuICAgIH0pO1xuICAgIHJldHVybiAkcXVpY2tFbGVtV3JhcDtcbiAgfSxcbiAgX0JpbmRTaW5nbGVRdWlja0VudHJ5Q2xpY2tFdmVudDogZnVuY3Rpb24gX0JpbmRTaW5nbGVRdWlja0VudHJ5Q2xpY2tFdmVudChxdWlja0VudHJ5KSB7XG4gICAgY29uc29sZS5sb2cocXVpY2tFbnRyeSk7XG5cbiAgICBpZiAocXVpY2tFbnRyeS5vcGVuVHlwZSA9PSBcImlubmVySWZyYW1lXCIpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHF1aWNrRW50cnkudXJsLCB7fSwgMSk7XG4gICAgfVxuICB9XG59OyJdfQ==
