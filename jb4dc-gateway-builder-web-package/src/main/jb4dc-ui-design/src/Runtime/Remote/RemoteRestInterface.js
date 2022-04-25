import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import mockLoadWebListRuntimeHTMLResult from '../MockData/mockLoadWebListRuntimeHTMLResult.json';
import mockGetWebListRuntimeDataSetDataResult from '../MockData/mockGetWebListRuntimeDataSetDataResult.json';
import mockLoadWebFormRuntimeHTMLResult from '../MockData/mockLoadWebFormRuntimeHTMLResult.json';
import mockGetFileListDataResult from '../MockData/mockGetFileListDataResult.json';

let acInterface = {
    loadWebListRuntimeHTML: "/QCSystem/Rest/Builder/RunTime/ListRuntime/LoadHTML",
    getWebListRuntimeDataSetData: "/QCSystem/Rest/Builder/RunTime/DataSetRuntime/GetDataSetData",

    loadWebFormRuntimeHTML: "/QCSystem/Rest/Builder/RunTime/ListRuntime/LoadHTML",
    getFileListData:"/QCSystem/Rest/Builder/RunTime/FileRuntime/GetFileListData"
}

let storeDataSet = {};

let RemoteRestInterface = {
    mockAjax:true,
    loadWebListRuntimeHTML(sendData) {
        return axios.post(acInterface.loadWebListRuntimeHTML, sendData).catch(function (error) {
            console.log(error);
        });
    },
    getWebListRuntimeDataSetData(sendData) {
        return axios.post(acInterface.getWebListRuntimeDataSetData, sendData).catch(function (error) {
            console.log(error);
        });
    },

    loadWebFormRuntimeHTML(sendData) {
        return axios.post(acInterface.loadWebFormRuntimeHTML, sendData).catch(function (error) {
            console.log(error);
        });
    },

    getFileListData(sendData){
        return axios.post(acInterface.getFileListData, sendData).catch(function (error) {
            console.log(error);
        });
    }
}

let mock = new MockAdapter(axios, {delayResponse: 200});
if (RemoteRestInterface.mockAjax) {

    mock.onPost(acInterface.loadWebListRuntimeHTML).reply(200, mockLoadWebListRuntimeHTMLResult);

    mock.onPost(acInterface.getWebListRuntimeDataSetData).reply(200, mockGetWebListRuntimeDataSetDataResult);

    mock.onPost(acInterface.loadWebFormRuntimeHTML).reply(200, mockLoadWebFormRuntimeHTMLResult);

    mock.onPost(acInterface.getFileListData).reply(200, mockGetFileListDataResult);
}

export {RemoteRestInterface as default};