<template>
    <div class="ui-design-main-root">
        <div id="ui-design-main-tabs" style="height:calc(100% - 10px);flex-grow: 2">
            <ul>
                <li><a href="#uid-base-editor-comp-tab">基础信息</a></li>
                <li><a href="#uid-wysiwyg-comp-tab">界面设计</a></li>
                <li><a href="#uid-html-code-editor-comp-tab">HTML源码</a></li>
                <li><a href="#uid-js-code-editor-comp-tab">JS源码</a></li>
                <li><a href="#uid-css-code-editor-comp-tab">CSS</a></li>
                <li><a href="#uid-design-description-comp-tab">设计说明</a></li>
                <li><a href="#uid-extend-dataset-comp-tab">扩展数据集</a></li>
                <li><a href="#uid-extend-paras-comp-tab">扩展参数</a></li>
            </ul>
            <div id="uid-base-editor-comp-tab" class="tab-panel">
                <div>
                    <component v-bind:is="baseInfoComponentName" ref="uidBaseInfoComponent"></component>
                </div>
            </div>
            <div id="uid-wysiwyg-comp-tab" class="tab-panel">
                <div>
                    <uid-wysiwyg-comp :ui-design-type="uiDesignType" ref="uidWysiwygComp"></uid-wysiwyg-comp>
                </div>
            </div>
            <div id="uid-html-code-editor-comp-tab" class="tab-panel">
                <div>
                    <uid-html-code-editor-comp :ui-design-type="uiDesignType" ref="uidHtmlCodeEditorComp"></uid-html-code-editor-comp>
                </div>
            </div>
            <div id="uid-js-code-editor-comp-tab" class="tab-panel">
                <div>
                    <uid-js-code-editor-comp :ui-design-type="uiDesignType" ref="uidJSCodeEditorComp"></uid-js-code-editor-comp>
                </div>
            </div>
            <div id="uid-css-code-editor-comp-tab" class="tab-panel">
                <div>
                    <uid-css-code-editor-comp :ui-design-type="uiDesignType" ref="uidCssCodeEditorComp"></uid-css-code-editor-comp>
                </div>
            </div>
            <div id="uid-design-description-comp-tab" class="tab-panel">
                <div>
                    <uid-design-description-comp :ui-design-type="uiDesignType" ref="uidDesignDescriptionComp"></uid-design-description-comp>
                </div>
            </div>
            <div id="uid-extend-dataset-comp-tab" class="tab-panel">
                <div>
                    <uid-ex-dataset-comp :ui-design-type="uiDesignType" ref="uidExDatasetComp"></uid-ex-dataset-comp>
                </div>
            </div>
            <div id="uid-extend-paras-comp-tab" class="tab-panel">
                <div>
                    <uid-ex-parameters-comp :ui-design-type="uiDesignType" ref="uidExParametersComp"></uid-ex-parameters-comp>
                </div>
            </div>
        </div>
        <div class="ant-btn-group button-outer-wrap">
            <a-button type="primary" class="green-btn" @click="saveNotClose"><i class="las la-save"></i><span>保存</span></a-button>
            <a-button type="primary" class="green-btn" @click="saveAndClose"><i class="las la-save"></i><span>发布并关闭</span></a-button>
            <a-button type="primary" class="green-btn" @click="historyVersion"><i class="las la-save"></i><span>历史版本</span></a-button>
        </div>
        <!--各类对话框的引用-->
        <uid-control-select-bind-to-single-field-dialog @on-selected-bind-to-single-field="onSelectedBindToSingleField" ref="fdControlSelectBindToSingleFieldDialog"></uid-control-select-bind-to-single-field-dialog>
        <uid-select-default-value-dialog @on-selected-default-value="onSelectedDefaultValue" ref="selectDefaultValueDialog"></uid-select-default-value-dialog>
        <uid-select-validate-rule-dialog @on-clear-validate-rule="onClearValidateRule" @on-selected-validate-rule="onSelectedValidateRule" ref="selectValidateRuleDialog"></uid-select-validate-rule-dialog>
    </div>
</template>

<script>
import $ from "jquery";
import EnumValues from "./EnumValues.js"
import GeneralPlugin from "./Plugins/GeneralPlugin";
import UIDesignUtility from "./Utility/UIDesignUtility.js"
import RemoteRestInterface from "./Remote/RemoteRestInterface";

//let uiDesignType="appFormDesign";
//let uiDesignType="AppListDesign";
//let uiDesignType="WebFormDesign";
//let uiDesignType="WebListDesign";

export default {
    name: "ui-design-main",
    data:function () {
        return {
            //uiDesignType:EnumValues.uiDesignType.webListDesign,
            uiDesignType:BaseUtility.GetUrlParaValue("uiDesignType"),
            baseInfoComponentName:"uid-empty-comp",
            currentMainTabName:"uid-wysiwyg-comp-tab",
            recordId:BaseUtility.GetUrlParaValue("recordId"),
            status: BaseUtility.GetUrlParaValue("op")
        }
    },
    mounted() {
        let _this=this;
        $("#ui-design-main-tabs").tabs({
            active: 1,
            activate: function( event, ui ) {
                let oldTabName=ui.oldTab.find("a").attr("href").replace("#","");
                let newTabName=ui.newTab.find("a").attr("href").replace("#","");
                _this.currentMainTabName=newTabName;
                if(oldTabName=="uid-wysiwyg-comp-tab"&&newTabName=="uid-html-code-editor-comp-tab"){
                    let htmlCodeValue=_this.getWysiwygEditorValue();
                    _this.setHtmlCodeEditorValue(htmlCodeValue);
                }
                else if(oldTabName=="uid-html-code-editor-comp-tab"){
                    let htmlCodeValue=_this.getHtmlCodeEditorValue();
                    _this.setWysiwygEditorValue(htmlCodeValue);
                }

                if(oldTabName=="uid-wysiwyg-comp-tab"){
                    GeneralPlugin.clearHelperPanel();
                }
            }
        });
        if(this.uiDesignType==EnumValues.uiDesignType.appFormDesign){
            this.baseInfoComponentName="uid-app-form-base-info-comp";
        }
        else if(this.uiDesignType==EnumValues.uiDesignType.webListDesign){
            this.baseInfoComponentName="uid-web-list-base-info-comp";
        }
        GeneralPlugin.setUIDesignMain(this);

        this.init();
        BaseUtility.SetSystemFavicon();
        //window.setInterval(function (){
        //    GeneralPlugin.autoClearHelperPanel(_this.getWysiwygEditorValue());
        //},2000);
        //this.$refs.fdControlSelectBindToSingleFieldDialog.beginSelect("","");
        //this.$refs.selectDefaultValueDialog.beginSelect(null);
        //this.$refs.selectValidateRuleDialog.beginSelect({msg:"",rules:[]});
    },
    methods:{
        init(){
            //debugger;
            window.setTimeout(()=>{
                this.$refs.uidBaseInfoComponent.init(this.recordId,this.status,function (recordId,editorValues){
                    if(editorValues){

                    }
                });
            },300);
        },
        //绑定单个字段
        selectBindToSingleFieldDialogBegin(oldBindFieldData,caller){
            let relationConfig=this.$refs.uidBaseInfoComponent.getFormRelationConfig();
            //将关联表设置提供给选择绑定字段的组件，判定是否需要重新加载控件的字段
            this._selectBindToSingleFieldDialogCaller=caller;
            this.$refs.fdControlSelectBindToSingleFieldDialog.beginSelect(relationConfig.relationData,oldBindFieldData);
        },
        onSelectedBindToSingleField(result){
            this._selectBindToSingleFieldDialogCaller.setSelectFieldResultValue(result);
        },
        //绑定默认值
        selectDefaultValueDialogBegin(oldData,caller){
            this._selectDefaultValueDialogCaller=caller;
            this.$refs.selectDefaultValueDialog.beginSelect(oldData,caller);
            //this.selectDefaultValueTargetWindow=targetWindow;
        },
        onSelectedDefaultValue(result){
            this._selectDefaultValueDialogCaller.setSelectEnvVariableResultValue(result);
        },
        //绑定验证规则
        onClearValidateRule(){
            this.selectDefaultValueTargetWindow._SelectBindObj.setSelectValidateRuleResultValue(null);
        },
        selectValidateRuleDialogBegin(oldData,caller){
            this._selectValidateRuleDialogCaller=caller;
            this.$refs.selectValidateRuleDialog.beginSelect(oldData);
            //this.selectDefaultValueTargetWindow=targetWindow;
        },
        onSelectedValidateRule(result){
            this._selectValidateRuleDialogCaller.setSelectValidateRuleResultValue(result);
            //this.selectDefaultValueTargetWindow._SelectBindObj.setSelectValidateRuleResultValue(result);
        },
        setWysiwygEditorValue(value){
            return this.$refs.uidWysiwygComp.setValue(value);
        },
        getWysiwygEditorValue(){
            return this.$refs.uidWysiwygComp.getValue();
        },
        setHtmlCodeEditorValue(value){
            this.$refs.uidHtmlCodeEditorComp.setValue(value);
        },
        getHtmlCodeEditorValue(){
            return this.$refs.uidHtmlCodeEditorComp.getValue();
        },
        getEditorValues(){
            let htmlValue=this.$refs.uidWysiwygComp.getValue();
            if(this.currentMainTabName=="uid-html-code-editor-comp-tab"){
                htmlValue=this.$refs.uidHtmlCodeEditorComp.getValue();
            }
            return UIDesignUtility.buildEditorValues(
                htmlValue,
                this.$refs.uidJSCodeEditorComp.getValue(),
                this.$refs.uidCssCodeEditorComp.getValue(),
                this.$refs.uidDesignDescriptionComp.getValue(),
                this.$refs.uidExDatasetComp.getValue(),
                this.$refs.uidExParametersComp.getValue()
            );
        },
        save(successFun){
            let editorValues=this.getEditorValues();
            let validateResult =this.$refs.uidBaseInfoComponent.validateSaveEnable(editorValues);
            if(validateResult.success){
                this.$refs.uidBaseInfoComponent.save(editorValues,successFun);
            }
            else{
                DialogUtility.AlertText(validateResult.msg.join("<br />"));
            }
        },
        saveNotClose(){
            this.save((result)=>{
                DialogUtility.AlertText(result.message);
            })
        },
        saveAndRelease(){

        },
        saveAndClose(){

        },
        historyVersion(){

        }
    }
}
</script>

<style scoped>
</style>