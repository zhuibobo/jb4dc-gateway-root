//import controlPluginsConfig from '../Config/ControlPlugins.json';

import RemoteRestInterface from '../Remote/RemoteRestInterface';


let ControlPluginsUtility = {
    controlPluginsConfig:null,
    controlPluginsConfigAllArray:null,
    initData(){
        let promiseObj = new Promise((resolve, reject) => {
            RemoteRestInterface.getControlPlugins({}).then((response) => {
                let result = response.data;
                this.controlPluginsConfig = result.data;

                this.controlPluginsConfigAllArray = this.controlPluginsConfig.appFormDesign.controls;
                this.controlPluginsConfigAllArray = this.controlPluginsConfigAllArray.concat(this.controlPluginsConfig.appListDesign.controls);
                this.controlPluginsConfigAllArray = this.controlPluginsConfigAllArray.concat(this.controlPluginsConfig.webFormDesign.controls);
                this.controlPluginsConfigAllArray = this.controlPluginsConfigAllArray.concat(this.controlPluginsConfig.webListDesign.controls);
                resolve();
            });
        });
        return promiseObj;
    },
    getControlGroupsConfigByDesignType(uiDesignType) {
        //alert(JsonUtility.JsonToString(controlPluginsConfig));
        //alert(uiDesignType);
        //debugger;
        return this.controlPluginsConfig[uiDesignType].groups;
    },
    getControlPluginsConfigByDesignType(uiDesignType) {
        //alert(JsonUtility.JsonToString(controlPluginsConfig));
        //alert(uiDesignType);
        return this.controlPluginsConfig[uiDesignType].controls;
    },
    findBySingleName(singleName, arr) {
        if (!arr) {
            arr = this.controlPluginsConfigAllArray;
        }
        const len = arr.length;
        let obj;
        for (let i = 0; i < len; i++) {
            if (singleName == arr[i].singleName) {
                obj = arr[i];
                break;
            } else if (arr[i].children && arr[i].children.length) {
                obj = this.findBySingleName(singleName, arr[i].children);
                if (obj) break; // 找到就结束循环，避免后续循环覆盖正确结果
            }
        }
        return obj;
    }
}

export {ControlPluginsUtility as default};