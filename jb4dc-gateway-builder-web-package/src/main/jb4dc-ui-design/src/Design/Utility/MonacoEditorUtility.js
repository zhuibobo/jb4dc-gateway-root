let MonacoEditorUtility = {
    setValue(monacoEditorInstance, value) {
        monacoEditorInstance.getModel().setValue(value);

        window.setTimeout(() => {
            monacoEditorInstance.getAction(['editor.action.formatDocument'])._run();
        }, 200);
    },
    getValue(monacoEditorInstance) {
        return monacoEditorInstance.getModel().getValue();
    },
    autoSelectionFirstMatchText(monacoEditorInstance, text) {
        console.log(text);
        let matches = monacoEditorInstance.getModel().findMatches(text);
        console.log(matches);
        if (matches) {
            let match = matches[0];
            monacoEditorInstance.setSelection(match.range)
            //把选中的位置放到中间显示
            monacoEditorInstance.revealRangeInCenter(match.range)
        }
    },
    getWebAppListCssCodeDefaultContent() {
        return ``;
    },
    getWebAppListJsCodeDefaultContent() {
        return `let PageRuntimeExtend = {
    data: {
        listPO: null,
        dataSetPO:null,
        formButtons:[],
        userPO:null,
        runtimeRootHostInstance:null
    },
    pageReady: function () {
        //console.log("页面加载html完成,未进行客户端控件的渲染");
    },
    searchBefore:function(type,condition){
        
    },
    pageChangeBefore:function(pageNum,pageSize,pageCount){
        
    },
    everyControlRendererChainEnd:function(_rendererChainParas){
        //console.log("everyControlRendererChainEnd");
    },
    everyControlRendererDataChainEnd:function(_rendererDataChainParas){
        //console.log("everyControlRendererDataChainEnd");
    },
    rendererChainCompleted: function () {
        //console.log("客户端控件渲染完成");
    },
    rendererDataChainCompleted: function () {
        //console.log("客户端控件渲染并绑定完数据");
    }
}`;
    },
    getWebAppFormCssCodeDefaultContent() {
        return ``;
    },
    getWebAppFormJsCodeDefaultContent(){
        return `let PageRuntimeExtend = {
    data: {
        formPO: null,
        formRecordComplexPO:null,
        webFormRTParas:null,
        innerFormButtons:[],
        userPO:null,
        runtimeRootHostInstance:null
    },
    pageReady: function () {
        //console.log("页面加载html完成,未进行客户端控件的渲染");
    },
    everyControlRendererChainEnd:function(_rendererChainParas){
        //console.log("everyControlRendererChainEnd");
    },
    everyControlRendererDataChainEnd:function(_rendererDataChainParas){
        //console.log("everyControlRendererDataChainEnd");
    },
    rendererChainCompleted: function () {
        //console.log("客户端控件渲染完成");
    },
    rendererDataChainCompleted: function () {
        //console.log("客户端控件渲染并绑定完数据");
    },
    validateEveryFromControl: function (validateResult) {
        //console.log("验证控件输入值");
        return validateResult;
    }
}`;
    }
}

export {MonacoEditorUtility as default};