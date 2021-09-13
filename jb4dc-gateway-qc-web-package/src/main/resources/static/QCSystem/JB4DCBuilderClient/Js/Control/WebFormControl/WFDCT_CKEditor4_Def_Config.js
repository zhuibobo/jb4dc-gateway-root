/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
    // Define changes to default configuration here.
    // For complete reference see:
    // https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html
    //debugger;
    // The toolbar groups arrangement, optimized for two toolbar rows.
    config.toolbarGroups = [
        { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
        { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
        { name: 'links' },
        { name: 'insert' },
        { name: 'forms' },
        { name: 'tools' },
        { name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
        { name: 'others' },
        '/',
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
        { name: 'styles' },
        { name: 'colors' },
        { name: 'about' }
    ];
    //console.log(config);
    // Remove some buttons provided by the standard plugins, which are
    // not needed in the Standard(s) toolbar.112
    config.removeButtons = 'Underline,Subscript,Superscript';

    // Set the most common block elements.11
    config.format_tags = 'p;h1;h2;h3;pre';

    // Simplify the dialog windows.
    config.removeDialogTabs = 'image:advanced;link:advanced';
    //alert(+"editorConfig");
    var objId="";
    if(typeof(formRuntimeInst)!="undefined"&&formRuntimeInst&&formRuntimeInst.GetWebFormRTParas()&&formRuntimeInst.GetWebFormRTParas().RecordId) {
        objId = formRuntimeInst.GetWebFormRTParas().RecordId;
    }
    if(typeof(flowRuntimePageObject)!="undefined"&&flowRuntimePageObject&&flowRuntimePageObject.GetWebFormRTParas()&&flowRuntimePageObject.GetWebFormRTParas().RecordId) {
        objId = flowRuntimePageObject.GetWebFormRTParas().RecordId;
    }
    config.filebrowserImageUploadUrl = BaseUtility.GetRootPath()+"/Rest/Builder/RunTime/FileRuntime/UploadCKE4Image?uploadType=CkE4Image&objId="+objId;
};
