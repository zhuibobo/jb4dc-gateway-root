/*html编辑器中的元素辅助列表*/
Vue.component("module-list-weblist-comp", {
    props: ['listHeight', 'moduleData', 'activeTabName'],
    data: function () {
        var _self = this;

        return {
            acInterface: {
                editView: "/HTML/Builder/List/ListDesign.html",
                editViewVersion2: "/HTML/UIDesign/UIDesignMain.html",
                reloadData: "/Rest/Builder/List/GetListDataForModule",
                delete: "/Rest/Builder/List/Delete",
                move: "/Rest/Builder/List/Move",
                copyList: "/Rest/Builder/List/CopyList"
            },
            idFieldName: "listId",
            searchCondition: {
                listModuleId: {
                    value: "",
                    type: SearchUtility.SearchFieldType.StringType
                }
            },
            columnsConfig: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h('weblist-expand-row', {
                            props: {
                                row: params.row
                            }
                        })
                    }
                },
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '编号',
                    key: 'listCode',
                    align: "center",
                    width: 80
                },
                {
                    title: '列表名称',
                    key: 'listName',
                    align: "left"
                }, {
                    title: '唯一名',
                    key: 'listSingleName',
                    align: "center"
                }, {
                    title: '备注',
                    key: 'listDesc',
                    align: "center"
                }, {
                    title: '编辑时间',
                    key: 'listUpdateTime',
                    width: 100,
                    align: "center",
                    render: function (h, params) {
                        return ListPageUtility.IViewTableRenderer.ToDateYYYY_MM_DD(h, params.row.listUpdateTime);
                    }
                }, {
                    title: '操作',
                    key: 'listId',
                    width: 120,
                    align: "center",
                    render: function (h, params) {
                        //console.log(params);
                        //console.log(this);
                        return h('div', {class: "list-row-button-wrap"}, [
                            ListPageUtility.IViewTableInnerButton.EditButton(h, params, _self.idFieldName, _self),
                            ListPageUtility.IViewTableInnerButton.DeleteButton(h, params, _self.idFieldName, _self)
                        ]);
                    }
                }
            ],
            tableData: [],
            tableDataOriginal: [],
            selectionRows: null,
            pageTotal: 0,
            pageSize: 500,
            pageNum: 1,
            searchText: ""
        }
    },
    mounted: function () {
        //this.reloadData();
        //将对象附加到window上,提供给后边进行操作
        window._modulelistweblistcomp = this;
        //alert(this.activeTabName);
        //alert(this.listHeight);
    },
    watch: {
        moduleData: function (newVal) {
            this.reloadData();
        },
        activeTabName: function (newVal) {
            //alert(this.activeTabName);
            this.reloadData();
        },
        searchText: function (newVal) {
            //console.log(this.searchText);
            if (newVal) {
                var filterTableData = [];
                for (var i = 0; i < this.tableData.length; i++) {
                    var row = this.tableData[i];
                    if (row.formCode.indexOf(newVal) >= 0) {
                        filterTableData.push(row);
                    } else if (row.formName.indexOf(newVal) >= 0) {
                        filterTableData.push(row);
                    }
                }
                this.tableData = filterTableData;
            } else {
                this.tableData = this.tableDataOriginal;
            }
        }
    },
    methods: {
        getModuleName: function () {
            return this.moduleData == null ? "请选中模块." : this.moduleData.moduleText;
        },
        selectionChange: function (selection) {
            this.selectionRows = selection;
        },
        reloadData: function () {
            //debugger;
            if (this.moduleData != null && this.activeTabName == "list-weblist") {
                this.searchCondition.listModuleId.value = this.moduleData.moduleId;
                /*ListPageUtility.IViewTableLoadDataSearch(this.acInterface.reloadData, this.pageNum, this.pageSize, this.searchCondition, this, this.idFieldName, true, function (result,pageAppObj) {
                    pageAppObj.tableDataOriginal=result.data.list;
                },false);*/
                ListPageUtility.IViewTableBindDataBySearch({
                    url: this.acInterface.reloadData,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    searchCondition: this.searchCondition,
                    pageAppObj: this,
                    tableList: this,
                    idField: this.idFieldName,
                    autoSelectedOldRows: true,
                    successFunc: function (result, pageAppObj) {
                        pageAppObj.tableDataOriginal = result.data.list;
                    },
                    loadDict: false,
                    custParas: {},
                    _expandedALL: true
                });
            }
        },
        add: function () {
            if (this.moduleData != null) {
                var url = BaseUtility.BuildView(this.acInterface.editView, {
                    "op": "add",
                    "moduleId": this.moduleData.moduleId
                });
                //alert(url);
                //DialogUtility.OpenNewWindow(window, DialogUtility.DialogId, url, {width: 0, height: 0}, 2);
                DialogUtility.OpenNewTabWindow(url);
            } else {
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择模块!", null);
            }
        },
        addVersion2: function () {
            if (this.moduleData != null) {
                var url = BaseUtility.BuildView(this.acInterface.editViewVersion2, {
                    "op": "add",
                    "uiDesignType": "webListDesign",
                    "moduleId": this.moduleData.moduleId
                });
                DialogUtility.OpenNewTabWindow(url);
            } else {
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择模块!", null);
            }
        },
        edit: function (recordId) {
            //debugger;
            //alert(recordId);
            if (recordId == "75ffdba7-bef1-4342-87de-d16578afb5da" || recordId == "8318f6ec-3c94-4e6f-b561-76c881f35899") {
                this.editVersion2(recordId);
                return;
            }

            var url = BaseUtility.BuildView(this.acInterface.editView, {
                "op": "update",
                "recordId": recordId
            });
            //DialogUtility.OpenNewWindow(window, DialogUtility.DialogId, url, {width: 0, height: 0}, 2);
            DialogUtility.OpenNewTabWindow(url);
        },
        editVersion2: function (recordId) {
            var url = BaseUtility.BuildView(this.acInterface.editViewVersion2, {
                "op": "update",
                "uiDesignType": "webListDesign",
                "moduleId": this.moduleData.moduleId,
                "recordId": recordId
            });
            DialogUtility.OpenNewTabWindow(url);
        },
        del: function (recordId) {
            ListPageUtility.IViewTableDeleteRow(this.acInterface.delete, recordId, this);
        },
        statusEnable: function (statusName) {
            ListPageUtility.IViewChangeServerStatusFace(this.acInterface.statusChange, this.selectionRows, appList.idFieldName, statusName, appList);
        },
        move: function (type) {
            ListPageUtility.IViewMoveFace(this.acInterface.move, this.selectionRows, this.idFieldName, type, this);
        },
        copy: function () {
            ListPageUtility.IViewTableMareSureSelectedOne(this.selectionRows, this).then(function (selectionRows) {
                var recordId = selectionRows[0][this.idFieldName];
                AjaxUtility.Post(this.acInterface.copyList, {listId: recordId}, function (result) {
                    if (result.success) {
                        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                            this.reloadData();
                        }, this);
                    }
                }, this);
            });
        }
    },
    template: '<div class="module-list-wrap">\
                    <div id="list-button-wrap" class="list-button-outer-wrap">\
                        <div class="module-list-name"><Icon type="ios-arrow-dropright-circle" />&nbsp;模块【{{getModuleName()}}】</div>\
                        <div class="list-button-inner-wrap">\
                            <ButtonGroup>\
                                <i-button  type="success" @click="add()" icon="md-add">新增</i-button>\
                                <i-button  type="success" @click="addVersion2()" icon="md-add">新增V2版本设计器</i-button>\
                                <i-button type="primary" @click="copy()" icon="md-albums">复制</i-button>\
                                <i-button type="error" icon="md-pricetag">预览</i-button>\
                                <i-button type="error" icon="md-bookmarks">历史版本</i-button>\
                                <i-button type="error" icon="md-brush">复制ID</i-button>\
                                <i-button type="primary" @click="move(\'up\')" icon="md-arrow-up">上移</i-button>\
                                <i-button type="primary" @click="move(\'down\')" icon="md-arrow-down">下移</i-button>\
                            </ButtonGroup>\
                        </div>\
                         <div style="float: right;width: 200px;margin-right: 10px;">\
                            <i-input search class="input_border_bottom" v-model="searchText">\
                            </i-input>\
                        </div>\
                        <div style="clear: both"></div>\
                    </div>\
                    <i-table :height="listHeight" stripe border :columns="columnsConfig" :data="tableData"\
                             class="iv-list-table" :highlight-row="true"\
                             @on-selection-change="selectionChange"></i-table>\
                </div>'
});