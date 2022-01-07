let DefaultValueUtility={
    formatText:function (type,text) {
        //debugger;
        if(type=="Const"){
            return "静态值:【"+text+"】";
        }
        else if(type=="EnvVar"){
            return "环境变量:【"+text+"】";
        }
        else if (type == "") {
            return "【无】";
        }
        return "未知类型"+text;
    }
}

export { DefaultValueUtility as default};