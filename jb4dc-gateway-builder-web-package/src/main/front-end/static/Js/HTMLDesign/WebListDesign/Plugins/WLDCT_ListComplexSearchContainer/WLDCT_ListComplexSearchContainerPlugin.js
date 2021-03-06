/*
**Created by IntelliJ IDEA.
**User: zhuangrb
**Date: 2019/5/5
**To change this template use File | Settings | File Templates.
*/
(function(pluginName){
    CKEditorPluginUtility.Plugins[pluginName]=CKEditorPluginUtility.GetGeneralPluginInstance(pluginName,{});
    CKEditorPluginUtility.Plugins[pluginName].GetHtmlTemplate=function(tipMsg,addDefProp) {
        var tip = CKEditorPluginUtility.GetAutoRemoveTipLabel(tipMsg);
        var template=`<div class="wysiwyg-wldct-list-complex-search-outer-wrap wldct-list-complex-search-outer-wrap">${tip}<div class="wysiwyg-wldct-list-complex-search-inner-wrap wldct-list-complex-search-inner-wrap">
                               <table>
                                   <colgroup>
                                       <col style="width: 8%" />
                                       <col style="width: 17%" />
                                       <col style="width: 8%" />
                                       <col style="width: 17%" />
                                       <col style="width: 8%" />
                                       <col style="width: 17%" />
                                       <col style="width: 8%" />
                                       <col style="width: 17%" />
                                   </colgroup>
                                   <tr>
                                       <td class="label">名称:</td>
                                       <td></td>
                                       <td class="label">标题:</td>
                                       <td></td>
                                       <td class="label">时间(从):</td>
                                       <td></td>
                                       <td class="label">(到):</td>
                                       <td></td>
                                   </tr>
                                   <tr>
                                       <td class="label">名称:</td>
                                       <td></td>
                                       <td class="label">标题:</td>
                                       <td></td>
                                       <td class="label">时间(从):</td>
                                       <td></td>
                                       <td class="label">(到):</td>
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
            template.attr("id","list_c_search_wrap_788954467");
            template.attr("is_jbuild4dc_data","false");
            template.attr("jbuild4dc_custom","true");
            template.attr("name","list_c_search_wrap_788954467");
            template.attr("placeholder","");
            template.attr("serialize","false");
            template.attr("show_remove_button","false");
            template.attr("singlename","WLDCT_ListComplexSearchContainer");
            template.attr("style","");*/
            CKEditorPluginUtility.TemplateAddDefProp(template,"list_c_search_wrap_"+StringUtility.Timestamp(),"false","WLDCT_ListComplexSearchContainer","disable");
            return template.outerHTML();
        }
        return template;
    }
    if(CKEditorPluginUtility.Plugins[pluginName].Setting) {
        CKEDITOR.plugins.add(CKEditorPluginUtility.Plugins[pluginName].Setting.SingleName, {
            init: function (editor) {
                //点击确认时候指定的操作
                function addToEditor(ckEditor, pluginSetting, props, contentWindow) {
                    //var controlDescText=CKEditorPluginUtility.GetControlDescText(pluginSetting,props);
                    var tip = "弹出查询区域[双击编辑该部件],在下边div中编辑查询内容";
                    CKEditorPluginUtility.BuildGeneralElemToCKWysiwyg(CKEditorPluginUtility.Plugins[pluginName].GetHtmlTemplate(tip, false), pluginSetting, props, contentWindow);
                }

                //注册常规插件的操作
                CKEditorPluginUtility.RegGeneralPluginToEditor(editor, this.path, CKEditorPluginUtility.Plugins[pluginName].Setting, addToEditor);
            }
        });
    }
})("WLDCT_ListComplexSearchContainer");