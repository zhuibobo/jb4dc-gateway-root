"use strict";

var PortletPageRuntime = {
  pagePO: null,
  widgetList: null,
  widgetInstanceCache: {},
  dashboardView: null,
  panelMenu: null,
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
    console.log(this.pagePO);
    console.log(this.widgetList);

    var _self = this;

    var dashboardView = this.buildDashboardView();
    this.panelMenu = this.buildWidgetMenu();
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
        _self.panelMenu.setContext(webix.$$(ev.target));

        _self.panelMenu.show(ev.target);
      }
    });

    if (this.pagePO.pageWidgetConfig) {
      $$("dashboardViewLayout").restore(this.pagePO.pageWidgetConfig);
    }
  },
  buildDashboardView: function buildDashboardView() {
    var pagePO = this.pagePO;
    var dashboard = {
      view: "dashboard",
      id: "dashboardViewLayout",
      gridColumns: pagePO.pageConfig.gridColumns,
      gridRows: pagePO.pageConfig.gridRows,
      cellHeight: pagePO.pageConfig.cellHeight,
      factory: function factory(obj) {
        var widgetId = obj.name;
        var widgetInstanceId = obj.id;
        obj.view = "panel";
        obj.resize = false;
        obj.icon = "las la-align-justify";
        obj.body = {
          view: "template",
          template: function template(data) {
            return "<div name='widgetContainer'></div>";
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
              console.log(widgetPO);

              var _this = this;

              var widgetInstance = PortletPageRuntime.newWidgetInstance(widgetInstanceId, widgetPO, pagePO);
              $(this.$view).find("[name='widgetContainer']").append(widgetInstance.renderElem());
            }
          }
        };
        return obj;
      },
      on: {
        onChange: function onChange() {},
        onBeforeDrag: function onBeforeDrag(context, native_event) {
          return false;
        }
      }
    };
    return dashboard;
  },
  buildWidgetMenu: function buildWidgetMenu() {
    var menu = webix.ui({
      view: "contextmenu",
      click: function click(id) {
        if (id === "deleteWidget") {
          var view = this.getContext();
          view.getParentView().removeView(view);
        }
      },
      data: [{
        id: "widgetInstructions",
        value: "详情"
      }, {
        id: "widgetMore",
        value: "更多"
      }]
    });
    return menu;
  },
  newWidgetInstance: function newWidgetInstance(widgetInstanceId, widgetPO, pagePO) {
    var widgetInstance = Object.create(eval(widgetPO.widgetClientRender));
    widgetInstance.widgetInstanceId = widgetInstanceId;
    widgetInstance.widgetPO = widgetPO;
    widgetInstance.pagePO = pagePO;
    this.widgetInstanceCache[widgetInstanceId] = widgetInstance;
    return widgetInstance;
  },
  getWidgetInstance: function getWidgetInstance(widgetInstanceId) {}
};
"use strict";

var WidgetControl = {};
"use strict";

var PortletDefaultQuickEntryWidgetControl = {
  widgetInstanceId: "",
  widgetPO: null,
  pagePO: null,
  host: null,
  renderElem: function renderElem(widgetInstanceId, widgetPO) {
    var widgetContainerInnerWrap = $("<div></div>");
    widgetContainerInnerWrap.append(this.buildTitleElem());
    widgetContainerInnerWrap.append(this.buildBodyElem());
    return widgetContainerInnerWrap;
  },
  refresh: function refresh() {},
  buildTitleElem: function buildTitleElem() {
    return $("<div>1</div>");
  },
  buildBodyElem: function buildBodyElem() {
    return $("<div>2</div>");
  },
  isInstructions: function isInstructions() {
    return true;
  },
  isMore: function isMore() {
    return false;
  }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBvcnRsZXRQYWdlUnVudGltZS5qcyIsIldpZGdldENvbnRyb2wuanMiLCJXaWRnZXRzL1BvcnRsZXREZWZhdWx0UXVpY2tFbnRyeVdpZGdldENvbnRyb2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEpBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJQb3J0bGV0UnVudGltZUZ1bGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIFBvcnRsZXRQYWdlUnVudGltZSA9IHtcbiAgcGFnZVBPOiBudWxsLFxuICB3aWRnZXRMaXN0OiBudWxsLFxuICB3aWRnZXRJbnN0YW5jZUNhY2hlOiB7fSxcbiAgZGFzaGJvYXJkVmlldzogbnVsbCxcbiAgcGFuZWxNZW51OiBudWxsLFxuICBhY0ludGVyZmFjZToge1xuICAgIGdldFRlbXBsYXRlUGFnZVdpdGhTU09NZW51OiBcIi9SZXN0L1BvcnRsZXQvUnVuVGltZS9DbGllbnQvVGVtcGxhdGVQYWdlUnVudGltZS9HZXRUZW1wbGF0ZVBhZ2VXaXRoU1NPTWVudVwiXG4gIH0sXG4gIGdldFBhZ2VQT0FuZFdpZGdldFBPTGlzdFRoZW5SZW5kZXI6IGZ1bmN0aW9uIGdldFBhZ2VQT0FuZFdpZGdldFBPTGlzdFRoZW5SZW5kZXIoKSB7XG4gICAgQWpheFV0aWxpdHkuR2V0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0VGVtcGxhdGVQYWdlV2l0aFNTT01lbnUsIHtcbiAgICAgIG1lbnVJZDogQmFzZVV0aWxpdHkuR2V0VXJsUGFyYVZhbHVlKFwibWVudUlkXCIpXG4gICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcblxuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIHRoaXMucGFnZVBPID0gcmVzdWx0LmRhdGE7XG4gICAgICAgIHRoaXMud2lkZ2V0TGlzdCA9IHJlc3VsdC5leEtWRGF0YS5XaWRnZXRzO1xuICAgICAgICB0aGlzLnBhZ2VQTy5wYWdlQ29uZmlnID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKHRoaXMucGFnZVBPLnBhZ2VDb25maWcpO1xuICAgICAgICB0aGlzLnBhZ2VQTy5wYWdlUHJvcGVydGllcyA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbih0aGlzLnBhZ2VQTy5wYWdlUHJvcGVydGllcyk7XG5cbiAgICAgICAgaWYgKHRoaXMucGFnZVBPLnBhZ2VXaWRnZXRDb25maWcpIHtcbiAgICAgICAgICB0aGlzLnBhZ2VQTy5wYWdlV2lkZ2V0Q29uZmlnID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKHRoaXMucGFnZVBPLnBhZ2VXaWRnZXRDb25maWcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucGFnZVBPLnBhZ2VXaWRnZXRDb25maWcgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVuZGVyUGFnZSgpO1xuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICB9LFxuICByZW5kZXJQYWdlOiBmdW5jdGlvbiByZW5kZXJQYWdlKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMucGFnZVBPKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLndpZGdldExpc3QpO1xuXG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHZhciBkYXNoYm9hcmRWaWV3ID0gdGhpcy5idWlsZERhc2hib2FyZFZpZXcoKTtcbiAgICB0aGlzLnBhbmVsTWVudSA9IHRoaXMuYnVpbGRXaWRnZXRNZW51KCk7XG4gICAgd2ViaXgudWkoe1xuICAgICAgdHlwZTogXCJzcGFjZVwiLFxuICAgICAgY29sczogW3tcbiAgICAgICAgdmlldzogXCJzY3JvbGx2aWV3XCIsXG4gICAgICAgIGJvZHk6IGRhc2hib2FyZFZpZXdcbiAgICAgIH1dXG4gICAgfSk7XG4gICAgd2ViaXguZXZlbnQoZG9jdW1lbnQuYm9keSwgXCJjbGlja1wiLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgIHZhciBjc3MgPSBldi50YXJnZXQuY2xhc3NOYW1lO1xuXG4gICAgICBpZiAoY3NzICYmIGNzcy50b1N0cmluZygpLmluZGV4T2YoXCJwYW5lbF9pY29uXCIpICE9IC0xKSB7XG4gICAgICAgIF9zZWxmLnBhbmVsTWVudS5zZXRDb250ZXh0KHdlYml4LiQkKGV2LnRhcmdldCkpO1xuXG4gICAgICAgIF9zZWxmLnBhbmVsTWVudS5zaG93KGV2LnRhcmdldCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5wYWdlUE8ucGFnZVdpZGdldENvbmZpZykge1xuICAgICAgJCQoXCJkYXNoYm9hcmRWaWV3TGF5b3V0XCIpLnJlc3RvcmUodGhpcy5wYWdlUE8ucGFnZVdpZGdldENvbmZpZyk7XG4gICAgfVxuICB9LFxuICBidWlsZERhc2hib2FyZFZpZXc6IGZ1bmN0aW9uIGJ1aWxkRGFzaGJvYXJkVmlldygpIHtcbiAgICB2YXIgcGFnZVBPID0gdGhpcy5wYWdlUE87XG4gICAgdmFyIGRhc2hib2FyZCA9IHtcbiAgICAgIHZpZXc6IFwiZGFzaGJvYXJkXCIsXG4gICAgICBpZDogXCJkYXNoYm9hcmRWaWV3TGF5b3V0XCIsXG4gICAgICBncmlkQ29sdW1uczogcGFnZVBPLnBhZ2VDb25maWcuZ3JpZENvbHVtbnMsXG4gICAgICBncmlkUm93czogcGFnZVBPLnBhZ2VDb25maWcuZ3JpZFJvd3MsXG4gICAgICBjZWxsSGVpZ2h0OiBwYWdlUE8ucGFnZUNvbmZpZy5jZWxsSGVpZ2h0LFxuICAgICAgZmFjdG9yeTogZnVuY3Rpb24gZmFjdG9yeShvYmopIHtcbiAgICAgICAgdmFyIHdpZGdldElkID0gb2JqLm5hbWU7XG4gICAgICAgIHZhciB3aWRnZXRJbnN0YW5jZUlkID0gb2JqLmlkO1xuICAgICAgICBvYmoudmlldyA9IFwicGFuZWxcIjtcbiAgICAgICAgb2JqLnJlc2l6ZSA9IGZhbHNlO1xuICAgICAgICBvYmouaWNvbiA9IFwibGFzIGxhLWFsaWduLWp1c3RpZnlcIjtcbiAgICAgICAgb2JqLmJvZHkgPSB7XG4gICAgICAgICAgdmlldzogXCJ0ZW1wbGF0ZVwiLFxuICAgICAgICAgIHRlbXBsYXRlOiBmdW5jdGlvbiB0ZW1wbGF0ZShkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gXCI8ZGl2IG5hbWU9J3dpZGdldENvbnRhaW5lcic+PC9kaXY+XCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBwYWdlUE86IHBhZ2VQTyxcbiAgICAgICAgICAgIHdpZGdldElkOiB3aWRnZXRJZCxcbiAgICAgICAgICAgIHdpZGdldEluc3RhbmNlSWQ6IHdpZGdldEluc3RhbmNlSWRcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICBvblZpZXdTaG93OiBmdW5jdGlvbiBvblZpZXdTaG93KCkge30sXG4gICAgICAgICAgICBvbkFmdGVyTG9hZDogZnVuY3Rpb24gb25BZnRlckxvYWQoKSB7fSxcbiAgICAgICAgICAgIG9uQmx1cjogZnVuY3Rpb24gb25CbHVyKHByZXZfdmlldykge30sXG4gICAgICAgICAgICBvbkJlZm9yZVJlbmRlcjogZnVuY3Rpb24gb25CZWZvcmVSZW5kZXIoZGF0YSkge30sXG4gICAgICAgICAgICBvbkFmdGVyUmVuZGVyOiBmdW5jdGlvbiBvbkFmdGVyUmVuZGVyKGRhdGEpIHtcbiAgICAgICAgICAgICAgdmFyIHBhZ2VQTyA9IHRoaXMuZGF0YS5wYWdlUE87XG4gICAgICAgICAgICAgIHZhciB3aWRnZXRJZCA9IHRoaXMuZGF0YS53aWRnZXRJZDtcbiAgICAgICAgICAgICAgdmFyIHdpZGdldEluc3RhbmNlSWQgPSB0aGlzLmRhdGEud2lkZ2V0SW5zdGFuY2VJZDtcbiAgICAgICAgICAgICAgdmFyIHdpZGdldFBPID0gQXJyYXlVdGlsaXR5LldoZXJlU2luZ2xlKFBvcnRsZXRQYWdlUnVudGltZS53aWRnZXRMaXN0LCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLndpZGdldElkID09IHdpZGdldElkO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cod2lkZ2V0UE8pO1xuXG4gICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgdmFyIHdpZGdldEluc3RhbmNlID0gUG9ydGxldFBhZ2VSdW50aW1lLm5ld1dpZGdldEluc3RhbmNlKHdpZGdldEluc3RhbmNlSWQsIHdpZGdldFBPLCBwYWdlUE8pO1xuICAgICAgICAgICAgICAkKHRoaXMuJHZpZXcpLmZpbmQoXCJbbmFtZT0nd2lkZ2V0Q29udGFpbmVyJ11cIikuYXBwZW5kKHdpZGdldEluc3RhbmNlLnJlbmRlckVsZW0oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfSxcbiAgICAgIG9uOiB7XG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiBvbkNoYW5nZSgpIHt9LFxuICAgICAgICBvbkJlZm9yZURyYWc6IGZ1bmN0aW9uIG9uQmVmb3JlRHJhZyhjb250ZXh0LCBuYXRpdmVfZXZlbnQpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBkYXNoYm9hcmQ7XG4gIH0sXG4gIGJ1aWxkV2lkZ2V0TWVudTogZnVuY3Rpb24gYnVpbGRXaWRnZXRNZW51KCkge1xuICAgIHZhciBtZW51ID0gd2ViaXgudWkoe1xuICAgICAgdmlldzogXCJjb250ZXh0bWVudVwiLFxuICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKGlkKSB7XG4gICAgICAgIGlmIChpZCA9PT0gXCJkZWxldGVXaWRnZXRcIikge1xuICAgICAgICAgIHZhciB2aWV3ID0gdGhpcy5nZXRDb250ZXh0KCk7XG4gICAgICAgICAgdmlldy5nZXRQYXJlbnRWaWV3KCkucmVtb3ZlVmlldyh2aWV3KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRhdGE6IFt7XG4gICAgICAgIGlkOiBcIndpZGdldEluc3RydWN0aW9uc1wiLFxuICAgICAgICB2YWx1ZTogXCLor6bmg4VcIlxuICAgICAgfSwge1xuICAgICAgICBpZDogXCJ3aWRnZXRNb3JlXCIsXG4gICAgICAgIHZhbHVlOiBcIuabtOWkmlwiXG4gICAgICB9XVxuICAgIH0pO1xuICAgIHJldHVybiBtZW51O1xuICB9LFxuICBuZXdXaWRnZXRJbnN0YW5jZTogZnVuY3Rpb24gbmV3V2lkZ2V0SW5zdGFuY2Uod2lkZ2V0SW5zdGFuY2VJZCwgd2lkZ2V0UE8sIHBhZ2VQTykge1xuICAgIHZhciB3aWRnZXRJbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoZXZhbCh3aWRnZXRQTy53aWRnZXRDbGllbnRSZW5kZXIpKTtcbiAgICB3aWRnZXRJbnN0YW5jZS53aWRnZXRJbnN0YW5jZUlkID0gd2lkZ2V0SW5zdGFuY2VJZDtcbiAgICB3aWRnZXRJbnN0YW5jZS53aWRnZXRQTyA9IHdpZGdldFBPO1xuICAgIHdpZGdldEluc3RhbmNlLnBhZ2VQTyA9IHBhZ2VQTztcbiAgICB0aGlzLndpZGdldEluc3RhbmNlQ2FjaGVbd2lkZ2V0SW5zdGFuY2VJZF0gPSB3aWRnZXRJbnN0YW5jZTtcbiAgICByZXR1cm4gd2lkZ2V0SW5zdGFuY2U7XG4gIH0sXG4gIGdldFdpZGdldEluc3RhbmNlOiBmdW5jdGlvbiBnZXRXaWRnZXRJbnN0YW5jZSh3aWRnZXRJbnN0YW5jZUlkKSB7fVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdpZGdldENvbnRyb2wgPSB7fTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFBvcnRsZXREZWZhdWx0UXVpY2tFbnRyeVdpZGdldENvbnRyb2wgPSB7XG4gIHdpZGdldEluc3RhbmNlSWQ6IFwiXCIsXG4gIHdpZGdldFBPOiBudWxsLFxuICBwYWdlUE86IG51bGwsXG4gIGhvc3Q6IG51bGwsXG4gIHJlbmRlckVsZW06IGZ1bmN0aW9uIHJlbmRlckVsZW0od2lkZ2V0SW5zdGFuY2VJZCwgd2lkZ2V0UE8pIHtcbiAgICB2YXIgd2lkZ2V0Q29udGFpbmVySW5uZXJXcmFwID0gJChcIjxkaXY+PC9kaXY+XCIpO1xuICAgIHdpZGdldENvbnRhaW5lcklubmVyV3JhcC5hcHBlbmQodGhpcy5idWlsZFRpdGxlRWxlbSgpKTtcbiAgICB3aWRnZXRDb250YWluZXJJbm5lcldyYXAuYXBwZW5kKHRoaXMuYnVpbGRCb2R5RWxlbSgpKTtcbiAgICByZXR1cm4gd2lkZ2V0Q29udGFpbmVySW5uZXJXcmFwO1xuICB9LFxuICByZWZyZXNoOiBmdW5jdGlvbiByZWZyZXNoKCkge30sXG4gIGJ1aWxkVGl0bGVFbGVtOiBmdW5jdGlvbiBidWlsZFRpdGxlRWxlbSgpIHtcbiAgICByZXR1cm4gJChcIjxkaXY+MTwvZGl2PlwiKTtcbiAgfSxcbiAgYnVpbGRCb2R5RWxlbTogZnVuY3Rpb24gYnVpbGRCb2R5RWxlbSgpIHtcbiAgICByZXR1cm4gJChcIjxkaXY+MjwvZGl2PlwiKTtcbiAgfSxcbiAgaXNJbnN0cnVjdGlvbnM6IGZ1bmN0aW9uIGlzSW5zdHJ1Y3Rpb25zKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBpc01vcmU6IGZ1bmN0aW9uIGlzTW9yZSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07Il19
