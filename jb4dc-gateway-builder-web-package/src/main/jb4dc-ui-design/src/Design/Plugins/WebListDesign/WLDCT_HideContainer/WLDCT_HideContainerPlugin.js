import GeneralPlugin from "../../GeneralPlugin";

let WLDCT_HideContainerPlugin = {
    singleName: "WLDCT_HideContainer",
    config: GeneralPlugin.configProp,
    _$elem: null,
    id: null,
    props: JsonUtility.CloneStringify(GeneralPlugin.defaultProps),
    buildInstanceObj(instanceId) {
        return GeneralPlugin.newControlInstance(this, instanceId);
    },
    constructionElem() {
        this._$elem = $(`<div class="uid-wldct-container-wrap uid-wldct-hide-container-wrap">
                    <table contenteditable="true">
                        <colgroup><col style="width: 8%" /><col style="width: 15%" /><col style="width: 8%"><col style="width: 15%"><col style="width: 8%"><col style="width: 16%"></colgroup>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    </table></div>`);
        GeneralPlugin.serializePropsToElemForNewControl(this._$elem, this.config, {
            designControlInstanceName: this.id,
            id: this.id
        });
        return this._$elem;
    },
    setElem($elem) {
        this._$elem = $elem;
    },
    registeredEvent($elem) {
        let rd = REDIPS.drag;
        rd.init(this._$elem.attr("id"));
        GeneralPlugin.registeredGeneralEvent(this._$elem, this);
    },
    dropControlToContainer(plugin, $dropToTarget, $dropToLayout) {
        let controlInstance = plugin.buildInstanceObj(GeneralPlugin.newControlInstanceId(plugin.singleName)).instance;
        let $elem = controlInstance.constructionElem();
        console.log($elem);
        $dropToTarget.append($elem);
        if (typeof (controlInstance.registeredEvent) == "function") {
            controlInstance.registeredEvent($elem);
        }

        let rd = REDIPS.drag;
        rd.init($dropToLayout.attr("id"));
        REDIPS.drag.enableDrag('init');
    },
}

GeneralPlugin.registeredPlugin(WLDCT_HideContainerPlugin.singleName, WLDCT_HideContainerPlugin);

export {WLDCT_HideContainerPlugin as default};