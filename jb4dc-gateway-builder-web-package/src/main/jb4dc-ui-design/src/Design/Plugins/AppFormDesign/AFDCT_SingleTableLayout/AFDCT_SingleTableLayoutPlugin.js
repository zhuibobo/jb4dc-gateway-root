import GeneralPlugin from "../../GeneralPlugin";

let AFDCT_SingleTableLayoutPlugin={
    singleName:"AFDCT_SingleTableLayout",
    config:GeneralPlugin.configProp,
    _$elem:null,
    id:null,
    buildInstanceObj(instanceId){
        return GeneralPlugin.newControlInstance(this,instanceId);
    },
    constructionElem(){
        this._$elem=$(`<div class="uid-single-table-layout-runtime" group="${this.config.group}" singlename="${this.singleName}" design-control-instance-name="${this.id}" id="${this.id}">
                    <table contenteditable="true" class="AFDCT_SingleTableLayoutPlugin">
                        <colgroup><col style="width: 8%" /><col style="width: 15%" /><col style="width: 8%"><col style="width: 15%"><col style="width: 8%"><col style="width: 16%"></colgroup>
                        <tr><td colspan="6"></td></tr>
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
        return this._$elem;
    },
    registeredEvent($elem){
        let rd = REDIPS.drag;
        rd.init(this._$elem.attr("id"));
    },
    dropControlToContainer(plugin,$dropToTarget,$dropToLayout){
        let controlInstance=plugin.buildInstanceObj(GeneralPlugin.newControlInstanceId(plugin.singleName)).instance;
        let $elem=controlInstance.constructionElem();
        console.log($elem);
        $dropToTarget.append($elem);
        if(typeof(controlInstance.registeredEvent)=="function"){
            controlInstance.registeredEvent($elem);
        }

        let rd = REDIPS.drag;
        rd.init($dropToLayout.attr("id"));
        REDIPS.drag.enableDrag('init');
    },
}

GeneralPlugin.registeredPlugin(AFDCT_SingleTableLayoutPlugin.singleName,AFDCT_SingleTableLayoutPlugin);

export { AFDCT_SingleTableLayoutPlugin as default};