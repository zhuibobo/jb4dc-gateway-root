<template>
    <div class="uid-wysiwyg-comp-root">
        <div id="wysiwyg-container-parent">
            <div class="wysiwyg-container uid-theme-wrap-default" :id="wysiwygContainerId" @dragover="dragover($event)"
                 @drop="drop($event)" @click="wysiwygContainerClick">

            </div>
        </div>
        <div @mouseover="mouseoverWysiwygPluginListParent">
            <div id="uid-wysiwyg-plugin-list-comp-wrap" style="font-size: 0.8125em">
                <h3>布局控件</h3>
                <div class="plugin-list-wrap">
                    <uid-wysiwyg-plugin-list-comp :control-plugins-config="controlPluginsConfig"
                                                  group-name="Layout"></uid-wysiwyg-plugin-list-comp>
                </div>
                <h3>输入&显示控件</h3>
                <div class="plugin-list-wrap">
                    <uid-wysiwyg-plugin-list-comp :control-plugins-config="controlPluginsConfig"
                                                  group-name="InputControl"></uid-wysiwyg-plugin-list-comp>
                </div>
                <h3>动态控件</h3>
                <div class="plugin-list-wrap">
                    <uid-wysiwyg-plugin-list-comp :control-plugins-config="controlPluginsConfig"
                                                  group-name="DynamicContainer"></uid-wysiwyg-plugin-list-comp>
                </div>
                <h3>模板控件</h3>
                <div class="plugin-list-wrap">
                    <uid-wysiwyg-plugin-list-comp :control-plugins-config="controlPluginsConfig"
                                                  group-name="TemplateContainer"></uid-wysiwyg-plugin-list-comp>
                </div>
            </div>
        </div>
        <div class="plugin-prop-edit-dialog" id="plugin-prop-edit-dialog">
            <component v-bind:is="pluginPropEditVueName" ref="pluginPropEditComponent"></component>
        </div>
    </div>
</template>

<script>

import controlPluginsUtility from '../../Utility/ControlPluginsUtility';
import wysiwygDragDropUtility from '../../Utility/WysiwygDragDropUtility';
import GeneralPlugin from "../../Plugins/GeneralPlugin";
import allPlugins from '../../Plugins/IndexPlugin'

import WLDCT_ListSimpleSearchContainerPlugin
    from "../../Plugins/WebListDesign/WLDCT_ListSimpleSearchContainer/WLDCT_ListSimpleSearchContainerPlugin";

export default {
    name: "uid-wysiwyg-comp",
    props: ["uiDesignType"],
    data() {
        return {
            controlPluginsConfig: [],
            wysiwygContainerId: wysiwygDragDropUtility.wysiwygContainerId,
            pluginPropEditVueEmptyName: "uid-empty-comp",
            pluginPropEditVueName: "uid-empty-comp",
            //pluginPropEditVueName:"WLDCT_FormButtonProperty",
            pluginPropEditDialog: null,
            pluginPropEditComponentRenderer: true
        }
    },
    mounted() {
        window.setTimeout(() => {
            this.init();
            this.initPluginPropEditDialog();
            GeneralPlugin.setWysiwygComponent(this);
        }, 400);

        //let tempProp={"baseInfo": {"id": "AFDCT_TextBox_347247519", "serialize": "true", "name": "", "className": "", "placeholder": "", "custReadonly": "noreadonly", "custDisabled": "nodisabled", "style": "", "desc": "", "status": "enable", "groupName": ""}, "bindToField": {"relationId": "", "tableId": "", "tableName": "", "tableCaption": "", "fieldName": "", "fieldCaption": "", "fieldDataType": "", "fieldLength": ""}, "defaultValue": {"defaultType": "", "defaultValue": "", "defaultText": ""}, "bindToSearchField": {"columnTitle": "", "columnTableName": "", "columnName": "", "columnCaption": "", "columnDataTypeName": "", "columnOperator": "匹配"}, "normalDataSource": {"defaultIsNull": "true", "sqlDataSource": "", "dictionaryGroupDataSourceId": "", "dictionaryGroupDataSourceText": "", "restDataSource": "", "interfaceDataSource": "", "staticDataSource": "", "defaultSelected": "", "layoutDirection": "vertical", "rowNum": "0", "displayValueInText": "false"}, "multilevelProps": {"level2BindControlId": ""}}
        //this.showPluginPropEditDialog("WLDCT_ListTableInnerButtonSingleProperty","WLDCT_ListTableInnerButtonSingleProperty",$("<div />"),tempProp);
    },
    methods: {
        init() {
            $("#uid-wysiwyg-plugin-list-comp-wrap").accordion({
                heightStyle: "fill"
            });
            this.controlPluginsConfig = controlPluginsUtility.getControlPluginsConfigByDesignType(this.uiDesignType);
            for (let pluginKey in allPlugins) {
                let configSingleName = pluginKey.replace("Plugin", "");
                let configSingle = controlPluginsUtility.findBySingleName(configSingleName);
                allPlugins[pluginKey].config = configSingle;
            }
        },
        wysiwygContainerClick() {
            GeneralPlugin.clearControlEditInnerPanel();
        },
        dragover(event) {
            event.preventDefault();
            //wysiwygDragDropUtility.dragControlToWysiwygContainerOver(event);
        },
        drop(event) {
            event.preventDefault();
            wysiwygDragDropUtility.dropControlToWysiwygContainer(event);

            /*debugger;
            let listSimpleSearchContainerPlugin=WLDCT_ListSimpleSearchContainerPlugin.buildInstanceObj("i11").instance;
            listSimpleSearchContainerPlugin.setElem("222");
            console.log(listSimpleSearchContainerPlugin);*/
            //let dragSingleName = wysiwygDragDropUtility.getDropSingleName(event);
            //console.log(dragSingleName);
        },
        mouseoverWysiwygPluginListParent(event) {
            //console.log(event);
            GeneralPlugin.clearHelperPanel();
        },
        initPluginPropEditDialog() {
            let _this = this;
            let defaultConfig = {
                height: 750,
                width: 900,
                title: "属性编辑",
                autoOpen: false,
                modal: true,
                beforeClose: function (event, ui) {
                    _this.pluginPropEditVueName = _this.pluginPropEditVueEmptyName;
                },
                buttons: {
                    "确认": function () {
                        //_this.$refs.pluginPropEditComponent.setControlProps(null,"啥啥啥所");
                        let props = _this.$refs.pluginPropEditComponent.getControlProps();

                        if (props.success == false) {
                            return false;
                        }
                        _this._tempCurrentEditControlInstance.resetWysiwygElemProps(_this._tempCurrentEditControl$elem, props);
                        //okFunc(ckEditor, pluginSetting, props, pluginSetting.IFrameWindow.contentWindow);
                        //pluginSetting.IFrameExecuteActionName = CKEditorPluginUtility.DialogExecuteInsertActionName;

                        $("#plugin-prop-edit-dialog").dialog("close");
                    },
                    "取消": function () {
                        $("#plugin-prop-edit-dialog").dialog("close");

                    }
                }
            };
            this.pluginPropEditDialog = $("#plugin-prop-edit-dialog").dialog(defaultConfig);
        },
        showPluginPropEditDialog(controlInstance, pluginPropEditVueName, $elem, props) {
            this._tempCurrentEditControlInstance = controlInstance;
            this._tempCurrentEditControl$elem = $elem;
            console.log("打开属性对话框:" + pluginPropEditVueName);
            this.pluginPropEditVueName = pluginPropEditVueName;
            //console.log(props);
            this.pluginPropEditDialog.dialog("open");
            window.setTimeout(() => {
                this.$refs.pluginPropEditComponent.setControlProps($elem, props);
            }, 200);
        },
        getValue() {
            return $("#" + this.wysiwygContainerId).html();
        },
        setValue(value) {
            $("#" + this.wysiwygContainerId).html(value);
            this.reInstanceWysiwygChain($("#" + this.wysiwygContainerId));
        },
        reInstanceWysiwygChain($elem) {
            //let $singleControlElem=$elem;
            //debugger;
            for (let i = 0; i < $elem.children().length; i++) {
                try {
                    let $childSingleElem = $($elem.children()[i]);

                    //let _cloneRendererChainParas = {};
                    //JsonUtility.SimpleCloneAttr(_cloneRendererChainParas, _rendererChainParas);
                    //_cloneRendererChainParas.$singleControlElem = $childSingleElem;
                    if ($childSingleElem.attr("jbuild4dc_custom") == "true") {
                        let pluginObj = GeneralPlugin.getControlInstanceObj($childSingleElem.attr("singlename")).instance;
                        let controlInstance = pluginObj.buildInstanceObj($childSingleElem.attr("designControlInstanceName")).instance;
                        controlInstance.setElem($childSingleElem);
                        controlInstance.registeredEvent($childSingleElem);
                        this.reInstanceWysiwygChain($childSingleElem);
                    } else {
                        this.reInstanceWysiwygChain($childSingleElem);
                    }
                } catch (e) {
                    throw "reInstanceWysiwygChain error:" + i + e;
                }
            }
        }
    }
}
</script>

<style scoped lang="less">
@import "../../../Less/Variable.less";

.uid-wysiwyg-comp-root {
    display: flex;
    /*background-color: #0B61A4;*/
    height: 100%;
    overflow: hidden;

    > div:first-child {
        flex-grow: 2;
        overflow: auto;
        padding: 2px 4px 2px 2px;

        .wysiwyg-container {
            border-radius: 4px;
            border: 1px solid @g-pomegranate-color-v06;
            height: 100%;
            box-sizing: border-box;
            overflow: auto;
        }
    }

    > div:last-child {
        flex-basis: 200px;
        background-color: #EAEDED;
        margin-right: 2px;
        height: calc(100% - 4px);
    }
}

.plugin-list-wrap {
    padding: 0px 4px 0 4px;
}

#uid-wysiwyg-plugin-list-comp-wrap {
    user-select: none;
}

.plugin-prop-edit-dialog {
    .ant-tabs-nav {
        margin-bottom: 8px !important;
    }
}

</style>