"use strict";

Vue.component("select-department-user-dialog", {
  data: function data() {
    return {
      acInterface: {
        getDepartmentTreeData: "/Rest/SSO/Dept/Department/GetDepartmentsByOrganId",
        reloadListData: "/Rest/SSO/Dept/DepartmentUser/GetListData"
      },
      treeIdFieldName: "deptId",
      treeObj: null,
      treeSelectedNode: null,
      treeSetting: {
        async: {
          enable: true,
          url: ""
        },
        data: {
          key: {
            name: "deptName"
          },
          simpleData: {
            enable: true,
            idKey: "deptId",
            pIdKey: "deptParentId"
          }
        },
        callback: {
          onClick: function onClick(event, treeId, treeNode) {
            var _self = this.getZTreeObj(treeId)._host;

            _self.treeNodeSelected(event, treeId, treeNode);
          },
          onAsyncSuccess: function onAsyncSuccess(event, treeId, treeNode, msg) {
            appList.treeObj.expandAll(true);
          }
        }
      },
      idFieldName: "DU_ID",
      searchCondition: {
        userName: {
          value: "",
          type: SearchUtility.SearchFieldType.LikeStringType
        },
        account: {
          value: "",
          type: SearchUtility.SearchFieldType.LikeStringType
        },
        userPhoneNumber: {
          value: "",
          type: SearchUtility.SearchFieldType.LikeStringType
        },
        departmentId: {
          value: "",
          type: SearchUtility.SearchFieldType.StringType
        },
        searchInALL: {
          value: "否",
          type: SearchUtility.SearchFieldType.StringType
        }
      },
      columnsConfig: [{
        type: 'selection',
        width: 60,
        align: 'center'
      }, {
        title: '用户名',
        key: 'USER_NAME',
        align: "center"
      }, {
        title: '手机号码',
        key: 'USER_PHONE_NUMBER',
        width: 140,
        align: "center"
      }, {
        title: '组织机构',
        key: 'ORGAN_NAME',
        width: 140,
        align: "center"
      }, {
        title: '部门',
        key: 'DEPT_NAME',
        width: 140,
        align: "center"
      }, {
        title: '主属',
        key: 'DU_IS_MAIN',
        width: 70,
        align: "center"
      }],
      tableData: [],
      selectionRows: null,
      pageTotal: 0,
      pageSize: 12,
      pageNum: 1,
      listHeight: 270
    };
  },
  mounted: function mounted() {
    var oldSelectedOrganId = CookieUtility.GetCookie("DMORGSID");

    if (oldSelectedOrganId) {
      this.$refs.selectOrganComp.setOldSelectedOrgan(oldSelectedOrganId);
      this.initTree(oldSelectedOrganId);
    }
  },
  methods: {
    changeOrgan: function changeOrgan(organData) {
      CookieUtility.SetCookie1Month("DMORGSID", organData.organId);
      this.initTree(organData.organId);
      this.clearSearchCondition();
      this.tableData = [];
    },
    initTree: function initTree(organId) {
      AjaxUtility.Post(this.acInterface.getDepartmentTreeData, {
        "organId": organId
      }, function (result) {
        if (result.success) {
          this.$refs.zTreeUL.setAttribute("id", "select-department-user-dialog-" + StringUtility.Guid());
          this.treeObj = $.fn.zTree.init($(this.$refs.zTreeUL), this.treeSetting, result.data);
          this.treeObj.expandAll(true);
          this.treeObj._host = this;
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
        }
      }, this);
    },
    treeNodeSelected: function treeNodeSelected(event, treeId, treeNode) {
      this.treeSelectedNode = treeNode;
      this.selectionRows = null;
      this.pageNum = 1;
      this.clearSearchCondition();
      this.searchCondition.departmentId.value = this.treeSelectedNode[this.treeIdFieldName];
      this.reloadData();
    },
    clearSearchCondition: function clearSearchCondition() {
      for (var key in this.searchCondition) {
        this.searchCondition[key].value = "";
      }

      this.searchCondition["searchInALL"].value = "否";
    },
    selectionChange: function selectionChange(selection) {
      this.selectionRows = selection;
    },
    reloadData: function reloadData() {
      ListPageUtility.IViewTableBindDataBySearch({
        url: this.acInterface.reloadListData,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchCondition: this.searchCondition,
        pageAppObj: this,
        tableList: this,
        idField: this.idFieldName,
        autoSelectedOldRows: false,
        successFunc: null,
        loadDict: false,
        custParas: {}
      });
    },
    changePage: function changePage(pageNum) {
      this.pageNum = pageNum;
      this.reloadData();
      this.selectionRows = null;
    },
    search: function search() {
      this.pageNum = 1;
      this.reloadData();
    },
    beginSelect: function beginSelect() {
      var elem = this.$refs.selectDepartmentUserModelDialogWrap;
      var dialogHeight = 460;

      if (PageStyleUtility.GetPageHeight() > 700) {
        dialogHeight = 660;
      }

      this.listHeight = dialogHeight - 230;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 970,
        height: dialogHeight,
        title: "选择部门人员"
      });
    },
    completed: function completed() {
      console.log(this.selectionRows);

      if (this.selectionRows) {
        this.$emit('on-selected-completed', this.selectionRows);
        this.handleClose();
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请先选中人员!", null);
      }
    },
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.selectDepartmentUserModelDialogWrap);
    }
  },
  template: "<div ref=\"selectDepartmentUserModelDialogWrap\" class=\"c1-select-model-wrap general-edit-page-wrap\" style=\"display: none\">\n                    <div class=\"list-2column\">\n                        <div class=\"left-outer-wrap\" style=\"width: 180px;top: 10px;left: 10px;bottom: 55px\">\n                            <select-organ-single-comp @on-selected-organ=\"changeOrgan\" ref=\"selectOrganComp\"></select-organ-single-comp>\n                            <div class=\"inner-wrap\" style=\"position:absolute;top: 30px;bottom: 10px;height: auto;overflow: auto\">\n                                <div>\n                                    <ul ref=\"zTreeUL\" class=\"ztree\"></ul>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"right-outer-wrap iv-list-page-wrap\" style=\"padding: 10px;left: 200px;top: 10px;right: 10px;bottom: 55px\">\n                            <div class=\"list-simple-search-wrap\">\n                                <table class=\"ls-table\">\n                                    <colgroup>\n                                        <col style=\"width: 80px\">\n                                        <col style=\"\">\n                                        <col style=\"width: 100px\">\n                                        <col style=\"\">\n                                        <col style=\"width: 80px\">\n                                        <col style=\"width: 85px\">\n                                        <col style=\"width: 80px\">\n                                    </colgroup>\n                                    <tr class=\"ls-table-row\">\n                                        <td>\u7528\u6237\u540D\uFF1A</td>\n                                        <td>\n                                            <i-input v-model=\"searchCondition.userName.value\" placeholder=\"\"></i-input>\n                                        </td>\n                                        <td>\u624B\u673A\uFF1A</td>\n                                        <td>\n                                            <i-input v-model=\"searchCondition.userPhoneNumber.value\"></i-input>\n                                        </td>\n                                        <td>\u5168\u5C40\uFF1A</td>\n                                        <td>\n                                            <radio-group v-model=\"searchCondition.searchInALL.value\">\n                                                <radio label=\"\u662F\">\u662F</radio>\n                                                <radio label=\"\u5426\">\u5426</radio>\n                                            </radio-group>\n                                        </td>\n                                        <td><i-button type=\"primary\" @click=\"search\"><Icon type=\"android-search\"></Icon> \u67E5\u8BE2 </i-button></td>\n                                    </tr>\n                                </table>\n                            </div>\n                            <i-table :height=\"listHeight\" stripe border :columns=\"columnsConfig\" :data=\"tableData\"\n                                     class=\"iv-list-table\" :highlight-row=\"true\"\n                                     @on-selection-change=\"selectionChange\"></i-table>\n                            <div style=\"float: right;\">\n                                <page @on-change=\"changePage\" :current.sync=\"pageNum\" :page-size=\"pageSize\" show-total\n                                      :total=\"pageTotal\"></page>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"button-outer-wrap\" style=\"bottom: 12px;right: 12px\">\n                        <div class=\"button-inner-wrap\">\n                            <button-group>\n                                <i-button type=\"primary\" @click=\"completed()\" icon=\"md-checkmark\">\u786E\u8BA4</i-button>\n                                <i-button @click=\"handleClose()\" icon=\"md-close\">\u5173\u95ED</i-button>\n                            </button-group>\n                        </div>\n                    </div>\n                </div>"
});
"use strict";

Vue.component("select-module-object-dialog", {
  data: function data() {
    return {
      acInterface: {
        getDBLinkData: "/Rest/SSO/Mu/Menu/GetFullDBLink",
        getModuleTreeData: "/Rest/SSO/Mu/Menu/GetMouldTreeData",
        reloadListData: "/Rest/SSO/Mu/Menu/GetSelectModuleObjectListByModuleId"
      },
      selectModuleObjectType: "",
      selectedDBLinkId: "",
      dbLinkArray: [],
      treeIdFieldName: "moduleId",
      treeObj: null,
      treeSelectedNode: null,
      treeSetting: {
        async: {
          enable: true,
          url: ""
        },
        data: {
          key: {
            name: "moduleText"
          },
          simpleData: {
            enable: true,
            idKey: "moduleId",
            pIdKey: "moduleParentId"
          }
        },
        callback: {
          onClick: function onClick(event, treeId, treeNode) {
            var _self = this.getZTreeObj(treeId)._host;

            _self.treeNodeSelected(event, treeId, treeNode);
          },
          onAsyncSuccess: function onAsyncSuccess(event, treeId, treeNode, msg) {}
        }
      },
      selectedModuleObject: null,
      idFieldName: "ID",
      searchCondition: {
        selectModuleObjectType: {
          value: "",
          type: SearchUtility.SearchFieldType.StringType
        },
        selectModuleId: {
          value: "",
          type: SearchUtility.SearchFieldType.StringType
        }
      },
      columnsConfig: [{
        title: '名称',
        key: 'NAME',
        align: "center"
      }, {
        title: '备注',
        key: 'DESCRIPTION',
        width: 240,
        align: "center"
      }],
      tableData: [],
      pageTotal: 0,
      pageSize: 12,
      pageNum: 1,
      listHeight: 510
    };
  },
  mounted: function mounted() {
    this.bindDBLink();
  },
  methods: {
    bindDBLink: function bindDBLink() {
      AjaxUtility.Post(this.acInterface.getDBLinkData, {}, function (result) {
        if (result.success) {
          console.log(result.data);
          this.dbLinkArray = result.data;
          var oldSelectedOrganId = CookieUtility.GetCookie("SMODDBLINKID");
          this.selectedDBLinkId = oldSelectedOrganId;

          if (this.selectedDBLinkId) {
            this.initTree(this.selectedDBLinkId);
          }
        }
      }, this);
    },
    changeDBLink: function changeDBLink() {
      console.log(this.selectedDBLinkId);
      this.initTree(this.selectedDBLinkId);
      CookieUtility.SetCookie1Month("SMODDBLINKID", this.selectedDBLinkId);
    },
    initTree: function initTree(selectedDBLinkId) {
      AjaxUtility.Post(this.acInterface.getModuleTreeData, {
        "dbLinkId": selectedDBLinkId
      }, function (result) {
        console.log(result);

        if (result.success) {
          for (var i = 0; i < result.data.length; i++) {
            if (result.data[i].moduleParentId != "-1") {
              result.data[i].icon = "/Themes/Png16X16/layout-sidebar.png";
            }
          }

          this.$refs.zTreeUL.setAttribute("id", "select-module-object-dialog-" + StringUtility.Guid());
          this.treeObj = $.fn.zTree.init($(this.$refs.zTreeUL), this.treeSetting, result.data);
          this.treeObj.expandAll(true);
          this.treeObj._host = this;
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
        }
      }, this);
    },
    treeNodeSelected: function treeNodeSelected(event, treeId, treeNode) {
      this.treeSelectedNode = treeNode;
      this.pageNum = 1;
      this.searchCondition.selectModuleObjectType.value = this.selectModuleObjectType;
      this.searchCondition.selectModuleId.value = treeNode.moduleId;
      this.reloadData();
    },
    moduleObjectClick: function moduleObjectClick(data, index) {
      this.selectedModuleObject = data;
    },
    reloadData: function reloadData() {
      ListPageUtility.IViewTableBindDataBySearch({
        url: this.acInterface.reloadListData,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchCondition: this.searchCondition,
        pageAppObj: this,
        tableList: this,
        idField: this.idFieldName,
        autoSelectedOldRows: false,
        successFunc: function successFunc(result) {
          console.log(result);
        },
        loadDict: false,
        custParas: {}
      });
    },
    changePage: function changePage(pageNum) {
      this.pageNum = pageNum;
      this.reloadData();
    },
    search: function search() {
      this.pageNum = 1;
      this.reloadData();
    },
    beginSelect: function beginSelect(selectModuleObjectType) {
      var elem = this.$refs.selectModuleObjectDialogWrap;
      this.selectModuleObjectType = selectModuleObjectType;
      var dialogHeight = 660;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 870,
        height: dialogHeight,
        title: "选择关联对象1"
      });
    },
    buildDisplayName: function buildDisplayName(selectedModuleObject) {
      var txt = "路径:【" + TreeUtility.BuildNodePathName(this.treeSelectedNode, "moduleText", selectedModuleObject.NAME + "(" + selectedModuleObject.CODE + ")") + "】";

      if (this.selectModuleObjectType == "Web模块列表") {
        txt += "，数据集:（" + selectedModuleObject.LIST_DATASET_NAME + "）";
      }

      return txt;
    },
    completed: function completed() {
      if (this.selectedModuleObject) {
        this.$emit('on-selected-completed', this.selectedModuleObject, this.selectedModuleObject.ID, this.buildDisplayName(this.selectedModuleObject), JsonUtility.JsonToString(this.selectedModuleObject));
        this.handleClose();
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请先选择绑定对象!", null);
      }
    },
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.selectModuleObjectDialogWrap);
    }
  },
  template: "<div ref=\"selectModuleObjectDialogWrap\" class=\"c1-select-model-wrap general-edit-page-wrap\" style=\"display: none\">\n                    <div class=\"list-2column\">\n                        <div class=\"left-outer-wrap\" style=\"width: 220px;top: 10px;left: 10px;bottom: 55px\">\n                            <i-select @on-change=\"changeDBLink\" v-model=\"selectedDBLinkId\">\n                                <i-option v-for=\"item in dbLinkArray\" :value=\"item.dbId\" :key=\"item.dbId\">{{ item.dbLinkName }}</i-option>\n                            </i-select>\n                            <div class=\"inner-wrap\" style=\"position:absolute;top: 34px;bottom: 10px;height: auto;overflow: auto\">\n                                <div>\n                                    \n                                    <ul ref=\"zTreeUL\" class=\"ztree\"></ul>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"right-outer-wrap iv-list-page-wrap\" style=\"padding: 10px;left: 240px;top: 10px;right: 10px;bottom: 55px\">\n                            <i-table :height=\"listHeight\" stripe border :columns=\"columnsConfig\" :data=\"tableData\"\n                                     class=\"iv-list-table\" :highlight-row=\"true\"\n                                     @on-row-click=\"moduleObjectClick\"></i-table>\n                        </div>\n                    </div>\n                    <div class=\"button-outer-wrap\" style=\"bottom: 12px;right: 12px\">\n                        <div class=\"button-inner-wrap\">\n                            <button-group>\n                                <i-button type=\"primary\" @click=\"completed()\" icon=\"md-checkmark\">\u786E\u8BA4</i-button>\n                                <i-button @click=\"handleClose()\" icon=\"md-close\">\u5173\u95ED</i-button>\n                            </button-group>\n                        </div>\n                    </div>\n                </div>"
});
"use strict";

Vue.component("select-organ-user-dialog", {
  data: function data() {
    return {
      acInterface: {
        getOrganTreeData: "/Rest/SSO/Org/Organ/GetFullOrgan",
        reloadListData: "/Rest/SSO/Runtime/UserRuntime/GetUserByOrganSearch"
      },
      treeIdFieldName: "organId",
      treeObj: null,
      treeSelectedNode: null,
      treeSetting: {
        async: {
          enable: true,
          url: ""
        },
        data: {
          key: {
            name: "organName"
          },
          simpleData: {
            enable: true,
            idKey: "organId",
            pIdKey: "organParentId"
          }
        },
        callback: {
          onClick: function onClick(event, treeId, treeNode) {
            var _self = this.getZTreeObj(treeId)._host;

            _self.treeNodeSelected(event, treeId, treeNode);
          },
          onAsyncSuccess: function onAsyncSuccess(event, treeId, treeNode, msg) {
            appList.treeObj.expandAll(true);
          }
        }
      },
      idFieldName: "DU_ID",
      searchCondition: {
        userName: {
          value: "",
          type: SearchUtility.SearchFieldType.LikeStringType
        },
        account: {
          value: "",
          type: SearchUtility.SearchFieldType.LikeStringType
        },
        userPhoneNumber: {
          value: "",
          type: SearchUtility.SearchFieldType.LikeStringType
        },
        organId: {
          value: "",
          type: SearchUtility.SearchFieldType.StringType
        },
        searchInALL: {
          value: "否",
          type: SearchUtility.SearchFieldType.StringType
        }
      },
      columnsConfig: [{
        type: 'selection',
        width: 60,
        align: 'center'
      }, {
        title: '用户名',
        key: 'USER_NAME',
        align: "center"
      }, {
        title: '手机号码',
        key: 'USER_PHONE_NUMBER',
        width: 140,
        align: "center"
      }, {
        title: '部门',
        key: 'DEPT_NAME',
        width: 140,
        align: "center"
      }, {
        title: '主属',
        key: 'DU_IS_MAIN',
        width: 70,
        align: "center"
      }],
      tableData: [],
      selectionRows: null,
      pageTotal: 0,
      pageSize: 12,
      pageNum: 1,
      listHeight: 270
    };
  },
  mounted: function mounted() {},
  methods: {
    changeOrgan: function changeOrgan(organData) {
      CookieUtility.SetCookie1Month("DMORGSID", organData.organId);
      this.initTree(organData.organId);
      this.clearSearchCondition();
      this.tableData = [];
    },
    initTree: function initTree() {
      AjaxUtility.Post(this.acInterface.getOrganTreeData, {}, function (result) {
        if (result.success) {
          this.$refs.zTreeUL.setAttribute("id", "select-organ-user-dialog-" + StringUtility.Guid());
          this.treeObj = $.fn.zTree.init($(this.$refs.zTreeUL), this.treeSetting, result.data);
          this.treeObj.expandAll(true);
          this.treeObj._host = this;
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
        }
      }, this);
    },
    treeNodeSelected: function treeNodeSelected(event, treeId, treeNode) {
      this.treeSelectedNode = treeNode;
      this.selectionRows = null;
      this.pageNum = 1;
      this.clearSearchCondition();
      this.searchCondition.organId.value = this.treeSelectedNode[this.treeIdFieldName];
      this.reloadData();
    },
    clearSearchCondition: function clearSearchCondition() {
      for (var key in this.searchCondition) {
        this.searchCondition[key].value = "";
      }

      this.searchCondition["searchInALL"].value = "否";
    },
    selectionChange: function selectionChange(selection) {
      this.selectionRows = selection;
    },
    reloadData: function reloadData() {
      ListPageUtility.IViewTableBindDataBySearch({
        url: this.acInterface.reloadListData,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchCondition: this.searchCondition,
        pageAppObj: this,
        tableList: this,
        idField: this.idFieldName,
        autoSelectedOldRows: false,
        successFunc: null,
        loadDict: false,
        custParas: {}
      });
    },
    changePage: function changePage(pageNum) {
      this.pageNum = pageNum;
      this.reloadData();
      this.selectionRows = null;
    },
    search: function search() {
      this.pageNum = 1;
      this.reloadData();
    },
    beginSelect: function beginSelect() {
      var elem = this.$refs.selectOrganUserModelDialogWrap;
      var dialogHeight = 460;

      if (PageStyleUtility.GetPageHeight() > 700) {
        dialogHeight = 660;
      }

      this.listHeight = dialogHeight - 230;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 970,
        height: dialogHeight,
        title: "选择组织机构人员"
      });
      this.initTree();
    },
    completed: function completed() {
      console.log(this.selectionRows);

      if (this.selectionRows) {
        this.$emit('on-selected-completed', this.selectionRows);
        this.handleClose();
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请先选中人员!", null);
      }
    },
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.selectOrganUserModelDialogWrap);
    }
  },
  template: "<div ref=\"selectOrganUserModelDialogWrap\" class=\"c1-select-model-wrap general-edit-page-wrap\" style=\"display: none\">\n                    <div class=\"list-2column\">\n                        <div class=\"left-outer-wrap\" style=\"width: 250px;top: 10px;left: 10px;bottom: 55px\">\n                            <div class=\"inner-wrap\" style=\"position:absolute;top: 2px;bottom: 10px;height: auto;overflow: auto\">\n                                <div>\n                                    <ul ref=\"zTreeUL\" class=\"ztree\"></ul>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"right-outer-wrap iv-list-page-wrap\" style=\"padding: 10px;left: 270px;top: 10px;right: 10px;bottom: 55px\">\n                            <div class=\"list-simple-search-wrap\">\n                                <table class=\"ls-table\">\n                                    <colgroup>\n                                        <col style=\"width: 80px\">\n                                        <col style=\"\">\n                                        <col style=\"width: 100px\">\n                                        <col style=\"\">\n                                        <col style=\"width: 80px\">\n                                        <col style=\"width: 85px\">\n                                        <col style=\"width: 80px\">\n                                    </colgroup>\n                                    <tr class=\"ls-table-row\">\n                                        <td>\u7528\u6237\u540D\uFF1A</td>\n                                        <td>\n                                            <i-input v-model=\"searchCondition.userName.value\" placeholder=\"\"></i-input>\n                                        </td>\n                                        <td>\u624B\u673A\uFF1A</td>\n                                        <td>\n                                            <i-input v-model=\"searchCondition.userPhoneNumber.value\"></i-input>\n                                        </td>\n                                        <td>\u5168\u5C40\uFF1A</td>\n                                        <td>\n                                            <radio-group v-model=\"searchCondition.searchInALL.value\">\n                                                <radio label=\"\u662F\">\u662F</radio>\n                                                <radio label=\"\u5426\">\u5426</radio>\n                                            </radio-group>\n                                        </td>\n                                        <td><i-button type=\"primary\" @click=\"search\"><Icon type=\"android-search\"></Icon> \u67E5\u8BE2 </i-button></td>\n                                    </tr>\n                                </table>\n                            </div>\n                            <i-table :height=\"listHeight\" stripe border :columns=\"columnsConfig\" :data=\"tableData\"\n                                     class=\"iv-list-table\" :highlight-row=\"true\"\n                                     @on-selection-change=\"selectionChange\"></i-table>\n                            <div style=\"float: right;\">\n                                <page @on-change=\"changePage\" :current.sync=\"pageNum\" :page-size=\"pageSize\" show-total\n                                      :total=\"pageTotal\"></page>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"button-outer-wrap\" style=\"bottom: 12px;right: 12px\">\n                        <div class=\"button-inner-wrap\">\n                            <button-group>\n                                <i-button type=\"primary\" @click=\"completed()\" icon=\"md-checkmark\">\u786E\u8BA4</i-button>\n                                <i-button @click=\"handleClose()\" icon=\"md-close\">\u5173\u95ED</i-button>\n                            </button-group>\n                        </div>\n                    </div>\n                </div>"
});
"use strict";

Vue.component("view-authority-owner-dialog", {
  data: function data() {
    return {
      acInterface: {
        getObjAuthOwnerDesc: "/Rest/SSO/Auth/Authority/GetObjAuthOwnerDesc"
      },
      ObjAuthOwnerDescData: []
    };
  },
  mounted: function mounted() {},
  methods: {
    showDialog: function showDialog(authObjId, title) {
      var elem = this.$refs.viewAuthorityOwnerDialogWrap;
      var dialogHeight = 460;

      if (PageStyleUtility.GetPageHeight() > 700) {
        dialogHeight = 660;
      }

      this.listHeight = dialogHeight - 230;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 970,
        height: dialogHeight,
        title: title
      });
      AjaxUtility.Get(this.acInterface.getObjAuthOwnerDesc, {
        authObjId: authObjId
      }, function (result) {
        if (result.success) {
          console.log(result);
          this.ObjAuthOwnerDescData = result.data;
        }
      }, this);
    }
  },
  template: "<div ref=\"viewAuthorityOwnerDialogWrap\" class=\"c1-select-model-wrap general-edit-page-wrap\" style=\"display: none\">\n                    <div v-for=\"ObjAuthOwnerItem in ObjAuthOwnerDescData\">\n                        <div>\n                            <Divider>{{ObjAuthOwnerItem.Type}}[{{ObjAuthOwnerItem.Name}}]</Divider>\n                        </div>\n                        <div>\n                            <Tag color=\"geekblue\" v-for=\"(innObj,index) in ObjAuthOwnerItem.Data\" :key=\"ObjAuthOwnerItem.Key+index\">{{innObj.PARENT_ORGAN_NAME}}->{{innObj.USER_ORGAN_NAME}}:{{innObj.USER_NAME}}</Tag>\n                        </div>\n                    </div>\n                </div>"
});
"use strict";

Vue.component("sso-app-detail-from-comp", {
  props: ["status", "appId", "isSubSystem"],
  watch: {
    appId: function appId(newVal) {
      this.appEntity.appId = newVal;
    },
    status: function status(newVal) {
      this.innerStatus = newVal;
    }
  },
  data: function data() {
    return {
      acInterface: {
        appLogoUrl: "/Rest/SSO/App/Application/GetAppLogo",
        getNewKeys: "/Rest/SSO/App/Application/GetNewKeys"
      },
      appEntity: {
        appId: "",
        appCode: "",
        appName: "",
        appPublicKey: "",
        appPrivateKey: "",
        appDomain: "",
        appIndexUrl: "",
        appMainImageId: "",
        appType: "",
        appMainId: "",
        appCategory: "web",
        appDesc: "",
        appStatus: "启用",
        appCreateTime: DateUtility.GetCurrentDate()
      },
      ruleValidate: {
        appCode: [{
          required: true,
          message: '【系统编码】不能为空！',
          trigger: 'blur'
        }, {
          type: 'string',
          pattern: /^[A-Za-z0-9]+$/,
          message: '请使用字母或数字',
          trigger: 'blur'
        }],
        appName: [{
          required: true,
          message: '【系统名称】不能为空！',
          trigger: 'blur'
        }]
      },
      systemLogoImageSrc: "",
      innerStatus: "add"
    };
  },
  mounted: function mounted() {
    if (this.innerStatus == "add") {
      this.systemLogoImageSrc = BaseUtility.BuildAction(this.acInterface.appLogoUrl, {
        fileId: "defaultSSOAppLogoImage"
      });
    } else {
      this.systemLogoImageSrc = BaseUtility.BuildAction(this.acInterface.appLogoUrl, {
        fileId: ""
      });
    }
  },
  methods: {
    resetAppEntity: function resetAppEntity() {
      this.appEntity.appId = "";
      this.appEntity.appCode = "";
      this.appEntity.appName = "";
      this.appEntity.appPublicKey = "";
      this.appEntity.appPrivateKey = "";
      this.appEntity.appDomain = "";
      this.appEntity.appIndexUrl = "";
      this.appEntity.appMainImageId = "";
      this.appEntity.appType = "";
      this.appEntity.appMainId = "";
      this.appEntity.appCategory = "web";
      this.appEntity.appDesc = "";
      this.appEntity.appStatus = "启用";
      this.appEntity.appCreateTime = DateUtility.GetCurrentDate();
    },
    uploadSystemLogoImageSuccess: function uploadSystemLogoImageSuccess(response, file, fileList) {
      if (response.success) {
        var data = response.data;
        this.appEntity.appMainImageId = data.fileId;
        this.systemLogoImageSrc = BaseUtility.BuildAction(this.acInterface.appLogoUrl, {
          fileId: this.appEntity.appMainImageId
        });
      } else {
        DialogUtility.AlertError(window, DialogUtility.DialogAlertErrorId, {}, response.message, null, null);
      }
    },
    getAppEntity: function getAppEntity() {
      return this.appEntity;
    },
    setAppEntity: function setAppEntity(appEntity) {
      this.appEntity = appEntity;
    },
    createKeys: function createKeys() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getNewKeys, {}, function (result) {
        if (result.success) {
          _self.appEntity.appPublicKey = result.data.publicKey;
          _self.appEntity.appPrivateKey = result.data.privateKey;
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, this);
    }
  },
  template: "<div>\n                    <div style=\"width: 80%;float: left\">\n                        <i-form ref=\"appEntity\" :model=\"appEntity\" :rules=\"ruleValidate\" :label-width=\"100\">\n                            <form-item label=\"\u7CFB\u7EDF\u7F16\u7801\uFF1A\" prop=\"appCode\">\n                                <row>\n                                    <i-col span=\"10\">\n                                        <form-item prop=\"appCode\">\n                                            <i-input v-model=\"appEntity.appCode\"></i-input>\n                                        </form-item>\n                                    </i-col>\n                                    <i-col span=\"4\" style=\"text-align: center\"><span style=\"color: red\">*</span> \u7CFB\u7EDF\u540D\u79F0\uFF1A</i-col>\n                                    <i-col span=\"10\">\n                                        <form-item prop=\"appName\">\n                                            <i-input v-model=\"appEntity.appName\"></i-input>\n                                        </form-item>\n                                    </i-col>\n                                </row>\n                            </form-item>\n                            <form-item label=\"\u57DF\u540D\uFF1A\">\n                                <row>\n                                    <i-col span=\"10\">\n                                        <i-input v-model=\"appEntity.appDomain\"></i-input>\n                                    </i-col>\n                                    <i-col span=\"4\" style=\"text-align: center\">\u7CFB\u7EDF\u7C7B\u522B\uFF1A</i-col>\n                                    <i-col span=\"10\">\n                                        <radio-group v-model=\"appEntity.appCategory\" type=\"button\">\n                                            <radio label=\"app\">\u79FB\u52A8App</radio>\n                                            <radio label=\"web\">Web\u7CFB\u7EDF</radio>\n                                        </radio-group>\n                                    </i-col>\n                                </row>\n                            </form-item>\n                            <form-item label=\"\u516C\u94A5\uFF1A\" v-if=\"isSubSystem=='0'\">\n                                <i-input placeholder=\"\u8BF7\u521B\u5EFA\u5BC6\u94A5\u5BF9,\u7528\u4E8E\u6570\u636E\u7684\u52A0\u5BC6\u4F7F\u7528\" search enter-button=\"\u521B\u5EFA\u5BC6\u94A5\u5BF9\" v-model=\"appEntity.appPublicKey\" @on-search=\"createKeys()\"></i-input>\n                            </form-item>\n                            <form-item label=\"\u79C1\u94A5\uFF1A\" v-if=\"isSubSystem==0\">\n                                <i-input v-model=\"appEntity.appPrivateKey\"></i-input>\n                            </form-item>\n                            <form-item label=\"\u521B\u5EFA\u65F6\u95F4\uFF1A\">\n                                <row>\n                                    <i-col span=\"10\">\n                                        <date-picker type=\"date\" placeholder=\"\u9009\u62E9\u521B\u5EFA\u65F6\u95F4\" v-model=\"appEntity.appCreateTime\" disabled\n                                                     readonly></date-picker>\n                                    </i-col>\n                                    <i-col span=\"4\" style=\"text-align: center\">\u72B6\u6001\uFF1A</i-col>\n                                    <i-col span=\"10\">\n                                        <form-item>\n                                            <radio-group v-model=\"appEntity.appStatus\">\n                                                <radio label=\"\u542F\u7528\">\u542F\u7528</radio>\n                                                <radio label=\"\u7981\u7528\">\u7981\u7528</radio>\n                                            </radio-group>\n                                        </form-item>\n                                    </i-col>\n                                </row>\n                            </form-item>\n                            <form-item label=\"\u9ED8\u8BA4\u5730\u5740\uFF1A\">\n                                <i-input v-model=\"appEntity.appIndexUrl\"></i-input>\n                            </form-item>\n                            <form-item label=\"\u5907\u6CE8\uFF1A\">\n                                <i-input v-model=\"appEntity.appDesc\" type=\"textarea\" :autosize=\"{minRows: 3,maxRows: 3}\"></i-input>\n                            </form-item>\n                        </i-form>\n                    </div>\n                    <div style=\"width: 19%;float: right\">\n                        <div style=\"border-radius: 8px;text-align: center;margin-top: 0px;margin-bottom: 30px\">\n                            <img :src=\"systemLogoImageSrc\" style=\"width: 110px;height: 110px\" />\n                        </div>\n                        <upload style=\"margin:10px 12px 0 20px\" :on-success=\"uploadSystemLogoImageSuccess\" :data=\"appEntity\" multiple type=\"drag\" name=\"file\" action=\"../../../Rest/SSO/App/Application/UploadAppLogo\" accept=\".png\">\n                            <div style=\"padding:10px 0px\">\n                                <icon type=\"ios-cloud-upload\" size=\"52\" style=\"color: #3399ff\"></icon>\n                                <p>\u4E0A\u4F20\u7CFB\u7EDFLogo</p>\n                            </div>\n                        </upload>\n                    </div>\n                </div>"
});
"use strict";

Vue.component("sso-app-interface-list-comp", {
  props: ["interfaceBelongAppId"],
  watch: {
    interfaceBelongAppId: function interfaceBelongAppId(newVal) {
      this.interfaceEntity.interfaceBelongAppId = newVal;
    }
  },
  data: function data() {
    var _self = this;

    return {
      acInterface: {
        delete: "/PlatFormRest/SSO/Application/DeleteInterface"
      },
      interfaceEntity: {
        interfaceId: "",
        interfaceBelongAppId: "",
        interfaceCode: "",
        interfaceName: "",
        interfaceUrl: "",
        interfaceParas: "",
        interfaceFormat: "",
        interfaceDesc: "",
        interfaceOrderNum: "",
        interfaceCreateTime: DateUtility.GetCurrentDate(),
        interfaceStatus: "启用",
        interfaceCreaterId: "",
        interfaceOrganId: ""
      },
      list: {
        columnsConfig: [{
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '接口类型',
          key: 'interfaceCode',
          align: "center",
          width: 100
        }, {
          title: '接口名称',
          key: 'interfaceName',
          align: "center",
          width: 280
        }, {
          title: '备注',
          key: 'interfaceDesc',
          align: "center"
        }, {
          title: '操作',
          key: 'interfaceId',
          width: 140,
          align: "center",
          render: function render(h, params) {
            return h('div', {
              class: "list-row-button-wrap"
            }, [ListPageUtility.IViewTableInnerButton.EditButton(h, params, "interfaceId", _self), ListPageUtility.IViewTableInnerButton.DeleteButton(h, params, "interfaceId", _self)]);
          }
        }],
        tableData: []
      },
      innerStatus: "add"
    };
  },
  mounted: function mounted() {},
  methods: {
    resetListData: function resetListData() {
      this.list.tableData = [];
    },
    addInterface: function addInterface() {
      var elem = this.$refs.ssoAppInterfaceEditModelDialogWrap;
      this.innerStatus == "add";
      this.interfaceEntity.interfaceId = "";
      this.interfaceEntity.interfaceBelongAppId = this.interfaceBelongAppId;
      this.interfaceEntity.interfaceCode = "";
      this.interfaceEntity.interfaceName = "";
      this.interfaceEntity.interfaceUrl = "";
      this.interfaceEntity.interfaceParas = "";
      this.interfaceEntity.interfaceFormat = "";
      this.interfaceEntity.interfaceDesc = "";
      this.interfaceEntity.interfaceOrderNum = "";
      this.interfaceEntity.interfaceCreateTime = DateUtility.GetCurrentDate();
      this.interfaceEntity.interfaceStatus = "启用";
      this.interfaceEntity.interfaceCreaterId = "";
      this.interfaceEntity.interfaceOrganId = "";
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 570,
        height: 330,
        title: "接口设置"
      });
    },
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.ssoAppInterfaceEditModelDialogWrap);
    },
    saveInterfaceEdit: function saveInterfaceEdit() {
      if (this.innerStatus == "add") {
        this.interfaceEntity.interfaceId = StringUtility.Guid();
        this.list.tableData.push(JsonUtility.CloneSimple(this.interfaceEntity));
      } else {
        for (var i = 0; i < this.list.tableData.length; i++) {
          if (this.list.tableData[i].interfaceId == this.interfaceEntity.interfaceId) {
            this.list.tableData[i].interfaceCode = this.interfaceEntity.interfaceCode;
            this.list.tableData[i].interfaceName = this.interfaceEntity.interfaceName;
            this.list.tableData[i].interfaceUrl = this.interfaceEntity.interfaceUrl;
            this.list.tableData[i].interfaceParas = this.interfaceEntity.interfaceParas;
            this.list.tableData[i].interfaceFormat = this.interfaceEntity.interfaceFormat;
            this.list.tableData[i].interfaceDesc = this.interfaceEntity.interfaceDesc;
            break;
          }
        }
      }

      this.handleClose();
    },
    changeInterfaceCode: function changeInterfaceCode(value) {
      this.interfaceEntity.interfaceCode = value;
    },
    getInterfaceListData: function getInterfaceListData() {
      return this.list.tableData;
    },
    setInterfaceListData: function setInterfaceListData(data) {
      this.list.tableData = data;
    },
    edit: function edit(interfaceId, params) {
      this.innerStatus = "update";
      this.interfaceEntity.interfaceId = params.row.interfaceId;
      this.interfaceEntity.interfaceCode = params.row.interfaceCode;
      this.interfaceEntity.interfaceName = params.row.interfaceName;
      this.interfaceEntity.interfaceUrl = params.row.interfaceUrl;
      this.interfaceEntity.interfaceParas = params.row.interfaceParas;
      this.interfaceEntity.interfaceFormat = params.row.interfaceFormat;
      this.interfaceEntity.interfaceDesc = params.row.interfaceDesc;
      this.interfaceEntity.interfaceOrderNum = params.row.interfaceOrderNum;
      this.interfaceEntity.interfaceCreateTime = params.row.interfaceCreateTime;
      this.interfaceEntity.interfaceStatus = params.row.interfaceStatus;
      this.interfaceEntity.interfaceCreaterId = params.row.interfaceCreaterId;
      this.interfaceEntity.interfaceOrganId = params.row.interfaceOrganId;
      this.interfaceEntity.interfaceBelongAppId = params.row.interfaceBelongAppId;
      var elem = this.$refs.ssoAppInterfaceEditModelDialogWrap;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 570,
        height: 330,
        title: "接口设置"
      });
    },
    del: function del(interfaceId, params) {
      var _self = this;

      for (var i = 0; i < this.list.tableData.length; i++) {
        if (this.list.tableData[i].interfaceId == interfaceId) {
          _self.list.tableData.splice(i, 1);

          DialogUtility.Confirm(window, "确认要删除该接口吗？", function () {
            AjaxUtility.Delete(_self.acInterface.delete, {
              "interfaceId": interfaceId
            }, function (result) {
              if (result.success) {} else {
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
              }
            }, this);
          });
        }
      }
    }
  },
  template: "<div class=\"iv-list-page-wrap\">\n                    <div ref=\"ssoAppInterfaceEditModelDialogWrap\" class=\"general-edit-page-wrap\" style=\"display: none;margin-top: 0px\">\n                        <i-form ref=\"interfaceEntity\" :model=\"interfaceEntity\" :label-width=\"130\">\n                            <form-item style=\"margin-bottom: 2px\">\n                                <span slot=\"label\"><span style=\"color: red\">*</span>&nbsp;\u63A5\u53E3\u7C7B\u578B\uFF1A</span>\n                                <i-input v-model=\"interfaceEntity.interfaceCode\" size=\"small\">\n                                    <Select slot=\"append\" style=\"width: 90px\" @on-change=\"changeInterfaceCode\">\n                                        <Option value=\"\u767B\u5F55\u63A5\u53E3\">\u767B\u5F55\u63A5\u53E3</Option>\n                                        <Option value=\"\u5176\u4ED6\">\u5176\u4ED6</Option>\n                                    </Select>\n                                </i-input>\n                            </form-item>\n                            <form-item style=\"margin-bottom: 2px\">\n                                <span slot=\"label\"><span style=\"color: red\">*</span>&nbsp;\u63A5\u53E3\u540D\u79F0\uFF1A</span>\n                                <i-input v-model=\"interfaceEntity.interfaceName\" size=\"small\"></i-input>\n                            </form-item>\n                            <form-item label=\"\u63A5\u53E3\u5730\u5740\uFF1A\" style=\"margin-bottom: 2px\">\n                                <i-input v-model=\"interfaceEntity.interfaceUrl\" size=\"small\"></i-input>\n                            </form-item>\n                            <form-item label=\"\u53C2\u6570\uFF1A\" style=\"margin-bottom: 2px\">\n                                <i-input v-model=\"interfaceEntity.interfaceParas\" type=\"textarea\" :autosize=\"{minRows: 2,maxRows: 2}\" size=\"small\"></i-input>    \n                            </form-item>\n                            <form-item label=\"\u683C\u5F0F\u5316\u65B9\u6CD5\uFF1A\" style=\"margin-bottom: 2px\">\n                                <i-input v-model=\"interfaceEntity.interfaceFormat\" size=\"small\"></i-input>\n                            </form-item>\n                            <form-item label=\"\u5907\u6CE8\uFF1A\" style=\"margin-bottom: 2px\">\n                                <i-input v-model=\"interfaceEntity.interfaceDesc\" size=\"small\"></i-input>\n                            </form-item>\n                        </i-form>\n                        <div class=\"button-outer-wrap\" style=\"margin-left: 8px\">\n                            <div class=\"button-inner-wrap\">\n                                <button-group size=\"small\">\n                                    <i-button type=\"primary\" @click=\"saveInterfaceEdit('interfaceEntity')\" icon=\"md-checkmark\"></i-button>\n                                    <i-button @click=\"handleClose()\" icon=\"md-close\"></i-button>\n                                </button-group>\n                            </div>\n                        </div>\n                    </div>\n                    <div id=\"list-button-wrap\" class=\"list-button-outer-wrap\">\n                        <div class=\"list-button-inner-wrap\">\n                            <ButtonGroup>\n                                <i-button  type=\"success\" @click=\"addInterface()\" icon=\"md-add\">\u65B0\u589E</i-button>\n                            </ButtonGroup>\n                        </div>\n                        <div style=\"clear: both\"></div>\n                    </div>\n                    <i-table :height=\"list.listHeight\" stripe border :columns=\"list.columnsConfig\" :data=\"list.tableData\"\n                         class=\"iv-list-table\" :highlight-row=\"true\"></i-table>\n                </div>"
});
"use strict";

Vue.component("sso-app-sub-system-list-comp", {
  props: ["status", "belongAppId"],
  data: function data() {
    return {
      acInterface: {
        saveSubAppUrl: "/PlatFormRest/SSO/Application/SaveSubApp",
        reloadData: "/PlatFormRest/SSO/Application/GetAllSubSsoApp",
        appLogoUrl: "/PlatFormRest/SSO/Application/GetAppLogo",
        delete: "/PlatFormRest/SSO/Application/Delete",
        getDataUrl: "/PlatFormRest/SSO/Application/GetAppVo"
      },
      appList: [],
      innerEditModelDialogStatus: "add"
    };
  },
  mounted: function mounted() {
    this.reloadData();
  },
  methods: {
    addIntegratedSystem: function addIntegratedSystem() {
      var elem = this.$refs.ssoAppSubSystemEditModelDialogWrap;
      this.$refs.subAppDetailFromComp.resetAppEntity();
      this.$refs.subAppInterfaceListComp.resetListData();
      this.innerEditModelDialogStatus = "add";
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 900,
        height: 500,
        title: "子系统设置"
      });
    },
    saveSubSystemSetting: function saveSubSystemSetting() {
      var _self = this;

      var ssoAppEntity = this.$refs.subAppDetailFromComp.getAppEntity();
      var ssoAppInterfaceEntityList = this.$refs.subAppInterfaceListComp.getInterfaceListData();
      ssoAppEntity.appMainId = this.belongAppId;

      if (this.innerEditModelDialogStatus == "add") {
        ssoAppEntity.appId = StringUtility.Guid();
      }

      if (ssoAppInterfaceEntityList) {
        for (var i = 0; i < ssoAppInterfaceEntityList.length; i++) {
          ssoAppInterfaceEntityList[i].interfaceBelongAppId = ssoAppEntity.appId;
        }
      }

      var vo = {
        "ssoAppEntity": ssoAppEntity,
        "ssoAppInterfaceEntityList": ssoAppInterfaceEntityList
      };
      var sendData = JSON.stringify(vo);
      AjaxUtility.PostRequestBody(this.acInterface.saveSubAppUrl, sendData, function (result) {
        if (result.success) {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
            _self.reloadData();

            _self.handleClose();
          });
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    },
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.ssoAppSubSystemEditModelDialogWrap);
    },
    reloadData: function reloadData() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.reloadData, {
        appId: _self.belongAppId
      }, function (result) {
        if (result.success) {
          _self.appList = result.data;
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    },
    buildLogoUrl: function buildLogoUrl(app) {
      if (app.appMainImageId == "") {
        return BaseUtility.BuildAction(this.acInterface.appLogoUrl, {
          fileId: "defaultSSOAppLogoImage"
        });
      } else {
        return BaseUtility.BuildAction(this.acInterface.appLogoUrl, {
          fileId: app.appMainImageId
        });
      }
    },
    settingApp: function settingApp(app) {
      var elem = this.$refs.ssoAppSubSystemEditModelDialogWrap;
      this.innerEditModelDialogStatus = "update";

      var _self = this;

      AjaxUtility.Post(this.acInterface.getDataUrl, {
        appId: app.appId
      }, function (result) {
        console.log(result);

        if (result.success) {
          _self.$refs.subAppDetailFromComp.setAppEntity(result.data.ssoAppEntity);

          _self.$refs.subAppInterfaceListComp.setInterfaceListData(result.data.ssoAppInterfaceEntityList);

          DialogUtility.DialogElemObj(elem, {
            modal: true,
            width: 900,
            height: 500,
            title: "子系统设置"
          });
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    },
    removeApp: function removeApp(app) {
      var _self = this;

      DialogUtility.Confirm(window, "确认要注销系统[" + app.appName + "]吗？", function () {
        AjaxUtility.Delete(_self.acInterface.delete, {
          appId: app.appId
        }, function (result) {
          if (result.success) {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
              _self.reloadData();
            });
          } else {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
          }
        }, "json");
      });
    }
  },
  template: "<div>\n                    <div ref=\"ssoAppSubSystemEditModelDialogWrap\" class=\"general-edit-page-wrap\" style=\"display: none;margin-top: 0px\">\n                        <tabs>\n                            <tab-pane label=\"\u7CFB\u7EDF\u8BBE\u7F6E\">\n                                <sso-app-detail-from-comp ref=\"subAppDetailFromComp\" :is-sub-system=\"true\" :status=\"innerEditModelDialogStatus\"></sso-app-detail-from-comp>\n                            </tab-pane>\n                            <tab-pane label=\"\u63A5\u53E3\u8BBE\u7F6E\">\n                                <sso-app-interface-list-comp ref=\"subAppInterfaceListComp\"></sso-app-interface-list-comp>\n                            </tab-pane>\n                        </tabs>\n                        <div class=\"button-outer-wrap\" style=\"margin-right: 10px;margin-bottom: 10px\">\n                            <div class=\"button-inner-wrap\">\n                                <button-group>\n                                    <i-button type=\"primary\" v-if=\"status!='view'\" @click=\"saveSubSystemSetting()\" icon=\"md-checkmark\">\u4FDD\u5B58\u5B50\u7CFB\u7EDF\u8BBE\u7F6E</i-button>\n                                    <i-button v-if=\"status!='view'\" @click=\"handleClose()\" icon=\"md-close\">\u5173\u95ED</i-button>\n                                </button-group>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"apps-manager-outer-wrap\">\n                        <div class=\"apps-outer-wrap\" ref=\"appsOuterWrap\" v-if=\"status!='add'\">\n                            <div  v-for=\"app in appList\" class=\"app-outer-wrap app-outer-wrap-sub-system\">\n                                <div class=\"title\">\n                                    <span>{{app.appName}}</span>\n                                </div>\n                                <div class=\"content\">\n                                    <div class=\"mainImg\">\n                                        <img :src=\"buildLogoUrl(app)\" />\n                                    </div>\n                                    <div class=\"button-wrap\">\n                                        <div class=\"button setting-button\" @click=\"settingApp(app)\">\n                                            \u8BBE\u7F6E\n                                        </div>\n                                        <div class=\"button remove-button\" @click=\"removeApp(app)\">\n                                            \u6CE8\u9500\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"app-outer-wrap app-outer-wrap-sub-system new-system-outer-wrap\">\n                                <div class=\"add-system-button\" @click=\"addIntegratedSystem()\" style=\"margin-top: 60px\">\u65B0\u589E</div>\n                            </div>\n                        </div>\n                        <div v-if=\"status=='add'\">\u8BF7\u5148\u4FDD\u5B58\u4E3B\u7CFB\u7EDF,\u518D\u8BBE\u7F6E\u5176\u4E2D\u7684\u5B50\u7CFB\u7EDF!</div>\n                    </div>\n                 </div>"
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRpYWxvZy9zZWxlY3QtZGVwYXJ0bWVudC11c2VyLWRpYWxvZy5qcyIsIkRpYWxvZy9zZWxlY3QtbW9kdWxlLW9iamVjdC1kaWFsb2cuanMiLCJEaWFsb2cvc2VsZWN0LW9yZ2FuLXVzZXItZGlhbG9nLmpzIiwiRGlhbG9nL3ZpZXctYXV0aG9yaXR5LW93bmVyLWRpYWxvZy5qcyIsIlNTTy9zc28tYXBwLWRldGFpbC1mcm9tLWNvbXAuanMiLCJTU08vc3NvLWFwcC1pbnRlcmZhY2UtbGlzdC1jb21wLmpzIiwiU1NPL3Nzby1hcHAtc3ViLXN5c3RlbS1saXN0LWNvbXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiU1NPVnVlRVhDb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInNlbGVjdC1kZXBhcnRtZW50LXVzZXItZGlhbG9nXCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZ2V0RGVwYXJ0bWVudFRyZWVEYXRhOiBcIi9SZXN0L1NTTy9EZXB0L0RlcGFydG1lbnQvR2V0RGVwYXJ0bWVudHNCeU9yZ2FuSWRcIixcbiAgICAgICAgcmVsb2FkTGlzdERhdGE6IFwiL1Jlc3QvU1NPL0RlcHQvRGVwYXJ0bWVudFVzZXIvR2V0TGlzdERhdGFcIlxuICAgICAgfSxcbiAgICAgIHRyZWVJZEZpZWxkTmFtZTogXCJkZXB0SWRcIixcbiAgICAgIHRyZWVPYmo6IG51bGwsXG4gICAgICB0cmVlU2VsZWN0ZWROb2RlOiBudWxsLFxuICAgICAgdHJlZVNldHRpbmc6IHtcbiAgICAgICAgYXN5bmM6IHtcbiAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgdXJsOiBcIlwiXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgIG5hbWU6IFwiZGVwdE5hbWVcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgaWRLZXk6IFwiZGVwdElkXCIsXG4gICAgICAgICAgICBwSWRLZXk6IFwiZGVwdFBhcmVudElkXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgdmFyIF9zZWxmID0gdGhpcy5nZXRaVHJlZU9iaih0cmVlSWQpLl9ob3N0O1xuXG4gICAgICAgICAgICBfc2VsZi50cmVlTm9kZVNlbGVjdGVkKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uQXN5bmNTdWNjZXNzOiBmdW5jdGlvbiBvbkFzeW5jU3VjY2VzcyhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSwgbXNnKSB7XG4gICAgICAgICAgICBhcHBMaXN0LnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGlkRmllbGROYW1lOiBcIkRVX0lEXCIsXG4gICAgICBzZWFyY2hDb25kaXRpb246IHtcbiAgICAgICAgdXNlck5hbWU6IHtcbiAgICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgICB0eXBlOiBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5MaWtlU3RyaW5nVHlwZVxuICAgICAgICB9LFxuICAgICAgICBhY2NvdW50OiB7XG4gICAgICAgICAgdmFsdWU6IFwiXCIsXG4gICAgICAgICAgdHlwZTogU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuTGlrZVN0cmluZ1R5cGVcbiAgICAgICAgfSxcbiAgICAgICAgdXNlclBob25lTnVtYmVyOiB7XG4gICAgICAgICAgdmFsdWU6IFwiXCIsXG4gICAgICAgICAgdHlwZTogU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuTGlrZVN0cmluZ1R5cGVcbiAgICAgICAgfSxcbiAgICAgICAgZGVwYXJ0bWVudElkOiB7XG4gICAgICAgICAgdmFsdWU6IFwiXCIsXG4gICAgICAgICAgdHlwZTogU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuU3RyaW5nVHlwZVxuICAgICAgICB9LFxuICAgICAgICBzZWFyY2hJbkFMTDoge1xuICAgICAgICAgIHZhbHVlOiBcIuWQplwiLFxuICAgICAgICAgIHR5cGU6IFNlYXJjaFV0aWxpdHkuU2VhcmNoRmllbGRUeXBlLlN0cmluZ1R5cGVcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgIHR5cGU6ICdzZWxlY3Rpb24nLFxuICAgICAgICB3aWR0aDogNjAsXG4gICAgICAgIGFsaWduOiAnY2VudGVyJ1xuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+eUqOaIt+WQjScsXG4gICAgICAgIGtleTogJ1VTRVJfTkFNRScsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5omL5py65Y+356CBJyxcbiAgICAgICAga2V5OiAnVVNFUl9QSE9ORV9OVU1CRVInLFxuICAgICAgICB3aWR0aDogMTQwLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+e7hOe7h+acuuaehCcsXG4gICAgICAgIGtleTogJ09SR0FOX05BTUUnLFxuICAgICAgICB3aWR0aDogMTQwLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+mDqOmXqCcsXG4gICAgICAgIGtleTogJ0RFUFRfTkFNRScsXG4gICAgICAgIHdpZHRoOiAxNDAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5Li75bGeJyxcbiAgICAgICAga2V5OiAnRFVfSVNfTUFJTicsXG4gICAgICAgIHdpZHRoOiA3MCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH1dLFxuICAgICAgdGFibGVEYXRhOiBbXSxcbiAgICAgIHNlbGVjdGlvblJvd3M6IG51bGwsXG4gICAgICBwYWdlVG90YWw6IDAsXG4gICAgICBwYWdlU2l6ZTogMTIsXG4gICAgICBwYWdlTnVtOiAxLFxuICAgICAgbGlzdEhlaWdodDogMjcwXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB2YXIgb2xkU2VsZWN0ZWRPcmdhbklkID0gQ29va2llVXRpbGl0eS5HZXRDb29raWUoXCJETU9SR1NJRFwiKTtcblxuICAgIGlmIChvbGRTZWxlY3RlZE9yZ2FuSWQpIHtcbiAgICAgIHRoaXMuJHJlZnMuc2VsZWN0T3JnYW5Db21wLnNldE9sZFNlbGVjdGVkT3JnYW4ob2xkU2VsZWN0ZWRPcmdhbklkKTtcbiAgICAgIHRoaXMuaW5pdFRyZWUob2xkU2VsZWN0ZWRPcmdhbklkKTtcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBjaGFuZ2VPcmdhbjogZnVuY3Rpb24gY2hhbmdlT3JnYW4ob3JnYW5EYXRhKSB7XG4gICAgICBDb29raWVVdGlsaXR5LlNldENvb2tpZTFNb250aChcIkRNT1JHU0lEXCIsIG9yZ2FuRGF0YS5vcmdhbklkKTtcbiAgICAgIHRoaXMuaW5pdFRyZWUob3JnYW5EYXRhLm9yZ2FuSWQpO1xuICAgICAgdGhpcy5jbGVhclNlYXJjaENvbmRpdGlvbigpO1xuICAgICAgdGhpcy50YWJsZURhdGEgPSBbXTtcbiAgICB9LFxuICAgIGluaXRUcmVlOiBmdW5jdGlvbiBpbml0VHJlZShvcmdhbklkKSB7XG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0RGVwYXJ0bWVudFRyZWVEYXRhLCB7XG4gICAgICAgIFwib3JnYW5JZFwiOiBvcmdhbklkXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIHRoaXMuJHJlZnMuelRyZWVVTC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNlbGVjdC1kZXBhcnRtZW50LXVzZXItZGlhbG9nLVwiICsgU3RyaW5nVXRpbGl0eS5HdWlkKCkpO1xuICAgICAgICAgIHRoaXMudHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKHRoaXMuJHJlZnMuelRyZWVVTCksIHRoaXMudHJlZVNldHRpbmcsIHJlc3VsdC5kYXRhKTtcbiAgICAgICAgICB0aGlzLnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuICAgICAgICAgIHRoaXMudHJlZU9iai5faG9zdCA9IHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG4gICAgdHJlZU5vZGVTZWxlY3RlZDogZnVuY3Rpb24gdHJlZU5vZGVTZWxlY3RlZChldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgdGhpcy50cmVlU2VsZWN0ZWROb2RlID0gdHJlZU5vZGU7XG4gICAgICB0aGlzLnNlbGVjdGlvblJvd3MgPSBudWxsO1xuICAgICAgdGhpcy5wYWdlTnVtID0gMTtcbiAgICAgIHRoaXMuY2xlYXJTZWFyY2hDb25kaXRpb24oKTtcbiAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLmRlcGFydG1lbnRJZC52YWx1ZSA9IHRoaXMudHJlZVNlbGVjdGVkTm9kZVt0aGlzLnRyZWVJZEZpZWxkTmFtZV07XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIGNsZWFyU2VhcmNoQ29uZGl0aW9uOiBmdW5jdGlvbiBjbGVhclNlYXJjaENvbmRpdGlvbigpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLnNlYXJjaENvbmRpdGlvbikge1xuICAgICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbltrZXldLnZhbHVlID0gXCJcIjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb25bXCJzZWFyY2hJbkFMTFwiXS52YWx1ZSA9IFwi5ZCmXCI7XG4gICAgfSxcbiAgICBzZWxlY3Rpb25DaGFuZ2U6IGZ1bmN0aW9uIHNlbGVjdGlvbkNoYW5nZShzZWxlY3Rpb24pIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uUm93cyA9IHNlbGVjdGlvbjtcbiAgICB9LFxuICAgIHJlbG9hZERhdGE6IGZ1bmN0aW9uIHJlbG9hZERhdGEoKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUJpbmREYXRhQnlTZWFyY2goe1xuICAgICAgICB1cmw6IHRoaXMuYWNJbnRlcmZhY2UucmVsb2FkTGlzdERhdGEsXG4gICAgICAgIHBhZ2VOdW06IHRoaXMucGFnZU51bSxcbiAgICAgICAgcGFnZVNpemU6IHRoaXMucGFnZVNpemUsXG4gICAgICAgIHNlYXJjaENvbmRpdGlvbjogdGhpcy5zZWFyY2hDb25kaXRpb24sXG4gICAgICAgIHBhZ2VBcHBPYmo6IHRoaXMsXG4gICAgICAgIHRhYmxlTGlzdDogdGhpcyxcbiAgICAgICAgaWRGaWVsZDogdGhpcy5pZEZpZWxkTmFtZSxcbiAgICAgICAgYXV0b1NlbGVjdGVkT2xkUm93czogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3NGdW5jOiBudWxsLFxuICAgICAgICBsb2FkRGljdDogZmFsc2UsXG4gICAgICAgIGN1c3RQYXJhczoge31cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgY2hhbmdlUGFnZTogZnVuY3Rpb24gY2hhbmdlUGFnZShwYWdlTnVtKSB7XG4gICAgICB0aGlzLnBhZ2VOdW0gPSBwYWdlTnVtO1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgICB0aGlzLnNlbGVjdGlvblJvd3MgPSBudWxsO1xuICAgIH0sXG4gICAgc2VhcmNoOiBmdW5jdGlvbiBzZWFyY2goKSB7XG4gICAgICB0aGlzLnBhZ2VOdW0gPSAxO1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdDogZnVuY3Rpb24gYmVnaW5TZWxlY3QoKSB7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMuc2VsZWN0RGVwYXJ0bWVudFVzZXJNb2RlbERpYWxvZ1dyYXA7XG4gICAgICB2YXIgZGlhbG9nSGVpZ2h0ID0gNDYwO1xuXG4gICAgICBpZiAoUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgPiA3MDApIHtcbiAgICAgICAgZGlhbG9nSGVpZ2h0ID0gNjYwO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxpc3RIZWlnaHQgPSBkaWFsb2dIZWlnaHQgLSAyMzA7XG4gICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgd2lkdGg6IDk3MCxcbiAgICAgICAgaGVpZ2h0OiBkaWFsb2dIZWlnaHQsXG4gICAgICAgIHRpdGxlOiBcIumAieaLqemDqOmXqOS6uuWRmFwiXG4gICAgICB9KTtcbiAgICB9LFxuICAgIGNvbXBsZXRlZDogZnVuY3Rpb24gY29tcGxldGVkKCkge1xuICAgICAgY29uc29sZS5sb2codGhpcy5zZWxlY3Rpb25Sb3dzKTtcblxuICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUm93cykge1xuICAgICAgICB0aGlzLiRlbWl0KCdvbi1zZWxlY3RlZC1jb21wbGV0ZWQnLCB0aGlzLnNlbGVjdGlvblJvd3MpO1xuICAgICAgICB0aGlzLmhhbmRsZUNsb3NlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7flhYjpgInkuK3kurrlkZghXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5zZWxlY3REZXBhcnRtZW50VXNlck1vZGVsRGlhbG9nV3JhcCk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2IHJlZj1cXFwic2VsZWN0RGVwYXJ0bWVudFVzZXJNb2RlbERpYWxvZ1dyYXBcXFwiIGNsYXNzPVxcXCJjMS1zZWxlY3QtbW9kZWwtd3JhcCBnZW5lcmFsLWVkaXQtcGFnZS13cmFwXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LTJjb2x1bW5cXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxlZnQtb3V0ZXItd3JhcFxcXCIgc3R5bGU9XFxcIndpZHRoOiAxODBweDt0b3A6IDEwcHg7bGVmdDogMTBweDtib3R0b206IDU1cHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0LW9yZ2FuLXNpbmdsZS1jb21wIEBvbi1zZWxlY3RlZC1vcmdhbj1cXFwiY2hhbmdlT3JnYW5cXFwiIHJlZj1cXFwic2VsZWN0T3JnYW5Db21wXFxcIj48L3NlbGVjdC1vcmdhbi1zaW5nbGUtY29tcD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW5uZXItd3JhcFxcXCIgc3R5bGU9XFxcInBvc2l0aW9uOmFic29sdXRlO3RvcDogMzBweDtib3R0b206IDEwcHg7aGVpZ2h0OiBhdXRvO292ZXJmbG93OiBhdXRvXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIHJlZj1cXFwielRyZWVVTFxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInJpZ2h0LW91dGVyLXdyYXAgaXYtbGlzdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nOiAxMHB4O2xlZnQ6IDIwMHB4O3RvcDogMTBweDtyaWdodDogMTBweDtib3R0b206IDU1cHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LXNpbXBsZS1zZWFyY2gtd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XFxcImxzLXRhYmxlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiA4MHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwiXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDEwMHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwiXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDgwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogODVweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiA4MHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBjbGFzcz1cXFwibHMtdGFibGUtcm93XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTc1MjhcXHU2MjM3XFx1NTQwRFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJzZWFyY2hDb25kaXRpb24udXNlck5hbWUudmFsdWVcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTYyNEJcXHU2NzNBXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcInNlYXJjaENvbmRpdGlvbi51c2VyUGhvbmVOdW1iZXIudmFsdWVcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTUxNjhcXHU1QzQwXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB2LW1vZGVsPVxcXCJzZWFyY2hDb25kaXRpb24uc2VhcmNoSW5BTEwudmFsdWVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiXFx1NjYyRlxcXCI+XFx1NjYyRjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJcXHU1NDI2XFxcIj5cXHU1NDI2PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJzZWFyY2hcXFwiPjxJY29uIHR5cGU9XFxcImFuZHJvaWQtc2VhcmNoXFxcIj48L0ljb24+IFxcdTY3RTVcXHU4QkUyIDwvaS1idXR0b24+PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIDpoZWlnaHQ9XFxcImxpc3RIZWlnaHRcXFwiIHN0cmlwZSBib3JkZXIgOmNvbHVtbnM9XFxcImNvbHVtbnNDb25maWdcXFwiIDpkYXRhPVxcXCJ0YWJsZURhdGFcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiA6aGlnaGxpZ2h0LXJvdz1cXFwidHJ1ZVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQG9uLXNlbGVjdGlvbi1jaGFuZ2U9XFxcInNlbGVjdGlvbkNoYW5nZVxcXCI+PC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJmbG9hdDogcmlnaHQ7XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYWdlIEBvbi1jaGFuZ2U9XFxcImNoYW5nZVBhZ2VcXFwiIDpjdXJyZW50LnN5bmM9XFxcInBhZ2VOdW1cXFwiIDpwYWdlLXNpemU9XFxcInBhZ2VTaXplXFxcIiBzaG93LXRvdGFsXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dG90YWw9XFxcInBhZ2VUb3RhbFxcXCI+PC9wYWdlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLW91dGVyLXdyYXBcXFwiIHN0eWxlPVxcXCJib3R0b206IDEycHg7cmlnaHQ6IDEycHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1pbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcImNvbXBsZXRlZCgpXFxcIiBpY29uPVxcXCJtZC1jaGVja21hcmtcXFwiPlxcdTc4NkVcXHU4QkE0PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImhhbmRsZUNsb3NlKClcXFwiIGljb249XFxcIm1kLWNsb3NlXFxcIj5cXHU1MTczXFx1OTVFRDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInNlbGVjdC1tb2R1bGUtb2JqZWN0LWRpYWxvZ1wiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldERCTGlua0RhdGE6IFwiL1Jlc3QvU1NPL011L01lbnUvR2V0RnVsbERCTGlua1wiLFxuICAgICAgICBnZXRNb2R1bGVUcmVlRGF0YTogXCIvUmVzdC9TU08vTXUvTWVudS9HZXRNb3VsZFRyZWVEYXRhXCIsXG4gICAgICAgIHJlbG9hZExpc3REYXRhOiBcIi9SZXN0L1NTTy9NdS9NZW51L0dldFNlbGVjdE1vZHVsZU9iamVjdExpc3RCeU1vZHVsZUlkXCJcbiAgICAgIH0sXG4gICAgICBzZWxlY3RNb2R1bGVPYmplY3RUeXBlOiBcIlwiLFxuICAgICAgc2VsZWN0ZWREQkxpbmtJZDogXCJcIixcbiAgICAgIGRiTGlua0FycmF5OiBbXSxcbiAgICAgIHRyZWVJZEZpZWxkTmFtZTogXCJtb2R1bGVJZFwiLFxuICAgICAgdHJlZU9iajogbnVsbCxcbiAgICAgIHRyZWVTZWxlY3RlZE5vZGU6IG51bGwsXG4gICAgICB0cmVlU2V0dGluZzoge1xuICAgICAgICBhc3luYzoge1xuICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICB1cmw6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgbmFtZTogXCJtb2R1bGVUZXh0XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNpbXBsZURhdGE6IHtcbiAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGlkS2V5OiBcIm1vZHVsZUlkXCIsXG4gICAgICAgICAgICBwSWRLZXk6IFwibW9kdWxlUGFyZW50SWRcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzLmdldFpUcmVlT2JqKHRyZWVJZCkuX2hvc3Q7XG5cbiAgICAgICAgICAgIF9zZWxmLnRyZWVOb2RlU2VsZWN0ZWQoZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb25Bc3luY1N1Y2Nlc3M6IGZ1bmN0aW9uIG9uQXN5bmNTdWNjZXNzKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlLCBtc2cpIHt9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzZWxlY3RlZE1vZHVsZU9iamVjdDogbnVsbCxcbiAgICAgIGlkRmllbGROYW1lOiBcIklEXCIsXG4gICAgICBzZWFyY2hDb25kaXRpb246IHtcbiAgICAgICAgc2VsZWN0TW9kdWxlT2JqZWN0VHlwZToge1xuICAgICAgICAgIHZhbHVlOiBcIlwiLFxuICAgICAgICAgIHR5cGU6IFNlYXJjaFV0aWxpdHkuU2VhcmNoRmllbGRUeXBlLlN0cmluZ1R5cGVcbiAgICAgICAgfSxcbiAgICAgICAgc2VsZWN0TW9kdWxlSWQ6IHtcbiAgICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgICB0eXBlOiBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5TdHJpbmdUeXBlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICB0aXRsZTogJ+WQjeensCcsXG4gICAgICAgIGtleTogJ05BTUUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+Wkh+azqCcsXG4gICAgICAgIGtleTogJ0RFU0NSSVBUSU9OJyxcbiAgICAgICAgd2lkdGg6IDI0MCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH1dLFxuICAgICAgdGFibGVEYXRhOiBbXSxcbiAgICAgIHBhZ2VUb3RhbDogMCxcbiAgICAgIHBhZ2VTaXplOiAxMixcbiAgICAgIHBhZ2VOdW06IDEsXG4gICAgICBsaXN0SGVpZ2h0OiA1MTBcbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHRoaXMuYmluZERCTGluaygpO1xuICB9LFxuICBtZXRob2RzOiB7XG4gICAgYmluZERCTGluazogZnVuY3Rpb24gYmluZERCTGluaygpIHtcbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXREQkxpbmtEYXRhLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQuZGF0YSk7XG4gICAgICAgICAgdGhpcy5kYkxpbmtBcnJheSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIHZhciBvbGRTZWxlY3RlZE9yZ2FuSWQgPSBDb29raWVVdGlsaXR5LkdldENvb2tpZShcIlNNT0REQkxJTktJRFwiKTtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkREJMaW5rSWQgPSBvbGRTZWxlY3RlZE9yZ2FuSWQ7XG5cbiAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZERCTGlua0lkKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRUcmVlKHRoaXMuc2VsZWN0ZWREQkxpbmtJZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIGNoYW5nZURCTGluazogZnVuY3Rpb24gY2hhbmdlREJMaW5rKCkge1xuICAgICAgY29uc29sZS5sb2codGhpcy5zZWxlY3RlZERCTGlua0lkKTtcbiAgICAgIHRoaXMuaW5pdFRyZWUodGhpcy5zZWxlY3RlZERCTGlua0lkKTtcbiAgICAgIENvb2tpZVV0aWxpdHkuU2V0Q29va2llMU1vbnRoKFwiU01PRERCTElOS0lEXCIsIHRoaXMuc2VsZWN0ZWREQkxpbmtJZCk7XG4gICAgfSxcbiAgICBpbml0VHJlZTogZnVuY3Rpb24gaW5pdFRyZWUoc2VsZWN0ZWREQkxpbmtJZCkge1xuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldE1vZHVsZVRyZWVEYXRhLCB7XG4gICAgICAgIFwiZGJMaW5rSWRcIjogc2VsZWN0ZWREQkxpbmtJZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuXG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0LmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuZGF0YVtpXS5tb2R1bGVQYXJlbnRJZCAhPSBcIi0xXCIpIHtcbiAgICAgICAgICAgICAgcmVzdWx0LmRhdGFbaV0uaWNvbiA9IFwiLi4vLi4vLi4vVGhlbWVzL1BuZzE2WDE2L2xheW91dC1zaWRlYmFyLnBuZ1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuJHJlZnMuelRyZWVVTC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNlbGVjdC1tb2R1bGUtb2JqZWN0LWRpYWxvZy1cIiArIFN0cmluZ1V0aWxpdHkuR3VpZCgpKTtcbiAgICAgICAgICB0aGlzLnRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJCh0aGlzLiRyZWZzLnpUcmVlVUwpLCB0aGlzLnRyZWVTZXR0aW5nLCByZXN1bHQuZGF0YSk7XG4gICAgICAgICAgdGhpcy50cmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcbiAgICAgICAgICB0aGlzLnRyZWVPYmouX2hvc3QgPSB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge30pO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIHRyZWVOb2RlU2VsZWN0ZWQ6IGZ1bmN0aW9uIHRyZWVOb2RlU2VsZWN0ZWQoZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgIHRoaXMudHJlZVNlbGVjdGVkTm9kZSA9IHRyZWVOb2RlO1xuICAgICAgdGhpcy5wYWdlTnVtID0gMTtcbiAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLnNlbGVjdE1vZHVsZU9iamVjdFR5cGUudmFsdWUgPSB0aGlzLnNlbGVjdE1vZHVsZU9iamVjdFR5cGU7XG4gICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5zZWxlY3RNb2R1bGVJZC52YWx1ZSA9IHRyZWVOb2RlLm1vZHVsZUlkO1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSxcbiAgICBtb2R1bGVPYmplY3RDbGljazogZnVuY3Rpb24gbW9kdWxlT2JqZWN0Q2xpY2soZGF0YSwgaW5kZXgpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRNb2R1bGVPYmplY3QgPSBkYXRhO1xuICAgIH0sXG4gICAgcmVsb2FkRGF0YTogZnVuY3Rpb24gcmVsb2FkRGF0YSgpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlQmluZERhdGFCeVNlYXJjaCh7XG4gICAgICAgIHVybDogdGhpcy5hY0ludGVyZmFjZS5yZWxvYWRMaXN0RGF0YSxcbiAgICAgICAgcGFnZU51bTogdGhpcy5wYWdlTnVtLFxuICAgICAgICBwYWdlU2l6ZTogdGhpcy5wYWdlU2l6ZSxcbiAgICAgICAgc2VhcmNoQ29uZGl0aW9uOiB0aGlzLnNlYXJjaENvbmRpdGlvbixcbiAgICAgICAgcGFnZUFwcE9iajogdGhpcyxcbiAgICAgICAgdGFibGVMaXN0OiB0aGlzLFxuICAgICAgICBpZEZpZWxkOiB0aGlzLmlkRmllbGROYW1lLFxuICAgICAgICBhdXRvU2VsZWN0ZWRPbGRSb3dzOiBmYWxzZSxcbiAgICAgICAgc3VjY2Vzc0Z1bmM6IGZ1bmN0aW9uIHN1Y2Nlc3NGdW5jKHJlc3VsdCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgIH0sXG4gICAgICAgIGxvYWREaWN0OiBmYWxzZSxcbiAgICAgICAgY3VzdFBhcmFzOiB7fVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBjaGFuZ2VQYWdlOiBmdW5jdGlvbiBjaGFuZ2VQYWdlKHBhZ2VOdW0pIHtcbiAgICAgIHRoaXMucGFnZU51bSA9IHBhZ2VOdW07XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIHNlYXJjaDogZnVuY3Rpb24gc2VhcmNoKCkge1xuICAgICAgdGhpcy5wYWdlTnVtID0gMTtcbiAgICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICAgIH0sXG4gICAgYmVnaW5TZWxlY3Q6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0KHNlbGVjdE1vZHVsZU9iamVjdFR5cGUpIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5zZWxlY3RNb2R1bGVPYmplY3REaWFsb2dXcmFwO1xuICAgICAgdGhpcy5zZWxlY3RNb2R1bGVPYmplY3RUeXBlID0gc2VsZWN0TW9kdWxlT2JqZWN0VHlwZTtcbiAgICAgIHZhciBkaWFsb2dIZWlnaHQgPSA2NjA7XG4gICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgd2lkdGg6IDg3MCxcbiAgICAgICAgaGVpZ2h0OiBkaWFsb2dIZWlnaHQsXG4gICAgICAgIHRpdGxlOiBcIumAieaLqeWFs+iBlOWvueixoTFcIlxuICAgICAgfSk7XG4gICAgfSxcbiAgICBidWlsZERpc3BsYXlOYW1lOiBmdW5jdGlvbiBidWlsZERpc3BsYXlOYW1lKHNlbGVjdGVkTW9kdWxlT2JqZWN0KSB7XG4gICAgICB2YXIgdHh0ID0gXCLot6/lvoQ644CQXCIgKyBUcmVlVXRpbGl0eS5CdWlsZE5vZGVQYXRoTmFtZSh0aGlzLnRyZWVTZWxlY3RlZE5vZGUsIFwibW9kdWxlVGV4dFwiLCBzZWxlY3RlZE1vZHVsZU9iamVjdC5OQU1FICsgXCIoXCIgKyBzZWxlY3RlZE1vZHVsZU9iamVjdC5DT0RFICsgXCIpXCIpICsgXCLjgJFcIjtcblxuICAgICAgaWYgKHRoaXMuc2VsZWN0TW9kdWxlT2JqZWN0VHlwZSA9PSBcIldlYuaooeWdl+WIl+ihqFwiKSB7XG4gICAgICAgIHR4dCArPSBcIu+8jOaVsOaNrumbhjrvvIhcIiArIHNlbGVjdGVkTW9kdWxlT2JqZWN0LkxJU1RfREFUQVNFVF9OQU1FICsgXCLvvIlcIjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHR4dDtcbiAgICB9LFxuICAgIGNvbXBsZXRlZDogZnVuY3Rpb24gY29tcGxldGVkKCkge1xuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRNb2R1bGVPYmplY3QpIHtcbiAgICAgICAgdGhpcy4kZW1pdCgnb24tc2VsZWN0ZWQtY29tcGxldGVkJywgdGhpcy5zZWxlY3RlZE1vZHVsZU9iamVjdCwgdGhpcy5zZWxlY3RlZE1vZHVsZU9iamVjdC5JRCwgdGhpcy5idWlsZERpc3BsYXlOYW1lKHRoaXMuc2VsZWN0ZWRNb2R1bGVPYmplY3QpLCBKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcodGhpcy5zZWxlY3RlZE1vZHVsZU9iamVjdCkpO1xuICAgICAgICB0aGlzLmhhbmRsZUNsb3NlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7flhYjpgInmi6nnu5Hlrprlr7nosaEhXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5zZWxlY3RNb2R1bGVPYmplY3REaWFsb2dXcmFwKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXYgcmVmPVxcXCJzZWxlY3RNb2R1bGVPYmplY3REaWFsb2dXcmFwXFxcIiBjbGFzcz1cXFwiYzEtc2VsZWN0LW1vZGVsLXdyYXAgZ2VuZXJhbC1lZGl0LXBhZ2Utd3JhcFxcXCIgc3R5bGU9XFxcImRpc3BsYXk6IG5vbmVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGlzdC0yY29sdW1uXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsZWZ0LW91dGVyLXdyYXBcXFwiIHN0eWxlPVxcXCJ3aWR0aDogMjIwcHg7dG9wOiAxMHB4O2xlZnQ6IDEwcHg7Ym90dG9tOiA1NXB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktc2VsZWN0IEBvbi1jaGFuZ2U9XFxcImNoYW5nZURCTGlua1xcXCIgdi1tb2RlbD1cXFwic2VsZWN0ZWREQkxpbmtJZFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdi1mb3I9XFxcIml0ZW0gaW4gZGJMaW5rQXJyYXlcXFwiIDp2YWx1ZT1cXFwiaXRlbS5kYklkXFxcIiA6a2V5PVxcXCJpdGVtLmRiSWRcXFwiPnt7IGl0ZW0uZGJMaW5rTmFtZSB9fTwvaS1vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1zZWxlY3Q+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImlubmVyLXdyYXBcXFwiIHN0eWxlPVxcXCJwb3NpdGlvbjphYnNvbHV0ZTt0b3A6IDM0cHg7Ym90dG9tOiAxMHB4O2hlaWdodDogYXV0bztvdmVyZmxvdzogYXV0b1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCByZWY9XFxcInpUcmVlVUxcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyaWdodC1vdXRlci13cmFwIGl2LWxpc3QtcGFnZS13cmFwXFxcIiBzdHlsZT1cXFwicGFkZGluZzogMTBweDtsZWZ0OiAyNDBweDt0b3A6IDEwcHg7cmlnaHQ6IDEwcHg7Ym90dG9tOiA1NXB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgOmhlaWdodD1cXFwibGlzdEhlaWdodFxcXCIgc3RyaXBlIGJvcmRlciA6Y29sdW1ucz1cXFwiY29sdW1uc0NvbmZpZ1xcXCIgOmRhdGE9XFxcInRhYmxlRGF0YVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcIml2LWxpc3QtdGFibGVcXFwiIDpoaWdobGlnaHQtcm93PVxcXCJ0cnVlXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAb24tcm93LWNsaWNrPVxcXCJtb2R1bGVPYmplY3RDbGlja1xcXCI+PC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24tb3V0ZXItd3JhcFxcXCIgc3R5bGU9XFxcImJvdHRvbTogMTJweDtyaWdodDogMTJweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLWlubmVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcInByaW1hcnlcXFwiIEBjbGljaz1cXFwiY29tcGxldGVkKClcXFwiIGljb249XFxcIm1kLWNoZWNrbWFya1xcXCI+XFx1Nzg2RVxcdThCQTQ8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiaGFuZGxlQ2xvc2UoKVxcXCIgaWNvbj1cXFwibWQtY2xvc2VcXFwiPlxcdTUxNzNcXHU5NUVEPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwic2VsZWN0LW9yZ2FuLXVzZXItZGlhbG9nXCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZ2V0T3JnYW5UcmVlRGF0YTogXCIvUmVzdC9TU08vT3JnL09yZ2FuL0dldEZ1bGxPcmdhblwiLFxuICAgICAgICByZWxvYWRMaXN0RGF0YTogXCIvUmVzdC9TU08vUnVudGltZS9Vc2VyUnVudGltZS9HZXRVc2VyQnlPcmdhblNlYXJjaFwiXG4gICAgICB9LFxuICAgICAgdHJlZUlkRmllbGROYW1lOiBcIm9yZ2FuSWRcIixcbiAgICAgIHRyZWVPYmo6IG51bGwsXG4gICAgICB0cmVlU2VsZWN0ZWROb2RlOiBudWxsLFxuICAgICAgdHJlZVNldHRpbmc6IHtcbiAgICAgICAgYXN5bmM6IHtcbiAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgdXJsOiBcIlwiXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgIG5hbWU6IFwib3JnYW5OYW1lXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNpbXBsZURhdGE6IHtcbiAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGlkS2V5OiBcIm9yZ2FuSWRcIixcbiAgICAgICAgICAgIHBJZEtleTogXCJvcmdhblBhcmVudElkXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgdmFyIF9zZWxmID0gdGhpcy5nZXRaVHJlZU9iaih0cmVlSWQpLl9ob3N0O1xuXG4gICAgICAgICAgICBfc2VsZi50cmVlTm9kZVNlbGVjdGVkKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uQXN5bmNTdWNjZXNzOiBmdW5jdGlvbiBvbkFzeW5jU3VjY2VzcyhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSwgbXNnKSB7XG4gICAgICAgICAgICBhcHBMaXN0LnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGlkRmllbGROYW1lOiBcIkRVX0lEXCIsXG4gICAgICBzZWFyY2hDb25kaXRpb246IHtcbiAgICAgICAgdXNlck5hbWU6IHtcbiAgICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgICB0eXBlOiBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5MaWtlU3RyaW5nVHlwZVxuICAgICAgICB9LFxuICAgICAgICBhY2NvdW50OiB7XG4gICAgICAgICAgdmFsdWU6IFwiXCIsXG4gICAgICAgICAgdHlwZTogU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuTGlrZVN0cmluZ1R5cGVcbiAgICAgICAgfSxcbiAgICAgICAgdXNlclBob25lTnVtYmVyOiB7XG4gICAgICAgICAgdmFsdWU6IFwiXCIsXG4gICAgICAgICAgdHlwZTogU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuTGlrZVN0cmluZ1R5cGVcbiAgICAgICAgfSxcbiAgICAgICAgb3JnYW5JZDoge1xuICAgICAgICAgIHZhbHVlOiBcIlwiLFxuICAgICAgICAgIHR5cGU6IFNlYXJjaFV0aWxpdHkuU2VhcmNoRmllbGRUeXBlLlN0cmluZ1R5cGVcbiAgICAgICAgfSxcbiAgICAgICAgc2VhcmNoSW5BTEw6IHtcbiAgICAgICAgICB2YWx1ZTogXCLlkKZcIixcbiAgICAgICAgICB0eXBlOiBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5TdHJpbmdUeXBlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICB0eXBlOiAnc2VsZWN0aW9uJyxcbiAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfnlKjmiLflkI0nLFxuICAgICAgICBrZXk6ICdVU0VSX05BTUUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+aJi+acuuWPt+eggScsXG4gICAgICAgIGtleTogJ1VTRVJfUEhPTkVfTlVNQkVSJyxcbiAgICAgICAgd2lkdGg6IDE0MCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfpg6jpl6gnLFxuICAgICAgICBrZXk6ICdERVBUX05BTUUnLFxuICAgICAgICB3aWR0aDogMTQwLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+S4u+WxnicsXG4gICAgICAgIGtleTogJ0RVX0lTX01BSU4nLFxuICAgICAgICB3aWR0aDogNzAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9XSxcbiAgICAgIHRhYmxlRGF0YTogW10sXG4gICAgICBzZWxlY3Rpb25Sb3dzOiBudWxsLFxuICAgICAgcGFnZVRvdGFsOiAwLFxuICAgICAgcGFnZVNpemU6IDEyLFxuICAgICAgcGFnZU51bTogMSxcbiAgICAgIGxpc3RIZWlnaHQ6IDI3MFxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgbWV0aG9kczoge1xuICAgIGNoYW5nZU9yZ2FuOiBmdW5jdGlvbiBjaGFuZ2VPcmdhbihvcmdhbkRhdGEpIHtcbiAgICAgIENvb2tpZVV0aWxpdHkuU2V0Q29va2llMU1vbnRoKFwiRE1PUkdTSURcIiwgb3JnYW5EYXRhLm9yZ2FuSWQpO1xuICAgICAgdGhpcy5pbml0VHJlZShvcmdhbkRhdGEub3JnYW5JZCk7XG4gICAgICB0aGlzLmNsZWFyU2VhcmNoQ29uZGl0aW9uKCk7XG4gICAgICB0aGlzLnRhYmxlRGF0YSA9IFtdO1xuICAgIH0sXG4gICAgaW5pdFRyZWU6IGZ1bmN0aW9uIGluaXRUcmVlKCkge1xuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldE9yZ2FuVHJlZURhdGEsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIHRoaXMuJHJlZnMuelRyZWVVTC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNlbGVjdC1vcmdhbi11c2VyLWRpYWxvZy1cIiArIFN0cmluZ1V0aWxpdHkuR3VpZCgpKTtcbiAgICAgICAgICB0aGlzLnRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJCh0aGlzLiRyZWZzLnpUcmVlVUwpLCB0aGlzLnRyZWVTZXR0aW5nLCByZXN1bHQuZGF0YSk7XG4gICAgICAgICAgdGhpcy50cmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcbiAgICAgICAgICB0aGlzLnRyZWVPYmouX2hvc3QgPSB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge30pO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuICAgIHRyZWVOb2RlU2VsZWN0ZWQ6IGZ1bmN0aW9uIHRyZWVOb2RlU2VsZWN0ZWQoZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgIHRoaXMudHJlZVNlbGVjdGVkTm9kZSA9IHRyZWVOb2RlO1xuICAgICAgdGhpcy5zZWxlY3Rpb25Sb3dzID0gbnVsbDtcbiAgICAgIHRoaXMucGFnZU51bSA9IDE7XG4gICAgICB0aGlzLmNsZWFyU2VhcmNoQ29uZGl0aW9uKCk7XG4gICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5vcmdhbklkLnZhbHVlID0gdGhpcy50cmVlU2VsZWN0ZWROb2RlW3RoaXMudHJlZUlkRmllbGROYW1lXTtcbiAgICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICAgIH0sXG4gICAgY2xlYXJTZWFyY2hDb25kaXRpb246IGZ1bmN0aW9uIGNsZWFyU2VhcmNoQ29uZGl0aW9uKCkge1xuICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuc2VhcmNoQ29uZGl0aW9uKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uW2tleV0udmFsdWUgPSBcIlwiO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbltcInNlYXJjaEluQUxMXCJdLnZhbHVlID0gXCLlkKZcIjtcbiAgICB9LFxuICAgIHNlbGVjdGlvbkNoYW5nZTogZnVuY3Rpb24gc2VsZWN0aW9uQ2hhbmdlKHNlbGVjdGlvbikge1xuICAgICAgdGhpcy5zZWxlY3Rpb25Sb3dzID0gc2VsZWN0aW9uO1xuICAgIH0sXG4gICAgcmVsb2FkRGF0YTogZnVuY3Rpb24gcmVsb2FkRGF0YSgpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlQmluZERhdGFCeVNlYXJjaCh7XG4gICAgICAgIHVybDogdGhpcy5hY0ludGVyZmFjZS5yZWxvYWRMaXN0RGF0YSxcbiAgICAgICAgcGFnZU51bTogdGhpcy5wYWdlTnVtLFxuICAgICAgICBwYWdlU2l6ZTogdGhpcy5wYWdlU2l6ZSxcbiAgICAgICAgc2VhcmNoQ29uZGl0aW9uOiB0aGlzLnNlYXJjaENvbmRpdGlvbixcbiAgICAgICAgcGFnZUFwcE9iajogdGhpcyxcbiAgICAgICAgdGFibGVMaXN0OiB0aGlzLFxuICAgICAgICBpZEZpZWxkOiB0aGlzLmlkRmllbGROYW1lLFxuICAgICAgICBhdXRvU2VsZWN0ZWRPbGRSb3dzOiBmYWxzZSxcbiAgICAgICAgc3VjY2Vzc0Z1bmM6IG51bGwsXG4gICAgICAgIGxvYWREaWN0OiBmYWxzZSxcbiAgICAgICAgY3VzdFBhcmFzOiB7fVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBjaGFuZ2VQYWdlOiBmdW5jdGlvbiBjaGFuZ2VQYWdlKHBhZ2VOdW0pIHtcbiAgICAgIHRoaXMucGFnZU51bSA9IHBhZ2VOdW07XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICAgIHRoaXMuc2VsZWN0aW9uUm93cyA9IG51bGw7XG4gICAgfSxcbiAgICBzZWFyY2g6IGZ1bmN0aW9uIHNlYXJjaCgpIHtcbiAgICAgIHRoaXMucGFnZU51bSA9IDE7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIGJlZ2luU2VsZWN0OiBmdW5jdGlvbiBiZWdpblNlbGVjdCgpIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5zZWxlY3RPcmdhblVzZXJNb2RlbERpYWxvZ1dyYXA7XG4gICAgICB2YXIgZGlhbG9nSGVpZ2h0ID0gNDYwO1xuXG4gICAgICBpZiAoUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgPiA3MDApIHtcbiAgICAgICAgZGlhbG9nSGVpZ2h0ID0gNjYwO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxpc3RIZWlnaHQgPSBkaWFsb2dIZWlnaHQgLSAyMzA7XG4gICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgd2lkdGg6IDk3MCxcbiAgICAgICAgaGVpZ2h0OiBkaWFsb2dIZWlnaHQsXG4gICAgICAgIHRpdGxlOiBcIumAieaLqee7hOe7h+acuuaehOS6uuWRmFwiXG4gICAgICB9KTtcbiAgICAgIHRoaXMuaW5pdFRyZWUoKTtcbiAgICB9LFxuICAgIGNvbXBsZXRlZDogZnVuY3Rpb24gY29tcGxldGVkKCkge1xuICAgICAgY29uc29sZS5sb2codGhpcy5zZWxlY3Rpb25Sb3dzKTtcblxuICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUm93cykge1xuICAgICAgICB0aGlzLiRlbWl0KCdvbi1zZWxlY3RlZC1jb21wbGV0ZWQnLCB0aGlzLnNlbGVjdGlvblJvd3MpO1xuICAgICAgICB0aGlzLmhhbmRsZUNsb3NlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7flhYjpgInkuK3kurrlkZghXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5zZWxlY3RPcmdhblVzZXJNb2RlbERpYWxvZ1dyYXApO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdiByZWY9XFxcInNlbGVjdE9yZ2FuVXNlck1vZGVsRGlhbG9nV3JhcFxcXCIgY2xhc3M9XFxcImMxLXNlbGVjdC1tb2RlbC13cmFwIGdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpc3QtMmNvbHVtblxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGVmdC1vdXRlci13cmFwXFxcIiBzdHlsZT1cXFwid2lkdGg6IDI1MHB4O3RvcDogMTBweDtsZWZ0OiAxMHB4O2JvdHRvbTogNTVweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImlubmVyLXdyYXBcXFwiIHN0eWxlPVxcXCJwb3NpdGlvbjphYnNvbHV0ZTt0b3A6IDJweDtib3R0b206IDEwcHg7aGVpZ2h0OiBhdXRvO292ZXJmbG93OiBhdXRvXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIHJlZj1cXFwielRyZWVVTFxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInJpZ2h0LW91dGVyLXdyYXAgaXYtbGlzdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nOiAxMHB4O2xlZnQ6IDI3MHB4O3RvcDogMTBweDtyaWdodDogMTBweDtib3R0b206IDU1cHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LXNpbXBsZS1zZWFyY2gtd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XFxcImxzLXRhYmxlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiA4MHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwiXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDEwMHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwiXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDgwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogODVweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiA4MHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBjbGFzcz1cXFwibHMtdGFibGUtcm93XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTc1MjhcXHU2MjM3XFx1NTQwRFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJzZWFyY2hDb25kaXRpb24udXNlck5hbWUudmFsdWVcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTYyNEJcXHU2NzNBXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcInNlYXJjaENvbmRpdGlvbi51c2VyUGhvbmVOdW1iZXIudmFsdWVcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTUxNjhcXHU1QzQwXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB2LW1vZGVsPVxcXCJzZWFyY2hDb25kaXRpb24uc2VhcmNoSW5BTEwudmFsdWVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiXFx1NjYyRlxcXCI+XFx1NjYyRjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJcXHU1NDI2XFxcIj5cXHU1NDI2PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJzZWFyY2hcXFwiPjxJY29uIHR5cGU9XFxcImFuZHJvaWQtc2VhcmNoXFxcIj48L0ljb24+IFxcdTY3RTVcXHU4QkUyIDwvaS1idXR0b24+PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIDpoZWlnaHQ9XFxcImxpc3RIZWlnaHRcXFwiIHN0cmlwZSBib3JkZXIgOmNvbHVtbnM9XFxcImNvbHVtbnNDb25maWdcXFwiIDpkYXRhPVxcXCJ0YWJsZURhdGFcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiA6aGlnaGxpZ2h0LXJvdz1cXFwidHJ1ZVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQG9uLXNlbGVjdGlvbi1jaGFuZ2U9XFxcInNlbGVjdGlvbkNoYW5nZVxcXCI+PC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJmbG9hdDogcmlnaHQ7XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYWdlIEBvbi1jaGFuZ2U9XFxcImNoYW5nZVBhZ2VcXFwiIDpjdXJyZW50LnN5bmM9XFxcInBhZ2VOdW1cXFwiIDpwYWdlLXNpemU9XFxcInBhZ2VTaXplXFxcIiBzaG93LXRvdGFsXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dG90YWw9XFxcInBhZ2VUb3RhbFxcXCI+PC9wYWdlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLW91dGVyLXdyYXBcXFwiIHN0eWxlPVxcXCJib3R0b206IDEycHg7cmlnaHQ6IDEycHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1pbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcImNvbXBsZXRlZCgpXFxcIiBpY29uPVxcXCJtZC1jaGVja21hcmtcXFwiPlxcdTc4NkVcXHU4QkE0PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImhhbmRsZUNsb3NlKClcXFwiIGljb249XFxcIm1kLWNsb3NlXFxcIj5cXHU1MTczXFx1OTVFRDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInZpZXctYXV0aG9yaXR5LW93bmVyLWRpYWxvZ1wiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldE9iakF1dGhPd25lckRlc2M6IFwiL1Jlc3QvU1NPL0F1dGgvQXV0aG9yaXR5L0dldE9iakF1dGhPd25lckRlc2NcIlxuICAgICAgfSxcbiAgICAgIE9iakF1dGhPd25lckRlc2NEYXRhOiBbXVxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgbWV0aG9kczoge1xuICAgIHNob3dEaWFsb2c6IGZ1bmN0aW9uIHNob3dEaWFsb2coYXV0aE9iaklkLCB0aXRsZSkge1xuICAgICAgdmFyIGVsZW0gPSB0aGlzLiRyZWZzLnZpZXdBdXRob3JpdHlPd25lckRpYWxvZ1dyYXA7XG4gICAgICB2YXIgZGlhbG9nSGVpZ2h0ID0gNDYwO1xuXG4gICAgICBpZiAoUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgPiA3MDApIHtcbiAgICAgICAgZGlhbG9nSGVpZ2h0ID0gNjYwO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxpc3RIZWlnaHQgPSBkaWFsb2dIZWlnaHQgLSAyMzA7XG4gICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgd2lkdGg6IDk3MCxcbiAgICAgICAgaGVpZ2h0OiBkaWFsb2dIZWlnaHQsXG4gICAgICAgIHRpdGxlOiB0aXRsZVxuICAgICAgfSk7XG4gICAgICBBamF4VXRpbGl0eS5HZXQodGhpcy5hY0ludGVyZmFjZS5nZXRPYmpBdXRoT3duZXJEZXNjLCB7XG4gICAgICAgIGF1dGhPYmpJZDogYXV0aE9iaklkXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgdGhpcy5PYmpBdXRoT3duZXJEZXNjRGF0YSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXYgcmVmPVxcXCJ2aWV3QXV0aG9yaXR5T3duZXJEaWFsb2dXcmFwXFxcIiBjbGFzcz1cXFwiYzEtc2VsZWN0LW1vZGVsLXdyYXAgZ2VuZXJhbC1lZGl0LXBhZ2Utd3JhcFxcXCIgc3R5bGU9XFxcImRpc3BsYXk6IG5vbmVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiB2LWZvcj1cXFwiT2JqQXV0aE93bmVySXRlbSBpbiBPYmpBdXRoT3duZXJEZXNjRGF0YVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPERpdmlkZXI+e3tPYmpBdXRoT3duZXJJdGVtLlR5cGV9fVt7e09iakF1dGhPd25lckl0ZW0uTmFtZX19XTwvRGl2aWRlcj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VGFnIGNvbG9yPVxcXCJnZWVrYmx1ZVxcXCIgdi1mb3I9XFxcIihpbm5PYmosaW5kZXgpIGluIE9iakF1dGhPd25lckl0ZW0uRGF0YVxcXCIgOmtleT1cXFwiT2JqQXV0aE93bmVySXRlbS5LZXkraW5kZXhcXFwiPnt7aW5uT2JqLlBBUkVOVF9PUkdBTl9OQU1FfX0tPnt7aW5uT2JqLlVTRVJfT1JHQU5fTkFNRX19Ont7aW5uT2JqLlVTRVJfTkFNRX19PC9UYWc+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwic3NvLWFwcC1kZXRhaWwtZnJvbS1jb21wXCIsIHtcbiAgcHJvcHM6IFtcInN0YXR1c1wiLCBcImFwcElkXCIsIFwiaXNTdWJTeXN0ZW1cIl0sXG4gIHdhdGNoOiB7XG4gICAgYXBwSWQ6IGZ1bmN0aW9uIGFwcElkKG5ld1ZhbCkge1xuICAgICAgdGhpcy5hcHBFbnRpdHkuYXBwSWQgPSBuZXdWYWw7XG4gICAgfSxcbiAgICBzdGF0dXM6IGZ1bmN0aW9uIHN0YXR1cyhuZXdWYWwpIHtcbiAgICAgIHRoaXMuaW5uZXJTdGF0dXMgPSBuZXdWYWw7XG4gICAgfVxuICB9LFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBhcHBMb2dvVXJsOiBcIi9SZXN0L1NTTy9BcHAvQXBwbGljYXRpb24vR2V0QXBwTG9nb1wiLFxuICAgICAgICBnZXROZXdLZXlzOiBcIi9SZXN0L1NTTy9BcHAvQXBwbGljYXRpb24vR2V0TmV3S2V5c1wiXG4gICAgICB9LFxuICAgICAgYXBwRW50aXR5OiB7XG4gICAgICAgIGFwcElkOiBcIlwiLFxuICAgICAgICBhcHBDb2RlOiBcIlwiLFxuICAgICAgICBhcHBOYW1lOiBcIlwiLFxuICAgICAgICBhcHBQdWJsaWNLZXk6IFwiXCIsXG4gICAgICAgIGFwcFByaXZhdGVLZXk6IFwiXCIsXG4gICAgICAgIGFwcERvbWFpbjogXCJcIixcbiAgICAgICAgYXBwSW5kZXhVcmw6IFwiXCIsXG4gICAgICAgIGFwcE1haW5JbWFnZUlkOiBcIlwiLFxuICAgICAgICBhcHBUeXBlOiBcIlwiLFxuICAgICAgICBhcHBNYWluSWQ6IFwiXCIsXG4gICAgICAgIGFwcENhdGVnb3J5OiBcIndlYlwiLFxuICAgICAgICBhcHBEZXNjOiBcIlwiLFxuICAgICAgICBhcHBTdGF0dXM6IFwi5ZCv55SoXCIsXG4gICAgICAgIGFwcENyZWF0ZVRpbWU6IERhdGVVdGlsaXR5LkdldEN1cnJlbnREYXRhKClcbiAgICAgIH0sXG4gICAgICBydWxlVmFsaWRhdGU6IHtcbiAgICAgICAgYXBwQ29kZTogW3tcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiAn44CQ57O757uf57yW56CB44CR5LiN6IO95Li656m677yBJyxcbiAgICAgICAgICB0cmlnZ2VyOiAnYmx1cidcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIHBhdHRlcm46IC9eW0EtWmEtejAtOV0rJC8sXG4gICAgICAgICAgbWVzc2FnZTogJ+ivt+S9v+eUqOWtl+avjeaIluaVsOWtlycsXG4gICAgICAgICAgdHJpZ2dlcjogJ2JsdXInXG4gICAgICAgIH1dLFxuICAgICAgICBhcHBOYW1lOiBbe1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6ICfjgJDns7vnu5/lkI3np7DjgJHkuI3og73kuLrnqbrvvIEnLFxuICAgICAgICAgIHRyaWdnZXI6ICdibHVyJ1xuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIHN5c3RlbUxvZ29JbWFnZVNyYzogXCJcIixcbiAgICAgIGlubmVyU3RhdHVzOiBcImFkZFwiXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICBpZiAodGhpcy5pbm5lclN0YXR1cyA9PSBcImFkZFwiKSB7XG4gICAgICB0aGlzLnN5c3RlbUxvZ29JbWFnZVNyYyA9IEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKHRoaXMuYWNJbnRlcmZhY2UuYXBwTG9nb1VybCwge1xuICAgICAgICBmaWxlSWQ6IFwiZGVmYXVsdFNTT0FwcExvZ29JbWFnZVwiXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zeXN0ZW1Mb2dvSW1hZ2VTcmMgPSBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbih0aGlzLmFjSW50ZXJmYWNlLmFwcExvZ29VcmwsIHtcbiAgICAgICAgZmlsZUlkOiBcIlwiXG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICByZXNldEFwcEVudGl0eTogZnVuY3Rpb24gcmVzZXRBcHBFbnRpdHkoKSB7XG4gICAgICB0aGlzLmFwcEVudGl0eS5hcHBJZCA9IFwiXCI7XG4gICAgICB0aGlzLmFwcEVudGl0eS5hcHBDb2RlID0gXCJcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcE5hbWUgPSBcIlwiO1xuICAgICAgdGhpcy5hcHBFbnRpdHkuYXBwUHVibGljS2V5ID0gXCJcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcFByaXZhdGVLZXkgPSBcIlwiO1xuICAgICAgdGhpcy5hcHBFbnRpdHkuYXBwRG9tYWluID0gXCJcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcEluZGV4VXJsID0gXCJcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcE1haW5JbWFnZUlkID0gXCJcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcFR5cGUgPSBcIlwiO1xuICAgICAgdGhpcy5hcHBFbnRpdHkuYXBwTWFpbklkID0gXCJcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcENhdGVnb3J5ID0gXCJ3ZWJcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcERlc2MgPSBcIlwiO1xuICAgICAgdGhpcy5hcHBFbnRpdHkuYXBwU3RhdHVzID0gXCLlkK/nlKhcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcENyZWF0ZVRpbWUgPSBEYXRlVXRpbGl0eS5HZXRDdXJyZW50RGF0YSgpO1xuICAgIH0sXG4gICAgdXBsb2FkU3lzdGVtTG9nb0ltYWdlU3VjY2VzczogZnVuY3Rpb24gdXBsb2FkU3lzdGVtTG9nb0ltYWdlU3VjY2VzcyhyZXNwb25zZSwgZmlsZSwgZmlsZUxpc3QpIHtcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgIHZhciBkYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgdGhpcy5hcHBFbnRpdHkuYXBwTWFpbkltYWdlSWQgPSBkYXRhLmZpbGVJZDtcbiAgICAgICAgdGhpcy5zeXN0ZW1Mb2dvSW1hZ2VTcmMgPSBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbih0aGlzLmFjSW50ZXJmYWNlLmFwcExvZ29VcmwsIHtcbiAgICAgICAgICBmaWxlSWQ6IHRoaXMuYXBwRW50aXR5LmFwcE1haW5JbWFnZUlkXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydEVycm9yKHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydEVycm9ySWQsIHt9LCByZXNwb25zZS5tZXNzYWdlLCBudWxsLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldEFwcEVudGl0eTogZnVuY3Rpb24gZ2V0QXBwRW50aXR5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXBwRW50aXR5O1xuICAgIH0sXG4gICAgc2V0QXBwRW50aXR5OiBmdW5jdGlvbiBzZXRBcHBFbnRpdHkoYXBwRW50aXR5KSB7XG4gICAgICB0aGlzLmFwcEVudGl0eSA9IGFwcEVudGl0eTtcbiAgICB9LFxuICAgIGNyZWF0ZUtleXM6IGZ1bmN0aW9uIGNyZWF0ZUtleXMoKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0TmV3S2V5cywge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgX3NlbGYuYXBwRW50aXR5LmFwcFB1YmxpY0tleSA9IHJlc3VsdC5kYXRhLnB1YmxpY0tleTtcbiAgICAgICAgICBfc2VsZi5hcHBFbnRpdHkuYXBwUHJpdmF0ZUtleSA9IHJlc3VsdC5kYXRhLnByaXZhdGVLZXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwid2lkdGg6IDgwJTtmbG9hdDogbGVmdFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGktZm9ybSByZWY9XFxcImFwcEVudGl0eVxcXCIgOm1vZGVsPVxcXCJhcHBFbnRpdHlcXFwiIDpydWxlcz1cXFwicnVsZVZhbGlkYXRlXFxcIiA6bGFiZWwtd2lkdGg9XFxcIjEwMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XFxcIlxcdTdDRkJcXHU3RURGXFx1N0YxNlxcdTc4MDFcXHVGRjFBXFxcIiBwcm9wPVxcXCJhcHBDb2RlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyb3c+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktY29sIHNwYW49XFxcIjEwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBwcm9wPVxcXCJhcHBDb2RlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImFwcEVudGl0eS5hcHBDb2RlXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1jb2w+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktY29sIHNwYW49XFxcIjRcXFwiIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjogcmVkXFxcIj4qPC9zcGFuPiBcXHU3Q0ZCXFx1N0VERlxcdTU0MERcXHU3OUYwXFx1RkYxQTwvaS1jb2w+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktY29sIHNwYW49XFxcIjEwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBwcm9wPVxcXCJhcHBOYW1lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImFwcEVudGl0eS5hcHBOYW1lXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1jb2w+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Jvdz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XFxcIlxcdTU3REZcXHU1NDBEXFx1RkYxQVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cm93PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWNvbCBzcGFuPVxcXCIxMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImFwcEVudGl0eS5hcHBEb21haW5cXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWNvbCBzcGFuPVxcXCI0XFxcIiBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyXFxcIj5cXHU3Q0ZCXFx1N0VERlxcdTdDN0JcXHU1MjJCXFx1RkYxQTwvaS1jb2w+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktY29sIHNwYW49XFxcIjEwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvLWdyb3VwIHYtbW9kZWw9XFxcImFwcEVudGl0eS5hcHBDYXRlZ29yeVxcXCIgdHlwZT1cXFwiYnV0dG9uXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiYXBwXFxcIj5cXHU3OUZCXFx1NTJBOEFwcDwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIndlYlxcXCI+V2ViXFx1N0NGQlxcdTdFREY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3JhZGlvLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1jb2w+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Jvdz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XFxcIlxcdTUxNkNcXHU5NEE1XFx1RkYxQVxcXCIgdi1pZj1cXFwiaXNTdWJTeXN0ZW09PScwJ1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCBwbGFjZWhvbGRlcj1cXFwiXFx1OEJGN1xcdTUyMUJcXHU1RUZBXFx1NUJDNlxcdTk0QTVcXHU1QkY5LFxcdTc1MjhcXHU0RThFXFx1NjU3MFxcdTYzNkVcXHU3Njg0XFx1NTJBMFxcdTVCQzZcXHU0RjdGXFx1NzUyOFxcXCIgc2VhcmNoIGVudGVyLWJ1dHRvbj1cXFwiXFx1NTIxQlxcdTVFRkFcXHU1QkM2XFx1OTRBNVxcdTVCRjlcXFwiIHYtbW9kZWw9XFxcImFwcEVudGl0eS5hcHBQdWJsaWNLZXlcXFwiIEBvbi1zZWFyY2g9XFxcImNyZWF0ZUtleXMoKVxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cXFwiXFx1NzlDMVxcdTk0QTVcXHVGRjFBXFxcIiB2LWlmPVxcXCJpc1N1YlN5c3RlbT09MFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJhcHBFbnRpdHkuYXBwUHJpdmF0ZUtleVxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cXFwiXFx1NTIxQlxcdTVFRkFcXHU2NUY2XFx1OTVGNFxcdUZGMUFcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJvdz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1jb2wgc3Bhbj1cXFwiMTBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGF0ZS1waWNrZXIgdHlwZT1cXFwiZGF0ZVxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdTkwMDlcXHU2MkU5XFx1NTIxQlxcdTVFRkFcXHU2NUY2XFx1OTVGNFxcXCIgdi1tb2RlbD1cXFwiYXBwRW50aXR5LmFwcENyZWF0ZVRpbWVcXFwiIGRpc2FibGVkXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkb25seT48L2RhdGUtcGlja2VyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1jb2w+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktY29sIHNwYW49XFxcIjRcXFwiIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPlxcdTcyQjZcXHU2MDAxXFx1RkYxQTwvaS1jb2w+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktY29sIHNwYW49XFxcIjEwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB2LW1vZGVsPVxcXCJhcHBFbnRpdHkuYXBwU3RhdHVzXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIlxcdTU0MkZcXHU3NTI4XFxcIj5cXHU1NDJGXFx1NzUyODwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJcXHU3OTgxXFx1NzUyOFxcXCI+XFx1Nzk4MVxcdTc1Mjg8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yYWRpby1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWNvbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcm93PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cXFwiXFx1OUVEOFxcdThCQTRcXHU1NzMwXFx1NTc0MFxcdUZGMUFcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiYXBwRW50aXR5LmFwcEluZGV4VXJsXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU1OTA3XFx1NkNFOFxcdUZGMUFcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiYXBwRW50aXR5LmFwcERlc2NcXFwiIHR5cGU9XFxcInRleHRhcmVhXFxcIiA6YXV0b3NpemU9XFxcInttaW5Sb3dzOiAzLG1heFJvd3M6IDN9XFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1mb3JtPlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJ3aWR0aDogMTklO2Zsb2F0OiByaWdodFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwiYm9yZGVyLXJhZGl1czogOHB4O3RleHQtYWxpZ246IGNlbnRlcjttYXJnaW4tdG9wOiAwcHg7bWFyZ2luLWJvdHRvbTogMzBweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgOnNyYz1cXFwic3lzdGVtTG9nb0ltYWdlU3JjXFxcIiBzdHlsZT1cXFwid2lkdGg6IDExMHB4O2hlaWdodDogMTEwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHVwbG9hZCBzdHlsZT1cXFwibWFyZ2luOjEwcHggMTJweCAwIDIwcHhcXFwiIDpvbi1zdWNjZXNzPVxcXCJ1cGxvYWRTeXN0ZW1Mb2dvSW1hZ2VTdWNjZXNzXFxcIiA6ZGF0YT1cXFwiYXBwRW50aXR5XFxcIiBtdWx0aXBsZSB0eXBlPVxcXCJkcmFnXFxcIiBuYW1lPVxcXCJmaWxlXFxcIiBhY3Rpb249XFxcIi4uLy4uLy4uL1Jlc3QvU1NPL0FwcC9BcHBsaWNhdGlvbi9VcGxvYWRBcHBMb2dvXFxcIiBhY2NlcHQ9XFxcIi5wbmdcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJwYWRkaW5nOjEwcHggMHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpY29uIHR5cGU9XFxcImlvcy1jbG91ZC11cGxvYWRcXFwiIHNpemU9XFxcIjUyXFxcIiBzdHlsZT1cXFwiY29sb3I6ICMzMzk5ZmZcXFwiPjwvaWNvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPlxcdTRFMEFcXHU0RjIwXFx1N0NGQlxcdTdFREZMb2dvPC9wPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3VwbG9hZD5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJzc28tYXBwLWludGVyZmFjZS1saXN0LWNvbXBcIiwge1xuICBwcm9wczogW1wiaW50ZXJmYWNlQmVsb25nQXBwSWRcIl0sXG4gIHdhdGNoOiB7XG4gICAgaW50ZXJmYWNlQmVsb25nQXBwSWQ6IGZ1bmN0aW9uIGludGVyZmFjZUJlbG9uZ0FwcElkKG5ld1ZhbCkge1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlQmVsb25nQXBwSWQgPSBuZXdWYWw7XG4gICAgfVxuICB9LFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZGVsZXRlOiBcIi9QbGF0Rm9ybVJlc3QvU1NPL0FwcGxpY2F0aW9uL0RlbGV0ZUludGVyZmFjZVwiXG4gICAgICB9LFxuICAgICAgaW50ZXJmYWNlRW50aXR5OiB7XG4gICAgICAgIGludGVyZmFjZUlkOiBcIlwiLFxuICAgICAgICBpbnRlcmZhY2VCZWxvbmdBcHBJZDogXCJcIixcbiAgICAgICAgaW50ZXJmYWNlQ29kZTogXCJcIixcbiAgICAgICAgaW50ZXJmYWNlTmFtZTogXCJcIixcbiAgICAgICAgaW50ZXJmYWNlVXJsOiBcIlwiLFxuICAgICAgICBpbnRlcmZhY2VQYXJhczogXCJcIixcbiAgICAgICAgaW50ZXJmYWNlRm9ybWF0OiBcIlwiLFxuICAgICAgICBpbnRlcmZhY2VEZXNjOiBcIlwiLFxuICAgICAgICBpbnRlcmZhY2VPcmRlck51bTogXCJcIixcbiAgICAgICAgaW50ZXJmYWNlQ3JlYXRlVGltZTogRGF0ZVV0aWxpdHkuR2V0Q3VycmVudERhdGEoKSxcbiAgICAgICAgaW50ZXJmYWNlU3RhdHVzOiBcIuWQr+eUqFwiLFxuICAgICAgICBpbnRlcmZhY2VDcmVhdGVySWQ6IFwiXCIsXG4gICAgICAgIGludGVyZmFjZU9yZ2FuSWQ6IFwiXCJcbiAgICAgIH0sXG4gICAgICBsaXN0OiB7XG4gICAgICAgIGNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgICAgdHlwZTogJ3NlbGVjdGlvbicsXG4gICAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICAgIGFsaWduOiAnY2VudGVyJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgdGl0bGU6ICfmjqXlj6PnsbvlnosnLFxuICAgICAgICAgIGtleTogJ2ludGVyZmFjZUNvZGUnLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICAgIHdpZHRoOiAxMDBcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn5o6l5Y+j5ZCN56ewJyxcbiAgICAgICAgICBrZXk6ICdpbnRlcmZhY2VOYW1lJyxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgICB3aWR0aDogMjgwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+Wkh+azqCcsXG4gICAgICAgICAga2V5OiAnaW50ZXJmYWNlRGVzYycsXG4gICAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn5pON5L2cJyxcbiAgICAgICAgICBrZXk6ICdpbnRlcmZhY2VJZCcsXG4gICAgICAgICAgd2lkdGg6IDE0MCxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbi13cmFwXCJcbiAgICAgICAgICAgIH0sIFtMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkVkaXRCdXR0b24oaCwgcGFyYW1zLCBcImludGVyZmFjZUlkXCIsIF9zZWxmKSwgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVJbm5lckJ1dHRvbi5EZWxldGVCdXR0b24oaCwgcGFyYW1zLCBcImludGVyZmFjZUlkXCIsIF9zZWxmKV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfV0sXG4gICAgICAgIHRhYmxlRGF0YTogW11cbiAgICAgIH0sXG4gICAgICBpbm5lclN0YXR1czogXCJhZGRcIlxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgbWV0aG9kczoge1xuICAgIHJlc2V0TGlzdERhdGE6IGZ1bmN0aW9uIHJlc2V0TGlzdERhdGEoKSB7XG4gICAgICB0aGlzLmxpc3QudGFibGVEYXRhID0gW107XG4gICAgfSxcbiAgICBhZGRJbnRlcmZhY2U6IGZ1bmN0aW9uIGFkZEludGVyZmFjZSgpIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5zc29BcHBJbnRlcmZhY2VFZGl0TW9kZWxEaWFsb2dXcmFwO1xuICAgICAgdGhpcy5pbm5lclN0YXR1cyA9PSBcImFkZFwiO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlSWQgPSBcIlwiO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlQmVsb25nQXBwSWQgPSB0aGlzLmludGVyZmFjZUJlbG9uZ0FwcElkO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlQ29kZSA9IFwiXCI7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VOYW1lID0gXCJcIjtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZVVybCA9IFwiXCI7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VQYXJhcyA9IFwiXCI7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VGb3JtYXQgPSBcIlwiO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlRGVzYyA9IFwiXCI7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VPcmRlck51bSA9IFwiXCI7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VDcmVhdGVUaW1lID0gRGF0ZVV0aWxpdHkuR2V0Q3VycmVudERhdGEoKTtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZVN0YXR1cyA9IFwi5ZCv55SoXCI7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VDcmVhdGVySWQgPSBcIlwiO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlT3JnYW5JZCA9IFwiXCI7XG4gICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgd2lkdGg6IDU3MCxcbiAgICAgICAgaGVpZ2h0OiAzMzAsXG4gICAgICAgIHRpdGxlOiBcIuaOpeWPo+iuvue9rlwiXG4gICAgICB9KTtcbiAgICB9LFxuICAgIGhhbmRsZUNsb3NlOiBmdW5jdGlvbiBoYW5kbGVDbG9zZSgpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2dFbGVtKHRoaXMuJHJlZnMuc3NvQXBwSW50ZXJmYWNlRWRpdE1vZGVsRGlhbG9nV3JhcCk7XG4gICAgfSxcbiAgICBzYXZlSW50ZXJmYWNlRWRpdDogZnVuY3Rpb24gc2F2ZUludGVyZmFjZUVkaXQoKSB7XG4gICAgICBpZiAodGhpcy5pbm5lclN0YXR1cyA9PSBcImFkZFwiKSB7XG4gICAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUlkID0gU3RyaW5nVXRpbGl0eS5HdWlkKCk7XG4gICAgICAgIHRoaXMubGlzdC50YWJsZURhdGEucHVzaChKc29uVXRpbGl0eS5DbG9uZVNpbXBsZSh0aGlzLmludGVyZmFjZUVudGl0eSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpc3QudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHRoaXMubGlzdC50YWJsZURhdGFbaV0uaW50ZXJmYWNlSWQgPT0gdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlSWQpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdC50YWJsZURhdGFbaV0uaW50ZXJmYWNlQ29kZSA9IHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUNvZGU7XG4gICAgICAgICAgICB0aGlzLmxpc3QudGFibGVEYXRhW2ldLmludGVyZmFjZU5hbWUgPSB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VOYW1lO1xuICAgICAgICAgICAgdGhpcy5saXN0LnRhYmxlRGF0YVtpXS5pbnRlcmZhY2VVcmwgPSB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VVcmw7XG4gICAgICAgICAgICB0aGlzLmxpc3QudGFibGVEYXRhW2ldLmludGVyZmFjZVBhcmFzID0gdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlUGFyYXM7XG4gICAgICAgICAgICB0aGlzLmxpc3QudGFibGVEYXRhW2ldLmludGVyZmFjZUZvcm1hdCA9IHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUZvcm1hdDtcbiAgICAgICAgICAgIHRoaXMubGlzdC50YWJsZURhdGFbaV0uaW50ZXJmYWNlRGVzYyA9IHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZURlc2M7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICAgIH0sXG4gICAgY2hhbmdlSW50ZXJmYWNlQ29kZTogZnVuY3Rpb24gY2hhbmdlSW50ZXJmYWNlQ29kZSh2YWx1ZSkge1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlQ29kZSA9IHZhbHVlO1xuICAgIH0sXG4gICAgZ2V0SW50ZXJmYWNlTGlzdERhdGE6IGZ1bmN0aW9uIGdldEludGVyZmFjZUxpc3REYXRhKCkge1xuICAgICAgcmV0dXJuIHRoaXMubGlzdC50YWJsZURhdGE7XG4gICAgfSxcbiAgICBzZXRJbnRlcmZhY2VMaXN0RGF0YTogZnVuY3Rpb24gc2V0SW50ZXJmYWNlTGlzdERhdGEoZGF0YSkge1xuICAgICAgdGhpcy5saXN0LnRhYmxlRGF0YSA9IGRhdGE7XG4gICAgfSxcbiAgICBlZGl0OiBmdW5jdGlvbiBlZGl0KGludGVyZmFjZUlkLCBwYXJhbXMpIHtcbiAgICAgIHRoaXMuaW5uZXJTdGF0dXMgPSBcInVwZGF0ZVwiO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlSWQgPSBwYXJhbXMucm93LmludGVyZmFjZUlkO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlQ29kZSA9IHBhcmFtcy5yb3cuaW50ZXJmYWNlQ29kZTtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZU5hbWUgPSBwYXJhbXMucm93LmludGVyZmFjZU5hbWU7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VVcmwgPSBwYXJhbXMucm93LmludGVyZmFjZVVybDtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZVBhcmFzID0gcGFyYW1zLnJvdy5pbnRlcmZhY2VQYXJhcztcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUZvcm1hdCA9IHBhcmFtcy5yb3cuaW50ZXJmYWNlRm9ybWF0O1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlRGVzYyA9IHBhcmFtcy5yb3cuaW50ZXJmYWNlRGVzYztcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZU9yZGVyTnVtID0gcGFyYW1zLnJvdy5pbnRlcmZhY2VPcmRlck51bTtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUNyZWF0ZVRpbWUgPSBwYXJhbXMucm93LmludGVyZmFjZUNyZWF0ZVRpbWU7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VTdGF0dXMgPSBwYXJhbXMucm93LmludGVyZmFjZVN0YXR1cztcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUNyZWF0ZXJJZCA9IHBhcmFtcy5yb3cuaW50ZXJmYWNlQ3JlYXRlcklkO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlT3JnYW5JZCA9IHBhcmFtcy5yb3cuaW50ZXJmYWNlT3JnYW5JZDtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUJlbG9uZ0FwcElkID0gcGFyYW1zLnJvdy5pbnRlcmZhY2VCZWxvbmdBcHBJZDtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5zc29BcHBJbnRlcmZhY2VFZGl0TW9kZWxEaWFsb2dXcmFwO1xuICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHdpZHRoOiA1NzAsXG4gICAgICAgIGhlaWdodDogMzMwLFxuICAgICAgICB0aXRsZTogXCLmjqXlj6Porr7nva5cIlxuICAgICAgfSk7XG4gICAgfSxcbiAgICBkZWw6IGZ1bmN0aW9uIGRlbChpbnRlcmZhY2VJZCwgcGFyYW1zKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGlzdC50YWJsZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMubGlzdC50YWJsZURhdGFbaV0uaW50ZXJmYWNlSWQgPT0gaW50ZXJmYWNlSWQpIHtcbiAgICAgICAgICBfc2VsZi5saXN0LnRhYmxlRGF0YS5zcGxpY2UoaSwgMSk7XG5cbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkNvbmZpcm0od2luZG93LCBcIuehruiupOimgeWIoOmZpOivpeaOpeWPo+WQl++8n1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBBamF4VXRpbGl0eS5EZWxldGUoX3NlbGYuYWNJbnRlcmZhY2UuZGVsZXRlLCB7XG4gICAgICAgICAgICAgIFwiaW50ZXJmYWNlSWRcIjogaW50ZXJmYWNlSWRcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7fSBlbHNlIHtcbiAgICAgICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdiBjbGFzcz1cXFwiaXYtbGlzdC1wYWdlLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiByZWY9XFxcInNzb0FwcEludGVyZmFjZUVkaXRNb2RlbERpYWxvZ1dyYXBcXFwiIGNsYXNzPVxcXCJnZW5lcmFsLWVkaXQtcGFnZS13cmFwXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZTttYXJnaW4tdG9wOiAwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLWZvcm0gcmVmPVxcXCJpbnRlcmZhY2VFbnRpdHlcXFwiIDptb2RlbD1cXFwiaW50ZXJmYWNlRW50aXR5XFxcIiA6bGFiZWwtd2lkdGg9XFxcIjEzMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206IDJweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzbG90PVxcXCJsYWJlbFxcXCI+PHNwYW4gc3R5bGU9XFxcImNvbG9yOiByZWRcXFwiPio8L3NwYW4+Jm5ic3A7XFx1NjNBNVxcdTUzRTNcXHU3QzdCXFx1NTc4QlxcdUZGMUE8L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJpbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlQ29kZVxcXCIgc2l6ZT1cXFwic21hbGxcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxTZWxlY3Qgc2xvdD1cXFwiYXBwZW5kXFxcIiBzdHlsZT1cXFwid2lkdGg6IDkwcHhcXFwiIEBvbi1jaGFuZ2U9XFxcImNoYW5nZUludGVyZmFjZUNvZGVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8T3B0aW9uIHZhbHVlPVxcXCJcXHU3NjdCXFx1NUY1NVxcdTYzQTVcXHU1M0UzXFxcIj5cXHU3NjdCXFx1NUY1NVxcdTYzQTVcXHU1M0UzPC9PcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxPcHRpb24gdmFsdWU9XFxcIlxcdTUxNzZcXHU0RUQ2XFxcIj5cXHU1MTc2XFx1NEVENjwvT3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvU2VsZWN0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTogMnB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHNsb3Q9XFxcImxhYmVsXFxcIj48c3BhbiBzdHlsZT1cXFwiY29sb3I6IHJlZFxcXCI+Kjwvc3Bhbj4mbmJzcDtcXHU2M0E1XFx1NTNFM1xcdTU0MERcXHU3OUYwXFx1RkYxQTwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VOYW1lXFxcIiBzaXplPVxcXCJzbWFsbFxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cXFwiXFx1NjNBNVxcdTUzRTNcXHU1NzMwXFx1NTc0MFxcdUZGMUFcXFwiIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiAycHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZVVybFxcXCIgc2l6ZT1cXFwic21hbGxcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XFxcIlxcdTUzQzJcXHU2NTcwXFx1RkYxQVxcXCIgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206IDJweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJpbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlUGFyYXNcXFwiIHR5cGU9XFxcInRleHRhcmVhXFxcIiA6YXV0b3NpemU9XFxcInttaW5Sb3dzOiAyLG1heFJvd3M6IDJ9XFxcIiBzaXplPVxcXCJzbWFsbFxcXCI+PC9pLWlucHV0PiAgICBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XFxcIlxcdTY4M0NcXHU1RjBGXFx1NTMxNlxcdTY1QjlcXHU2Q0Q1XFx1RkYxQVxcXCIgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206IDJweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJpbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlRm9ybWF0XFxcIiBzaXplPVxcXCJzbWFsbFxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cXFwiXFx1NTkwN1xcdTZDRThcXHVGRjFBXFxcIiBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTogMnB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VEZXNjXFxcIiBzaXplPVxcXCJzbWFsbFxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2ktZm9ybT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24tb3V0ZXItd3JhcFxcXCIgc3R5bGU9XFxcIm1hcmdpbi1sZWZ0OiA4cHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24taW5uZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwIHNpemU9XFxcInNtYWxsXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJzYXZlSW50ZXJmYWNlRWRpdCgnaW50ZXJmYWNlRW50aXR5JylcXFwiIGljb249XFxcIm1kLWNoZWNrbWFya1xcXCI+PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVxcXCJoYW5kbGVDbG9zZSgpXFxcIiBpY29uPVxcXCJtZC1jbG9zZVxcXCI+PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cXFwibGlzdC1idXR0b24td3JhcFxcXCIgY2xhc3M9XFxcImxpc3QtYnV0dG9uLW91dGVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpc3QtYnV0dG9uLWlubmVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uR3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gIHR5cGU9XFxcInN1Y2Nlc3NcXFwiIEBjbGljaz1cXFwiYWRkSW50ZXJmYWNlKClcXFwiIGljb249XFxcIm1kLWFkZFxcXCI+XFx1NjVCMFxcdTU4OUU8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbkdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcImNsZWFyOiBib3RoXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgOmhlaWdodD1cXFwibGlzdC5saXN0SGVpZ2h0XFxcIiBzdHJpcGUgYm9yZGVyIDpjb2x1bW5zPVxcXCJsaXN0LmNvbHVtbnNDb25maWdcXFwiIDpkYXRhPVxcXCJsaXN0LnRhYmxlRGF0YVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcIml2LWxpc3QtdGFibGVcXFwiIDpoaWdobGlnaHQtcm93PVxcXCJ0cnVlXFxcIj48L2ktdGFibGU+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInNzby1hcHAtc3ViLXN5c3RlbS1saXN0LWNvbXBcIiwge1xuICBwcm9wczogW1wic3RhdHVzXCIsIFwiYmVsb25nQXBwSWRcIl0sXG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIHNhdmVTdWJBcHBVcmw6IFwiL1BsYXRGb3JtUmVzdC9TU08vQXBwbGljYXRpb24vU2F2ZVN1YkFwcFwiLFxuICAgICAgICByZWxvYWREYXRhOiBcIi9QbGF0Rm9ybVJlc3QvU1NPL0FwcGxpY2F0aW9uL0dldEFsbFN1YlNzb0FwcFwiLFxuICAgICAgICBhcHBMb2dvVXJsOiBcIi9QbGF0Rm9ybVJlc3QvU1NPL0FwcGxpY2F0aW9uL0dldEFwcExvZ29cIixcbiAgICAgICAgZGVsZXRlOiBcIi9QbGF0Rm9ybVJlc3QvU1NPL0FwcGxpY2F0aW9uL0RlbGV0ZVwiLFxuICAgICAgICBnZXREYXRhVXJsOiBcIi9QbGF0Rm9ybVJlc3QvU1NPL0FwcGxpY2F0aW9uL0dldEFwcFZvXCJcbiAgICAgIH0sXG4gICAgICBhcHBMaXN0OiBbXSxcbiAgICAgIGlubmVyRWRpdE1vZGVsRGlhbG9nU3RhdHVzOiBcImFkZFwiXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGFkZEludGVncmF0ZWRTeXN0ZW06IGZ1bmN0aW9uIGFkZEludGVncmF0ZWRTeXN0ZW0oKSB7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMuc3NvQXBwU3ViU3lzdGVtRWRpdE1vZGVsRGlhbG9nV3JhcDtcbiAgICAgIHRoaXMuJHJlZnMuc3ViQXBwRGV0YWlsRnJvbUNvbXAucmVzZXRBcHBFbnRpdHkoKTtcbiAgICAgIHRoaXMuJHJlZnMuc3ViQXBwSW50ZXJmYWNlTGlzdENvbXAucmVzZXRMaXN0RGF0YSgpO1xuICAgICAgdGhpcy5pbm5lckVkaXRNb2RlbERpYWxvZ1N0YXR1cyA9IFwiYWRkXCI7XG4gICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgd2lkdGg6IDkwMCxcbiAgICAgICAgaGVpZ2h0OiA1MDAsXG4gICAgICAgIHRpdGxlOiBcIuWtkOezu+e7n+iuvue9rlwiXG4gICAgICB9KTtcbiAgICB9LFxuICAgIHNhdmVTdWJTeXN0ZW1TZXR0aW5nOiBmdW5jdGlvbiBzYXZlU3ViU3lzdGVtU2V0dGluZygpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIHZhciBzc29BcHBFbnRpdHkgPSB0aGlzLiRyZWZzLnN1YkFwcERldGFpbEZyb21Db21wLmdldEFwcEVudGl0eSgpO1xuICAgICAgdmFyIHNzb0FwcEludGVyZmFjZUVudGl0eUxpc3QgPSB0aGlzLiRyZWZzLnN1YkFwcEludGVyZmFjZUxpc3RDb21wLmdldEludGVyZmFjZUxpc3REYXRhKCk7XG4gICAgICBzc29BcHBFbnRpdHkuYXBwTWFpbklkID0gdGhpcy5iZWxvbmdBcHBJZDtcblxuICAgICAgaWYgKHRoaXMuaW5uZXJFZGl0TW9kZWxEaWFsb2dTdGF0dXMgPT0gXCJhZGRcIikge1xuICAgICAgICBzc29BcHBFbnRpdHkuYXBwSWQgPSBTdHJpbmdVdGlsaXR5Lkd1aWQoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNzb0FwcEludGVyZmFjZUVudGl0eUxpc3QpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzc29BcHBJbnRlcmZhY2VFbnRpdHlMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgc3NvQXBwSW50ZXJmYWNlRW50aXR5TGlzdFtpXS5pbnRlcmZhY2VCZWxvbmdBcHBJZCA9IHNzb0FwcEVudGl0eS5hcHBJZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgdm8gPSB7XG4gICAgICAgIFwic3NvQXBwRW50aXR5XCI6IHNzb0FwcEVudGl0eSxcbiAgICAgICAgXCJzc29BcHBJbnRlcmZhY2VFbnRpdHlMaXN0XCI6IHNzb0FwcEludGVyZmFjZUVudGl0eUxpc3RcbiAgICAgIH07XG4gICAgICB2YXIgc2VuZERhdGEgPSBKU09OLnN0cmluZ2lmeSh2byk7XG4gICAgICBBamF4VXRpbGl0eS5Qb3N0UmVxdWVzdEJvZHkodGhpcy5hY0ludGVyZmFjZS5zYXZlU3ViQXBwVXJsLCBzZW5kRGF0YSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF9zZWxmLnJlbG9hZERhdGEoKTtcblxuICAgICAgICAgICAgX3NlbGYuaGFuZGxlQ2xvc2UoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCBcImpzb25cIik7XG4gICAgfSxcbiAgICBoYW5kbGVDbG9zZTogZnVuY3Rpb24gaGFuZGxlQ2xvc2UoKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nRWxlbSh0aGlzLiRyZWZzLnNzb0FwcFN1YlN5c3RlbUVkaXRNb2RlbERpYWxvZ1dyYXApO1xuICAgIH0sXG4gICAgcmVsb2FkRGF0YTogZnVuY3Rpb24gcmVsb2FkRGF0YSgpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5yZWxvYWREYXRhLCB7XG4gICAgICAgIGFwcElkOiBfc2VsZi5iZWxvbmdBcHBJZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBfc2VsZi5hcHBMaXN0ID0gcmVzdWx0LmRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0sXG4gICAgYnVpbGRMb2dvVXJsOiBmdW5jdGlvbiBidWlsZExvZ29VcmwoYXBwKSB7XG4gICAgICBpZiAoYXBwLmFwcE1haW5JbWFnZUlkID09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuIEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKHRoaXMuYWNJbnRlcmZhY2UuYXBwTG9nb1VybCwge1xuICAgICAgICAgIGZpbGVJZDogXCJkZWZhdWx0U1NPQXBwTG9nb0ltYWdlXCJcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24odGhpcy5hY0ludGVyZmFjZS5hcHBMb2dvVXJsLCB7XG4gICAgICAgICAgZmlsZUlkOiBhcHAuYXBwTWFpbkltYWdlSWRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBzZXR0aW5nQXBwOiBmdW5jdGlvbiBzZXR0aW5nQXBwKGFwcCkge1xuICAgICAgdmFyIGVsZW0gPSB0aGlzLiRyZWZzLnNzb0FwcFN1YlN5c3RlbUVkaXRNb2RlbERpYWxvZ1dyYXA7XG4gICAgICB0aGlzLmlubmVyRWRpdE1vZGVsRGlhbG9nU3RhdHVzID0gXCJ1cGRhdGVcIjtcblxuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldERhdGFVcmwsIHtcbiAgICAgICAgYXBwSWQ6IGFwcC5hcHBJZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuXG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIF9zZWxmLiRyZWZzLnN1YkFwcERldGFpbEZyb21Db21wLnNldEFwcEVudGl0eShyZXN1bHQuZGF0YS5zc29BcHBFbnRpdHkpO1xuXG4gICAgICAgICAgX3NlbGYuJHJlZnMuc3ViQXBwSW50ZXJmYWNlTGlzdENvbXAuc2V0SW50ZXJmYWNlTGlzdERhdGEocmVzdWx0LmRhdGEuc3NvQXBwSW50ZXJmYWNlRW50aXR5TGlzdCk7XG5cbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgICAgICB3aWR0aDogOTAwLFxuICAgICAgICAgICAgaGVpZ2h0OiA1MDAsXG4gICAgICAgICAgICB0aXRsZTogXCLlrZDns7vnu5/orr7nva5cIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9LFxuICAgIHJlbW92ZUFwcDogZnVuY3Rpb24gcmVtb3ZlQXBwKGFwcCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgRGlhbG9nVXRpbGl0eS5Db25maXJtKHdpbmRvdywgXCLnoa7orqTopoHms6jplIDns7vnu59bXCIgKyBhcHAuYXBwTmFtZSArIFwiXeWQl++8n1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIEFqYXhVdGlsaXR5LkRlbGV0ZShfc2VsZi5hY0ludGVyZmFjZS5kZWxldGUsIHtcbiAgICAgICAgICBhcHBJZDogYXBwLmFwcElkXG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBfc2VsZi5yZWxvYWREYXRhKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIFwianNvblwiKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgcmVmPVxcXCJzc29BcHBTdWJTeXN0ZW1FZGl0TW9kZWxEaWFsb2dXcmFwXFxcIiBjbGFzcz1cXFwiZ2VuZXJhbC1lZGl0LXBhZ2Utd3JhcFxcXCIgc3R5bGU9XFxcImRpc3BsYXk6IG5vbmU7bWFyZ2luLXRvcDogMHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGFicz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYi1wYW5lIGxhYmVsPVxcXCJcXHU3Q0ZCXFx1N0VERlxcdThCQkVcXHU3RjZFXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzc28tYXBwLWRldGFpbC1mcm9tLWNvbXAgcmVmPVxcXCJzdWJBcHBEZXRhaWxGcm9tQ29tcFxcXCIgOmlzLXN1Yi1zeXN0ZW09XFxcInRydWVcXFwiIDpzdGF0dXM9XFxcImlubmVyRWRpdE1vZGVsRGlhbG9nU3RhdHVzXFxcIj48L3Nzby1hcHAtZGV0YWlsLWZyb20tY29tcD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWItcGFuZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYi1wYW5lIGxhYmVsPVxcXCJcXHU2M0E1XFx1NTNFM1xcdThCQkVcXHU3RjZFXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzc28tYXBwLWludGVyZmFjZS1saXN0LWNvbXAgcmVmPVxcXCJzdWJBcHBJbnRlcmZhY2VMaXN0Q29tcFxcXCI+PC9zc28tYXBwLWludGVyZmFjZS1saXN0LWNvbXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFiLXBhbmU+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJzPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1vdXRlci13cmFwXFxcIiBzdHlsZT1cXFwibWFyZ2luLXJpZ2h0OiAxMHB4O21hcmdpbi1ib3R0b206IDEwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24taW5uZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiB2LWlmPVxcXCJzdGF0dXMhPSd2aWV3J1xcXCIgQGNsaWNrPVxcXCJzYXZlU3ViU3lzdGVtU2V0dGluZygpXFxcIiBpY29uPVxcXCJtZC1jaGVja21hcmtcXFwiPlxcdTRGRERcXHU1QjU4XFx1NUI1MFxcdTdDRkJcXHU3RURGXFx1OEJCRVxcdTdGNkU8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB2LWlmPVxcXCJzdGF0dXMhPSd2aWV3J1xcXCIgQGNsaWNrPVxcXCJoYW5kbGVDbG9zZSgpXFxcIiBpY29uPVxcXCJtZC1jbG9zZVxcXCI+XFx1NTE3M1xcdTk1RUQ8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhcHBzLW1hbmFnZXItb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYXBwcy1vdXRlci13cmFwXFxcIiByZWY9XFxcImFwcHNPdXRlcldyYXBcXFwiIHYtaWY9XFxcInN0YXR1cyE9J2FkZCdcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2ICB2LWZvcj1cXFwiYXBwIGluIGFwcExpc3RcXFwiIGNsYXNzPVxcXCJhcHAtb3V0ZXItd3JhcCBhcHAtb3V0ZXItd3JhcC1zdWItc3lzdGVtXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRpdGxlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57e2FwcC5hcHBOYW1lfX08L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbnRlbnRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIm1haW5JbWdcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIDpzcmM9XFxcImJ1aWxkTG9nb1VybChhcHApXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uIHNldHRpbmctYnV0dG9uXFxcIiBAY2xpY2s9XFxcInNldHRpbmdBcHAoYXBwKVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU4QkJFXFx1N0Y2RVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uIHJlbW92ZS1idXR0b25cXFwiIEBjbGljaz1cXFwicmVtb3ZlQXBwKGFwcClcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1NkNFOFxcdTk1MDBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImFwcC1vdXRlci13cmFwIGFwcC1vdXRlci13cmFwLXN1Yi1zeXN0ZW0gbmV3LXN5c3RlbS1vdXRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImFkZC1zeXN0ZW0tYnV0dG9uXFxcIiBAY2xpY2s9XFxcImFkZEludGVncmF0ZWRTeXN0ZW0oKVxcXCIgc3R5bGU9XFxcIm1hcmdpbi10b3A6IDYwcHhcXFwiPlxcdTY1QjBcXHU1ODlFPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgdi1pZj1cXFwic3RhdHVzPT0nYWRkJ1xcXCI+XFx1OEJGN1xcdTUxNDhcXHU0RkREXFx1NUI1OFxcdTRFM0JcXHU3Q0ZCXFx1N0VERixcXHU1MThEXFx1OEJCRVxcdTdGNkVcXHU1MTc2XFx1NEUyRFxcdTc2ODRcXHU1QjUwXFx1N0NGQlxcdTdFREYhPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiXX0=
