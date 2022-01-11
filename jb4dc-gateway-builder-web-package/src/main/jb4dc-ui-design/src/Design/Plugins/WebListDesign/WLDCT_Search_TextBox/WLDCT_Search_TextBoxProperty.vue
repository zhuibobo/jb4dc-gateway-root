<template>
    <div class="html-design-plugin-dialog-wraper" v-cloak>
        <a-tabs tab-position="top" size="small" type="card">
            <a-tab-pane key="bindInfo" tab="绑定信息">
                <list-search-control-bind-to-comp ref="listSearchControlBindToComp">
                </list-search-control-bind-to-comp>
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
import RemoteRestInterface from "../../../Remote/RemoteRestInterface";
export default {
    name: "WLDCT_Search_TextBoxProperty",
    data(){
        return {
            baseInfo:GeneralPlugin.defaultProps.baseInfo,
            defaultValue: GeneralPlugin.defaultProps.defaultValue,
            bindToSearchField:GeneralPlugin.defaultProps.bindToSearchField,
            dataSetId:null,
            bindToField:null
        }
    },
    mounted:function () {

    },
    methods: {
        /*ready:function(actionName){
            this.baseInfo.id="txt_"+StringUtility.Timestamp();
            this.baseInfo.name=this.baseInfo.id;
        },*/
        bindDataSetFieldTree:function(){
            //debugger;
            if(this.dataSetId){
                //let dataSetPO=window.parent.listDesign.getDataSet(this.dataSetId);
                RemoteRestInterface.getDataSetData(this.dataSetId,(result)=>{
                    this.$refs.listSearchControlBindToComp.init(result.data);
                });
            }
            else {
                alert("请先设定DataSet");
            }
        },
        getControlProps:function () {
            let bindData=this.$refs.listSearchControlBindToComp.getData();
            let result = {
                success: true,
                baseInfo: this.baseInfo,
                bindToSearchField: bindData.bindToSearchField,
                defaultValue: bindData.defaultValue
            }
            return result;
        },
        setControlProps:function ($elem,props) {
            //console.log($elem.parent());
            //
            this.dataSetId=GeneralPlugin.tryGetDataSetId($elem,$elem.parents());
            this.bindDataSetFieldTree();

            this.baseInfo = props.baseInfo ? props.baseInfo : this.baseInfo;
            this.bindToSearchField = props.bindToSearchField ? props.bindToSearchField : this.bindToSearchField;
            this.defaultValue = props.defaultValue ? props.defaultValue : this.defaultValue;

            this.$refs.listSearchControlBindToComp.setData(this.bindToSearchField,this.defaultValue);
        }
    }
}
</script>

<style scoped>

</style>