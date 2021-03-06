(function(pluginName){
    CKEditorPluginUtility.Plugins[pluginName]=CKEditorPluginUtility.GetGeneralPluginInstance(pluginName,{});
    CKEditorPluginUtility.Plugins[pluginName].GetHtmlTemplate=function(tipMsg,addDefProp) {
        var tip = CKEditorPluginUtility.GetAutoRemoveTipLabel(tipMsg);
        var template=`<div class="wysiwyg-wldct-list-button-outer-wrap wldct-list-button-outer-wrap">${tip}<div class="wysiwyg-wldct-list-button-inner-wrap wldct-list-button-inner-wrap">
                            <table is-op-button-wrap-table="true">
                                <colgroup>
                                    <col style="width: 10%" />
                                    <col style="width: 10%" />
                                    <col style="width: 10%" />
                                    <col style="width: 10%" />
                                    <col style="width: 10%" />
                                    <col style="width: 10%" />
                                    <col style="width: 10%" />
                                    <col style="width: 10%" />
                                </colgroup>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </table>
                        </div>
                    </div>`;
        //console.log(template);
        if(addDefProp){
            template=$(template);
            /*template.attr("classname","");
            template.attr("control_category","ContainerControl");
            template.attr("custdisabled","nodisabled");
            template.attr("custreadonly","noreadonly");
            template.attr("desc","");
            template.attr("id","list_button_wrap_788954467");
            template.attr("is_jbuild4dc_data","false");
            template.attr("jbuild4dc_custom","true");
            template.attr("name","list_button_wrap_788954467");
            template.attr("placeholder","");
            template.attr("serialize","false");
            template.attr("show_remove_button","false");
            template.attr("singlename","WLDCT_ListButtonContainer");
            template.attr("style","");*/
            CKEditorPluginUtility.TemplateAddDefProp(template,"list_button_wrap_"+StringUtility.Timestamp(),"false","WLDCT_ListButtonContainer","enable");
            return template.outerHTML();
        }
        return template;
    }
    if(CKEditorPluginUtility.Plugins[pluginName].Setting) {
        CKEDITOR.plugins.add(CKEditorPluginUtility.Plugins[pluginName].Setting.SingleName, {
            init: function (editor) {
                //?????????????????????????????????
                function addToEditor(ckEditor, pluginSetting, props, contentWindow) {
                    //var controlDescText=CKEditorPluginUtility.GetControlDescText(pluginSetting,props);
                    var tip ="??????????????????[?????????????????????],?????????div?????????????????????";
                    CKEditorPluginUtility.BuildGeneralElemToCKWysiwyg(CKEditorPluginUtility.Plugins[pluginName].GetHtmlTemplate(tip, false), pluginSetting, props, contentWindow);
                }

                //???????????????????????????
                CKEditorPluginUtility.RegGeneralPluginToEditor(editor, this.path, CKEditorPluginUtility.Plugins[pluginName].Setting, addToEditor);
            }
        });
    }
})("WLDCT_ListButtonContainer");
