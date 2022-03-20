import ListRuntime from './ListRuntime.js';
import RuntimeGeneralInstance from '../RuntimeGeneralInstance.js';

let ListRuntimeInst = Object.create(ListRuntime);
let listId = RuntimeGeneralInstance.TryGetMenuOuterId();
ListRuntimeInst.Initialization({
    RendererToId: "htmlDesignRuntimeWrap",
    ListId: listId
})