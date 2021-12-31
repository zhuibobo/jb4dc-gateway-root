<template>
    <div class="uid-wysiwyg-component-root">
        <div>
            <div class="wysiwyg-container" :id="wysiwygDragDropUtility.wysiwygContainerId" @dragover="dragover($event)" @drop="drop($event)" @click="wysiwygContainerClick">

            </div>
        </div>
        <div>
            <div id="uid-wysiwyg-plugin-list-component-wrap">
                <h3>布局控件</h3>
                <div class="plugin-list-wrap">
                    <uid-wysiwyg-plugin-list-component :control-plugins-config="controlPluginsConfig" group-name="Layout"></uid-wysiwyg-plugin-list-component>
                </div>
                <h3>输入控件</h3>
                <div class="plugin-list-wrap">
                    <uid-wysiwyg-plugin-list-component :control-plugins-config="controlPluginsConfig" group-name="InputControl"></uid-wysiwyg-plugin-list-component>
                </div>
                <h3>动态控件</h3>
                <div class="plugin-list-wrap">
                    <uid-wysiwyg-plugin-list-component :control-plugins-config="controlPluginsConfig" group-name="DynamicContainer"></uid-wysiwyg-plugin-list-component>
                </div>
                <h3>模板控件</h3>
                <div class="plugin-list-wrap">
                    <uid-wysiwyg-plugin-list-component :control-plugins-config="controlPluginsConfig" group-name="TemplateContainer"></uid-wysiwyg-plugin-list-component>
                </div>
            </div>
        </div>
        <div class="plugin-prop-edit-dialog" id="plugin-prop-edit-dialog">
            <component v-bind:is="pluginPropEditVueName" ref="pluginPropEditComponent"></component>
        </div>
    </div>
</template>

<script>

import controlPluginsUtility from '../Utility/ControlPluginsUtility';
import wysiwygDragDropUtility from '../Utility/WysiwygDragDropUtility';
import GeneralPlugin from "../Plugins/GeneralPlugin";
import allPlugins from '../Plugins/IndexPlugin'

export default {
    name: "uid-wysiwyg-component",
    props:["uiDesignType"],
    data(){
        return {
            controlPluginsConfig:[],
            wysiwygDragDropUtility:wysiwygDragDropUtility,
            pluginPropEditVueName:"uid-empty-component",
            pluginPropEditDialog:null,
        }
    },
    mounted() {
        this.init();
        this.initPluginPropEditDialog();
        GeneralPlugin.setWysiwygComponent(this);
    },
    methods:{
        init (){
            $("#uid-wysiwyg-plugin-list-component-wrap").accordion({
                heightStyle: "fill"
            });
            this.controlPluginsConfig=controlPluginsUtility.getControlPluginsConfigByDesignType(this.uiDesignType);
            console.log(controlPluginsUtility.findBySingleName("TabGridStack1-1"));
            console.log(allPlugins);
            for (let pluginKey in allPlugins) {
                let configSingleName=pluginKey.replace("Plugin","");
                let configSingle = controlPluginsUtility.findBySingleName(configSingleName);
                allPlugins[pluginKey].config=configSingle;
            }
        },
        wysiwygContainerClick:function (){
            GeneralPlugin.clearControlEditInnerPanel();
        },
        dragover(event){
            event.preventDefault();
            //wysiwygDragDropUtility.dragControlToWysiwygContainerOver(event);
        },
        drop(event){
            event.preventDefault();
            wysiwygDragDropUtility.dropControlToWysiwygContainer(event);
            //let dragSingleName = wysiwygDragDropUtility.getDropSingleName(event);
            //console.log(dragSingleName);
        },
        initPluginPropEditDialog:function (){
            let _this=this;
            let defaultConfig = {
                height: 600,
                width: 800,
                title: "属性编辑",
                autoOpen: false,
                modal: true,
                buttons: {
                    "确认": function () {
                        _this.$refs.pluginPropEditComponent.setControlProps(null,"啥啥啥所");
                        $("#plugin-prop-edit-dialog").dialog("close");
                    },
                    "取消": function () {
                        $("#plugin-prop-edit-dialog").dialog("close");
                    }
                }
            };
            this.pluginPropEditDialog=$("#plugin-prop-edit-dialog").dialog(defaultConfig);
        },
        showPluginPropEditDialog:function (pluginPropEditVueName){
            this.pluginPropEditVueName=pluginPropEditVueName;
            this.pluginPropEditDialog.dialog("open");
        }
    }
}
</script>

<style scoped lang="less">
    @import "../../Less/Variable.less";

    .uid-wysiwyg-component-root{
        display: flex;
        /*background-color: #0B61A4;*/
        height: 100%;
        overflow: hidden;

        >div:first-child{
            flex-grow: 2;
            overflow: auto;
            padding: 2px 4px 2px 2px;

            .wysiwyg-container{
                border-radius: 4px;
                border: 1px solid @g-pomegranate-color-v06;
                height: 100%;
                box-sizing: border-box;
                overflow: auto;
            }
        }
        >div:last-child{
            flex-basis: 200px;
            background-color: #EAEDED;
            margin-right: 2px;
            height:calc(100% - 4px);
        }
    }

    .plugin-list-wrap{
        padding: 0px 4px 0 4px;
    }

    #uid-wysiwyg-plugin-list-component-wrap{
        user-select: none;
    }

    .plugin-prop-edit-dialog{

    }
</style>