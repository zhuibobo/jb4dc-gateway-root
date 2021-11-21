"use strict";

var PortletPageRuntime = {
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
            var widgetContextMenu = PortletPageRuntime.GetWidgetInstanceCache(widgetInstanceId).widgetContextMenu;

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
              var widgetPO = ArrayUtility.WhereSingle(PortletPageRuntime.widgetList, function (item) {
                return item.widgetId == widgetId;
              });
              var $widgetContainer = $(this.$view).find("[name='widgetContainer']");
              var widgetContainerWidth = $widgetContainer.width();
              var widgetContainerHeight = $widgetContainer.height();

              try {
                var widgetInstance = PortletPageRuntime.NewWidgetInstance(widgetInstanceId, widgetPO, pagePO, $widgetContainer, widgetContainerWidth, widgetContainerHeight);

                if (widgetInstance) {
                  PortletPageRuntime.counter++;
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
            var widgetInstance = PortletPageRuntime.GetWidgetInstanceCache(widgetInstanceId).instance;
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
      var widgetContextMenu = PortletPageRuntime.BuildWidgetContextMenu(widgetInstanceId, widgetInstance.GetContextMenuConfig());
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
  CreateWidgetElem: function CreateWidgetElem() {
    this.$widgetContainerInnerWrap = $("<div class='widget-container-inner-wrap'></div>");
    this.$widgetContainerInnerWrap.append(this._BuildTitleElem(this.widgetPO));
    this.$widgetBody = this._BuildBodyElem();
    this.$widgetContainerInnerWrap.append(this.$widgetBody);
    return this.$widgetContainerInnerWrap;
  },
  NotRefresh: function NotRefresh(innerVersion) {},
  _BuildTitleElem: function _BuildTitleElem(widgetPO) {
    return $("<div class='widget-title'><i class=\"las la-angle-right\"></i>" + widgetPO.widgetTitle + "</div>");
  },
  GetInstructionsContextMenuConfig: function GetInstructionsContextMenuConfig() {
    return [{
      id: "widgetInstructions",
      value: "详情",
      click: function click() {
        this.OnContextMenuInstructionsEvent();
      }
    }];
  },
  GetDefaultContextMenuConfig: function GetDefaultContextMenuConfig() {
    return [{
      id: "widgetInstructions",
      value: "详情",
      click: function click() {
        this.OnContextMenuInstructionsEvent();
      }
    }, {
      id: "widgetMore",
      value: "更多",
      click: function click() {
        this.OnContextMenuMoreEvent();
      }
    }];
  },
  GetEmptyContextMenuConfig: function GetEmptyContextMenuConfig() {
    return [];
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
    return WidgetControl.CreateWidgetElem.call(this);
  },
  Refresh: function Refresh() {
    this.$widgetBody.remove();
    this.$widgetBody = this._BuildBodyElem();
    this.$widgetContainerInnerWrap.append(this.$widgetBody);
    console.log("PortletDefaultListWidgetControl.Refresh");
  },
  GetContextMenuConfig: WidgetControl.GetDefaultContextMenuConfig,
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
  _BuildTitleElem: WidgetControl._BuildTitleElem,
  _BuildBodyElem: function _BuildBodyElem() {
    var restUrl = this.widgetPO.widgetProperties.list.getListDateRest;
    var restParas = this.widgetPO.widgetProperties.list.getListDateRestParas;
    AjaxUtility.Post(restUrl, restParas, function (result) {
      if (result.success) {
        console.log(result);
        var widgetProperties = this.widgetPO.widgetProperties;
        var $listInnerWrap = this.$widgetBody.find(".widget-list-inner-wrap");

        for (var i = 0; i < result.data.length; i++) {
          var rowData = result.data[i];

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

    if (listProp.openType == "frameIframe") {
      var openUrl = listProp.openUrl;
      openUrl = StringUtility.FormatWithDefaultValue(openUrl, true, rowData, null);
      DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId06, openUrl, dialogConfig, 1, true);
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
    return WidgetControl.CreateWidgetElem.call(this);
  },
  Refresh: WidgetControl.NotRefresh,
  GetContextMenuConfig: WidgetControl.GetEmptyContextMenuConfig,
  _BuildTitleElem: WidgetControl._BuildTitleElem,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBvcnRsZXRQYWdlUnVudGltZS5qcyIsIlBvcnRsZXRVdGlsaXR5LmpzIiwiV2lkZ2V0Q29udHJvbC5qcyIsIldpZGdldERlbW9EYXRhLmpzIiwiV2lkZ2V0cy9Qb3J0bGV0RGVmYXVsdExpc3RXaWRnZXRDb250cm9sLmpzIiwiV2lkZ2V0cy9Qb3J0bGV0RGVmYXVsdFF1aWNrRW50cnlXaWRnZXRDb250cm9sLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJQb3J0bGV0UnVudGltZUZ1bGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIFBvcnRsZXRQYWdlUnVudGltZSA9IHtcbiAgcGFnZVBPOiBudWxsLFxuICB3aWRnZXRMaXN0OiBudWxsLFxuICB3aWRnZXRJbnN0YW5jZUNhY2hlQXJyYXk6IFtdLFxuICBkYXNoYm9hcmRWaWV3OiBudWxsLFxuICBwYW5lbE1lbnU6IG51bGwsXG4gIGNvdW50ZXI6IDEsXG4gIGFjSW50ZXJmYWNlOiB7XG4gICAgZ2V0VGVtcGxhdGVQYWdlV2l0aFNTT01lbnU6IFwiL1Jlc3QvUG9ydGxldC9SdW5UaW1lL0NsaWVudC9UZW1wbGF0ZVBhZ2VSdW50aW1lL0dldFRlbXBsYXRlUGFnZVdpdGhTU09NZW51XCJcbiAgfSxcbiAgR2V0UGFnZVBPQW5kV2lkZ2V0UE9MaXN0VGhlblJlbmRlcjogZnVuY3Rpb24gR2V0UGFnZVBPQW5kV2lkZ2V0UE9MaXN0VGhlblJlbmRlcigpIHtcbiAgICBBamF4VXRpbGl0eS5HZXQodGhpcy5hY0ludGVyZmFjZS5nZXRUZW1wbGF0ZVBhZ2VXaXRoU1NPTWVudSwge1xuICAgICAgbWVudUlkOiBCYXNlVXRpbGl0eS5HZXRVcmxQYXJhVmFsdWUoXCJtZW51SWRcIilcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgdGhpcy5wYWdlUE8gPSByZXN1bHQuZGF0YTtcbiAgICAgICAgdGhpcy53aWRnZXRMaXN0ID0gcmVzdWx0LmV4S1ZEYXRhLldpZGdldHM7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLndpZGdldExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAodGhpcy53aWRnZXRMaXN0W2ldLndpZGdldFByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIHRoaXMud2lkZ2V0TGlzdFtpXS53aWRnZXRQcm9wZXJ0aWVzID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKHRoaXMud2lkZ2V0TGlzdFtpXS53aWRnZXRQcm9wZXJ0aWVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBhZ2VQTy5wYWdlQ29uZmlnID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKHRoaXMucGFnZVBPLnBhZ2VDb25maWcpO1xuICAgICAgICB0aGlzLnBhZ2VQTy5wYWdlUHJvcGVydGllcyA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbih0aGlzLnBhZ2VQTy5wYWdlUHJvcGVydGllcyk7XG4gICAgICAgIHRoaXMucGFnZVBPLnBhZ2VSZWZDc3NDb25maWcgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24odGhpcy5wYWdlUE8ucGFnZVJlZkNzc0NvbmZpZyk7XG4gICAgICAgIHRoaXMucGFnZVBPLnBhZ2VSZWZKc0NvbmZpZyA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbih0aGlzLnBhZ2VQTy5wYWdlUmVmSnNDb25maWcpO1xuXG4gICAgICAgIGlmICh0aGlzLnBhZ2VQTy5wYWdlV2lkZ2V0Q29uZmlnKSB7XG4gICAgICAgICAgdGhpcy5wYWdlUE8ucGFnZVdpZGdldENvbmZpZyA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbih0aGlzLnBhZ2VQTy5wYWdlV2lkZ2V0Q29uZmlnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnBhZ2VQTy5wYWdlV2lkZ2V0Q29uZmlnID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzKTtcbiAgICAgICAgdmFyIGluaXRGdW5jO1xuXG4gICAgICAgIGlmICh0aGlzLnBhZ2VQTy5wYWdlUmVmSnNDb25maWcgJiYgdGhpcy5wYWdlUE8ucGFnZVJlZkpzQ29uZmlnLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB2YXIgaW5pdEZ1bmNTdHIgPSBcImxldCBfdGhpcz10aGlzOyRMQUJcIjtcblxuICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCB0aGlzLnBhZ2VQTy5wYWdlUmVmSnNDb25maWcubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcmVmSnMgPSB0aGlzLnBhZ2VQTy5wYWdlUmVmSnNDb25maWdbX2ldLnJlZkpzUGF0aDtcbiAgICAgICAgICAgIHJlZkpzID0gU3RyaW5nVXRpbGl0eS5Gb3JtYXRXaXRoRGVmYXVsdFZhbHVlKHJlZkpzLCBudWxsKTtcbiAgICAgICAgICAgIHJlZkpzID0gQmFzZVV0aWxpdHkuQXBwZW5kVGltZVN0YW1wVXJsKHJlZkpzKTtcbiAgICAgICAgICAgIGluaXRGdW5jU3RyICs9IFwiLnNjcmlwdCgnXCIgKyByZWZKcyArIFwiJylcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpbml0RnVuY1N0ciArPSBcIi53YWl0KGZ1bmN0aW9uKCl7X3RoaXMuUmVuZGVyUGFnZSgpO30pO1wiO1xuICAgICAgICAgIGluaXRGdW5jID0gRnVuY3Rpb24oaW5pdEZ1bmNTdHIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGluaXRGdW5jID0gRnVuY3Rpb24oXCJ0aGlzLlJlbmRlclBhZ2UoKTtcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0RnVuYy5jYWxsKHRoaXMpO1xuXG4gICAgICAgIGlmICh0aGlzLnBhZ2VQTy5wYWdlUmVmQ3NzQ29uZmlnICYmIHRoaXMucGFnZVBPLnBhZ2VSZWZDc3NDb25maWcubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciAodmFyIF9pMiA9IDA7IF9pMiA8IHRoaXMucGFnZVBPLnBhZ2VSZWZDc3NDb25maWcubGVuZ3RoOyBfaTIrKykge1xuICAgICAgICAgICAgdmFyIHJlZkNzcyA9IHRoaXMucGFnZVBPLnBhZ2VSZWZDc3NDb25maWdbX2kyXS5yZWZDU1NQYXRoO1xuICAgICAgICAgICAgcmVmQ3NzID0gU3RyaW5nVXRpbGl0eS5Gb3JtYXRXaXRoRGVmYXVsdFZhbHVlKHJlZkNzcywgbnVsbCk7XG4gICAgICAgICAgICBMb2FkSnNDc3NVdGlsaXR5KHJlZkNzcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIFJlbmRlclBhZ2U6IGZ1bmN0aW9uIFJlbmRlclBhZ2UoKSB7XG4gICAgdmFyIGRhc2hib2FyZFZpZXcgPSB0aGlzLkJ1aWxkRGFzaGJvYXJkVmlldygpO1xuICAgIHdlYml4LnVpKHtcbiAgICAgIHR5cGU6IFwic3BhY2VcIixcbiAgICAgIGNvbHM6IFt7XG4gICAgICAgIHZpZXc6IFwic2Nyb2xsdmlld1wiLFxuICAgICAgICBib2R5OiBkYXNoYm9hcmRWaWV3XG4gICAgICB9XVxuICAgIH0pO1xuICAgIHdlYml4LmV2ZW50KGRvY3VtZW50LmJvZHksIFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2KSB7XG4gICAgICB2YXIgY3NzID0gZXYudGFyZ2V0LmNsYXNzTmFtZTtcblxuICAgICAgaWYgKGNzcyAmJiBjc3MudG9TdHJpbmcoKS5pbmRleE9mKFwicGFuZWxfaWNvblwiKSAhPSAtMSkge1xuICAgICAgICB2YXIgY2xhc3NOYW1lQXJyYXkgPSBjc3Muc3BsaXQoXCIgXCIpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3NOYW1lQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoY2xhc3NOYW1lQXJyYXlbaV0uaW5kZXhPZihcIndpZGdldEluc3RhbmNlSWRfXCIpID09IDApIHtcbiAgICAgICAgICAgIHZhciB3aWRnZXRJbnN0YW5jZUlkID0gY2xhc3NOYW1lQXJyYXlbaV0ucmVwbGFjZShcIndpZGdldEluc3RhbmNlSWRfXCIsIFwiXCIpO1xuICAgICAgICAgICAgdmFyIHdpZGdldENvbnRleHRNZW51ID0gUG9ydGxldFBhZ2VSdW50aW1lLkdldFdpZGdldEluc3RhbmNlQ2FjaGUod2lkZ2V0SW5zdGFuY2VJZCkud2lkZ2V0Q29udGV4dE1lbnU7XG5cbiAgICAgICAgICAgIGlmICh3aWRnZXRDb250ZXh0TWVudSkge1xuICAgICAgICAgICAgICB3aWRnZXRDb250ZXh0TWVudS5zZXRDb250ZXh0KHdlYml4LiQkKGV2LnRhcmdldCkpO1xuICAgICAgICAgICAgICB3aWRnZXRDb250ZXh0TWVudS5zaG93KGV2LnRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5wYWdlUE8ucGFnZVdpZGdldENvbmZpZykge1xuICAgICAgJCQoXCJkYXNoYm9hcmRWaWV3TGF5b3V0XCIpLnJlc3RvcmUodGhpcy5wYWdlUE8ucGFnZVdpZGdldENvbmZpZyk7XG4gICAgfVxuXG4gICAgcG9ydGxldFV0aWxpdHkuSW5pdFJlZnJlc2hTdGF0dXMoKTtcbiAgICBwb3J0bGV0VXRpbGl0eS5TdGFydEF1dG9SZWZyZXNoQ29udHJvbCh0aGlzLlJlZnJlc2hBTExXaWRnZXQsIHRoaXMpO1xuICAgIHZhciB1c2VyID0ge1xuICAgICAgdTE6IHtcbiAgICAgICAgbmFtZTogXCJ6enpcIlxuICAgICAgfSxcbiAgICAgIHUyOiB7XG4gICAgICAgIG5hbWU6IFwiYWEnYVxcXCJhXCJcbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbnNvbGUubG9nKHNwcmludGYoJ2EuZG8/YT0lKHUxLm5hbWUpcyZiPSUodTIubmFtZSlzJywgdXNlcikpO1xuICB9LFxuICBSZWZyZXNoQUxMV2lkZ2V0OiBmdW5jdGlvbiBSZWZyZXNoQUxMV2lkZ2V0KGlubmVyVmVyc2lvbikge1xuICAgIGNvbnNvbGUubG9nKGlubmVyVmVyc2lvbik7XG5cbiAgICB0cnkge1xuICAgICAgdmFyIGFsbFdpZGdldEluc3RhbmNlQXJyYXkgPSB0aGlzLndpZGdldEluc3RhbmNlQ2FjaGVBcnJheTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxXaWRnZXRJbnN0YW5jZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB3aWRnZXRJbnN0YW5jZSA9IGFsbFdpZGdldEluc3RhbmNlQXJyYXlbaV0uaW5zdGFuY2U7XG4gICAgICAgIHdpZGdldEluc3RhbmNlLlJlZnJlc2goaW5uZXJWZXJzaW9uKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfSxcbiAgQnVpbGREYXNoYm9hcmRWaWV3OiBmdW5jdGlvbiBCdWlsZERhc2hib2FyZFZpZXcoKSB7XG4gICAgdmFyIHBhZ2VQTyA9IHRoaXMucGFnZVBPO1xuICAgIHZhciBkYXNoYm9hcmQgPSB7XG4gICAgICB2aWV3OiBcImdyaWRsYXlvdXRcIixcbiAgICAgIGlkOiBcImRhc2hib2FyZFZpZXdMYXlvdXRcIixcbiAgICAgIGdyaWRDb2x1bW5zOiBwYWdlUE8ucGFnZUNvbmZpZy5ncmlkQ29sdW1ucyxcbiAgICAgIGdyaWRSb3dzOiBwYWdlUE8ucGFnZUNvbmZpZy5ncmlkUm93cyxcbiAgICAgIGNlbGxIZWlnaHQ6IHBhZ2VQTy5wYWdlQ29uZmlnLmNlbGxIZWlnaHQsXG4gICAgICBmYWN0b3J5OiBmdW5jdGlvbiBmYWN0b3J5KG9iaikge1xuICAgICAgICB2YXIgd2lkZ2V0SWQgPSBvYmoubmFtZTtcbiAgICAgICAgdmFyIHdpZGdldEluc3RhbmNlSWQgPSBvYmouaWQ7XG4gICAgICAgIG9iai52aWV3ID0gXCJwYW5lbFwiO1xuICAgICAgICBvYmoucmVzaXplID0gZmFsc2U7XG4gICAgICAgIG9iai5pY29uID0gXCJsYXMgbGEtYmFycyB3aWRnZXRJbnN0YW5jZUlkX1wiICsgd2lkZ2V0SW5zdGFuY2VJZDtcbiAgICAgICAgb2JqLmJvZHkgPSB7XG4gICAgICAgICAgdmlldzogXCJ0ZW1wbGF0ZVwiLFxuICAgICAgICAgIGNzczogXCJ3ZWJpeF90ZW1wbGF0ZV9mb3Jfd2lkZ2V0XCIsXG4gICAgICAgICAgdGVtcGxhdGU6IGZ1bmN0aW9uIHRlbXBsYXRlKGRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBcIjxkaXYgbmFtZT0nd2lkZ2V0Q29udGFpbmVyJyBjbGFzcz0nd2lkZ2V0LWNvbnRhaW5lci1vdXRlci13cmFwJz48L2Rpdj5cIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHBhZ2VQTzogcGFnZVBPLFxuICAgICAgICAgICAgd2lkZ2V0SWQ6IHdpZGdldElkLFxuICAgICAgICAgICAgd2lkZ2V0SW5zdGFuY2VJZDogd2lkZ2V0SW5zdGFuY2VJZFxuICAgICAgICAgIH0sXG4gICAgICAgICAgb246IHtcbiAgICAgICAgICAgIG9uVmlld1Nob3c6IGZ1bmN0aW9uIG9uVmlld1Nob3coKSB7fSxcbiAgICAgICAgICAgIG9uQWZ0ZXJMb2FkOiBmdW5jdGlvbiBvbkFmdGVyTG9hZCgpIHt9LFxuICAgICAgICAgICAgb25CbHVyOiBmdW5jdGlvbiBvbkJsdXIocHJldl92aWV3KSB7fSxcbiAgICAgICAgICAgIG9uQmVmb3JlUmVuZGVyOiBmdW5jdGlvbiBvbkJlZm9yZVJlbmRlcihkYXRhKSB7fSxcbiAgICAgICAgICAgIG9uQWZ0ZXJSZW5kZXI6IGZ1bmN0aW9uIG9uQWZ0ZXJSZW5kZXIoZGF0YSkge1xuICAgICAgICAgICAgICB2YXIgcGFnZVBPID0gdGhpcy5kYXRhLnBhZ2VQTztcbiAgICAgICAgICAgICAgdmFyIHdpZGdldElkID0gdGhpcy5kYXRhLndpZGdldElkO1xuICAgICAgICAgICAgICB2YXIgd2lkZ2V0SW5zdGFuY2VJZCA9IHRoaXMuZGF0YS53aWRnZXRJbnN0YW5jZUlkO1xuICAgICAgICAgICAgICB2YXIgd2lkZ2V0UE8gPSBBcnJheVV0aWxpdHkuV2hlcmVTaW5nbGUoUG9ydGxldFBhZ2VSdW50aW1lLndpZGdldExpc3QsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0ud2lkZ2V0SWQgPT0gd2lkZ2V0SWQ7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB2YXIgJHdpZGdldENvbnRhaW5lciA9ICQodGhpcy4kdmlldykuZmluZChcIltuYW1lPSd3aWRnZXRDb250YWluZXInXVwiKTtcbiAgICAgICAgICAgICAgdmFyIHdpZGdldENvbnRhaW5lcldpZHRoID0gJHdpZGdldENvbnRhaW5lci53aWR0aCgpO1xuICAgICAgICAgICAgICB2YXIgd2lkZ2V0Q29udGFpbmVySGVpZ2h0ID0gJHdpZGdldENvbnRhaW5lci5oZWlnaHQoKTtcblxuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciB3aWRnZXRJbnN0YW5jZSA9IFBvcnRsZXRQYWdlUnVudGltZS5OZXdXaWRnZXRJbnN0YW5jZSh3aWRnZXRJbnN0YW5jZUlkLCB3aWRnZXRQTywgcGFnZVBPLCAkd2lkZ2V0Q29udGFpbmVyLCB3aWRnZXRDb250YWluZXJXaWR0aCwgd2lkZ2V0Q29udGFpbmVySGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIGlmICh3aWRnZXRJbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgICAgUG9ydGxldFBhZ2VSdW50aW1lLmNvdW50ZXIrKztcbiAgICAgICAgICAgICAgICAgICR3aWRnZXRDb250YWluZXIuYXBwZW5kKHdpZGdldEluc3RhbmNlLkNyZWF0ZVdpZGdldEVsZW0oKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICR3aWRnZXRDb250YWluZXIuYXBwZW5kKFwi5a6e5L6L5YyWV2lkZ2V05aSx6LSlLOivt+ajgOafpeS7o+eggTEhXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICR3aWRnZXRDb250YWluZXIuYXBwZW5kKFwi5a6e5L6L5YyWV2lkZ2V05aSx6LSlLOivt+ajgOafpeS7o+eggSFcIiArIGUudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9LFxuICAgICAgb246IHt9XG4gICAgfTtcbiAgICByZXR1cm4gZGFzaGJvYXJkO1xuICB9LFxuICBCdWlsZFdpZGdldENvbnRleHRNZW51OiBmdW5jdGlvbiBCdWlsZFdpZGdldENvbnRleHRNZW51KHdpZGdldEluc3RhbmNlSWQsIG1lbnVDb25maWcpIHtcbiAgICBpZiAobWVudUNvbmZpZy5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIG1lbnUgPSB3ZWJpeC51aSh7XG4gICAgICB2aWV3OiBcImNvbnRleHRtZW51XCIsXG4gICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soaWQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW51Q29uZmlnLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKG1lbnVDb25maWdbaV0uaWQgPT0gaWQpIHtcbiAgICAgICAgICAgIHZhciB3aWRnZXRJbnN0YW5jZSA9IFBvcnRsZXRQYWdlUnVudGltZS5HZXRXaWRnZXRJbnN0YW5jZUNhY2hlKHdpZGdldEluc3RhbmNlSWQpLmluc3RhbmNlO1xuICAgICAgICAgICAgbWVudUNvbmZpZ1tpXS5jbGljay5jYWxsKHdpZGdldEluc3RhbmNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkYXRhOiBtZW51Q29uZmlnXG4gICAgfSk7XG4gICAgcmV0dXJuIG1lbnU7XG4gIH0sXG4gIE5ld1dpZGdldEluc3RhbmNlOiBmdW5jdGlvbiBOZXdXaWRnZXRJbnN0YW5jZSh3aWRnZXRJbnN0YW5jZUlkLCB3aWRnZXRQTywgcGFnZVBPLCAkd2lkZ2V0Q29udGFpbmVyLCB3aWRnZXRDb250YWluZXJXaWR0aCwgd2lkZ2V0Q29udGFpbmVySGVpZ2h0KSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciB3aWRnZXRJbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoZXZhbCh3aWRnZXRQTy53aWRnZXRDbGllbnRSZW5kZXIpKTtcbiAgICAgIHdpZGdldEluc3RhbmNlLndpZGdldEluc3RhbmNlSWQgPSB3aWRnZXRJbnN0YW5jZUlkO1xuICAgICAgd2lkZ2V0SW5zdGFuY2Uud2lkZ2V0UE8gPSB3aWRnZXRQTztcbiAgICAgIHdpZGdldEluc3RhbmNlLnBhZ2VQTyA9IHBhZ2VQTztcbiAgICAgIHdpZGdldEluc3RhbmNlLiR3aWRnZXRDb250YWluZXIgPSAkd2lkZ2V0Q29udGFpbmVyO1xuICAgICAgd2lkZ2V0SW5zdGFuY2Uud2lkZ2V0Q29udGFpbmVyV2lkdGggPSB3aWRnZXRDb250YWluZXJXaWR0aDtcbiAgICAgIHdpZGdldEluc3RhbmNlLndpZGdldENvbnRhaW5lckhlaWdodCA9IHdpZGdldENvbnRhaW5lckhlaWdodDtcbiAgICAgIHZhciB3aWRnZXRDb250ZXh0TWVudSA9IFBvcnRsZXRQYWdlUnVudGltZS5CdWlsZFdpZGdldENvbnRleHRNZW51KHdpZGdldEluc3RhbmNlSWQsIHdpZGdldEluc3RhbmNlLkdldENvbnRleHRNZW51Q29uZmlnKCkpO1xuICAgICAgdGhpcy53aWRnZXRJbnN0YW5jZUNhY2hlQXJyYXkucHVzaCh7XG4gICAgICAgIFwid2lkZ2V0SW5zdGFuY2VJZFwiOiB3aWRnZXRJbnN0YW5jZUlkLFxuICAgICAgICBcImluc3RhbmNlXCI6IHdpZGdldEluc3RhbmNlLFxuICAgICAgICBcIndpZGdldENvbnRleHRNZW51XCI6IHdpZGdldENvbnRleHRNZW51XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB3aWRnZXRJbnN0YW5jZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfSxcbiAgR2V0V2lkZ2V0SW5zdGFuY2VDYWNoZTogZnVuY3Rpb24gR2V0V2lkZ2V0SW5zdGFuY2VDYWNoZSh3aWRnZXRJbnN0YW5jZUlkKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLndpZGdldEluc3RhbmNlQ2FjaGVBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMud2lkZ2V0SW5zdGFuY2VDYWNoZUFycmF5W2ldLndpZGdldEluc3RhbmNlSWQgPT0gd2lkZ2V0SW5zdGFuY2VJZCkge1xuICAgICAgICByZXR1cm4gdGhpcy53aWRnZXRJbnN0YW5jZUNhY2hlQXJyYXlbaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBwb3J0bGV0VXRpbGl0eSA9IHtcbiAgcmVmcmVzaFZlcnNpb25LZXk6IFwicG9ydGxldFV0aWxpdHktUmVmcmVzaFZlcnNpb25cIixcbiAgaW5uZXJWZXJzaW9uOiBudWxsLFxuICBhdXRvUmVmcmVzaENvbnRyb2xGdW5jOiBudWxsLFxuICBHZXRSZWZyZXNoVmVyc2lvbjogZnVuY3Rpb24gR2V0UmVmcmVzaFZlcnNpb24oKSB7XG4gICAgdmFyIHJlZnJlc2hWZXJzaW9uID0gTG9jYWxTdG9yYWdlVXRpbGl0eS5nZXRJdGVtKHRoaXMucmVmcmVzaFZlcnNpb25LZXkpO1xuXG4gICAgaWYgKCFyZWZyZXNoVmVyc2lvbikge1xuICAgICAgcmVmcmVzaFZlcnNpb24gPSAxO1xuICAgIH1cblxuICAgIHJldHVybiByZWZyZXNoVmVyc2lvbjtcbiAgfSxcbiAgVXBkYXRlUmVmcmVzaFZlcnNpb246IGZ1bmN0aW9uIFVwZGF0ZVJlZnJlc2hWZXJzaW9uKCkge1xuICAgIHZhciByZWZyZXNoVmVyc2lvbiA9IHRoaXMuR2V0UmVmcmVzaFZlcnNpb24oKTtcbiAgICByZWZyZXNoVmVyc2lvbisrO1xuICAgIExvY2FsU3RvcmFnZVV0aWxpdHkuc2V0SXRlbSh0aGlzLnJlZnJlc2hWZXJzaW9uS2V5LCByZWZyZXNoVmVyc2lvbik7XG4gIH0sXG4gIEluaXRSZWZyZXNoU3RhdHVzOiBmdW5jdGlvbiBJbml0UmVmcmVzaFN0YXR1cygpIHtcbiAgICBMb2NhbFN0b3JhZ2VVdGlsaXR5LnNldEl0ZW0odGhpcy5yZWZyZXNoVmVyc2lvbktleSwgMSk7XG4gICAgdGhpcy5VcGRhdGVSZWZyZXNoVmVyc2lvbigpO1xuICAgIHRoaXMuaW5uZXJWZXJzaW9uID0gdGhpcy5HZXRSZWZyZXNoVmVyc2lvbigpO1xuICB9LFxuICBOZWVkVG9CZVJlZnJlc2g6IGZ1bmN0aW9uIE5lZWRUb0JlUmVmcmVzaCgpIHtcbiAgICB2YXIgbmV3UmVmcmVzaFZlcnNpb24gPSB0aGlzLkdldFJlZnJlc2hWZXJzaW9uKCk7XG5cbiAgICBpZiAobmV3UmVmcmVzaFZlcnNpb24gPiB0aGlzLmlubmVyVmVyc2lvbikge1xuICAgICAgdGhpcy5pbm5lclZlcnNpb24gPSBuZXdSZWZyZXNoVmVyc2lvbjtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgU3RhcnRBdXRvUmVmcmVzaENvbnRyb2w6IGZ1bmN0aW9uIFN0YXJ0QXV0b1JlZnJlc2hDb250cm9sKHJlZnJlc2hGdW5jLCBjYWxsZXIpIHtcbiAgICBwb3J0bGV0VXRpbGl0eS5hdXRvUmVmcmVzaENvbnRyb2xGdW5jID0gcmVmcmVzaEZ1bmM7XG4gICAgd2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChwb3J0bGV0VXRpbGl0eS5OZWVkVG9CZVJlZnJlc2goKSkge1xuICAgICAgICBwb3J0bGV0VXRpbGl0eS5hdXRvUmVmcmVzaENvbnRyb2xGdW5jLmNhbGwoY2FsbGVyLCBwb3J0bGV0VXRpbGl0eS5pbm5lclZlcnNpb24pO1xuICAgICAgfVxuICAgIH0sIDEwMDApO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV2lkZ2V0Q29udHJvbCA9IHtcbiAgQ3JlYXRlV2lkZ2V0RWxlbTogZnVuY3Rpb24gQ3JlYXRlV2lkZ2V0RWxlbSgpIHtcbiAgICB0aGlzLiR3aWRnZXRDb250YWluZXJJbm5lcldyYXAgPSAkKFwiPGRpdiBjbGFzcz0nd2lkZ2V0LWNvbnRhaW5lci1pbm5lci13cmFwJz48L2Rpdj5cIik7XG4gICAgdGhpcy4kd2lkZ2V0Q29udGFpbmVySW5uZXJXcmFwLmFwcGVuZCh0aGlzLl9CdWlsZFRpdGxlRWxlbSh0aGlzLndpZGdldFBPKSk7XG4gICAgdGhpcy4kd2lkZ2V0Qm9keSA9IHRoaXMuX0J1aWxkQm9keUVsZW0oKTtcbiAgICB0aGlzLiR3aWRnZXRDb250YWluZXJJbm5lcldyYXAuYXBwZW5kKHRoaXMuJHdpZGdldEJvZHkpO1xuICAgIHJldHVybiB0aGlzLiR3aWRnZXRDb250YWluZXJJbm5lcldyYXA7XG4gIH0sXG4gIE5vdFJlZnJlc2g6IGZ1bmN0aW9uIE5vdFJlZnJlc2goaW5uZXJWZXJzaW9uKSB7fSxcbiAgX0J1aWxkVGl0bGVFbGVtOiBmdW5jdGlvbiBfQnVpbGRUaXRsZUVsZW0od2lkZ2V0UE8pIHtcbiAgICByZXR1cm4gJChcIjxkaXYgY2xhc3M9J3dpZGdldC10aXRsZSc+PGkgY2xhc3M9XFxcImxhcyBsYS1hbmdsZS1yaWdodFxcXCI+PC9pPlwiICsgd2lkZ2V0UE8ud2lkZ2V0VGl0bGUgKyBcIjwvZGl2PlwiKTtcbiAgfSxcbiAgR2V0SW5zdHJ1Y3Rpb25zQ29udGV4dE1lbnVDb25maWc6IGZ1bmN0aW9uIEdldEluc3RydWN0aW9uc0NvbnRleHRNZW51Q29uZmlnKCkge1xuICAgIHJldHVybiBbe1xuICAgICAgaWQ6IFwid2lkZ2V0SW5zdHJ1Y3Rpb25zXCIsXG4gICAgICB2YWx1ZTogXCLor6bmg4VcIixcbiAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgdGhpcy5PbkNvbnRleHRNZW51SW5zdHJ1Y3Rpb25zRXZlbnQoKTtcbiAgICAgIH1cbiAgICB9XTtcbiAgfSxcbiAgR2V0RGVmYXVsdENvbnRleHRNZW51Q29uZmlnOiBmdW5jdGlvbiBHZXREZWZhdWx0Q29udGV4dE1lbnVDb25maWcoKSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICBpZDogXCJ3aWRnZXRJbnN0cnVjdGlvbnNcIixcbiAgICAgIHZhbHVlOiBcIuivpuaDhVwiLFxuICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICB0aGlzLk9uQ29udGV4dE1lbnVJbnN0cnVjdGlvbnNFdmVudCgpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGlkOiBcIndpZGdldE1vcmVcIixcbiAgICAgIHZhbHVlOiBcIuabtOWkmlwiLFxuICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICB0aGlzLk9uQ29udGV4dE1lbnVNb3JlRXZlbnQoKTtcbiAgICAgIH1cbiAgICB9XTtcbiAgfSxcbiAgR2V0RW1wdHlDb250ZXh0TWVudUNvbmZpZzogZnVuY3Rpb24gR2V0RW1wdHlDb250ZXh0TWVudUNvbmZpZygpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXaWRnZXREZW1vRGF0YSA9IHtcbiAgR2V0RGVtb0JvZHk6IGZ1bmN0aW9uIEdldERlbW9Cb2R5KCkge1xuICAgIHJldHVybiBcIndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCXCI7XG4gIH0sXG4gIEdldFF1aWNrRW50cnlEZW1vUHJvcHM6IGZ1bmN0aW9uIEdldFF1aWNrRW50cnlEZW1vUHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFF1aWNrRW50cmllczogW3tcbiAgICAgICAgbmFtZTogXCLkuovliqHlj5HotbdcIixcbiAgICAgICAgY2FwdGlvbjogXCLkuovliqHlj5HotbdcIixcbiAgICAgICAgb3BlblR5cGU6IFwiaW5uZXJJZnJhbWVcIixcbiAgICAgICAgdXJsOiBcIi9RQ1N5c3RlbS9KQjREQ0J1aWxkZXJDbGllbnQvSFRNTC9Xb3JrRmxvdy9SdW50aW1lL015Qm9vdGFibGVNeU1vZGVscy5odG1sP21lbnVJZD1RQ1N5c3RlbS1Xb3JrRmxvdy1DbGllbnQtQm9vdGFibGVcIixcbiAgICAgICAgaW1hZ2U6IFwiMDI2NS5wbmdcIlxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiBcIuWPkeaWh+WPkei1t1wiLFxuICAgICAgICBjYXB0aW9uOiBcIuWPkeaWh+WPkei1t1wiLFxuICAgICAgICBvcGVuVHlwZTogXCJtZW51XCIsXG4gICAgICAgIGltYWdlOiBcIjAyMjMucG5nXCJcbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogXCLmlLbmloflj5HotbdcIixcbiAgICAgICAgY2FwdGlvbjogXCLmlLbmloflj5HotbdcIixcbiAgICAgICAgb3BlblR5cGU6IFwibWVudVwiLFxuICAgICAgICBpbWFnZTogXCIwMjU1LnBuZ1wiXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6IFwi5paH5Lu25Lyg6YCSXCIsXG4gICAgICAgIGNhcHRpb246IFwi5paH5Lu25Lyg6YCSXCIsXG4gICAgICAgIG9wZW5UeXBlOiBcIm1lbnVcIixcbiAgICAgICAgaW1hZ2U6IFwiMDI0Ny5wbmdcIlxuICAgICAgfV1cbiAgICB9O1xuICB9LFxuICBHZXRUb0RvTGlzdFdpZGdldFByb3BzOiBmdW5jdGlvbiBHZXRUb0RvTGlzdFdpZGdldFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsaXN0OiB7XG4gICAgICAgIGdldExpc3REYXRlUmVzdDogXCIvJShhcHBDb250ZXh0UGF0aClzL1Jlc3QvRXh0ZW5zaW9uL1BvcnRsZXQvV29ya2Zsb3dUcmFuc2Zvcm0vR2V0TXlQcm9jZXNzVGFza0xpc3RcIixcbiAgICAgICAgZ2V0TGlzdERhdGVSZXN0UGFyYXM6IHtcbiAgICAgICAgICBtb2RlbENhdGVnb3J5OiBcIkdlbmVyYWxQcm9jZXNzXCIsXG4gICAgICAgICAgcGFnZVNpemU6IDEyXG4gICAgICAgIH0sXG4gICAgICAgIG9wZW5UeXBlOiBcImZyYW1lSWZyYW1lXCIsXG4gICAgICAgIGRpYWxvZ0NvbmZpZzoge1xuICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICB0aXRsZTogXCJKQjREQ1wiLFxuICAgICAgICAgIG1vZGFsOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIGZpZWxkUGFyc2luZzoge1xuICAgICAgICAgIHRpbWVGb3JtYXQ6IFwiJShpbnN0YW5jZUVudGl0eS5pbnN0Q3JlYXRlVGltZSlzXCIsXG4gICAgICAgICAgdGl0bGVGb3JtYXQ6IFwiW+agh+mimF0lKGluc3RhbmNlRW50aXR5Lmluc3RUaXRsZSlzLSUoZXh0YXNrQ3VyTm9kZU5hbWUpc1wiXG4gICAgICAgIH0sXG4gICAgICAgIG9wZW5Vcmw6IFwiLyUoYXBwQ29udGV4dFBhdGgpcy9KQjREQ0J1aWxkZXJDbGllbnQvSFRNTC9Xb3JrRmxvdy9SdW50aW1lL015UHJvY2Vzc0luc3RhbmNlTWFpblRhc2suaHRtbD9vcD11cGRhdGUmZXh0YXNrSWQ9JShleHRhc2tJZClzXCIsXG4gICAgICAgIHByaW50Um93RGF0YTogZmFsc2VcbiAgICAgIH0sXG4gICAgICBtb3JlOiB7XG4gICAgICAgIG9wZW5UeXBlOiBcImZyYW1lSWZyYW1lXCIsXG4gICAgICAgIGRpYWxvZ0NvbmZpZzoge1xuICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICB0aXRsZTogXCJKQjREQ1wiLFxuICAgICAgICAgIG1vZGFsOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIG9wZW5Vcmw6IFwiLyUoYXBwQ29udGV4dFBhdGgpcy9KQjREQ0J1aWxkZXJDbGllbnQvSFRNTC9Xb3JrRmxvdy9SdW50aW1lL015UHJvY2Vzc0luc3RhbmNlTWFpblRhc2tMaXN0Lmh0bWw/bWVudUlkPVFDU3lzdGVtLVdvcmtGbG93LUNsaWVudC1NeVRhc2tcIlxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIEdldERlbW9Ub0RvTGlzdERhdGE6IGZ1bmN0aW9uIEdldERlbW9Ub0RvTGlzdERhdGEoKSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICBwcmVmaXg6IFwi5q2j5bi4XCIsXG4gICAgICB0aXRsZTogXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAglwiLFxuICAgICAgZGF0ZTogXCIyMDIxLTA1LTA2IDEyOjU1OjEyXCJcbiAgICB9LCB7XG4gICAgICBwcmVmaXg6IFwi5Yqg5oClXCIsXG4gICAgICB0aXRsZTogXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJtcIixcbiAgICAgIGRhdGU6IFwiMjAyMS0wNS0wNSAxMjo1NToxMlwiXG4gICAgfSwge1xuICAgICAgcHJlZml4OiBcIumHjeimgVwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgIJcIixcbiAgICAgIGRhdGU6IFwiMjAyMS0wNS0wNSAxMjo1NToxMlwiXG4gICAgfSwge1xuICAgICAgcHJlZml4OiBcIumHjeimgVwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybXCIsXG4gICAgICBkYXRlOiBcIjIwMjEtMDUtMDUgMTI6NTU6MTJcIlxuICAgIH0sIHtcbiAgICAgIHByZWZpeDogXCLmraPluLhcIixcbiAgICAgIHRpdGxlOiBcIndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CCXCIsXG4gICAgICBkYXRlOiBcIjIwMjEtMDUtMDUgMTI6NTU6MTJcIlxuICAgIH0sIHtcbiAgICAgIHByZWZpeDogXCLmraPluLhcIixcbiAgICAgIHRpdGxlOiBcIndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CCc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndcIixcbiAgICAgIGRhdGU6IFwiMjAyMS0wNS0wNSAxMjo1NToxMlwiXG4gICAgfSwge1xuICAgICAgcHJlZml4OiBcIuato+W4uFwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgIIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva5cIixcbiAgICAgIGRhdGU6IFwiMjAyMS0wNS0wNSAxMjo1NToxMlwiXG4gICAgfSwge1xuICAgICAgcHJlZml4OiBcIuato+W4uFwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgIJzd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd1wiLFxuICAgICAgZGF0ZTogXCIyMDIxLTA1LTA1IDEyOjU1OjEyXCJcbiAgICB9LCB7XG4gICAgICBwcmVmaXg6IFwi5q2j5bi4XCIsXG4gICAgICB0aXRsZTogXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAgi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9rlwiLFxuICAgICAgZGF0ZTogXCIyMDIxLTA1LTA1IDEyOjU1OjEyXCJcbiAgICB9LCB7XG4gICAgICBwcmVmaXg6IFwi5q2j5bi4XCIsXG4gICAgICB0aXRsZTogXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAgi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9rlwiLFxuICAgICAgZGF0ZTogXCIyMDIxLTA1LTA1IDEyOjU1OjEyXCJcbiAgICB9LCB7XG4gICAgICBwcmVmaXg6IFwi5q2j5bi4XCIsXG4gICAgICB0aXRsZTogXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAglwiLFxuICAgICAgZGF0ZTogXCIyMDIxLTA1LTA1IDEyOjU1OjEyXCJcbiAgICB9LCB7XG4gICAgICBwcmVmaXg6IFwi5q2j5bi4XCIsXG4gICAgICB0aXRsZTogXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAgnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3XCIsXG4gICAgICBkYXRlOiBcIjIwMjEtMDUtMDUgMTI6NTU6MTJcIlxuICAgIH0sIHtcbiAgICAgIHByZWZpeDogXCLmraPluLhcIixcbiAgICAgIHRpdGxlOiBcIndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CCXCIsXG4gICAgICBkYXRlOiBcIjIwMjEtMDUtMDUgMTI6NTU6MTJcIlxuICAgIH1dO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUG9ydGxldERlZmF1bHRMaXN0V2lkZ2V0Q29udHJvbCA9IHtcbiAgd2lkZ2V0SW5zdGFuY2VJZDogXCJcIixcbiAgd2lkZ2V0UE86IG51bGwsXG4gIHBhZ2VQTzogbnVsbCxcbiAgaG9zdDogbnVsbCxcbiAgJHdpZGdldEJvZHk6IG51bGwsXG4gICR3aWRnZXRDb250YWluZXJJbm5lcldyYXA6IG51bGwsXG4gICR3aWRnZXRDb250YWluZXI6IG51bGwsXG4gIHdpZGdldENvbnRhaW5lcldpZHRoOiBudWxsLFxuICB3aWRnZXRDb250YWluZXJIZWlnaHQ6IG51bGwsXG4gIENyZWF0ZVdpZGdldEVsZW06IGZ1bmN0aW9uIENyZWF0ZVdpZGdldEVsZW0oKSB7XG4gICAgcmV0dXJuIFdpZGdldENvbnRyb2wuQ3JlYXRlV2lkZ2V0RWxlbS5jYWxsKHRoaXMpO1xuICB9LFxuICBSZWZyZXNoOiBmdW5jdGlvbiBSZWZyZXNoKCkge1xuICAgIHRoaXMuJHdpZGdldEJvZHkucmVtb3ZlKCk7XG4gICAgdGhpcy4kd2lkZ2V0Qm9keSA9IHRoaXMuX0J1aWxkQm9keUVsZW0oKTtcbiAgICB0aGlzLiR3aWRnZXRDb250YWluZXJJbm5lcldyYXAuYXBwZW5kKHRoaXMuJHdpZGdldEJvZHkpO1xuICAgIGNvbnNvbGUubG9nKFwiUG9ydGxldERlZmF1bHRMaXN0V2lkZ2V0Q29udHJvbC5SZWZyZXNoXCIpO1xuICB9LFxuICBHZXRDb250ZXh0TWVudUNvbmZpZzogV2lkZ2V0Q29udHJvbC5HZXREZWZhdWx0Q29udGV4dE1lbnVDb25maWcsXG4gIE9uQ29udGV4dE1lbnVJbnN0cnVjdGlvbnNFdmVudDogZnVuY3Rpb24gT25Db250ZXh0TWVudUluc3RydWN0aW9uc0V2ZW50KCkge1xuICAgIGNvbnNvbGUubG9nKFwi5pqC5peg5LuL57uNIVwiKTtcbiAgfSxcbiAgT25Db250ZXh0TWVudU1vcmVFdmVudDogZnVuY3Rpb24gT25Db250ZXh0TWVudU1vcmVFdmVudCgpIHtcbiAgICB2YXIgbW9yZVByb3AgPSB0aGlzLndpZGdldFBPLndpZGdldFByb3BlcnRpZXMubW9yZTtcbiAgICB2YXIgZGlhbG9nQ29uZmlnID0gbW9yZVByb3AuZGlhbG9nQ29uZmlnO1xuXG4gICAgaWYgKG1vcmVQcm9wLm9wZW5UeXBlID09IFwiZnJhbWVJZnJhbWVcIikge1xuICAgICAgdmFyIG9wZW5VcmwgPSBtb3JlUHJvcC5vcGVuVXJsO1xuICAgICAgb3BlblVybCA9IFN0cmluZ1V0aWxpdHkuRm9ybWF0V2l0aERlZmF1bHRWYWx1ZShvcGVuVXJsLCB0cnVlLCBudWxsLCBudWxsKTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQwNSwgb3BlblVybCwgZGlhbG9nQ29uZmlnLCAxLCB0cnVlKTtcbiAgICB9XG4gIH0sXG4gIF9CdWlsZFRpdGxlRWxlbTogV2lkZ2V0Q29udHJvbC5fQnVpbGRUaXRsZUVsZW0sXG4gIF9CdWlsZEJvZHlFbGVtOiBmdW5jdGlvbiBfQnVpbGRCb2R5RWxlbSgpIHtcbiAgICB2YXIgcmVzdFVybCA9IHRoaXMud2lkZ2V0UE8ud2lkZ2V0UHJvcGVydGllcy5saXN0LmdldExpc3REYXRlUmVzdDtcbiAgICB2YXIgcmVzdFBhcmFzID0gdGhpcy53aWRnZXRQTy53aWRnZXRQcm9wZXJ0aWVzLmxpc3QuZ2V0TGlzdERhdGVSZXN0UGFyYXM7XG4gICAgQWpheFV0aWxpdHkuUG9zdChyZXN0VXJsLCByZXN0UGFyYXMsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgICAgICB2YXIgd2lkZ2V0UHJvcGVydGllcyA9IHRoaXMud2lkZ2V0UE8ud2lkZ2V0UHJvcGVydGllcztcbiAgICAgICAgdmFyICRsaXN0SW5uZXJXcmFwID0gdGhpcy4kd2lkZ2V0Qm9keS5maW5kKFwiLndpZGdldC1saXN0LWlubmVyLXdyYXBcIik7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciByb3dEYXRhID0gcmVzdWx0LmRhdGFbaV07XG5cbiAgICAgICAgICB2YXIgJHNpbmdsZVJvd0VsZW0gPSB0aGlzLl9CdWlsZFNpbmdsZVJvdyhyb3dEYXRhKTtcblxuICAgICAgICAgICRsaXN0SW5uZXJXcmFwLmFwcGVuZCgkc2luZ2xlUm93RWxlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgICB2YXIgJHdpZGdldEJvZHkgPSAkKFwiPGRpdiBjbGFzcz0nd2lkZ2V0LWJvZHknPjxkaXYgY2xhc3M9J3dpZGdldC1saXN0LW91dGVyLXdyYXAnPjxkaXYgY2xhc3M9J3dpZGdldC1saXN0LWlubmVyLXdyYXAnPjwvZGl2PjwvZGl2PjwvZGl2PlwiKTtcbiAgICByZXR1cm4gJHdpZGdldEJvZHk7XG4gIH0sXG4gIF9CdWlsZFNpbmdsZVJvdzogZnVuY3Rpb24gX0J1aWxkU2luZ2xlUm93KHJvd0RhdGEpIHtcbiAgICBpZiAodGhpcy53aWRnZXRQTy53aWRnZXRQcm9wZXJ0aWVzLmxpc3QucHJpbnRSb3dEYXRhKSB7XG4gICAgICBjb25zb2xlLmxvZyhyb3dEYXRhKTtcbiAgICB9XG5cbiAgICB2YXIgZmllbGRQYXJzaW5nID0gdGhpcy53aWRnZXRQTy53aWRnZXRQcm9wZXJ0aWVzLmxpc3QuZmllbGRQYXJzaW5nO1xuICAgIHZhciB0aXRsZVdpZHRoID0gdGhpcy53aWRnZXRDb250YWluZXJXaWR0aCAtIDY2O1xuICAgIHZhciB0aW1lU3RyID0gU3RyaW5nVXRpbGl0eS5Gb3JtYXRTcHJpbnRmSnNvbk9iaihmaWVsZFBhcnNpbmcudGltZUZvcm1hdCwgcm93RGF0YSk7XG4gICAgdmFyIHRpbWVPYmogPSBEYXRlVXRpbGl0eS5Db252ZXJ0RnJvbVN0cmluZyh0aW1lU3RyKTtcbiAgICB2YXIgZGF0ZVNob3J0ID0gRGF0ZVV0aWxpdHkuRm9ybWF0KHRpbWVPYmosIFwiTU0tZGRcIik7XG4gICAgdmFyIHRpdGxlU3RyID0gU3RyaW5nVXRpbGl0eS5Gb3JtYXRTcHJpbnRmSnNvbk9iaihmaWVsZFBhcnNpbmcudGl0bGVGb3JtYXQsIHJvd0RhdGEpO1xuICAgIHZhciAkcm93RWxlbSA9ICQoXCI8ZGl2IGNsYXNzPSd3aWRnZXQtbGlzdC1yb3ctd3JhcCc+PGRpdiBjbGFzcz0nd2lkZ2V0LWxpc3QtdGl0bGUnIHN0eWxlPSd3aWR0aDogXCIgKyB0aXRsZVdpZHRoICsgXCJweDttYXJnaW4tcmlnaHQ6IDRweCc+PGkgY2xhc3M9XFxcImxhcyBsYS1jaGV2cm9uLXJpZ2h0XFxcIj48L2k+XCIgKyB0aXRsZVN0ciArIFwiPC9kaXY+PGRpdiBjbGFzcz0nd2lkZ2V0LWxpc3QtZGF0ZScgc3R5bGU9J3dpZHRoOiA0MHB4Oyc+XCIgKyBkYXRlU2hvcnQgKyBcIjwvZGl2PjwvZGl2PlwiKTtcbiAgICAkcm93RWxlbS5iaW5kKFwiY2xpY2tcIiwge1xuICAgICAgcm93RGF0YTogcm93RGF0YSxcbiAgICAgIFwid2lkZ2V0SW5zdGFuY2VcIjogdGhpc1xuICAgIH0sIGZ1bmN0aW9uIChzZW5kZXIpIHtcbiAgICAgIHNlbmRlci5kYXRhLndpZGdldEluc3RhbmNlLl9CdWlsZFNpbmdsZVJvd0NsaWNrRXZlbnQuY2FsbChzZW5kZXIuZGF0YS53aWRnZXRJbnN0YW5jZSwgc2VuZGVyLmRhdGEucm93RGF0YSk7XG4gICAgfSk7XG4gICAgcmV0dXJuICRyb3dFbGVtO1xuICB9LFxuICBfQnVpbGRTaW5nbGVSb3dDbGlja0V2ZW50OiBmdW5jdGlvbiBfQnVpbGRTaW5nbGVSb3dDbGlja0V2ZW50KHJvd0RhdGEpIHtcbiAgICB2YXIgbGlzdFByb3AgPSB0aGlzLndpZGdldFBPLndpZGdldFByb3BlcnRpZXMubGlzdDtcbiAgICB2YXIgZGlhbG9nQ29uZmlnID0gbGlzdFByb3AuZGlhbG9nQ29uZmlnO1xuXG4gICAgaWYgKGxpc3RQcm9wLm9wZW5UeXBlID09IFwiZnJhbWVJZnJhbWVcIikge1xuICAgICAgdmFyIG9wZW5VcmwgPSBsaXN0UHJvcC5vcGVuVXJsO1xuICAgICAgb3BlblVybCA9IFN0cmluZ1V0aWxpdHkuRm9ybWF0V2l0aERlZmF1bHRWYWx1ZShvcGVuVXJsLCB0cnVlLCByb3dEYXRhLCBudWxsKTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQwNiwgb3BlblVybCwgZGlhbG9nQ29uZmlnLCAxLCB0cnVlKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhyb3dEYXRhKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFBvcnRsZXREZWZhdWx0UXVpY2tFbnRyeVdpZGdldENvbnRyb2wgPSB7XG4gIHdpZGdldEluc3RhbmNlSWQ6IFwiXCIsXG4gIHdpZGdldFBPOiBudWxsLFxuICBwYWdlUE86IG51bGwsXG4gIGhvc3Q6IG51bGwsXG4gICR3aWRnZXRCb2R5OiBudWxsLFxuICAkd2lkZ2V0Q29udGFpbmVySW5uZXJXcmFwOiBudWxsLFxuICAkd2lkZ2V0Q29udGFpbmVyOiBudWxsLFxuICB3aWRnZXRDb250YWluZXJXaWR0aDogbnVsbCxcbiAgd2lkZ2V0Q29udGFpbmVySGVpZ2h0OiBudWxsLFxuICBDcmVhdGVXaWRnZXRFbGVtOiBmdW5jdGlvbiBDcmVhdGVXaWRnZXRFbGVtKCkge1xuICAgIHJldHVybiBXaWRnZXRDb250cm9sLkNyZWF0ZVdpZGdldEVsZW0uY2FsbCh0aGlzKTtcbiAgfSxcbiAgUmVmcmVzaDogV2lkZ2V0Q29udHJvbC5Ob3RSZWZyZXNoLFxuICBHZXRDb250ZXh0TWVudUNvbmZpZzogV2lkZ2V0Q29udHJvbC5HZXRFbXB0eUNvbnRleHRNZW51Q29uZmlnLFxuICBfQnVpbGRUaXRsZUVsZW06IFdpZGdldENvbnRyb2wuX0J1aWxkVGl0bGVFbGVtLFxuICBfQnVpbGRCb2R5RWxlbTogZnVuY3Rpb24gX0J1aWxkQm9keUVsZW0oKSB7XG4gICAgdmFyIHdpZGdldFByb3BzID0gdGhpcy53aWRnZXRQTy53aWRnZXRQcm9wZXJ0aWVzO1xuICAgIHZhciAkd2lkZ2V0Qm9keSA9ICQoXCI8ZGl2IGNsYXNzPSd3aWRnZXQtYm9keSc+PGRpdiBjbGFzcz0nd2lkZ2V0LXF1aWNrLWVudHJ5LW91dGVyLXdyYXAnPjxkaXYgY2xhc3M9J3dpZGdldC1xdWljay1lbnRyeS1pbm5lci13cmFwJz48L2Rpdj48L2Rpdj48L2Rpdj5cIik7XG4gICAgdmFyICRxdWlja0VudHJ5SW5uZXJXcmFwID0gJHdpZGdldEJvZHkuZmluZChcIi53aWRnZXQtcXVpY2stZW50cnktaW5uZXItd3JhcFwiKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd2lkZ2V0UHJvcHMuUXVpY2tFbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcXVpY2tFbnRyeSA9IHdpZGdldFByb3BzLlF1aWNrRW50cmllc1tpXTtcblxuICAgICAgdmFyICRxdWlja0VsZW0gPSB0aGlzLl9CdWlsZFNpbmdsZVF1aWNrRW50cnkocXVpY2tFbnRyeSk7XG5cbiAgICAgICRxdWlja0VudHJ5SW5uZXJXcmFwLmFwcGVuZCgkcXVpY2tFbGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJHdpZGdldEJvZHk7XG4gIH0sXG4gIF9CdWlsZFNpbmdsZVF1aWNrRW50cnk6IGZ1bmN0aW9uIF9CdWlsZFNpbmdsZVF1aWNrRW50cnkocXVpY2tFbnRyeSkge1xuICAgIHZhciAkcXVpY2tFbGVtV3JhcCA9ICQoXCI8ZGl2IGNsYXNzPSd3aWRnZXQtcXVpY2stZWxlbS13cmFwJz48ZGl2IHN0eWxlPSdtYXJnaW46IGF1dG87dGV4dC1hbGlnbjogY2VudGVyJz48aW1nIHNyYz0nL1RoZW1lcy9QbmczMlgzMi9cIiArIHF1aWNrRW50cnkuaW1hZ2UgKyBcIicgLz48L2Rpdj48ZGl2PlwiICsgcXVpY2tFbnRyeS5jYXB0aW9uICsgXCI8L2Rpdj48L2Rpdj5cIik7XG4gICAgJHF1aWNrRWxlbVdyYXAuYmluZChcImNsaWNrXCIsIHtcbiAgICAgIHF1aWNrRW50cnk6IHF1aWNrRW50cnksXG4gICAgICBcIndpZGdldEluc3RhbmNlXCI6IHRoaXNcbiAgICB9LCBmdW5jdGlvbiAoc2VuZGVyKSB7XG4gICAgICBzZW5kZXIuZGF0YS53aWRnZXRJbnN0YW5jZS5fQmluZFNpbmdsZVF1aWNrRW50cnlDbGlja0V2ZW50LmNhbGwoc2VuZGVyLmRhdGEud2lkZ2V0SW5zdGFuY2UsIHNlbmRlci5kYXRhLnF1aWNrRW50cnkpO1xuICAgIH0pO1xuICAgIHJldHVybiAkcXVpY2tFbGVtV3JhcDtcbiAgfSxcbiAgX0JpbmRTaW5nbGVRdWlja0VudHJ5Q2xpY2tFdmVudDogZnVuY3Rpb24gX0JpbmRTaW5nbGVRdWlja0VudHJ5Q2xpY2tFdmVudChxdWlja0VudHJ5KSB7XG4gICAgY29uc29sZS5sb2cocXVpY2tFbnRyeSk7XG5cbiAgICBpZiAocXVpY2tFbnRyeS5vcGVuVHlwZSA9PSBcImlubmVySWZyYW1lXCIpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHF1aWNrRW50cnkudXJsLCB7fSwgMSk7XG4gICAgfVxuICB9XG59OyJdfQ==
