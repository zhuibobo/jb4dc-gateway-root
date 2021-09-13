/*
**Created by IntelliJ IDEA.
**User: zhuangrb
**Date: 2021/01/03
**To change this template use File | Settings | File Templates.
**选择组织人员组件
*/
Vue.component("select-organ-user-dialog", {
    data: function () {
        return {
            acInterface:{
                //Department
                getOrganTreeData:"/Rest/SSO/Org/Organ/GetFullOrgan",
                //List
                reloadListData:"/Rest/SSO/Runtime/UserRuntime/GetUserByOrganSearch"
            },
            //Tree
            treeIdFieldName:"organId",
            treeObj:null,
            treeSelectedNode:null,
            treeSetting:{
                async : {
                    enable : true,
                    // Ajax 获取数据的 URL 地址
                    url :""
                },
                // 必须使用data
                data:{
                    key:{
                        name:"organName"
                    },
                    simpleData : {
                        enable : true,
                        idKey : "organId", // id编号命名
                        pIdKey : "organParentId"  // 父id编号命名
                    }
                },
                // 回调函数
                callback : {
                    onClick : function(event, treeId, treeNode) {
                        var _self=this.getZTreeObj(treeId)._host;
                        _self.treeNodeSelected(event,treeId,treeNode);
                    },
                    //成功的回调函数
                    onAsyncSuccess : function(event, treeId, treeNode, msg){
                        appList.treeObj.expandAll(true);
                    }
                }
            },
            //List
            idFieldName:"DU_ID",
            searchCondition:{
                userName:{
                    value: "",
                    type: SearchUtility.SearchFieldType.LikeStringType
                },
                account:{
                    value: "",
                    type: SearchUtility.SearchFieldType.LikeStringType
                },
                userPhoneNumber:{
                    value: "",
                    type: SearchUtility.SearchFieldType.LikeStringType
                },
                organId: {
                    value: "",
                    type: SearchUtility.SearchFieldType.StringType
                },
                searchInALL:{
                    value: "否",
                    type: SearchUtility.SearchFieldType.StringType
                }
            },
            columnsConfig: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '用户名',
                    key: 'USER_NAME',
                    align: "center"
                },{
                    title: '手机号码',
                    key: 'USER_PHONE_NUMBER',
                    width:140,
                    align: "center"
                }, {
                    title: '部门',
                    key: 'DEPT_NAME',
                    width:140,
                    align: "center"
                }, {
                    title: '主属',
                    key: 'DU_IS_MAIN',
                    width: 70,
                    align: "center"
                }
            ],
            tableData: [],
            selectionRows: null,
            pageTotal: 0,
            pageSize: 12,
            pageNum: 1,
            listHeight: 270
        }
    },
    mounted:function(){
        //var oldSelectedOrganId=CookieUtility.GetCookie("DMORGSID");
        //if(oldSelectedOrganId){
            //this.$refs.selectOrganComp.setOldSelectedOrgan(oldSelectedOrganId);
        //    this.initTree(oldSelectedOrganId);
        //}
    },
    methods:{
        //Organ
        changeOrgan:function(organData){
            //console.log(organData);
            CookieUtility.SetCookie1Month("DMORGSID",organData.organId);
            this.initTree(organData.organId);
            this.clearSearchCondition();
            this.tableData=[];
        },
        //DepartmentTree
        initTree:function () {
            //var _self=this;
            AjaxUtility.Post(this.acInterface.getOrganTreeData, {}, function (result) {
                if (result.success) {
                    this.$refs.zTreeUL.setAttribute("id","select-organ-user-dialog-"+StringUtility.Guid());
                    this.treeObj=$.fn.zTree.init($(this.$refs.zTreeUL), this.treeSetting,result.data);
                    this.treeObj.expandAll(true);
                    this.treeObj._host=this;
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
                }
            }, this);
        },
        treeNodeSelected:function (event, treeId, treeNode) {
            // 根节点不触发任何事件
            //if(treeNode.level != 0) {
            this.treeSelectedNode=treeNode;
            this.selectionRows=null;
            this.pageNum=1;
            this.clearSearchCondition();
            this.searchCondition.organId.value=this.treeSelectedNode[this.treeIdFieldName];
            this.reloadData();
            //appList.reloadTreeTableData();
            //}
        },
        //List
        clearSearchCondition:function () {
            for(var key in this.searchCondition){
                this.searchCondition[key].value="";
            }
            this.searchCondition["searchInALL"].value="否";
        },
        selectionChange: function (selection) {
            this.selectionRows = selection;
        },
        reloadData: function () {
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
        changePage: function (pageNum) {
            this.pageNum = pageNum;
            this.reloadData();
            this.selectionRows=null;
        },
        search:function () {
            this.pageNum=1;
            this.reloadData();
        },
        beginSelect:function () {
            var elem=this.$refs.selectOrganUserModelDialogWrap;
            //debugger;
            //this.getOrganDataInitTree();
            //alert();
            var dialogHeight=460;
            if(PageStyleUtility.GetPageHeight()>700){
                dialogHeight=660;
            }
            this.listHeight=dialogHeight-230;

            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 970,
                height: dialogHeight,
                title: "选择组织机构人员"
            });
            this.initTree();
        },
        completed:function () {
            console.log(this.selectionRows);
            if(this.selectionRows) {
                this.$emit('on-selected-completed', this.selectionRows)
                this.handleClose();
            }
            else{
                DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请先选中人员!",null);
            }

        },
        handleClose: function () {
            DialogUtility.CloseDialogElem(this.$refs.selectOrganUserModelDialogWrap);
        },
    },
    template: `<div ref="selectOrganUserModelDialogWrap" class="c1-select-model-wrap general-edit-page-wrap" style="display: none">
                    <div class="list-2column">
                        <div class="left-outer-wrap" style="width: 250px;top: 10px;left: 10px;bottom: 55px">
                            <div class="inner-wrap" style="position:absolute;top: 2px;bottom: 10px;height: auto;overflow: auto">
                                <div>
                                    <ul ref="zTreeUL" class="ztree"></ul>
                                </div>
                            </div>
                        </div>
                        <div class="right-outer-wrap iv-list-page-wrap" style="padding: 10px;left: 270px;top: 10px;right: 10px;bottom: 55px">
                            <div class="list-simple-search-wrap">
                                <table class="ls-table">
                                    <colgroup>
                                        <col style="width: 80px">
                                        <col style="">
                                        <col style="width: 100px">
                                        <col style="">
                                        <col style="width: 80px">
                                        <col style="width: 85px">
                                        <col style="width: 80px">
                                    </colgroup>
                                    <tr class="ls-table-row">
                                        <td>用户名：</td>
                                        <td>
                                            <i-input v-model="searchCondition.userName.value" placeholder=""></i-input>
                                        </td>
                                        <td>手机：</td>
                                        <td>
                                            <i-input v-model="searchCondition.userPhoneNumber.value"></i-input>
                                        </td>
                                        <td>全局：</td>
                                        <td>
                                            <radio-group v-model="searchCondition.searchInALL.value">
                                                <radio label="是">是</radio>
                                                <radio label="否">否</radio>
                                            </radio-group>
                                        </td>
                                        <td><i-button type="primary" @click="search"><Icon type="android-search"></Icon> 查询 </i-button></td>
                                    </tr>
                                </table>
                            </div>
                            <i-table :height="listHeight" stripe border :columns="columnsConfig" :data="tableData"
                                     class="iv-list-table" :highlight-row="true"
                                     @on-selection-change="selectionChange"></i-table>
                            <div style="float: right;">
                                <page @on-change="changePage" :current.sync="pageNum" :page-size="pageSize" show-total
                                      :total="pageTotal"></page>
                            </div>
                        </div>
                    </div>
                    <div class="button-outer-wrap" style="bottom: 12px;right: 12px">
                        <div class="button-inner-wrap">
                            <button-group>
                                <i-button type="primary" @click="completed()" icon="md-checkmark">确认</i-button>
                                <i-button @click="handleClose()" icon="md-close">关闭</i-button>
                            </button-group>
                        </div>
                    </div>
                </div>`
});
