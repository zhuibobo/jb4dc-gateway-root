<template>
    <div id="uid-css-code-editor-comp-root"></div>
</template>

<script>
import * as monaco from 'monaco-editor';
import MonacoEditorUtility from "../../Utility/MonacoEditorUtility";
import GeneralPlugin from "../../Plugins/GeneralPlugin";
import enumValues from "../../EnumValues.js"

export default {
    name: "uid-css-code-editor-comp",
    props:["uiDesignType"],
    mounted() {
        window.uidCssCodeMonacoEditor=monaco.editor.create(document.getElementById('uid-css-code-editor-comp-root'), {
            value:`#uid-css-code-editor-comp-root{
        height: 100%;
        border: 1px solid #ffffff;
        border-radius: 4px;
        padding: 2px;
        background-color: #1e1e1e;
    }`,
            //编辑器初始显示文字
            language:'css',
            minimap: { enabled: false },
            automaticLayout: true,//自动布局
            theme:'vs-dark' //官方自带三种主题vs, hc-black, or vs-dark
        });
    },
    methods:{
        getValue(){
            return  MonacoEditorUtility.getValue(window.uidCssCodeMonacoEditor);
        },
        setValue(value) {
            //console.log(value);
            if(value) {
                MonacoEditorUtility.setValue(window.uidCssCodeMonacoEditor, value);
            }
        }
    }
}
</script>

<style scoped lang="less">
    @import "../../../Less/Variable.less";

    #uid-css-code-editor-comp-root{
        height: 100%;
        border: 1px solid @g-concrete-color-v04;
        border-radius: 4px;
        padding: 2px;
        background-color: #1e1e1e;
    }
</style>