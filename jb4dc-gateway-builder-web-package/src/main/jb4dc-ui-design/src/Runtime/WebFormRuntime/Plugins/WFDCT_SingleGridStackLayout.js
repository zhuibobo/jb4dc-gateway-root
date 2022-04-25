import HTMLControl from '../../HTMLControl.js'
import GeneralPlugin from "../../../Design/Plugins/GeneralPlugin";

var WFDCT_SingleGridStackLayout={
    InitStyle:HTMLControl.InitStyle,
    RendererChain:function (_rendererChainParas) {
        window.setTimeout(()=>{
            var $singleControlElem = _rendererChainParas.$singleControlElem;
            let grid = GridStack.init({
                minRow: 1, // don't let it collapse when empty
                cellHeight: '21px',
                margin: 0,
                acceptWidgets: '.drag-to-grid',
                float: true,
                column: 32,
                disableDrag:true,
                disableResize:true
            }, $singleControlElem[0]);
        },1000);

        HTMLControl.RendererChain(_rendererChainParas);
    },
    RendererDataChain:function (_rendererChainParas) {

    },
    GetValue:HTMLControl.GetValue,
    SetValue:HTMLControl.SetValue,
    ToViewStatus:HTMLControl.ToViewStatus,
    TryBindUrlValue:HTMLControl.TryBindUrlValue
}

export {WFDCT_SingleGridStackLayout as default};