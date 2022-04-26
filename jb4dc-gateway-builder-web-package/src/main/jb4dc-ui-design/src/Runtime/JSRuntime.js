
let JSRuntime={
    ConvertJsContentToObject(host,jsContent){
        //debugger
        eval("let runtimeJsInstance")
        jsContent=jsContent.replace("var PageRuntimeExtend = ","");
        let obj=eval("("+jsContent+")");
        return obj;
    }
}

export {JSRuntime as default};