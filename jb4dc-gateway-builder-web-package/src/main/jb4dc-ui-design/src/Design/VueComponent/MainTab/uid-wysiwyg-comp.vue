<template>
    <div class="uid-wysiwyg-comp-root">
        <div id="wysiwyg-container-parent">
            <div class="wysiwyg-container uid-wysiwyg-default-theme-root" :id="wysiwygContainerId" @dragover="dragover($event)"
                 @drop="drop($event)" @click="wysiwygContainerClick">

            </div>
        </div>
        <div @mouseover="mouseoverWysiwygPluginListParent">
            <div id="uid-wysiwyg-plugin-list-comp-wrap" style="font-size: 0.8125em">
                <template v-for="group in controlGroupsConfig">
                    <h3>{{ group.text }}</h3>
                    <div class="plugin-list-wrap">
                        <uid-wysiwyg-plugin-list-comp :control-plugins-config="controlPluginsConfig"
                                                      :group-name="group.name"></uid-wysiwyg-plugin-list-comp>
                    </div>
                </template>
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

export default {
    name: "uid-wysiwyg-comp",
    props: ["uiDesignType"],
    data() {
        return {
            controlGroupsConfig: [],
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
          controlPluginsUtility.initData({}).then(() => {
            this.controlGroupsConfig = controlPluginsUtility.getControlGroupsConfigByDesignType(this.uiDesignType);
            this.controlPluginsConfig = controlPluginsUtility.getControlPluginsConfigByDesignType(this.uiDesignType);

            for (let pluginKey in allPlugins) {
              let configSingleName = pluginKey.replace("Plugin", "");
              let configSingle = controlPluginsUtility.findBySingleName(configSingleName);
              allPlugins[pluginKey].config = configSingle;
            }
            window.setTimeout(() => {
              $("#uid-wysiwyg-plugin-list-comp-wrap").accordion({
                heightStyle: "fill"
              });
            }, 400);
          });
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
                        //debugger;
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
            this.pluginPropEditDialog.dialog("option","title","属性编辑--["+controlInstance.config.text+"]");
            let setControlPropsIntervalTime=0;
            let setControlPropsInterval=window.setInterval(() => {
                if(typeof (this.$refs.pluginPropEditComponent.setControlProps)=="function") {
                    this.$refs.pluginPropEditComponent.setControlProps($elem, props);
                    window.clearInterval(setControlPropsInterval);
                    setControlPropsIntervalTime=0;
                    console.log("设置控件属性到对话框完成,setControlPropsIntervalTime:"+setControlPropsIntervalTime);
                }
                else{
                    setControlPropsIntervalTime++;
                }
                if(setControlPropsIntervalTime>20){
                    window.clearInterval(setControlPropsInterval);
                }
            }, 100);
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
            for (let i = 0; i < $elem.children().length; i++) {
                try {
                    let $childSingleElem = $($elem.children()[i]);
                    //console.log($childSingleElem);
                    //console.log($elem.html());
                    if ($childSingleElem.prop("tagName") != "STYLE") {
                        //debugger;
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
                    }
                } catch (e) {
                    throw e;
                }
            }
            GeneralPlugin.regTooltipEvent();
        }
    }
}
</script>