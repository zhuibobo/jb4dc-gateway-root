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
    }
}

export { MonacoEditorUtility as default};