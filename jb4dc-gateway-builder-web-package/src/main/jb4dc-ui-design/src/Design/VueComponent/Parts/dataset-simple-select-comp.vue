<template>
    <div>
        <a-input search class="input_border_bottom" ref="txt_search_text" placeholder="请输入表名或者标题"></a-input>
        <ul ref="zTreeUL" class="ztree"></ul>
    </div>
</template>

<script>
import remoteRestInterface from "../../Remote/RemoteRestInterface.js"

export default {
    name: "dataset-simple-select-comp",
    data: function () {
        var _self = this;
        return {
            acInterface: {
                getDataSetData: "/Rest/Builder/DataSet/DataSetMain/GetDataSetsForZTreeNodeList"
            },
            dataSetTree: {
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
                        chkStyle: "radio",
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
                            if (treeNode.nodeTypeName == "DataSet") {
                                _self.selectedNode(treeNode);
                            }
                        }
                    }
                },
                treeData: null,
                selectedTableName: "无"
            }
        }
    },
    mounted: function () {
        this.bindDataSetTree();
    },
    methods: {
        bindDataSetTree: function () {
            remoteRestInterface.getDataSetsForZTreeNodeList({}).then((response) => {
                let result = response.data;
                //console.log(result);
                if (result.success) {
                    if (result.data != null && result.data.length > 0) {
                        for (let i = 0; i < result.data.length; i++) {
                            if (result.data[i].nodeTypeName == "DataSetGroup") {
                                result.data[i].icon = "Images/Png16X16/package.png";
                            } else {
                                result.data[i].icon = "Images/Png16X16/application_view_columns.png";
                            }
                        }
                    }

                    this.dataSetTree.treeData = result.data;
                    this.dataSetTree.treeObj = $.fn.zTree.init($(this.$refs.zTreeUL), this.dataSetTree.treeSetting, this.dataSetTree.treeData);
                    this.dataSetTree.treeObj.expandAll(true);
                    fuzzySearchTreeObj(this.dataSetTree.treeObj, this.$refs.txt_search_text.input, null, true);
                } else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            })
        },
        selectedNode: function (treeNode) {
            this.$emit('on-selected-dataset', treeNode);
        }
    }
}
</script>

<style scoped>

</style>