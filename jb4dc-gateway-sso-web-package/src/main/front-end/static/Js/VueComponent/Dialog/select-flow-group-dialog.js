/*
**Created by IntelliJ IDEA.
**User: zhuangrb
**Date: 2021/10/22
**To change this template use File | Settings | File Templates.
**选择流程分组
*/
Vue.component("select-flow-group-dialog", {
    data: function () {
        return {
            acInterface:{
                //Tree
                getFlowModelGroupTreeData:"/Rest/SSO/Mu/Menu/GetFlowModelGroupTreeData"
            },
            //Tree
            treeIdFieldName:"modelGroupId",
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
                        name:"modelGroupText"
                    },
                    simpleData : {
                        enable : true,
                        idKey : "modelGroupId", // id编号命名
                        pIdKey : "modelGroupParentId"  // 父id编号命名
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
                },
                check: {
                    enable: true
                }
            },
            completedResult:{
                modelFlowCategory:"AllProcess",
                allModelGroup:true,
                selectedModelGroup:[]
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
            AjaxUtility.Post(this.acInterface.getFlowModelGroupTreeData, {}, function (result) {
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
            this.treeSelectedNode=treeNode;
        },
        beginSelect:function (selectModuleObjectType) {
            var elem=this.$refs.selectFlowGroupDialogWrap;
            this.selectModuleObjectType=selectModuleObjectType;

            var dialogHeight=660;
            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 500,
                height: dialogHeight,
                title: "选择关联对象"
            });
        },
        transformModelFlowCategoryName:function (value){
            switch (value){
                case "AllProcess":{return "全部流程"} break;
                case "GeneralProcess":{return "通用流程"} break;
                case "DailyAffairsProcess":{return "日常事务流程"} break;
                case "ReceiveDocumentProcess":{return "公文收文流程"} break;
                case "SendDocumentProcess":{return "公文发文流程"} break;
                case "AdministrativeApprovalProcess":{return "行政审批流程"} break;
                case "AdministrativeLicensingProcess":{return "行政许可流程"} break;
                case "CommunityServiceProcess":{return "社区服务流程"} break;
            }
        },
        buildDisplayName:function(){
            var txt = "绑定分类:【"+this.transformModelFlowCategoryName(this.completedResult.modelFlowCategory)+"】,加载全部分组:【"+this.completedResult.allModelGroup+"】";
            return txt;
        },
        completed:function () {
            let nodes = this.treeObj.getCheckedNodes(true);
            console.log(nodes);
            for (let i = 0; i < nodes.length; i++) {
                this.completedResult.selectedModelGroup.push({
                    groupId:nodes[i].modelGroupId,
                    groupText:nodes[i].modelGroupText
                })
            }
            this.$emit('on-selected-completed', this.completedResult, "inMenuOuterObject", this.buildDisplayName(), JsonUtility.JsonToString(this.completedResult));
            this.handleClose();
        },
        handleClose: function () {
            DialogUtility.CloseDialogElem(this.$refs.selectFlowGroupDialogWrap);
        },
    },
    template: `<div ref="selectFlowGroupDialogWrap" class="c1-select-model-wrap general-edit-page-wrap" style="display: none">
                    <div class="list-2column">
                        <div class="left-outer-wrap"  style="width: 156px;top: 10px;left: 10px;bottom: 55px">
                            <div class="inner-wrap" style="position:absolute;top: 2px;bottom: 10px;height: auto;overflow: auto">
                                <div class="cust-ivu-radio-wrapper">
                                    <radio-group style="margin: 10px" v-model="completedResult.modelFlowCategory">
                                        <radio label="AllProcess" border>&nbsp;&nbsp;&nbsp;&nbsp;{{transformModelFlowCategoryName('AllProcess')}}&nbsp;&nbsp;&nbsp;</radio>
                                        <radio label="GeneralProcess" border>&nbsp;&nbsp;&nbsp;&nbsp;{{transformModelFlowCategoryName('GeneralProcess')}}&nbsp;&nbsp;&nbsp;</radio>
                                        <radio label="DailyAffairsProcess" border>{{transformModelFlowCategoryName('DailyAffairsProcess')}}</radio>
                                        <radio label="ReceiveDocumentProcess" border>{{transformModelFlowCategoryName('ReceiveDocumentProcess')}}</radio>
                                        <radio label="SendDocumentProcess" border>{{transformModelFlowCategoryName('SendDocumentProcess')}}</radio>
                                        <radio label="AdministrativeApprovalProcess" border>{{transformModelFlowCategoryName('AdministrativeApprovalProcess')}}</radio>
                                        <radio label="AdministrativeLicensingProcess" border>{{transformModelFlowCategoryName('AdministrativeLicensingProcess')}}</radio>
                                        <radio label="CommunityServiceProcess" border>{{transformModelFlowCategoryName('CommunityServiceProcess')}}</radio>
                                    </radio-group>
                                </div>
                            </div>
                        </div>
                        <div class="right-outer-wrap iv-list-page-wrap" style="padding: 10px;left: 172px;top: 10px;right: 10px;bottom: 55px">
                            <div style="border-bottom: 1px solid #0B61A4;padding: 8px;">
                                加载全部分组的流程模型：
                                <i-switch v-model="completedResult.allModelGroup" />
                            </div>
                            <ul ref="zTreeUL" class="ztree"></ul>
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
