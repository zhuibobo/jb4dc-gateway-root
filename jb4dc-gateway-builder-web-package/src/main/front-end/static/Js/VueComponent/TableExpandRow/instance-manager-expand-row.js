Vue.component("instance-manager-expand-row", {
    props:['row'],
    data: function () {
        return {
        }
    },
    mounted:function(){

    },
    methods:{
    },
    template: `<div>
        <row>
            <i-col span="1">
                <div>模型名称：</div>
            </i-col>
            <i-col span="11">
                <div>{{ row.modelIntegratedEntity.modelName }}</div>
            </i-col>
            <i-col span="1">
                <div>模型ID：</div>
            </i-col>
            <i-col span="11">
                <div>{{ row.modelIntegratedEntity.modelId }}</div>
            </i-col>
        </row>
        <row style="margin-top: 8px">
            <i-col span="1">
                <div>部署人：</div>
            </i-col>
            <i-col span="11">
                <div>{{ row.modelIntegratedEntity.modelCreator }}</div>
            </i-col>
            <i-col span="1">
                <div>部署时间：</div>
            </i-col>
            <i-col span="11">
                <div>{{ row.modelIntegratedEntity.modelCreateTime }}</div>
            </i-col>
        </row>
        <row style="margin-top: 8px">
            <i-col span="1">
                 <span>部署模型ID：</span>
            </i-col>
            <i-col span="11">
                <div>{{ row.modelIntegratedEntity.modelReId }}</div>
            </i-col>
            <i-col span="1">
                 <span>实例ID：</span>
            </i-col>
            <i-col span="11">
                <div>{{ row.instId }}</div>
            </i-col>
        </row>
        <row style="margin-top: 8px">
            <i-col span="1">
                 <span>当前活动任务：</span>
            </i-col>
            <i-col span="23">
                 <div v-if="row.activeExecutionTaskEntityList.length==0">无</div>
                 <div v-for="activeExecutionTask in row.activeExecutionTaskEntityList" style="border: solid 1px #85C1E9;padding: 4px">
                    <div style="width: 120px;display: inline-block">接收人：{{ activeExecutionTask.extaskReceiverName }}</div>
                    <div style="width: 200px;display: inline-block">环节名称：{{ activeExecutionTask.extaskCurNodeName }}</div>
                    <div style="width: 120px;display: inline-block">发送人：{{ activeExecutionTask.extaskSenderName }}</div>
                    <div style="width: 200px;display: inline-block">发送时间：{{ activeExecutionTask.extaskSendTime }}</div>
                    <div style="width: 200px;display: inline-block">发送环节：{{ activeExecutionTask.extaskPreNodeName }}</div>
                 </div>
            </i-col>
        </row>
    </div>`
});