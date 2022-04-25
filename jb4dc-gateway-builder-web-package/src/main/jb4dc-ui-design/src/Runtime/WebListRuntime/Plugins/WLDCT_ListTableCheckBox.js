import HTMLControl from '../../HTMLControl.js'

let WLDCT_ListTableCheckBox={
    RendererChain: HTMLControl.RendererChain,
    RendererDataChain:function (_rendererDataChainParas) {
        /*{
            $templateTable:$templateTable,
            $templateTableRow:$templateTableRow,
            dataSet:dataSet,
            rowData:rowData,
            $cloneRow:$cloneRow,
            $td:$td,
            val:val
        }*/
        let value = _rendererDataChainParas.val;
        let $td = _rendererDataChainParas.$td;
        $td.css("textAlign", "center");
        let $checkbox = $("<input isrow_checkbox=\"true\" type=\"checkbox\" class=\"list-checkbox-c\" value=\"" + value + "\" row_checkbox_record_id=\"" + value + "\">");
        $checkbox.bind("click", {"selfInstance": this, "$elem": $checkbox}, this.ClickEvent);
        $td.html("");
        $td.append($checkbox);
    },
    ClickEvent:function (sender) {
        /*let $elem=sender.data.$elem;
        let $WLDCT_ListTableContainer = $elem.parents("[singlename='WLDCT_ListTableContainer']");
        let listTableContainerInstance = HTMLControl.GetControlInstanceByElem($WLDCT_ListTableContainer);*/
        let $elem=sender.data.$elem;
        let listTableContainerInstance=WLDCT_ListTableContainer.__InnerElemGetInstance($elem);
        if($elem.prop("checked")){
            listTableContainerInstance.SaveCheckedRowData($elem.val());
        }
        else{
            listTableContainerInstance.DeleteCheckedRowData($elem.val());
        }
        //alert("1");
    }
}

export {WLDCT_ListTableCheckBox as default};