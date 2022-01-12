<template>
    <div v-for="plugin in getControlPluginsByGroup(this.groupName)" class="plugin-item" :class="dragEnableWrapClass(plugin)">
        <div>
            <img draggable="false" class="plugin-icon" :src="pluginIcon(plugin)">
            <div :draggable="dragEnable(plugin)" @dragstart="dragStart(plugin.singleName,$event)" :class="buildPluginItemClass(plugin)" :pluginSingleName="plugin.singleName">
                {{plugin.text}}
            </div>
            <i v-if="dragEnable(plugin)" class="las la-reply"></i>
        </div>
        <div v-if="plugin.children">
            <div v-for="plugin in pluginsIsShowFilter(plugin.children)" class="plugin-item" :class="dragEnableWrapClass(plugin)">
                <div>
                    <img draggable="false" class="plugin-icon" :src="pluginIcon(plugin)">
                    <div :draggable="dragEnable(plugin)" @dragstart="dragStart(plugin.singleName,$event)" :class="buildPluginItemClass(plugin)" :pluginSingleName="plugin.singleName">
                        {{plugin.text}}
                    </div>
                    <i v-if="dragEnable(plugin)" class="las la-reply"></i>
                </div>
                <div v-if="plugin.children">
                    <div v-for="plugin in pluginsIsShowFilter(plugin.children)" class="plugin-item" :class="dragEnableWrapClass(plugin)">
                        <div>
                            <img class="plugin-icon" :src="pluginIcon(plugin)">
                            <div :draggable="dragEnable(plugin)" @dragstart="dragStart(plugin.singleName,$event)" :class="buildPluginItemClass(plugin)" :pluginSingleName="plugin.singleName">
                                {{plugin.text}}
                            </div>
                            <i v-if="dragEnable(plugin)" class="las la-reply"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import wysiwygDragDropUtility from '../../Utility/WysiwygDragDropUtility';

export default {
    name: "uid-wysiwyg-plugin-list-comp",
    props: ["controlPluginsConfig","groupName"],
    mounted() {
        //console.log(this.controlPluginsConfig);
        window.setTimeout(function (){
            GridStack.setupDragIn('.plugin-list-wrap .drag-to-grid', { revert: 'invalid', scroll: false, appendTo: 'body',h:1,w:1, helper: "clone"});
        },1000);
    },
    methods: {
        pluginIcon(plugin){
            return "Images/Plugin/"+plugin.icon;
        },
        getControlPluginsByGroup: function (groupName) {
            let groupPlugin = this.controlPluginsConfig.filter(plugin => plugin.group == groupName);
            return this.pluginsIsShowFilter(groupPlugin);
        },
        pluginsIsShowFilter(plugins){
            return plugins.filter(plugin => plugin.showInEditorToolbar == "true");
        },
        dragStart:function (plugSingleName,event) {
            //console.log(plugSingleName);
            //console.log(event)
            //event.dataTransfer.setData("DragSingleName",plugSingleName);
            wysiwygDragDropUtility.dragStart(plugSingleName,event);
        },
        dragEnableWrapClass:function (plugin){
            let classAry=[];
            let dragEnableClass=wysiwygDragDropUtility.dragEnableClass(plugin);
            if(dragEnableClass){
                classAry.push(dragEnableClass);
            }
            return classAry;
        },
        buildPluginItemClass:function (plugin){
            let classAry=[];
            let dragEnableClass=wysiwygDragDropUtility.dragEnableClass(plugin);
            if(dragEnableClass){
                classAry.push(dragEnableClass);
            }

            if(plugin.dragTo.indexOf("Layout")>=0){
                classAry.push("drag-to-grid");
            }
            else if(plugin.dragTo.indexOf("SingleGridStackLayout")>=0){
                classAry.push("drag-to-grid");
            }
            classAry.push("plugin-text");
            return classAry;
        },
        dragEnable:function (plugin){
            return wysiwygDragDropUtility.dragEnable(plugin);
        }
    }
}
</script>

<style scoped lang="less">
    @import "../../../Less/Variable.less";

    .plugin-list-wrap{
        padding: 0px 4px 0 4px;
        user-select: none;

        .plugin-item{
            border: 1px solid @g-concrete-color-v04;
            margin-top: 6px;
            padding: 6px;
            border-radius: 4px;

            .las{
                color: red;
            }

            .plugin-text{
                display: inline-block;
                height: 18px;
                line-height: 18px;
                width: calc(100% - 18px - 18px);
            }

            .plugin-icon{
                width: 16px;
                height: 16px;
                margin-right: 4px;
                vertical-align: top;
            }
        }

        .plugin-item:hover{
            background-color: #ffffff;
        }

        .drag-enable{
            background-color: @g-concrete-color-v01;
            cursor: move;
        }
    }
</style>