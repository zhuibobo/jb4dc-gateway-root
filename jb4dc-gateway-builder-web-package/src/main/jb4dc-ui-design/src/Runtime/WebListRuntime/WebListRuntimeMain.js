import WebListRuntime from './WebListRuntime.js';
import RuntimeGeneralInstance from '../RuntimeGeneralInstance.js';
import "../../Less/UIRuntimeMain.less";

let WebListRuntimeInst = Object.create(WebListRuntime);
let listId = RuntimeGeneralInstance.TryGetMenuOuterId();
WebListRuntimeInst.Initialization({
    RendererToId: "htmlDesignRuntimeWrap",
    ListId: listId
})