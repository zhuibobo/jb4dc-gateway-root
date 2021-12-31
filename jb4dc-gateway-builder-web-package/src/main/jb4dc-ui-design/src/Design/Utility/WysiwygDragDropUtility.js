import generalPlugin from '../Plugins/GeneralPlugin';

let WysiwygDragDropUtility={
    wysiwygContainerId:"wysiwygContainer",

    dragEnableClass (plugin){
        if(plugin.dragTo!="false") {
            return "drag-enable";
        }
        return "";
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
    dragControlToWysiwygContainerOver(event){
        let dragSourceSingleName = this.getDropSingleName(event);
        console.log(event);
        console.log(dragSourceSingleName);
    },
    isDropToRootContainer($dropToObject){
        let dropToObjectId=$dropToObject.attr("id");
        if (dropToObjectId == this.wysiwygContainerId) {
            return true;
        }
        return false;
    },
    /*enableDropToRootContainer:function (pluginInstance,$dropToTarget){
        if(pluginInstance.config.dragTo.indexOf(this.wysiwygContainerId)>=0){
            return true;
        }
        return false;
    },*/
    enableDropToValidate:function (dragPluginSingleName,$dropToLayout){

        let pluginInstance=generalPlugin.getControlInstances(dragPluginSingleName);
        let enableDragToNames=pluginInstance.config.dragTo;
        let dropToTargetSingleName="";
        if(this.isDropToRootContainer($dropToLayout)){
            dropToTargetSingleName=this.wysiwygContainerId;
            if(enableDragToNames.indexOf(dropToTargetSingleName)>=0){
                return true;
            }
        }
        else{
            let dropToTargetSingleName=$dropToLayout.attr("singleName");
            let dropToPluginInstance=generalPlugin.getControlInstances(dropToTargetSingleName);
            if(enableDragToNames.indexOf("Layout")>=0&&dropToPluginInstance.config.group=="Layout") {
                return true;
            }
            else if(enableDragToNames.indexOf(dropToTargetSingleName)>=0){
                return true;
            }
        }
        return false;
    },
    dropControlToWysiwygContainer (event){
        //debugger;
        let dragSourceSingleName = this.getDropSingleName(event);
        let $dropToTarget = $(event.target);
        let pluginInstance=generalPlugin.getControlInstances(dragSourceSingleName);
        if(pluginInstance) {
            //let newControlInstance=Object.create(pluginInstance);
            //eval("let ");
            if (this.isDropToRootContainer($dropToTarget)) {
                if(this.enableDropToValidate(dragSourceSingleName,$dropToTarget)) {
                    generalPlugin.dropControlToContainer(pluginInstance, $dropToTarget, $dropToTarget);
                }
            } else {
                let $dropToLayout;
                if ($dropToTarget.attr("group") == "Layout") {
                    $dropToLayout = $dropToTarget;
                } else {
                    $dropToLayout = $dropToTarget.parents("[group='Layout']")[0];
                }
                $dropToLayout = $($dropToLayout);
                if(this.enableDropToValidate(dragSourceSingleName,$dropToLayout)) {
                    let dropToLayoutObjectSingleName = $dropToLayout.attr("singlename");
                    let dropToLayoutInstance = generalPlugin.getControlInstances(dropToLayoutObjectSingleName);
                    console.log(dropToLayoutInstance);
                    dropToLayoutInstance.dropControlToContainer(pluginInstance, $dropToTarget, $dropToLayout);
                }
                else{
                    alert("不允许拖拽到该位置!");
                }
            }
        }
    }
}

export { WysiwygDragDropUtility as default};