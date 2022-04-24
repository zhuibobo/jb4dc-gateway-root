import HTMLControl from '../../HTMLControl.js'

var WFDCT_SingleTableLayout={
    InitStyle:HTMLControl.InitStyle,
    RendererChain:function (_rendererChainParas) {
    },
    RendererDataChain:function () {
    },
    GetValue:HTMLControl.GetValue,
    SetValue:HTMLControl.SetValue,
    ToViewStatus:HTMLControl.ToViewStatus,
    TryBindUrlValue:HTMLControl.TryBindUrlValue
}

export {WFDCT_SingleTableLayout as default};