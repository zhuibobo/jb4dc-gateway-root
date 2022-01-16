let MonacoEditorUtility={
    setValue(monacoEditorInstance,value){
        monacoEditorInstance.getModel().setValue(value);
        monacoEditorInstance.getAction(['editor.action.formatDocument'])._run();
    },
    getValue(monacoEditorInstance){
        return monacoEditorInstance.getModel().getValue();
    },
    autoSelectionFirstMatchText(monacoEditorInstance,text){
        console.log(text);
        let matches=monacoEditorInstance.getModel().findMatches(text);
        console.log(matches);
        if(matches){
            let match=matches[0];
            monacoEditorInstance.setSelection(match.range)
            //把选中的位置放到中间显示
            monacoEditorInstance.revealRangeInCenter(match.range)
        }
    },
    getWebAppListJsCodeDefaultContent(){
        return `var BuilderListPageRuntimeInstance = {
    data: {
        listPO: null
    },
    pageReady: function () {
        //页面加载html完成,未进行客户端控件的渲染
        console.log("页面加载html完成");
    },
    rendererChainCompleted: function () {
        //客户端控件渲染完成.
        console.log("客户端控件渲染完成");
    },
    rendererDataChainCompleted: function () {
        //客户端控件渲染并绑定完数据.
        console.log("客户端控件渲染并绑定完数据");
    }
}`;
    }
}

export { MonacoEditorUtility as default};