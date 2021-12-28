import GeneralPlugin from "../../GeneralPlugin";
import newControlInstance from "../../GeneralPlugin";

let AFDCT_SingleTableLayoutPlugin1={
    singleName:"AFDCT_SingleTableLayout1",
    config:GeneralPlugin.configProp,
    getElem(){

        let newControlInstance=GeneralPlugin.newControlInstance(AFDCT_SingleTableLayoutPlugin1);

        let html=`<div group="${this.config.group}" singlename="${this.singleName}" design-control-instance-name="${newControlInstance.name}" class="uid-single-table-layout" id="${newControlInstance.name}">
                    <table contenteditable="true" class="AFDCT_SingleTableLayoutPlugin">
                        <colgroup><col style="width: 8%" /><col style="width: 15%" /><col style="width: 8%"><col style="width: 15%"><col style="width: 8%"><col style="width: 16%"></colgroup>
                        <tr><td colspan="6"></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    </table></div>`;
        return $(html);
    },
    registeredEvent(elem){
        //console.log("REDIPS.drag.init:"+elem.attr("id"))
        //let rd=Object.create(REDIPS.drag);
        let rd = REDIPS.drag;	// reference to the REDIPS.drag class
        rd.init(elem.attr("id"));
        //REDIPS.drag.initTables("[singlename='AFDCT_SingleTableLayout'] table");
        //REDIPS.drag.enableDrag('init');
        /*let AFDCT_SingleTableLayout=$("[singlename='AFDCT_SingleTableLayout']");
        let se="";
        for (let i = 0; i < AFDCT_SingleTableLayout.length; i++) {
            se+="#"+$(AFDCT_SingleTableLayout[i]).attr("id")+" table,";
        }
        se=se.substring(0,se.length-1);
        REDIPS.drag.initTables(se);
        REDIPS.drag.enableDrag('init');
        console.log(se);*/
    },
    dropControlToContainer(pluginInstance,$dropToTarget,$dropToLayout){
        let $elem=pluginInstance.getElem();
        console.log($elem);
        $dropToTarget.append($elem);
        if(typeof(pluginInstance.registeredEvent)=="function"){
            pluginInstance.registeredEvent($elem);
        }

        //
        //REDIPS.drag.enableDrag(true,"#"+$elem.attr("id"));
        let rd = REDIPS.drag;
        rd.init($dropToLayout.attr("id"));
        REDIPS.drag.enableDrag('init');
    },
}

GeneralPlugin.registeredPlugin(AFDCT_SingleTableLayoutPlugin1.singleName,AFDCT_SingleTableLayoutPlugin1);

export { AFDCT_SingleTableLayoutPlugin1 as default};