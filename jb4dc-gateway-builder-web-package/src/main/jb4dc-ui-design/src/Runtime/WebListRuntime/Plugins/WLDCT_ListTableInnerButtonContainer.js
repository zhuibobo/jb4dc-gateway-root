import HTMLControl from '../../HTMLControl.js'
import HTMLControlAttrs from '../../HTMLControlAttrs.js'

var WLDCT_ListTableInnerButtonContainer= {
    RendererChain:function (_rendererChainParas){
        //debugger;
        var $singleControlElem=_rendererChainParas.$singleControlElem;
        var $divCTElem = $singleControlElem.find("div" + HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);
        $singleControlElem.html("");
        $singleControlElem.append($divCTElem);
    },
    RendererDataChain:HTMLControl.RendererDataChain
}

export {WLDCT_ListTableInnerButtonContainer as default};