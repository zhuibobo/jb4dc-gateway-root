import GeneralPlugin from "../../GeneralPlugin";

let AFDCT_SingleGridStackLayoutPlugin={
    singleName:"AFDCT_SingleGridStackLayout",
    config:GeneralPlugin.configProp,
    _$elem:null,
    id:null,
    buildInstanceObj(instanceId){
        return GeneralPlugin.newControlInstance(this,instanceId);
    },
    constructionElem(){
        this._$elem=$(`<div class="grid-stack" style="" group="${this.config.group}" singlename="${this.singleName}" design-control-instance-name="${this.id}" id="${this.id}"></div>`);
        return this._$elem;
    },
    registeredEvent($elem){
        let grid = GridStack.init({
            minRow: 1, // don't let it collapse when empty
            cellHeight: '40px',
            margin: 0,
            acceptWidgets: '.drag-to-grid',
            float: true,
            column: 16
        }, this._$elem[0]);
        grid.on('added', (event, items)=> {
            let node=items[0];
            console.log(node);
            console.log(event);
            if($(node.el).attr("pluginSingleName")) {
                grid.removeWidget(node.el, true, true);
                let pluginObj = GeneralPlugin.getControlInstanceObj($(node.el).attr("pluginSingleName"));
                this.dropControlToContainerForAddEvent(pluginObj, $(node.grid.el), $(node.grid.el), grid, node);
            }
        });
    },
    dropControlToContainerForAddEvent(pluginObj,$dropToTarget,$dropToLayout,layoutGrid,sourceNode){
        //let $elem=pluginObj.instance.getElemAndRegInstance();
        let controlInstance=pluginObj.instance.buildInstanceObj(GeneralPlugin.newControlInstanceId(pluginObj.instance.singleName)).instance;
        let $elem=controlInstance.constructionElem();
        window.setTimeout(function (){
            let gridStackItem=layoutGrid.addWidget({
                x: sourceNode.x,
                y: sourceNode.y,
                w: sourceNode.w,
                h: sourceNode.h,
                content: ""
            });
            $(gridStackItem).find(".grid-stack-item-content").append($elem);
            controlInstance.registeredEvent($elem);
        },500);
    },
    dropControlToContainer(pluginInstance,$dropToTarget,$dropToLayout){

    }
}

GeneralPlugin.registeredPlugin(AFDCT_SingleGridStackLayoutPlugin.singleName,AFDCT_SingleGridStackLayoutPlugin);

export { AFDCT_SingleGridStackLayoutPlugin as default};