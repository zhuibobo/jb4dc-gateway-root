<template>
  <div class="html-design-plugin-dialog-wraper" id="dialogApp" v-cloak>
    <a-tabs tab-position="top" size="small" type="card">
      <a-tab-pane key="bindInfo" tab="绑定信息">
        <table class="html-design-plugin-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
          <colgroup>
            <col style="width: 120px"/>
            <col style="width: 240px"/>
            <col style="width: 90px"/>
            <col style="width: 120px"/>
            <col style="width: 90px"/>
            <col/>
          </colgroup>
          <tbody>
          <tr>
            <td>触发按钮：</td>
            <td>
              <a-select v-model:value="normalProps.targetButtonId" style="width:230px" :clearable="true"
                        @change="changeTargetButton">
                <a-select-option :value="item.buttonId" v-for="item in buttons">{{ item.buttonCaption }}
                </a-select-option>
              </a-select>
            </td>
            <td>标题：</td>
            <td colspan="3">
              <input type="text" v-model="normalProps.caption"/>
            </td>
          </tr>
          <tr>
            <td>选定图标：</td>
            <td colspan="5">
              <div class="uid-wldct-list-table-inner-button-container-wrap ">
                <div :class="normalProps.selectedClass"></div>
              </div>
            </td>
          </tr>
          <tr>
            <td>可选图标：</td>
            <td colspan="5">
              <div class="uid-wldct-list-table-inner-button-container-wrap ">
                <div class="wldct-list-table-row-inner-button view" @click="changeSelectedClass('view')"></div>
                <div class="wldct-list-table-row-inner-button edit" @click="changeSelectedClass('edit')"></div>
                <div class="wldct-list-table-row-inner-button del" @click="changeSelectedClass('del')"></div>
                <div class="wldct-list-table-row-inner-button selected" @click="changeSelectedClass('selected')"></div>
                <div class="wldct-list-table-row-inner-button listmanager"
                     @click="changeSelectedClass('listmanager')"></div>
                <div class="wldct-list-table-row-inner-button edit-model"
                     @click="changeSelectedClass('edit-model')"></div>
                <div class="wldct-list-table-row-inner-button view-model"
                     @click="changeSelectedClass('view-model')"></div>
                <div class="wldct-list-table-row-inner-button move-up" @click="changeSelectedClass('move-up')"></div>
                <div class="wldct-list-table-row-inner-button move-down"
                     @click="changeSelectedClass('move-down')"></div>
                <div class="wldct-list-table-row-inner-button kded" @click="changeSelectedClass('kded')"></div>
                <div class="wldct-list-table-row-inner-button grade" @click="changeSelectedClass('grade')"></div>
                <div class="wldct-list-table-row-inner-button image-cultured"
                     @click="changeSelectedClass('image-cultured')"></div>
                <div class="wldct-list-table-row-inner-button page-white-edit"
                     @click="changeSelectedClass('page-white-edit')"></div>
                <div class="wldct-list-table-row-inner-button page-attach"
                     @click="changeSelectedClass('page-attach')"></div>
                <div class="wldct-list-table-row-inner-button page-go" @click="changeSelectedClass('page-go')"></div>
                <div class="wldct-list-table-row-inner-button script-key"
                     @click="changeSelectedClass('script-key')"></div>
                <div class="wldct-list-table-row-inner-button wrench-orange"
                     @click="changeSelectedClass('wrench-orange')"></div>
                <div class="wldct-list-table-row-inner-button x-office-document-template"
                     @click="changeSelectedClass('x-office-document-template')"></div>
                <div class="wldct-list-table-row-inner-button x-office-drawing"
                     @click="changeSelectedClass('x-office-drawing')"></div>
                <div class="wldct-list-table-row-inner-button kjobviewer"
                     @click="changeSelectedClass('kjobviewer')"></div>
              </div>
            </td>
          </tr>
          <tr>
            <td>提示信息：</td>
            <td colspan="5">
              <input type="text" v-model="normalProps.alertMsg"/>
            </td>
          </tr>
          <tr>
            <td>显示条件：</td>
            <td colspan="5">
              <input type="text" v-model="normalProps.displayCondition"/>
              <div class="eg-message">
                eg:record.字段=="是1"
              </div>
            </td>
          </tr>
          <tr>
            <td>显示条件方法：</td>
            <td colspan="5">
              <input type="text" v-model="normalProps.displayConditionFunc"/>
            </td>
          </tr>
          </tbody>
        </table>
      </a-tab-pane>
      <a-tab-pane key="baseInfo" tab="基础信息">
        <uid-control-base-info v-model:value="baseInfo">
        </uid-control-base-info>
      </a-tab-pane>
      <a-tab-pane key="devExtend" tab="开发扩展">
        <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
          <colgroup>
            <col style="width: 150px"/>
            <col/>
          </colgroup>
          <tbody>
          <tr>
            <td>
              服务端解析类：
            </td>
            <td>
              <a-input v-model:value="normalProps.custServerResolveMethod"
                       placeholder="按钮进行服务端解析时,保存模版时候调用,类全称,需要实现接口IListTableLabelCustResolve"/>
            </td>
          </tr>
          <tr>
            <td>
              参数：
            </td>
            <td>
              <a-input v-model:value="normalProps.custServerResolveMethodPara" placeholder="服务端解析类的参数"/>
            </td>
          </tr>
          <tr>
            <td>
              客户端渲染方法：
            </td>
            <td>
              <a-input v-model:value="normalProps.custClientRendererMethod"
                       placeholder="客户端渲染方法,生成前端页面时调动,最终形成页面元素,需要返回最终元素的HTML对象"/>
            </td>
          </tr>
          <tr>
            <td>
              参数：
            </td>
            <td>
              <a-input v-model:value="normalProps.custClientRendererMethodPara" placeholder="客户端渲染方法的参数"/>
            </td>
          </tr>
          </tbody>
        </table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import GeneralPlugin from "../../GeneralPlugin";
import RemoteRestInterface from "../../../Remote/RemoteRestInterface";

export default {
  name: "WLDCT_ListTableInnerButtonSingleProperty",
  data() {
    return {
      baseInfo: GeneralPlugin.defaultProps.baseInfo,
      defaultValue: GeneralPlugin.defaultProps.defaultValue,
      normalProps: {
        targetButtonId: "",
        selectedClass: "wldct-list-table-row-inner-button view",
        caption: "",
        alertMsg: "",
        displayCondition: "",
        displayConditionFunc: "",
        //开发扩展
        custServerResolveMethod: "",
        custServerResolveMethodPara: "",
        custClientRendererMethod: "",
        custClientRendererMethodPara: ""
      },
      dataSetId: null,
      buttons: []
    }
  },
  mounted: function () {

  },
  methods: {
    /*ready: function (actionName, sel, parents) {
      this.baseInfo.id = "btn_lt_inner_" + StringUtility.Timestamp();
      this.baseInfo.name = this.baseInfo.id;

      this.dataSetId = CKEditorPluginUtility.TryGetDataSetId(sel, parents);
      this.buttons = CKEditorPluginUtility.TryGetListButtonsInPluginPage();
    },*/
    //bindDataSetFieldTree: function () {
      /*if(this.dataSetId){
            var dataSetPO=window.parent.listDesign.getDataSet(this.dataSetId);
            this.$refs.listTableLabelBindToComp.init(dataSetPO,this.buttons);
        }
        else {
            DialogUtility.AlertText("请先设定DataSet");
        }*/
    //},
    getControlProps: function () {
      //var bindData=this.$refs.listTableLabelBindToComp.getData();
      //for(var key in this.normalProps)
      if (this.normalProps.targetButtonId == "") {
        DialogUtility.AlertText("请设定触发的按钮!");
        return {success: false};
      }
      var result = {
        success: true,
        baseInfo: this.baseInfo,
        normalProps: {
          targetButtonId: this.normalProps.targetButtonId,
          selectedClass: this.normalProps.selectedClass,
          caption: this.normalProps.caption,
          alertMsg: this.normalProps.alertMsg,
          displayCondition: this.normalProps.displayCondition,
          displayConditionFunc: this.normalProps.displayConditionFunc,
          //开发扩展
          custServerResolveMethod: this.normalProps.custServerResolveMethod,
          custServerResolveMethodPara: this.normalProps.custServerResolveMethodPara,
          custClientRendererMethod: this.normalProps.custClientRendererMethod,
          custClientRendererMethodPara: this.normalProps.custClientRendererMethodPara
        }
      }
      return result;
    },
    setControlProps: function ($elem, props) {

      this.dataSetId = GeneralPlugin.tryGetDataSetId($elem, $elem.parents());
      this.buttons = GeneralPlugin.tryGetListButtonsInPluginPage($elem);
      //debugger;
      //console.log(props);
      this.baseInfo = props.baseInfo ? props.baseInfo : this.baseInfo;
      //this.bindToSearchField = props.bindToSearchField ? props.bindToSearchField : this.bindToSearchField;
      this.defaultValue = props.defaultValue ? props.defaultValue : this.defaultValue;


      this.normalProps.targetButtonId = $elem.attr("targetbuttonid");
      this.normalProps.selectedClass = $elem.attr("selectedClass");
      this.normalProps.selectedClass = $elem.attr("selectedClass");
      this.normalProps.caption = $elem.attr("caption");
      this.normalProps.displayCondition = $elem.attr("displayCondition");
      this.normalProps.displayConditionFunc = $elem.attr("displayConditionFunc");

      this.normalProps.custServerResolveMethod = $elem.attr("custserverresolvemethod");
      this.normalProps.custServerResolveMethodPara = $elem.attr("custserverresolvemethodpara");
      this.normalProps.custClientRendererMethod = $elem.attr("custclientrenderermethod");
      this.normalProps.custClientRendererMethodPara = $elem.attr("custclientrenderermethodpara");

      //this.$refs.listTableLabelBindToComp.setData(this.normalProps,this.defaultValue);
    },
    changeSelectedClass: function (className) {
      this.normalProps.selectedClass = "wldct-list-table-row-inner-button " + className;
    },
    changeTargetButton: function (buttonId) {
      //console.log(this.buttons);
      for (var i = 0; i < this.buttons.length; i++) {
        var item = this.buttons[i];
        if (item.buttonId == buttonId) {
          //console.log(item);
          if (item.buttonCaption == "修改") {
            this.changeSelectedClass("edit");
            this.normalProps.caption = "修改";
          } else if (item.buttonCaption == "查看") {
            this.changeSelectedClass("view");
            this.normalProps.caption = "查看";
          } else if (item.buttonCaption == "删除") {
            this.changeSelectedClass("del");
            this.normalProps.caption = "删除";
          } else if (item.buttonCaption == "处理") {
            this.changeSelectedClass("page-white-edit");
            this.normalProps.caption = "处理";
          }
          break;
        }
      }
    }
  }
}
</script>

<style scoped>

</style>