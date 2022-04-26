import HTMLControl from '../../HTMLControl.js'
import HTMLControlAttrs from '../../HTMLControlAttrs.js'

let WLDCT_ListSimpleSearchContainer={
    _objectType:"Instance",//Static;
    _prop:{
        $singleControlElem:null,
        instanceName:null,
        elemId:null,
        status:null
    },
    _$SimpleSearchButton:null,
    _$ShowComplexSearchButton:null,
    _$SingleControlElem:null,
    RendererChain:function (_rendererChainParas) {
        let $singleControlElem = _rendererChainParas.$singleControlElem;
        this._$SingleControlElem = $singleControlElem;

        this._$SingleControlElem.css({"display": "flex"});

        //let pageWidth = this.TryGetOuterWidth($singleControlElem);

        //let buttonWrapWidth = 220;

        //console.log(pageWidth - buttonWrapWidth);

        //$singleControlElem.find("table:first").width(pageWidth - buttonWrapWidth);

        $singleControlElem.find(".uid-container-inner-wrap").css({"flex-grow": "2"});
        //$singleControlElem.find("table:first").css({"flex-grow": "2"});

        // HTMLControl.SaveControlNewInstanceToPool($singleControlElem,this);

        let $searchButtonsWrap = $("<div class='wldct-list-simple-search-button-inner-wrap' style='flex-basis: 200px;' />");
        //$searchButtonsWrap.width(buttonWrapWidth - 40);

        this._$searchButtonsWrap=$searchButtonsWrap;
        this._$SimpleSearchButton = $("<button>查询</button>");
        this._$ShowComplexSearchButton = $("<button>高级查询</button>");

        $searchButtonsWrap.append(this._$SimpleSearchButton);
        $searchButtonsWrap.append(this._$ShowComplexSearchButton);

        $singleControlElem.append($searchButtonsWrap);


        HTMLControl.RendererChain(_rendererChainParas);
    },
    RendererDataChain:HTMLControl.RendererDataChain,
    BuilderSearchCondition:function () {
        let result=[];
        /*String operator;
        String value;
        String tableName;1
        String fieldName;*/
        let allControls=this._$SingleControlElem.find(HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);
        let hidControls=this._$SingleControlElem.parent().find("[singlename='WLDCT_HideContainer']").find("[columnname][columnoperator]");
        //console.log(hidControls);
        $.merge(allControls,hidControls);
        for(let i=0;i<allControls.length;i++){
            let $elem=$(allControls[i]);
            let instance=HTMLControl.GetControlInstanceByElem($elem);
            let valObj=instance.GetValue($elem,{});
            let value=valObj.value;
            if(value) {
                value=StringUtility.Trim(value);
                if(value) {
                    result.push({
                        operator: $elem.attr("columnoperator"),
                        value: value,
                        tableName: $elem.attr("columntablename"),
                        fieldName: $elem.attr("columnname")
                    })
                }
            }
            //console.log(valObj);
        }

        return result;
    },
    GetStatus:function () {
        let status = this._$SingleControlElem.attr("status");
        if(status=="") {
            status = "enable";
        }
        return status
    },
    Hide:function () {
        this._$SingleControlElem.hide();
    },
    HideComplexButton:function () {
        this._$ShowComplexSearchButton.remove();
        this._$searchButtonsWrap.css({"flex-basis": "90px"})
        //this._$SimpleSearchButton.parent().width("80px");
        //let pageWidth = PageStyleUtility.GetPageWidth();
        //this._$SingleControlElem.find("table:first").width(pageWidth-140);
    }
}

export {WLDCT_ListSimpleSearchContainer as default};