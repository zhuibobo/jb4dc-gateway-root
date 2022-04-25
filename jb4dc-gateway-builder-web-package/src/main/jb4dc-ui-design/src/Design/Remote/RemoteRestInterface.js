import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import controlPluginsConfig from '../Config/ControlPlugins.json';

import mockGetTablesDataResult from '../MockData/mockGetTablesDataResult.json';
import mockGetTableFieldsResult from '../MockData/mockGetTableFieldsResult.json';
import mockGetTablesFieldsByTableIdsResult from '../MockData/mockGetTablesFieldsByTableIdsResult.json';
import mockGetEnvVariableGroupTreeDataResult from '../MockData/mockGetEnvVariableGroupTreeDataResult.json';
import mockGetEnvVariableListDataResult from '../MockData/mockGetEnvVariableListDataResult.json';
import mockGetDataSetsForZTreeNodeListResult from '../MockData/mockGetDataSetsForZTreeNodeListResult.json';
import mockGetDataSetDataDataResult from '../MockData/mockGetDataSetDataDataResult.json';
import mockGetWebFormForZTreeNodeListResult from '../MockData/mockGetWebFormForZTreeNodeListResult.json';
import mockGetFormMainTableFieldsResult from '../MockData/mockGetFormMainTableFieldsResult.json';
import mockGetAPISForZTreeNodeListResult from '../MockData/mockGetAPISForZTreeNodeListResult.json';
import mockGetDictionaryEntityGroupTreeDataResult from '../MockData/mockGetDictionaryEntityGroupTreeDataResult.json';
import mockGetWebListDesignPOResult_Add from '../MockData/mockGetWebListDesignPOResult_Add.json';
import mockGetWebListDesignPOResult_Update from '../MockData/mockGetWebListDesignPOResult_Update.json';
import mockGetWebFormDesignPOResult_Add from '../MockData/mockGetWebFormDesignPOResult_Add.json';
import mockGetWebFormDesignPOResult_Update from '../MockData/mockGetWebFormDesignPOResult_Update.json';

let acInterface = {
    getTablesData: "/JB4DCBuilder/Rest/Builder/DataStorage/DataBase/Table/GetTablesForZTreeNodeList",
    getTableFields: "/JB4DCBuilder/Rest/Builder/DataStorage/DataBase/Table/GetTableFieldsByTableId",
    getTablesFieldsByTableIds: "/JB4DCBuilder/Rest/Builder/DataStorage/DataBase/Table/GetTablesFieldsByTableIds",
    getEnvVariableGroupTreeData: "/JB4DCBuilder/Rest/Builder/EnvVariableGroup/GetTreeData",
    getEnvVariableListData: "/JB4DCBuilder/Rest/Builder/EnvVariable/GetListData",
    getDataSetsForZTreeNodeList: "/JB4DCBuilder/Rest/Builder/DataSet/DataSetMain/GetDataSetsForZTreeNodeList",
    getDataSetData: "/JB4DCBuilder/Rest/Builder/DataSet/DataSetMain/GetDataSetData",
    getWebFormForZTreeNodeList: "/JB4DCBuilder/Rest/Builder/Form/GetWebFormForZTreeNodeList",
    getFormMainTableFields: "/JB4DCBuilder/Rest/Builder/Form/GetFormMainTableFields",
    getAPISForZTreeNodeList: "/JB4DCBuilder/Rest/Builder/ApiItem/GetAPISForZTreeNodeList",
    getDictionaryEntityGroupTreeData: "/JB4DCBuilder/Rest/SystemSetting/Dict/DictionaryGroup/GetTreeData",

    saveWebListDesign: "/JB4DCBuilder/Rest/Builder/List/SaveEdit",
    getWebListDesignPO: "/JB4DCBuilder/Rest/Builder/List/GetDetailData",

    saveWebFormDesign:"/JB4DCBuilder/Rest/Builder/Form/SaveEdit",
    getWebFormDesignPO: "/JB4DCBuilder/Rest/Builder/Form/GetDetailData",

    getControlPlugins:"/JB4DCBuilder/Rest/Builder/Form/XXXXXX",
}

let storeDataSet = {};

let RemoteRestInterface = {
    mockAjax:true,
    getControlPlugins(sendData){
        let promiseObj = new Promise((resolve, reject) => {
            AjaxUtility.PostSync(acInterface.getControlPlugins, sendData, function (result) {
                let response = {
                    data: result
                }
                resolve(response)
            }, this);
        });
        return promiseObj;
    },

    getTablesData(sendData) {
        return axios.post(acInterface.getTablesData, sendData).catch(function (error) {
            console.log(error);
        });
    },
    getTableFieldsSync(sendData) {
        //axios无法发起同步请求,后边再来改.db-table-relation-comp.vue
        let promiseObj = new Promise((resolve, reject) => {
            AjaxUtility.PostSync(acInterface.getTableFields, sendData, function (result) {
                let response = {
                    data: result
                }
                resolve(response)
            }, this);
        });
        return promiseObj;
        //successFunc(getTableFieldsData)
    },
    getAllTablesFields(sendData) {
        return axios.post(acInterface.getTablesFieldsByTableIds, sendData).catch(function (error) {
            console.log(error);
        });
    },
    getEnvVariableGroupTreeData(sendData) {
        return axios.post(acInterface.getEnvVariableGroupTreeData, sendData).catch(function (error) {
            console.log(error);
        });
    },
    getEnvVariableListData(sendData) {
        return axios.post(acInterface.getEnvVariableListData, sendData).catch(function (error) {
            console.log(error);
        });
    },
    getDataSetsForZTreeNodeList(sendData) {
        return axios.post(acInterface.getDataSetsForZTreeNodeList, sendData).catch(function (error) {
            console.log(error);
        });
    },
    getDataSetData(dataSetId) {
        let promiseObj;
        if (storeDataSet[dataSetId]) {
            let dataSetResponseData = storeDataSet[dataSetId];
            promiseObj = new Promise((resolve, reject) => {
                resolve({
                    data: dataSetResponseData
                })
            });
            //successFunc(dataSetResponseData);
            return promiseObj;
        }

        promiseObj = new Promise((resolve, reject) => {
            axios.post(acInterface.getDataSetData, {
                "op": "view",
                "recordId": dataSetId
            }).then(function (response) {
                //successFunc(response.data)
                storeDataSet[dataSetId] = response.data;
                resolve(response);
            }).catch(function (error) {
                console.log(error);
            });
        });
        return promiseObj;
    },
    getWebFormForZTreeNodeList(sendData) {
        return axios.post(acInterface.getWebFormForZTreeNodeList, sendData).catch(function (error) {
            console.log(error);
        });
    },
    getFormMainTableFields(sendData) {
        return axios.post(acInterface.getFormMainTableFields, sendData).catch(function (error) {
            console.log(error);
        });
    },
    getAPISForZTreeNodeList(sendData) {
        return axios.post(acInterface.getAPISForZTreeNodeList, sendData).catch(function (error) {
            console.log(error);
        });
    },
    getDictionaryEntityGroupTreeData(sendData) {
        return axios.post(acInterface.getDictionaryEntityGroupTreeData, sendData).catch(function (error) {
            console.log(error);
        });
    },

    saveWebListDesign(sendData) {
        console.log(sendData);
        return axios.post(acInterface.saveWebListDesign, sendData).catch(function (error) {
            console.log(error);
        });
    },
    getWebListDesignPOAndBindTo(sendData) {
        let sendDataURLSearchParams = sendDataToURLSearchParams(sendData);
        return axios.post(acInterface.getWebListDesignPO, sendDataURLSearchParams).catch(function (error) {
            console.log(error);
        });
    },

    saveWebFormDesign(sendData){
        console.log(sendData);
        return axios.post(acInterface.saveWebFormDesign, sendData).catch(function (error) {
            console.log(error);
        });
    },
    getWebFormDesignPOAndBindTo(sendData){
        let sendDataURLSearchParams = sendDataToURLSearchParams(sendData);
        return axios.post(acInterface.getWebFormDesignPO, sendDataURLSearchParams).catch(function (error) {
            console.log(error);
        });
    }
}

function sendDataToURLSearchParams(sendData) {
    const params = new URLSearchParams();
    for (let paramsKey in sendData) {
        params.append(paramsKey, sendData[paramsKey]);
    }
    return params;
}


let mockForm = ``;
mockForm="";
let mock = new MockAdapter(axios, {delayResponse: 200});
if (RemoteRestInterface.mockAjax) {
    RemoteRestInterface.getControlPlugins=function (sendData) {
        let promiseObj = new Promise((resolve, reject) => {
            let response = {
                data: {
                    "success": true,
                    "message": "获取数据成功！",
                    "cacheKey": "",
                    "traceMsg": "",
                    "errorCode": null,
                    "data": controlPluginsConfig
                }
            }
            resolve(response);
        });
        return promiseObj;
    }

    mock.onPost(acInterface.getTablesData).reply(200, mockGetTablesDataResult);

    //mock.onPost(acInterface.getTableFields).reply(200, getTableFieldsData);
    RemoteRestInterface.getTableFieldsSync=function (sendData) {
        let promiseObj = new Promise((resolve, reject) => {
            let response = {
                data: mockGetTableFieldsResult
            }
            resolve(response)
        });
        return promiseObj;
    }

    mock.onPost(acInterface.getTablesFieldsByTableIds).reply(200, mockGetTablesFieldsByTableIdsResult);

    mock.onPost(acInterface.getEnvVariableGroupTreeData).reply(200, mockGetEnvVariableGroupTreeDataResult);

    mock.onPost(acInterface.getEnvVariableListData).reply(200, mockGetEnvVariableListDataResult);

    mock.onPost(acInterface.getDataSetsForZTreeNodeList).reply(200, mockGetDataSetsForZTreeNodeListResult);

    mock.onPost(acInterface.getDataSetData).reply(200, mockGetDataSetDataDataResult);

    mock.onPost(acInterface.getWebFormForZTreeNodeList).reply(200, mockGetWebFormForZTreeNodeListResult);

    mock.onPost(acInterface.getFormMainTableFields).reply(200, mockGetFormMainTableFieldsResult);

    mock.onPost(acInterface.getAPISForZTreeNodeList).reply(200, mockGetAPISForZTreeNodeListResult);

    mock.onPost(acInterface.getDictionaryEntityGroupTreeData).reply(200, mockGetDictionaryEntityGroupTreeDataResult);

    //mockGetWebListDesignPOResult_Add
    //mockGetWebListDesignPOResult_Update
    mock.onPost(acInterface.getWebListDesignPO).reply(200, mockGetWebListDesignPOResult_Update);

    //mockGetWebFormDesignPOResult_Add
    //mockGetWebFormDesignPOResult_Update
    mock.onPost(acInterface.getWebFormDesignPO).reply(200, mockGetWebFormDesignPOResult_Add);
}

//mock.onPost(acInterface.getWebListDesignPO).passThrough()
//mock.onPost(acInterface.saveWebListDesign).passThrough()
//mock.onPost(acInterface.saveWebFormDesign).passThrough()

export {RemoteRestInterface as default};