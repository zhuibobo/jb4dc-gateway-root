let UIDesignUtility={
    buildEditorValues(htmlValue,jsValue,cssValue,designDescriptionValue,exDataSetValue,exParametersValue){
        let values={
            htmlValue:htmlValue,
            jsValue:jsValue,
            cssValue:cssValue,
            designDescriptionValue:designDescriptionValue,
            exDataSetValue:exDataSetValue,
            exParametersValue:exParametersValue
        }
        return values;
    }
}

export { UIDesignUtility as default};