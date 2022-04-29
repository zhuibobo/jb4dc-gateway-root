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

    //_formDataRelationConfig:null,
    _formDataRelationObj:{
        mainTableId: null,
        mainTableName: null,
        mainTableCaption: null,
        relationData: null
    },
    setFormDataRelationConfig(formDataRelationConfig){
        this._formDataRelationObj.relationData=formDataRelationConfig;
        console.log(formDataRelationConfig);
        if(formDataRelationConfig!=null) {
            if (formDataRelationConfig.length == 1) {
                this._formDataRelationObj.mainTableId=formDataRelationConfig[0].tableId;
                this._formDataRelationObj.mainTableName=formDataRelationConfig[0].tableName;
                this._formDataRelationObj.mainTableCaption=formDataRelationConfig[0].tableCaption;
            } else {
                for (let i = 0; i < formDataRelationConfig.length; i++) {
                    if (formDataRelationConfig[i].parentId == "-1") {
                        this._formDataRelationObj.mainTableId=formDataRelationConfig.tableId;
                        this._formDataRelationObj.mainTableName=formDataRelationConfig[0].tableName;
                        this._formDataRelationObj.mainTableCaption=formDataRelationConfig[0].tableCaption;
                    }
                }
                console.error("StorageUtility.getFormDataRelationConfigMainTableId 找不到主表ID");
            }
        }
    },
    getFormDataRelationObj(){
        return this._formDataRelationObj;
    },
    getFormDataRelationConfig(){
        return this._formDataRelationObj.relationData;
    },
    getFormDataRelationMainTableId(){
        return this._formDataRelationObj.mainTableId;
    }
}
export { StorageUtility as default};