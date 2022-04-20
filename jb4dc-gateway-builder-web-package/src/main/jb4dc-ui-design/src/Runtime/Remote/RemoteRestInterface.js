import axios from "axios";
import MockAdapter from "axios-mock-adapter";

let acInterface = {
    loadHTML: "/QCSystem/Rest/Builder/RunTime/ListRuntime/LoadHTML",
    getDataSetData: "/QCSystem/Rest/Builder/RunTime/DataSetRuntime/GetDataSetData"
}

let storeDataSet = {};

let RemoteRestInterface = {
    loadHTML(sendData) {
        return axios.post(acInterface.loadHTML, sendData).catch(function (error) {
            console.log(error);
        });
    },
    getDataSetData(sendData) {
        return axios.post(acInterface.getDataSetData, sendData).catch(function (error) {
            console.log(error);
        });
    }
}

function sendDataToURLSearchParams(sendData) {
    const params = new URLSearchParams();
    for (let paramsKey in sendData) {
        params.append(paramsKey, sendData[paramsKey]);
    }
    return params;
}

let mockAjax = true;
let mock = new MockAdapter(axios, {delayResponse: 200});
if (mockAjax) {
    let listHtmlRuntimeForm = ``

    let loadHTMLData = {
        "success": true, "message": "操作成功！", "cacheKey": "", "traceMsg": "", "errorCode": null, "data": {
            "listId": "8318f6ec-3c94-4e6f-b561-76c881f35899",
            "listCode": "100003",
            "listName": "测试新设计器2",
            "listSingleName": "",
            "listCreateTime": "2022-03-18 22:14:59",
            "listCreator": "Alex",
            "listUpdateTime": "2022-03-18 22:14:59",
            "listUpdater": "Alex",
            "listType": "WebList",
            "listIsSystem": "否",
            "listOrderNum": 3,
            "listDesc": "",
            "listModuleId": "b6641464-e55f-4d1c-afea-400769f6f6a3",
            "listStatus": "启用",
            "listOrganId": "10001",
            "listOrganName": "系统管理组",
            "listDatasetId": "fea455cc-41e0-0975-497d-57d2b7711cc9",
            "listDatasetName": "全部问题【DS_10001】",
            "listDatasetPageSize": 20,
            "listIsResolve": "是",
            "listEveryTimeResolve": "否",
            "listEnableSSear": "启用",
            "listEnableCSear": "禁用",
            "listTheme": "uid-theme-wrap-default",
            "listCustServerRenderer": "",
            "listCustRefJs": "",
            "listCustClientRenderer": "",
            "listCustDesc": "",
            "listDatasetPrimaryKey": "ID",
            "listHtmlSource": "<div class=\"uid-wldct-list-template-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTemplate\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"LayoutGroup\" designcontrolinstancename=\"WLDCT_ListTemplate_460792703\" id=\"WLDCT_ListTemplate_460792703\"><div class=\"uid-wldct-list-simple-search-container-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListSimpleSearchContainer\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"LayoutGroup\" designcontrolinstancename=\"WLDCT_ListSimpleSearchContainer_460792703\" id=\"WLDCT_ListSimpleSearchContainer_460792703\">\n                    <div class=\"uid-container-inner-wrap\">\n                            <table contenteditable=\"true\">\n                                <colgroup>\n                                   <col style=\"width: 8%\">\n                                   <col style=\"width: 17%\">\n                                   <col style=\"width: 8%\">\n                                   <col style=\"width: 17%\">\n                                   <col style=\"width: 8%\">\n                                   <col style=\"width: 17%\">\n                                   <col style=\"width: 8%\">\n                                   <col style=\"width: 17%\">\n                               </colgroup>\n                               <tbody><tr>\n                                   <td class=\"label\">序号:</td>\n                                   <td><div jbuild4dc_custom=\"true\" singlename=\"WLDCT_Search_TextBox\" designcontrolinstancename=\"WLDCT_Search_TextBox_460817582\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_Search_TextBox_460817582\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" classname=\"\" placeholder=\"\" custreadonly=\"noreadonly\" custdisabled=\"nodisabled\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columntitle=\"\" columntablename=\"TQC_ISSUES\" columnname=\"ISS_NUM\" columncaption=\"序号\" columndatatypename=\"字符串\" columnoperator=\"匹配\"><div runtime_auto_remove=\"true\" class=\"wysiwyg-auto-remove-tip\"><div name=\"elem-display-name\" class=\"elem-display-name\" style=\"background-image: url('Images/Plugin/textfield.png')\">[序号]</div><div class=\"wysiwyg-control-tip las la-control-tip\" tip-with-instance=\"WLDCT_Search_TextBox_460817582\"></div></div></div></td>\n                                   <td class=\"label\">标题:</td>\n                                   <td><div jbuild4dc_custom=\"true\" singlename=\"WLDCT_Search_TextBox\" designcontrolinstancename=\"WLDCT_Search_TextBox_460820651\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_Search_TextBox_460820651\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" classname=\"\" placeholder=\"\" custreadonly=\"noreadonly\" custdisabled=\"nodisabled\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columntitle=\"\" columntablename=\"TQC_ISSUES\" columnname=\"ISS_TITLE\" columncaption=\"标题\" columndatatypename=\"字符串\" columnoperator=\"匹配\"><div runtime_auto_remove=\"true\" class=\"wysiwyg-auto-remove-tip\"><div name=\"elem-display-name\" class=\"elem-display-name\" style=\"background-image: url('Images/Plugin/textfield.png')\">[标题]</div><div class=\"wysiwyg-control-tip las la-control-tip\" tip-with-instance=\"WLDCT_Search_TextBox_460820651\"></div></div></div></td>\n                                   <td class=\"label\">时间(从):</td>\n                                   <td><div jbuild4dc_custom=\"true\" singlename=\"WLDCT_Search_TextDateTime\" designcontrolinstancename=\"WLDCT_Search_TextDateTime_460823559\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_Search_TextDateTime_460823559\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" classname=\"\" placeholder=\"\" custreadonly=\"noreadonly\" custdisabled=\"nodisabled\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columntitle=\"\" columntablename=\"TQC_ISSUES\" columnname=\"ISS_ACCEPT_DATE\" columncaption=\"受理时间\" columndatatypename=\"日期时间\" columnoperator=\"gt_eq\"><div runtime_auto_remove=\"true\" class=\"wysiwyg-auto-remove-tip\"><div name=\"elem-display-name\" class=\"elem-display-name\" style=\"background-image: url('Images/Plugin/datetimefield.png')\">[受理时间]</div><div class=\"wysiwyg-control-tip las la-control-tip\" tip-with-instance=\"WLDCT_Search_TextDateTime_460823559\"></div></div></div></td>\n                                   <td class=\"label\">(到):</td>\n                                   <td><div jbuild4dc_custom=\"true\" singlename=\"WLDCT_Search_TextDateTime\" designcontrolinstancename=\"WLDCT_Search_TextDateTime_460825318\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_Search_TextDateTime_460825318\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" classname=\"\" placeholder=\"\" custreadonly=\"noreadonly\" custdisabled=\"nodisabled\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columntitle=\"\" columntablename=\"TQC_ISSUES\" columnname=\"ISS_ACCEPT_DATE\" columncaption=\"受理时间\" columndatatypename=\"日期时间\" columnoperator=\"lt_eq\"><div runtime_auto_remove=\"true\" class=\"wysiwyg-auto-remove-tip\"><div name=\"elem-display-name\" class=\"elem-display-name\" style=\"background-image: url('Images/Plugin/datetimefield.png')\">[受理时间]</div><div class=\"wysiwyg-control-tip las la-control-tip\" tip-with-instance=\"WLDCT_Search_TextDateTime_460825318\"></div></div></div></td>\n                               </tr>\n                            </tbody></table></div></div><div class=\"uid-wldct-list-complex-search-container-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListComplexSearchContainer\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"LayoutGroup\" designcontrolinstancename=\"WLDCT_ListComplexSearchContainer_460792703\" id=\"WLDCT_ListComplexSearchContainer_460792703\" serialize=\"true\" name=\"\" classname=\"\" placeholder=\"\" custreadonly=\"noreadonly\" custdisabled=\"nodisabled\" style=\"\" desc=\"\" status=\"disable\" groupname=\"\">\n                    <div class=\"uid-container-inner-wrap\">\n                        <table contenteditable=\"true\">\n                                <colgroup>\n                                       <col style=\"width: 8%\">\n                                       <col style=\"width: 17%\">\n                                       <col style=\"width: 8%\">\n                                       <col style=\"width: 17%\">\n                                       <col style=\"width: 8%\">\n                                       <col style=\"width: 17%\">\n                                       <col style=\"width: 8%\">\n                                       <col style=\"width: 17%\">\n                                   </colgroup>\n                                   <tbody><tr>\n                                       <td class=\"label\">名称:</td>\n                                       <td></td>\n                                       <td class=\"label\">标题:</td>\n                                       <td></td>\n                                       <td class=\"label\">时间(从):</td>\n                                       <td></td>\n                                       <td class=\"label\">(到):</td>\n                                       <td></td>\n                                   </tr>\n                                   <tr>\n                                       <td class=\"label\">名称:</td>\n                                       <td></td>\n                                       <td class=\"label\">标题:</td>\n                                       <td></td>\n                                       <td class=\"label\">时间(从):</td>\n                                       <td></td>\n                                       <td class=\"label\">(到):</td>\n                                       <td></td>\n                                   </tr>\n                                   <tr>\n                                       <td class=\"label\">名称:</td>\n                                       <td></td>\n                                       <td class=\"label\">标题:</td>\n                                       <td></td>\n                                       <td class=\"label\">时间(从):</td>\n                                       <td></td>\n                                       <td class=\"label\">(到):</td>\n                                       <td></td>\n                                   </tr>\n                                   <tr>\n                                       <td class=\"label\">名称:</td>\n                                       <td></td>\n                                       <td class=\"label\">标题:</td>\n                                       <td></td>\n                                       <td class=\"label\">时间(从):</td>\n                                       <td></td>\n                                       <td class=\"label\">(到):</td>\n                                       <td></td>\n                                   </tr>\n                            </tbody></table>\n                    </div>\n                 </div><div class=\"uid-wldct-list-button-container-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListButtonContainer\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"LayoutGroup\" designcontrolinstancename=\"WLDCT_ListButtonContainer_460792704\" id=\"WLDCT_ListButtonContainer_460792704\">\n                        <div class=\"uid-container-inner-wrap\">\n                             <table is-op-button-wrap-table=\"true\">\n                                <colgroup>\n                                    <col style=\"width: 10%\">\n                                    <col style=\"width: 10%\">\n                                    <col style=\"width: 10%\">\n                                    <col style=\"width: 10%\">\n                                    <col style=\"width: 10%\">\n                                    <col style=\"width: 10%\">\n                                    <col style=\"width: 10%\">\n                                    <col style=\"width: 10%\">\n                                </colgroup>\n                                <tbody><tr>\n                                    <td></td>\n                                    <td></td>\n                                    <td></td>\n                                    <td></td>\n                                    <td style=\"\"></td>\n                                    <td style=\"\"><div jbuild4dc_custom=\"true\" singlename=\"WLDCT_FormButton\" designcontrolinstancename=\"WLDCT_FormButton_460828906\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_FormButton_460828906\" isopbutton=\"true\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"false\" name=\"\" classname=\"\" placeholder=\"\" custreadonly=\"noreadonly\" custdisabled=\"nodisabled\" desc=\"\" status=\"enable\" groupname=\"\" buttontype=\"ListFormButton\" formmoduleid=\"b6641464-e55f-4d1c-afea-400769f6f6a3\" formmodulename=\"运维问题模块\" formid=\"017d78b0-56f2-41a4-9636-5a0180e689ca\" formname=\"问题登记表单\" formcode=\"100001\" buttoncaption=\"新增\" opentype=\"Dialog\" windowheight=\"900\" windowwidth=\"1324\" isshow=\"true\" operation=\"add\" bindauthority=\"notAuth\" innerbuttonjsonstring=\"[{&quot;caption&quot;:&quot;保存&quot;,&quot;saveAndClose&quot;:&quot;true&quot;,&quot;apis&quot;:[],&quot;fields&quot;:[],&quot;id&quot;:&quot;inner_form_save_button_461280585&quot;,&quot;buttonType&quot;:&quot;保存按钮&quot;,&quot;custServerResolveMethod&quot;:&quot;&quot;,&quot;custServerResolveMethodPara&quot;:&quot;&quot;,&quot;custClientRendererMethod&quot;:&quot;&quot;,&quot;custClientRendererMethodPara&quot;:&quot;&quot;,&quot;custClientRendererAfterMethod&quot;:&quot;&quot;,&quot;custClientRendererAfterMethodPara&quot;:&quot;&quot;,&quot;custClientClickBeforeMethod&quot;:&quot;&quot;,&quot;custClientClickBeforeMethodPara&quot;:&quot;&quot;},{&quot;caption&quot;:&quot;关闭&quot;,&quot;id&quot;:&quot;inner_close_button_461289650&quot;,&quot;buttonType&quot;:&quot;关闭按钮&quot;}]\"><div runtime_auto_remove=\"true\" class=\"wysiwyg-auto-remove-tip\"><div name=\"elem-display-name\" class=\"elem-display-name\" style=\"background-image: url('Images/Plugin/formbutton.png')\">[新增]</div><div class=\"wysiwyg-control-tip las la-control-tip\" tip-with-instance=\"WLDCT_FormButton_460828906\"></div></div></div></td>\n                                    <td style=\"\"><div jbuild4dc_custom=\"true\" singlename=\"WLDCT_FormButton\" designcontrolinstancename=\"WLDCT_FormButton_460830589\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_FormButton_460830589\" isopbutton=\"true\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"false\" name=\"\" classname=\"\" placeholder=\"\" custreadonly=\"noreadonly\" custdisabled=\"nodisabled\" desc=\"\" status=\"enable\" groupname=\"\" buttontype=\"ListFormButton\" formmoduleid=\"b6641464-e55f-4d1c-afea-400769f6f6a3\" formmodulename=\"运维问题模块\" formid=\"017d78b0-56f2-41a4-9636-5a0180e689ca\" formname=\"问题登记表单\" formcode=\"100001\" buttoncaption=\"修改\" opentype=\"Dialog\" windowheight=\"900\" windowwidth=\"1324\" isshow=\"true\" operation=\"update\" bindauthority=\"notAuth\" innerbuttonjsonstring=\"[{&quot;caption&quot;:&quot;保存&quot;,&quot;saveAndClose&quot;:&quot;true&quot;,&quot;apis&quot;:[],&quot;fields&quot;:[],&quot;id&quot;:&quot;inner_form_save_button_461303767&quot;,&quot;buttonType&quot;:&quot;保存按钮&quot;,&quot;custServerResolveMethod&quot;:&quot;&quot;,&quot;custServerResolveMethodPara&quot;:&quot;&quot;,&quot;custClientRendererMethod&quot;:&quot;&quot;,&quot;custClientRendererMethodPara&quot;:&quot;&quot;,&quot;custClientRendererAfterMethod&quot;:&quot;&quot;,&quot;custClientRendererAfterMethodPara&quot;:&quot;&quot;,&quot;custClientClickBeforeMethod&quot;:&quot;&quot;,&quot;custClientClickBeforeMethodPara&quot;:&quot;&quot;},{&quot;caption&quot;:&quot;关闭&quot;,&quot;id&quot;:&quot;inner_close_button_461308532&quot;,&quot;buttonType&quot;:&quot;关闭按钮&quot;}]\"><div runtime_auto_remove=\"true\" class=\"wysiwyg-auto-remove-tip\"><div name=\"elem-display-name\" class=\"elem-display-name\" style=\"background-image: url('Images/Plugin/formbutton.png')\">[修改]</div><div class=\"wysiwyg-control-tip las la-control-tip\" tip-with-instance=\"WLDCT_FormButton_460830589\"></div></div></div></td>\n                                    <td style=\"\"><div jbuild4dc_custom=\"true\" singlename=\"WLDCT_FormButton\" designcontrolinstancename=\"WLDCT_FormButton_460842713\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_FormButton_460842713\" isopbutton=\"true\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"false\" name=\"\" classname=\"\" placeholder=\"\" custreadonly=\"noreadonly\" custdisabled=\"nodisabled\" desc=\"\" status=\"enable\" groupname=\"\" buttontype=\"ListFormButton\" buttoncaption=\"删除\" opentype=\"Dialog\" windowheight=\"NaN\" windowwidth=\"NaN\" isshow=\"true\" bindauthority=\"notAuth\" innerbuttonjsonstring=\"[]\"><div runtime_auto_remove=\"true\" class=\"wysiwyg-auto-remove-tip\"><div name=\"elem-display-name\" class=\"elem-display-name\" style=\"background-image: url('Images/Plugin/formbutton.png')\">[删除]</div><div class=\"wysiwyg-control-tip las la-control-tip\" tip-with-instance=\"WLDCT_FormButton_460842713\"></div></div></div></td>\n                                </tr>\n                            </tbody></table>\n                        </div>\n                    </div><div class=\"uid-wldct-list-table-container-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableContainer\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"LayoutGroup\" designcontrolinstancename=\"WLDCT_ListTableContainer_460792704\" id=\"WLDCT_ListTableContainer_460792704\">\n                    <div class=\"uid-container-inner-wrap\">\n                        <table class=\"list-table\" contenteditable=\"true\">\n                                 <colgroup>\n                                    <col style=\"width: 8%\">\n                                    <col style=\"width: 68%\">\n                                    <col style=\"width: 8%\">\n                                    <col style=\"width: 8%\">\n                                    <col style=\"width: 8%\">\n                                 </colgroup>\n                                 <thead>\n                                     <tr>\n                                         <th>编号</th>\n                                         <th>标题</th>\n                                         <th>状态</th>\n                                         <th>处理时间</th>\n                                         <th>操作</th>\n                                     </tr>\n                                 </thead>\n                                 <tbody>\n                                     <tr>\n                                         <td><div jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableLabel\" designcontrolinstancename=\"WLDCT_ListTableLabel_460845022\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_ListTableLabel_460845022\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" classname=\"\" placeholder=\"\" custreadonly=\"noreadonly\" custdisabled=\"nodisabled\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columnname=\"ISS_NUM\" columncaption=\"序号\" columndatatypename=\"字符串\" targetbuttonid=\"\" columnalign=\"居中对齐\" defformat=\"notFormat\" dictionarygroupdatasourcetext=\"\" dictionarygroupdatasourceid=\"\" omitlength=\"\"><div runtime_auto_remove=\"true\" class=\"wysiwyg-auto-remove-tip\"><div name=\"elem-display-name\" class=\"elem-display-name\" style=\"background-image: url('Images/Plugin/textlabel.png')\">序号</div><div class=\"wysiwyg-control-tip las la-control-tip\" tip-with-instance=\"WLDCT_ListTableLabel_460845022\"></div></div></div></td>\n                                         <td><div jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableLabel\" designcontrolinstancename=\"WLDCT_ListTableLabel_460847316\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_ListTableLabel_460847316\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" classname=\"\" placeholder=\"\" custreadonly=\"noreadonly\" custdisabled=\"nodisabled\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columnname=\"ISS_TITLE\" columncaption=\"标题\" columndatatypename=\"字符串\" targetbuttonid=\"\" columnalign=\"居中对齐\" defformat=\"notFormat\" dictionarygroupdatasourcetext=\"\" dictionarygroupdatasourceid=\"\" omitlength=\"\"><div runtime_auto_remove=\"true\" class=\"wysiwyg-auto-remove-tip\"><div name=\"elem-display-name\" class=\"elem-display-name\" style=\"background-image: url('Images/Plugin/textlabel.png')\">标题</div><div class=\"wysiwyg-control-tip las la-control-tip\" tip-with-instance=\"WLDCT_ListTableLabel_460847316\"></div></div></div></td>\n                                         <td><div jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableLabel\" designcontrolinstancename=\"WLDCT_ListTableLabel_460849653\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_ListTableLabel_460849653\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" classname=\"\" placeholder=\"\" custreadonly=\"noreadonly\" custdisabled=\"nodisabled\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columnname=\"ISS_STATUS\" columncaption=\"处理状态\" columndatatypename=\"字符串\" targetbuttonid=\"\" columnalign=\"居中对齐\" defformat=\"notFormat\" dictionarygroupdatasourcetext=\"\" dictionarygroupdatasourceid=\"\" omitlength=\"\"><div runtime_auto_remove=\"true\" class=\"wysiwyg-auto-remove-tip\"><div name=\"elem-display-name\" class=\"elem-display-name\" style=\"background-image: url('Images/Plugin/textlabel.png')\">处理状态</div><div class=\"wysiwyg-control-tip las la-control-tip\" tip-with-instance=\"WLDCT_ListTableLabel_460849653\"></div></div></div></td>\n                                         <td><div jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableLabel\" designcontrolinstancename=\"WLDCT_ListTableLabel_460851158\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_ListTableLabel_460851158\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" classname=\"\" placeholder=\"\" custreadonly=\"noreadonly\" custdisabled=\"nodisabled\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columnname=\"ISS_HANDLER_END_DATE\" columncaption=\"分配给-处理时间\" columndatatypename=\"日期时间\" targetbuttonid=\"\" columnalign=\"居中对齐\" defformat=\"notFormat\" dictionarygroupdatasourcetext=\"\" dictionarygroupdatasourceid=\"\" omitlength=\"\"><div runtime_auto_remove=\"true\" class=\"wysiwyg-auto-remove-tip\"><div name=\"elem-display-name\" class=\"elem-display-name\" style=\"background-image: url('Images/Plugin/textlabel.png')\">分配给-处理时间</div><div class=\"wysiwyg-control-tip las la-control-tip\" tip-with-instance=\"WLDCT_ListTableLabel_460851158\"></div></div></div></td>\n                                         <td class=\"op-button-container-outer-td\">\n                                            \n                                         <div class=\"uid-wldct-list-table-inner-button-container-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableInnerButtonContainer\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"InputGroup\" designcontrolinstancename=\"WLDCT_ListTableInnerButtonContainer_460792704\" id=\"WLDCT_ListTableInnerButtonContainer_460792704\">\n                                                <div class=\"uid-container-inner-wrap\">\n                                                    <table is-inner-op-button-wrap-table=\"true\">\n                                                        <colgroup>\n                                                            <col style=\"width: 33%\">\n                                                            <col style=\"width: 33%\">\n                                                            <col style=\"width: 33%\">\n                                                        </colgroup>\n                                                        <tbody><tr>\n                                                            <td><div jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableInnerButtonSingle\" designcontrolinstancename=\"WLDCT_ListTableInnerButtonSingle_461152375\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_ListTableInnerButtonSingle_461152375\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" classname=\"\" placeholder=\"\" custreadonly=\"noreadonly\" custdisabled=\"nodisabled\" desc=\"\" status=\"enable\" groupname=\"\" targetbuttonid=\"WLDCT_FormButton_460830589\" selectedclass=\"wldct-list-table-row-inner-button edit\" caption=\"修改\" alertmsg=\"\"><div runtime_auto_remove=\"true\" class=\"wysiwyg-auto-remove-tip\"><div name=\"elem-display-name\" class=\"elem-display-name\" style=\"background-image: url('Images/Plugin/tableinnerbutton.png')\">修改</div><div class=\"wysiwyg-control-tip las la-control-tip\" tip-with-instance=\"WLDCT_ListTableInnerButtonSingle_461152375\"></div></div></div></td>\n                                                            <td><div jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableInnerButtonSingle\" designcontrolinstancename=\"WLDCT_ListTableInnerButtonSingle_462484104\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_ListTableInnerButtonSingle_462484104\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" classname=\"\" placeholder=\"\" custreadonly=\"noreadonly\" custdisabled=\"nodisabled\" desc=\"\" status=\"enable\" groupname=\"\" targetbuttonid=\"WLDCT_FormButton_460842713\" selectedclass=\"wldct-list-table-row-inner-button del\" caption=\"删除\" alertmsg=\"\"><div runtime_auto_remove=\"true\" class=\"wysiwyg-auto-remove-tip\"><div name=\"elem-display-name\" class=\"elem-display-name\" style=\"background-image: url('Images/Plugin/tableinnerbutton.png')\">删除</div><div class=\"wysiwyg-control-tip las la-control-tip\" tip-with-instance=\"WLDCT_ListTableInnerButtonSingle_462484104\"></div></div></div></td>\n                                                            <td></td>\n                                                        </tr>\n                                                    </tbody></table>\n                                                </div>\n                                            </div></td>\n                                     </tr>\n                                 </tbody>\n                             </table>\n                    </div>\n                 </div><div class=\"uid-wldct-hide-container-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_HideContainer\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"LayoutGroup\" designcontrolinstancename=\"WLDCT_HideContainer_460792704\" id=\"WLDCT_HideContainer_460792704\">\n                    <div class=\"uid-container-inner-wrap\">\n                        <table contenteditable=\"true\">\n                            <colgroup><col style=\"width: 8%\"><col style=\"width: 15%\"><col style=\"width: 8%\"><col style=\"width: 15%\"><col style=\"width: 8%\"><col style=\"width: 16%\"></colgroup>\n                            <tbody><tr><td style=\"\">隐藏控件</td><td style=\"\"><div jbuild4dc_custom=\"true\" singlename=\"WLDCT_Search_TextBox\" designcontrolinstancename=\"WLDCT_Search_TextBox_461175685\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_Search_TextBox_461175685\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\"><div runtime_auto_remove=\"true\" class=\"wysiwyg-auto-remove-tip\"><div name=\"elem-display-name\" class=\"elem-display-name\" style=\"background-image: url('Images/Plugin/textfield.png')\">查询单行输入框</div><div class=\"wysiwyg-control-tip las la-control-tip\" tip-with-instance=\"WLDCT_Search_TextBox_461175685\"></div></div></div></td><td></td><td></td><td></td><td></td></tr>\n                            <tr><td></td><td style=\"\"></td><td style=\"\"></td><td></td><td></td><td></td></tr>\n                            <tr><td></td><td></td><td></td><td style=\"\"></td><td></td><td></td></tr>\n                            <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>\n                        </tbody></table>\n                    </div>\n                 </div><div id=\"redips_clone\" style=\"height: 1px; width: 1px;\"></div></div>",
            "listHtmlResolve": "<div class=\"uid-wldct-list-template-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTemplate\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"LayoutGroup\" designcontrolinstancename=\"WLDCT_ListTemplate_460792703\" id=\"WLDCT_ListTemplate_460792703\">\n <div class=\"uid-wldct-list-simple-search-container-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListSimpleSearchContainer\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"LayoutGroup\" designcontrolinstancename=\"WLDCT_ListSimpleSearchContainer_460792703\" id=\"WLDCT_ListSimpleSearchContainer_460792703\" client_resolve=\"WLDCT_ListSimpleSearchContainer\"> \n  <div class=\"uid-container-inner-wrap\"> \n   <table contenteditable=\"true\"> \n    <colgroup> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 17%\"> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 17%\"> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 17%\"> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 17%\"> \n    </colgroup> \n    <tbody>\n     <tr> \n      <td class=\"label\">序号:</td> \n      <td>\n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_Search_TextBox\" designcontrolinstancename=\"WLDCT_Search_TextBox_460817582\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_Search_TextBox_460817582\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columntitle=\"\" columntablename=\"TQC_ISSUES\" columnname=\"ISS_NUM\" columncaption=\"序号\" columndatatypename=\"字符串\" columnoperator=\"匹配\" client_resolve=\"WLDCT_Search_TextBox\"></div></td> \n      <td class=\"label\">标题:</td> \n      <td>\n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_Search_TextBox\" designcontrolinstancename=\"WLDCT_Search_TextBox_460820651\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_Search_TextBox_460820651\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columntitle=\"\" columntablename=\"TQC_ISSUES\" columnname=\"ISS_TITLE\" columncaption=\"标题\" columndatatypename=\"字符串\" columnoperator=\"匹配\" client_resolve=\"WLDCT_Search_TextBox\"></div></td> \n      <td class=\"label\">时间(从):</td> \n      <td>\n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_Search_TextDateTime\" designcontrolinstancename=\"WLDCT_Search_TextDateTime_460823559\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_Search_TextDateTime_460823559\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columntitle=\"\" columntablename=\"TQC_ISSUES\" columnname=\"ISS_ACCEPT_DATE\" columncaption=\"受理时间\" columndatatypename=\"日期时间\" columnoperator=\"gt_eq\" client_resolve=\"WLDCT_Search_TextDateTime\"></div></td> \n      <td class=\"label\">(到):</td> \n      <td>\n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_Search_TextDateTime\" designcontrolinstancename=\"WLDCT_Search_TextDateTime_460825318\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_Search_TextDateTime_460825318\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columntitle=\"\" columntablename=\"TQC_ISSUES\" columnname=\"ISS_ACCEPT_DATE\" columncaption=\"受理时间\" columndatatypename=\"日期时间\" columnoperator=\"lt_eq\" client_resolve=\"WLDCT_Search_TextDateTime\"></div></td> \n     </tr> \n    </tbody>\n   </table>\n  </div>\n </div>\n <div class=\"uid-wldct-list-complex-search-container-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListComplexSearchContainer\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"LayoutGroup\" designcontrolinstancename=\"WLDCT_ListComplexSearchContainer_460792703\" id=\"WLDCT_ListComplexSearchContainer_460792703\" serialize=\"true\" name=\"\" placeholder=\"\" style=\"\" desc=\"\" status=\"disable\" groupname=\"\" client_resolve=\"WLDCT_ListComplexSearchContainer\"> \n  <div class=\"uid-container-inner-wrap\"> \n   <table contenteditable=\"true\"> \n    <colgroup> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 17%\"> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 17%\"> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 17%\"> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 17%\"> \n    </colgroup> \n    <tbody>\n     <tr> \n      <td class=\"label\">名称:</td> \n      <td></td> \n      <td class=\"label\">标题:</td> \n      <td></td> \n      <td class=\"label\">时间(从):</td> \n      <td></td> \n      <td class=\"label\">(到):</td> \n      <td></td> \n     </tr> \n     <tr> \n      <td class=\"label\">名称:</td> \n      <td></td> \n      <td class=\"label\">标题:</td> \n      <td></td> \n      <td class=\"label\">时间(从):</td> \n      <td></td> \n      <td class=\"label\">(到):</td> \n      <td></td> \n     </tr> \n     <tr> \n      <td class=\"label\">名称:</td> \n      <td></td> \n      <td class=\"label\">标题:</td> \n      <td></td> \n      <td class=\"label\">时间(从):</td> \n      <td></td> \n      <td class=\"label\">(到):</td> \n      <td></td> \n     </tr> \n     <tr> \n      <td class=\"label\">名称:</td> \n      <td></td> \n      <td class=\"label\">标题:</td> \n      <td></td> \n      <td class=\"label\">时间(从):</td> \n      <td></td> \n      <td class=\"label\">(到):</td> \n      <td></td> \n     </tr> \n    </tbody>\n   </table> \n  </div> \n </div>\n <div class=\"uid-wldct-list-button-container-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListButtonContainer\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"LayoutGroup\" designcontrolinstancename=\"WLDCT_ListButtonContainer_460792704\" id=\"WLDCT_ListButtonContainer_460792704\" client_resolve=\"WLDCT_ListButtonContainer\"> \n  <div class=\"uid-container-inner-wrap\"> \n   <table is-op-button-wrap-table=\"true\"> \n    <colgroup> \n     <col style=\"width: 10%\"> \n     <col style=\"width: 10%\"> \n     <col style=\"width: 10%\"> \n     <col style=\"width: 10%\"> \n     <col style=\"width: 10%\"> \n     <col style=\"width: 10%\"> \n     <col style=\"width: 10%\"> \n     <col style=\"width: 10%\"> \n    </colgroup> \n    <tbody>\n     <tr> \n      <td></td> \n      <td></td> \n      <td></td> \n      <td></td> \n      <td style=\"\"></td> \n      <td style=\"\">\n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_FormButton\" designcontrolinstancename=\"WLDCT_FormButton_460828906\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_FormButton_460828906\" isopbutton=\"true\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"false\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" buttontype=\"ListFormButton\" formmoduleid=\"b6641464-e55f-4d1c-afea-400769f6f6a3\" formmodulename=\"运维问题模块\" formid=\"017d78b0-56f2-41a4-9636-5a0180e689ca\" formname=\"问题登记表单\" formcode=\"100001\" buttoncaption=\"新增\" opentype=\"Dialog\" windowheight=\"900\" windowwidth=\"1324\" isshow=\"true\" operation=\"add\" bindauthority=\"notAuth\" innerbuttonjsonstring=\"[{&quot;caption&quot;:&quot;保存&quot;,&quot;saveAndClose&quot;:&quot;true&quot;,&quot;apis&quot;:[],&quot;fields&quot;:[],&quot;id&quot;:&quot;inner_form_save_button_461280585&quot;,&quot;buttonType&quot;:&quot;保存按钮&quot;,&quot;custServerResolveMethod&quot;:&quot;&quot;,&quot;custServerResolveMethodPara&quot;:&quot;&quot;,&quot;custClientRendererMethod&quot;:&quot;&quot;,&quot;custClientRendererMethodPara&quot;:&quot;&quot;,&quot;custClientRendererAfterMethod&quot;:&quot;&quot;,&quot;custClientRendererAfterMethodPara&quot;:&quot;&quot;,&quot;custClientClickBeforeMethod&quot;:&quot;&quot;,&quot;custClientClickBeforeMethodPara&quot;:&quot;&quot;},{&quot;caption&quot;:&quot;关闭&quot;,&quot;id&quot;:&quot;inner_close_button_461289650&quot;,&quot;buttonType&quot;:&quot;关闭按钮&quot;}]\" buttonid=\"8318f6ec-3c94-4e6f-b561-76c881f35899-WLDCT_FormButton_460828906\" client_resolve=\"WLDCT_FormButton\"></div></td> \n      <td style=\"\">\n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_FormButton\" designcontrolinstancename=\"WLDCT_FormButton_460830589\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_FormButton_460830589\" isopbutton=\"true\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"false\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" buttontype=\"ListFormButton\" formmoduleid=\"b6641464-e55f-4d1c-afea-400769f6f6a3\" formmodulename=\"运维问题模块\" formid=\"017d78b0-56f2-41a4-9636-5a0180e689ca\" formname=\"问题登记表单\" formcode=\"100001\" buttoncaption=\"修改\" opentype=\"Dialog\" windowheight=\"900\" windowwidth=\"1324\" isshow=\"true\" operation=\"update\" bindauthority=\"notAuth\" innerbuttonjsonstring=\"[{&quot;caption&quot;:&quot;保存&quot;,&quot;saveAndClose&quot;:&quot;true&quot;,&quot;apis&quot;:[],&quot;fields&quot;:[],&quot;id&quot;:&quot;inner_form_save_button_461303767&quot;,&quot;buttonType&quot;:&quot;保存按钮&quot;,&quot;custServerResolveMethod&quot;:&quot;&quot;,&quot;custServerResolveMethodPara&quot;:&quot;&quot;,&quot;custClientRendererMethod&quot;:&quot;&quot;,&quot;custClientRendererMethodPara&quot;:&quot;&quot;,&quot;custClientRendererAfterMethod&quot;:&quot;&quot;,&quot;custClientRendererAfterMethodPara&quot;:&quot;&quot;,&quot;custClientClickBeforeMethod&quot;:&quot;&quot;,&quot;custClientClickBeforeMethodPara&quot;:&quot;&quot;},{&quot;caption&quot;:&quot;关闭&quot;,&quot;id&quot;:&quot;inner_close_button_461308532&quot;,&quot;buttonType&quot;:&quot;关闭按钮&quot;}]\" buttonid=\"8318f6ec-3c94-4e6f-b561-76c881f35899-WLDCT_FormButton_460830589\" client_resolve=\"WLDCT_FormButton\"></div></td> \n      <td style=\"\">\n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_FormButton\" designcontrolinstancename=\"WLDCT_FormButton_460842713\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_FormButton_460842713\" isopbutton=\"true\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"false\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" buttontype=\"ListFormButton\" buttoncaption=\"删除\" opentype=\"Dialog\" windowheight=\"NaN\" windowwidth=\"NaN\" isshow=\"true\" bindauthority=\"notAuth\" innerbuttonjsonstring=\"[]\" buttonid=\"8318f6ec-3c94-4e6f-b561-76c881f35899-WLDCT_FormButton_460842713\" client_resolve=\"WLDCT_FormButton\"></div></td> \n     </tr> \n    </tbody>\n   </table> \n  </div> \n </div>\n <div class=\"uid-wldct-list-table-container-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableContainer\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"LayoutGroup\" designcontrolinstancename=\"WLDCT_ListTableContainer_460792704\" id=\"WLDCT_ListTableContainer_460792704\" client_resolve=\"WLDCT_ListTableContainer\"> \n  <div class=\"uid-container-inner-wrap\"> \n   <table class=\"list-table\" contenteditable=\"true\"> \n    <colgroup> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 68%\"> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 8%\"> \n    </colgroup> \n    <thead> \n     <tr> \n      <th>编号</th> \n      <th>标题</th> \n      <th>状态</th> \n      <th>处理时间</th> \n      <th>操作</th> \n     </tr> \n    </thead> \n    <tbody> \n     <tr> \n      <td>\n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableLabel\" designcontrolinstancename=\"WLDCT_ListTableLabel_460845022\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_ListTableLabel_460845022\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columnname=\"ISS_NUM\" columncaption=\"序号\" columndatatypename=\"字符串\" targetbuttonid=\"\" columnalign=\"居中对齐\" defformat=\"notFormat\" dictionarygroupdatasourcetext=\"\" dictionarygroupdatasourceid=\"\" omitlength=\"\" client_resolve=\"WLDCT_ListTableLabel\"></div></td> \n      <td>\n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableLabel\" designcontrolinstancename=\"WLDCT_ListTableLabel_460847316\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_ListTableLabel_460847316\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columnname=\"ISS_TITLE\" columncaption=\"标题\" columndatatypename=\"字符串\" targetbuttonid=\"\" columnalign=\"居中对齐\" defformat=\"notFormat\" dictionarygroupdatasourcetext=\"\" dictionarygroupdatasourceid=\"\" omitlength=\"\" client_resolve=\"WLDCT_ListTableLabel\"></div></td> \n      <td>\n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableLabel\" designcontrolinstancename=\"WLDCT_ListTableLabel_460849653\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_ListTableLabel_460849653\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columnname=\"ISS_STATUS\" columncaption=\"处理状态\" columndatatypename=\"字符串\" targetbuttonid=\"\" columnalign=\"居中对齐\" defformat=\"notFormat\" dictionarygroupdatasourcetext=\"\" dictionarygroupdatasourceid=\"\" omitlength=\"\" client_resolve=\"WLDCT_ListTableLabel\"></div></td> \n      <td>\n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableLabel\" designcontrolinstancename=\"WLDCT_ListTableLabel_460851158\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_ListTableLabel_460851158\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columnname=\"ISS_HANDLER_END_DATE\" columncaption=\"分配给-处理时间\" columndatatypename=\"日期时间\" targetbuttonid=\"\" columnalign=\"居中对齐\" defformat=\"notFormat\" dictionarygroupdatasourcetext=\"\" dictionarygroupdatasourceid=\"\" omitlength=\"\" client_resolve=\"WLDCT_ListTableLabel\"></div></td> \n      <td class=\"op-button-container-outer-td\"> \n       <div class=\"uid-wldct-list-table-inner-button-container-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableInnerButtonContainer\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"InputGroup\" designcontrolinstancename=\"WLDCT_ListTableInnerButtonContainer_460792704\" id=\"WLDCT_ListTableInnerButtonContainer_460792704\" client_resolve=\"WLDCT_ListTableInnerButtonContainer\"> \n        <div class=\"uid-container-inner-wrap\"> \n         <table is-inner-op-button-wrap-table=\"true\"> \n          <colgroup> \n           <col style=\"width: 33%\"> \n           <col style=\"width: 33%\"> \n           <col style=\"width: 33%\"> \n          </colgroup> \n          <tbody>\n           <tr> \n            <td>\n             <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableInnerButtonSingle\" designcontrolinstancename=\"WLDCT_ListTableInnerButtonSingle_461152375\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_ListTableInnerButtonSingle_461152375\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" targetbuttonid=\"WLDCT_FormButton_460830589\" selectedclass=\"wldct-list-table-row-inner-button edit\" caption=\"修改\" alertmsg=\"\" client_resolve=\"WLDCT_ListTableInnerButtonSingle\"></div></td> \n            <td>\n             <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableInnerButtonSingle\" designcontrolinstancename=\"WLDCT_ListTableInnerButtonSingle_462484104\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_ListTableInnerButtonSingle_462484104\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" targetbuttonid=\"WLDCT_FormButton_460842713\" selectedclass=\"wldct-list-table-row-inner-button del\" caption=\"删除\" alertmsg=\"\" client_resolve=\"WLDCT_ListTableInnerButtonSingle\"></div></td> \n            <td></td> \n           </tr> \n          </tbody>\n         </table> \n        </div> \n       </div></td> \n     </tr> \n    </tbody> \n   </table> \n  </div> \n </div>\n <div class=\"uid-wldct-hide-container-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_HideContainer\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"LayoutGroup\" designcontrolinstancename=\"WLDCT_HideContainer_460792704\" id=\"WLDCT_HideContainer_460792704\" client_resolve=\"\"> \n  <div class=\"uid-container-inner-wrap\"> \n   <table contenteditable=\"true\"> \n    <colgroup>\n     <col style=\"width: 8%\">\n     <col style=\"width: 15%\">\n     <col style=\"width: 8%\">\n     <col style=\"width: 15%\">\n     <col style=\"width: 8%\">\n     <col style=\"width: 16%\">\n    </colgroup> \n    <tbody>\n     <tr>\n      <td style=\"\">隐藏控件</td>\n      <td style=\"\">\n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_Search_TextBox\" designcontrolinstancename=\"WLDCT_Search_TextBox_461175685\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_Search_TextBox_461175685\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" client_resolve=\"WLDCT_Search_TextBox\"></div></td>\n      <td></td>\n      <td></td>\n      <td></td>\n      <td></td>\n     </tr> \n     <tr>\n      <td></td>\n      <td style=\"\"></td>\n      <td style=\"\"></td>\n      <td></td>\n      <td></td>\n      <td></td>\n     </tr> \n     <tr>\n      <td></td>\n      <td></td>\n      <td></td>\n      <td style=\"\"></td>\n      <td></td>\n      <td></td>\n     </tr> \n     <tr>\n      <td></td>\n      <td></td>\n      <td></td>\n      <td></td>\n      <td></td>\n      <td></td>\n     </tr> \n    </tbody>\n   </table> \n  </div> \n </div>\n <div id=\"redips_clone\" style=\"height: 1px; width: 1px;\"></div>\n</div>",
            "listJsContent": "var BuilderListPageRuntimeInstance = {\n    data: {\n        listPO: null\n    },\n    pageReady: function () {\n        //页面加载html完成,未进行客户端控件的渲染\n        console.log(\"页面加载html完成\");\n    },\n    rendererChainCompleted: function () {\n        //客户端控件渲染完成.\n        console.log(\"客户端控件渲染完成\");\n    },\n    rendererDataChainCompleted: function () {\n        //客户端控件渲染并绑定完数据.\n        console.log(\"客户端控件渲染并绑定完数据\");\n    }\n}",
            "listCssContent": "#uid-css-code-editor-comp-root{\n        height: 100%;\n        border: 1px solid #ffffff;\n        border-radius: 4px;\n        padding: 2px;\n        background-color: #1e1e1e;\n    }",
            "listConfigContent": "",
            "listDesignRemark": null,
            "listHtmlRuntime": "<div class=\"uid-wldct-list-template-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTemplate\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"LayoutGroup\" designcontrolinstancename=\"WLDCT_ListTemplate_460792703\" id=\"WLDCT_ListTemplate_460792703\"> \n <div class=\"uid-wldct-list-simple-search-container-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListSimpleSearchContainer\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"LayoutGroup\" designcontrolinstancename=\"WLDCT_ListSimpleSearchContainer_460792703\" id=\"WLDCT_ListSimpleSearchContainer_460792703\" client_resolve=\"WLDCT_ListSimpleSearchContainer\" client_instance_name=\"WLDCT_ListSimpleSearchContainer_d65d6ff365ef464c87f71105030df40a\"> \n  <div class=\"uid-container-inner-wrap\"> \n   <table contenteditable=\"true\"> \n    <colgroup> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 17%\"> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 17%\"> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 17%\"> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 17%\"> \n    </colgroup> \n    <tbody> \n     <tr> \n      <td class=\"label\">序号:</td> \n      <td> <input jbuild4dc_custom=\"true\" singlename=\"WLDCT_Search_TextBox\" designcontrolinstancename=\"WLDCT_Search_TextBox_460817582\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_Search_TextBox_460817582\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columntitle=\"\" columntablename=\"TQC_ISSUES\" columnname=\"ISS_NUM\" columncaption=\"序号\" columndatatypename=\"字符串\" columnoperator=\"匹配\" client_resolve=\"WLDCT_Search_TextBox\" type=\"text\"></td> \n      <td class=\"label\">标题:</td> \n      <td> <input jbuild4dc_custom=\"true\" singlename=\"WLDCT_Search_TextBox\" designcontrolinstancename=\"WLDCT_Search_TextBox_460820651\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_Search_TextBox_460820651\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columntitle=\"\" columntablename=\"TQC_ISSUES\" columnname=\"ISS_TITLE\" columncaption=\"标题\" columndatatypename=\"字符串\" columnoperator=\"匹配\" client_resolve=\"WLDCT_Search_TextBox\" type=\"text\"></td> \n      <td class=\"label\">时间(从):</td> \n      <td> <input jbuild4dc_custom=\"true\" singlename=\"WLDCT_Search_TextDateTime\" designcontrolinstancename=\"WLDCT_Search_TextDateTime_460823559\" class=\"uid-design-input-control redips-drag Wdate\" contenteditable=\"false\" id=\"WLDCT_Search_TextDateTime_460823559\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columntitle=\"\" columntablename=\"TQC_ISSUES\" columnname=\"ISS_ACCEPT_DATE\" columncaption=\"受理时间\" columndatatypename=\"日期时间\" columnoperator=\"gt_eq\" client_resolve=\"WLDCT_Search_TextDateTime\" type=\"text\" onclick=\"WdatePicker({readOnly:true})\"></td> \n      <td class=\"label\">(到):</td> \n      <td> <input jbuild4dc_custom=\"true\" singlename=\"WLDCT_Search_TextDateTime\" designcontrolinstancename=\"WLDCT_Search_TextDateTime_460825318\" class=\"uid-design-input-control redips-drag Wdate\" contenteditable=\"false\" id=\"WLDCT_Search_TextDateTime_460825318\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columntitle=\"\" columntablename=\"TQC_ISSUES\" columnname=\"ISS_ACCEPT_DATE\" columncaption=\"受理时间\" columndatatypename=\"日期时间\" columnoperator=\"lt_eq\" client_resolve=\"WLDCT_Search_TextDateTime\" type=\"text\" onclick=\"WdatePicker({readOnly:true})\"></td> \n     </tr> \n    </tbody> \n   </table> \n  </div> \n </div> \n <div class=\"uid-wldct-list-complex-search-container-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListComplexSearchContainer\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"LayoutGroup\" designcontrolinstancename=\"WLDCT_ListComplexSearchContainer_460792703\" id=\"WLDCT_ListComplexSearchContainer_460792703\" serialize=\"true\" name=\"\" placeholder=\"\" style=\"\" desc=\"\" status=\"disable\" groupname=\"\" client_resolve=\"WLDCT_ListComplexSearchContainer\" client_instance_name=\"WLDCT_ListComplexSearchContainer_dc57d287904243ccad56c518ec9bc50c\"> \n  <div class=\"uid-container-inner-wrap\"> \n   <table contenteditable=\"true\"> \n    <colgroup> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 17%\"> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 17%\"> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 17%\"> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 17%\"> \n    </colgroup> \n    <tbody> \n     <tr> \n      <td class=\"label\">名称:</td> \n      <td></td> \n      <td class=\"label\">标题:</td> \n      <td></td> \n      <td class=\"label\">时间(从):</td> \n      <td></td> \n      <td class=\"label\">(到):</td> \n      <td></td> \n     </tr> \n     <tr> \n      <td class=\"label\">名称:</td> \n      <td></td> \n      <td class=\"label\">标题:</td> \n      <td></td> \n      <td class=\"label\">时间(从):</td> \n      <td></td> \n      <td class=\"label\">(到):</td> \n      <td></td> \n     </tr> \n     <tr> \n      <td class=\"label\">名称:</td> \n      <td></td> \n      <td class=\"label\">标题:</td> \n      <td></td> \n      <td class=\"label\">时间(从):</td> \n      <td></td> \n      <td class=\"label\">(到):</td> \n      <td></td> \n     </tr> \n     <tr> \n      <td class=\"label\">名称:</td> \n      <td></td> \n      <td class=\"label\">标题:</td> \n      <td></td> \n      <td class=\"label\">时间(从):</td> \n      <td></td> \n      <td class=\"label\">(到):</td> \n      <td></td> \n     </tr> \n    </tbody> \n   </table> \n  </div> \n </div> \n <div class=\"uid-wldct-list-button-container-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListButtonContainer\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"LayoutGroup\" designcontrolinstancename=\"WLDCT_ListButtonContainer_460792704\" id=\"WLDCT_ListButtonContainer_460792704\" client_resolve=\"WLDCT_ListButtonContainer\" client_instance_name=\"WLDCT_ListButtonContainer_77ee5ffd87df4dc989c79a9a0755c109\"> \n  <div class=\"uid-container-inner-wrap\"> \n   <table is-op-button-wrap-table=\"true\"> \n    <colgroup> \n     <col style=\"width: 10%\"> \n     <col style=\"width: 10%\"> \n     <col style=\"width: 10%\"> \n     <col style=\"width: 10%\"> \n     <col style=\"width: 10%\"> \n     <col style=\"width: 10%\"> \n     <col style=\"width: 10%\"> \n     <col style=\"width: 10%\"> \n    </colgroup> \n    <tbody> \n     <tr> \n      <td></td> \n      <td></td> \n      <td></td> \n      <td></td> \n      <td style=\"\"></td> \n      <td style=\"\"> \n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_FormButton\" designcontrolinstancename=\"WLDCT_FormButton_460828906\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_FormButton_460828906\" isopbutton=\"true\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"false\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" buttontype=\"ListFormButton\" formmoduleid=\"b6641464-e55f-4d1c-afea-400769f6f6a3\" formmodulename=\"运维问题模块\" formid=\"017d78b0-56f2-41a4-9636-5a0180e689ca\" formname=\"问题登记表单\" formcode=\"100001\" buttoncaption=\"新增\" opentype=\"Dialog\" windowheight=\"900\" windowwidth=\"1324\" isshow=\"true\" operation=\"add\" bindauthority=\"notAuth\" innerbuttonjsonstring=\"[{&quot;caption&quot;:&quot;保存&quot;,&quot;saveAndClose&quot;:&quot;true&quot;,&quot;apis&quot;:[],&quot;fields&quot;:[],&quot;id&quot;:&quot;inner_form_save_button_461280585&quot;,&quot;buttonType&quot;:&quot;保存按钮&quot;,&quot;custServerResolveMethod&quot;:&quot;&quot;,&quot;custServerResolveMethodPara&quot;:&quot;&quot;,&quot;custClientRendererMethod&quot;:&quot;&quot;,&quot;custClientRendererMethodPara&quot;:&quot;&quot;,&quot;custClientRendererAfterMethod&quot;:&quot;&quot;,&quot;custClientRendererAfterMethodPara&quot;:&quot;&quot;,&quot;custClientClickBeforeMethod&quot;:&quot;&quot;,&quot;custClientClickBeforeMethodPara&quot;:&quot;&quot;},{&quot;caption&quot;:&quot;关闭&quot;,&quot;id&quot;:&quot;inner_close_button_461289650&quot;,&quot;buttonType&quot;:&quot;关闭按钮&quot;}]\" buttonid=\"8318f6ec-3c94-4e6f-b561-76c881f35899-WLDCT_FormButton_460828906\" client_resolve=\"WLDCT_FormButton\"></div></td> \n      <td style=\"\"> \n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_FormButton\" designcontrolinstancename=\"WLDCT_FormButton_460830589\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_FormButton_460830589\" isopbutton=\"true\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"false\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" buttontype=\"ListFormButton\" formmoduleid=\"b6641464-e55f-4d1c-afea-400769f6f6a3\" formmodulename=\"运维问题模块\" formid=\"017d78b0-56f2-41a4-9636-5a0180e689ca\" formname=\"问题登记表单\" formcode=\"100001\" buttoncaption=\"修改\" opentype=\"Dialog\" windowheight=\"900\" windowwidth=\"1324\" isshow=\"true\" operation=\"update\" bindauthority=\"notAuth\" innerbuttonjsonstring=\"[{&quot;caption&quot;:&quot;保存&quot;,&quot;saveAndClose&quot;:&quot;true&quot;,&quot;apis&quot;:[],&quot;fields&quot;:[],&quot;id&quot;:&quot;inner_form_save_button_461303767&quot;,&quot;buttonType&quot;:&quot;保存按钮&quot;,&quot;custServerResolveMethod&quot;:&quot;&quot;,&quot;custServerResolveMethodPara&quot;:&quot;&quot;,&quot;custClientRendererMethod&quot;:&quot;&quot;,&quot;custClientRendererMethodPara&quot;:&quot;&quot;,&quot;custClientRendererAfterMethod&quot;:&quot;&quot;,&quot;custClientRendererAfterMethodPara&quot;:&quot;&quot;,&quot;custClientClickBeforeMethod&quot;:&quot;&quot;,&quot;custClientClickBeforeMethodPara&quot;:&quot;&quot;},{&quot;caption&quot;:&quot;关闭&quot;,&quot;id&quot;:&quot;inner_close_button_461308532&quot;,&quot;buttonType&quot;:&quot;关闭按钮&quot;}]\" buttonid=\"8318f6ec-3c94-4e6f-b561-76c881f35899-WLDCT_FormButton_460830589\" client_resolve=\"WLDCT_FormButton\"></div></td> \n      <td style=\"\"> \n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_FormButton\" designcontrolinstancename=\"WLDCT_FormButton_460842713\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_FormButton_460842713\" isopbutton=\"true\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"false\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" buttontype=\"ListFormButton\" buttoncaption=\"删除\" opentype=\"Dialog\" windowheight=\"NaN\" windowwidth=\"NaN\" isshow=\"true\" bindauthority=\"notAuth\" innerbuttonjsonstring=\"[]\" buttonid=\"8318f6ec-3c94-4e6f-b561-76c881f35899-WLDCT_FormButton_460842713\" client_resolve=\"WLDCT_FormButton\"></div></td> \n     </tr> \n    </tbody> \n   </table> \n  </div> \n </div> \n <div class=\"uid-wldct-list-table-container-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableContainer\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"LayoutGroup\" designcontrolinstancename=\"WLDCT_ListTableContainer_460792704\" id=\"WLDCT_ListTableContainer_460792704\" client_resolve=\"WLDCT_ListTableContainer\" client_instance_name=\"WLDCT_ListTableContainer_ab05ba31b0864753981068c590bac967\"> \n  <div class=\"uid-container-inner-wrap\"> \n   <table class=\"list-table\" contenteditable=\"true\"> \n    <colgroup> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 68%\"> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 8%\"> \n    </colgroup> \n    <thead> \n     <tr> \n      <th>编号</th> \n      <th>标题</th> \n      <th>状态</th> \n      <th>处理时间</th> \n      <th>操作</th> \n     </tr> \n    </thead> \n    <tbody> \n     <tr> \n      <td> \n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableLabel\" designcontrolinstancename=\"WLDCT_ListTableLabel_460845022\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_ListTableLabel_460845022\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columnname=\"ISS_NUM\" columncaption=\"序号\" columndatatypename=\"字符串\" targetbuttonid=\"\" columnalign=\"居中对齐\" defformat=\"notFormat\" dictionarygroupdatasourcetext=\"\" dictionarygroupdatasourceid=\"\" omitlength=\"\" client_resolve=\"WLDCT_ListTableLabel\"></div></td> \n      <td> \n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableLabel\" designcontrolinstancename=\"WLDCT_ListTableLabel_460847316\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_ListTableLabel_460847316\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columnname=\"ISS_TITLE\" columncaption=\"标题\" columndatatypename=\"字符串\" targetbuttonid=\"\" columnalign=\"居中对齐\" defformat=\"notFormat\" dictionarygroupdatasourcetext=\"\" dictionarygroupdatasourceid=\"\" omitlength=\"\" client_resolve=\"WLDCT_ListTableLabel\"></div></td> \n      <td> \n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableLabel\" designcontrolinstancename=\"WLDCT_ListTableLabel_460849653\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_ListTableLabel_460849653\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columnname=\"ISS_STATUS\" columncaption=\"处理状态\" columndatatypename=\"字符串\" targetbuttonid=\"\" columnalign=\"居中对齐\" defformat=\"notFormat\" dictionarygroupdatasourcetext=\"\" dictionarygroupdatasourceid=\"\" omitlength=\"\" client_resolve=\"WLDCT_ListTableLabel\"></div></td> \n      <td> \n       <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableLabel\" designcontrolinstancename=\"WLDCT_ListTableLabel_460851158\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_ListTableLabel_460851158\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" defaulttype=\"\" defaultvalue=\"\" defaulttext=\"\" columnname=\"ISS_HANDLER_END_DATE\" columncaption=\"分配给-处理时间\" columndatatypename=\"日期时间\" targetbuttonid=\"\" columnalign=\"居中对齐\" defformat=\"notFormat\" dictionarygroupdatasourcetext=\"\" dictionarygroupdatasourceid=\"\" omitlength=\"\" client_resolve=\"WLDCT_ListTableLabel\"></div></td> \n      <td class=\"op-button-container-outer-td\"> \n       <div class=\"uid-wldct-list-table-inner-button-container-wrap\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableInnerButtonContainer\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"InputGroup\" designcontrolinstancename=\"WLDCT_ListTableInnerButtonContainer_460792704\" id=\"WLDCT_ListTableInnerButtonContainer_460792704\" client_resolve=\"WLDCT_ListTableInnerButtonContainer\"> \n        <div class=\"uid-container-inner-wrap\"> \n         <table is-inner-op-button-wrap-table=\"true\"> \n          <colgroup> \n           <col style=\"width: 33%\"> \n           <col style=\"width: 33%\"> \n           <col style=\"width: 33%\"> \n          </colgroup> \n          <tbody> \n           <tr> \n            <td> \n             <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableInnerButtonSingle\" designcontrolinstancename=\"WLDCT_ListTableInnerButtonSingle_461152375\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_ListTableInnerButtonSingle_461152375\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" targetbuttonid=\"WLDCT_FormButton_460830589\" selectedclass=\"wldct-list-table-row-inner-button edit\" caption=\"修改\" alertmsg=\"\" client_resolve=\"WLDCT_ListTableInnerButtonSingle\"></div></td> \n            <td> \n             <div jbuild4dc_custom=\"true\" singlename=\"WLDCT_ListTableInnerButtonSingle\" designcontrolinstancename=\"WLDCT_ListTableInnerButtonSingle_462484104\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_ListTableInnerButtonSingle_462484104\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" serialize=\"true\" name=\"\" placeholder=\"\" desc=\"\" status=\"enable\" groupname=\"\" targetbuttonid=\"WLDCT_FormButton_460842713\" selectedclass=\"wldct-list-table-row-inner-button del\" caption=\"删除\" alertmsg=\"\" client_resolve=\"WLDCT_ListTableInnerButtonSingle\"></div></td> \n            <td></td> \n           </tr> \n          </tbody> \n         </table> \n        </div> \n       </div></td> \n     </tr> \n    </tbody> \n   </table> \n  </div> \n </div> \n <div class=\"uid-wldct-hide-container-wrap wrap-hide\" jbuild4dc_custom=\"true\" singlename=\"WLDCT_HideContainer\" is_jbuild4dc_data=\"false\" control_category=\"LayoutControl\" show_remove_button=\"false\" group=\"LayoutGroup\" designcontrolinstancename=\"WLDCT_HideContainer_460792704\" id=\"WLDCT_HideContainer_460792704\" client_resolve=\"\"> \n  <div class=\"uid-container-inner-wrap\"> \n   <table contenteditable=\"true\"> \n    <colgroup> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 15%\"> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 15%\"> \n     <col style=\"width: 8%\"> \n     <col style=\"width: 16%\"> \n    </colgroup> \n    <tbody> \n     <tr> \n      <td style=\"\">隐藏控件</td> \n      <td style=\"\"> <input jbuild4dc_custom=\"true\" singlename=\"WLDCT_Search_TextBox\" designcontrolinstancename=\"WLDCT_Search_TextBox_461175685\" class=\"uid-design-input-control redips-drag\" contenteditable=\"false\" id=\"WLDCT_Search_TextBox_461175685\" is_jbuild4dc_data=\"false\" control_category=\"InputControl\" show_remove_button=\"false\" group=\"InputGroup\" style=\"\" client_resolve=\"WLDCT_Search_TextBox\" type=\"text\"></td> \n      <td></td> \n      <td></td> \n      <td></td> \n      <td></td> \n     </tr> \n     <tr> \n      <td></td> \n      <td style=\"\"></td> \n      <td style=\"\"></td> \n      <td></td> \n      <td></td> \n      <td></td> \n     </tr> \n     <tr> \n      <td></td> \n      <td></td> \n      <td></td> \n      <td style=\"\"></td> \n      <td></td> \n      <td></td> \n     </tr> \n     <tr> \n      <td></td> \n      <td></td> \n      <td></td> \n      <td></td> \n      <td></td> \n      <td></td> \n     </tr> \n    </tbody> \n   </table> \n  </div> \n </div> \n <div id=\"redips_clone\" style=\"height: 1px; width: 1px;\"></div> \n</div> \n<script>var WLDCT_ListSimpleSearchContainer_d65d6ff365ef464c87f71105030df40a=Object.create(WLDCT_ListSimpleSearchContainer);HTMLControl._SaveControlNewInstanceToPool(\"WLDCT_ListSimpleSearchContainer_d65d6ff365ef464c87f71105030df40a\",WLDCT_ListSimpleSearchContainer_d65d6ff365ef464c87f71105030df40a);</script> \n<script>var WLDCT_ListComplexSearchContainer_dc57d287904243ccad56c518ec9bc50c=Object.create(WLDCT_ListComplexSearchContainer);HTMLControl._SaveControlNewInstanceToPool(\"WLDCT_ListComplexSearchContainer_dc57d287904243ccad56c518ec9bc50c\",WLDCT_ListComplexSearchContainer_dc57d287904243ccad56c518ec9bc50c);</script> \n<script>var WLDCT_ListButtonContainer_77ee5ffd87df4dc989c79a9a0755c109=Object.create(WLDCT_ListButtonContainer);HTMLControl._SaveControlNewInstanceToPool(\"WLDCT_ListButtonContainer_77ee5ffd87df4dc989c79a9a0755c109\",WLDCT_ListButtonContainer_77ee5ffd87df4dc989c79a9a0755c109);</script> \n<script>var WLDCT_ListTableContainer_ab05ba31b0864753981068c590bac967=Object.create(WLDCT_ListTableContainer);HTMLControl._SaveControlNewInstanceToPool(\"WLDCT_ListTableContainer_ab05ba31b0864753981068c590bac967\",WLDCT_ListTableContainer_ab05ba31b0864753981068c590bac967);</script>",
            "dataSetPOList": null,
            "listJsRuntime": "var BuilderListPageRuntimeInstance = {\n    data: {\n        listPO: null\n    },\n    pageReady: function () {\n        //页面加载html完成,未进行客户端控件的渲染\n        console.log(\"页面加载html完成\");\n    },\n    rendererChainCompleted: function () {\n        //客户端控件渲染完成.\n        console.log(\"客户端控件渲染完成\");\n    },\n    rendererDataChainCompleted: function () {\n        //客户端控件渲染并绑定完数据.\n        console.log(\"客户端控件渲染并绑定完数据\");\n    }\n}",
            "exData": {
                "minOrganData": {
                    "success": true,
                    "message": "获取数据成功!",
                    "cacheKey": "",
                    "traceMsg": "",
                    "errorCode": null,
                    "data": {
                        "0": {"organName": "组织机构管理", "organId": "0"},
                        "10002": {"organName": "开发组织", "organId": "10002"},
                        "10001": {"organName": "系统管理组", "organId": "10001"}
                    },
                    "exKVData": {}
                }, "minDictionaryData": {
                    "success": true, "message": "", "cacheKey": "", "traceMsg": "", "errorCode": null, "data": {
                        "bd465a40-a8ae-40bb-95c2-de6332e1ce9a_已发布[生产环境]": {
                            "TEXT": "已发布[生产环境]",
                            "ID": "758ce5c4-88b3-4043-b581-dc8a88d0376b",
                            "VALUE": "已发布[生产环境]"
                        },
                        "bd465a40-a8ae-40bb-95c2-de6332e1ce9a_重新打开": {
                            "TEXT": "重新打开",
                            "ID": "d106b89d-5328-4347-a617-4ddc426bade6",
                            "VALUE": "重新打开"
                        },
                        "bd465a40-a8ae-40bb-95c2-de6332e1ce9a_建议拒绝": {
                            "TEXT": "建议拒绝",
                            "ID": "b18c31e6-f3e6-4c8c-b043-9eccd1ca7dde",
                            "VALUE": "建议拒绝"
                        },
                        "a9a7a4e4-298f-4a42-b369-6aa66ecafbae_QQ群": {
                            "TEXT": "QQ群",
                            "ID": "7dfefd43-d6d7-4a33-b1ea-076860118118",
                            "VALUE": "QQ群"
                        },
                        "cb1dc802-2ddf-4989-b757-90c81bc2d9cb_Web后台": {
                            "TEXT": "Web后台",
                            "ID": "b7586897-f9c3-4e3d-9b9f-0593802446d8",
                            "VALUE": "Web后台"
                        },
                        "bd465a40-a8ae-40bb-95c2-de6332e1ce9a_延期": {
                            "TEXT": "延期",
                            "ID": "02b34fb0-0273-48db-8fb9-1a1911e6b63c",
                            "VALUE": "延期"
                        },
                        "DevDemoDictionaryGroupBindCheckbox_Checkbox-Value-3": {
                            "TEXT": "Checkbox-Text-3",
                            "ID": "DevDemoDictionaryGroupBindCheckbox3",
                            "VALUE": "Checkbox-Value-3"
                        },
                        "bd465a40-a8ae-40bb-95c2-de6332e1ce9a_已解决": {
                            "TEXT": "已解决",
                            "ID": "78440934-448a-4e2f-a6a9-425b2b336dfb",
                            "VALUE": "已解决"
                        },
                        "DevDemoDictionaryGroupBindCheckbox_Checkbox-Value-2": {
                            "TEXT": "Checkbox-Text-2",
                            "ID": "DevDemoDictionaryGroupBindCheckbox2",
                            "VALUE": "Checkbox-Value-2"
                        },
                        "DevDemoDictionaryGroupBindCheckbox_Checkbox-Value-1": {
                            "TEXT": "Checkbox-Text-1",
                            "ID": "DevDemoDictionaryGroupBindCheckbox1",
                            "VALUE": "Checkbox-Value-1"
                        },
                        "a9a7a4e4-298f-4a42-b369-6aa66ecafbae_邮件": {
                            "TEXT": "邮件",
                            "ID": "2367209a-8af5-477a-82b4-d246bf902427",
                            "VALUE": "邮件"
                        },
                        "DevDemoDictionaryGroupBindCheckbox_Checkbox-Value-0": {
                            "TEXT": "Checkbox-Text-0",
                            "ID": "DevDemoDictionaryGroupBindCheckbox0",
                            "VALUE": "Checkbox-Value-0"
                        },
                        "DevDemoDictionaryGroupBindCheckbox_Checkbox-Value-7": {
                            "TEXT": "Checkbox-Text-7",
                            "ID": "DevDemoDictionaryGroupBindCheckbox7",
                            "VALUE": "Checkbox-Value-7"
                        },
                        "DevDemoDictionaryGroupBindCheckbox_Checkbox-Value-6": {
                            "TEXT": "Checkbox-Text-6",
                            "ID": "DevDemoDictionaryGroupBindCheckbox6",
                            "VALUE": "Checkbox-Value-6"
                        },
                        "DevDemoDictionaryGroupBindCheckbox_Checkbox-Value-5": {
                            "TEXT": "Checkbox-Text-5",
                            "ID": "DevDemoDictionaryGroupBindCheckbox5",
                            "VALUE": "Checkbox-Value-5"
                        },
                        "DevDemoDictionaryGroupBindCheckbox_Checkbox-Value-4": {
                            "TEXT": "Checkbox-Text-4",
                            "ID": "DevDemoDictionaryGroupBindCheckbox4",
                            "VALUE": "Checkbox-Value-4"
                        },
                        "49fdf1a9-683c-45d8-b284-ed3c29609519_运维中": {
                            "TEXT": "运维中",
                            "ID": "c40821df-e513-4a43-a8da-c69c6492681b",
                            "VALUE": "运维中"
                        },
                        "DevDemoDictionaryGroupBindCheckbox_Checkbox-Value-9": {
                            "TEXT": "Checkbox-Text-9",
                            "ID": "DevDemoDictionaryGroupBindCheckbox9",
                            "VALUE": "Checkbox-Value-9"
                        },
                        "DevDemoDictionaryGroupBindCheckbox_Checkbox-Value-8": {
                            "TEXT": "Checkbox-Text-8",
                            "ID": "DevDemoDictionaryGroupBindCheckbox8",
                            "VALUE": "Checkbox-Value-8"
                        },
                        "a9a7a4e4-298f-4a42-b369-6aa66ecafbae_微信群": {
                            "TEXT": "微信群",
                            "ID": "3b027a27-4154-448b-b268-a64c43303f41",
                            "VALUE": "微信群"
                        },
                        "bd465a40-a8ae-40bb-95c2-de6332e1ce9a_已关闭[测试环境]": {
                            "TEXT": "已关闭[测试环境]",
                            "ID": "6f294411-2814-4f8e-a18d-f90fd0ec4f2d",
                            "VALUE": "已关闭[测试环境]"
                        },
                        "608a0a9a-14db-475a-a01f-463e9c01579d_运维": {
                            "TEXT": "运维",
                            "ID": "91a53365-14bc-479d-bbea-f839c8b7ddf6",
                            "VALUE": "运维"
                        },
                        "DevDemoDictionaryGroupBindSelect_Select-Value-6": {
                            "TEXT": "Select-Text-6",
                            "ID": "DevDemoDictionaryGroupBindSelect6",
                            "VALUE": "Select-Value-6"
                        },
                        "DevDemoDictionaryGroupBindSelect_Select-Value-7": {
                            "TEXT": "Select-Text-7",
                            "ID": "DevDemoDictionaryGroupBindSelect7",
                            "VALUE": "Select-Value-7"
                        },
                        "DevDemoDictionaryGroupBindSelect_Select-Value-4": {
                            "TEXT": "Select-Text-4",
                            "ID": "DevDemoDictionaryGroupBindSelect4",
                            "VALUE": "Select-Value-4"
                        },
                        "DevDemoDictionaryGroupBindSelect_Select-Value-5": {
                            "TEXT": "Select-Text-5",
                            "ID": "DevDemoDictionaryGroupBindSelect5",
                            "VALUE": "Select-Value-5"
                        },
                        "DevDemoDictionaryGroupBindSelect_Select-Value-2": {
                            "TEXT": "Select-Text-2",
                            "ID": "DevDemoDictionaryGroupBindSelect2",
                            "VALUE": "Select-Value-2"
                        },
                        "DevDemoDictionaryGroupBindSelect_Select-Value-3": {
                            "TEXT": "Select-Text-3",
                            "ID": "DevDemoDictionaryGroupBindSelect3",
                            "VALUE": "Select-Value-3"
                        },
                        "DevDemoDictionaryGroupBindSelect_Select-Value-0": {
                            "TEXT": "Select-Text-0",
                            "ID": "DevDemoDictionaryGroupBindSelect0",
                            "VALUE": "Select-Value-0"
                        },
                        "608a0a9a-14db-475a-a01f-463e9c01579d_咨询": {
                            "TEXT": "咨询",
                            "ID": "b27956c4-1833-4082-a0dd-501b8a23a4f9",
                            "VALUE": "咨询"
                        },
                        "84027e03-e6fa-4260-aa25-214882dcd903_高": {
                            "TEXT": "高",
                            "ID": "f8e4ab70-a720-4773-b4aa-274d8ee03f77",
                            "VALUE": "高"
                        },
                        "DevDemoDictionaryGroupBindSelect_Select-Value-1": {
                            "TEXT": "Select-Text-1",
                            "ID": "DevDemoDictionaryGroupBindSelect1",
                            "VALUE": "Select-Value-1"
                        },
                        "a9a7a4e4-298f-4a42-b369-6aa66ecafbae_微信": {
                            "TEXT": "微信",
                            "ID": "5437d093-37bb-4c50-a076-3fd9d1e2b022",
                            "VALUE": "微信"
                        },
                        "e95eb9d2-4ac1-4b9b-bc52-28198e93f6a7_01.00.00.01": {
                            "TEXT": "01.00.00.01",
                            "ID": "ce6df94a-bceb-4907-90ac-c6d171b3fdcc",
                            "VALUE": "01.00.00.01"
                        },
                        "84027e03-e6fa-4260-aa25-214882dcd903_低": {
                            "TEXT": "低",
                            "ID": "e073a517-ebcd-477c-aeaa-195ba9bd24d0",
                            "VALUE": "低"
                        },
                        "e95eb9d2-4ac1-4b9b-bc52-28198e93f6a7_01.00.00.00": {
                            "TEXT": "01.00.00.00",
                            "ID": "a83b6538-1db7-4ef2-aed3-6d66daff24ff",
                            "VALUE": "01.00.00.00"
                        },
                        "DevDemoDictionaryGroupBindRadio_Radio-Value-9": {
                            "TEXT": "Radio-Text-9",
                            "ID": "DevDemoDictionaryGroupBindRadio9",
                            "VALUE": "Radio-Value-9"
                        },
                        "e95eb9d2-4ac1-4b9b-bc52-28198e93f6a7_01.00.00.03": {
                            "TEXT": "01.00.00.03",
                            "ID": "d4359ae7-4dc8-43e1-b4c7-8cd69dbf8226",
                            "VALUE": "01.00.00.03"
                        },
                        "DevDemoDictionaryGroupBindRadio_Radio-Value-8": {
                            "TEXT": "Radio-Text-8",
                            "ID": "DevDemoDictionaryGroupBindRadio8",
                            "VALUE": "Radio-Value-8"
                        },
                        "cb1dc802-2ddf-4989-b757-90c81bc2d9cb_微信公众号": {
                            "TEXT": "微信公众号",
                            "ID": "086cfc2b-8ca6-438f-8e55-3d8973e38a74",
                            "VALUE": "微信公众号"
                        },
                        "e95eb9d2-4ac1-4b9b-bc52-28198e93f6a7_01.00.00.02": {
                            "TEXT": "01.00.00.02",
                            "ID": "4c48f075-21c6-4737-b40a-f71169a54d96",
                            "VALUE": "01.00.00.02"
                        },
                        "DevDemoDictionaryGroupBindSelect_Select-Value-8": {
                            "TEXT": "Select-Text-8",
                            "ID": "DevDemoDictionaryGroupBindSelect8",
                            "VALUE": "Select-Value-8"
                        },
                        "DevDemoDictionaryGroupBindSelect_Select-Value-9": {
                            "TEXT": "Select-Text-9",
                            "ID": "DevDemoDictionaryGroupBindSelect9",
                            "VALUE": "Select-Value-9"
                        },
                        "a9a7a4e4-298f-4a42-b369-6aa66ecafbae_电话": {
                            "TEXT": "电话",
                            "ID": "97488ccf-d6b9-4a09-ae6d-2946c4bf5543",
                            "VALUE": "电话"
                        },
                        "DevDemoDictionaryGroupBindRadio_Radio-Value-3": {
                            "TEXT": "Radio-Text-3",
                            "ID": "DevDemoDictionaryGroupBindRadio3",
                            "VALUE": "Radio-Value-3"
                        },
                        "DevDemoDictionaryGroupBindRadio_Radio-Value-2": {
                            "TEXT": "Radio-Text-2",
                            "ID": "DevDemoDictionaryGroupBindRadio2",
                            "VALUE": "Radio-Value-2"
                        },
                        "DevDemoDictionaryGroupBindRadio_Radio-Value-1": {
                            "TEXT": "Radio-Text-1",
                            "ID": "DevDemoDictionaryGroupBindRadio1",
                            "VALUE": "Radio-Value-1"
                        },
                        "cb1dc802-2ddf-4989-b757-90c81bc2d9cb_IOS": {
                            "TEXT": "IOS",
                            "ID": "a402bca5-0f6b-4c31-b02e-50309c5c8704",
                            "VALUE": "IOS"
                        },
                        "DevDemoDictionaryGroupBindRadio_Radio-Value-0": {
                            "TEXT": "Radio-Text-0",
                            "ID": "DevDemoDictionaryGroupBindRadio0",
                            "VALUE": "Radio-Value-0"
                        },
                        "DevDemoDictionaryGroupBindRadio_Radio-Value-7": {
                            "TEXT": "Radio-Text-7",
                            "ID": "DevDemoDictionaryGroupBindRadio7",
                            "VALUE": "Radio-Value-7"
                        },
                        "DevDemoDictionaryGroupBindRadio_Radio-Value-6": {
                            "TEXT": "Radio-Text-6",
                            "ID": "DevDemoDictionaryGroupBindRadio6",
                            "VALUE": "Radio-Value-6"
                        },
                        "DevDemoDictionaryGroupBindRadio_Radio-Value-5": {
                            "TEXT": "Radio-Text-5",
                            "ID": "DevDemoDictionaryGroupBindRadio5",
                            "VALUE": "Radio-Value-5"
                        },
                        "DevDemoDictionaryGroupBindRadio_Radio-Value-4": {
                            "TEXT": "Radio-Text-4",
                            "ID": "DevDemoDictionaryGroupBindRadio4",
                            "VALUE": "Radio-Value-4"
                        },
                        "aa902463-2fdb-402a-89d1-984713859ec0_低": {
                            "TEXT": "低",
                            "ID": "39098d90-e44e-4c91-a826-46b46b49f282",
                            "VALUE": "低"
                        },
                        "cb1dc802-2ddf-4989-b757-90c81bc2d9cb_安卓APP": {
                            "TEXT": "安卓APP",
                            "ID": "f9ce0f6b-50af-4b2d-b103-a55f4656b692",
                            "VALUE": "安卓APP"
                        },
                        "aa902463-2fdb-402a-89d1-984713859ec0_高": {
                            "TEXT": "高",
                            "ID": "2d77a938-3f96-4e96-9942-760a30e97a76",
                            "VALUE": "高"
                        },
                        "cd153d39-b37c-4cae-82a6-76747d5b8a9a_是": {
                            "TEXT": "是",
                            "ID": "bc8091b8-becb-4934-a3f2-dc43ade9b4b1",
                            "VALUE": "是"
                        },
                        "cd153d39-b37c-4cae-82a6-76747d5b8a9a_否": {
                            "TEXT": "否",
                            "ID": "0fe12b2f-1133-4cd5-b955-db5a13687795",
                            "VALUE": "否"
                        },
                        "cb1dc802-2ddf-4989-b757-90c81bc2d9cb_后台服务": {
                            "TEXT": "后台服务",
                            "ID": "b75d6066-d5a3-4bef-becc-60950bd78a40",
                            "VALUE": "后台服务"
                        },
                        "608a0a9a-14db-475a-a01f-463e9c01579d_需求变更": {
                            "TEXT": "需求变更",
                            "ID": "1e4c4cb1-25ad-48dc-b941-1551e992d1b6",
                            "VALUE": "需求变更"
                        },
                        "a9a7a4e4-298f-4a42-b369-6aa66ecafbae_QQ": {
                            "TEXT": "QQ",
                            "ID": "a0fd18fc-7137-4d01-ae77-481e1bed8731",
                            "VALUE": "QQ"
                        },
                        "84027e03-e6fa-4260-aa25-214882dcd903_中": {
                            "TEXT": "中",
                            "ID": "54002576-55f9-4198-9745-f5219ee9feb6",
                            "VALUE": "中"
                        },
                        "faeabb7e-4880-484b-8b40-3c09445e07e8_客户": {
                            "TEXT": "客户",
                            "ID": "4106ebf6-d25b-4ed6-8633-b246b2267e72",
                            "VALUE": "客户"
                        },
                        "bd465a40-a8ae-40bb-95c2-de6332e1ce9a_已关闭[生产环境]": {
                            "TEXT": "已关闭[生产环境]",
                            "ID": "bd744603-60ff-40fb-beed-071c44f03c1a",
                            "VALUE": "已关闭[生产环境]"
                        },
                        "faeabb7e-4880-484b-8b40-3c09445e07e8_项目组": {
                            "TEXT": "项目组",
                            "ID": "ef1f2391-22a9-4379-baa9-3de18a620eb2",
                            "VALUE": "项目组"
                        },
                        "aa902463-2fdb-402a-89d1-984713859ec0_中": {
                            "TEXT": "中",
                            "ID": "ae3e9d8c-e8f7-45df-9f90-86295a89a1e6",
                            "VALUE": "中"
                        },
                        "cb1dc802-2ddf-4989-b757-90c81bc2d9cb_Web网站": {
                            "TEXT": "Web网站",
                            "ID": "8cc3833d-6ee4-4f13-ab72-19f349889752",
                            "VALUE": "Web网站"
                        },
                        "49fdf1a9-683c-45d8-b284-ed3c29609519_开发中": {
                            "TEXT": "开发中",
                            "ID": "302a6172-39f3-431c-ac16-d4de7f44f460",
                            "VALUE": "开发中"
                        },
                        "608a0a9a-14db-475a-a01f-463e9c01579d_缺陷": {
                            "TEXT": "缺陷",
                            "ID": "3b01d166-c9d5-4012-bfa5-4dc8b9eb0d63",
                            "VALUE": "缺陷"
                        },
                        "bd465a40-a8ae-40bb-95c2-de6332e1ce9a_新建": {
                            "TEXT": "新建",
                            "ID": "0e31389c-336c-4172-97f1-d8d6a76eca5d",
                            "VALUE": "新建"
                        },
                        "608a0a9a-14db-475a-a01f-463e9c01579d_新需求": {
                            "TEXT": "新需求",
                            "ID": "0aca388b-2c98-4975-9fa6-8cbdc35e5b10",
                            "VALUE": "新需求"
                        },
                        "bd465a40-a8ae-40bb-95c2-de6332e1ce9a_已发布[测试环境]": {
                            "TEXT": "已发布[测试环境]",
                            "ID": "be346d2b-e9ef-4485-ab70-92d6d445f88b",
                            "VALUE": "已发布[测试环境]"
                        }
                    }, "exKVData": {}
                }
            }
        }, "exKVData": {}
    };
    mock.onPost(acInterface.loadHTML).reply(200, loadHTMLData);
    let getDataSetData = {
        "success": true, "message": "获取数据成功!", "cacheKey": "", "traceMsg": "", "errorCode": null, "data": {
            "total": 27,
            "list": [{
                "ISS_OPINION": "{\"opinions\":[{\"id\":\"595307484\",\"userId\":\"Zhuang_Rui_Bo_UID\",\"userName\":\"庄锐波\",\"organId\":\"10002\",\"organName\":\"开发组织\",\"inputOpinion\":\"好\",\"inputTime\":\"2021-11-11 09:48:32\",\"indexNum\":1,\"status\":\"general\",\"formClient\":\"webClient\"},{\"id\":\"595325911\",\"userId\":\"Yuang_Hong_Ling_UID\",\"userName\":\"袁红林\",\"organId\":\"10002\",\"organName\":\"开发组织\",\"inputOpinion\":\"好1\",\"inputTime\":\"2021-11-11 09:48:50\",\"indexNum\":2,\"status\":\"general\",\"formClient\":\"webClient\"}]}",
                "ISS_TITLE": "1",
                "ISS_ID": "103de612-d747-2d32-09f9-8fed60c09c20",
                "ISS_ORDER_NUM": 96
            }, {
                "ISS_OPINION": "{\"opinions\":[{\"id\":\"407279598\",\"userId\":\"Alex4D\",\"userName\":\"Alex\",\"organId\":\"10001\",\"organName\":\"系统管理组\",\"inputOpinion\":\"传递\",\"inputTime\":\"2021-11-20 19:21:49\",\"indexNum\":1,\"status\":\"general\",\"formClient\":\"webClient\"}]}",
                "ISS_TITLE": "传递传递传递传递传递传递传递传递传递传递传递传递传递传递传递传递传递传递传递传递传递传递传递传递传递传递传递传递传递",
                "ISS_ID": "1580e2f7-a6f6-790c-09c0-c52a6d46262a",
                "ISS_ORDER_NUM": 111
            }, {
                "ISS_OPINION": "{\"opinions\":[{\"id\":\"610499060\",\"userId\":\"Alex4D\",\"userName\":\"Alex\",\"organId\":\"10001\",\"organName\":\"系统管理组\",\"inputOpinion\":\"3123\",\"inputTime\":\"2021-10-07 20:41:43\",\"indexNum\":1,\"status\":\"general\",\"formClient\":\"webClient\"}]}",
                "ISS_TITLE": "13",
                "ISS_ID": "215adfc8-ae46-1e55-1b35-974a76870597",
                "ISS_ORDER_NUM": 26
            }, {
                "ISS_OPINION": "{\"opinions\":[{\"id\":\"825450173\",\"userId\":\"Alex4D\",\"userName\":\"Alex\",\"organId\":\"10001\",\"organName\":\"系统管理组\",\"inputOpinion\":\"333\",\"inputTime\":\"2021-10-21 22:10:55\",\"indexNum\":1,\"status\":\"general\",\"formClient\":\"webClient\"}]}",
                "ISS_TITLE": "123",
                "ISS_ID": "28112c13-e1ca-2123-e55f-af5a0e784a8f",
                "ISS_ORDER_NUM": 51
            }, {
                "ISS_OPINION": "{\"opinions\":[]}",
                "ISS_TITLE": "3",
                "ISS_ID": "2824fb2c-345e-1038-26d0-576cc248d34f",
                "ISS_ORDER_NUM": 81
            }, {
                "ISS_OPINION": "{\"opinions\":[{\"id\":\"924989472\",\"userId\":\"Alex4D\",\"userName\":\"Alex\",\"organId\":\"10001\",\"organName\":\"系统管理组\",\"inputOpinion\":\"123\",\"inputTime\":\"2021-09-29 22:16:33\",\"indexNum\":1,\"status\":\"general\",\"formClient\":\"webClient\"}]}",
                "ISS_TITLE": "123",
                "ISS_ID": "30bd5079-1c00-2f24-ce89-1b08767759dc",
                "ISS_ORDER_NUM": 6
            }, {
                "ISS_OPINION": "{\"opinions\":[]}",
                "ISS_TITLE": "1",
                "ISS_ID": "426e1544-4200-e967-f73c-0d16a2c05159",
                "ISS_ORDER_NUM": 66
            }, {
                "ISS_OPINION": "{\"opinions\":[{\"id\":\"925238056\",\"userId\":\"Alex4D\",\"userName\":\"Alex\",\"organId\":\"10001\",\"organName\":\"系统管理组\",\"inputOpinion\":\"123123\",\"inputTime\":\"2021-09-29 22:20:41\",\"indexNum\":1,\"status\":\"general\",\"formClient\":\"webClient\"}]}",
                "ISS_TITLE": "12313",
                "ISS_ID": "467038a7-6782-083c-3ac1-73fee1c4a197",
                "ISS_ORDER_NUM": 16
            }, {
                "ISS_OPINION": "{\"opinions\":[{\"id\":\"668675333\",\"userId\":\"Alex4D\",\"userName\":\"Alex\",\"organId\":\"10001\",\"organName\":\"系统管理组\",\"inputOpinion\":\"对对对\",\"inputTime\":\"2021-10-08 12:51:25\",\"indexNum\":1,\"status\":\"general\",\"formClient\":\"webClient\"}]}",
                "ISS_TITLE": "123",
                "ISS_ID": "4a21601a-f145-8d95-089d-8ff1addff06c",
                "ISS_ORDER_NUM": 41
            }, {
                "ISS_OPINION": "{\"opinions\":[{\"id\":\"241613344\",\"userId\":\"Alex4D\",\"userName\":\"Alex\",\"organId\":\"10001\",\"organName\":\"系统管理组\",\"inputOpinion\":\"1\",\"inputTime\":\"2021-11-18 21:20:25\",\"indexNum\":1,\"status\":\"general\",\"formClient\":\"webClient\"}]}",
                "ISS_TITLE": "测试1",
                "ISS_ID": "527fffdc-b2dc-eec7-3eb9-dfff6f3bff70",
                "ISS_ORDER_NUM": 101
            }, {
                "ISS_OPINION": "{\"opinions\":[]}",
                "ISS_TITLE": "5",
                "ISS_ID": "53275c3e-7a62-6833-f76b-f43190fd0f29",
                "ISS_ORDER_NUM": 91
            }, {
                "ISS_OPINION": "{\"opinions\":[{\"id\":\"502936659\",\"userId\":\"Alex4D\",\"userName\":\"Alex\",\"organId\":\"10001\",\"organName\":\"系统管理组\",\"inputOpinion\":\"1\",\"inputTime\":\"2021-11-21 21:55:43\",\"indexNum\":1,\"status\":\"general\",\"formClient\":\"webClient\"}]}",
                "ISS_TITLE": "请示",
                "ISS_ID": "5f244eb8-cc2e-1806-47c8-baa3a6818ada",
                "ISS_ORDER_NUM": 116
            }, {
                "ISS_OPINION": "{\"opinions\":[]}",
                "ISS_TITLE": "1",
                "ISS_ID": "60f039dd-3d13-fb72-dc40-c371fd42e75c",
                "ISS_ORDER_NUM": 71
            }, {
                "ISS_OPINION": "{\"opinions\":[{\"id\":\"773426917\",\"userId\":\"Alex4D\",\"userName\":\"Alex\",\"organId\":\"10001\",\"organName\":\"系统管理组\",\"inputOpinion\":\"3\",\"inputTime\":\"2021-10-09 17:57:10\",\"indexNum\":1,\"status\":\"general\",\"formClient\":\"webClient\"}]}",
                "ISS_TITLE": "3",
                "ISS_ID": "6fb9c06e-f556-9335-2fa0-4dc5a27ed987",
                "ISS_ORDER_NUM": 46
            }, {
                "ISS_OPINION": "{\"opinions\":[]}",
                "ISS_TITLE": "4",
                "ISS_ID": "759c5d41-f86e-50e3-530c-4b65cd1d3270",
                "ISS_ORDER_NUM": 86
            }, {
                "ISS_OPINION": "{\"opinions\":[{\"id\":\"615953644\",\"userId\":\"Alex4D\",\"userName\":\"Alex\",\"organId\":\"10001\",\"organName\":\"系统管理组\",\"inputOpinion\":\"123123\",\"inputTime\":\"2021-10-07 22:12:38\",\"indexNum\":1,\"status\":\"general\",\"formClient\":\"webClient\"}]}",
                "ISS_TITLE": "123",
                "ISS_ID": "7dc03181-ca7c-36e9-faa6-8c83f81e3b06",
                "ISS_ORDER_NUM": 31
            }, {
                "ISS_OPINION": "{\"opinions\":[{\"id\":\"924040485\",\"userId\":\"Alex4D\",\"userName\":\"Alex\",\"organId\":\"10001\",\"organName\":\"系统管理组\",\"inputOpinion\":\"123\",\"inputTime\":\"2021-09-29 22:00:45\",\"indexNum\":1,\"status\":\"general\",\"formClient\":\"webClient\"}]}",
                "ISS_TITLE": "1",
                "ISS_ID": "9ea0fb8e-458d-c4c8-1043-f6d3f8787331",
                "ISS_ORDER_NUM": 1
            }, {
                "ISS_OPINION": "{\"opinions\":[{\"id\":\"506995790\",\"userId\":\"Alex4D\",\"userName\":\"Alex\",\"organId\":\"10001\",\"organName\":\"系统管理组\",\"inputOpinion\":\"请\",\"inputTime\":\"2021-11-21 23:03:23\",\"indexNum\":1,\"status\":\"general\",\"formClient\":\"webClient\"}]}",
                "ISS_TITLE": "到期",
                "ISS_ID": "9f1b391b-3897-2237-fe9e-8f3226b3e94f",
                "ISS_ORDER_NUM": 126
            }, {
                "ISS_OPINION": "{\"opinions\":[{\"id\":\"925822020\",\"userId\":\"Alex4D\",\"userName\":\"Alex\",\"organId\":\"10001\",\"organName\":\"系统管理组\",\"inputOpinion\":\"123\",\"inputTime\":\"2021-09-29 22:30:26\",\"indexNum\":1,\"status\":\"general\",\"formClient\":\"webClient\"}]}",
                "ISS_TITLE": "123123",
                "ISS_ID": "b7783f9a-ea10-98d5-c4e9-2cf4a9bf2cf1",
                "ISS_ORDER_NUM": 21
            }, {
                "ISS_OPINION": "{\"opinions\":[{\"id\":\"536957754\",\"userId\":\"Yuang_Hong_Ling_UID\",\"userName\":\"袁红林\",\"organId\":\"10002\",\"organName\":\"开发组织\",\"inputOpinion\":\"好\",\"inputTime\":\"2021-11-10 17:36:05\",\"indexNum\":1,\"status\":\"general\",\"formClient\":\"webClient\"},{\"id\":\"537016858\",\"userId\":\"Zhuang_Rui_Bo_UID\",\"userName\":\"庄锐波\",\"organId\":\"10002\",\"organName\":\"开发组织\",\"inputOpinion\":\"好1\",\"inputTime\":\"2021-11-10 17:37:05\",\"indexNum\":2,\"status\":\"general\",\"formClient\":\"webClient\"}]}",
                "ISS_TITLE": "并行",
                "ISS_ID": "c1f1d071-5236-2d0a-51e0-99418ac4cb48",
                "ISS_ORDER_NUM": 61
            }],
            "pageNum": 1,
            "pageSize": 20,
            "size": 20,
            "startRow": 1,
            "endRow": 20,
            "pages": 2,
            "prePage": 0,
            "nextPage": 2,
            "isFirstPage": true,
            "isLastPage": false,
            "hasPreviousPage": false,
            "hasNextPage": true,
            "navigatePages": 8,
            "navigatepageNums": [1, 2],
            "navigateFirstPage": 1,
            "navigateLastPage": 2,
            "lastPage": 2,
            "firstPage": 1
        }, "exKVData": {}
    };
    mock.onPost(acInterface.getDataSetData).reply(200, getDataSetData);
}

export {RemoteRestInterface as default};