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
      console.log(result);

      if (result.success) {
        this.pagePO = result.data;
        this.widgetList = result.exKVData.Widgets;
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
  renderPage: function renderPage() {
    var _self = this;

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
        type: "innerIframe",
        url: "/QCSystem/JB4DCBuilderClient/HTML/WorkFlow/Runtime/MyBootableMyModels.html?menuId=QCSystem-WorkFlow-Client-Bootable",
        image: "0265.png"
      }, {
        name: "发文发起",
        caption: "发文发起",
        type: "menu",
        image: "0223.png"
      }, {
        name: "收文发起",
        caption: "收文发起",
        type: "menu",
        image: "0255.png"
      }, {
        name: "文件传递",
        caption: "文件传递",
        type: "menu",
        image: "0247.png"
      }]
    };
  },
  getDemoToDoListData: function getDemoToDoListData() {
    return [{
      prefix: "正常",
      title: "winsw的使用比较简单。",
      date: "2021-05-05 12:55:12"
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
    var widgetProps = WidgetDemoData.getQuickEntryDemoProps();
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
      "host": this
    }, function (sender) {
      sender.data.host._bindSingleQuickEntryClickEvent.call(sender.data.host, sender.data.quickEntry);
    });
    return $quickElemWrap;
  },
  _bindSingleQuickEntryClickEvent: function _bindSingleQuickEntryClickEvent(quickEntry) {
    console.log(quickEntry);

    if (quickEntry.type == "innerIframe") {
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
    console.log(this.widgetContainerWidth);
    console.log(this.widgetContainerHeight);
    var listData = WidgetDemoData.getDemoToDoListData();
    var $widgetBody = $("<div class='widget-body'><div class='widget-list-outer-wrap'><div class='widget-list-inner-wrap'></div></div></div>");
    var $listInnerWrap = $widgetBody.find(".widget-list-inner-wrap");

    for (var i = 0; i < listData.length; i++) {
      var rowData = listData[i];

      var $singleRowElem = this._buildSingleRow(rowData);

      $listInnerWrap.append($singleRowElem);
    }

    return $widgetBody;
  },
  _buildSingleRow: function _buildSingleRow(rowData) {
    var titleWidth = this.widgetContainerWidth - 80;
    return "<div class='widget-list-row-wrap'><div class='widget-list-title' style='width: " + titleWidth + "px'><i class=\"las la-chevron-right\"></i>" + rowData.title + "</div><div class='widget-list-date' style='width: 40px;'>11-16</div></div>";
  }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBvcnRsZXRQYWdlUnVudGltZS5qcyIsIlBvcnRsZXRVdGlsaXR5LmpzIiwiV2lkZ2V0Q29udHJvbC5qcyIsIldpZGdldERlbW9EYXRhLmpzIiwiV2lkZ2V0cy9Qb3J0bGV0RGVmYXVsdFF1aWNrRW50cnlXaWRnZXRDb250cm9sLmpzIiwiV2lkZ2V0cy9Qb3J0bGV0RGVmYXVsdFRvRG9MaXN0V2lkZ2V0Q29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJQb3J0bGV0UnVudGltZUZ1bGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIFBvcnRsZXRQYWdlUnVudGltZSA9IHtcbiAgcGFnZVBPOiBudWxsLFxuICB3aWRnZXRMaXN0OiBudWxsLFxuICB3aWRnZXRJbnN0YW5jZUNhY2hlQXJyYXk6IFtdLFxuICBkYXNoYm9hcmRWaWV3OiBudWxsLFxuICBwYW5lbE1lbnU6IG51bGwsXG4gIGNvdW50ZXI6IDEsXG4gIGFjSW50ZXJmYWNlOiB7XG4gICAgZ2V0VGVtcGxhdGVQYWdlV2l0aFNTT01lbnU6IFwiL1Jlc3QvUG9ydGxldC9SdW5UaW1lL0NsaWVudC9UZW1wbGF0ZVBhZ2VSdW50aW1lL0dldFRlbXBsYXRlUGFnZVdpdGhTU09NZW51XCJcbiAgfSxcbiAgZ2V0UGFnZVBPQW5kV2lkZ2V0UE9MaXN0VGhlblJlbmRlcjogZnVuY3Rpb24gZ2V0UGFnZVBPQW5kV2lkZ2V0UE9MaXN0VGhlblJlbmRlcigpIHtcbiAgICBBamF4VXRpbGl0eS5HZXQodGhpcy5hY0ludGVyZmFjZS5nZXRUZW1wbGF0ZVBhZ2VXaXRoU1NPTWVudSwge1xuICAgICAgbWVudUlkOiBCYXNlVXRpbGl0eS5HZXRVcmxQYXJhVmFsdWUoXCJtZW51SWRcIilcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuXG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgdGhpcy5wYWdlUE8gPSByZXN1bHQuZGF0YTtcbiAgICAgICAgdGhpcy53aWRnZXRMaXN0ID0gcmVzdWx0LmV4S1ZEYXRhLldpZGdldHM7XG4gICAgICAgIHRoaXMucGFnZVBPLnBhZ2VDb25maWcgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24odGhpcy5wYWdlUE8ucGFnZUNvbmZpZyk7XG4gICAgICAgIHRoaXMucGFnZVBPLnBhZ2VQcm9wZXJ0aWVzID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKHRoaXMucGFnZVBPLnBhZ2VQcm9wZXJ0aWVzKTtcblxuICAgICAgICBpZiAodGhpcy5wYWdlUE8ucGFnZVdpZGdldENvbmZpZykge1xuICAgICAgICAgIHRoaXMucGFnZVBPLnBhZ2VXaWRnZXRDb25maWcgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24odGhpcy5wYWdlUE8ucGFnZVdpZGdldENvbmZpZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5wYWdlUE8ucGFnZVdpZGdldENvbmZpZyA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZW5kZXJQYWdlKCk7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIHJlbmRlclBhZ2U6IGZ1bmN0aW9uIHJlbmRlclBhZ2UoKSB7XG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHZhciBkYXNoYm9hcmRWaWV3ID0gdGhpcy5idWlsZERhc2hib2FyZFZpZXcoKTtcbiAgICB3ZWJpeC51aSh7XG4gICAgICB0eXBlOiBcInNwYWNlXCIsXG4gICAgICBjb2xzOiBbe1xuICAgICAgICB2aWV3OiBcInNjcm9sbHZpZXdcIixcbiAgICAgICAgYm9keTogZGFzaGJvYXJkVmlld1xuICAgICAgfV1cbiAgICB9KTtcbiAgICB3ZWJpeC5ldmVudChkb2N1bWVudC5ib2R5LCBcImNsaWNrXCIsIGZ1bmN0aW9uIChldikge1xuICAgICAgdmFyIGNzcyA9IGV2LnRhcmdldC5jbGFzc05hbWU7XG5cbiAgICAgIGlmIChjc3MgJiYgY3NzLnRvU3RyaW5nKCkuaW5kZXhPZihcInBhbmVsX2ljb25cIikgIT0gLTEpIHtcbiAgICAgICAgdmFyIGNsYXNzTmFtZUFycmF5ID0gY3NzLnNwbGl0KFwiIFwiKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzTmFtZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNsYXNzTmFtZUFycmF5W2ldLmluZGV4T2YoXCJ3aWRnZXRJbnN0YW5jZUlkX1wiKSA9PSAwKSB7XG4gICAgICAgICAgICB2YXIgd2lkZ2V0SW5zdGFuY2VJZCA9IGNsYXNzTmFtZUFycmF5W2ldLnJlcGxhY2UoXCJ3aWRnZXRJbnN0YW5jZUlkX1wiLCBcIlwiKTtcbiAgICAgICAgICAgIHZhciB3aWRnZXRDb250ZXh0TWVudSA9IFBvcnRsZXRQYWdlUnVudGltZS5nZXRXaWRnZXRJbnN0YW5jZUNhY2hlKHdpZGdldEluc3RhbmNlSWQpLndpZGdldENvbnRleHRNZW51O1xuXG4gICAgICAgICAgICBpZiAod2lkZ2V0Q29udGV4dE1lbnUpIHtcbiAgICAgICAgICAgICAgd2lkZ2V0Q29udGV4dE1lbnUuc2V0Q29udGV4dCh3ZWJpeC4kJChldi50YXJnZXQpKTtcbiAgICAgICAgICAgICAgd2lkZ2V0Q29udGV4dE1lbnUuc2hvdyhldi50YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMucGFnZVBPLnBhZ2VXaWRnZXRDb25maWcpIHtcbiAgICAgICQkKFwiZGFzaGJvYXJkVmlld0xheW91dFwiKS5yZXN0b3JlKHRoaXMucGFnZVBPLnBhZ2VXaWRnZXRDb25maWcpO1xuICAgIH1cblxuICAgIHBvcnRsZXRVdGlsaXR5LmluaXRSZWZyZXNoU3RhdHVzKCk7XG4gICAgcG9ydGxldFV0aWxpdHkuc3RhcnRBdXRvUmVmcmVzaENvbnRyb2wodGhpcy5yZWZyZXNoQUxMV2lkZ2V0LCB0aGlzKTtcbiAgfSxcbiAgcmVmcmVzaEFMTFdpZGdldDogZnVuY3Rpb24gcmVmcmVzaEFMTFdpZGdldChpbm5lclZlcnNpb24pIHtcbiAgICBjb25zb2xlLmxvZyhpbm5lclZlcnNpb24pO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciBhbGxXaWRnZXRJbnN0YW5jZUFycmF5ID0gdGhpcy53aWRnZXRJbnN0YW5jZUNhY2hlQXJyYXk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsV2lkZ2V0SW5zdGFuY2VBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgd2lkZ2V0SW5zdGFuY2UgPSBhbGxXaWRnZXRJbnN0YW5jZUFycmF5W2ldLmluc3RhbmNlO1xuICAgICAgICB3aWRnZXRJbnN0YW5jZS5yZWZyZXNoKGlubmVyVmVyc2lvbik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH0sXG4gIGJ1aWxkRGFzaGJvYXJkVmlldzogZnVuY3Rpb24gYnVpbGREYXNoYm9hcmRWaWV3KCkge1xuICAgIHZhciBwYWdlUE8gPSB0aGlzLnBhZ2VQTztcbiAgICB2YXIgZGFzaGJvYXJkID0ge1xuICAgICAgdmlldzogXCJncmlkbGF5b3V0XCIsXG4gICAgICBpZDogXCJkYXNoYm9hcmRWaWV3TGF5b3V0XCIsXG4gICAgICBncmlkQ29sdW1uczogcGFnZVBPLnBhZ2VDb25maWcuZ3JpZENvbHVtbnMsXG4gICAgICBncmlkUm93czogcGFnZVBPLnBhZ2VDb25maWcuZ3JpZFJvd3MsXG4gICAgICBjZWxsSGVpZ2h0OiBwYWdlUE8ucGFnZUNvbmZpZy5jZWxsSGVpZ2h0LFxuICAgICAgZmFjdG9yeTogZnVuY3Rpb24gZmFjdG9yeShvYmopIHtcbiAgICAgICAgdmFyIHdpZGdldElkID0gb2JqLm5hbWU7XG4gICAgICAgIHZhciB3aWRnZXRJbnN0YW5jZUlkID0gb2JqLmlkO1xuICAgICAgICBvYmoudmlldyA9IFwicGFuZWxcIjtcbiAgICAgICAgb2JqLnJlc2l6ZSA9IGZhbHNlO1xuICAgICAgICBvYmouaWNvbiA9IFwibGFzIGxhLWJhcnMgd2lkZ2V0SW5zdGFuY2VJZF9cIiArIHdpZGdldEluc3RhbmNlSWQ7XG4gICAgICAgIG9iai5ib2R5ID0ge1xuICAgICAgICAgIHZpZXc6IFwidGVtcGxhdGVcIixcbiAgICAgICAgICBjc3M6IFwid2ViaXhfdGVtcGxhdGVfZm9yX3dpZGdldFwiLFxuICAgICAgICAgIHRlbXBsYXRlOiBmdW5jdGlvbiB0ZW1wbGF0ZShkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gXCI8ZGl2IG5hbWU9J3dpZGdldENvbnRhaW5lcicgY2xhc3M9J3dpZGdldC1jb250YWluZXItb3V0ZXItd3JhcCc+PC9kaXY+XCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBwYWdlUE86IHBhZ2VQTyxcbiAgICAgICAgICAgIHdpZGdldElkOiB3aWRnZXRJZCxcbiAgICAgICAgICAgIHdpZGdldEluc3RhbmNlSWQ6IHdpZGdldEluc3RhbmNlSWRcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICBvblZpZXdTaG93OiBmdW5jdGlvbiBvblZpZXdTaG93KCkge30sXG4gICAgICAgICAgICBvbkFmdGVyTG9hZDogZnVuY3Rpb24gb25BZnRlckxvYWQoKSB7fSxcbiAgICAgICAgICAgIG9uQmx1cjogZnVuY3Rpb24gb25CbHVyKHByZXZfdmlldykge30sXG4gICAgICAgICAgICBvbkJlZm9yZVJlbmRlcjogZnVuY3Rpb24gb25CZWZvcmVSZW5kZXIoZGF0YSkge30sXG4gICAgICAgICAgICBvbkFmdGVyUmVuZGVyOiBmdW5jdGlvbiBvbkFmdGVyUmVuZGVyKGRhdGEpIHtcbiAgICAgICAgICAgICAgdmFyIHBhZ2VQTyA9IHRoaXMuZGF0YS5wYWdlUE87XG4gICAgICAgICAgICAgIHZhciB3aWRnZXRJZCA9IHRoaXMuZGF0YS53aWRnZXRJZDtcbiAgICAgICAgICAgICAgdmFyIHdpZGdldEluc3RhbmNlSWQgPSB0aGlzLmRhdGEud2lkZ2V0SW5zdGFuY2VJZDtcbiAgICAgICAgICAgICAgdmFyIHdpZGdldFBPID0gQXJyYXlVdGlsaXR5LldoZXJlU2luZ2xlKFBvcnRsZXRQYWdlUnVudGltZS53aWRnZXRMaXN0LCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLndpZGdldElkID09IHdpZGdldElkO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdmFyICR3aWRnZXRDb250YWluZXIgPSAkKHRoaXMuJHZpZXcpLmZpbmQoXCJbbmFtZT0nd2lkZ2V0Q29udGFpbmVyJ11cIik7XG4gICAgICAgICAgICAgIHZhciB3aWRnZXRDb250YWluZXJXaWR0aCA9ICR3aWRnZXRDb250YWluZXIud2lkdGgoKTtcbiAgICAgICAgICAgICAgdmFyIHdpZGdldENvbnRhaW5lckhlaWdodCA9ICR3aWRnZXRDb250YWluZXIuaGVpZ2h0KCk7XG5cbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgd2lkZ2V0SW5zdGFuY2UgPSBQb3J0bGV0UGFnZVJ1bnRpbWUubmV3V2lkZ2V0SW5zdGFuY2Uod2lkZ2V0SW5zdGFuY2VJZCwgd2lkZ2V0UE8sIHBhZ2VQTywgJHdpZGdldENvbnRhaW5lciwgd2lkZ2V0Q29udGFpbmVyV2lkdGgsIHdpZGdldENvbnRhaW5lckhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICBpZiAod2lkZ2V0SW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICAgIFBvcnRsZXRQYWdlUnVudGltZS5jb3VudGVyKys7XG4gICAgICAgICAgICAgICAgICAkd2lkZ2V0Q29udGFpbmVyLmFwcGVuZCh3aWRnZXRJbnN0YW5jZS5jcmVhdGVXaWRnZXRFbGVtKCkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAkd2lkZ2V0Q29udGFpbmVyLmFwcGVuZChcIuWunuS+i+WMlldpZGdldOWksei0pSzor7fmo4Dmn6Xku6PnoIExIVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAkd2lkZ2V0Q29udGFpbmVyLmFwcGVuZChcIuWunuS+i+WMlldpZGdldOWksei0pSzor7fmo4Dmn6Xku6PnoIEhXCIgKyBlLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfSxcbiAgICAgIG9uOiB7fVxuICAgIH07XG4gICAgcmV0dXJuIGRhc2hib2FyZDtcbiAgfSxcbiAgYnVpbGRXaWRnZXRDb250ZXh0TWVudTogZnVuY3Rpb24gYnVpbGRXaWRnZXRDb250ZXh0TWVudSh3aWRnZXRJbnN0YW5jZUlkLCBtZW51Q29uZmlnKSB7XG4gICAgaWYgKG1lbnVDb25maWcubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBtZW51ID0gd2ViaXgudWkoe1xuICAgICAgdmlldzogXCJjb250ZXh0bWVudVwiLFxuICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKGlkKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWVudUNvbmZpZy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChtZW51Q29uZmlnW2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgICB2YXIgd2lkZ2V0SW5zdGFuY2UgPSBQb3J0bGV0UGFnZVJ1bnRpbWUuZ2V0V2lkZ2V0SW5zdGFuY2VDYWNoZSh3aWRnZXRJbnN0YW5jZUlkKS5pbnN0YW5jZTtcbiAgICAgICAgICAgIG1lbnVDb25maWdbaV0uY2xpY2suY2FsbCh3aWRnZXRJbnN0YW5jZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGF0YTogbWVudUNvbmZpZ1xuICAgIH0pO1xuICAgIHJldHVybiBtZW51O1xuICB9LFxuICBuZXdXaWRnZXRJbnN0YW5jZTogZnVuY3Rpb24gbmV3V2lkZ2V0SW5zdGFuY2Uod2lkZ2V0SW5zdGFuY2VJZCwgd2lkZ2V0UE8sIHBhZ2VQTywgJHdpZGdldENvbnRhaW5lciwgd2lkZ2V0Q29udGFpbmVyV2lkdGgsIHdpZGdldENvbnRhaW5lckhlaWdodCkge1xuICAgIHRyeSB7XG4gICAgICB2YXIgd2lkZ2V0SW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKGV2YWwod2lkZ2V0UE8ud2lkZ2V0Q2xpZW50UmVuZGVyKSk7XG4gICAgICB3aWRnZXRJbnN0YW5jZS53aWRnZXRJbnN0YW5jZUlkID0gd2lkZ2V0SW5zdGFuY2VJZDtcbiAgICAgIHdpZGdldEluc3RhbmNlLndpZGdldFBPID0gd2lkZ2V0UE87XG4gICAgICB3aWRnZXRJbnN0YW5jZS5wYWdlUE8gPSBwYWdlUE87XG4gICAgICB3aWRnZXRJbnN0YW5jZS4kd2lkZ2V0Q29udGFpbmVyID0gJHdpZGdldENvbnRhaW5lcjtcbiAgICAgIHdpZGdldEluc3RhbmNlLndpZGdldENvbnRhaW5lcldpZHRoID0gd2lkZ2V0Q29udGFpbmVyV2lkdGg7XG4gICAgICB3aWRnZXRJbnN0YW5jZS53aWRnZXRDb250YWluZXJIZWlnaHQgPSB3aWRnZXRDb250YWluZXJIZWlnaHQ7XG4gICAgICB2YXIgd2lkZ2V0Q29udGV4dE1lbnUgPSBQb3J0bGV0UGFnZVJ1bnRpbWUuYnVpbGRXaWRnZXRDb250ZXh0TWVudSh3aWRnZXRJbnN0YW5jZUlkLCB3aWRnZXRJbnN0YW5jZS5nZXRDb250ZXh0TWVudUNvbmZpZygpKTtcbiAgICAgIHRoaXMud2lkZ2V0SW5zdGFuY2VDYWNoZUFycmF5LnB1c2goe1xuICAgICAgICBcIndpZGdldEluc3RhbmNlSWRcIjogd2lkZ2V0SW5zdGFuY2VJZCxcbiAgICAgICAgXCJpbnN0YW5jZVwiOiB3aWRnZXRJbnN0YW5jZSxcbiAgICAgICAgXCJ3aWRnZXRDb250ZXh0TWVudVwiOiB3aWRnZXRDb250ZXh0TWVudVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gd2lkZ2V0SW5zdGFuY2U7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH0sXG4gIGdldFdpZGdldEluc3RhbmNlQ2FjaGU6IGZ1bmN0aW9uIGdldFdpZGdldEluc3RhbmNlQ2FjaGUod2lkZ2V0SW5zdGFuY2VJZCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy53aWRnZXRJbnN0YW5jZUNhY2hlQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLndpZGdldEluc3RhbmNlQ2FjaGVBcnJheVtpXS53aWRnZXRJbnN0YW5jZUlkID09IHdpZGdldEluc3RhbmNlSWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkZ2V0SW5zdGFuY2VDYWNoZUFycmF5W2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgcG9ydGxldFV0aWxpdHkgPSB7XG4gIHJlZnJlc2hWZXJzaW9uS2V5OiBcInBvcnRsZXRVdGlsaXR5LVJlZnJlc2hWZXJzaW9uXCIsXG4gIGlubmVyVmVyc2lvbjogbnVsbCxcbiAgYXV0b1JlZnJlc2hDb250cm9sRnVuYzogbnVsbCxcbiAgZ2V0UmVmcmVzaFZlcnNpb246IGZ1bmN0aW9uIGdldFJlZnJlc2hWZXJzaW9uKCkge1xuICAgIHZhciByZWZyZXNoVmVyc2lvbiA9IExvY2FsU3RvcmFnZVV0aWxpdHkuZ2V0SXRlbSh0aGlzLnJlZnJlc2hWZXJzaW9uS2V5KTtcblxuICAgIGlmICghcmVmcmVzaFZlcnNpb24pIHtcbiAgICAgIHJlZnJlc2hWZXJzaW9uID0gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVmcmVzaFZlcnNpb247XG4gIH0sXG4gIHVwZGF0ZVJlZnJlc2hWZXJzaW9uOiBmdW5jdGlvbiB1cGRhdGVSZWZyZXNoVmVyc2lvbigpIHtcbiAgICB2YXIgcmVmcmVzaFZlcnNpb24gPSB0aGlzLmdldFJlZnJlc2hWZXJzaW9uKCk7XG4gICAgcmVmcmVzaFZlcnNpb24rKztcbiAgICBMb2NhbFN0b3JhZ2VVdGlsaXR5LnNldEl0ZW0odGhpcy5yZWZyZXNoVmVyc2lvbktleSwgcmVmcmVzaFZlcnNpb24pO1xuICB9LFxuICBpbml0UmVmcmVzaFN0YXR1czogZnVuY3Rpb24gaW5pdFJlZnJlc2hTdGF0dXMoKSB7XG4gICAgTG9jYWxTdG9yYWdlVXRpbGl0eS5zZXRJdGVtKHRoaXMucmVmcmVzaFZlcnNpb25LZXksIDEpO1xuICAgIHRoaXMudXBkYXRlUmVmcmVzaFZlcnNpb24oKTtcbiAgICB0aGlzLmlubmVyVmVyc2lvbiA9IHRoaXMuZ2V0UmVmcmVzaFZlcnNpb24oKTtcbiAgfSxcbiAgbmVlZFRvQmVSZWZyZXNoOiBmdW5jdGlvbiBuZWVkVG9CZVJlZnJlc2goKSB7XG4gICAgdmFyIG5ld1JlZnJlc2hWZXJzaW9uID0gdGhpcy5nZXRSZWZyZXNoVmVyc2lvbigpO1xuXG4gICAgaWYgKG5ld1JlZnJlc2hWZXJzaW9uID4gdGhpcy5pbm5lclZlcnNpb24pIHtcbiAgICAgIHRoaXMuaW5uZXJWZXJzaW9uID0gbmV3UmVmcmVzaFZlcnNpb247XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIHN0YXJ0QXV0b1JlZnJlc2hDb250cm9sOiBmdW5jdGlvbiBzdGFydEF1dG9SZWZyZXNoQ29udHJvbChyZWZyZXNoRnVuYywgY2FsbGVyKSB7XG4gICAgcG9ydGxldFV0aWxpdHkuYXV0b1JlZnJlc2hDb250cm9sRnVuYyA9IHJlZnJlc2hGdW5jO1xuICAgIHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAocG9ydGxldFV0aWxpdHkubmVlZFRvQmVSZWZyZXNoKCkpIHtcbiAgICAgICAgcG9ydGxldFV0aWxpdHkuYXV0b1JlZnJlc2hDb250cm9sRnVuYy5jYWxsKGNhbGxlciwgcG9ydGxldFV0aWxpdHkuaW5uZXJWZXJzaW9uKTtcbiAgICAgIH1cbiAgICB9LCAxMDAwKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdpZGdldENvbnRyb2wgPSB7XG4gIGNyZWF0ZVdpZGdldEVsZW06IGZ1bmN0aW9uIGNyZWF0ZVdpZGdldEVsZW0oKSB7XG4gICAgdGhpcy4kd2lkZ2V0Q29udGFpbmVySW5uZXJXcmFwID0gJChcIjxkaXYgY2xhc3M9J3dpZGdldC1jb250YWluZXItaW5uZXItd3JhcCc+PC9kaXY+XCIpO1xuICAgIHRoaXMuJHdpZGdldENvbnRhaW5lcklubmVyV3JhcC5hcHBlbmQodGhpcy5fYnVpbGRUaXRsZUVsZW0odGhpcy53aWRnZXRQTykpO1xuICAgIHRoaXMuJHdpZGdldEJvZHkgPSB0aGlzLl9idWlsZEJvZHlFbGVtKCk7XG4gICAgdGhpcy4kd2lkZ2V0Q29udGFpbmVySW5uZXJXcmFwLmFwcGVuZCh0aGlzLiR3aWRnZXRCb2R5KTtcbiAgICByZXR1cm4gdGhpcy4kd2lkZ2V0Q29udGFpbmVySW5uZXJXcmFwO1xuICB9LFxuICBub3RSZWZyZXNoOiBmdW5jdGlvbiBub3RSZWZyZXNoKGlubmVyVmVyc2lvbikge30sXG4gIF9idWlsZFRpdGxlRWxlbTogZnVuY3Rpb24gX2J1aWxkVGl0bGVFbGVtKHdpZGdldFBPKSB7XG4gICAgcmV0dXJuICQoXCI8ZGl2IGNsYXNzPSd3aWRnZXQtdGl0bGUnPjxpIGNsYXNzPVxcXCJsYXMgbGEtYW5nbGUtcmlnaHRcXFwiPjwvaT5cIiArIHdpZGdldFBPLndpZGdldFRpdGxlICsgXCI8L2Rpdj5cIik7XG4gIH0sXG4gIGdldEluc3RydWN0aW9uc0NvbnRleHRNZW51Q29uZmlnOiBmdW5jdGlvbiBnZXRJbnN0cnVjdGlvbnNDb250ZXh0TWVudUNvbmZpZygpIHtcbiAgICByZXR1cm4gW3tcbiAgICAgIGlkOiBcIndpZGdldEluc3RydWN0aW9uc1wiLFxuICAgICAgdmFsdWU6IFwi6K+m5oOFXCIsXG4gICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgIHRoaXMuY29udGV4dE1lbnVJbnN0cnVjdGlvbnNFdmVudCgpO1xuICAgICAgfVxuICAgIH1dO1xuICB9LFxuICBnZXREZWZhdWx0Q29udGV4dE1lbnVDb25maWc6IGZ1bmN0aW9uIGdldERlZmF1bHRDb250ZXh0TWVudUNvbmZpZygpIHtcbiAgICByZXR1cm4gW3tcbiAgICAgIGlkOiBcIndpZGdldEluc3RydWN0aW9uc1wiLFxuICAgICAgdmFsdWU6IFwi6K+m5oOFXCIsXG4gICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgIHRoaXMuY29udGV4dE1lbnVJbnN0cnVjdGlvbnNFdmVudCgpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGlkOiBcIndpZGdldE1vcmVcIixcbiAgICAgIHZhbHVlOiBcIuabtOWkmlwiLFxuICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICB0aGlzLmNvbnRleHRNZW51TW9yZUV2ZW50KCk7XG4gICAgICB9XG4gICAgfV07XG4gIH0sXG4gIGdldEVtcHR5Q29udGV4dE1lbnVDb25maWc6IGZ1bmN0aW9uIGdldEVtcHR5Q29udGV4dE1lbnVDb25maWcoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV2lkZ2V0RGVtb0RhdGEgPSB7XG4gIGdldERlbW9Cb2R5OiBmdW5jdGlvbiBnZXREZW1vQm9keSgpIHtcbiAgICByZXR1cm4gXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAglwiO1xuICB9LFxuICBnZXRRdWlja0VudHJ5RGVtb1Byb3BzOiBmdW5jdGlvbiBnZXRRdWlja0VudHJ5RGVtb1Byb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBRdWlja0VudHJpZXM6IFt7XG4gICAgICAgIG5hbWU6IFwi5LqL5Yqh5Y+R6LW3XCIsXG4gICAgICAgIGNhcHRpb246IFwi5LqL5Yqh5Y+R6LW3XCIsXG4gICAgICAgIHR5cGU6IFwiaW5uZXJJZnJhbWVcIixcbiAgICAgICAgdXJsOiBcIi9RQ1N5c3RlbS9KQjREQ0J1aWxkZXJDbGllbnQvSFRNTC9Xb3JrRmxvdy9SdW50aW1lL015Qm9vdGFibGVNeU1vZGVscy5odG1sP21lbnVJZD1RQ1N5c3RlbS1Xb3JrRmxvdy1DbGllbnQtQm9vdGFibGVcIixcbiAgICAgICAgaW1hZ2U6IFwiMDI2NS5wbmdcIlxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiBcIuWPkeaWh+WPkei1t1wiLFxuICAgICAgICBjYXB0aW9uOiBcIuWPkeaWh+WPkei1t1wiLFxuICAgICAgICB0eXBlOiBcIm1lbnVcIixcbiAgICAgICAgaW1hZ2U6IFwiMDIyMy5wbmdcIlxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiBcIuaUtuaWh+WPkei1t1wiLFxuICAgICAgICBjYXB0aW9uOiBcIuaUtuaWh+WPkei1t1wiLFxuICAgICAgICB0eXBlOiBcIm1lbnVcIixcbiAgICAgICAgaW1hZ2U6IFwiMDI1NS5wbmdcIlxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiBcIuaWh+S7tuS8oOmAklwiLFxuICAgICAgICBjYXB0aW9uOiBcIuaWh+S7tuS8oOmAklwiLFxuICAgICAgICB0eXBlOiBcIm1lbnVcIixcbiAgICAgICAgaW1hZ2U6IFwiMDI0Ny5wbmdcIlxuICAgICAgfV1cbiAgICB9O1xuICB9LFxuICBnZXREZW1vVG9Eb0xpc3REYXRhOiBmdW5jdGlvbiBnZXREZW1vVG9Eb0xpc3REYXRhKCkge1xuICAgIHJldHVybiBbe1xuICAgICAgcHJlZml4OiBcIuato+W4uFwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgIJcIixcbiAgICAgIGRhdGU6IFwiMjAyMS0wNS0wNSAxMjo1NToxMlwiXG4gICAgfSwge1xuICAgICAgcHJlZml4OiBcIuWKoOaApVwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybXCIsXG4gICAgICBkYXRlOiBcIjIwMjEtMDUtMDUgMTI6NTU6MTJcIlxuICAgIH0sIHtcbiAgICAgIHByZWZpeDogXCLph43opoFcIixcbiAgICAgIHRpdGxlOiBcIndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CCXCIsXG4gICAgICBkYXRlOiBcIjIwMjEtMDUtMDUgMTI6NTU6MTJcIlxuICAgIH0sIHtcbiAgICAgIHByZWZpeDogXCLph43opoFcIixcbiAgICAgIHRpdGxlOiBcIndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8m1wiLFxuICAgICAgZGF0ZTogXCIyMDIxLTA1LTA1IDEyOjU1OjEyXCJcbiAgICB9LCB7XG4gICAgICBwcmVmaXg6IFwi5q2j5bi4XCIsXG4gICAgICB0aXRsZTogXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAglwiLFxuICAgICAgZGF0ZTogXCIyMDIxLTA1LTA1IDEyOjU1OjEyXCJcbiAgICB9LCB7XG4gICAgICBwcmVmaXg6IFwi5q2j5bi4XCIsXG4gICAgICB0aXRsZTogXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAgnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3XCIsXG4gICAgICBkYXRlOiBcIjIwMjEtMDUtMDUgMTI6NTU6MTJcIlxuICAgIH0sIHtcbiAgICAgIHByZWZpeDogXCLmraPluLhcIixcbiAgICAgIHRpdGxlOiBcIndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CCLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572uXCIsXG4gICAgICBkYXRlOiBcIjIwMjEtMDUtMDUgMTI6NTU6MTJcIlxuICAgIH0sIHtcbiAgICAgIHByZWZpeDogXCLmraPluLhcIixcbiAgICAgIHRpdGxlOiBcIndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CCc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva7mlofku7bjgIJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndcIixcbiAgICAgIGRhdGU6IFwiMjAyMS0wNS0wNSAxMjo1NToxMlwiXG4gICAgfSwge1xuICAgICAgcHJlZml4OiBcIuato+W4uFwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgIIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva5cIixcbiAgICAgIGRhdGU6IFwiMjAyMS0wNS0wNSAxMjo1NToxMlwiXG4gICAgfSwge1xuICAgICAgcHJlZml4OiBcIuato+W4uFwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgIIueG1s6YWN572u5paH5Lu244CCd2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgILku45naXRodWLkuIrkuIvovb3vvJp3aW5zd+S4i+i9ve+8jOimgeS4i+i9veeahOaWh+S7tuacieS4pOS4qu+8mjEud2luc3cuZXhl56iL5bqP77ybMi54bWzphY3nva5cIixcbiAgICAgIGRhdGU6IFwiMjAyMS0wNS0wNSAxMjo1NToxMlwiXG4gICAgfSwge1xuICAgICAgcHJlZml4OiBcIuato+W4uFwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgIJcIixcbiAgICAgIGRhdGU6IFwiMjAyMS0wNS0wNSAxMjo1NToxMlwiXG4gICAgfSwge1xuICAgICAgcHJlZml4OiBcIuato+W4uFwiLFxuICAgICAgdGl0bGU6IFwid2luc3fnmoTkvb/nlKjmr5TovoPnroDljZXjgIJzd+eahOS9v+eUqOavlOi+g+eugOWNleOAguS7jmdpdGh1YuS4iuS4i+i9ve+8mndpbnN35LiL6L2977yM6KaB5LiL6L2955qE5paH5Lu25pyJ5Lik5Liq77yaMS53aW5zdy5leGXnqIvluo/vvJsyLnhtbOmFjee9ruaWh+S7tuOAgndpbnN355qE5L2/55So5q+U6L6D566A5Y2V44CC5LuOZ2l0aHVi5LiK5LiL6L2977yad2luc3fkuIvovb3vvIzopoHkuIvovb3nmoTmlofku7bmnInkuKTkuKrvvJoxLndpbnN3LmV4Zeeoi+W6j++8mzIueG1s6YWN572u5paH5Lu244CCd1wiLFxuICAgICAgZGF0ZTogXCIyMDIxLTA1LTA1IDEyOjU1OjEyXCJcbiAgICB9LCB7XG4gICAgICBwcmVmaXg6IFwi5q2j5bi4XCIsXG4gICAgICB0aXRsZTogXCJ3aW5zd+eahOS9v+eUqOavlOi+g+eugOWNleOAglwiLFxuICAgICAgZGF0ZTogXCIyMDIxLTA1LTA1IDEyOjU1OjEyXCJcbiAgICB9XTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFBvcnRsZXREZWZhdWx0UXVpY2tFbnRyeVdpZGdldENvbnRyb2wgPSB7XG4gIHdpZGdldEluc3RhbmNlSWQ6IFwiXCIsXG4gIHdpZGdldFBPOiBudWxsLFxuICBwYWdlUE86IG51bGwsXG4gIGhvc3Q6IG51bGwsXG4gICR3aWRnZXRCb2R5OiBudWxsLFxuICAkd2lkZ2V0Q29udGFpbmVySW5uZXJXcmFwOiBudWxsLFxuICAkd2lkZ2V0Q29udGFpbmVyOiBudWxsLFxuICB3aWRnZXRDb250YWluZXJXaWR0aDogbnVsbCxcbiAgd2lkZ2V0Q29udGFpbmVySGVpZ2h0OiBudWxsLFxuICBjcmVhdGVXaWRnZXRFbGVtOiBmdW5jdGlvbiBjcmVhdGVXaWRnZXRFbGVtKCkge1xuICAgIHJldHVybiBXaWRnZXRDb250cm9sLmNyZWF0ZVdpZGdldEVsZW0uY2FsbCh0aGlzKTtcbiAgfSxcbiAgcmVmcmVzaDogV2lkZ2V0Q29udHJvbC5ub3RSZWZyZXNoLFxuICBnZXRDb250ZXh0TWVudUNvbmZpZzogV2lkZ2V0Q29udHJvbC5nZXRFbXB0eUNvbnRleHRNZW51Q29uZmlnLFxuICBfYnVpbGRUaXRsZUVsZW06IFdpZGdldENvbnRyb2wuX2J1aWxkVGl0bGVFbGVtLFxuICBfYnVpbGRCb2R5RWxlbTogZnVuY3Rpb24gX2J1aWxkQm9keUVsZW0oKSB7XG4gICAgdmFyIHdpZGdldFByb3BzID0gV2lkZ2V0RGVtb0RhdGEuZ2V0UXVpY2tFbnRyeURlbW9Qcm9wcygpO1xuICAgIHZhciAkd2lkZ2V0Qm9keSA9ICQoXCI8ZGl2IGNsYXNzPSd3aWRnZXQtYm9keSc+PGRpdiBjbGFzcz0nd2lkZ2V0LXF1aWNrLWVudHJ5LW91dGVyLXdyYXAnPjxkaXYgY2xhc3M9J3dpZGdldC1xdWljay1lbnRyeS1pbm5lci13cmFwJz48L2Rpdj48L2Rpdj48L2Rpdj5cIik7XG4gICAgdmFyICRxdWlja0VudHJ5SW5uZXJXcmFwID0gJHdpZGdldEJvZHkuZmluZChcIi53aWRnZXQtcXVpY2stZW50cnktaW5uZXItd3JhcFwiKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd2lkZ2V0UHJvcHMuUXVpY2tFbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcXVpY2tFbnRyeSA9IHdpZGdldFByb3BzLlF1aWNrRW50cmllc1tpXTtcblxuICAgICAgdmFyICRxdWlja0VsZW0gPSB0aGlzLl9idWlsZFNpbmdsZVF1aWNrRW50cnkocXVpY2tFbnRyeSk7XG5cbiAgICAgICRxdWlja0VudHJ5SW5uZXJXcmFwLmFwcGVuZCgkcXVpY2tFbGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJHdpZGdldEJvZHk7XG4gIH0sXG4gIF9idWlsZFNpbmdsZVF1aWNrRW50cnk6IGZ1bmN0aW9uIF9idWlsZFNpbmdsZVF1aWNrRW50cnkocXVpY2tFbnRyeSkge1xuICAgIHZhciAkcXVpY2tFbGVtV3JhcCA9ICQoXCI8ZGl2IGNsYXNzPSd3aWRnZXQtcXVpY2stZWxlbS13cmFwJz48ZGl2IHN0eWxlPSdtYXJnaW46IGF1dG87dGV4dC1hbGlnbjogY2VudGVyJz48aW1nIHNyYz0nL1RoZW1lcy9QbmczMlgzMi9cIiArIHF1aWNrRW50cnkuaW1hZ2UgKyBcIicgLz48L2Rpdj48ZGl2PlwiICsgcXVpY2tFbnRyeS5jYXB0aW9uICsgXCI8L2Rpdj48L2Rpdj5cIik7XG4gICAgJHF1aWNrRWxlbVdyYXAuYmluZChcImNsaWNrXCIsIHtcbiAgICAgIHF1aWNrRW50cnk6IHF1aWNrRW50cnksXG4gICAgICBcImhvc3RcIjogdGhpc1xuICAgIH0sIGZ1bmN0aW9uIChzZW5kZXIpIHtcbiAgICAgIHNlbmRlci5kYXRhLmhvc3QuX2JpbmRTaW5nbGVRdWlja0VudHJ5Q2xpY2tFdmVudC5jYWxsKHNlbmRlci5kYXRhLmhvc3QsIHNlbmRlci5kYXRhLnF1aWNrRW50cnkpO1xuICAgIH0pO1xuICAgIHJldHVybiAkcXVpY2tFbGVtV3JhcDtcbiAgfSxcbiAgX2JpbmRTaW5nbGVRdWlja0VudHJ5Q2xpY2tFdmVudDogZnVuY3Rpb24gX2JpbmRTaW5nbGVRdWlja0VudHJ5Q2xpY2tFdmVudChxdWlja0VudHJ5KSB7XG4gICAgY29uc29sZS5sb2cocXVpY2tFbnRyeSk7XG5cbiAgICBpZiAocXVpY2tFbnRyeS50eXBlID09IFwiaW5uZXJJZnJhbWVcIikge1xuICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgcXVpY2tFbnRyeS51cmwsIHt9LCAxKTtcbiAgICB9XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQb3J0bGV0RGVmYXVsdFRvRG9MaXN0V2lkZ2V0Q29udHJvbCA9IHtcbiAgd2lkZ2V0SW5zdGFuY2VJZDogXCJcIixcbiAgd2lkZ2V0UE86IG51bGwsXG4gIHBhZ2VQTzogbnVsbCxcbiAgaG9zdDogbnVsbCxcbiAgJHdpZGdldEJvZHk6IG51bGwsXG4gICR3aWRnZXRDb250YWluZXJJbm5lcldyYXA6IG51bGwsXG4gICR3aWRnZXRDb250YWluZXI6IG51bGwsXG4gIHdpZGdldENvbnRhaW5lcldpZHRoOiBudWxsLFxuICB3aWRnZXRDb250YWluZXJIZWlnaHQ6IG51bGwsXG4gIGNyZWF0ZVdpZGdldEVsZW06IGZ1bmN0aW9uIGNyZWF0ZVdpZGdldEVsZW0oKSB7XG4gICAgcmV0dXJuIFdpZGdldENvbnRyb2wuY3JlYXRlV2lkZ2V0RWxlbS5jYWxsKHRoaXMpO1xuICB9LFxuICByZWZyZXNoOiBXaWRnZXRDb250cm9sLm5vdFJlZnJlc2gsXG4gIGdldENvbnRleHRNZW51Q29uZmlnOiBXaWRnZXRDb250cm9sLmdldERlZmF1bHRDb250ZXh0TWVudUNvbmZpZyxcbiAgX2J1aWxkVGl0bGVFbGVtOiBXaWRnZXRDb250cm9sLl9idWlsZFRpdGxlRWxlbSxcbiAgX2J1aWxkQm9keUVsZW06IGZ1bmN0aW9uIF9idWlsZEJvZHlFbGVtKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMud2lkZ2V0Q29udGFpbmVyV2lkdGgpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMud2lkZ2V0Q29udGFpbmVySGVpZ2h0KTtcbiAgICB2YXIgbGlzdERhdGEgPSBXaWRnZXREZW1vRGF0YS5nZXREZW1vVG9Eb0xpc3REYXRhKCk7XG4gICAgdmFyICR3aWRnZXRCb2R5ID0gJChcIjxkaXYgY2xhc3M9J3dpZGdldC1ib2R5Jz48ZGl2IGNsYXNzPSd3aWRnZXQtbGlzdC1vdXRlci13cmFwJz48ZGl2IGNsYXNzPSd3aWRnZXQtbGlzdC1pbm5lci13cmFwJz48L2Rpdj48L2Rpdj48L2Rpdj5cIik7XG4gICAgdmFyICRsaXN0SW5uZXJXcmFwID0gJHdpZGdldEJvZHkuZmluZChcIi53aWRnZXQtbGlzdC1pbm5lci13cmFwXCIpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0RGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHJvd0RhdGEgPSBsaXN0RGF0YVtpXTtcblxuICAgICAgdmFyICRzaW5nbGVSb3dFbGVtID0gdGhpcy5fYnVpbGRTaW5nbGVSb3cocm93RGF0YSk7XG5cbiAgICAgICRsaXN0SW5uZXJXcmFwLmFwcGVuZCgkc2luZ2xlUm93RWxlbSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICR3aWRnZXRCb2R5O1xuICB9LFxuICBfYnVpbGRTaW5nbGVSb3c6IGZ1bmN0aW9uIF9idWlsZFNpbmdsZVJvdyhyb3dEYXRhKSB7XG4gICAgdmFyIHRpdGxlV2lkdGggPSB0aGlzLndpZGdldENvbnRhaW5lcldpZHRoIC0gODA7XG4gICAgcmV0dXJuIFwiPGRpdiBjbGFzcz0nd2lkZ2V0LWxpc3Qtcm93LXdyYXAnPjxkaXYgY2xhc3M9J3dpZGdldC1saXN0LXRpdGxlJyBzdHlsZT0nd2lkdGg6IFwiICsgdGl0bGVXaWR0aCArIFwicHgnPjxpIGNsYXNzPVxcXCJsYXMgbGEtY2hldnJvbi1yaWdodFxcXCI+PC9pPlwiICsgcm93RGF0YS50aXRsZSArIFwiPC9kaXY+PGRpdiBjbGFzcz0nd2lkZ2V0LWxpc3QtZGF0ZScgc3R5bGU9J3dpZHRoOiA0MHB4Oyc+MTEtMTY8L2Rpdj48L2Rpdj5cIjtcbiAgfVxufTsiXX0=
