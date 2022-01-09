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
                    <component v-bind:is="baseInfoComponent" ref="baseInfoComponent"></component>
                </div>
            </div>
            <div id="uid-wysiwyg-comp-tab" class="tab-panel">
                <div>
                    <uid-wysiwyg-comp :ui-design-type="uiDesignType" ref="uidWysiwygComp"></uid-wysiwyg-comp>
                </div>
            </div>
            <div id="uid-html-code-editor-comp-tab" class="tab-panel">
                <div>
                    <uid-html-code-editor-comp ref="uidHtmlCodeEditorComp"></uid-html-code-editor-comp>
                </div>
            </div>
            <div id="uid-js-code-editor-comp-tab" class="tab-panel">
                <div>
                    <uid-js-code-editor-comp></uid-js-code-editor-comp>
                </div>
            </div>
            <div id="uid-css-code-editor-comp-tab" class="tab-panel">
                <div>
                </div>
            </div>
            <div id="uid-design-description-comp-tab" class="tab-panel">
                <div>
                    设计说明
                </div>
            </div>
            <div id="uid-extend-dataset-comp-tab" class="tab-panel">
                <div>
                    扩展数据集
                </div>
            </div>
            <div id="uid-extend-paras-comp-tab" class="tab-panel">
                <div>
                    扩展参数
                </div>
            </div>
        </div>
        <div class="button-outer-wrap">
            <div><i class="las la-save"></i>保存并发布</div>
            <div><i class="las la-save"></i>发布并关闭</div>
            <div><i class="las la-save"></i>发布并预览</div>
            <div><i class="las la-save"></i>校验窗口设置</div>
            <div><i class="las la-save"></i>历史版本</div>
        </div>
        <!--各类对话框的引用-->
        <uid-control-select-bind-to-single-field-dialog @on-selected-bind-to-single-field="onSelectedBindToSingleField" ref="fdControlSelectBindToSingleFieldDialog"></uid-control-select-bind-to-single-field-dialog>
        <uid-select-default-value-dialog @on-selected-default-value="onSelectedDefaultValue" ref="selectDefaultValueDialog"></uid-select-default-value-dialog>
        <uid-select-validate-rule-dialog @on-clear-validate-rule="onClearValidateRule" @on-selected-validate-rule="onSelectedValidateRule" ref="selectValidateRuleDialog"></uid-select-validate-rule-dialog>
    </div>
</template>

<script>
import $ from "jquery";
import enumValues from "./EnumValues.js"
import GeneralPlugin from "./Plugins/GeneralPlugin";

//let uiDesignType="appFormDesign";
//let uiDesignType="AppListDesign";
//let uiDesignType="WebFormDesign";
//let uiDesignType="WebListDesign";

export default {
    name: "ui-design-main",
    data:function () {
        return {
            uiDesignType:enumValues.uiDesignType.webListDesign,
            baseInfoComponent:"uid-empty-comp"
        }
    },
    mounted() {
        let _this=this;
        $("#ui-design-main-tabs").tabs({
            active: 1,
            activate: function( event, ui ) {
                let oldTabName=ui.oldTab.find("a").attr("href").replace("#","");
                let newTabName=ui.newTab.find("a").attr("href").replace("#","");
                if(oldTabName=="uid-wysiwyg-comp-tab"&&newTabName=="uid-html-code-editor-comp-tab"){
                    let htmlCodeValue=_this.getWysiwygEditorValue();
                    _this.setHtmlCodeEditorValue(htmlCodeValue);
                }
                else if(oldTabName=="uid-html-code-editor-comp-tab"&&newTabName=="uid-wysiwyg-comp-tab"){
                    let htmlCodeValue=_this.getHtmlCodeEditorValue();
                    _this.setWysiwygEditorValue(htmlCodeValue);
                }
            }
        });
        if(this.uiDesignType==enumValues.uiDesignType.appFormDesign){
            this.baseInfoComponent="uid-app-form-base-info-comp";
        }
        else if(this.uiDesignType==enumValues.uiDesignType.webListDesign){
            this.baseInfoComponent="uid-app-list-base-info-comp";
        }
        GeneralPlugin.setUIDesignMain(this);

        //this.$refs.fdControlSelectBindToSingleFieldDialog.beginSelect("","");
        //this.$refs.selectDefaultValueDialog.beginSelect(null);
        //this.$refs.selectValidateRuleDialog.beginSelect({msg:"",rules:[]});
    },
    methods:{
        //绑定单个字段
        selectBindToSingleFieldDialogBegin(oldBindFieldData,caller){
            let relationConfig=this.$refs.baseInfoComponent.getFormRelationConfig();
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
        }
    }
}
</script>

<style scoped lang="less">
    @import "../less/Variable.less";

    .ui-design-main-root{
        display: flex;
        //background-color: #0B61A4;
        height: 100%;
        overflow: hidden;
        padding: 4px;
        box-sizing: border-box;

        .tab-panel{
            height:calc(100% - 50px);
            padding: 4px;

            >div{
                width: 100%;
                height: 100%
            }
        }

        .button-outer-wrap{
            position: absolute;
            height: 30px;
            /*background-color: red;*/
            right: 16px;
            top: 8px;

            >div{
                display: inline-block;
                margin: 2px;
                font-size: 13px;
                border: 1px solid @g-concrete-color-v10;
                padding: 2px 4px;
                border-radius: 4px;
                cursor: pointer;
                background-color: @g-peter-river-color-v02;

                >.las{
                    font-size: 16px;
                }
            }
            >div:hover{
                background-color: @g-peter-river-color-v04;
            }
        }
    }
</style>