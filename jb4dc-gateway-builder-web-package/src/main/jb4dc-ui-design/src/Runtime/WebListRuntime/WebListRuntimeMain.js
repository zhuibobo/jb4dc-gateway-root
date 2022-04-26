import WebListRuntime from './WebListRuntime.js';
import RuntimeGeneralInstance from '../RuntimeGeneralInstance.js';
import "../../Less/UIRuntimeMain.less";
import RemoteRestInterface from '../Remote/RemoteRestInterface.js';

RemoteRestInterface.getUserPO({}).then((response)=> {
    let userPO = response.data.data;

    let WebListRuntimeInstanceObj = Object.create(WebListRuntime);
    let listId = RuntimeGeneralInstance.TryGetMenuOuterId();
    WebListRuntimeInstanceObj.Initialization({
        RendererToId: "htmlDesignRuntimeWrap",
        ListId: listId,
        WebListRuntimeInstanceName: "WebListRuntimeInstanceObj",
        userPO: userPO
    })

    /*let WebListRuntimeInstanceObj1 = Object.create(WebListRuntime);
    WebListRuntimeInstanceObj1.Initialization({
        RendererToId: "htmlDesignRuntimeWrap1",
        ListId: listId,
        WebListRuntimeInstanceName: "WebListRuntimeInstanceObj1",
        userPO: userPO
    })*/
})
