<template>
    <div id="uid-js-editor-component-root"></div>
</template>

<script>
import * as monaco from 'monaco-editor';
export default {
    name: "uid-js-editor-component",
    mounted() {
        monaco.editor.create(document.getElementById('uid-js-editor-component-root'), {
            value:`function allowDrop(event) {
        //console.log(event);
        event.preventDefault();
      }`,
            //编辑器初始显示文字
            language:'javascript',
            minimap: { enabled: false },
            automaticLayout: true,//自动布局
            theme:'vs-dark' //官方自带三种主题vs, hc-black, or vs-dark
        });
    }
}
</script>

<style scoped lang="less">
    @import "../../Less/Variable.less";

    #uid-js-editor-component-root{
        height: 100%;
        border: 1px solid @g-concrete-color-v04;
        border-radius: 4px;
        padding: 2px;
        background-color: #1e1e1e;
    }
</style>