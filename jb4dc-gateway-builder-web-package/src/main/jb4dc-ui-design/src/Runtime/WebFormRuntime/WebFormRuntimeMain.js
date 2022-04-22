import WebFormRuntime from './WebFormRuntime.js';
import RuntimeGeneralInstance from '../RuntimeGeneralInstance.js';
import "../../Less/UIRuntimeMain.less";

let WebFormRuntimeInst = Object.create(WebFormRuntime);

WebFormRuntimeInst.Initialization({
    RendererToId: "htmlDesignRuntimeWrap"
})