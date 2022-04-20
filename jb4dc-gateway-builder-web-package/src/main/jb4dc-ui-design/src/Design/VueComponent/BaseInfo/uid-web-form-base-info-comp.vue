<template>
  <div style="width: 1224px;margin: auto">
    <a-tabs tab-position="left">
      <a-tab-pane key="tab-base-info" tab="基础设置">
        <div style="width: 1024px;height: 785px;border: #ddddf1 1px solid;border-radius: 4px;padding: 10px 20px 10px 10px;">
          <a-divider orientation="left" style="font-size: 12px">表单信息</a-divider>
          <table class="form-table">
            <colgroup>
              <col style="width: 10%;">
              <col style="width: 40%;">
              <col style="width: 10%;">
              <col style="width: 40%;">
            </colgroup>
            <tr>
              <td>表单名称：</td>
              <td>
                <a-input v-model:value="formResourceEntity.formName" placeholder="请输入表单名称"></a-input>
              </td>
              <td>唯一名称：</td>
              <td>
                <a-input v-model:value="formResourceEntity.formSingleName" placeholder="可以为空"></a-input>
              </td>
            </tr>
            <tr>
              <td>备注：</td>
              <td colspan="3">
                <a-textarea v-model:value="formResourceEntity.formDesc" type="textarea" :autoSize="{minRows: 2,maxRows: 2}"></a-textarea>
              </td>
            </tr>
            <tr>
              <td>每次解析：</td>
              <td>
                <a-radio-group v-model:value="formResourceEntity.formEveryTimeResolve" type="button">
                  <a-radio-button value="是">是</a-radio-button>
                  <a-radio-button value="否">否</a-radio-button>
                </a-radio-group>
              </td>
              <td>主题：</td>
              <td>
                <a-select v-model:value="formResourceEntity.formTheme"  @change="changeTheme" style="width: 180px">
                  <a-select-option v-for="(item,key) in designThemes" :value="item.value" :key="key">{{item.name}}</a-select-option>
                </a-select>
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>如果风格重新引入CSS则必须在保存后再次打开才生效!</td>
            </tr>
          </table>

          <db-table-relation-comp ref="dbTableRelationComp"></db-table-relation-comp>
        </div>
      </a-tab-pane>
      <a-tab-pane key="tab-extend-config" tab="扩展设置"></a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
export default {
    name: "uid-web-form-base-info-comp",
    data(){
      return {
        formResourceEntity:{
          formId:"",
          formName:"",
          formSingleName:"",
          formCreateTime:DateUtility.GetCurrentDate(),
          formCreator:"",
          formUpdateTime:DateUtility.GetCurrentDate(),
          formUpdater:"",
          formType:"",
          formIsSystem:"否",
          formDesc:"",
          formModuleId:"",
          formStatus:"启用",
          formOrganId:"",
          formOrganName:"",
          formMainTableId:"",
          formMainTableName:"",
          formMainTableCaption:"",
          formDataRelation:"",
          formIsTemplate:"否",
          formContentUrl:"",
          formIsResolve:"否",
          formHtmlSource:"",
          formHtmlResolve:"",
          formJsContent:"",
          formCssContent:"",
          formConfigContent:"",
          formEveryTimeResolve:"否",
          formSource:"Web设计器",
          formTheme:"uid-theme-wrap-default",
          formCustServerRenderer:"",
          formCustRefJs:"",
          formCustClientRenderer:"",
          formCustDesc:"",
          //按钮的内部配置:例如窗体按钮的innerbuttonjsonstring属性
          formInnerButton:"",
          //操作类型:add 新增,judge 按照条件判断,dev 开发自行控制
          formOperationType:"add",
          //API判断条件
          formJudgeApi:"",
          //SQL判断条件
          formJudgeSql:"",
          //设计详细说明
          formDesignRemark:"",
          tryDeployment:true
        },
        designThemes:[{
          name:"默认样式",
          value:"uid-theme-wrap-default"
        }],
      }
    },
    methods:{
      //region 需要实现的方法
      init(recordId,status,completedFunc) {

      },
      save(editorValues,successFun) {

      },
      validateSaveEnable(editorValues){

      },
      //endregion
      changeTheme(){

      },
      getFormRelationConfig(){
        let relationConfig=this.$refs.dbTableRelationComp.getValue();
        return relationConfig;
      }
    }
}
</script>

<style scoped>

</style>