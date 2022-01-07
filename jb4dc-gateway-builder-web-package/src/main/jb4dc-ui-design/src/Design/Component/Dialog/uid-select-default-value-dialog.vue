<template>
    <div style="position: absolute;top: -1000px">
        <div ref="selectDefaultValueDialogWrap" class="general-edit-page-wrap html-design-plugin-dialog-wraper" style="margin-top: 0px">
            <a-tabs v-model:activeKey="selectType" size="small">
                <a-tab-pane tab="常量值" key="Const" >
                    <table class="html-design-plugin-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                        <colgroup>
                            <col style="width: 100px" />
                            <col />
                        </colgroup>
                        <tbody>
                            <tr>
                                <td>常量值：</td>
                                <td>
                                    <a-input v-model:value="constValue"></a-input>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </a-tab-pane>
                <a-tab-pane tab="环境变量" key="EnvVar" :forceRender="true">
                    <div style="height: 45px;border-bottom: dotted 1px #8a8a8a;margin-bottom: 10px;">
                        <div style="float: right;padding: 8px;border-radius: 8px;color:orangered;border: solid 1px #adbed8;">已经选择：{{selectText}}</div>
                    </div>
                    <div>
                        <div style="width: 30%;float: left;height: 514px">
                            <div class="inner-wrap">
                                <div>
                                    <ul id="uid_select_default_value_dialog_zTreeUL" class="ztree"></ul>
                                </div>
                            </div>
                        </div>
                        <div style="width: 68%;float: left;height: 514px" class="iv-list-page-wrap">
                            <a-table  :scroll="{ y: 450 }" bordered :columns="columnsConfig" :dataSource="tableData"
                                     class="iv-list-table" size="small"
                                      :customRow="customRow"></a-table>
                        </div>
                    </div>
                </a-tab-pane>
            </a-tabs>
            <div class="button-outer-wrap">
                <div class="button-inner-wrap">
                    <a-button type="primary" @click="selectComplete()"> 确 认 </a-button>
                    <a-button type="primary" @click="clearComplete()"> 清 空 </a-button>
                    <a-button @click="handleClose()">关 闭</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import remoteRestInterface from "../../Remote/RemoteRestInterface.js"
export default {
    name: "uid-select-default-value-dialog",
    data:function () {
        var _self=this;

        return {
            acInterface:{
                getGroupTreeData:"/Rest/Builder/EnvVariableGroup/GetTreeData",
                reloadListData:"/Rest/Builder/EnvVariable/GetListData"
            },
            selectType:"Const",
            selectValue:"",
            selectText:"",
            constValue:"",
            listHeight: 470,
            tree:{
                treeIdFieldName:"envGroupId",
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
                            name:"envGroupText"
                        },
                        simpleData : {
                            enable : true,
                            idKey : "envGroupId", // id编号命名
                            pIdKey : "envGroupParentId",  // 父id编号命名
                            rootId : 0
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
            },
            tableData:[],
            columnsConfig: [
                {
                    title: '变量名称',
                    key: 'envVarText',
                    dataIndex:"envVarText",
                    align: "center"
                }, {
                    title: '变量值',
                    key: 'envVarValue',
                    dataIndex:"envVarValue",
                    align: "center"
                }/*,{
                    title: '操作',
                    key: 'envVarId',
                    dataIndex:"envVarId",
                    width: 120,
                    align: "center",
                    render: function (h, params) {
                        return h('div',{class: "list-row-button-wrap"},[
                            ListPageUtility.IViewTableInnerButton.SelectedButton(h, params, "envVarId", _self),
                        ]);
                    }
                }*/
            ],
            searchCondition:{
                envVarGroupId:{
                    value:"",
                    type:SearchUtility.SearchFieldType.StringType
                }
            },
            pageTotal: 0,
            pageSize: 100,
            pageNum: 1
        }
    },
    mounted:function (){
        this.loadData();
    },
    methods:{
        beginSelect:function(oldData){
            //console.log(oldData);
            var elem=this.$refs.selectDefaultValueDialogWrap;
            //debugger;
            //this.getTableDataInitTree();

            var height=450;
            /*if(PageStyleUtility.GetPageHeight()>550){
                height=600;
            }*/

            DialogUtility.DialogElemObj(elem, {
                modal: true,
                height: 680,
                width: 980,
                title: "设置默认值"
            });

            $(window.document).find(".ui-widget-overlay").css("zIndex",10100);
            $(window.document).find(".ui-dialog").css("zIndex",10101);

            if(oldData==null){
                //this.selectType="Const";
                this.selectValue="";
                this.selectText="";
                this.constValue="";
            };
        },
        loadData:function(){
            //var _self=this;
            /*AjaxUtility.Post(this.acInterface.getGroupTreeData, {}, function (result) {
                console.log(result);
                if(result.success){
                    if(result.data!=null&&result.data.length>0){
                        for(var i=0;i<result.data.length;i++) {
                            /!*if(result.data[i].envGroupChildCount==0) {
                                result.data[i].icon = "../../../Themes/Png16X16/app-view-columns.png";
                            }*!/
                        }
                    }
                    this.tree.treeObj=$.fn.zTree.init($("#zTreeUL"), this.tree.treeSetting,result.data);
                    this.tree.treeObj.expandAll(true);
                    this.tree.treeObj._host=this;
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
                }
            }, this);*/
            remoteRestInterface.getEnvVariableGroupTreeData({},(result)=>{
                //console.log(result);
                if(result.success){
                    if(result.data!=null&&result.data.length>0){
                        for(let i=0;i<result.data.length;i++) {
                            /*if(result.data[i].envGroupChildCount==0) {
                                result.data[i].icon = "../../../Themes/Png16X16/app-view-columns.png";
                            }*/
                        }
                    }
                    //console.log($("#uid_select_default_value_dialog_zTreeUL"));
                    this.tree.treeObj=$.fn.zTree.init($("#uid_select_default_value_dialog_zTreeUL"), this.tree.treeSetting,result.data);
                    this.tree.treeObj.expandAll(true);
                    this.tree.treeObj._host=this;
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
                }
            })
        },
        getSelectInstanceName:function () {
            return BaseUtility.GetUrlParaValue("instanceName");
        },
        selectComplete:function () {
            var result={};
            //console.log(this.selectType);
            if(this.selectType=="Const"){
                if(this.constValue==""){
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请设置常量默认值！",null);
                    return;
                }

                result.Type="Const";
                result.Value=this.constValue;
                result.Text=this.constValue;
            }
            else {
                result.Type = "EnvVar";
                result.Value = this.selectValue;
                result.Text = this.selectText;
            }
            /*else if(this.selectType=="DateTime"){
                var selectNodes=this.tree.datetimeTreeObj.getSelectedNodes();
                if(selectNodes.length==0){
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请选择一种时间类型！",null);
                    return;
                }
                else {
                    result.Type = "DateTime";
                    result.Value = selectNodes[0].value;
                    result.Text = selectNodes[0].text;
                }
            }
            else if(this.selectType=="ApiVar"){
                //result.Type = "ApiVar";
                var selectNodes=this.tree.envVarTreeObj.getSelectedNodes();
                if(selectNodes.length==0){
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请选择一种API类型！",null);
                    return;
                }
                else {
                    if(selectNodes[0].group==true){
                        DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"不能选择分组！",null);
                        return
                    }
                    else {
                        result.Type = "ApiVar";
                        result.Value = selectNodes[0].value;
                        result.Text = selectNodes[0].text;
                    }
                }
            }
            else if(this.selectType=="NumberCode"){
                result.Type = "NumberCode";
            }*/

            this.$emit('on-selected-default-value', result);
            //window.OpenerWindowObj[this.getSelectInstanceName()].setSelectEnvVariableResultValue(result);
            this.handleClose();
        },
        clearComplete:function(){
            //window.OpenerWindowObj[this.getSelectInstanceName()].setSelectEnvVariableResultValue(null);
            this.$emit('on-selected-default-value', null);
            this.handleClose();
        },
        handleClose: function () {
            //DialogUtility.CloseOpenIframeWindow(window,DialogUtility.DialogId);
            /*if(window.IsOpenForFrame){
                DialogUtility.Frame_CloseDialog(window)
            }
            else {
                DialogUtility.CloseOpenIframeWindow(window, DialogUtility.DialogId);
            }*/
            DialogUtility.CloseDialogElem(this.$refs.selectDefaultValueDialogWrap);
        },
        selectionChange:function () {

        },
        clearSearchCondition:function () {
            for(var key in this.searchCondition){
                this.searchCondition[key].value="";
            }
        },
        treeNodeSelected:function (event, treeId, treeNode) {
            // 根节点不触发任何事件1
            //if(treeNode.level != 0) {
            this.pageNum=1;
            this.clearSearchCondition();
            this.searchCondition.envVarGroupId.value=treeNode[this.tree.treeIdFieldName];
            this.reloadData();
            //appList.reloadTreeTableData();
            //}
        },
        reloadData: function () {
            //ListPageUtility.IViewTableLoadDataSearch(this.acInterface.reloadListData,this.pageNum,this.pageSize,this.searchCondition,this,this.idFieldName,true,null,false);
            //this.selectionRows=null;
            /*ListPageUtility.IViewTableBindDataBySearch({
                url: this.acInterface.reloadListData,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                searchCondition: this.searchCondition,
                pageAppObj: this,
                tableList: this,
                idField: "envVarId",
                autoSelectedOldRows: true,
                successFunc: null,
                loadDict: false,
                custParas: {}
            });*/
            remoteRestInterface.getEnvVariableListData(this.searchCondition,(result)=>{
                if(result.success){
                    console.log(result);
                    this.tableData=result.data.list;
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
                }
            })
        },
        selected:function (record) {
            console.log(record);
            this.selectValue=record.envVarValue;
            this.selectText=record.envVarText;
        },
        customRow:function (record) {
            return {
                onClick:(event)=>{
                    this.selected(record);
                }
            };
        }
    }
}
</script>

<style scoped>

</style>