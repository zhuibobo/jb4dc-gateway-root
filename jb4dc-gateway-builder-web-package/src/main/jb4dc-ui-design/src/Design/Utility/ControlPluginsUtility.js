import controlPluginsConfig from '../Config/ControlPlugins.json';

let controlPluginsConfigAllArray = controlPluginsConfig.appFormDesign.controls;
controlPluginsConfigAllArray = controlPluginsConfigAllArray.concat(controlPluginsConfig.appListDesign.controls)
controlPluginsConfigAllArray = controlPluginsConfigAllArray.concat(controlPluginsConfig.webFormDesign.controls)
controlPluginsConfigAllArray = controlPluginsConfigAllArray.concat(controlPluginsConfig.webListDesign.controls)
let ControlPluginsUtility = {
    getControlGroupsConfigByDesignType(uiDesignType) {
        //alert(JsonUtility.JsonToString(controlPluginsConfig));
        //alert(uiDesignType);
        return controlPluginsConfig[uiDesignType].groups;
    },
    getControlPluginsConfigByDesignType(uiDesignType) {
        //alert(JsonUtility.JsonToString(controlPluginsConfig));
        //alert(uiDesignType);
        return controlPluginsConfig[uiDesignType].controls;
    },
    findBySingleName(singleName, arr) {
        if (!arr) {
            arr = controlPluginsConfigAllArray;
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