import HTMLControl from '../../HTMLControl.js'

var WLDCT_Search_TextBox= {
    RendererChain: HTMLControl.RendererChain,
    RendererDataChain:HTMLControl.RendererDataChain,
    GetValue:HTMLControl.GetValue,
    TryBindUrlValue:HTMLControl.TryBindUrlValue
}

export {WLDCT_Search_TextBox as default};