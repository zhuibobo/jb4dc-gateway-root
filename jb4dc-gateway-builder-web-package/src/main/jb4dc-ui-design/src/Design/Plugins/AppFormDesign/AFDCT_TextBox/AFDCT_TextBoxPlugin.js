import GeneralPlugin from "../../GeneralPlugin";

let AFDCT_TextBoxPlugin={
    singleName:"AFDCT_TextBox",
    config:GeneralPlugin.configProp,
    getElem(){
        let newControl=GeneralPlugin.newControlInstance(AFDCT_TextBoxPlugin);
        let html=`<div singlename="${this.singleName}" design-control-instance-name="${newControl.name}" class="uid-design-input-control redips-drag" contenteditable="false" id="${newControl.name}">${this.config.text}</div>`;
        return $(html);
    },
    registeredEvent($elem){
        $elem.on("click",{},()=>{alert(1)});
    }
}

GeneralPlugin.registeredPlugin(AFDCT_TextBoxPlugin.singleName,AFDCT_TextBoxPlugin);

export { AFDCT_TextBoxPlugin as default};