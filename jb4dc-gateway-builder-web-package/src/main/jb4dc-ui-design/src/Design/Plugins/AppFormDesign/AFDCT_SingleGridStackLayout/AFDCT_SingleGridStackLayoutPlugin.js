import GeneralPlugin from "../../GeneralPlugin";

let AFDCT_SingleGridStackLayoutPlugin={
    singleName:"AFDCT_SingleGridStackLayout",
    config:GeneralPlugin.configProp,
    getElem(){
        let newControl=GeneralPlugin.newControlInstance(AFDCT_SingleGridStackLayoutPlugin);

        let html=`<div class="grid-stack" style="" group="${this.config.group}" singlename="${this.singleName}" design-control-instance-name="${newControl.name}" id="${newControl.name}"></div>`;
        return $(html);
    },
    registeredEvent($elem){
        let grid = GridStack.init({
            minRow: 1, // don't let it collapse when empty
            cellHeight: '40px',
            margin: 0,
            acceptWidgets: '.drag-to-grid',
            float: true,
            column: 16
        }, $elem[0]);
        grid.on('added', (event, items)=> {
            let node=items[0];
            console.log(node);
            console.log(event);
            if($(node.el).attr("pluginSingleName")) {
                grid.removeWidget(node.el, true, true);
                let pluginInstance = GeneralPlugin.getControlInstances($(node.el).attr("pluginSingleName"));
                this.dropControlToContainerForAddEvent(pluginInstance, $(node.grid.el), $(node.grid.el), grid, node);
            }
            //this.dropControlToContainer(AFDCT_SingleGridStackLayoutPlugin,)
        });
    },
    dropControlToContainerForAddEvent(pluginInstance,$dropToTarget,$dropToLayout,layoutGrid,sourceNode){
        let $elem=pluginInstance.getElem();
        window.setTimeout(function (){
            layoutGrid.addWidgetForControl({
                x: sourceNode.x,
                y: sourceNode.y,
                w: sourceNode.w,
                h: sourceNode.h,
                content: $elem[0].outerHTML
            });
            console.log(pluginInstance);
        },500);
    },
    dropControlToContainer(pluginInstance,$dropToTarget,$dropToLayout){

    }
}

GeneralPlugin.registeredPlugin(AFDCT_SingleGridStackLayoutPlugin.singleName,AFDCT_SingleGridStackLayoutPlugin);

export { AFDCT_SingleGridStackLayoutPlugin as default};