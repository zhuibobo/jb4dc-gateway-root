<template>
    <div class="ui-design-main-root">
        <div id="ui-design-main-tabs" style="height:calc(100% - 10px);flex-grow: 2">
            <ul>
                <li><a href="#uid-base-editor-component-tab">基础信息</a></li>
                <li><a href="#uid-wysiwyg-component-tab">界面设计</a></li>
                <li><a href="#uid-html-editor-component-tab">HTML源码</a></li>
                <li><a href="#uid-js-editor-component-tab">JS源码</a></li>
                <li><a href="#uid-exconfig-editor-component-tab">扩展设置</a></li>
            </ul>
            <div id="uid-base-editor-component-tab" class="tab-panel">
                <div>
                    基础信息
                </div>
            </div>
            <div id="uid-wysiwyg-component-tab" class="tab-panel">
                <div>
                    <uid-wysiwyg-component></uid-wysiwyg-component>
                </div>
            </div>
            <div id="uid-html-editor-component-tab" class="tab-panel">
                <div>
                    <uid-html-editor-component></uid-html-editor-component>
                </div>
            </div>
            <div id="uid-js-editor-component-tab" class="tab-panel">
                <div>
                    <uid-js-editor-component></uid-js-editor-component>
                </div>
            </div>
            <div id="uid-exconfig-editor-component-tab" class="tab-panel">
                <div>
                    扩展设置
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';

let uiDesignType="AppFormDesign";
let uiDesignType="AppFormDesign";
let uiDesignType="AppFormDesign";
let uiDesignType="AppFormDesign";

export default {
    name: "ui-design-main",
    mounted() {
        $( "#ui-design-main-tabs" ).tabs();
    }
}
</script>

<style scoped lang="less">
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
    }
</style>