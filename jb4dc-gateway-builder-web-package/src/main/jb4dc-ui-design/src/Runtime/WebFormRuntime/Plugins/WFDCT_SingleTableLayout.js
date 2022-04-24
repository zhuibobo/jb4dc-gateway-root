import HTMLControl from '../../HTMLControl.js'

var WFDCT_SingleTableLayout={
    InitStyle:HTMLControl.InitStyle,
    RendererChain:function (_rendererChainParas) {
        HTMLControl.RendererChain(_rendererChainParas);
    },
    RendererDataChain:HTMLControl.RendererDataChain,
    GetValue:HTMLControl.GetValue,
    SetValue:HTMLControl.SetValue,
    ToViewStatus:HTMLControl.ToViewStatus,
    TryBindUrlValue:HTMLControl.TryBindUrlValue
}

export {WFDCT_SingleTableLayout as default};