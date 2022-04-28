let StorageUtility={
    testGetPropertyIsNull(propertyName){
        if(this[propertyName]){
            return true;
        }
        console.error("StorageUtility.testGetPropertyIsNull["+propertyName+"] is Null");
        //throw "StorageUtility.testGetPropertyIsNull["+propertyName+"] is Null";
    },

    _uiDesignType:null,
    setUIDesignType(uiDesignType){
        this._uiDesignType=uiDesignType;
    },
    getUIDesignType(){
        this.testGetPropertyIsNull("_uiDesignType");
        return this._uiDesignType;
    },

    _formDataRelationConfig:null,
    setFormDataRelationConfig(formDataRelationConfig){
        this._formDataRelationConfig=formDataRelationConfig;
    },
    getFormDataRelationConfig(){
        this.testGetPropertyIsNull("_formDataRelationConfig");
        return this._formDataRelationConfig;
    },
    getFormDataRelationConfigMainTableId(){
        this.testGetPropertyIsNull("_formDataRelationConfig");
        if(this._formDataRelationConfig!=null) {
            if (this._formDataRelationConfig.length == 1) {
                return this._formDataRelationConfig[0].tableId;
            } else {
                for (let i = 0; i < this._formDataRelationConfig.length; i++) {
                    if (this._formDataRelationConfig[i].parentId == "-1") {
                        return this._formDataRelationConfig.tableId;
                    }
                }
                console.error("StorageUtility.getFormDataRelationConfigMainTableId 找不到主表ID");
            }
        }
        return null;
    }
}
export { StorageUtility as default};