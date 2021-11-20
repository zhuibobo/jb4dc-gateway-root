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
  getPagePOAndWidgetPOListThenRender: function getPagePOAndWidgetPOListThenRender() {
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

          initFuncStr += ".wait(function(){_this.renderPage();});";
          initFunc = Function(initFuncStr);
        } else {
          initFunc = Function("this.renderPage();");
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
  renderPage: function renderPage() {
    var dashboardView = this.buildDashboardView();
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
            var widgetContextMenu = PortletPageRuntime.getWidgetInstanceCache(widgetInstanceId).widgetContextMenu;

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

    portletUtility.initRefreshStatus();
    portletUtility.startAutoRefreshControl(this.refreshALLWidget, this);
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
  refreshALLWidget: function refreshALLWidget(innerVersion) {
    console.log(innerVersion);

    try {
      var allWidgetInstanceArray = this.widgetInstanceCacheArray;

      for (var i = 0; i < allWidgetInstanceArray.length; i++) {
        var widgetInstance = allWidgetInstanceArray[i].instance;
        widgetInstance.refresh(innerVersion);
      }
    } catch (e) {
      throw e;
    }
  },
  buildDashboardView: function buildDashboardView() {
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
                var widgetInstance = PortletPageRuntime.newWidgetInstance(widgetInstanceId, widgetPO, pagePO, $widgetContainer, widgetContainerWidth, widgetContainerHeight);

                if (widgetInstance) {
                  PortletPageRuntime.counter++;
                  $widgetContainer.append(widgetInstance.createWidgetElem());
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
  buildWidgetContextMenu: function buildWidgetContextMenu(widgetInstanceId, menuConfig) {
    if (menuConfig.length == 0) {
      return null;
    }

    var menu = webix.ui({
      view: "contextmenu",
      click: function click(id) {
        for (var i = 0; i < menuConfig.length; i++) {
          if (menuConfig[i].id == id) {
            var widgetInstance = PortletPageRuntime.getWidgetInstanceCache(widgetInstanceId).instance;
            menuConfig[i].click.call(widgetInstance);
          }
        }
      },
      data: menuConfig
    });
    return menu;
  },
  newWidgetInstance: function newWidgetInstance(widgetInstanceId, widgetPO, pagePO, $widgetContainer, widgetContainerWidth, widgetContainerHeight) {
    try {
      var widgetInstance = Object.create(eval(widgetPO.widgetClientRender));
      widgetInstance.widgetInstanceId = widgetInstanceId;
      widgetInstance.widgetPO = widgetPO;
      widgetInstance.pagePO = pagePO;
      widgetInstance.$widgetContainer = $widgetContainer;
      widgetInstance.widgetContainerWidth = widgetContainerWidth;
      widgetInstance.widgetContainerHeight = widgetContainerHeight;
      var widgetContextMenu = PortletPageRuntime.buildWidgetContextMenu(widgetInstanceId, widgetInstance.getContextMenuConfig());
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
  getWidgetInstanceCache: function getWidgetInstanceCache(widgetInstanceId) {
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
  getRefreshVersion: function getRefreshVersion() {
    var refreshVersion = LocalStorageUtility.getItem(this.refreshVersionKey);

    if (!refreshVersion) {
      refreshVersion = 1;
    }

    return refreshVersion;
  },
  updateRefreshVersion: function updateRefreshVersion() {
    var refreshVersion = this.getRefreshVersion();
    refreshVersion++;
    LocalStorageUtility.setItem(this.refreshVersionKey, refreshVersion);
  },
  initRefreshStatus: function initRefreshStatus() {
    LocalStorageUtility.setItem(this.refreshVersionKey, 1);
    this.updateRefreshVersion();
    this.innerVersion = this.getRefreshVersion();
  },
  needToBeRefresh: function needToBeRefresh() {
    var newRefreshVersion = this.getRefreshVersion();

    if (newRefreshVersion > this.innerVersion) {
      this.innerVersion = newRefreshVersion;
      return true;
    }

    return false;
  },
  startAutoRefreshControl: function startAutoRefreshControl(refreshFunc, caller) {
    portletUtility.autoRefreshControlFunc = refreshFunc;
    window.setInterval(function () {
      if (portletUtility.needToBeRefresh()) {
        portletUtility.autoRefreshControlFunc.call(caller, portletUtility.innerVersion);
      }
    }, 1000);
  }
};
"use strict";

var WidgetControl = {
  createWidgetElem: function createWidgetElem() {
    this.$widgetContainerInnerWrap = $("<div class='widget-container-inner-wrap'></div>");
    this.$widgetContainerInnerWrap.append(this._buildTitleElem(this.widgetPO));
    this.$widgetBody = this._buildBodyElem();
    this.$widgetContainerInnerWrap.append(this.$widgetBody);
    return this.$widgetContainerInnerWrap;
  },
  notRefresh: function notRefresh(innerVersion) {},
  _buildTitleElem: function _buildTitleElem(widgetPO) {
    return $("<div class='widget-title'><i class=\"las la-angle-right\"></i>" + widgetPO.widgetTitle + "</div>");
  },
  getInstructionsContextMenuConfig: function getInstructionsContextMenuConfig() {
    return [{
      id: "widgetInstructions",
      value: "详情",
      click: function click() {
        this.contextMenuInstructionsEvent();
      }
    }];
  },
  getDefaultContextMenuConfig: function getDefaultContextMenuConfig() {
    return [{
      id: "widgetInstructions",
      value: "详情",
      click: function click() {
        this.contextMenuInstructionsEvent();
      }
    }, {
      id: "widgetMore",
      value: "更多",
      click: function click() {
        this.contextMenuMoreEvent();
      }
    }];
  },
  getEmptyContextMenuConfig: function getEmptyContextMenuConfig() {
    return [];
  }
};
"use strict";

var WidgetDemoData = {
  getDemoBody: function getDemoBody() {
    return "winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。winsw的使用比较简单。从github上下载：winsw下载，要下载的文件有两个：1.winsw.exe程序；2.xml配置文件。";
  },
  getQuickEntryDemoProps: function getQuickEntryDemoProps() {
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
  getToDoListWidgetProps: function getToDoListWidgetProps() {
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
        openUrl: "/%(appContextPath)s/JB4DCBuilderClient/HTML/WorkFlow/Runtime/MyEndProcessInstanceMainTask.html?op=edit&extaskId=%(extaskId)s",
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
        openUrl: "/%(appContextPath)s/JB4DCBuilderClient/HTML/WorkFlow/Runtime/MyProcessInstanceMainTaskList.html"
      }
    };
  },
  getDemoToDoListData: function getDemoToDoListData() {
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
  createWidgetElem: function createWidgetElem() {
    return WidgetControl.createWidgetElem.call(this);
  },
  refresh: WidgetControl.notRefresh,
  getContextMenuConfig: WidgetControl.getEmptyContextMenuConfig,
  _buildTitleElem: WidgetControl._buildTitleElem,
  _buildBodyElem: function _buildBodyElem() {
    var widgetProps = this.widgetPO.widgetProperties;
    var $widgetBody = $("<div class='widget-body'><div class='widget-quick-entry-outer-wrap'><div class='widget-quick-entry-inner-wrap'></div></div></div>");
    var $quickEntryInnerWrap = $widgetBody.find(".widget-quick-entry-inner-wrap");

    for (var i = 0; i < widgetProps.QuickEntries.length; i++) {
      var quickEntry = widgetProps.QuickEntries[i];

      var $quickElem = this._buildSingleQuickEntry(quickEntry);

      $quickEntryInnerWrap.append($quickElem);
    }

    return $widgetBody;
  },
  _buildSingleQuickEntry: function _buildSingleQuickEntry(quickEntry) {
    var $quickElemWrap = $("<div class='widget-quick-elem-wrap'><div style='margin: auto;text-align: center'><img src='/Themes/Png32X32/" + quickEntry.image + "' /></div><div>" + quickEntry.caption + "</div></div>");
    $quickElemWrap.bind("click", {
      quickEntry: quickEntry,
      "widgetInstance": this
    }, function (sender) {
      sender.data.widgetInstance._bindSingleQuickEntryClickEvent.call(sender.data.widgetInstance, sender.data.quickEntry);
    });
    return $quickElemWrap;
  },
  _bindSingleQuickEntryClickEvent: function _bindSingleQuickEntryClickEvent(quickEntry) {
    console.log(quickEntry);

    if (quickEntry.openType == "innerIframe") {
      DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, quickEntry.url, {}, 1);
    }
  }
};
"use strict";

var PortletDefaultToDoListWidgetControl = {
  widgetInstanceId: "",
  widgetPO: null,
  pagePO: null,
  host: null,
  $widgetBody: null,
  $widgetContainerInnerWrap: null,
  $widgetContainer: null,
  widgetContainerWidth: null,
  widgetContainerHeight: null,
  createWidgetElem: function createWidgetElem() {
    return WidgetControl.createWidgetElem.call(this);
  },
  refresh: WidgetControl.notRefresh,
  getContextMenuConfig: WidgetControl.getDefaultContextMenuConfig,
  _buildTitleElem: WidgetControl._buildTitleElem,
  _buildBodyElem: function _buildBodyElem() {
    var widgetProps = WidgetDemoData.getToDoListWidgetProps();
    this.widgetPO.widgetProperties = widgetProps;
    var restUrl = this.widgetPO.widgetProperties.list.getListDateRest;
    var restParas = this.widgetPO.widgetProperties.list.getListDateRestParas;
    AjaxUtility.Post(restUrl, restParas, function (result) {
      if (result.success) {
        console.log(result);
        var widgetProperties = this.widgetPO.widgetProperties;
        var $listInnerWrap = this.$widgetBody.find(".widget-list-inner-wrap");

        for (var i = 0; i < result.data.length; i++) {
          var rowData = result.data[i];

          var $singleRowElem = this._buildSingleRow(rowData);

          $listInnerWrap.append($singleRowElem);
        }
      }
    }, this);
    var $widgetBody = $("<div class='widget-body'><div class='widget-list-outer-wrap'><div class='widget-list-inner-wrap'></div></div></div>");
    return $widgetBody;
  },
  _buildSingleRow: function _buildSingleRow(rowData) {
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
      sender.data.widgetInstance._buildSingleRowClickEvent.call(sender.data.widgetInstance, sender.data.rowData);
    });
    return $rowElem;
  },
  _buildSingleRowClickEvent: function _buildSingleRowClickEvent(rowData) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBvcnRsZXRQYWdlUnVudGltZS5qcyIsIlBvcnRsZXRVdGlsaXR5LmpzIiwiV2lkZ2V0Q29udHJvbC5qcyIsIldpZGdldERlbW9EYXRhLmpzIiwiV2lkZ2V0cy9Qb3J0bGV0RGVmYXVsdFF1aWNrRW50cnlXaWRnZXRDb250cm9sLmpzIiwiV2lkZ2V0cy9Qb3J0bGV0RGVmYXVsdFRvRG9MaXN0V2lkZ2V0Q29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IlBvcnRsZXRSdW50aW1lRnVsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUG9ydGxldFBhZ2VSdW50aW1lID0ge1xuICBwYWdlUE86IG51bGwsXG4gIHdpZGdldExpc3Q6IG51bGwsXG4gIHdpZGdldEluc3RhbmNlQ2FjaGVBcnJheTogW10sXG4gIGRhc2hib2FyZFZpZXc6IG51bGwsXG4gIHBhbmVsTWVudTogbnVsbCxcbiAgY291bnRlcjogMSxcbiAgYWNJbnRlcmZhY2U6IHtcbiAgICBnZXRUZW1wbGF0ZVBhZ2VXaXRoU1NPTWVudTogXCIvUmVzdC9Qb3J0bGV0L1J1blRpbWUvQ2xpZW50L1RlbXBsYXRlUGFnZVJ1bnRpbWUvR2V0VGVtcGxhdGVQYWdlV2l0aFNTT01lbnVcIlxuICB9LFxuICBnZXRQYWdlUE9BbmRXaWRnZXRQT0xpc3RUaGVuUmVuZGVyOiBmdW5jdGlvbiBnZXRQYWdlUE9BbmRXaWRnZXRQT0xpc3RUaGVuUmVuZGVyKCkge1xuICAgIEFqYXhVdGlsaXR5LkdldCh0aGlzLmFjSW50ZXJmYWNlLmdldFRlbXBsYXRlUGFnZVdpdGhTU09NZW51LCB7XG4gICAgICBtZW51SWQ6IEJhc2VVdGlsaXR5LkdldFVybFBhcmFWYWx1ZShcIm1lbnVJZFwiKVxuICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICB0aGlzLnBhZ2VQTyA9IHJlc3VsdC5kYXRhO1xuICAgICAgICB0aGlzLndpZGdldExpc3QgPSByZXN1bHQuZXhLVkRhdGEuV2lkZ2V0cztcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMud2lkZ2V0TGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh0aGlzLndpZGdldExpc3RbaV0ud2lkZ2V0UHJvcGVydGllcykge1xuICAgICAgICAgICAgdGhpcy53aWRnZXRMaXN0W2ldLndpZGdldFByb3BlcnRpZXMgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24odGhpcy53aWRnZXRMaXN0W2ldLndpZGdldFByb3BlcnRpZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucGFnZVBPLnBhZ2VDb25maWcgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24odGhpcy5wYWdlUE8ucGFnZUNvbmZpZyk7XG4gICAgICAgIHRoaXMucGFnZVBPLnBhZ2VQcm9wZXJ0aWVzID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKHRoaXMucGFnZVBPLnBhZ2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgdGhpcy5wYWdlUE8ucGFnZVJlZkNzc0NvbmZpZyA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbih0aGlzLnBhZ2VQTy5wYWdlUmVmQ3NzQ29uZmlnKTtcbiAgICAgICAgdGhpcy5wYWdlUE8ucGFnZVJlZkpzQ29uZmlnID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKHRoaXMucGFnZVBPLnBhZ2VSZWZKc0NvbmZpZyk7XG5cbiAgICAgICAgaWYgKHRoaXMucGFnZVBPLnBhZ2VXaWRnZXRDb25maWcpIHtcbiAgICAgICAgICB0aGlzLnBhZ2VQTy5wYWdlV2lkZ2V0Q29uZmlnID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKHRoaXMucGFnZVBPLnBhZ2VXaWRnZXRDb25maWcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucGFnZVBPLnBhZ2VXaWRnZXRDb25maWcgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICB2YXIgaW5pdEZ1bmM7XG5cbiAgICAgICAgaWYgKHRoaXMucGFnZVBPLnBhZ2VSZWZKc0NvbmZpZyAmJiB0aGlzLnBhZ2VQTy5wYWdlUmVmSnNDb25maWcubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHZhciBpbml0RnVuY1N0ciA9IFwibGV0IF90aGlzPXRoaXM7JExBQlwiO1xuXG4gICAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IHRoaXMucGFnZVBPLnBhZ2VSZWZKc0NvbmZpZy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciByZWZKcyA9IHRoaXMucGFnZVBPLnBhZ2VSZWZKc0NvbmZpZ1tfaV0ucmVmSnNQYXRoO1xuICAgICAgICAgICAgcmVmSnMgPSBTdHJpbmdVdGlsaXR5LkZvcm1hdFdpdGhEZWZhdWx0VmFsdWUocmVmSnMsIG51bGwpO1xuICAgICAgICAgICAgcmVmSnMgPSBCYXNlVXRpbGl0eS5BcHBlbmRUaW1lU3RhbXBVcmwocmVmSnMpO1xuICAgICAgICAgICAgaW5pdEZ1bmNTdHIgKz0gXCIuc2NyaXB0KCdcIiArIHJlZkpzICsgXCInKVwiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGluaXRGdW5jU3RyICs9IFwiLndhaXQoZnVuY3Rpb24oKXtfdGhpcy5yZW5kZXJQYWdlKCk7fSk7XCI7XG4gICAgICAgICAgaW5pdEZ1bmMgPSBGdW5jdGlvbihpbml0RnVuY1N0cik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5pdEZ1bmMgPSBGdW5jdGlvbihcInRoaXMucmVuZGVyUGFnZSgpO1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRGdW5jLmNhbGwodGhpcyk7XG5cbiAgICAgICAgaWYgKHRoaXMucGFnZVBPLnBhZ2VSZWZDc3NDb25maWcgJiYgdGhpcy5wYWdlUE8ucGFnZVJlZkNzc0NvbmZpZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9yICh2YXIgX2kyID0gMDsgX2kyIDwgdGhpcy5wYWdlUE8ucGFnZVJlZkNzc0NvbmZpZy5sZW5ndGg7IF9pMisrKSB7XG4gICAgICAgICAgICB2YXIgcmVmQ3NzID0gdGhpcy5wYWdlUE8ucGFnZVJlZkNzc0NvbmZpZ1tfaTJdLnJlZkNTU1BhdGg7XG4gICAgICAgICAgICByZWZDc3MgPSBTdHJpbmdVdGlsaXR5LkZvcm1hdFdpdGhEZWZhdWx0VmFsdWUocmVmQ3NzLCBudWxsKTtcbiAgICAgICAgICAgIExvYWRKc0Nzc1V0aWxpdHkocmVmQ3NzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgcmVuZGVyUGFnZTogZnVuY3Rpb24gcmVuZGVyUGFnZSgpIHtcbiAgICB2YXIgZGFzaGJvYXJkVmlldyA9IHRoaXMuYnVpbGREYXNoYm9hcmRWaWV3KCk7XG4gICAgd2ViaXgudWkoe1xuICAgICAgdHlwZTogXCJzcGFjZVwiLFxuICAgICAgY29sczogW3tcbiAgICAgICAgdmlldzogXCJzY3JvbGx2aWV3XCIsXG4gICAgICAgIGJvZHk6IGRhc2hib2FyZFZpZXdcbiAgICAgIH1dXG4gICAgfSk7XG4gICAgd2ViaXguZXZlbnQoZG9jdW1lbnQuYm9keSwgXCJjbGlja1wiLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgIHZhciBjc3MgPSBldi50YXJnZXQuY2xhc3NOYW1lO1xuXG4gICAgICBpZiAoY3NzICYmIGNzcy50b1N0cmluZygpLmluZGV4T2YoXCJwYW5lbF9pY29uXCIpICE9IC0xKSB7XG4gICAgICAgIHZhciBjbGFzc05hbWVBcnJheSA9IGNzcy5zcGxpdChcIiBcIik7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc05hbWVBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChjbGFzc05hbWVBcnJheVtpXS5pbmRleE9mKFwid2lkZ2V0SW5zdGFuY2VJZF9cIikgPT0gMCkge1xuICAgICAgICAgICAgdmFyIHdpZGdldEluc3RhbmNlSWQgPSBjbGFzc05hbWVBcnJheVtpXS5yZXBsYWNlKFwid2lkZ2V0SW5zdGFuY2VJZF9cIiwgXCJcIik7XG4gICAgICAgICAgICB2YXIgd2lkZ2V0Q29udGV4dE1lbnUgPSBQb3J0bGV0UGFnZVJ1bnRpbWUuZ2V0V2lkZ2V0SW5zdGFuY2VDYWNoZSh3aWRnZXRJbnN0YW5jZUlkKS53aWRnZXRDb250ZXh0TWVudTtcblxuICAgICAgICAgICAgaWYgKHdpZGdldENvbnRleHRNZW51KSB7XG4gICAgICAgICAgICAgIHdpZGdldENvbnRleHRNZW51LnNldENvbnRleHQod2ViaXguJCQoZXYudGFyZ2V0KSk7XG4gICAgICAgICAgICAgIHdpZGdldENvbnRleHRNZW51LnNob3coZXYudGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLnBhZ2VQTy5wYWdlV2lkZ2V0Q29uZmlnKSB7XG4gICAgICAkJChcImRhc2hib2FyZFZpZXdMYXlvdXRcIikucmVzdG9yZSh0aGlzLnBhZ2VQTy5wYWdlV2lkZ2V0Q29uZmlnKTtcbiAgICB9XG5cbiAgICBwb3J0bGV0VXRpbGl0eS5pbml0UmVmcmVzaFN0YXR1cygpO1xuICAgIHBvcnRsZXRVdGlsaXR5LnN0YXJ0QXV0b1JlZnJlc2hDb250cm9sKHRoaXMucmVmcmVzaEFMTFdpZGdldCwgdGhpcyk7XG4gICAgdmFyIHVzZXIgPSB7XG4gICAgICB1MToge1xuICAgICAgICBuYW1lOiBcInp6elwiXG4gICAgICB9LFxuICAgICAgdTI6IHtcbiAgICAgICAgbmFtZTogXCJhYSdhXFxcImFcIlxuICAgICAgfVxuICAgIH07XG4gICAgY29uc29sZS5sb2coc3ByaW50ZignYS5kbz9hPSUodTEubmFtZSlzJmI9JSh1Mi5uYW1lKXMnLCB1c2VyKSk7XG4gIH0sXG4gIHJlZnJlc2hBTExXaWRnZXQ6IGZ1bmN0aW9uIHJlZnJlc2hBTExXaWRnZXQoaW5uZXJWZXJzaW9uKSB7XG4gICAgY29uc29sZS5sb2coaW5uZXJWZXJzaW9uKTtcblxuICAgIHRyeSB7XG4gICAgICB2YXIgYWxsV2lkZ2V0SW5zdGFuY2VBcnJheSA9IHRoaXMud2lkZ2V0SW5zdGFuY2VDYWNoZUFycmF5O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbFdpZGdldEluc3RhbmNlQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHdpZGdldEluc3RhbmNlID0gYWxsV2lkZ2V0SW5zdGFuY2VBcnJheVtpXS5pbnN0YW5jZTtcbiAgICAgICAgd2lkZ2V0SW5zdGFuY2UucmVmcmVzaChpbm5lclZlcnNpb24pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9LFxuICBidWlsZERhc2hib2FyZFZpZXc6IGZ1bmN0aW9uIGJ1aWxkRGFzaGJvYXJkVmlldygpIHtcbiAgICB2YXIgcGFnZVBPID0gdGhpcy5wYWdlUE87XG4gICAgdmFyIGRhc2hib2FyZCA9IHtcbiAgICAgIHZpZXc6IFwiZ3JpZGxheW91dFwiLFxuICAgICAgaWQ6IFwiZGFzaGJvYXJkVmlld0xheW91dFwiLFxuICAgICAgZ3JpZENvbHVtbnM6IHBhZ2VQTy5wYWdlQ29uZmlnLmdyaWRDb2x1bW5zLFxuICAgICAgZ3JpZFJvd3M6IHBhZ2VQTy5wYWdlQ29uZmlnLmdyaWRSb3dzLFxuICAgICAgY2VsbEhlaWdodDogcGFnZVBPLnBhZ2VDb25maWcuY2VsbEhlaWdodCxcbiAgICAgIGZhY3Rvcnk6IGZ1bmN0aW9uIGZhY3Rvcnkob2JqKSB7XG4gICAgICAgIHZhciB3aWRnZXRJZCA9IG9iai5uYW1lO1xuICAgICAgICB2YXIgd2lkZ2V0SW5zdGFuY2VJZCA9IG9iai5pZDtcbiAgICAgICAgb2JqLnZpZXcgPSBcInBhbmVsXCI7XG4gICAgICAgIG9iai5yZXNpemUgPSBmYWxzZTtcbiAgICAgICAgb2JqLmljb24gPSBcImxhcyBsYS1iYXJzIHdpZGdldEluc3RhbmNlSWRfXCIgKyB3aWRnZXRJbnN0YW5jZUlkO1xuICAgICAgICBvYmouYm9keSA9IHtcbiAgICAgICAgICB2aWV3OiBcInRlbXBsYXRlXCIsXG4gICAgICAgICAgY3NzOiBcIndlYml4X3RlbXBsYXRlX2Zvcl93aWRnZXRcIixcbiAgICAgICAgICB0ZW1wbGF0ZTogZnVuY3Rpb24gdGVtcGxhdGUoZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiPGRpdiBuYW1lPSd3aWRnZXRDb250YWluZXInIGNsYXNzPSd3aWRnZXQtY29udGFpbmVyLW91dGVyLXdyYXAnPjwvZGl2PlwiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgcGFnZVBPOiBwYWdlUE8sXG4gICAgICAgICAgICB3aWRnZXRJZDogd2lkZ2V0SWQsXG4gICAgICAgICAgICB3aWRnZXRJbnN0YW5jZUlkOiB3aWRnZXRJbnN0YW5jZUlkXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgb25WaWV3U2hvdzogZnVuY3Rpb24gb25WaWV3U2hvdygpIHt9LFxuICAgICAgICAgICAgb25BZnRlckxvYWQ6IGZ1bmN0aW9uIG9uQWZ0ZXJMb2FkKCkge30sXG4gICAgICAgICAgICBvbkJsdXI6IGZ1bmN0aW9uIG9uQmx1cihwcmV2X3ZpZXcpIHt9LFxuICAgICAgICAgICAgb25CZWZvcmVSZW5kZXI6IGZ1bmN0aW9uIG9uQmVmb3JlUmVuZGVyKGRhdGEpIHt9LFxuICAgICAgICAgICAgb25BZnRlclJlbmRlcjogZnVuY3Rpb24gb25BZnRlclJlbmRlcihkYXRhKSB7XG4gICAgICAgICAgICAgIHZhciBwYWdlUE8gPSB0aGlzLmRhdGEucGFnZVBPO1xuICAgICAgICAgICAgICB2YXIgd2lkZ2V0SWQgPSB0aGlzLmRhdGEud2lkZ2V0SWQ7XG4gICAgICAgICAgICAgIHZhciB3aWRnZXRJbnN0YW5jZUlkID0gdGhpcy5kYXRhLndpZGdldEluc3RhbmNlSWQ7XG4gICAgICAgICAgICAgIHZhciB3aWRnZXRQTyA9IEFycmF5VXRpbGl0eS5XaGVyZVNpbmdsZShQb3J0bGV0UGFnZVJ1bnRpbWUud2lkZ2V0TGlzdCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS53aWRnZXRJZCA9PSB3aWRnZXRJZDtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHZhciAkd2lkZ2V0Q29udGFpbmVyID0gJCh0aGlzLiR2aWV3KS5maW5kKFwiW25hbWU9J3dpZGdldENvbnRhaW5lciddXCIpO1xuICAgICAgICAgICAgICB2YXIgd2lkZ2V0Q29udGFpbmVyV2lkdGggPSAkd2lkZ2V0Q29udGFpbmVyLndpZHRoKCk7XG4gICAgICAgICAgICAgIHZhciB3aWRnZXRDb250YWluZXJIZWlnaHQgPSAkd2lkZ2V0Q29udGFpbmVyLmhlaWdodCgpO1xuXG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIHdpZGdldEluc3RhbmNlID0gUG9ydGxldFBhZ2VSdW50aW1lLm5ld1dpZGdldEluc3RhbmNlKHdpZGdldEluc3RhbmNlSWQsIHdpZGdldFBPLCBwYWdlUE8sICR3aWRnZXRDb250YWluZXIsIHdpZGdldENvbnRhaW5lcldpZHRoLCB3aWRnZXRDb250YWluZXJIZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHdpZGdldEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgICBQb3J0bGV0UGFnZVJ1bnRpbWUuY291bnRlcisrO1xuICAgICAgICAgICAgICAgICAgJHdpZGdldENvbnRhaW5lci5hcHBlbmQod2lkZ2V0SW5zdGFuY2UuY3JlYXRlV2lkZ2V0RWxlbSgpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgJHdpZGdldENvbnRhaW5lci5hcHBlbmQoXCLlrp7kvovljJZXaWRnZXTlpLHotKUs6K+35qOA5p+l5Luj56CBMSFcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgJHdpZGdldENvbnRhaW5lci5hcHBlbmQoXCLlrp7kvovljJZXaWRnZXTlpLHotKUs6K+35qOA5p+l5Luj56CBIVwiICsgZS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH0sXG4gICAgICBvbjoge31cbiAgICB9O1xuICAgIHJldHVybiBkYXNoYm9hcmQ7XG4gIH0sXG4gIGJ1aWxkV2lkZ2V0Q29udGV4dE1lbnU6IGZ1bmN0aW9uIGJ1aWxkV2lkZ2V0Q29udGV4dE1lbnUod2lkZ2V0SW5zdGFuY2VJZCwgbWVudUNvbmZpZykge1xuICAgIGlmIChtZW51Q29uZmlnLmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgbWVudSA9IHdlYml4LnVpKHtcbiAgICAgIHZpZXc6IFwiY29udGV4dG1lbnVcIixcbiAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljayhpZCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1lbnVDb25maWcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAobWVudUNvbmZpZ1tpXS5pZCA9PSBpZCkge1xuICAgICAgICAgICAgdmFyIHdpZGdldEluc3RhbmNlID0gUG9ydGxldFBhZ2VSdW50aW1lLmdldFdpZGdldEluc3RhbmNlQ2FjaGUod2lkZ2V0SW5zdGFuY2VJZCkuaW5zdGFuY2U7XG4gICAgICAgICAgICBtZW51Q29uZmlnW2ldLmNsaWNrLmNhbGwod2lkZ2V0SW5zdGFuY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRhdGE6IG1lbnVDb25maWdcbiAgICB9KTtcbiAgICByZXR1cm4gbWVudTtcbiAgfSxcbiAgbmV3V2lkZ2V0SW5zdGFuY2U6IGZ1bmN0aW9uIG5ld1dpZGdldEluc3RhbmNlKHdpZGdldEluc3RhbmNlSWQsIHdpZGdldFBPLCBwYWdlUE8sICR3aWRnZXRDb250YWluZXIsIHdpZGdldENvbnRhaW5lcldpZHRoLCB3aWRnZXRDb250YWluZXJIZWlnaHQpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHdpZGdldEluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShldmFsKHdpZGdldFBPLndpZGdldENsaWVudFJlbmRlcikpO1xuICAgICAgd2lkZ2V0SW5zdGFuY2Uud2lkZ2V0SW5zdGFuY2VJZCA9IHdpZGdldEluc3RhbmNlSWQ7XG4gICAgICB3aWRnZXRJbnN0YW5jZS53aWRnZXRQTyA9IHdpZGdldFBPO1xuICAgICAgd2lkZ2V0SW5zdGFuY2UucGFnZVBPID0gcGFnZVBPO1xuICAgICAgd2lkZ2V0SW5zdGFuY2UuJHdpZGdldENvbnRhaW5lciA9ICR3aWRnZXRDb250YWluZXI7XG4gICAgICB3aWRnZXRJbnN0YW5jZS53aWRnZXRDb250YWluZXJXaWR0aCA9IHdpZGdldENvbnRhaW5lcldpZHRoO1xuICAgICAgd2lkZ2V0SW5zdGFuY2Uud2lkZ2V0Q29udGFpbmVySGVpZ2h0ID0gd2lkZ2V0Q29udGFpbmVySGVpZ2h0O1xuICAgICAgdmFyIHdpZGdldENvbnRleHRNZW51ID0gUG9ydGxldFBhZ2VSdW50aW1lLmJ1aWxkV2lkZ2V0Q29udGV4dE1lbnUod2lkZ2V0SW5zdGFuY2VJZCwgd2lkZ2V0SW5zdGFuY2UuZ2V0Q29udGV4dE1lbnVDb25maWcoKSk7XG4gICAgICB0aGlzLndpZGdldEluc3RhbmNlQ2FjaGVBcnJheS5wdXNoKHtcbiAgICAgICAgXCJ3aWRnZXRJbnN0YW5jZUlkXCI6IHdpZGdldEluc3RhbmNlSWQsXG4gICAgICAgIFwiaW5zdGFuY2VcIjogd2lkZ2V0SW5zdGFuY2UsXG4gICAgICAgIFwid2lkZ2V0Q29udGV4dE1lbnVcIjogd2lkZ2V0Q29udGV4dE1lbnVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHdpZGdldEluc3RhbmNlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9LFxuICBnZXRXaWRnZXRJbnN0YW5jZUNhY2hlOiBmdW5jdGlvbiBnZXRXaWRnZXRJbnN0YW5jZUNhY2hlKHdpZGdldEluc3RhbmNlSWQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMud2lkZ2V0SW5zdGFuY2VDYWNoZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy53aWRnZXRJbnN0YW5jZUNhY2hlQXJyYXlbaV0ud2lkZ2V0SW5zdGFuY2VJZCA9PSB3aWRnZXRJbnN0YW5jZUlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndpZGdldEluc3RhbmNlQ2FjaGVBcnJheVtpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHBvcnRsZXRVdGlsaXR5ID0ge1xuICByZWZyZXNoVmVyc2lvbktleTogXCJwb3J0bGV0VXRpbGl0eS1SZWZyZXNoVmVyc2lvblwiLFxuICBpbm5lclZlcnNpb246IG51bGwsXG4gIGF1dG9SZWZyZXNoQ29udHJvbEZ1bmM6IG51bGwsXG4gIGdldFJlZnJlc2hWZXJzaW9uOiBmdW5jdGlvbiBnZXRSZWZyZXNoVmVyc2lvbigpIHtcbiAgICB2YXIgcmVmcmVzaFZlcnNpb24gPSBMb2NhbFN0b3JhZ2VVdGlsaXR5LmdldEl0ZW0odGhpcy5yZWZyZXNoVmVyc2lvbktleSk7XG5cbiAgICBpZiAoIXJlZnJlc2hWZXJzaW9uKSB7XG4gICAgICByZWZyZXNoVmVyc2lvbiA9IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlZnJlc2hWZXJzaW9uO1xuICB9LFxuICB1cGRhdGVSZWZyZXNoVmVyc2lvbjogZnVuY3Rpb24gdXBkYXRlUmVmcmVzaFZlcnNpb24oKSB7XG4gICAgdmFyIHJlZnJlc2hWZXJzaW9uID0gdGhpcy5nZXRSZWZyZXNoVmVyc2lvbigpO1xuICAgIHJlZnJlc2hWZXJzaW9uKys7XG4gICAgTG9jYWxTdG9yYWdlVXRpbGl0eS5zZXRJdGVtKHRoaXMucmVmcmVzaFZlcnNpb25LZXksIHJlZnJlc2hWZXJzaW9uKTtcbiAgfSxcbiAgaW5pdFJlZnJlc2hTdGF0dXM6IGZ1bmN0aW9uIGluaXRSZWZyZXNoU3RhdHVzKCkge1xuICAgIExvY2FsU3RvcmFnZVV0aWxpdHkuc2V0SXRlbSh0aGlzLnJlZnJlc2hWZXJzaW9uS2V5LCAxKTtcbiAgICB0aGlzLnVwZGF0ZVJlZnJlc2hWZXJzaW9uKCk7XG4gICAgdGhpcy5pbm5lclZlcnNpb24gPSB0aGlzLmdldFJlZnJlc2hWZXJzaW9uKCk7XG4gIH0sXG4gIG5lZWRUb0JlUmVmcmVzaDogZnVuY3Rpb24gbmVlZFRvQmVSZWZyZXNoKCkge1xuICAgIHZhciBuZXdSZWZyZXNoVmVyc2lvbiA9IHRoaXMuZ2V0UmVmcmVzaFZlcnNpb24oKTtcblxuICAgIGlmIChuZXdSZWZyZXNoVmVyc2lvbiA+IHRoaXMuaW5uZXJWZXJzaW9uKSB7XG4gICAgICB0aGlzLmlubmVyVmVyc2lvbiA9IG5ld1JlZnJlc2hWZXJzaW9uO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBzdGFydEF1dG9SZWZyZXNoQ29udHJvbDogZnVuY3Rpb24gc3RhcnRBdXRvUmVmcmVzaENvbnRyb2wocmVmcmVzaEZ1bmMsIGNhbGxlcikge1xuICAgIHBvcnRsZXRVdGlsaXR5LmF1dG9SZWZyZXNoQ29udHJvbEZ1bmMgPSByZWZyZXNoRnVuYztcbiAgICB3aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHBvcnRsZXRVdGlsaXR5Lm5lZWRUb0JlUmVmcmVzaCgpKSB7XG4gICAgICAgIHBvcnRsZXRVdGlsaXR5LmF1dG9SZWZyZXNoQ29udHJvbEZ1bmMuY2FsbChjYWxsZXIsIHBvcnRsZXRVdGlsaXR5LmlubmVyVmVyc2lvbik7XG4gICAgICB9XG4gICAgfSwgMTAwMCk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXaWRnZXRDb250cm9sID0ge1xuICBjcmVhdGVXaWRnZXRFbGVtOiBmdW5jdGlvbiBjcmVhdGVXaWRnZXRFbGVtKCkge1xuICAgIHRoaXMuJHdpZGdldENvbnRhaW5lcklubmVyV3JhcCA9ICQoXCI8ZGl2IGNsYXNzPSd3aWRnZXQtY29udGFpbmVyLWlubmVyLXdyYXAnPjwvZGl2PlwiKTtcbiAgICB0aGlzLiR3aWRnZXRDb250YWluZXJJbm5lcldyYXAuYXBwZW5kKHRoaXMuX2J1aWxkVGl0bGVFbGVtKHRoaXMud2lkZ2V0UE8pKTtcbiAgICB0aGlzLiR3aWRnZXRCb2R5ID0gdGhpcy5fYnVpbGRCb2R5RWxlbSgpO1xuICAgIHRoaXMuJHdpZGdldENvbnRhaW5lcklubmVyV3JhcC5hcHBlbmQodGhpcy4kd2lkZ2V0Qm9keSk7XG4gICAgcmV0dXJuIHRoaXMuJHdpZGdldENvbnRhaW5lcklubmVyV3JhcDtcbiAgfSxcbiAgbm90UmVmcmVzaDogZnVuY3Rpb24gbm90UmVmcmVzaChpbm5lclZlcnNpb24pIHt9LFxuICBfYnVpbGRUaXRsZUVsZW06IGZ1bmN0aW9uIF9idWlsZFRpdGxlRWxlbSh3aWRnZXRQTykge1xuICAgIHJldHVybiAkKFwiPGRpdiBjbGFzcz0nd2lkZ2V0LXRpdGxlJz48aSBjbGFzcz1cXFwibGFzIGxhLWFuZ2xlLXJpZ2h0XFxcIj48L2k+XCIgKyB3aWRnZXRQTy53aWRnZXRUaXRsZSArIFwiPC9kaXY+XCIpO1xuICB9LFxuICBnZXRJbnN0cnVjdGlvbnNDb250ZXh0TWVudUNvbmZpZzogZnVuY3Rpb24gZ2V0SW5zdHJ1Y3Rpb25zQ29udGV4dE1lbnVDb25maWcoKSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICBpZDogXCJ3aWRnZXRJbnN0cnVjdGlvbnNcIixcbiAgICAgIHZhbHVlOiBcIuivpuaDhVwiLFxuICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICB0aGlzLmNvbnRleHRNZW51SW5zdHJ1Y3Rpb25zRXZlbnQoKTtcbiAgICAgIH1cbiAgICB9XTtcbiAgfSxcbiAgZ2V0RGVmYXVsdENvbnRleHRNZW51Q29uZmlnOiBmdW5jdGlvbiBnZXREZWZhdWx0Q29udGV4dE1lbnVDb25maWcoKSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICBpZDogXCJ3aWRnZXRJbnN0cnVjdGlvbnNcIixcbiAgICAgIHZhbHVlOiBcIuivpuaDhVwiLFxuICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICB0aGlzLmNvbnRleHRNZW51SW5zdHJ1Y3Rpb25zRXZlbnQoKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBpZDogXCJ3aWRnZXRNb3JlXCIsXG4gICAgICB2YWx1ZTogXCLmm7TlpJpcIixcbiAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudU1vcmVFdmVudCgpO1xuICAgICAgfVxuICAgIH1dO1xuICB9LFxuICBnZXRFbXB0eUNvbnRleHRNZW51Q29uZmlnOiBmdW5jdGlvbiBnZXRFbXB0eUNvbnRleHRNZW51Q29uZmlnKCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdpZGdldERlbW9EYXRhID0ge1xuICBnZXREZW1vQm9keTogZnVuY3Rpb24gZ2V0RGVtb0JvZHkoKSB7XG4gICAgcmV0dXJuIFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJcIjtcbiAgfSxcbiAgZ2V0UXVpY2tFbnRyeURlbW9Qcm9wczogZnVuY3Rpb24gZ2V0UXVpY2tFbnRyeURlbW9Qcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgUXVpY2tFbnRyaWVzOiBbe1xuICAgICAgICBuYW1lOiBcIuS6i+WKoeWPkei1t1wiLFxuICAgICAgICBjYXB0aW9uOiBcIuS6i+WKoeWPkei1t1wiLFxuICAgICAgICBvcGVuVHlwZTogXCJpbm5lcklmcmFtZVwiLFxuICAgICAgICB1cmw6IFwiL1FDU3lzdGVtL0pCNERDQnVpbGRlckNsaWVudC9IVE1ML1dvcmtGbG93L1J1bnRpbWUvTXlCb290YWJsZU15TW9kZWxzLmh0bWw/bWVudUlkPVFDU3lzdGVtLVdvcmtGbG93LUNsaWVudC1Cb290YWJsZVwiLFxuICAgICAgICBpbWFnZTogXCIwMjY1LnBuZ1wiXG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6IFwi5Y+R5paH5Y+R6LW3XCIsXG4gICAgICAgIGNhcHRpb246IFwi5Y+R5paH5Y+R6LW3XCIsXG4gICAgICAgIG9wZW5UeXBlOiBcIm1lbnVcIixcbiAgICAgICAgaW1hZ2U6IFwiMDIyMy5wbmdcIlxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiBcIuaUtuaWh+WPkei1t1wiLFxuICAgICAgICBjYXB0aW9uOiBcIuaUtuaWh+WPkei1t1wiLFxuICAgICAgICBvcGVuVHlwZTogXCJtZW51XCIsXG4gICAgICAgIGltYWdlOiBcIjAyNTUucG5nXCJcbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogXCLmlofku7bkvKDpgJJcIixcbiAgICAgICAgY2FwdGlvbjogXCLmlofku7bkvKDpgJJcIixcbiAgICAgICAgb3BlblR5cGU6IFwibWVudVwiLFxuICAgICAgICBpbWFnZTogXCIwMjQ3LnBuZ1wiXG4gICAgICB9XVxuICAgIH07XG4gIH0sXG4gIGdldFRvRG9MaXN0V2lkZ2V0UHJvcHM6IGZ1bmN0aW9uIGdldFRvRG9MaXN0V2lkZ2V0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxpc3Q6IHtcbiAgICAgICAgZ2V0TGlzdERhdGVSZXN0OiBcIi8lKGFwcENvbnRleHRQYXRoKXMvUmVzdC9FeHRlbnNpb24vUG9ydGxldC9Xb3JrZmxvd1RyYW5zZm9ybS9HZXRNeVByb2Nlc3NUYXNrTGlzdFwiLFxuICAgICAgICBnZXRMaXN0RGF0ZVJlc3RQYXJhczoge1xuICAgICAgICAgIG1vZGVsQ2F0ZWdvcnk6IFwiR2VuZXJhbFByb2Nlc3NcIixcbiAgICAgICAgICBwYWdlU2l6ZTogMTJcbiAgICAgICAgfSxcbiAgICAgICAgb3BlblR5cGU6IFwiZnJhbWVJZnJhbWVcIixcbiAgICAgICAgZGlhbG9nQ29uZmlnOiB7XG4gICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgIHRpdGxlOiBcIkpCNERDXCIsXG4gICAgICAgICAgbW9kYWw6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgZmllbGRQYXJzaW5nOiB7XG4gICAgICAgICAgdGltZUZvcm1hdDogXCIlKGluc3RhbmNlRW50aXR5Lmluc3RDcmVhdGVUaW1lKXNcIixcbiAgICAgICAgICB0aXRsZUZvcm1hdDogXCJb5qCH6aKYXSUoaW5zdGFuY2VFbnRpdHkuaW5zdFRpdGxlKXMtJShleHRhc2tDdXJOb2RlTmFtZSlzXCJcbiAgICAgICAgfSxcbiAgICAgICAgb3BlblVybDogXCIvJShhcHBDb250ZXh0UGF0aClzL0pCNERDQnVpbGRlckNsaWVudC9IVE1ML1dvcmtGbG93L1J1bnRpbWUvTXlFbmRQcm9jZXNzSW5zdGFuY2VNYWluVGFzay5odG1sP29wPWVkaXQmZXh0YXNrSWQ9JShleHRhc2tJZClzXCIsXG4gICAgICAgIHByaW50Um93RGF0YTogZmFsc2VcbiAgICAgIH0sXG4gICAgICBtb3JlOiB7XG4gICAgICAgIG9wZW5UeXBlOiBcImZyYW1lSWZyYW1lXCIsXG4gICAgICAgIGRpYWxvZ0NvbmZpZzoge1xuICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICB0aXRsZTogXCJKQjREQ1wiLFxuICAgICAgICAgIG1vZGFsOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIG9wZW5Vcmw6IFwiLyUoYXBwQ29udGV4dFBhdGgpcy9KQjREQ0J1aWxkZXJDbGllbnQvSFRNTC9Xb3JrRmxvdy9SdW50aW1lL015UHJvY2Vzc0luc3RhbmNlTWFpblRhc2tMaXN0Lmh0bWxcIlxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIGdldERlbW9Ub0RvTGlzdERhdGE6IGZ1bmN0aW9uIGdldERlbW9Ub0RvTGlzdERhdGEoKSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICBwcmVmaXg6IFwi5q2j5bi4XCIsXG4gICAgICB0aXRsZTogXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAglwiLFxuICAgICAgZGF0ZTogXCIyMDIxLTA1LTA2IDEyOjU1OjEyXCJcbiAgICB9LCB7XG4gICAgICBwcmVmaXg6IFwi5Yqg5oClXCIsXG4gICAgICB0aXRsZTogXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJtcIixcbiAgICAgIGRhdGU6IFwiMjAyMS0wNS0wNSAxMjo1NToxMlwiXG4gICAgfSwge1xuICAgICAgcHJlZml4OiBcIumHjeimgVwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgIJcIixcbiAgICAgIGRhdGU6IFwiMjAyMS0wNS0wNSAxMjo1NToxMlwiXG4gICAgfSwge1xuICAgICAgcHJlZml4OiBcIumHjeimgVwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybXCIsXG4gICAgICBkYXRlOiBcIjIwMjEtMDUtMDUgMTI6NTU6MTJcIlxuICAgIH0sIHtcbiAgICAgIHByZWZpeDogXCLmraPluLhcIixcbiAgICAgIHRpdGxlOiBcIndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CCXCIsXG4gICAgICBkYXRlOiBcIjIwMjEtMDUtMDUgMTI6NTU6MTJcIlxuICAgIH0sIHtcbiAgICAgIHByZWZpeDogXCLmraPluLhcIixcbiAgICAgIHRpdGxlOiBcIndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CCc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndcIixcbiAgICAgIGRhdGU6IFwiMjAyMS0wNS0wNSAxMjo1NToxMlwiXG4gICAgfSwge1xuICAgICAgcHJlZml4OiBcIuato+W4uFwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgIIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva5cIixcbiAgICAgIGRhdGU6IFwiMjAyMS0wNS0wNSAxMjo1NToxMlwiXG4gICAgfSwge1xuICAgICAgcHJlZml4OiBcIuato+W4uFwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgIJzd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd1wiLFxuICAgICAgZGF0ZTogXCIyMDIxLTA1LTA1IDEyOjU1OjEyXCJcbiAgICB9LCB7XG4gICAgICBwcmVmaXg6IFwi5q2j5bi4XCIsXG4gICAgICB0aXRsZTogXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAgi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9rlwiLFxuICAgICAgZGF0ZTogXCIyMDIxLTA1LTA1IDEyOjU1OjEyXCJcbiAgICB9LCB7XG4gICAgICBwcmVmaXg6IFwi5q2j5bi4XCIsXG4gICAgICB0aXRsZTogXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAgi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9rlwiLFxuICAgICAgZGF0ZTogXCIyMDIxLTA1LTA1IDEyOjU1OjEyXCJcbiAgICB9LCB7XG4gICAgICBwcmVmaXg6IFwi5q2j5bi4XCIsXG4gICAgICB0aXRsZTogXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAglwiLFxuICAgICAgZGF0ZTogXCIyMDIxLTA1LTA1IDEyOjU1OjEyXCJcbiAgICB9LCB7XG4gICAgICBwcmVmaXg6IFwi5q2j5bi4XCIsXG4gICAgICB0aXRsZTogXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAgnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3XCIsXG4gICAgICBkYXRlOiBcIjIwMjEtMDUtMDUgMTI6NTU6MTJcIlxuICAgIH0sIHtcbiAgICAgIHByZWZpeDogXCLmraPluLhcIixcbiAgICAgIHRpdGxlOiBcIndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CCXCIsXG4gICAgICBkYXRlOiBcIjIwMjEtMDUtMDUgMTI6NTU6MTJcIlxuICAgIH1dO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUG9ydGxldERlZmF1bHRRdWlja0VudHJ5V2lkZ2V0Q29udHJvbCA9IHtcbiAgd2lkZ2V0SW5zdGFuY2VJZDogXCJcIixcbiAgd2lkZ2V0UE86IG51bGwsXG4gIHBhZ2VQTzogbnVsbCxcbiAgaG9zdDogbnVsbCxcbiAgJHdpZGdldEJvZHk6IG51bGwsXG4gICR3aWRnZXRDb250YWluZXJJbm5lcldyYXA6IG51bGwsXG4gICR3aWRnZXRDb250YWluZXI6IG51bGwsXG4gIHdpZGdldENvbnRhaW5lcldpZHRoOiBudWxsLFxuICB3aWRnZXRDb250YWluZXJIZWlnaHQ6IG51bGwsXG4gIGNyZWF0ZVdpZGdldEVsZW06IGZ1bmN0aW9uIGNyZWF0ZVdpZGdldEVsZW0oKSB7XG4gICAgcmV0dXJuIFdpZGdldENvbnRyb2wuY3JlYXRlV2lkZ2V0RWxlbS5jYWxsKHRoaXMpO1xuICB9LFxuICByZWZyZXNoOiBXaWRnZXRDb250cm9sLm5vdFJlZnJlc2gsXG4gIGdldENvbnRleHRNZW51Q29uZmlnOiBXaWRnZXRDb250cm9sLmdldEVtcHR5Q29udGV4dE1lbnVDb25maWcsXG4gIF9idWlsZFRpdGxlRWxlbTogV2lkZ2V0Q29udHJvbC5fYnVpbGRUaXRsZUVsZW0sXG4gIF9idWlsZEJvZHlFbGVtOiBmdW5jdGlvbiBfYnVpbGRCb2R5RWxlbSgpIHtcbiAgICB2YXIgd2lkZ2V0UHJvcHMgPSB0aGlzLndpZGdldFBPLndpZGdldFByb3BlcnRpZXM7XG4gICAgdmFyICR3aWRnZXRCb2R5ID0gJChcIjxkaXYgY2xhc3M9J3dpZGdldC1ib2R5Jz48ZGl2IGNsYXNzPSd3aWRnZXQtcXVpY2stZW50cnktb3V0ZXItd3JhcCc+PGRpdiBjbGFzcz0nd2lkZ2V0LXF1aWNrLWVudHJ5LWlubmVyLXdyYXAnPjwvZGl2PjwvZGl2PjwvZGl2PlwiKTtcbiAgICB2YXIgJHF1aWNrRW50cnlJbm5lcldyYXAgPSAkd2lkZ2V0Qm9keS5maW5kKFwiLndpZGdldC1xdWljay1lbnRyeS1pbm5lci13cmFwXCIpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3aWRnZXRQcm9wcy5RdWlja0VudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBxdWlja0VudHJ5ID0gd2lkZ2V0UHJvcHMuUXVpY2tFbnRyaWVzW2ldO1xuXG4gICAgICB2YXIgJHF1aWNrRWxlbSA9IHRoaXMuX2J1aWxkU2luZ2xlUXVpY2tFbnRyeShxdWlja0VudHJ5KTtcblxuICAgICAgJHF1aWNrRW50cnlJbm5lcldyYXAuYXBwZW5kKCRxdWlja0VsZW0pO1xuICAgIH1cblxuICAgIHJldHVybiAkd2lkZ2V0Qm9keTtcbiAgfSxcbiAgX2J1aWxkU2luZ2xlUXVpY2tFbnRyeTogZnVuY3Rpb24gX2J1aWxkU2luZ2xlUXVpY2tFbnRyeShxdWlja0VudHJ5KSB7XG4gICAgdmFyICRxdWlja0VsZW1XcmFwID0gJChcIjxkaXYgY2xhc3M9J3dpZGdldC1xdWljay1lbGVtLXdyYXAnPjxkaXYgc3R5bGU9J21hcmdpbjogYXV0bzt0ZXh0LWFsaWduOiBjZW50ZXInPjxpbWcgc3JjPScvVGhlbWVzL1BuZzMyWDMyL1wiICsgcXVpY2tFbnRyeS5pbWFnZSArIFwiJyAvPjwvZGl2PjxkaXY+XCIgKyBxdWlja0VudHJ5LmNhcHRpb24gKyBcIjwvZGl2PjwvZGl2PlwiKTtcbiAgICAkcXVpY2tFbGVtV3JhcC5iaW5kKFwiY2xpY2tcIiwge1xuICAgICAgcXVpY2tFbnRyeTogcXVpY2tFbnRyeSxcbiAgICAgIFwid2lkZ2V0SW5zdGFuY2VcIjogdGhpc1xuICAgIH0sIGZ1bmN0aW9uIChzZW5kZXIpIHtcbiAgICAgIHNlbmRlci5kYXRhLndpZGdldEluc3RhbmNlLl9iaW5kU2luZ2xlUXVpY2tFbnRyeUNsaWNrRXZlbnQuY2FsbChzZW5kZXIuZGF0YS53aWRnZXRJbnN0YW5jZSwgc2VuZGVyLmRhdGEucXVpY2tFbnRyeSk7XG4gICAgfSk7XG4gICAgcmV0dXJuICRxdWlja0VsZW1XcmFwO1xuICB9LFxuICBfYmluZFNpbmdsZVF1aWNrRW50cnlDbGlja0V2ZW50OiBmdW5jdGlvbiBfYmluZFNpbmdsZVF1aWNrRW50cnlDbGlja0V2ZW50KHF1aWNrRW50cnkpIHtcbiAgICBjb25zb2xlLmxvZyhxdWlja0VudHJ5KTtcblxuICAgIGlmIChxdWlja0VudHJ5Lm9wZW5UeXBlID09IFwiaW5uZXJJZnJhbWVcIikge1xuICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgcXVpY2tFbnRyeS51cmwsIHt9LCAxKTtcbiAgICB9XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQb3J0bGV0RGVmYXVsdFRvRG9MaXN0V2lkZ2V0Q29udHJvbCA9IHtcbiAgd2lkZ2V0SW5zdGFuY2VJZDogXCJcIixcbiAgd2lkZ2V0UE86IG51bGwsXG4gIHBhZ2VQTzogbnVsbCxcbiAgaG9zdDogbnVsbCxcbiAgJHdpZGdldEJvZHk6IG51bGwsXG4gICR3aWRnZXRDb250YWluZXJJbm5lcldyYXA6IG51bGwsXG4gICR3aWRnZXRDb250YWluZXI6IG51bGwsXG4gIHdpZGdldENvbnRhaW5lcldpZHRoOiBudWxsLFxuICB3aWRnZXRDb250YWluZXJIZWlnaHQ6IG51bGwsXG4gIGNyZWF0ZVdpZGdldEVsZW06IGZ1bmN0aW9uIGNyZWF0ZVdpZGdldEVsZW0oKSB7XG4gICAgcmV0dXJuIFdpZGdldENvbnRyb2wuY3JlYXRlV2lkZ2V0RWxlbS5jYWxsKHRoaXMpO1xuICB9LFxuICByZWZyZXNoOiBXaWRnZXRDb250cm9sLm5vdFJlZnJlc2gsXG4gIGdldENvbnRleHRNZW51Q29uZmlnOiBXaWRnZXRDb250cm9sLmdldERlZmF1bHRDb250ZXh0TWVudUNvbmZpZyxcbiAgX2J1aWxkVGl0bGVFbGVtOiBXaWRnZXRDb250cm9sLl9idWlsZFRpdGxlRWxlbSxcbiAgX2J1aWxkQm9keUVsZW06IGZ1bmN0aW9uIF9idWlsZEJvZHlFbGVtKCkge1xuICAgIHZhciB3aWRnZXRQcm9wcyA9IFdpZGdldERlbW9EYXRhLmdldFRvRG9MaXN0V2lkZ2V0UHJvcHMoKTtcbiAgICB0aGlzLndpZGdldFBPLndpZGdldFByb3BlcnRpZXMgPSB3aWRnZXRQcm9wcztcbiAgICB2YXIgcmVzdFVybCA9IHRoaXMud2lkZ2V0UE8ud2lkZ2V0UHJvcGVydGllcy5saXN0LmdldExpc3REYXRlUmVzdDtcbiAgICB2YXIgcmVzdFBhcmFzID0gdGhpcy53aWRnZXRQTy53aWRnZXRQcm9wZXJ0aWVzLmxpc3QuZ2V0TGlzdERhdGVSZXN0UGFyYXM7XG4gICAgQWpheFV0aWxpdHkuUG9zdChyZXN0VXJsLCByZXN0UGFyYXMsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgICAgICB2YXIgd2lkZ2V0UHJvcGVydGllcyA9IHRoaXMud2lkZ2V0UE8ud2lkZ2V0UHJvcGVydGllcztcbiAgICAgICAgdmFyICRsaXN0SW5uZXJXcmFwID0gdGhpcy4kd2lkZ2V0Qm9keS5maW5kKFwiLndpZGdldC1saXN0LWlubmVyLXdyYXBcIik7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciByb3dEYXRhID0gcmVzdWx0LmRhdGFbaV07XG5cbiAgICAgICAgICB2YXIgJHNpbmdsZVJvd0VsZW0gPSB0aGlzLl9idWlsZFNpbmdsZVJvdyhyb3dEYXRhKTtcblxuICAgICAgICAgICRsaXN0SW5uZXJXcmFwLmFwcGVuZCgkc2luZ2xlUm93RWxlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgICB2YXIgJHdpZGdldEJvZHkgPSAkKFwiPGRpdiBjbGFzcz0nd2lkZ2V0LWJvZHknPjxkaXYgY2xhc3M9J3dpZGdldC1saXN0LW91dGVyLXdyYXAnPjxkaXYgY2xhc3M9J3dpZGdldC1saXN0LWlubmVyLXdyYXAnPjwvZGl2PjwvZGl2PjwvZGl2PlwiKTtcbiAgICByZXR1cm4gJHdpZGdldEJvZHk7XG4gIH0sXG4gIF9idWlsZFNpbmdsZVJvdzogZnVuY3Rpb24gX2J1aWxkU2luZ2xlUm93KHJvd0RhdGEpIHtcbiAgICBpZiAodGhpcy53aWRnZXRQTy53aWRnZXRQcm9wZXJ0aWVzLmxpc3QucHJpbnRSb3dEYXRhKSB7XG4gICAgICBjb25zb2xlLmxvZyhyb3dEYXRhKTtcbiAgICB9XG5cbiAgICB2YXIgZmllbGRQYXJzaW5nID0gdGhpcy53aWRnZXRQTy53aWRnZXRQcm9wZXJ0aWVzLmxpc3QuZmllbGRQYXJzaW5nO1xuICAgIHZhciB0aXRsZVdpZHRoID0gdGhpcy53aWRnZXRDb250YWluZXJXaWR0aCAtIDY2O1xuICAgIHZhciB0aW1lU3RyID0gU3RyaW5nVXRpbGl0eS5Gb3JtYXRTcHJpbnRmSnNvbk9iaihmaWVsZFBhcnNpbmcudGltZUZvcm1hdCwgcm93RGF0YSk7XG4gICAgdmFyIHRpbWVPYmogPSBEYXRlVXRpbGl0eS5Db252ZXJ0RnJvbVN0cmluZyh0aW1lU3RyKTtcbiAgICB2YXIgZGF0ZVNob3J0ID0gRGF0ZVV0aWxpdHkuRm9ybWF0KHRpbWVPYmosIFwiTU0tZGRcIik7XG4gICAgdmFyIHRpdGxlU3RyID0gU3RyaW5nVXRpbGl0eS5Gb3JtYXRTcHJpbnRmSnNvbk9iaihmaWVsZFBhcnNpbmcudGl0bGVGb3JtYXQsIHJvd0RhdGEpO1xuICAgIHZhciAkcm93RWxlbSA9ICQoXCI8ZGl2IGNsYXNzPSd3aWRnZXQtbGlzdC1yb3ctd3JhcCc+PGRpdiBjbGFzcz0nd2lkZ2V0LWxpc3QtdGl0bGUnIHN0eWxlPSd3aWR0aDogXCIgKyB0aXRsZVdpZHRoICsgXCJweDttYXJnaW4tcmlnaHQ6IDRweCc+PGkgY2xhc3M9XFxcImxhcyBsYS1jaGV2cm9uLXJpZ2h0XFxcIj48L2k+XCIgKyB0aXRsZVN0ciArIFwiPC9kaXY+PGRpdiBjbGFzcz0nd2lkZ2V0LWxpc3QtZGF0ZScgc3R5bGU9J3dpZHRoOiA0MHB4Oyc+XCIgKyBkYXRlU2hvcnQgKyBcIjwvZGl2PjwvZGl2PlwiKTtcbiAgICAkcm93RWxlbS5iaW5kKFwiY2xpY2tcIiwge1xuICAgICAgcm93RGF0YTogcm93RGF0YSxcbiAgICAgIFwid2lkZ2V0SW5zdGFuY2VcIjogdGhpc1xuICAgIH0sIGZ1bmN0aW9uIChzZW5kZXIpIHtcbiAgICAgIHNlbmRlci5kYXRhLndpZGdldEluc3RhbmNlLl9idWlsZFNpbmdsZVJvd0NsaWNrRXZlbnQuY2FsbChzZW5kZXIuZGF0YS53aWRnZXRJbnN0YW5jZSwgc2VuZGVyLmRhdGEucm93RGF0YSk7XG4gICAgfSk7XG4gICAgcmV0dXJuICRyb3dFbGVtO1xuICB9LFxuICBfYnVpbGRTaW5nbGVSb3dDbGlja0V2ZW50OiBmdW5jdGlvbiBfYnVpbGRTaW5nbGVSb3dDbGlja0V2ZW50KHJvd0RhdGEpIHtcbiAgICB2YXIgbGlzdFByb3AgPSB0aGlzLndpZGdldFBPLndpZGdldFByb3BlcnRpZXMubGlzdDtcbiAgICB2YXIgZGlhbG9nQ29uZmlnID0gbGlzdFByb3AuZGlhbG9nQ29uZmlnO1xuXG4gICAgaWYgKGxpc3RQcm9wLm9wZW5UeXBlID09IFwiZnJhbWVJZnJhbWVcIikge1xuICAgICAgdmFyIG9wZW5VcmwgPSBsaXN0UHJvcC5vcGVuVXJsO1xuICAgICAgb3BlblVybCA9IFN0cmluZ1V0aWxpdHkuRm9ybWF0V2l0aERlZmF1bHRWYWx1ZShvcGVuVXJsLCB0cnVlLCByb3dEYXRhLCBudWxsKTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQwNiwgb3BlblVybCwgZGlhbG9nQ29uZmlnLCAxLCB0cnVlKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhyb3dEYXRhKTtcbiAgfVxufTsiXX0=
