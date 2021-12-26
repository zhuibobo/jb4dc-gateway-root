import GeneralPlugin from "../../GeneralPlugin";

let SingleTableLayoutPlugin={
    singleName:"SingleTableLayout",
    config:GeneralPlugin.configProp,
    getTemplate(){
        //console.log(this.config);
        return "<div singlename='"+this.name+"' class='uid-single-table-layout'><table contenteditable='true'><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr></table></div>";
    },
    registeredEvent(){

    }
}

GeneralPlugin.registeredPlugin(SingleTableLayoutPlugin.singleName,SingleTableLayoutPlugin);

export { SingleTableLayoutPlugin as default};