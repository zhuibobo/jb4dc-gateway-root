import HTMLControl from '../../HTMLControl.js'

let WLDCT_ListTableLabel= {
    _objectType:"Static",//Instance;
    _propMap:{},
    _prop:{
        $singleControlElem:null,
        instanceName:null,
        elemId:null,
        columnAlign:null,
        defFormat:null,
        targetButtonId:null,
        dictionaryGroupDataSourceId:null,
        omitLength:null
    },
    RendererChain: HTMLControl.RendererChain,
    RendererDataChain:function (_rendererDataChainParas) {
        let $singleControlElem=_rendererDataChainParas.$singleControlElem;
        let value=_rendererDataChainParas.val;
        let elemId=$singleControlElem.attr("id");
        let _prop=this._prop;
        _prop._ListRuntimeInstance=_rendererDataChainParas.listRuntimeInstance;
        let $td=_rendererDataChainParas.$td;
        if(_prop.columnAlign=="居中对齐") {
            $td.css("textAlign", "center");
        }
        else if(_prop.columnAlign=="左对齐"){
            $td.css("textAlign", "left");
        }

        if(_prop.defFormat=="yyyy-MM-dd"){
            if(value) {
                let ctDate = DateUtility.ConvertFromString(value);
                //console.log(fieldPO);
                value = DateUtility.Format(ctDate, _prop.defFormat);
            }
        }
        else if(_prop.defFormat=="convertOrganIdToOrganName"){
            if(StringUtility.IsNotNullOrEmpty(value)){
                let organData=_rendererDataChainParas.listRuntimeInstance._ListPO.exData.minOrganData[value];
                if(organData!=null&&organData!=undefined){
                    let organName=organData.organName;
                    value=organName;
                }
            }
        }
        else if(_prop.defFormat=="convertDDValueToDDText"){
            if(StringUtility.IsNotNullOrEmpty(value)&&_prop.dictionaryGroupDataSourceId){
                let key=_prop.dictionaryGroupDataSourceId+"_"+value;
                value=_rendererDataChainParas.listRuntimeInstance._ListPO.exData.minDictionaryData[key].TEXT;
                //console.log("绑定字典ID"+_prop.dictionaryGroupDataSourceId);
            }
        }
        if(_prop.targetButtonId) {
            $td.addClass("list-td-click-enable");
            $td.bind("click", {"prop": _prop,rowData:_rendererDataChainParas.rowData}, this.ClickEvent);
        }
        if(_prop.omitLength&&value){
            let intOmitLength=parseInt(_prop.omitLength);
            if(intOmitLength>0&&value.length>intOmitLength){
                value=value.substring(0,intOmitLength)+"...";
            }
        }
        //console.log(_prop.omitLength);
        $td.html(value);
    },
    ClickEvent:function (sender) {

        let _prop =sender.data.prop;
        let rowData = sender.data.rowData;
        let targetbuttonid = _prop.targetButtonId;

        let $listTableContainer=$(this).parentsUntil("[singlename='WLDCT_ListTableContainer']").last().parent();
        let listTableContainerInstance = HTMLControl.GetControlInstanceByElem($listTableContainer);
        //取消所有的选择.
        listTableContainerInstance.ClearAllCheckBox();
        //选中当前cb,
        let primaryKey=_prop._ListRuntimeInstance.GetPrimaryKey();
        listTableContainerInstance.SetCheckBoxToCheckedStatus(rowData[primaryKey]);
        //触发按钮
        console.log(targetbuttonid);
        $("button#" + targetbuttonid).trigger("click");
        console.log(listTableContainerInstance);
    }
}

export {WLDCT_ListTableLabel as default};