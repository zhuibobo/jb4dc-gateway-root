<template>
    <div class="html-design-plugin-dialog-wraper" v-cloak>
        <a-tabs tab-position="top" size="small" type="card">
            <a-tab-pane key="bindInfo" tab="绑定信息">
                <list-table-label-bind-to-comp ref="listTableLabelBindToComp">
                </list-table-label-bind-to-comp>
            </a-tab-pane>
            <a-tab-pane key="labelSetting" tab="标签设置" :forceRender="true">
                <div v-show="showProp">
                    <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                        <colgroup>
                            <col style="width: 120px"/>
                            <col/>
                        </colgroup>
                        <tbody>
                        <tr>
                            <td>
                                格式化：
                            </td>
                            <td>
                                <select v-model="normalProps.defFormat">
                                    <option value="notFormat">无</option>
                                    <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                                    <option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss</option>
                                    <option value="convertOrganIdToOrganName">机构ID转机构名称</option>
                                    <option value="convertDDValueToDDText">字典值转Text</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                数据字典：
                            </td>
                            <td colspan="3">
                                <div class="fleft">绑定数据字典:【<span
                                    style="color: red">{{ normalProps.dictionaryGroupDataSourceText }}</span>】
                                </div>
                                <button class="btn-select fright" @click="beginSelectDictionaryGroup">...</button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                服务端解析类：
                            </td>
                            <td>
                                <a-input v-model:value="normalProps.custServerResolveMethod"
                                         placeholder="按钮进行服务端解析时,保存模版时候调用,类全称,需要实现接口IListTableLabelCustResolve"/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                参数：
                            </td>
                            <td>
                                <a-input v-model:value="normalProps.custServerResolveMethodPara"
                                         placeholder="服务端解析类的参数"/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                客户端渲染方法：
                            </td>
                            <td>
                                <a-input v-model:value="normalProps.custClientRendererMethod"
                                         placeholder="客户端渲染方法,生成前端页面时调动,最终形成页面元素,需要返回最终元素的HTML对象"/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                参数：
                            </td>
                            <td>
                                <a-input v-model:value="normalProps.custClientRendererMethodPara"
                                         placeholder="客户端渲染方法的参数"/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                省略长度：
                            </td>
                            <td>
                                <a-input v-model:value="normalProps.omitLength" placeholder="客户端渲染方法的参数"/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div name="selectDictionary" v-show="showSelectDictionary" style="position:relative;height: 490px">
                    <div
                        style="position:absolute;top: 0px;bottom: 10px;right: 0px;left: 0px;overflow-y: auto;overflow-x: hidden">
                        <ul id="html-design-plugin-dialog-wraper-dd-zTreeUL" class="ztree"></ul>
                    </div>
                </div>
            </a-tab-pane>
            <a-tab-pane key="baseInfo" tab="基础信息">
                <uid-control-base-info v-model="baseInfo">
                </uid-control-base-info>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import GeneralPlugin from "../../GeneralPlugin";
import RemoteRestInterface from "../../../Remote/RemoteRestInterface";

export default {
    name: "WLDCT_ListTableLabelProperty",
    data() {
        return {
            acInterface: {
                getDDGroupTreeData: "/Rest/SystemSetting/Dict/DictionaryGroup/GetTreeData"
            },
            baseInfo: GeneralPlugin.defaultProps.baseInfo,
            defaultValue: GeneralPlugin.defaultProps.defaultValue,
            normalProps: {
                columnTableName: "",
                columnName: "",
                columnCaption: "",
                columnDataTypeName: "",
                targetButtonId: "",
                columnAlign: "居中对齐",
                //开发扩展
                defFormat: "notFormat",
                custServerResolveMethod: "",
                custServerResolveMethodPara: "",
                custClientRendererMethod: "",
                custClientRendererMethodPara: "",
                dictionaryGroupDataSourceText: "",
                dictionaryGroupDataSourceId: "",
                omitLength: "0"
            },
            dataSetId: null,
            buttons: [],
            showSelectDictionary: false,
            showEditStatic: false,
            showProp: true,
            ddGroupTreeObj: null,
            ddGroupTreeSetting: {
                async: {
                    enable: true,
                    // Ajax 获取数据的 URL 地址
                    url: ""
                },
                // 必须使用data
                data: {
                    key: {
                        name: "dictGroupText"
                    },
                    simpleData: {
                        enable: true,
                        idKey: "dictGroupId", // id编号命名
                        pIdKey: "dictGroupParentId",  // 父id编号命名
                        rootId: 0
                    }
                },
                // 回调函数
                callback: {
                    onClick: function (event, treeId, treeNode) {
                        var _self = this.getZTreeObj(treeId)._host;
                        _self.selectedDictionaryGroup(treeNode.dictGroupId, treeNode.dictGroupText);
                        //alert(treeNode.dictGroupId);
                        //_self.envGroupTreeNodeSelected(event,treeId,treeNode);
                    },
                    //成功的回调函数
                    onAsyncSuccess: function (event, treeId, treeNode, msg) {
                        appList.treeObj.expandAll(true);
                    }
                }
            }
        }
    },
    mounted: function () {
        this.initDDGroupTree();

    },
    methods: {
        ready: function (actionName, sel, parents) {
            /*this.baseInfo.id="lab_"+StringUtility.Timestamp();
            this.baseInfo.name=this.baseInfo.id;

            this.dataSetId=CKEditorPluginUtility.TryGetDataSetId(sel,parents);
            this.buttons=CKEditorPluginUtility.TryGetListButtonsInPluginPage();

            this.bindDataSetFieldTree();*/
        },
        bindDataSetFieldTree: function () {
            if (this.dataSetId) {
                //let dataSetPO=window.parent.listDesign.getDataSet(this.dataSetId);
                //this.$refs.listTableLabelBindToComp.init(dataSetPO,this.buttons);
                RemoteRestInterface.getDataSetData(this.dataSetId).then((response) => {
                    let dataSetPO = response.data.data;
                    this.$refs.listTableLabelBindToComp.init(dataSetPO, this.buttons);
                });
            } else {
                DialogUtility.AlertText("请先设定DataSet");
            }
        },
        getControlProps: function () {
            let bindData = this.$refs.listTableLabelBindToComp.getData();
            //for(var key in this.normalProps)
            let result = {
                success: true,
                baseInfo: this.baseInfo,
                normalProps: {
                    columnTableName: bindData.bindProp.columnTableName,
                    columnName: bindData.bindProp.columnName,
                    columnCaption: bindData.bindProp.columnCaption,
                    columnDataTypeName: bindData.bindProp.columnDataTypeName,
                    targetButtonId: bindData.bindProp.targetButtonId,
                    columnAlign: bindData.bindProp.columnAlign,
                    //开发扩展
                    defFormat: this.normalProps.defFormat,
                    custServerResolveMethod: this.normalProps.custServerResolveMethod,
                    custServerResolveMethodPara: this.normalProps.custServerResolveMethodPara,
                    custClientRendererMethod: this.normalProps.custClientRendererMethod,
                    custClientRendererMethodPara: this.normalProps.custClientRendererMethodPara,
                    dictionaryGroupDataSourceText: this.normalProps.dictionaryGroupDataSourceText,
                    dictionaryGroupDataSourceId: this.normalProps.dictionaryGroupDataSourceId,
                    omitLength: this.normalProps.omitLength
                },
                defaultValue: bindData.defaultValue
            }
            return result;
        },
        setControlProps: function ($elem, props) {
            //console.log(props);;
            //debugger;
            this.dataSetId = GeneralPlugin.tryGetDataSetId($elem, $elem.parents());
            this.bindDataSetFieldTree();

            this.baseInfo = props.baseInfo ? props.baseInfo : this.baseInfo;
            //this.bindToSearchField = props.bindToSearchField ? props.bindToSearchField : this.bindToSearchField;
            this.defaultValue = props.defaultValue ? props.defaultValue : this.defaultValue;

            this.normalProps.columnTableName = $elem.attr("columntablename");
            this.normalProps.columnName = $elem.attr("columnname");
            this.normalProps.columnCaption = $elem.attr("columncaption");
            this.normalProps.columnDataTypeName = $elem.attr("columndatatypename");
            this.normalProps.targetButtonId = $elem.attr("targetbuttonid");
            this.normalProps.columnAlign = $elem.attr("columnalign") ? $elem.attr("columnalign") : this.normalProps.columnAlign;
            this.normalProps.custServerResolveMethod = $elem.attr("custserverresolvemethod");
            this.normalProps.custServerResolveMethodPara = $elem.attr("custserverresolvemethodpara");
            this.normalProps.custClientRendererMethod = $elem.attr("custclientrenderermethod");
            this.normalProps.custClientRendererMethodPara = $elem.attr("custclientrenderermethodpara");
            this.normalProps.dictionaryGroupDataSourceText = $elem.attr("dictionaryGroupDataSourceText");
            if (!this.normalProps.dictionaryGroupDataSourceText) {
                this.normalProps.dictionaryGroupDataSourceText = "";
            }
            this.normalProps.dictionaryGroupDataSourceId = $elem.attr("dictionaryGroupDataSourceId");
            if (!this.normalProps.dictionaryGroupDataSourceId) {
                this.normalProps.dictionaryGroupDataSourceId = "";
            }
            this.normalProps.omitLength = $elem.attr("omitLength");
            if (!this.normalProps.omitLength) {
                this.normalProps.omitLength = "";
            }
            if ($elem.attr("defformat")) {
                this.normalProps.defFormat = $elem.attr("defformat");
            }
            this.$refs.listTableLabelBindToComp.setData(this.normalProps, this.defaultValue);
        },
        beginSelectDictionaryGroup: function () {
            this.showSelectDictionary = true;
            this.showProp = false;
        },
        selectedDictionaryGroup: function (dictionaryGroupDataSourceId, dictionaryGroupDataSourceText) {
            this.normalProps.dictionaryGroupDataSourceId = dictionaryGroupDataSourceId;
            this.normalProps.dictionaryGroupDataSourceText = dictionaryGroupDataSourceText;
            this.showSelectDictionary = false;
            this.showProp = true;
        },
        initDDGroupTree: function () {
            /*AjaxUtility.Post(this.acInterface.getDDGroupTreeData, {}, function (result) {
                if(result.success){
                    if(result.data!=null&&result.data.length>0){
                        for(var i=0;i<result.data.length;i++) {
                        }
                    }
                    this.ddGroupTreeObj=$.fn.zTree.init($("#html-design-plugin-dialog-wraper-dd-zTreeUL"), this.ddGroupTreeSetting,result.data);
                    this.ddGroupTreeObj.expandAll(true);
                    this.ddGroupTreeObj._host=this;
                }
            }, this);*/
            RemoteRestInterface.getDictionaryEntityGroupTreeData({}).then((response) => {
                let result = response.data;
                if (result.success) {
                    if (result.data != null && result.data.length > 0) {
                        for (let i = 0; i < result.data.length; i++) {
                        }
                    }
                    this.ddGroupTreeObj = $.fn.zTree.init($("#html-design-plugin-dialog-wraper-dd-zTreeUL"), this.ddGroupTreeSetting, result.data);
                    this.ddGroupTreeObj.expandAll(true);
                    this.ddGroupTreeObj._host = this;
                }
            });
        }
    }
}
</script>

<style scoped>

</style>