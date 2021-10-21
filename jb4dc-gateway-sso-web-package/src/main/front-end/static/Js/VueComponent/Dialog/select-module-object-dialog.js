/*
**Created by IntelliJ IDEA.
**User: zhuangrb
**Date: 2018/8/26
**To change this template use File | Settings | File Templates.
**选择部门人员组件
*/
Vue.component("select-module-object-dialog", {
    data: function () {
        return {
            acInterface:{
                //dbLink
                getDBLinkData:"/Rest/SSO/Mu/Menu/GetFullDBLink",
                //Tree
                getModuleTreeData:"/Rest/SSO/Mu/Menu/GetMouldTreeData",
                //List
                reloadListData:"/Rest/SSO/Mu/Menu/GetSelectModuleObjectListByModuleId"
            },
            selectModuleObjectType:"",
            //Select
            selectedDBLinkId:"",
            dbLinkArray:[],
            //Tree
            treeIdFieldName:"moduleId",
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
                        name:"moduleText"
                    },
                    simpleData : {
                        enable : true,
                        idKey : "moduleId", // id编号命名
                        pIdKey : "moduleParentId"  // 父id编号命名
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
                        //appList.treeObj.expandAll(true);
                    }
                }
            },
            //List
            selectedModuleObject:null,
            idFieldName:"ID",
            searchCondition:{
                selectModuleObjectType:{
                    value: "",
                    type: SearchUtility.SearchFieldType.StringType
                },
                selectModuleId:{
                    value: "",
                    type: SearchUtility.SearchFieldType.StringType
                }
            },
            columnsConfig: [
                {
                    title: '名称',
                    key: 'NAME',
                    align: "center"
                },{
                    title: '备注',
                    key: 'DESCRIPTION',
                    width:240,
                    align: "center"
                }
            ],
            tableData: [],
            pageTotal: 0,
            pageSize: 12,
            pageNum: 1,
            listHeight: 510
        }
    },
    mounted:function(){
        this.bindDBLink();

        /*if(oldSelectedOrganId){
            this.$refs.selectOrganComp.setOldSelectedOrgan(oldSelectedOrganId);
            this.initTree(oldSelectedOrganId);
        }*/
    },
    methods:{
        //DBLink
        bindDBLink:function(){
            AjaxUtility.Post(this.acInterface.getDBLinkData,{},function (result) {
                if(result.success){
                    console.log(result.data);
                    this.dbLinkArray=result.data;

                    var oldSelectedOrganId=CookieUtility.GetCookie("SMODDBLINKID");
                    this.selectedDBLinkId=oldSelectedOrganId;
                    if(this.selectedDBLinkId){
                        this.initTree(this.selectedDBLinkId);
                    }
                }
            },this);
        },
        changeDBLink:function(){
            console.log(this.selectedDBLinkId);
            this.initTree(this.selectedDBLinkId);
            CookieUtility.SetCookie1Month("SMODDBLINKID",this.selectedDBLinkId);
        },
        //Module
        initTree:function (selectedDBLinkId) {
            //var _self=this;
            AjaxUtility.Post(this.acInterface.getModuleTreeData, {"dbLinkId":selectedDBLinkId}, function (result) {
                console.log(result);
                if (result.success) {
                    for (var i = 0; i < result.data.length; i++) {
                        if (result.data[i].moduleParentId != "-1") {
                            result.data[i].icon = "/Themes/Png16X16/layout-sidebar.png";
                        }
                    }
                    this.$refs.zTreeUL.setAttribute("id","select-module-object-dialog-"+StringUtility.Guid());
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
            this.pageNum=1;
            //this.clearSearchCondition();
            //this.searchCondition.departmentId.value=this.treeSelectedNode[this.treeIdFieldName];
            this.searchCondition.selectModuleObjectType.value=this.selectModuleObjectType;
            this.searchCondition.selectModuleId.value=treeNode.moduleId;
            this.reloadData();
            //appList.reloadTreeTableData();
            //}
        },
        //List
        moduleObjectClick:function(data,index){
            this.selectedModuleObject=data;

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
                successFunc: function(result){
                    console.log(result);
                },
                loadDict: false,
                custParas: {}
            });
        },
        changePage: function (pageNum) {
            this.pageNum = pageNum;
            this.reloadData();
        },
        search:function () {
            this.pageNum=1;
            this.reloadData();
        },
        beginSelect:function (selectModuleObjectType) {
            var elem=this.$refs.selectModuleObjectDialogWrap;
            this.selectModuleObjectType=selectModuleObjectType;

            var dialogHeight=660;
            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 870,
                height: dialogHeight,
                title: "选择关联对象1"
            });
        },
        buildDisplayName:function(selectedModuleObject){
            var txt = "路径:【"+TreeUtility.BuildNodePathName(this.treeSelectedNode,"moduleText",selectedModuleObject.NAME+"("+selectedModuleObject.CODE+")")+"】";
            //var txt = "路径:【"+this.getNodePathName()+"("+selectedModuleObject.CODE+")】";
            if(this.selectModuleObjectType=="Web模块列表"){
                txt+="，数据集:（"+selectedModuleObject.LIST_DATASET_NAME+"）";
            }
            return txt;
        },
        completed:function () {
            if(this.selectedModuleObject) {
                this.$emit('on-selected-completed', this.selectedModuleObject,this.selectedModuleObject.ID,this.buildDisplayName(this.selectedModuleObject),JsonUtility.JsonToString( this.selectedModuleObject));
                this.handleClose();
            }
            else{
                DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请先选择绑定对象!",null);
            }

        },
        handleClose: function () {
            DialogUtility.CloseDialogElem(this.$refs.selectModuleObjectDialogWrap);
        },
    },
    template: `<div ref="selectModuleObjectDialogWrap" class="c1-select-model-wrap general-edit-page-wrap" style="display: none">
                    <div class="list-2column">
                        <div class="left-outer-wrap" style="width: 220px;top: 10px;left: 10px;bottom: 55px">
                            <i-select @on-change="changeDBLink" v-model="selectedDBLinkId" style="margin: 6px;width: 207px">
                                <i-option v-for="item in dbLinkArray" :value="item.dbId" :key="item.dbId">{{ item.dbLinkName }}</i-option>
                            </i-select>
                            <div class="inner-wrap" style="position:absolute;top: 40px;bottom: 10px;height: auto;overflow: auto">
                                <div>
                                    <ul ref="zTreeUL" class="ztree"></ul>
                                </div>
                            </div>
                        </div>
                        <div class="right-outer-wrap iv-list-page-wrap" style="padding: 10px;left: 240px;top: 10px;right: 10px;bottom: 55px">
                            <i-table :height="listHeight" stripe border :columns="columnsConfig" :data="tableData"
                                     class="iv-list-table" :highlight-row="true"
                                     @on-row-click="moduleObjectClick"></i-table>
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
