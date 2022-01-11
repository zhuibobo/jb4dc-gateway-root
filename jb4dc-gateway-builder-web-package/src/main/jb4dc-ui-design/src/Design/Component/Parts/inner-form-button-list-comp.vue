<template>
    <div style="height: 306px" class="iv-list-page-wrap">
        <div ref="innerFormSaveButtonWrap" class="general-edit-page-wrap html-design-plugin-dialog-wraper" style="display: none;margin-top: 0px">
            <a-tabs tab-position="top" size="small" type="card">
                <a-tab-pane key="bindInfo" tab="绑定信息">
                    <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                        <colgroup>
                            <col style="width: 60px" />
                            <col style="width: 220px" />
                            <col style="width: 100px" />
                            <col />
                        </colgroup>
                        <tbody>
                        <tr>
                            <td>标题：</td>
                            <td>
                                <a-input v-model:value="innerSaveButtonEditData.caption" />
                            </td>
                            <td>保存并关闭：</td>
                            <td>
                                <a-radio-group type="button" style="margin: auto" v-model:value="innerSaveButtonEditData.saveAndClose">
                                    <a-radio-button value="true">是</a-radio-button>
                                    <a-radio-button value="false">否</a-radio-button>
                                </a-radio-group>
                            </td>
                        </tr>
                        <tr>
                            <td>字段：</td>
                            <td colspan="3">
                                <div style="height: 140px">
                                    <div style="float: left;width: 94%">
                                        <div id="fieldContainer" class="edit-table-wrap" style="height: 310px;overflow: auto;width: 98%;margin: auto"></div>
                                    </div>
                                    <div style="float: right;width: 5%">
                                        <div class="ant-btn-group-vertical">
                                            <a-button size="small" type="primary" @click="addField" class="green-btn"><i class="las la-plus"></i></a-button>
                                            <a-button size="small" type="primary" @click="removeField"><i class="las la-times"></i></a-button>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </a-tab-pane>
                <a-tab-pane key="apiSetting" tab="API设置" :forceRender="true">
                    <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                        <colgroup>
                            <col style="width: 320px" />
                            <col style="width: 60px" />
                            <col />
                        </colgroup>
                        <tbody>
                        <tr>
                            <td style="background: #ffffff">
                                <a-input search class="input_border_bottom" ref="txt_search_api_text" placeholder="请输入API名称"></a-input>
                                <ul id="apiZTreeUL" class="ztree" style="height: 320px;overflow: auto"></ul>
                            </td>
                            <td style="text-align: center;background-color: #f8f8f8">
                                <a-button size="small" type="primary" @click="addAPI"></a-button>
                                <a-button size="small" type="primary" @click="removeAPI"></a-button>
                                <a-button size="small" type="primary" @click="clearAPI"></a-button>
                            </td>
                            <td style="background: #ffffff;" valign="top">
                                <div id="apiContainer" class="edit-table-wrap" style="height: 340px;overflow: auto;width: 98%;margin: auto"></div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </a-tab-pane>
                <a-tab-pane key="devExtend" tab="开发扩展">
                    <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                        <colgroup>
                            <col style="width: 150px" />
                            <col />
                        </colgroup>
                        <tbody>
                        <tr>
                            <td>ID：</td>
                            <td>
                                <a-input v-model:value="innerSaveButtonEditData.id" size="small" placeholder="" />
                            </td>
                        </tr>
                        <tr>
                            <td>服务端解析类：</td>
                            <td>
                                <a-input v-model:value="innerSaveButtonEditData.custServerResolveMethod" size="small" placeholder="按钮进行服务端解析时,类全称,将调用该类,需要实现接口IFormButtonCustResolve" />
                            </td>
                        </tr>
                        <tr>
                            <td>参数：</td>
                            <td>
                                <a-input v-model:value="innerSaveButtonEditData.custServerResolveMethodPara" size="small" placeholder="服务端解析类的参数" />
                            </td>
                        </tr>
                        <tr>
                            <td>客户端渲染方法：</td>
                            <td>
                                <a-input v-model:value="innerSaveButtonEditData.custClientRendererMethod" size="small" placeholder="客户端渲染方法,按钮将经由该方法渲染,最终形成页面元素,需要返回最终元素的HTML对象" />
                            </td>
                        </tr>
                        <tr>
                            <td>参数：</td>
                            <td>
                                <a-input v-model:value="innerSaveButtonEditData.custClientRendererMethodPara" size="small" placeholder="客户端渲染方法的参数" />
                            </td>
                        </tr>
                        <tr>
                            <td>客户端渲染后方法：</td>
                            <td>
                                <a-input v-model:value="innerSaveButtonEditData.custClientRendererAfterMethod" size="small" placeholder="客户端渲染后调用方法,经过默认的渲染,无返回值" />
                            </td>
                        </tr>
                        <tr>
                            <td>参数：</td>
                            <td>
                                <a-input v-model:value="innerSaveButtonEditData.custClientRendererAfterMethodPara" size="small" placeholder="客户端渲染后方法的参数" />
                            </td>
                        </tr>
                        <tr>
                            <td>客户端点击前方法：</td>
                            <td>
                                <a-input v-model:value="innerSaveButtonEditData.custClientClickBeforeMethod" size="small" placeholder="客户端点击该按钮时的前置方法,如果返回false将阻止默认调用" />
                            </td>
                        </tr>
                        <tr>
                            <td>参数：</td>
                            <td>
                                <a-input v-model:value="innerSaveButtonEditData.custClientClickBeforeMethodPara" size="small" placeholder="客户端点击前方法的参数" />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </a-tab-pane>
            </a-tabs>
            <div class="button-outer-wrap" style="padding-top:4px">
                <div class="button-inner-wrap" style="margin-right: 4px">
                    <a-button type="primary" @click="saveInnerSaveButtonToList()"> 保 存</a-button>
                    <a-button @click="handleClose('innerFormSaveButtonWrap')">关 闭</a-button>
                </div>
            </div>
        </div>
        <div ref="innerFormJsClientButtonWrap" class="general-edit-page-wrap html-design-plugin-dialog-wraper" style="display: none;margin-top: 0px">
            <a-tabs tab-position="top" size="small" type="card">
                <a-tab-pane key="bindInfo" tab="绑定信息">
                    <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                        <colgroup>
                            <col style="width: 80px" />
                            <col style="width: 220px" />
                            <col style="width: 100px" />
                            <col />
                        </colgroup>
                        <tbody>
                        <tr>
                            <td>标题：</td>
                            <td>
                                <a-input v-model:value="innerJsClientButtonEditData.caption" />
                            </td>
                            <td>保存并关闭：</td>
                            <td>
                                <a-radio-group type="button" style="margin: auto" v-model:value="innerJsClientButtonEditData.execAndClose">
                                    <a-radio-button value="true">是</a-radio-button>
                                    <a-radio-button value="false">否</a-radio-button>
                                </a-radio-group>
                            </td>
                        </tr>
                        <tr>
                            <td>动作：</td>
                            <td colspan="3">
                                <a-radio-group type="button" style="margin: auto" v-model:value="innerJsClientButtonEditData.actionType">
                                    <a-radio-button value="reloadData">重新加载</a-radio-button>
                                    <a-radio-button value="callJsMethod">调用JS方法</a-radio-button>
                                </a-radio-group>
                            </td>
                        </tr>
                        <tr>
                            <td>执行方法：</td>
                            <td colspan="3">
                                <a-input v-model:value="innerJsClientButtonEditData.callJsMethod" placeholder="调用JS方法" />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </a-tab-pane>
                <a-tab-pane key="devExtend" tab="开发扩展">
                    <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                        <colgroup>
                            <col style="width: 150px" />
                            <col />
                        </colgroup>
                        <tbody>
                        <tr>
                            <td>ID：</td>
                            <td>
                                <a-input v-model:value="innerJsClientButtonEditData.id" size="small" placeholder="" />
                            </td>
                        </tr>
                        <tr>
                            <td>服务端解析类：</td>
                            <td>
                                <a-input v-model:value="innerJsClientButtonEditData.custServerResolveMethod" size="small" placeholder="按钮进行服务端解析时,类全称,将调用该类,需要实现接口IFormButtonCustResolve" />
                            </td>
                        </tr>
                        <tr>
                            <td>参数：</td>
                            <td>
                                <a-input v-model:value="innerJsClientButtonEditData.custServerResolveMethodPara" size="small" placeholder="服务端解析类的参数" />
                            </td>
                        </tr>
                        <tr>
                            <td>客户端渲染方法：</td>
                            <td>
                                <a-input v-model:value="innerJsClientButtonEditData.custClientRendererMethod" size="small" placeholder="客户端渲染方法,按钮将经由该方法渲染,最终形成页面元素,需要返回最终元素的HTML对象" />
                            </td>
                        </tr>
                        <tr>
                            <td>参数：</td>
                            <td>
                                <a-input v-model:value="innerJsClientButtonEditData.custClientRendererMethodPara" size="small" placeholder="客户端渲染方法的参数" />
                            </td>
                        </tr>
                        <tr>
                            <td>客户端渲染后方法：</td>
                            <td>
                                <a-input v-model:value="innerJsClientButtonEditData.custClientRendererAfterMethod" size="small" placeholder="客户端渲染后调用方法,经过默认的渲染,无返回值" />
                            </td>
                        </tr>
                        <tr>
                            <td>参数：</td>
                            <td>
                                <a-input v-model:value="innerJsClientButtonEditData.custClientRendererAfterMethodPara" size="small" placeholder="客户端渲染后方法的参数" />
                            </td>
                        </tr>
                        <tr>
                            <td>客户端点击前方法：</td>
                            <td>
                                <a-input v-model:value="innerJsClientButtonEditData.custClientClickBeforeMethod" size="small" placeholder="客户端点击该按钮时的前置方法,如果返回false将阻止默认调用" />
                            </td>
                        </tr>
                        <tr>
                            <td>参数：</td>
                            <td>
                                <a-input v-model:value="innerJsClientButtonEditData.custClientClickBeforeMethodPara" size="small" placeholder="客户端点击前方法的参数" />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </a-tab-pane>
            </a-tabs>
            <div class="button-outer-wrap" style="padding-top:4px">
                <div class="button-inner-wrap" style="margin-right: 4px">
                    <a-button type="primary" @click="saveInnerJsClientButtonToList()"> 保 存</a-button>
                    <a-button @click="handleClose('innerFormJsClientButtonWrap')">关 闭</a-button>
                </div>
            </div>
        </div>
        <div style="height: 304px;width: 100%">
            <div style="float: left;width: 87%">
                <a-table width="100%" bordered :columns="columnsConfig" :data-source="tableData"
                         class="iv-list-table"
                         size="small" :scroll="{ y:210 }">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'id'">
                            <span class="a-table-action">
                                <i class="las la-edit" v-if="record.buttonType!='关闭按钮'" @click="edit(record.id,{row:record})"></i>
                                <i class="las la-times-circle" @click="del(record.id,{row:record})"></i>
                                <i class="las la-angle-up" @click="moveUp(record.id,{row:record})"></i>
                                <i class="las la-angle-down" @click="moveDown(record.id,{row:record})"></i>
                            </span>
                        </template>
                    </template>
                </a-table>
            </div>
            <div style="float: right;width: 11%;margin-left: 8px">
                <div class="ant-btn-group-vertical">
                    <a-button type="primary" @click="addInnerFormSaveButton()" class="green-btn">保存按钮</a-button>
                    <a-button type="primary" @click="addInnerFormCloseButton()">关闭按钮</a-button>
                    <a-button type="primary" @click="addInnerFormJsClientButton()">脚本按钮</a-button>
                    <a-button disabled>意见按钮</a-button>
                    <a-button disabled>流程按钮</a-button>
                    <a-button disabled>拷贝Json</a-button>
                    <a-button disabled>黏贴Json</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import remoteRestInterface from "../../Remote/RemoteRestInterface.js"

export default {
    name: "inner-form-button-list-comp",
    props:["formId"],
    data: function () {
        var _self=this;

        return {
            columnsConfig: [
                {
                    title: '标题',
                    key: 'caption',
                    dataIndex:"caption",
                    align: "center"
                }, {
                    title: '类型',
                    key: 'buttonType',
                    dataIndex:"buttonType",
                    align: "center"
                }, {
                    title: '操作',
                    width: 140,
                    key: 'id',
                    dataIndex:"id",
                    align: "center"
                    /*render: function (h, params) {
                        var buttons=[];
                        if(params.row.buttonType!="关闭按钮"){
                            buttons.push(ListPageUtility.IViewTableInnerButton.EditButton(h,params,"id",_self));
                        }
                        buttons.push(ListPageUtility.IViewTableInnerButton.DeleteButton(h,params,"id",_self));
                        buttons.push(ListPageUtility.IViewTableInnerButton.MoveUpButton(h,params,"id",_self));
                        buttons.push(ListPageUtility.IViewTableInnerButton.MoveDownButton(h,params,"id",_self));
                        return h('div',{class: "list-row-button-wrap"},buttons);
                    }*/
                }
            ],
            tableData: [
                /*{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                }*/
            ],
            innerSaveButtonEditData:{
                caption:"",
                saveAndClose:"true",
                apis:[],
                fields:[],
                //开发扩展
                id:"",
                buttonType:"保存按钮",
                custServerResolveMethod:"",
                custServerResolveMethodPara:"",
                custClientRendererMethod:"",
                custClientRendererMethodPara:"",
                custClientRendererAfterMethod:"",
                custClientRendererAfterMethodPara:"",
                custClientClickBeforeMethod:"",
                custClientClickBeforeMethodPara:"",
            },
            api:{
                acInterface: {
                    getAPIData: "/Rest/Builder/ApiItem/GetAPISForZTreeNodeList"
                },
                apiTreeObj: null,
                apiTreeSetting: {
                    view: {
                        dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
                        showLine: true,//是否显示节点之间的连线
                        fontCss: {'color': 'black', 'font-weight': 'normal'}
                    },
                    check: {
                        enable: false,
                        nocheckInherit: false,
                        chkStyle: "radio",
                        radioType: "all"
                    },
                    data: {
                        key: {
                            name: "text"
                        },
                        simpleData: {//简单数据模式
                            enable: true,
                            idKey: "id",
                            pIdKey: "parentId",
                            rootPId: "-1"// 1
                        }
                    },
                    callback: {
                        //点击树节点事件
                        onClick: function (event, treeId, treeNode) {
                            //if (treeNode.nodeTypeName == "DataSet") {
                            _self.api.apiSelectData=treeNode;
                            //}
                        }
                    }
                },
                apiData:null,
                apiSelectData: null,
                editTableObject: null,
                editTableConfig: {
                    Status: "Edit",
                    AddAfterRowEvent: null,
                    DataField: "fieldName",
                    Templates: [
                        {
                            Title: "API名称",
                            BindName: "value",
                            Renderer: "EditTable_Label",
                            TitleCellClassName: "TitleCell",
                            Formater:function (value) {
                                return _self.getAPIText(value);
                            }
                            /*ClientDataSource: _self.api.apiSelectData*/
                        }, {
                            Title: "调用顺序",
                            BindName: "runTime",
                            Renderer: "EditTable_Select",
                            ClientDataSource: [{"Text": "之前", "Value": "之前"}, {"Text": "之后", "Value": "之后"}],
                            Width: 100
                        }
                    ],
                    RowIdCreater: function () {
                    },
                    TableClass: "edit-table",
                    RendererTo: "apiContainer",
                    TableId: "apiContainerTable",
                    TableAttrs: {cellpadding: "1", cellspacing: "1", border: "1"}
                }
            },
            field:{
                acInterface: {
                    getFormMainTableFields: "/Rest/Builder/Form/GetFormMainTableFields",
                },
                editTableObject:null,
                editTableConfig:{
                    Status: "Edit",
                    AddAfterRowEvent: null,
                    DataField: "fieldName",
                    Templates: [
                        {
                            Title: "表名标题",
                            BindName: "tableName",
                            Renderer: "EditTable_Label"
                        }, {
                            Title: "字段标题",
                            BindName: "fieldName",
                            Renderer: "EditTable_Select"
                        },{
                            Title:"默认值",
                            BindName:"defaultValue",
                            Renderer:"EditTable_SelectDefaultValue",
                            Hidden:false
                        },{
                            Title: "表ID",
                            BindName: "tableId",
                            Renderer: "EditTable_Label"
                        }
                    ],
                    RowIdCreater: function () {
                    },
                    TableClass: "edit-table",
                    RendererTo: "fieldContainer",
                    TableId: "fieldContainerTable",
                    TableAttrs: {cellpadding: "1", cellspacing: "1", border: "1"}
                }
            },
            oldFormId:"",
            innerJsClientButtonEditData:{
                caption:"",
                execAndClose:"true",
                //开发扩展
                id:"",
                buttonType:"脚本按钮",
                actionType:"reloadData",
                callJsMethod:"",
                custServerResolveMethod:"",
                custServerResolveMethodPara:"",
                custClientRendererMethod:"",
                custClientRendererMethodPara:"",
                custClientRendererAfterMethod:"",
                custClientRendererAfterMethodPara:"",
                custClientClickBeforeMethod:"",
                custClientClickBeforeMethodPara:"",
            }
        }
    },
    mounted:function(){
        this.bindAPITreeAndInitEditTable(null);
    },
    methods:{
        ready:function(tableDataJson){
            if(tableDataJson!=null&&tableDataJson!=""){
                this.tableData=JsonUtility.StringToJson(tableDataJson);
            }

            //由于切换绑定窗体时,绑定的主表可能不一样,所以不在页面初始化时绑定字段选择的表.
            //this.bindTableFields(null);

            this.bindAPITreeAndInitEditTable(null);
        },
        getJson:function () {
            //debugger;
            return JsonUtility.JsonToString(this.tableData);
        },
        /*setJson:function (tableDataJson) {
            if(tableDataJson!=null&&tableDataJson!=""){
                this.tableData=JsonUtility.StringToJson(tableDataJson);
            }
        },*/
        //region 列表按钮相关方法
        edit:function(id,params){
            //console.log(params);
            if(params.row["buttonType"]=="保存按钮"){
                this.editInnerFormSaveButton(params);
            }
            else if(params.row["buttonType"]=="脚本按钮"){
                this.editInnerFormJsClientButton(params);
            }
        },
        del:function(id,params){
            for(var i=0;i<this.tableData.length;i++) {
                if(this.tableData[i].id==id) {
                    ArrayUtility.Delete(this.tableData,i);
                }
            }
        },
        moveUp:function(id,params){
            for(var i=0;i<this.tableData.length;i++) {
                if(this.tableData[i].id==id) {
                    ArrayUtility.MoveUp(this.tableData,i);
                    return;
                    //console.log(id);
                }
            }
        },
        moveDown:function(id,params){
            //console.log(this.tableData);
            for(var i=0;i<this.tableData.length;i++) {
                if(this.tableData[i].id==id) {
                    ArrayUtility.MoveDown(this.tableData,i);
                    return
                    //console.log(id);
                }
            }
        },
        //endregion

        //region 保存按钮
        addInnerFormSaveButton:function(){
            //debugger;
            if(this.formId!=null&&this.formId!="") {
                this.editSaveButtonStatuc="add";
                //重置编辑表单
                this.resetInnerSaveButtonData();

                var elem = this.$refs.innerFormSaveButtonWrap;

                DialogUtility.DialogElemObj(elem, {
                    modal: true,
                    height: 520,
                    width: 720,
                    title: "窗体内保存按钮"
                });

                $(window.document).find(".ui-widget-overlay").css("zIndex", 10100);
                $(window.document).find(".ui-dialog").css("zIndex", 10101);

                this.innerSaveButtonEditData.id = "inner_form_save_button_" + StringUtility.Timestamp();

                this.bindTableFields(null);
                this.clearAPI();
            }
            else{
                DialogUtility.AlertText("请先设置绑定的窗体!");
            }
        },
        handleClose:function(dialogElem){
            DialogUtility.CloseDialogElem(this.$refs[dialogElem]);
        },
        editInnerFormSaveButton:function(params){
            this.addInnerFormSaveButton();
            this.innerSaveButtonEditData=JsonUtility.CloneStringify(params.row);
            this.editSaveButtonStatuc="edit";

            //if(this.isLoadTableField){
            //    this.field.editTableObject.RemoveAllRow();
            //    this.field.editTableObject.LoadJsonData(this.innerSaveButtonEditData.fields);
            //}
            this.bindAPITreeAndInitEditTable(this.innerSaveButtonEditData.apis);
            this.bindTableFields(this.innerSaveButtonEditData.fields);
        },
        resetInnerSaveButtonData:function(){
            this.innerSaveButtonEditData={
                caption:"",
                saveAndClose:"true",
                apis:[],
                fields:[],
                id:"",
                buttonType:"保存按钮",
                custServerResolveMethod:"",
                custServerResolveMethodPara:"",
                custClientRendererMethod:"",
                custClientRendererMethodPara:"",
                custClientRendererAfterMethod:"",
                custClientRendererAfterMethodPara:"",
                custClientClickBeforeMethod:"",
                custClientClickBeforeMethodPara:"",
            };
            //this.api.editTableObject.RemoveAllRow();
            //if(this.field.editTableObject) {
            //    this.field.editTableObject.RemoveAllRow();
            //}
        },
        saveInnerSaveButtonToList:function(){
            //保存到列表
            var singleInnerFormButtonData=JsonUtility.CloneSimple(this.innerSaveButtonEditData);
            this.api.editTableObject.CompletedEditingRow();
            singleInnerFormButtonData.apis=this.api.editTableObject.GetSerializeJson();
            this.field.editTableObject.CompletedEditingRow();
            singleInnerFormButtonData.fields=this.field.editTableObject.GetSerializeJson();
            //debugger;
            if(this.editSaveButtonStatuc=="add") {
                //存储到列表数据中
                this.tableData.push(singleInnerFormButtonData);
            }
            else{
                for(var i=0;i<this.tableData.length;i++){
                    if(this.tableData[i].id==singleInnerFormButtonData.id) {
                        //this.tableData[i]=singleInnerFormButtonData;
                        //Vue.set(this.tableData, i, singleInnerFormButtonData);
                        //this.$set(this.tableData, i, singleInnerFormButtonData);
                        this.tableData[i]=singleInnerFormButtonData;
                    }
                }
            }

            //console.log(singleInnerFormButtonData);

            this.handleClose("innerFormSaveButtonWrap");
        },
        //region 字段列表
        bindTableFields:function(oldData) {

            if(this.oldFormId!=this.formId) {
                /*AjaxUtility.Post(this.field.acInterface.getFormMainTableFields, {formId: this.formId}, function (result) {
                    console.log(result);
                    var fieldsData = [];

                    for (var i = 0; i < result.data.length; i++) {
                        fieldsData.push({
                            Value: result.data[i].fieldName,
                            Text: result.data[i].fieldCaption
                        });
                    }
                    this.field.editTableConfig.Templates[0].DefaultValue = {
                        Type: "Const",
                        Value: result.data[0].tableName
                    };
                    this.field.editTableConfig.Templates[3].DefaultValue = {
                        Type: "Const",
                        Value: result.data[0].tableId
                    };
                    this.field.editTableConfig.Templates[1].ClientDataSource = fieldsData;

                    if(!this.field.editTableObject) {
                        this.field.editTableObject = Object.create(EditTable);
                        this.field.editTableObject.Initialization(this.field.editTableConfig);
                    }

                    this.oldFormId = this.formId;

                    if(oldData){
                        this.field.editTableObject.LoadJsonData(oldData);
                    }

                }, this);*/
                remoteRestInterface.getFormMainTableFields({formId: this.formId},(result)=>{
                    console.log(result);
                    let fieldsData = [];

                    for (let i = 0; i < result.data.length; i++) {
                        fieldsData.push({
                            Value: result.data[i].fieldName,
                            Text: result.data[i].fieldCaption
                        });
                    }
                    this.field.editTableConfig.Templates[0].DefaultValue = {
                        Type: "Const",
                        Value: result.data[0].tableName
                    };
                    this.field.editTableConfig.Templates[3].DefaultValue = {
                        Type: "Const",
                        Value: result.data[0].tableId
                    };
                    this.field.editTableConfig.Templates[1].ClientDataSource = fieldsData;

                    if(!this.field.editTableObject) {
                        this.field.editTableObject = Object.create(EditTable);
                        this.field.editTableObject.Initialization(this.field.editTableConfig);
                    }

                    this.oldFormId = this.formId;

                    if(oldData){
                        this.field.editTableObject.LoadJsonData(oldData);
                    }
                })
            }
            if(this.field.editTableObject){
                this.field.editTableObject.RemoveAllRow();
            }
            if(oldData&&this.field.editTableObject){
                this.field.editTableObject.LoadJsonData(oldData);
            }
        },
        addField:function(){
            this.field.editTableObject.AddEditingRowByTemplate();
        },
        removeField:function(){
            this.field.editTableObject.RemoveRow();
        },
        //endregion

        //region api列表1
        bindAPITreeAndInitEditTable: function (oldData) {
            //var _self = this;
            if(!this.api.apiData) {
                /*AjaxUtility.Post(this.api.acInterface.getAPIData, {
                    groupType:"API_GROUP_BUILDER_BUTTON_ROOT"
                }, function (result) {
                    if (result.success) {
                        this.api.apiData = result.data;
                        if (result.data != null && result.data.length > 0) {
                            for (var i = 0; i < result.data.length; i++) {
                                if (result.data[i].nodeTypeName == "Group") {
                                    result.data[i].icon =  "/Themes/Png16X16/package.png";
                                } else {
                                    result.data[i].icon =  "/Themes/Png16X16/application_view_columns.png";
                                }
                            }
                        }

                        // _self.api.treeData = result.data;
                        this.api.apiTreeObj = $.fn.zTree.init($("#apiZTreeUL"), this.api.apiTreeSetting, result.data);
                        this.api.apiTreeObj.expandAll(true);
                        fuzzySearchTreeObj(this.api.apiTreeObj, this.$refs.txt_search_api_text.$refs.input, null, true);
                    } else {
                        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                    }
                }, this);*/
                remoteRestInterface.getAPISForZTreeNodeList({
                    groupType:"API_GROUP_BUILDER_BUTTON_ROOT"
                },(result)=>{
                    if (result.success) {
                        this.api.apiData = result.data;
                        if (result.data != null && result.data.length > 0) {
                            for (let i = 0; i < result.data.length; i++) {
                                if (result.data[i].nodeTypeName == "Group") {
                                    result.data[i].icon =  "Images/Png16X16/package.png";
                                } else {
                                    result.data[i].icon =  "Images/Png16X16/application_view_columns.png";
                                }
                            }
                        }

                        // _self.api.treeData = result.data;
                        this.api.apiTreeObj = $.fn.zTree.init($("#apiZTreeUL"), this.api.apiTreeSetting, result.data);
                        this.api.apiTreeObj.expandAll(true);
                        fuzzySearchTreeObj(this.api.apiTreeObj, this.$refs.txt_search_api_text.input, null, true);
                    } else {
                        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                    }
                })

                this.api.editTableObject = Object.create(EditTable);
                this.api.editTableObject.Initialization(this.api.editTableConfig);
            }
            this.api.editTableObject.RemoveAllRow();
            if(oldData) {
                this.api.editTableObject.LoadJsonData(oldData);
            }
        },
        getApiConfigAndBindToTable:function(){
            return;
            var _self=this;
            AjaxUtility.Post(this.api.acInterface.getButtonApiConfig,{
            },function (result) {
                //console.log(result);
                //var apiSelectData
                var apiSelectData=[];

                for(var i=0;i<result.data.length;i++){
                    var group={
                        Group:result.data[i].name
                    }
                    var options=[];
                    for(var j=0;j<result.data[i].buttonAPIVoList.length;j++){
                        options.push({
                            Value:result.data[i].buttonAPIVoList[j].id,
                            Text:result.data[i].buttonAPIVoList[j].name
                        });
                    }
                    group["Options"]=options;
                    apiSelectData.push(group);
                }

                /*configSource=[{
                    group:"name",
                    options:[{
                        value:"1",
                        text:"2"
                    },{
                        value:"",
                        text:""
                    }]
                },{
                    group:"name",
                    options:[{
                        value:"",
                        text:""
                    },{
                        value:"",
                        text:""
                    }]
                }]*/

                _self.api.editTableConfig.Templates[0].ClientDataSource=apiSelectData;
                _self.api.editTableObject = Object.create(EditTable);
                _self.api.editTableObject.Initialization(_self.api.editTableConfig);
            },this);
        },
        addAPI:function () {
            //console.log(this.api.apiSelectData);
            if(this.api.apiSelectData.nodeTypeName=="API") {
                this.api.editTableObject.AddEditingRowByTemplate([], {
                    value: this.api.apiSelectData.value,
                    runTime: "之后"
                });
            }
            else {
                DialogUtility.AlertText("请选择需要添加的API!");
            }
        },
        removeAPI:function () {
            this.api.editTableObject.RemoveRow();
        },
        clearAPI:function(){
            this.api.editTableObject.RemoveAllRow();
        },
        getAPIText:function (value) {
            //console.log(value);
            for (var i = 0; i < this.api.apiData.length; i++) {
                //debugger;
                //console.log(this.api.apiData[i]);
                if(this.api.apiData[i].nodeTypeName=="API"){
                    if(this.api.apiData[i].value==value){
                        return this.api.apiData[i].text;
                    }
                }
            }
            return "";
        },
        //endregion
        //endregion

        //region 关闭按钮
        addInnerFormCloseButton:function () {
            var closeButtonData={
                caption:"关闭",
                id:"inner_close_button_"+StringUtility.Timestamp(),
                buttonType:"关闭按钮"
            };
            this.tableData.push(closeButtonData);
        },
        //endregion

        //region 脚本按钮
        addInnerFormJsClientButton:function () {
            this.editJsClientButtonStatuc="add";
            //重置编辑表单
            this.resetInnerJsClientButtonData();

            var elem = this.$refs.innerFormJsClientButtonWrap;

            DialogUtility.DialogElemObj(elem, {
                modal: true,
                height: 520,
                width: 720,
                title: "窗体内脚本按钮"
            });

            $(window.document).find(".ui-widget-overlay").css("zIndex", 10100);
            $(window.document).find(".ui-dialog").css("zIndex", 10101);

            this.innerJsClientButtonEditData.id = "inner_form_js_client_button_" + StringUtility.Timestamp();
        },
        editInnerFormJsClientButton:function(params){
            this.addInnerFormJsClientButton();
            this.innerJsClientButtonEditData=JsonUtility.CloneStringify(params.row);
            this.editJsClientButtonStatuc="edit";
        },
        resetInnerJsClientButtonData:function(){
            this.innerJsClientButtonEditData={
                caption:"",
                execAndClose:"true",
                id:"",
                buttonType:"脚本按钮",
                actionType:"reloadData",
                callJsMethod:"",
                custServerResolveMethod:"",
                custServerResolveMethodPara:"",
                custClientRendererMethod:"",
                custClientRendererMethodPara:"",
                custClientRendererAfterMethod:"",
                custClientRendererAfterMethodPara:"",
                custClientClickBeforeMethod:"",
                custClientClickBeforeMethodPara:"",
            };
        },
        saveInnerJsClientButtonToList:function () {
            //debugger;
            var singleInnerFormButtonData=JsonUtility.CloneSimple(this.innerJsClientButtonEditData);
            if(this.editJsClientButtonStatuc=="add") {
                //存储到列表数据中
                this.tableData.push(singleInnerFormButtonData);
            }
            else{
                for(var i=0;i<this.tableData.length;i++){
                    if(this.tableData[i].id==singleInnerFormButtonData.id) {
                        //this.tableData[i]=singleInnerFormButtonData;
                        Vue.set(this.tableData, i, singleInnerFormButtonData);
                    }
                }
            }

            //console.log(singleInnerFormButtonData);

            this.handleClose("innerFormJsClientButtonWrap");
        }
        //endregion
    }
}
</script>

<style scoped>

</style>