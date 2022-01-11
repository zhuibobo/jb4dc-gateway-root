<template>
    <div style="width: 1024px;margin: auto">
        <div style="width: 500px;height: 610px;border: #ddddf1 1px solid;border-radius: 4px;padding: 10px 20px 10px 10px;float: left">
            <a-divider orientation="left" style="font-size: 12px">参数设置</a-divider>
            <table cellpadding="0" cellspacing="0" border="0" class="form-table">
                <colgroup>
                    <col style="width: 120px" />
                    <col />
                </colgroup>
                <tbody>
                <tr>
                    <td>列表名称：</td>
                    <td>
                        <a-input v-model:value="listResourceEntity.listName" placeholder="请输入列表名称"></a-input>
                    </td>
                </tr>
                <tr>
                    <td>唯一名称：</td>
                    <td>
                        <a-input v-model:value="listResourceEntity.listSingleName" placeholder="可以为空"></a-input>
                    </td>
                </tr>
                <tr>
                    <td>绑定数据集：</td>
                    <td>
                        <a-input v-model:value="listResourceEntity.listDatasetName" placeholder=""></a-input>
                    </td>
                </tr>
                <tr>
                    <td>数据集主键字段：</td>
                    <td>
                        <a-input v-model:value="listResourceEntity.listDatasetPrimaryKey" placeholder=""></a-input>
                    </td>
                </tr>
                <tr>
                    <td>每次解析：</td>
                    <td>
                        <a-radio-group type="button" style="margin: auto" v-model:value="listResourceEntity.listEveryTimeResolve">
                            <a-radio-button value="是">是</a-radio-button>
                            <a-radio-button value="否">否</a-radio-button>
                        </a-radio-group>
                    </td>
                </tr>
                <tr>
                    <td>每页条数：</td>
                    <td>
                        <a-input-number v-model:value="listResourceEntity.listDatasetPageSize"></a-input-number>
                    </td>
                </tr>
                <tr>
                    <td>主题：</td>
                    <td>
                        <a-select v-model:value="listResourceEntity.listTheme"  @change="changeTheme" style="width: 180px">
                            <a-select-option v-for="(item,key) in designThemes" :value="item.value" :key="key">{{item.name}}</a-select-option>
                        </a-select>
                    </td>
                </tr>
                <tr>
                    <td>备注：</td>
                    <td>
                        <a-textarea v-model:value="listResourceEntity.listDesc" type="textarea" :autoSize="{minRows: 12,maxRows: 12}"></a-textarea>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div style="width: 500px;height: 610px;border: #ddddf1 1px solid;border-radius: 4px;padding: 10px 20px 10px 10px;float: right">
            <a-divider orientation="left" style="font-size: 12px">绑定数据集</a-divider>
            <dataset-simple-select-comp @on-selected-dataset="selectedDataset"></dataset-simple-select-comp>
        </div>
    </div>
</template>

<script>

import GeneralPlugin from "../../Plugins/GeneralPlugin";
export default {
    name: "uid-app-list-base-info-comp",
    data(){
        return {
            acInterface:{
                getTablesDataUrl:"/Rest/Builder/DataStorage/DataBase/Table/GetTablesForZTreeNodeList",
                getPluginsConfig:"/Rest/Builder/HtmlDesign/WebListDesign/GetPluginsConfig",
                saveDataUrl:"/Rest/Builder/List/SaveEdit",
                getDataUrl:"/Rest/Builder/List/GetDetailData",
                getDataSetUrl:"/Rest/Builder/DataSet/DataSetMain/GetDataSetData"
            },
            currUserEntity:null,
            recordId:BaseUtility.GetUrlParaValue("recordId"),
            /*Js Bean*/
            listResourceEntity:{
                listId:"",
                listCode:"",
                listName:"",
                listSingleName:"",
                listCreateTime:DateUtility.GetCurrentDate(),
                listUpdateTime:DateUtility.GetCurrentDate(),
                listUpdater:"",
                listType:"",
                listOrderNum:"",
                listDesc:"",
                listModuleId:"",
                listStatus:"启用",
                listOrganId:"",
                listOrganName:"",
                listDatasetId:"",
                listDatasetName:"",
                listDatasetPrimaryKey:"ID",
                listEveryTimeResolve:"否",
                listEnableSSear:"启用",
                listEnableCSear:"禁用",
                listTheme:"uid-theme-wrap-default",
                listCustServerRenderer:"",
                listCustRefJs:"",
                listCustClientRenderer:"",
                listCustDesc:"",
                listHtmlSource:"",
                listJsContent:"",
                listCssContent:"",
                listConfigContent:"",
                listDatasetPageSize:20,
                listIsSystem:"否"
            },
            designThemes:[{
                name:"默认样式",
                value:"uid-theme-wrap-default"
            }],
            status: BaseUtility.GetUrlParaValue("op"),
            oldSelectedTabName:"",
            selectedTabName:"",
            storeDataSet:{}
        }
    },
    methods:{
        //region dialog
        selectDefaultValueDialogBegin:function(targetWindow,oldData){
            this.$refs.selectDefaultValueDialog.beginSelect(oldData);
            this.selectDefaultValueTargetWindow=targetWindow;
        },
        onSelectedDefaultValue:function(result){
            this.selectDefaultValueTargetWindow._SelectBindObj.setSelectEnvVariableResultValue(result);
        },
        //endregion
        changeTheme:function(value){
            //alert(value);
            //var themeVo=this.getTheme(value);
            //CKEditorUtility.SetThemeVo(themeVo);
        },
        selectedDataset:function(treeNode){
            this.listResourceEntity.listDatasetName=treeNode.text;
            this.listResourceEntity.listDatasetId=treeNode.id;
            GeneralPlugin.setBaseInfoBindToDataSetId(this.listResourceEntity.listDatasetId);
        }
    }
}
</script>

<style scoped>

</style>