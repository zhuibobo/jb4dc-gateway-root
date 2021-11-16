let portletUtility={
    refreshVersionKey:"portletUtility-RefreshVersion",
    innerVersion:null,
    autoRefreshControlFunc:null,
    getRefreshVersion:function (){
        let refreshVersion=LocalStorageUtility.getItem(this.refreshVersionKey);
        if (!refreshVersion){
            refreshVersion=1;
        }
        return refreshVersion;
    },
    updateRefreshVersion:function (){
        let refreshVersion=this.getRefreshVersion();
        refreshVersion++;
        LocalStorageUtility.setItem(this.refreshVersionKey,refreshVersion);
    },
    initRefreshStatus:function () {
        LocalStorageUtility.setItem(this.refreshVersionKey,1);
        this.updateRefreshVersion();
        this.innerVersion = this.getRefreshVersion();
    },
    needToBeRefresh:function (){
        let newRefreshVersion=this.getRefreshVersion();
        if(newRefreshVersion>this.innerVersion){
            this.innerVersion=newRefreshVersion;
            return true;
        }
        return false;
    },
    startAutoRefreshControl:function (refreshFunc,caller) {
        portletUtility.autoRefreshControlFunc=refreshFunc;
        window.setInterval(function () {
            if (portletUtility.needToBeRefresh()) {
                portletUtility.autoRefreshControlFunc.call(caller, portletUtility.innerVersion);
            }
        }, 1000);
    }
}