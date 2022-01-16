<template>
    <div id="uid-html-code-editor-comp-root"></div>
</template>

<script>
import * as monaco from 'monaco-editor';
import MonacoEditorUtility from "../../Utility/MonacoEditorUtility";
import GeneralPlugin from "../../Plugins/GeneralPlugin";
import enumValues from "../../EnumValues.js"

export default {
    name: "uid-html-code-editor-comp",
    props:["uiDesignType"],
    data(){
        return {
            //monacoEditor:null
        }
    },
    mounted() {
        window.uidHtmlCodeMonacoEditor=monaco.editor.create(document.getElementById('uid-html-code-editor-comp-root'), {
            value:``,
            //编辑器初始显示文字
            language:'html',
            minimap: { enabled: false },
            automaticLayout: true,//自动布局
            theme:'vs-dark' //官方自带三种主题vs, hc-black, or vs-dark
        });
    },
    methods:{
        getValue(){
            return  MonacoEditorUtility.getValue(window.uidHtmlCodeMonacoEditor);
        },
        setValue(value) {
            if(value) {
                //console.log(value);
                MonacoEditorUtility.setValue(window.uidHtmlCodeMonacoEditor, value);
                let _wysiwygLastSelectedElem = GeneralPlugin.getWysiwygLastSelectedElem();
                if (_wysiwygLastSelectedElem) {
                    let findText = "id=\"" + _wysiwygLastSelectedElem.attr("id") + "\"";
                    MonacoEditorUtility.autoSelectionFirstMatchText(window.uidHtmlCodeMonacoEditor, findText);
                }
            }
        }
    }
}
</script>

<style scoped lang="less">
    @import "../../../Less/Variable.less";

    #uid-html-code-editor-comp-root{
        height: 100%;
        border: 1px solid @g-concrete-color-v04;
        border-radius: 4px;
        padding: 2px;
        background-color: #1e1e1e;
    }
</style>