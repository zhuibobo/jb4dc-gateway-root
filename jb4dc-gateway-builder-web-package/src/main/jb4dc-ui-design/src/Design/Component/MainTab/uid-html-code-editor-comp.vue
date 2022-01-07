<template>
    <div id="uid-html-code-editor-comp-root"></div>
</template>

<script>
import * as monaco from 'monaco-editor';
export default {
    name: "uid-html-code-editor-comp",
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
            return window.uidHtmlCodeMonacoEditor.getModel().getValue();
        },
        setValue(value){
            console.log(value);
            window.uidHtmlCodeMonacoEditor.getModel().setValue(value);
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