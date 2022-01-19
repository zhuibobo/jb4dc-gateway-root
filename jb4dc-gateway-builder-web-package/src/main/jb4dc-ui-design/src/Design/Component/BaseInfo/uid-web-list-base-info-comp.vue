<template>
    <div style="width: 1224px;margin: auto">
        <a-tabs tab-position="left">
            <a-tab-pane key="tab-base-info" tab="基础设置">
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
                <div style="width: 590px;height: 610px;border: #ddddf1 1px solid;border-radius: 4px;padding: 10px 20px 10px 10px;float: right">
                    <a-divider orientation="left" style="font-size: 12px">绑定数据集</a-divider>
                    <dataset-simple-select-comp @on-selected-dataset="selectedDataset"></dataset-simple-select-comp>
                </div>
            </a-tab-pane>
            <a-tab-pane key="tab-extend-config" tab="扩展设置">
                <div style="width: 1100px;height: 615px;border: #ddddf1 1px solid;border-radius: 4px;padding: 10px 20px 10px 10px;">
                    <a-divider orientation="left" style="font-size: 12px">扩展信息</a-divider>
                    <table cellpadding="0" cellspacing="0" border="0" class="form-table">
                        <colgroup>
                            <col style="width: 120px" />
                            <col />
                        </colgroup>
                        <tbody>
                            <tr>
                                <td>服务端渲染方法：</td>
                                <td>
                                    <a-input v-model:value="listResourceEntity.listCustServerRenderer" placeholder="服务端自定义的渲染方法:继承IFormSeverRenderer"></a-input>
                                </td>
                            </tr>
                            <tr>
                                <td>客户端渲染方法：</td>
                                <td>
                                    <a-input v-model:value="listResourceEntity.listCustClientRenderer" placeholder="客户端自定义的渲染方法:需要指明具体的方法名称"></a-input>
                                </td>
                            </tr>
                            <tr>
                                <td>引入JS：</td>
                                <td>
                                    <a-textarea v-model:value="listResourceEntity.listCustRefJs" placeholder="引入的脚本:多个通过;分割" type="textarea" :autosize="{minRows: 4,maxRows: 4}"></a-textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>备注：</td>
                                <td>
                                    <a-textarea v-model:value="listResourceEntity.listCustDesc" type="textarea" :autosize="{minRows: 18,maxRows: 18}"></a-textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import GeneralPlugin from "../../Plugins/GeneralPlugin";
import RemoteRestInterface from "../../Remote/RemoteRestInterface";
import UIDesignUtility from "../../Utility/UIDesignUtility.js"

export default {
    name: "uid-web-list-base-info-comp",
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
            recordId:null,
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
            status: null,
            storeDataSet:{}
        }
    },
    methods:{
        //region 需要实现的方法
        init(recordId,status,completedFunc) {
            this.recordId = recordId;
            this.status = status;
            RemoteRestInterface.getWebListDesignPOAndBindTo({
                recordId: this.recordId,
                op: this.status
            }, (result) => {
                if (this.status == "add") {
                    this.recordId = result.data.listId;
                    this.listResourceEntity.listId = this.recordId;
                    this.listResourceEntity.listType="WebList";
                    this.listResourceEntity.listModuleId = BaseUtility.GetUrlParaValue("moduleId");
                    completedFunc(this.recordId, null);
                } else {
                    let editorValues = UIDesignUtility.buildEditorValues(
                        this.listResourceEntity.listHtmlSource,
                        this.listResourceEntity.listJsContent,
                        this.listResourceEntity.listCssContent,
                        "","",""
                    );
                    completedFunc(this.recordId, editorValues);
                }
            });
        },
        save(editorValues,successFun) {
            this.listResourceEntity.listHtmlSource = editorValues.htmlValue;
            this.listResourceEntity.listJsContent = editorValues.jsValue;
            this.listResourceEntity.listCssContent = editorValues.cssValue;
            RemoteRestInterface.saveWebListDesign(this.listResourceEntity, successFun);
        },
        validateSaveEnable(editorValues){
            let resultMsg={
                success:true,
                msg:[]
            }
            if(this.listResourceEntity.listName==""){
                resultMsg.success=false;
                resultMsg.msg.push("请填写列表名称!");
            }
            return resultMsg;
        },
        //endregion
        //region dialog
        selectDefaultValueDialogBegin(targetWindow,oldData){
            this.$refs.selectDefaultValueDialog.beginSelect(oldData);
            this.selectDefaultValueTargetWindow=targetWindow;
        },
        onSelectedDefaultValue(result){
            this.selectDefaultValueTargetWindow._SelectBindObj.setSelectEnvVariableResultValue(result);
        },
        //endregion
        changeTheme(value){
            //alert(value);
            //var themeVo=this.getTheme(value);
            //CKEditorUtility.SetThemeVo(themeVo);
        },
        selectedDataset(treeNode){
            this.listResourceEntity.listDatasetName=treeNode.text;
            this.listResourceEntity.listDatasetId=treeNode.id;
            GeneralPlugin.setBaseInfoBindToDataSetId(this.listResourceEntity.listDatasetId);
        }
        /*buildSaveValue(editorValue){
            let validateResult=this.validateSaveEnable();
            this.listResourceEntity.listHtmlSource=editorValue.htmlValue;
            this.listResourceEntity.listJsContent=editorValue.jsValue;
            this.listResourceEntity.listCssContent=editorValue.cssValue;

            return {
                value:this.listResourceEntity,
                success:validateResult.success,
                errorMessages:validateResult.msg
            };
        },*/
    }
}
</script>

<style scoped>

</style>