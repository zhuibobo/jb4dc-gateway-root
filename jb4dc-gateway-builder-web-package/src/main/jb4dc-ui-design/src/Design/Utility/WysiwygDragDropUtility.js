import generalPlugin from '../Plugins/GeneralPlugin';

let WysiwygDragDropUtility = {
    wysiwygContainerId: "wysiwygContainer",

    dragEnableClass(plugin) {
        if (plugin.dragTo != "false") {
            return "drag-enable";
        }
        return "";
    },
    dragEnable(plugin) {
        if (plugin.dragTo != "false") {
            return true;
        }
    },
    dragStart(plugSingleName, event) {
        event.dataTransfer.setData("DragSourceSingleName", plugSingleName);
    },
    getDropSingleName(event) {
        let dragSingleName = event.dataTransfer.getData("DragSourceSingleName");
        return dragSingleName;
    },
    dragControlToWysiwygContainerOver(event) {
        let dragSourceSingleName = this.getDropSingleName(event);
        console.log(event);
        console.log(dragSourceSingleName);
    },
    isDropToRootContainer($dropToObject) {
        let dropToObjectId = $dropToObject.attr("id");
        if (dropToObjectId == this.wysiwygContainerId) {
            return true;
        }
        return false;
    },
    enableDropToValidate: function (dragPluginSingleName, $dropToLayout) {
        //debugger
        let pluginInstanceObj = generalPlugin.getControlInstanceObj(dragPluginSingleName);
        let enableDragToNames = pluginInstanceObj.instance.config.dragTo;
        let dropToTargetSingleName = "";
        if (this.isDropToRootContainer($dropToLayout)) {
            dropToTargetSingleName = this.wysiwygContainerId;
            if (enableDragToNames.indexOf(dropToTargetSingleName) >= 0) {
                return true;
            }
        } else {
            let dropToTargetSingleName = $dropToLayout.attr("singleName");
            let pluginInstanceObj = generalPlugin.getControlInstanceObj(dropToTargetSingleName);
            console.log($dropToLayout);
            console.log(dropToTargetSingleName);
            if (enableDragToNames.indexOf("Layout") >= 0 && pluginInstanceObj.instance.config.controlCategory == "LayoutControl") {
                return true;
            } else if (enableDragToNames.indexOf(dropToTargetSingleName) >= 0) {
                return true;
            }
        }
        return false;
    },
    dropControlToWysiwygContainer(event) {
        //debugger;
        //console.log(event);
        //debugger;
        let dragSourceSingleName = this.getDropSingleName(event);
        if (dragSourceSingleName) {
            let $dropToTarget = $(event.target);
            //debugger
            let pluginObj = generalPlugin.getControlInstanceObj(dragSourceSingleName);
            if (pluginObj) {
                //let newControlInstance=Object.create(pluginInstance);

                if (this.isDropToRootContainer($dropToTarget)) {
                    if (this.enableDropToValidate(dragSourceSingleName, $dropToTarget)) {
                        generalPlugin.dropControlToContainer(pluginObj.instance, $dropToTarget, $dropToTarget);
                    }
                } else {
                    //debugger
                    let $dropToLayout;
                    if ($dropToTarget.attr("control_category") == "LayoutControl") {
                        $dropToLayout = $dropToTarget;
                    } else {
                        $dropToLayout = $dropToTarget.parents("[control_category='LayoutControl']")[0];
                    }
                    if($($dropToLayout).length==0){
                        console.log("无法确认位置!");
                        return;
                    }
                    $dropToLayout = $($dropToLayout);
                    if (this.enableDropToValidate(dragSourceSingleName, $dropToLayout)) {
                        let dropToLayoutObjectSingleName = $dropToLayout.attr("singlename");
                        let dropToLayoutInstanceObj = generalPlugin.getControlInstanceObj(dropToLayoutObjectSingleName);
                        console.log(dropToLayoutInstanceObj);
                        dropToLayoutInstanceObj.instance.dropControlToContainer(pluginObj.instance, $dropToTarget, $dropToLayout);
                    } else {
                        alert("不允许拖拽到该位置!");
                    }
                }
                generalPlugin.regTooltipEvent();
            } else {
                let errorMessage = "WysiwygDragDropUtility.dropControlToWysiwygContainer:未找到相关插件!";
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, errorMessage);
                throw errorMessage;
            }
        }
    }
}

export {WysiwygDragDropUtility as default};