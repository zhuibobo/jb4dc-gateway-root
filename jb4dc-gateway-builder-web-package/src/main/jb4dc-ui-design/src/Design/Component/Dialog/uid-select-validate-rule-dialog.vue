<template>
    <div style="position: absolute;top: -1000px">
        <div ref="selectValidateRuleDialogWrap" v-cloak class="general-edit-page-wrap html-design-plugin-dialog-wraper">
            <a-card title="设置验证规则" style="margin-top: 10px" >
                <div>
                    <a-radio-group type="button" v-model:value="selectValidateType">
                        <a-radio-button value="NoEmpty">不为空</a-radio-button>
                        <a-radio-button value="Number">数字</a-radio-button>
                        <a-radio-button value="Mobile">手机</a-radio-button>
                        <a-radio-button value="Date">日期</a-radio-button>
                        <a-radio-button value="Time">时间</a-radio-button>
                        <a-radio-button value="DateTime">日期时间</a-radio-button>
                        <a-radio-button value="EMail">邮件</a-radio-button>
                        <a-radio-button value="IDCard">身份证</a-radio-button>
                        <a-radio-button value="URL">URL</a-radio-button>
                        <a-radio-button value="ENCode">英文</a-radio-button>
                        <a-radio-button value="SimpleCode">特殊字符</a-radio-button>
                        <a-radio-button value="Regular">正则表达式</a-radio-button>
                        <a-radio-button value="JsMethod">JS方法</a-radio-button>
                    </a-radio-group>
                    <a-button type="primary" style="margin-left: 15px;cursor: pointer" @click="addValidateRule" shape="circle"><template #icon><plus-outlined /></template></a-button>
                </div>
                <div>
                    <a-divider orientation="left" style="font-size: 12px">参数设置</a-divider>
                    <!--数字类型参数设置-->

                    <div v-if="selectValidateType=='Number'">
                        <table class="html-design-plugin-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                            <colgroup>
                                <col style="width: 12%" />
                                <col style="width: 38%" />
                                <col style="width: 12%" />
                                <col />
                            </colgroup>
                            <tbody>
                            <tr>
                                <td>长度：</td>
                                <td>
                                    <a-input-number :max="10" :min="1" v-model:value="ruleParas.numLength" size="small" style="width: 100%"></a-input-number>
                                </td>
                                <td>小数位数：</td>
                                <td>
                                    <a-input-number :max="10" :min="0" v-model:value="ruleParas.decimalLength" size="small" style="width: 100%"></a-input-number>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--正则表达式类型参数设置-->
                    <div v-if="selectValidateType=='Regular'">
                        <table class="html-design-plugin-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                            <colgroup>
                                <col style="width: 12%" />
                                <col style="width: 38%" />
                                <col style="width: 12%" />
                                <col />
                            </colgroup>
                            <tbody>
                            <tr>
                                <td>表达式：</td>
                                <td>
                                    <a-input v-model:value="ruleParas.regularText" size="small" style="width: 100%"></a-input>
                                </td>
                                <td>提示信息：</td>
                                <td>
                                    <a-input v-model="ruleParas.regularMsg" size="small" style="width: 100%"></a-input>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--JS方法类型参数设置-->
                    <div v-if="selectValidateType=='JsMethod'">
                        <table class="html-design-plugin-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                            <colgroup>
                                <col style="width: 12%" />
                                <col />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <td>方法名：</td>
                                    <td>
                                        <a-input v-model:value="ruleParas.jsMethodName" size="small" style="width: 100%"></a-input>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </a-card>
            <a-card title="已添加规则" style="margin-top: 10px">
                <div style="margin-bottom: 10px">
                    <a-divider orientation="left" style="font-size: 12px;margin-top: 0px;margin-bottom: 6px">提示信息</a-divider>
                    <table class="html-design-plugin-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                        <colgroup>
                            <col />
                        </colgroup>
                        <tbody>
                            <tr>
                                <td>
                                    <a-input placeholder="请输入提示信息..." v-model:value="ruleParas.msg" size="small" style="width: 100%"></a-input>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style="margin-bottom: 10px;overflow: auto" class="iv-list-page-wrap">
                    <a-divider orientation="left" style="font-size: 12px;margin-top: 0px;margin-bottom: 6px">验证规则</a-divider>
                    <a-table bordered :columns="validateColumnsConfig" :dataSource="addedValidateRule"
                             class="iv-list-table" size="small" no-data-text="请添加验证规则" :scroll="{ y: 200 }"></a-table>
                </div>
            </a-card>
            <div class="button-outer-wrap">
                <div class="button-inner-wrap">
                    <a-button type="primary" @click="selectComplete()"> 确 认 </a-button>
                    <a-button type="primary" @click="clearComplete()"> 清 空 </a-button>
                    <a-button @click="handleClose()">关 闭</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "uid-select-validate-rule-dialog",
    data:function () {
        var _self=this;

        return {
            selectValidateType:"NoEmpty",
            ruleParas:{
                msg:"字段",
                numLength:4,
                decimalLength:0,
                jsMethodName:"",
                regularText:"",
                regularMsg:""
            },
            addedValidateRule:[],
            validateColumnsConfig: [
                {
                    title: '类型',
                    key: 'validateType',
                    dataIndex:"validateType",
                    width: 150,
                    align: "center"
                },{
                    title: '参数',
                    key: 'validateParas',
                    dataIndex:"validateParas",
                    align: "center"
                }, {
                    title: '删除',
                    key: 'validateId',
                    dataIndex: 'validateParas',
                    width: 120,
                    align: "center",
                    render: function (h, params) {
                        return h('div',{class: "list-row-button-wrap"},[
                            h('div', {
                                class: "list-row-button del",
                                on: {
                                    click: function () {
                                        _self.delValidate(params.row["validateId"]);
                                    }
                                }
                            })
                        ]);
                    }
                }
            ]
        }
    },
    mounted:function (){
        //this.loadData();
    },
    methods:{
        beginSelect:function(oldData) {
            //debugger;
            var elem = this.$refs.selectValidateRuleDialogWrap;
            //debugger;
            //this.getTableDataInitTree();

            var height = 450;
            /*if(PageStyleUtility.GetPageHeight()>550){
                height=600;
            }*/

            DialogUtility.DialogElemObj(elem, {
                modal: true,
                height: 780,
                width: 1080,
                title: "设置验证规则"
            });

            $(window.document).find(".ui-widget-overlay").css("zIndex", 10100);
            $(window.document).find(".ui-dialog").css("zIndex", 10101);

            this.ruleParas.msg = "auto";
            this.ruleParas.numLength = 4;
            this.ruleParas.decimalLength = 0;
            this.ruleParas.jsMethodName = "";
            this.ruleParas.regularText = "";
            this.ruleParas.regularMsg = "";
            this.addedValidateRule=[];

            this.bindOldSelectedValue(oldData);
        },
        bindOldSelectedValue:function(oldData){
            var oldSelectedValue= oldData;
            //debugger;
            if(oldSelectedValue.rules.length>0) {
                this.addedValidateRule=oldSelectedValue.rules;
                this.ruleParas.msg=oldSelectedValue.msg;
            }
        },
        getSelectInstanceName:function () {
            return BaseUtility.GetUrlParaValue("instanceName");
        },
        selectComplete:function(){
            var result=this.addedValidateRule;
            if(this.addedValidateRule.length>0) {
                var result={
                    msg:this.ruleParas.msg,
                    rules:this.addedValidateRule
                };
                //window.OpenerWindowObj[this.getSelectInstanceName()].setSelectValidateRuleResultValue(result);

                this.$emit('on-selected-validate-rule', JsonUtility.CloneSimple(result));
                this.handleClose();
            }
            else{
                this.clearComplete();
            }
        },
        clearComplete:function(){
            //window.OpenerWindowObj[this.getSelectInstanceName()].setSelectValidateRuleResultValue(null);
            this.$emit('on-clear-validate-rule');
            this.handleClose();
        },
        handleClose:function(){
            /*if(window.IsOpenForFrame){
                DialogUtility.Frame_CloseDialog(window)
            }
            else {
                DialogUtility.CloseOpenIframeWindow(window, DialogUtility.DialogId);
            }*/
            DialogUtility.CloseDialogElem(this.$refs.selectValidateRuleDialogWrap);
        },
        addValidateRule:function(){
            //debugger;
            var validateParas="";
            if(this.selectValidateType=="Number"){
                validateParas=JsonUtility.JsonToString({
                    numLength:this.ruleParas.numLength,
                    decimalLength:this.ruleParas.decimalLength
                });
            }
            else if(this.selectValidateType=="Regular"){
                validateParas=JsonUtility.JsonToString({
                    regularText:this.ruleParas.regularText,
                    regularMsg:this.ruleParas.regularMsg
                });
            }
            else if(this.selectValidateType=="JsMethod"){
                validateParas=JsonUtility.JsonToString({
                    jsMethodName:this.ruleParas.jsMethodName
                });
            }
            var newValidateRule={
                "validateId":StringUtility.Timestamp(),
                "validateType":this.selectValidateType,
                "validateParas":validateParas
            };
            this.addedValidateRule.push(newValidateRule);
        },
        delValidate:function (validateId) {
            //debugger;
            //console.log(this.addedValidateRule);
            for(var i=0;i<this.addedValidateRule.length;i++){
                if(this.addedValidateRule[i].validateId==validateId){
                    this.addedValidateRule.splice(i,1);
                }
            }
        }
    }
}
</script>

<style scoped>

</style>