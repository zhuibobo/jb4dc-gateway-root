/*
**Created by IntelliJ IDEA.
**User: zhuangrb
**Date: 2018/8/26
**To change this template use File | Settings | File Templates.
**选择部门人员组件
*/
Vue.component("select-portlet-template-page-dialog", {
    data: function () {
        return {
            acInterface:{
                //Tree
                getPortletPageTreeData:"/Rest/SSO/Mu/Menu/GetPortletPageTreeData"
            },
            //Tree
            treeIdFieldName:"id",
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
                        name:"text"
                    },
                    simpleData : {
                        enable : true,
                        idKey : "id", // id编号命名
                        pIdKey : "parentId"  // 父id编号命名
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
            }
        }
    },
    mounted:function(){
        this.initTree();
    },
    methods:{
        //Module
        initTree:function () {
            //var _self=this;
            AjaxUtility.Post(this.acInterface.getPortletPageTreeData, {}, function (result) {
                console.log(result);
                if (result.success) {
                    for (var i = 0; i < result.data.length; i++) {
                        if (result.data[i].nodeTypeName == "Group") {
                            result.data[i].icon = "/Themes/Png16X16/folder.png";
                        }
                        else{
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
            //this.pageNum=1;
            //this.clearSearchCondition();
            //this.searchCondition.departmentId.value=this.treeSelectedNode[this.treeIdFieldName];
            //this.searchCondition.selectModuleObjectType.value=this.selectModuleObjectType;
            //this.searchCondition.selectModuleId.value=treeNode.moduleId;
            //this.reloadData();
            //appList.reloadTreeTableData();
            //}
        },
        beginSelect:function (selectModuleObjectType) {
            var elem=this.$refs.selectPortletTemplatePageDialogWrap;
            this.selectModuleObjectType=selectModuleObjectType;

            var dialogHeight=660;
            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 400,
                height: dialogHeight,
                title: "选择关联对象"
            });
        },
        buildDisplayName:function(treeSelectedNode){
            var txt = "路径:【"+TreeUtility.BuildNodePathName(this.treeSelectedNode,"text","")+"】";
            return txt;
        },
        completed:function () {
            if(this.treeSelectedNode&&this.treeSelectedNode.nodeTypeName != "Group") {
                this.$emit('on-selected-completed', this.treeSelectedNode,this.treeSelectedNode.id,this.buildDisplayName(this.treeSelectedNode),JsonUtility.JsonToString(this.treeSelectedNode));
                this.handleClose();
            }
            else{
                DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请先选择绑定对象!",null);
            }

        },
        handleClose: function () {
            DialogUtility.CloseDialogElem(this.$refs.selectPortletTemplatePageDialogWrap);
        },
    },
    template: `<div ref="selectPortletTemplatePageDialogWrap" class="c1-select-model-wrap general-edit-page-wrap" style="display: none">
                    <div class="list-2column">
                        <div class="left-outer-wrap" style="width: 374px;top: 10px;left: 10px;bottom: 55px">
                            <div class="inner-wrap" style="position:absolute;top: 2px;bottom: 10px;height: auto;overflow: auto">
                                <div>
                                    <ul ref="zTreeUL" class="ztree"></ul>
                                </div>
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
