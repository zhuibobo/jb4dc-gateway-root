import GeneralPlugin from "../../GeneralPlugin";

import WLDCT_LayoutContainerPlugin from "../WLDCT_LayoutContainer/WLDCT_LayoutContainerPlugin";

let WLDCT_LayoutContainerLRPlugin = {
    singleName: "WLDCT_LayoutContainerLR",
    config: GeneralPlugin.configProp,
    _$elem: null,
    id: null,
    props: JsonUtility.CloneStringify(GeneralPlugin.defaultProps),
    settings: JsonUtility.CloneStringify(GeneralPlugin.settings),
    buildInstanceObj(instanceId) {
        return GeneralPlugin.newControlInstance(this, instanceId);
    },
    constructionElem() {
        this._$elem = $(`<div class="uid-wldct-layout-container-lr-wrap"></div>`);
        GeneralPlugin.serializePropsToElemForNewControl(this._$elem, this.config, {
            designControlInstanceName: this.id,
            id: this.id
        });

        //左侧区域
        let layoutContainerInstanceLeft = WLDCT_LayoutContainerPlugin.buildInstanceObj(GeneralPlugin.newControlInstanceId(WLDCT_LayoutContainerPlugin.singleName, "left")).instance;
        let $layoutContainerInstanceLeftElem = layoutContainerInstanceLeft.constructionElem();
        $layoutContainerInstanceLeftElem.css({"flex-basis": "200px"})

        this._$elem.append($layoutContainerInstanceLeftElem);

        //右侧区域
        let layoutContainerInstanceRight = WLDCT_LayoutContainerPlugin.buildInstanceObj(GeneralPlugin.newControlInstanceId(WLDCT_LayoutContainerPlugin.singleName, "right")).instance;
        let $layoutContainerInstanceRightElem = layoutContainerInstanceRight.constructionElem();
        $layoutContainerInstanceRightElem.css({"flex-grow": "2"})

        this._$elem.append($layoutContainerInstanceRightElem);

        window.setTimeout(function () {
            layoutContainerInstanceLeft.registeredEvent($layoutContainerInstanceLeftElem);
            layoutContainerInstanceRight.registeredEvent($layoutContainerInstanceRightElem);
        }, 1000);

        return this._$elem;
    },
    setElem($elem) {
        this._$elem = $elem;
    },
    registeredEvent($elem) {
        GeneralPlugin.registeredGeneralEvent(this._$elem, this);
    },
    dropControlToContainer(dragPlugin, $dropToTarget, $dropToLayout) {

    }
}

GeneralPlugin.registeredPlugin(WLDCT_LayoutContainerLRPlugin.singleName, WLDCT_LayoutContainerLRPlugin);

export {WLDCT_LayoutContainerLRPlugin as default};