import GeneralPlugin from "../../GeneralPlugin";

let WFDCT_SingleGridStackLayoutPlugin={
    singleName:"WFDCT_SingleGridStackLayout",
    config:GeneralPlugin.configProp,
    _$elem:null,
    id:null,
    props:JsonUtility.CloneStringify(GeneralPlugin.defaultProps),
    buildInstanceObj(instanceId){
        return GeneralPlugin.newControlInstance(this,instanceId);
    },
    constructionElem(){
        this._$elem=$(`<div jbuild4dc_custom="true" class="uid-layout-container-wrap grid-stack" style=""></div>`);
        GeneralPlugin.serializePropsToElemForNewControl(this._$elem,this.config,{
            designControlInstanceName:this.id,
            id:this.id
        });
        return this._$elem;
    },
    setElem($elem){
        this._$elem=$elem;
    },
    registeredEvent($elem) {
        window.setTimeout(() => {
            let layoutGrid = GridStack.init({
                minRow: 1, // don't let it collapse when empty
                cellHeight: '21px',
                margin: 0,
                acceptWidgets: '.drag-to-grid',
                float: true,
                column: 32
            }, this._$elem[0]);
            layoutGrid.on('added', (event, items) => {
                let node = items[0];
                console.log(node);
                console.log(event);
                if ($(node.el).attr("pluginSingleName")) {
                    layoutGrid.removeWidget(node.el, true, true);
                    let pluginObj = GeneralPlugin.getControlInstanceObj($(node.el).attr("pluginSingleName"));
                    this.dropControlToContainerForAddEvent(pluginObj, $(node.grid.el), $(node.grid.el), layoutGrid, node);
                }
            });
            this.layoutGrid = layoutGrid;
        }, 100);

        GeneralPlugin.registeredGeneralEvent(this._$elem, this);
    },
    resetWysiwygElemProps($elem, props) {
        GeneralPlugin.serializePropsToElem(this._$elem, props, this.config, null);
        this.layoutGrid.cellHeight(50);
        this.layoutGrid.column(12);
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
                h: sourceNode.h+1,
                content: ""
            });
            $(gridStackItem).find(".grid-stack-item-content").append($elem);
            controlInstance.registeredEvent($elem);
        },500);
    },
    dropControlToContainer(pluginInstance,$dropToTarget,$dropToLayout){

    }
}

GeneralPlugin.registeredPlugin(WFDCT_SingleGridStackLayoutPlugin.singleName,WFDCT_SingleGridStackLayoutPlugin);

export { WFDCT_SingleGridStackLayoutPlugin as default};