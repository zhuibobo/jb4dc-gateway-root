<template>
    <div class="ui-design-main-root">
        <div id="ui-design-main-tabs" style="height:calc(100% - 10px);flex-grow: 2">
            <ul>
                <li><a href="#uid-base-editor-component-tab">基础信息</a></li>
                <li><a href="#uid-wysiwyg-component-tab">界面设计</a></li>
                <li><a href="#uid-html-editor-component-tab">HTML源码</a></li>
                <li><a href="#uid-js-editor-component-tab">JS源码</a></li>
                <li><a href="#uid-css-editor-component-tab">CSS</a></li>
                <li><a href="#uid-exconfig-editor-component-tab">扩展设置</a></li>
            </ul>
            <div id="uid-base-editor-component-tab" class="tab-panel">
                <div>
                    基础信息
                </div>
            </div>
            <div id="uid-wysiwyg-component-tab" class="tab-panel">
                <div>
                    <uid-wysiwyg-component :ui-design-type="uiDesignType"></uid-wysiwyg-component>
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
            <div id="uid-css-editor-component-tab" class="tab-panel">
                <div>
                </div>
            </div>
            <div id="uid-exconfig-editor-component-tab" class="tab-panel">
                <div>
                    扩展设置
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
    </div>
</template>

<script>
import $ from 'jquery';

let uiDesignType="appFormDesign";
//let uiDesignType="AppListDesign";
//let uiDesignType="WebFormDesign";
//let uiDesignType="WebListDesign";

export default {
    name: "ui-design-main",
    data:function () {
        return {
            uiDesignType:uiDesignType
        }
    },
    mounted() {
        $( "#ui-design-main-tabs" ).tabs({
            active: 1
        });
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
                margin: 4px;
                font-size: 13px;
                border: 1px solid @g-concrete-color-v10;
                padding: 4px;
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