import generalPlugin from '../Plugins/GeneralPlugin';

let WysiwygDragDropUtility={
    wysiwygContainerId:"wysiwygContainer",
    dragEnableClass (plugin){
        if(plugin.dragTo!="false") {
            return "drag-enable";
        }
    },
    dragEnable (plugin){
        if(plugin.dragTo!="false") {
            return true;
        }
    },
    dragStart (plugSingleName,event){
        event.dataTransfer.setData("DragSourceSingleName",plugSingleName);
    },
    getDropSingleName (event){
        let dragSingleName = event.dataTransfer.getData("DragSourceSingleName");
        return dragSingleName;
    },
    dropControlToWysiwygContainer (event){
        let dragSourceSingleName = this.getDropSingleName(event);
        let $dropToObject = $(event.target);
        let dropToObjectId=$dropToObject.attr("id");
        let pluginInstance=generalPlugin.getPluginInstanceName(dragSourceSingleName);
        if(dropToObjectId==this.wysiwygContainerId){
            generalPlugin.dropControlToContainer(pluginInstance,$dropToObject);
        }else{
            pluginInstance.dropControlToContainer(pluginInstance,$dropToObject);
        }
    }
}

export { WysiwygDragDropUtility as default};