import HTMLControl from '../../HTMLControl.js'
import HTMLControlAttrs from '../../HTMLControlAttrs.js'
import RuntimeGeneralInstance from '../../RuntimeGeneralInstance.js'

let WLDCT_ListButtonContainer= {
    _objectType:"Instance",//Static;
    _prop:{
        $singleControlElem:null,
        instanceName:null,
        elemId:null,
        status:null
    },
    RendererChain: function (_rendererChainParas) {
        //$singleControlElem.hide();
        //debugger;
        let $singleControlElem=_rendererChainParas.$singleControlElem;
        let $buttonDivElemList=$singleControlElem.find("div"+HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);
        $singleControlElem.find("[is-op-button-wrap-table='true']").hide();
        let innerWrap= $singleControlElem.find(".uid-container-inner-wrap");
        let innerInsideWrapDiv=$("<div class='uid-wldct-list-button-inner-inside-wrap' />");
        for(let i=0;i<$buttonDivElemList.length;i++){
            let $buttonElem=$($buttonDivElemList[i]);
            let clientResolveName=$buttonElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
            //debugger;
            let clientResolveObject=Object.create(eval(clientResolveName));
            let $resolvedElem=clientResolveObject.ResolveSelf({
                sourceHTML:_rendererChainParas.sourceHTML,
                $rootElem:_rendererChainParas.$rootElem,
                $parentControlElem:$singleControlElem,
                $singleControlElem:$buttonElem,
                allData:_rendererChainParas.allData
            });
            innerInsideWrapDiv.append($resolvedElem);
        }
        innerWrap.append(innerInsideWrapDiv);
        innerWrap.append("<div style=\"clear: both;\"></div>");
        //console.log(this._prop.status);

        if(this._prop.status=="disable"||RuntimeGeneralInstance.TryGetUrlParaViewOnly()){
            $singleControlElem.hide();
        }
    },
    RendererDataChain:HTMLControl.RendererDataChain
}

export {WLDCT_ListButtonContainer as default};