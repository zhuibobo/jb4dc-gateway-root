<template>
    <div class="html-design-plugin-dialog-wraper" v-cloak>
        <a-tabs tab-position="top" size="small" type="card">
            <a-tab-pane key="bindInfo" tab="绑定信息">
                <div style="width: 760px;margin: auto">
                    <div style="width: 300px;height: 490px;border: #ddddf1 1px solid;border-radius: 4px;padding: 10px 20px 10px 10px;float: left">
                        <a-divider orientation="left" style="font-size: 12px">参数设置</a-divider>
                        <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                            <colgroup>
                                <col style="width: 80px" />
                                <col />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <td>绑定数据：</td>
                                    <td>
                                        <a-input v-model:value="normalProps.datasetName" placeholder=""></a-input>
                                    </td>
                                </tr>
                                <tr>
                                    <td>每页条数：</td>
                                    <td>
                                        <a-input-number v-model:value="normalProps.pageSize"></a-input-number>
                                    </td>
                                </tr>
                                <tr>
                                    <td>条件：</td>
                                    <td>
                                        <a-textarea v-model:value="normalProps.condition" type="textarea" :autoSize="{minRows: 6,maxRows: 6}"></a-textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <td>备注：</td>
                                    <td>
                                        <a-textarea v-model:value="normalProps.desc" type="textarea" :autoSize="{minRows: 8,maxRows: 8}"></a-textarea>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style="width: 450px;height: 490px;border: #ddddf1 1px solid;border-radius: 4px;padding: 10px 20px 10px 10px;float: right">
                        <a-divider orientation="left" style="font-size: 12px">绑定数据集</a-divider>
                        <dataset-simple-select-comp @on-selected-dataset="selectedDataset"></dataset-simple-select-comp>
                    </div>
                </div>
            </a-tab-pane>
            <a-tab-pane key="devExtend" tab="开发扩展">
                <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                    <colgroup>
                        <col style="width: 170px" />
                        <col />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td>
                                服务端数据API：
                            </td>
                            <td>
                                <a-input v-model:value="normalProps.custServerGetDataAPI" placeholder="为该部件提供数据的API,需要实现接口IListLayoutContainerCustDataSource"></a-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                API参数：
                            </td>
                            <td>
                                <a-input v-model:value="normalProps.custServerGetDataAPIPara" placeholder="服务端数据API的相关参数"></a-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                客户端数据处理方法API：
                            </td>
                            <td>
                                <a-input v-model:value="normalProps.custClientResolveDataMethod" placeholder="数据加载到客户端之后,将经过该方法进行一次处理"></a-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                API参数：
                            </td>
                            <td>
                                <a-input v-model:value="normalProps.custClientResolveDataMethodPara" placeholder="客户端数据处理方法的相关参数"></a-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                服务端解析类API：
                            </td>
                            <td>
                                <a-input v-model:value="normalProps.custServerResolveMethod" placeholder="服务端解析,保存模版时候调用一次,类全称,需要实现接口IListLayoutContainerCustResolve"></a-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                API参数：
                            </td>
                            <td>
                                <a-input v-model:value="normalProps.custServerResolveMethodPara" placeholder="服务端解析类的相关参数"></a-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                客户端渲染方法API：
                            </td>
                            <td>
                                <a-input v-model:value="normalProps.custClientRendererMethod" placeholder="服务端解析,保存模版时候调用一次,类全称,需要实现接口IListLayoutContainerCustResolve"></a-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                API参数：
                            </td>
                            <td>
                                <a-input v-model:value="normalProps.custClientRendererMethodPara" placeholder="客户端渲染方法的相关参数"></a-input>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </a-tab-pane>
            <a-tab-pane key="baseInfo" tab="基础信息">
                <uid-control-base-info v-model:value="baseInfo">
                </uid-control-base-info>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import GeneralPlugin from "../../GeneralPlugin";
export default {
    name: "WLDCT_LayoutContainerProperty",
    data(){
        return {
            baseInfo: GeneralPlugin.defaultProps.baseInfo,
            normalProps:{
                datasetName:"",
                datasetId:"",
                pageSize:20,
                desc:"",
                condition:"",
                //开发扩展
                custServerGetDataAPI:"",
                custServerGetDataAPIPara:"",
                custClientResolveDataMethod:"",
                custClientResolveDataMethodPara:"",
                custServerResolveMethod:"",
                custServerResolveMethodPara:"",
                custClientRendererMethod:"",
                custClientRendererMethodPara:""
            }
        }
    },
    mounted:function () {

    },
    methods: {
        selectedDataset:function(treeNode){
            this.normalProps.datasetName=treeNode.text;
            this.normalProps.datasetId=treeNode.id;
        },
        ready:function(actionName){
            this.baseInfo.id="list_layout_container_"+StringUtility.Timestamp();
            this.baseInfo.name=this.baseInfo.id;
        },
        setBindCompleted:function(bindToField,defaultValue,validateRules){
            this.bindToField=bindToField;
            this.defaultValue=defaultValue;
            this.validateRules=validateRules;
        },
        getControlProps:function () {
            if(this.normalProps.datasetName==""){
                this.normalProps.datasetId="";
            }
            this.baseInfo.serialize="false";
            var result = {
                success: true,
                baseInfo: this.baseInfo,
                normalProps: this.normalProps
            }
            return result;
        },
        setControlProps:function ($elem,props) {
            if(!$elem){
                return;
            }
            this.baseInfo = props.baseInfo ? props.baseInfo : this.baseInfo;
            let datasetName = $elem.attr("datasetname");
            let datasetId = $elem.attr("datasetid");
            let pageSize = $elem.attr("pagesize");
            let desc = $elem.attr("desc");
            let condition = $elem.attr("condition");
            let serverGetDataAPI = $elem.attr("servergetdataapi");
            let serverGetDataAPIPara = $elem.attr("servergetdataapipara");
            let clientResolveDataMethod = $elem.attr("clientresolvedatamethod");
            this.normalProps.datasetName = datasetName;
            this.normalProps.datasetId = datasetId;
            if (pageSize!=""&&pageSize!="null") {
                this.normalProps.pageSize = parseInt(pageSize);
            }
            this.normalProps.desc = desc;
            this.normalProps.condition = condition;
            this.normalProps.serverGetDataAPI = serverGetDataAPI;
            this.normalProps.serverGetDataAPIPara = serverGetDataAPIPara;
            this.normalProps.clientResolveDataMethod = clientResolveDataMethod;
        }
    }
}
</script>

<style scoped>

</style>