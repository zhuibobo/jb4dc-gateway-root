let InstanceExTaskListPlugin={
    _flowInstanceRuntimePO:null,
    _historyExecutionTaskEntityList:null,
    _currentExTask:null,
    GetHtmlElem:function (propConfig){
        //console.log(propConfig);
        this._flowInstanceRuntimePO=propConfig.FlowInstanceRuntimePO;
        this._historyExecutionTaskEntityList=propConfig.FlowInstanceRuntimePO.historyExecutionTaskEntityList;
        this._currentExTask=propConfig.FlowInstanceRuntimePO.executionTaskEntity;
        console.log(this._historyExecutionTaskEntityList);
        console.log(this._flowInstanceRuntimePO);
        if(this._historyExecutionTaskEntityList) {
            return this.Renderer();
        }
        return "";
    },
    ViewDetail:function (exTaskId){
        let exTask=ArrayUtility.WhereSingle(this._historyExecutionTaskEntityList,item=>item.extaskId==exTaskId);
        DialogUtility.AlertJsonCode(exTask);
    },
    ConvertStatusToCNName:function (status){
        if(status=="Processing"){
            return "办理中";
        }
        else if(status=="End"){
            return "已办理";
        }
        else if(status=="Cancel"){
            return "被撤回";
        }
        else if(status=="CancelEnd"){
            return "办理&#10522;&#10230;撤回";
        }
        return "未知";
    },
    Renderer:function (){

        let htmlTable=`<div class='instance-ex-task-list-plugin'>
                            <table class='ex-task-table'>
                                <thead>
                                    <tr><th>环节名称</th><th>发送人</th><th>发送时间</th><th>查看时间</th><th>接收人/处理人</th><th>处理时间</th><th>执行动作</th><th>状态</th><th style="width: 200px">操作</th></tr>
                                </thead>
                                <tbody>`;
        for (let i = 0; i < this._historyExecutionTaskEntityList.length; i++) {
            let exTask = this._historyExecutionTaskEntityList[i];
            let extaskId = StringUtility.NullToES(exTask.extaskId);
            let extaskCurNodeName = StringUtility.NullToES(exTask.extaskCurNodeName);
            let extaskSenderName = StringUtility.NullToES(exTask.extaskSenderName);
            let extaskStartTime = StringUtility.NullToES(exTask.extaskStartTime);
            let extaskViewTime = StringUtility.NullToES(exTask.extaskViewTime);

            let rhName=StringUtility.NullToES(exTask.extaskReceiverName);
            let extaskHandlerId = StringUtility.NullToES(exTask.extaskHandlerId);
            let extaskReceiverId = StringUtility.NullToES(exTask.extaskReceiverId);
            if(!StringUtility.IsNullOrEmpty(extaskHandlerId)&&extaskReceiverId!=extaskHandlerId){
                rhName=StringUtility.NullToES(exTask.extaskReceiverName)+"/"+StringUtility.NullToES(exTask.extaskHandlerName);
            }

            let extaskHandlerName = StringUtility.NullToES(exTask.extaskHandlerName);
            let extaskEndTime = StringUtility.NullToES(exTask.extaskEndTime);
            let extaskHandleActionName = StringUtility.NullToES(exTask.extaskHandleActionName);
            let extaskStatus =this.ConvertStatusToCNName(StringUtility.NullToES(exTask.extaskStatus));
            //let extaskSenderName=exTask.extaskSenderName;

            let className="n-task-tr";
            if(this._currentExTask.extaskId==extaskId){
                className="my-this-task-tr";
            }

            htmlTable += `<tr class="${className}">
                            <td>${extaskCurNodeName}</td><td>${extaskSenderName}</td><td>${extaskStartTime}</td>
                            <td>${extaskViewTime}</td><td>${rhName}</td><td>${extaskEndTime}</td>
                            <td>${extaskHandleActionName}</td><td>${extaskStatus}</td><td><a onclick="InstanceExTaskListPlugin.ViewDetail('${extaskId}')">详情</a></td></tr>`;
        }
        htmlTable+="</tbody></table></div>";

        return htmlTable;
    }
}