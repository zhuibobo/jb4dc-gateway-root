<template>
    <div class="html-design-plugin-dialog-wraper" id="dialogApp" v-cloak>
        <uid-select-single-webform-dialog ref="selectSingleWebformDialog" @on-selected-form="onSelectedForm"></uid-select-single-webform-dialog>
        <a-tabs tab-position="top" size="small" type="card">
            <a-tab-pane key="bindInfo" tab="绑定信息">
                <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                    <colgroup>
                        <col style="width: 100px" />
                        <col style="width: 280px" />
                        <col style="width: 100px" />
                        <col />
                    </colgroup>
                    <tbody>
                    <tr>
                        <td colspan="4">绑定窗体：<button class="btn-select fright" @click="selectWebFormBegin">...</button></td>
                    </tr>
                    <tr style="height: 35px">
                        <td colspan="4" style="background-color: #ffffff;">
                            <span v-if="normalProps.formName!=''">模块：【{{normalProps.formModuleName}}】 ----  窗体：【{{normalProps.formName}}】 序号：【{{normalProps.formCode}}】---  <a>编辑窗体</a></span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            按钮标题：
                        </td>
                        <td colspan="3">
                            <input type="text" v-model="normalProps.buttonCaption" style="width: 120px" />&nbsp;&nbsp;
                            <div class="ant-btn-group">
                                <a-button @click="setButtonCaption('新增')" size="small">新增</a-button>
                                <a-button @click="setButtonCaption('修改')" size="small">修改</a-button>
                                <a-button @click="setButtonCaption('删除')" size="small">删除</a-button>
                                <a-button @click="setButtonCaption('查看')" size="small">查看</a-button>
                                <a-button @click="setButtonCaption('处理')" size="small">处理</a-button>
                                <a-button @click="setButtonCaption('审核')" size="small">审核</a-button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            打开方式：
                        </td>
                        <td colspan="3">
                            <a-radio-group type="button" style="margin: auto" v-model:value="normalProps.openType" size="small">
                                <a-radio-button value="Dialog">对话框</a-radio-button>
                                <a-radio-button value="NewWindow">新窗口</a-radio-button>
                            </a-radio-group>
                            &nbsp;&nbsp;宽度 * 高度&nbsp;&nbsp;：
                            <a-input-number :max="3000" :min="400" v-model:value="normalProps.windowWidth"></a-input-number>&nbsp;&nbsp;*&nbsp;&nbsp;
                            <a-input-number :max="1500" :min="300" v-model:value="normalProps.windowHeight"></a-input-number>&nbsp;&nbsp;
                            <div class="ant-btn-group">
                                <a-button @click="setWindowWH(800,640)" size="small">800*640</a-button>
                                <a-button @click="setWindowWH(1124,768)" size="small">1124*768</a-button>
                                <a-button @click="setWindowWH(1324,900)" size="small">1324*900</a-button>
                                <a-button @click="setWindowWH(0,0)" size="small">full</a-button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            是否显示：
                        </td>
                        <td>
                            <a-radio-group type="button" style="margin: auto" v-model:value="normalProps.isShow" size="small">
                                <a-radio-button value="true">是</a-radio-button>
                                <a-radio-button value="false">否</a-radio-button>
                            </a-radio-group>
                        </td>
                        <td>
                            窗体标题：
                        </td>
                        <td>
                            <a-input v-model:value="normalProps.windowCaption" size="small" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            操作类型：
                        </td>
                        <td>
                            <a-radio-group type="button" style="margin: auto" v-model:value="normalProps.operation" size="small">
                                <a-radio-button value="add">新增数据</a-radio-button>
                                <a-radio-button value="update">修改数据</a-radio-button>
                                <a-radio-button value="view">查看数据</a-radio-button>
                            </a-radio-group>
                        </td>
                        <td>
                            绑定权限：
                        </td>
                        <td>
                            <a-select v-model:value="normalProps.bindAuthority" style="width: 200px">
                                <a-select-option value="notAuth">无权限绑定</a-select-option>
                            </a-select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            内部按钮：
                        </td>
                        <td colspan="3">
                            <inner-form-button-list-comp ref="innerFormButtonListComp" :form-id="normalProps.formId"></inner-form-button-list-comp>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </a-tab-pane>
            <a-tab-pane key="baseInfo" tab="基础信息">
                <uid-control-base-info v-model:value="baseInfo">
                </uid-control-base-info>
            </a-tab-pane>
            <a-tab-pane key="devMethodExtend" tab="开发方法扩展">
                <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                    <colgroup>
                        <col style="width: 150px" />
                        <col />
                    </colgroup>
                    <tbody>
                    <tr>
                        <td>
                            服务端解析类：
                        </td>
                        <td>
                            <a-input v-model:value="normalProps.custServerResolveMethod" placeholder="服务端解析,保存模版时候调用一次,类全称,需要实现接口IFormButtonCustResolve" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            参数：
                        </td>
                        <td>
                            <a-input v-model:value="normalProps.custServerResolveMethodPara" placeholder="服务端解析类的参数" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            客户端渲染方法：
                        </td>
                        <td>
                            <a-input v-model:value="normalProps.custClientRendererMethod" placeholder="客户端渲染方法,按钮将经由该方法渲染,最终形成页面元素,需要返回最终元素的HTML对象" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            参数：
                        </td>
                        <td>
                            <a-input v-model:value="normalProps.custClientRendererMethodPara" placeholder="客户端渲染方法的参数" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            客户端渲染后方法：
                        </td>
                        <td>
                            <a-input v-model:value="normalProps.custClientRendererAfterMethodPara" placeholder="客户端渲染后调用方法,经过默认的渲染,无返回值" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            参数：
                        </td>
                        <td>
                            <a-input v-model:value="normalProps.custClientRendererAfterMethodParaPara" placeholder="客户端渲染后方法的参数" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            客户端点击前方法：
                        </td>
                        <td>
                            <a-input v-model:value="normalProps.custClientClickBeforeMethod" placeholder="客户端点击该按钮时的前置方法,如果返回false将阻止默认调用" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            参数：
                        </td>
                        <td>
                            <a-input v-model:value="normalProps.custClientClickBeforeMethodPara" placeholder="客户端点击前方法的参数" />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </a-tab-pane>
            <a-tab-pane key="devPropsExtend" tab="开发属性扩展">
                <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                    <colgroup>
                        <col style="width: 150px" />
                        <col />
                    </colgroup>
                    <tbody>
                    <tr>
                        <td>
                            唯一名：
                        </td>
                        <td>
                            <a-input v-model:value="normalProps.custSingleName" placeholder="按钮的唯一名称,使用英文字母,可以为空,不为空时将检测是否唯一,将存入表TBUILD_LIST_BUTTON中" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            URL附加参数：
                        </td>
                        <td>
                            <a-input v-model:value="normalProps.custUrlAppendPara" placeholder="打开表单时的url附加参数,eg:name=1&age=2,变量替换规则参考......." />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            URL格式化方法：
                        </td>
                        <td>
                            <a-input v-model:value="normalProps.custUrlAppendParaFormat" placeholder="针对[URL附加参数]的格式化方法,使用返回值作为附加参数" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            自定义属性1：
                        </td>
                        <td>
                            <a-input v-model:value="normalProps.custProp1" placeholder="自定义的属性1,将存入表TBUILD_LIST_BUTTON中" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            自定义属性2：
                        </td>
                        <td>
                            <a-input v-model:value="normalProps.custProp2" placeholder="自定义的属性2,将存入表TBUILD_LIST_BUTTON中" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            自定义属性3：
                        </td>
                        <td>
                            <a-input v-model:value="normalProps.custProp3" placeholder="自定义的属性3,将存入表TBUILD_LIST_BUTTON中" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            自定义属性4：
                        </td>
                        <td>
                            <a-input v-model:value="normalProps.custProp4" placeholder="自定义的属性4,将存入表TBUILD_LIST_BUTTON中" />
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
    name: "WLDCT_FormButtonProperty",
    data(){
        return {
            baseInfo:GeneralPlugin.defaultProps.baseInfo,
            normalProps:{
                //按钮类型
                buttonType:"ListFormButton",
                //绑定窗体信息
                formModuleId:"",
                formModuleName:"",
                formId:"",
                formName:"",
                formCode:"",
                //其他信息
                buttonCaption:"",
                windowCaption:"JBUILD4D",
                openType:"Dialog",
                windowHeight:640,
                windowWidth:800,
                isShow:"true",
                operation:"add",
                bindAuthority:"notAuth",
                //开发方法扩展
                custServerResolveMethod:"",
                custServerResolveMethodPara:"",
                custClientRendererMethod:"",
                custClientRendererMethodPara:"",
                custClientRendererAfterMethodPara:"",
                custClientRendererAfterMethodParaPara:"",
                custClientClickBeforeMethod:"",
                custClientClickBeforeMethodPara:"",
                //开发属性扩展
                custSingleName:"",
                custUrlAppendPara:"",
                custUrlAppendParaFormat:"",
                custProp1:"",
                custProp2:"",
                custProp3:"",
                custProp4:"",
                //内部按钮
                innerButtonJsonString:""
            },
            actionName:""
        }
    },
    mounted:function () {

    },
    methods: {
        setWindowWH:function(width,height){
            this.normalProps.windowWidth=width;
            this.normalProps.windowHeight=height;
        },
        setButtonCaption:function(buttonCaption){
            this.normalProps.buttonCaption=buttonCaption;
        },
        selectWebFormBegin:function(){
            this.$refs.selectSingleWebformDialog.beginSelectForm(this.normalProps.formId);
        },
        onSelectedForm:function(formData){
            this.normalProps.formModuleId=formData.formModuleId;
            this.normalProps.formModuleName=formData.formModuleName;
            this.normalProps.formId=formData.formId;
            this.normalProps.formName=formData.formName;
            this.normalProps.formCode=formData.formCode;
            console.log(this.normalProps);
        },
        /*ready:function(actionName,sel,parents){
            //debugger;
            this.baseInfo.id="form_button_"+StringUtility.Timestamp();
            this.baseInfo.name=this.baseInfo.id;
            //console.log(actionName);

            this.actionName=actionName;
            if(actionName=="Insert"){
                this.$refs.innerFormButtonListComp.ready(null);
            }
        },*/
        getControlProps:function () {
            //var bindData=this.$refs.listSearchControlBindToComp.getData();
            this.normalProps.innerButtonJsonString=this.$refs.innerFormButtonListComp.getJson();
            this.baseInfo.serialize="false";

            if(this.normalProps.buttonCaption==""){
                DialogUtility.AlertText("请设置按钮标题");
                return {success: false};
            }

            if(this.normalProps.formId==""){
                DialogUtility.AlertText("请设置绑定的窗体");
                return {success: false};
            }

            var result = {
                success: true,
                baseInfo: this.baseInfo,
                normalProps: this.normalProps
            };
            //console.log(result);
            return result;
        },
        setControlProps:function ($elem,props) {
            //console.log($elem);
            //debugger;
            this.baseInfo = props.baseInfo ? props.baseInfo : this.baseInfo;
            this.normalProps.buttonType = "ListFormButton";
            //绑定窗体信息
            this.normalProps.formModuleId = $elem.attr("formmoduleid");
            this.normalProps.formModuleName = $elem.attr("formmodulename");
            this.normalProps.formId = $elem.attr("formid");
            this.normalProps.formName = $elem.attr("formname");
            this.normalProps.formCode = $elem.attr("formcode");
            this.normalProps.buttonCaption = $elem.attr("buttoncaption");
            this.normalProps.windowCaption = $elem.attr("windowcaption");
            this.normalProps.openType = $elem.attr("opentype")?$elem.attr("opentype"):"Dialog";
            this.normalProps.windowHeight = parseInt($elem.attr("windowheight"));
            this.normalProps.windowWidth =parseInt($elem.attr("windowwidth"));
            this.normalProps.isShow = $elem.attr("isshow")?$elem.attr("isshow"):"true";
            this.normalProps.operation = $elem.attr("operation");
            this.normalProps.bindAuthority = $elem.attr("bindauthority")?$elem.attr("bindauthority"):"notAuth";
            this.normalProps.custServerResolveMethod =$elem.attr("custserverresolvemethod");
            this.normalProps.custServerResolveMethodPara = $elem.attr("custserverresolvemethodpara");
            this.normalProps.custClientRendererMethod =$elem.attr("custclientrenderermethod");
            this.normalProps.custClientRendererMethodPara = $elem.attr("custclientrenderermethodpara");
            this.normalProps.custClientRendererAfterMethodPara =$elem.attr("custclientrendereraftermethodpara");
            this.normalProps.custClientRendererAfterMethodParaPara = $elem.attr("custclientrendereraftermethodparapara");
            this.normalProps.custClientClickBeforeMethod = $elem.attr("custclientclickbeforemethod");
            this.normalProps.custClientClickBeforeMethodPara = $elem.attr("custclientclickbeforemethodpara");
            this.normalProps.innerButtonJsonString = $elem.attr("innerbuttonjsonstring");

            this.normalProps.custSingleName = $elem.attr("custsinglename");
            this.normalProps.custUrlAppendPara = $elem.attr("custurlappendpara");
            this.normalProps.custUrlAppendParaFormat = $elem.attr("custurlappendparaformat");
            this.normalProps.custProp1 = $elem.attr("custprop1");
            this.normalProps.custProp2 = $elem.attr("custprop2");
            this.normalProps.custProp3 = $elem.attr("custprop3");
            this.normalProps.custProp4 = $elem.attr("custprop4");

            //console.log(this.actionName);
            if(this.actionName=="Edit") {
                this.$refs.innerFormButtonListComp.ready(this.normalProps.innerButtonJsonString);
                console.log(this.normalProps.innerButtonJsonString);
            }
            //this.bindToSearchField = props.bindToSearchField ? props.bindToSearchField : this.bindToSearchField;
            //this.defaultValue = props.defaultValue ? props.defaultValue : this.defaultValue;
            //this.$refs.listSearchControlBindToComp.setData(this.bindToSearchField,this.defaultValue);
        }
    }
}
</script>

<style scoped>

</style>