<template>
    <div id="uid-html-editor-component-root"></div>
</template>

<script>
import * as monaco from 'monaco-editor';
export default {
    name: "uid-html-editor-component",
    mounted() {
        monaco.editor.create(document.getElementById('uid-html-editor-component-root'), {
            value:`<div style="flex-basis: 200px;background-color: #1C7F99" class="control-list-outer-wrap">
        <div class="control">
            <div draggable="true" ondragstart="drag(this,event)" source="GridStack-Layout">
                GridStack-Layout
            </div>
        </div>
        <div class="control">
            <div draggable="true" ondragstart="drag(this,event)" source="Tabs-Layout">
                Tabs-Layout
            </div>
        </div>
        <div class="control">
            <div class="complex-control drag-to-grid grid-stack-item" gs-w="3" gs-h="20" gs-id="redips-drag1" alex="s">
                <div class="grid-stack-item-content">
                    redips-drag1
                </div>
            </div>
        </div>
        <div class="control">
            <div class="simple-control drag-to-grid grid-stack-item">
                SimpleControl-Table
            </div>
        </div>
        <div class="control">
            <div class="simple-control green redips-clone" draggable="true" ondragstart="drag(this,event)">
                redips-inn-elem
            </div>
        </div>
        <div class="control">
            <div class="simple-control drag-to-grid grid-stack-item" gs-id="child-GridStack" gs-w="3" gs-h="20">
                child-GridStack
            </div>
        </div>
        <div class="control">
            <div class="simple-control drag-to-grid grid-stack-item" gs-id="child-tabs" gs-w="3" gs-h="20">
                child-tabs-GridStack
            </div>
        </div>
        <div class="control">
            <div class="simple-control drag-to-grid grid-stack-item" gs-id="child-tabs-redips-table" gs-w="3" gs-h="20">
                child-tabs-redips-table
            </div>
        </div>
    </div>`,
            //编辑器初始显示文字
            language:'html',
            minimap: { enabled: false },
            automaticLayout: true,//自动布局
            theme:'vs-dark' //官方自带三种主题vs, hc-black, or vs-dark
        });
    }
}
</script>

<style scoped lang="less">
    @import "../../Less/Variable.less";

    #uid-html-editor-component-root{
        height: 100%;
        border: 1px solid @g-concrete-color-v04;
        border-radius: 4px;
        padding: 2px;
        background-color: #1e1e1e;
    }
</style>