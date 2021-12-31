import GeneralPlugin from "../../GeneralPlugin";

let AFDCT_SingleTableLayoutPlugin={
    singleName:"AFDCT_SingleTableLayout",
    config:GeneralPlugin.configProp,
    getElem(){
        let newControl=GeneralPlugin.newControlInstance(AFDCT_SingleTableLayoutPlugin);

        let html=`<div class="uid-single-table-layout-runtime" group="${this.config.group}" singlename="${this.singleName}" design-control-instance-name="${newControl.name}" id="${newControl.name}">
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
                    </table></div>`;
        return $(html);
    },
    registeredEvent($elem){
        let rd = REDIPS.drag;
        rd.init($elem.attr("id"));

        $elem.on("dblclick",{},function (event){
            //alert("1");
            event.preventDefault();
            event.stopPropagation();
            GeneralPlugin.showPluginPropEditDialog("AFDCT_SingleTableLayoutProperty")
        });
    },
    dropControlToContainer(pluginInstance,$dropToTarget,$dropToLayout){
        let $elem=pluginInstance.getElem();
        console.log($elem);
        $dropToTarget.append($elem);
        if(typeof(pluginInstance.registeredEvent)=="function"){
            pluginInstance.registeredEvent($elem);
        }

        let rd = REDIPS.drag;
        rd.init($dropToLayout.attr("id"));
        REDIPS.drag.enableDrag('init');
    },
}

GeneralPlugin.registeredPlugin(AFDCT_SingleTableLayoutPlugin.singleName,AFDCT_SingleTableLayoutPlugin);

export { AFDCT_SingleTableLayoutPlugin as default};