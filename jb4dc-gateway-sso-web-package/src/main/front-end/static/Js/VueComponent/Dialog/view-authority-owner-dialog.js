/*
**Created by IntelliJ IDEA.
**User: zhuangrb
**Date: 2021/01/16
**To change this template use File | Settings | File Templates.
**查看权限关联对象1
*/
Vue.component("view-authority-owner-dialog", {
    data: function () {
        return {
            acInterface:{
                getObjAuthOwnerDesc:"/Rest/SSO/Auth/Authority/GetObjAuthOwnerDesc"
            },
            ObjAuthOwnerDescData:[]
        }
    },
    mounted:function(){

    },
    methods:{
        showDialog:function (authObjId,title) {
            var elem=this.$refs.viewAuthorityOwnerDialogWrap;
            //debugger;
            //this.getOrganDataInitTree();
            //alert();
            var dialogHeight=460;
            if(PageStyleUtility.GetPageHeight()>700){
                dialogHeight=660;
            }
            this.listHeight=dialogHeight-230;

            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 970,
                height: dialogHeight,
                title: title
            });
            AjaxUtility.Get(this.acInterface.getObjAuthOwnerDesc, {authObjId:authObjId}, function (result) {
                if (result.success) {
                    console.log(result);
                    this.ObjAuthOwnerDescData=result.data;
                }
            },this);
        }
    },
    template: `<div ref="viewAuthorityOwnerDialogWrap" class="c1-select-model-wrap general-edit-page-wrap" style="display: none">
                    <div v-for="ObjAuthOwnerItem in ObjAuthOwnerDescData">
                        <div>
                            <Divider>{{ObjAuthOwnerItem.Type}}[{{ObjAuthOwnerItem.Name}}]</Divider>
                        </div>
                        <div>
                            <Tag color="geekblue" v-for="(innObj,index) in ObjAuthOwnerItem.Data" :key="ObjAuthOwnerItem.Key+index">{{innObj.PARENT_ORGAN_NAME}}->{{innObj.USER_ORGAN_NAME}}:{{innObj.USER_NAME}}</Tag>
                        </div>
                    </div>
                </div>`
});
