let portletUtility={
    refreshVersionKey:"portletUtility-RefreshVersion",
    innerVersion:null,
    autoRefreshControlFunc:null,
    GetRefreshVersion:function (){
        let refreshVersion=LocalStorageUtility.getItem(this.refreshVersionKey);
        if (!refreshVersion){
            refreshVersion=1;
        }
        return refreshVersion;
    },
    UpdateRefreshVersion:function (){
        let refreshVersion=this.GetRefreshVersion();
        refreshVersion++;
        LocalStorageUtility.setItem(this.refreshVersionKey,refreshVersion);
    },
    InitRefreshStatus:function () {
        LocalStorageUtility.setItem(this.refreshVersionKey,1);
        this.UpdateRefreshVersion();
        this.innerVersion = this.GetRefreshVersion();
    },
    NeedToBeRefresh:function (){
        let newRefreshVersion=this.GetRefreshVersion();
        if(newRefreshVersion>this.innerVersion){
            this.innerVersion=newRefreshVersion;
            return true;
        }
        return false;
    },
    StartAutoRefreshControl:function (refreshFunc, caller) {
        portletUtility.autoRefreshControlFunc=refreshFunc;
        window.setInterval(function () {
            if (portletUtility.NeedToBeRefresh()) {
                portletUtility.autoRefreshControlFunc.call(caller, portletUtility.innerVersion);
            }
        }, 1000);
    }
}