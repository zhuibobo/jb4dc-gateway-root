<template>
    <div class="html-design-plugin-dialog-wraper" id="dialogApp" v-cloak>
        <a-tabs tab-position="top" size="small" type="card">
            <a-tab-pane key="bindInfo" tab="绑定信息">
                <uid-control-bind-to :bind-to-field-prop="bindToField" :default-value-prop="defaultValue" :validate-rules-prop="validateRules" @on-set-completed="setBindCompleted">
                </uid-control-bind-to>
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
    name: "AFDCT_TextBoxProperty",
    data(){
        return {
            baseInfo: GeneralPlugin.defaultProps.baseInfo,
            bindToField: GeneralPlugin.defaultProps.bindToField,
            defaultValue: GeneralPlugin.defaultProps.defaultValue,
            validateRules: GeneralPlugin.defaultProps.validateRules
        }
    },
    mounted:function () {

    },
    methods: {
        ready:function(actionName){
            this.baseInfo.id="txt_"+StringUtility.Timestamp();
            this.baseInfo.name=this.baseInfo.id;
        },
        setBindCompleted:function(bindToField,defaultValue,validateRules){
            this.bindToField=bindToField;
            this.defaultValue=defaultValue;
            this.validateRules=validateRules;
        },
        getControlProps:function () {
            var result = {
                success: true,
                baseInfo: this.baseInfo,
                bindToField: this.bindToField,
                defaultValue: this.defaultValue,
                validateRules: this.validateRules
            }
            return GeneralPlugin.validateSerializeControlDialogCompletedEnable(result);
        },
        setControlProps:function ($elem,props) {
            console.log(props);
            this.baseInfo = props.baseInfo ? props.baseInfo : this.baseInfo;
            this.bindToField = props.bindToField ? props.bindToField : this.bindToField;
            this.defaultValue = props.defaultValue ? props.defaultValue : this.defaultValue;
            this.validateRules = props.validateRules ? props.validateRules : this.validateRules;
        }
    }
}
</script>

<style scoped>

</style>