import GeneralPlugin from "../../GeneralPlugin";

import WLDCT_HideContainerPlugin from "../WLDCT_HideContainer/WLDCT_HideContainerPlugin";
import WLDCT_ListSimpleSearchContainerPlugin
    from "../WLDCT_ListSimpleSearchContainer/WLDCT_ListSimpleSearchContainerPlugin";
import WLDCT_ListComplexSearchContainerPlugin
    from "../WLDCT_ListComplexSearchContainer/WLDCT_ListComplexSearchContainerPlugin";
import WLDCT_ListButtonContainerPlugin from "../WLDCT_ListButtonContainer/WLDCT_ListButtonContainerPlugin";
import WLDCT_ListTableContainerPlugin from "../WLDCT_ListTableContainer/WLDCT_ListTableContainerPlugin";

let WLDCT_ListTemplatePlugin = {
    singleName: "WLDCT_ListTemplate",
    config: GeneralPlugin.configProp,
    _$elem: null,
    id: null,
    props: JsonUtility.CloneStringify(GeneralPlugin.defaultProps),
    buildInstanceObj(instanceId) {
        return GeneralPlugin.newControlInstance(this, instanceId);
    },
    constructionElem() {
        this._$elem = $(`<div class="uid-wldct-list-template-wrap"></div>`);
        GeneralPlugin.serializePropsToElemForNewControl(this._$elem, this.config, {
            designControlInstanceName: this.id,
            id: this.id
        });

        //加入简单查询区域
        let listSimpleSearchContainerInstance = WLDCT_ListSimpleSearchContainerPlugin.buildInstanceObj(GeneralPlugin.newControlInstanceId(WLDCT_ListSimpleSearchContainerPlugin.singleName)).instance;
        let $listSimpleSearchContainerInstanceElem = listSimpleSearchContainerInstance.constructionElem();

        this._$elem.append($listSimpleSearchContainerInstanceElem);

        //加入弹出查询区域
        let listComplexSearchContainerInstance = WLDCT_ListComplexSearchContainerPlugin.buildInstanceObj(GeneralPlugin.newControlInstanceId(WLDCT_ListComplexSearchContainerPlugin.singleName)).instance;
        let $listComplexSearchContainerInstanceElem = listComplexSearchContainerInstance.constructionElem();

        this._$elem.append($listComplexSearchContainerInstanceElem);

        //加入弹出查询区域
        let listButtonContainerInstance = WLDCT_ListButtonContainerPlugin.buildInstanceObj(GeneralPlugin.newControlInstanceId(WLDCT_ListButtonContainerPlugin.singleName)).instance;
        let $listButtonContainerInstanceElem = listButtonContainerInstance.constructionElem();

        this._$elem.append($listButtonContainerInstanceElem);

        //加入弹出查询区域
        let listTableContainerInstance = WLDCT_ListTableContainerPlugin.buildInstanceObj(GeneralPlugin.newControlInstanceId(WLDCT_ListTableContainerPlugin.singleName)).instance;
        let $listTableContainerInstanceElem = listTableContainerInstance.constructionElem();

        this._$elem.append($listTableContainerInstanceElem);

        //加入隐藏区域
        let hideContainerInstance = WLDCT_HideContainerPlugin.buildInstanceObj(GeneralPlugin.newControlInstanceId(WLDCT_HideContainerPlugin.singleName)).instance;
        let $hideContainerInstanceElem = hideContainerInstance.constructionElem();

        this._$elem.append($hideContainerInstanceElem);

        window.setTimeout(function () {
            listSimpleSearchContainerInstance.registeredEvent($listSimpleSearchContainerInstanceElem);
            listComplexSearchContainerInstance.registeredEvent($listComplexSearchContainerInstanceElem);
            listButtonContainerInstance.registeredEvent($listButtonContainerInstanceElem);
            listTableContainerInstance.registeredEvent($listTableContainerInstanceElem);
            hideContainerInstance.registeredEvent($hideContainerInstanceElem);
        }, 700);

        return this._$elem;
    },
    setElem($elem) {
        this._$elem = $elem;
    },
    registeredEvent($elem) {
        let rd = REDIPS.drag;
        rd.init(this._$elem.attr("id"));
        //GeneralPlugin.registeredGeneralEvent(this._$elem,this);
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
    }
}

GeneralPlugin.registeredPlugin(WLDCT_ListTemplatePlugin.singleName, WLDCT_ListTemplatePlugin);

export {WLDCT_ListTemplatePlugin as default};