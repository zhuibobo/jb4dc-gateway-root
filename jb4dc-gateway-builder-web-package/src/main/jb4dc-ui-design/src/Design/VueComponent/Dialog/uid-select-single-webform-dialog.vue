<template>
    <div ref="selectModelDialogWrap" class="general-edit-page-wrap html-design-plugin-dialog-wraper"
         style="display: none;">
        <div>
            <a-input search class="input_border_bottom" ref="txt_form_search_text" placeholder="请输入表单名称">
            </a-input>
            <div style="height: 374px;border: solid 1px #D5DBDB;border-top: 0px;overflow: auto">
                <ul ref="formZTreeUL" class="ztree"></ul>
            </div>
        </div>
        <div class="button-outer-wrap" style="bottom: 12px;right: 12px">
            <div class="button-inner-wrap">
                <a-button type="primary" @click="completed()">确认</a-button>
                <a-button @click="handleClose()">关闭</a-button>
            </div>
        </div>
    </div>
</template>

<script>
import remoteRestInterface from "../../Remote/RemoteRestInterface.js"

export default {
    name: "uid-select-single-webform-dialog",
    data: function () {
        return {
            acInterface: {
                getTableDataUrl: "/Rest/Builder/Form/GetWebFormForZTreeNodeList"
            },
            jsEditorInstance: null,
            tree: {
                treeObj: null,
                treeSetting: {
                    view: {
                        dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
                        showLine: true,//是否显示节点之间的连线
                        fontCss: {'color': 'black', 'font-weight': 'normal'}
                    },
                    check: {
                        enable: false,
                        nocheckInherit: false,
                        /*chkStyle: "radio",*/
                        radioType: "all"
                    },
                    data: {
                        key: {
                            name: "text"
                        },
                        simpleData: {//简单数据模式
                            enable: true,
                            idKey: "id",
                            pIdKey: "parentId",
                            rootPId: "-1"// 1
                        }
                    },
                    callback: {
                        //点击树节点事件
                        onClick: function (event, treeId, treeNode) {
                            var _self = this.getZTreeObj(treeId)._host;
                            if (treeNode.nodeTypeName == "WebForm") {
                                _self.selectedForm(event, treeId, treeNode);
                            }
                        }
                    }
                },
                treeData: null
            },
            selectedFormData: null,
            oldSelectedFormId: ""
        }
    },
    mounted: function () {

    },
    methods: {
        handleClose: function () {
            DialogUtility.CloseDialogElem(this.$refs.selectModelDialogWrap);
        },
        beginSelectForm: function (formId) {
            //alert(PageStyleUtility.GetPageHeight());
            let elem = this.$refs.selectModelDialogWrap;
            //debugger;
            this.getFormDataInitTree();

            this.oldSelectedFormId = formId;

            let height = 500;

            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 570,
                height: height,
                title: "选择窗体"
            });
        },
        getFormDataInitTree: function () {
            /*var _self = this;
            AjaxUtility.Post(this.acInterface.getTableDataUrl, {}, function (result) {
                if (result.success) {
                    _self.tree.treeData = result.data;

                    for(var i=0;i<_self.tree.treeData.length;i++){
                        if(_self.tree.treeData[i].nodeTypeName=="WebForm"){
                            _self.tree.treeData[i].icon="Images/Png16X16/table.png";
                        }
                        else if(_self.tree.treeData[i].nodeTypeName=="Module"){
                            _self.tree.treeData[i].icon="Images/Png16X16/folder-table.png";
                        }
                    }

                    _self.$refs.formZTreeUL.setAttribute("id","select-form-single-comp-"+StringUtility.Guid());
                    _self.tree.treeObj = $.fn.zTree.init($(_self.$refs.formZTreeUL), _self.tree.treeSetting, _self.tree.treeData);
                    _self.tree.treeObj.expandAll(true);
                    _self.tree.treeObj._host=_self;
                    fuzzySearchTreeObj(_self.tree.treeObj,_self.$refs.txt_form_search_text.input,null,true);

                    //
                    if(_self.oldSelectedFormId!=null&&_self.oldSelectedFormId!=""){

                        var selectedNode=_self.tree.treeObj.getNodeByParam("id",_self.oldSelectedFormId);
                        _self.tree.treeObj.selectNode(selectedNode);

                    }
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            }, this);*/
            remoteRestInterface.getWebFormForZTreeNodeList({}).then((response) => {
                let result = response.data;
                if (result.success) {
                    this.tree.treeData = result.data;

                    for (let i = 0; i < this.tree.treeData.length; i++) {
                        if (this.tree.treeData[i].nodeTypeName == "WebForm") {
                            this.tree.treeData[i].icon = "Images/Png16X16/table.png";
                        } else if (this.tree.treeData[i].nodeTypeName == "Module") {
                            this.tree.treeData[i].icon = "Images/Png16X16/folder-table.png";
                        }
                    }

                    this.$refs.formZTreeUL.setAttribute("id", "select-form-single-comp-" + StringUtility.Guid());
                    this.tree.treeObj = $.fn.zTree.init($(this.$refs.formZTreeUL), this.tree.treeSetting, this.tree.treeData);
                    this.tree.treeObj.expandAll(true);
                    this.tree.treeObj._host = this;
                    fuzzySearchTreeObj(this.tree.treeObj, this.$refs.txt_form_search_text.input, null, true);

                    //
                    if (this.oldSelectedFormId != null && this.oldSelectedFormId != "") {

                        let selectedNode = this.tree.treeObj.getNodeByParam("id", this.oldSelectedFormId);
                        this.tree.treeObj.selectNode(selectedNode);

                    }
                } else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            });
        },
        selectedForm: function (event, treeId, formData) {
            this.selectedFormData = formData;
        },
        completed: function () {
            if (this.selectedFormData) {
                let result = {
                    formModuleId: this.selectedFormData.attr4,
                    formModuleName: this.selectedFormData.attr3,
                    formId: this.selectedFormData.id,
                    formName: this.selectedFormData.attr1,
                    formCode: this.selectedFormData.attr2,
                }

                this.$emit('on-selected-form', result);
                this.handleClose();
            } else {
                DialogUtility.AlertText("请选择窗体!");
            }
        }
    }
}
</script>

<style scoped>

</style>