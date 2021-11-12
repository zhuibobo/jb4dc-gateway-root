let PortletDefaultQuickEntryWidgetControl={
    widgetInstanceId:"",
    widgetPO:null,
    pagePO:null,
    host:null,
    renderElem:function (widgetInstanceId,widgetPO) {
        let widgetContainerInnerWrap = $("<div></div>");
        widgetContainerInnerWrap.append(this.buildTitleElem());
        widgetContainerInnerWrap.append(this.buildBodyElem());
        return widgetContainerInnerWrap;
    },
    refresh:function (){

    },
    buildTitleElem:function (){
        return $("<div>1</div>");
    },
    buildBodyElem:function (){
        return $("<div>2</div>");
    },
    isInstructions:function (){
        return true;
    },
    isMore:function (){
        return false;
    }
}