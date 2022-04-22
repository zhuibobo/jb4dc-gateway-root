<template>
    <div>
        <div id="sql-editor" :style="{height: sqlDesignerHeight+'px'}"></div>
        <div style="text-align: right;margin-top: 8px">
            <div class="ant-btn-group">
              <a-button type="primary" size="small" @click="insertEnvToEditor('#{ApiVar.当前用户所在组织ID}')">组织Id</a-button>
              <a-button type="primary" size="small" @click="insertEnvToEditor('#{ApiVar.当前用户所在组织名称}')">组织名称</a-button>
              <a-button type="primary" size="small" @click="insertEnvToEditor('#{ApiVar.当前用户ID}')">用户Id</a-button>
              <a-button type="primary" size="small" @click="insertEnvToEditor('#{ApiVar.当前用户名称}')">用户名称</a-button>
              <a-button type="primary" size="small" @click="insertEnvToEditor('#{DateTime.年年年年-月月-日日}')">yyyy-MM-dd</a-button>
              <a-button type="primary" size="small">说明</a-button>
            </div>
        </div>
        <div style="margin-top: 8px" v-if="showField">
            <div style="float: left;margin: 4px 10px">本表字段</div>
            <div style="float: left">
                <a-select placeholder="默认使用Id字段" size="small" style="width:165px" @change="insertFieldToEditor('selfTableFields',$event)">
                    <a-select-option v-for="item in selfTableFields" :value="item.fieldName" :key="item.fieldName">{{item.fieldCaption}}</a-select-option>
                </a-select>
            </div>
            <div style="float: left;margin: 4px 10px">父表字段</div>
            <div style="float: left">
                <a-select placeholder="默认使用Id字段" size="small" style="width:167px" @change="insertFieldToEditor('parentTableFields',$event)">
                    <a-select-option v-for="item in parentTableFields" :value="item.fieldName" :key="item.fieldName">{{item.fieldCaption}}</a-select-option>
                </a-select>
            </div>
        </div>
    </div>
</template>

<script>
import * as monaco from 'monaco-editor';
export default {
    name: "sql-general-design-comp",
    props:["sqlDesignerHeight","value","showField"],
    data:function(){
        return {
            sqlText:"",
            selectedItemValue:"说明",
            selfTableFields:[],
            parentTableFields:[]
        }
    },
    watch: {
        sqlText: function (newVal) {
            // 必须是input
            this.$emit('input', newVal)
        },
        value:function (newVal) {
            this.sqlText=newVal;
            //this.setValue(newVal);
        }
    },
    mounted:function(){
        /*this.sqlCodeMirror = CodeMirror.fromTextArea($("#TextAreaSQLEditor")[0], {
            mode: "text/x-sql",
            lineNumbers: true,
            lineWrapping: true,
            foldGutter: true,
            theme: "monokai"
        });
        console.log(this.sqlDesignerHeight);
        this.sqlCodeMirror.setSize("100%", this.sqlDesignerHeight);
        var _self=this;
        this.sqlCodeMirror.on("change",function (cMirror) {
            console.log(cMirror.getValue());
            _self.sqlText=cMirror.getValue();
        });*/
        this.monacoEditor = monaco.editor.create(document.getElementById('sql-editor'), {
            value:``,
            //编辑器初始显示文字
            language:'sql',
            minimap: { enabled: false },
            automaticLayout: true,//自动布局
            theme:'vs-dark' //官方自带三种主题vs, hc-black, or vs-dark
        });
    },
    methods:{
        getValue:function () {
            this.monacoEditor.getModel().getValue();
        },
        setValue:function (value) {
            this.monacoEditor.getModel().setValue(value);
        },
        setAboutTableFields:function(selfTableFields,parentTableFields){
            this.selfTableFields=selfTableFields;
            this.parentTableFields=parentTableFields;
        },
        insertEnvToEditor:function (code) {
            this.insertCodeAtCursor(code);
        },
        insertFieldToEditor:function(sourceType,event){
            let sourceFields=null;
            if(sourceType=="selfTableFields"){
                sourceFields=this.selfTableFields;
            }
            else{
                sourceFields=this.parentTableFields;
            }
            for(var i=0;i<sourceFields.length;i++){
                if(sourceFields[i].fieldName==event){
                    this.insertCodeAtCursor(sourceFields[i].tableName+"."+sourceFields[i].fieldName);
                }
            }
        },
        insertCodeAtCursor:function(code){
            //var doc = this.monacoEditor.getModel();
            this.monacoEditor.trigger('keyboard', 'type', {text: code});
        }
    }
}
</script>

<style scoped>

</style>