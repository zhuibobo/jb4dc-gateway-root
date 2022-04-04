import GeneralPlugin from "../../GeneralPlugin";

let WLDCT_LayoutContainerPlugin = {
    singleName: "WLDCT_LayoutContainer",
    config: GeneralPlugin.configProp,
    _$elem: null,
    id: null,
    props: JsonUtility.CloneStringify(GeneralPlugin.defaultProps),
    settings: JsonUtility.CloneStringify(GeneralPlugin.settings),
    buildInstanceObj(instanceId) {
        return GeneralPlugin.newControlInstance(this, instanceId);
    },
    constructionElem() {
        this._$elem = $(`<div class="uid-wldct-layout-container-wrap"></div>`);
        GeneralPlugin.serializePropsToElemForNewControl(this._$elem, this.config, {
            designControlInstanceName: this.id,
            id: this.id
        });
        return this._$elem;
    },
    setElem($elem) {
        this._$elem = $elem;
    },
    resetWysiwygElemProps($elem, props) {
        GeneralPlugin.serializePropsToElem(this._$elem, props, this.config, props.normalProps.buttonCaption);
    },
    registeredEvent($elem) {
        GeneralPlugin.registeredGeneralEvent(this._$elem, this);
    },
    dropControlToContainer(dragPlugin, $dropToTarget, $dropToLayout) {
        let controlInstance = dragPlugin.buildInstanceObj(GeneralPlugin.newControlInstanceId(dragPlugin.singleName)).instance;
        let $elem = controlInstance.constructionElem();
        console.log($elem);
        $dropToTarget.append($elem);
        if (typeof (controlInstance.registeredEvent) == "function") {
            controlInstance.registeredEvent($elem);
        }
    }
}

GeneralPlugin.registeredPlugin(WLDCT_LayoutContainerPlugin.singleName, WLDCT_LayoutContainerPlugin);

export {WLDCT_LayoutContainerPlugin as default};