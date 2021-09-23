<template>
    <div>
        <Button type="primary" @click="openServerMockPage">打开服务端模拟页面</Button>
        <Button type="primary" @click="sendMessageToServerPage">发送消息到服务端</Button>
    </div>
</template>

<script>
import {WpsClientUtility} from "../Utility/WpsClientUtility.js";

export default {
    name: "dev-panel-app",
    mounted() {

    },
    methods: {
        openServerMockPage: function () {
            wps.OAAssist.ShellExecute("http://127.0.0.1:3889/WpsWordServer/dist/WpsWordServerDemoPage.html")
        },
        sendMessageToServerPage: function () {
            let currentTime = new Date();
            let actionOption=WpsClientUtility.getActionOption();
            let timeStr = currentTime.getHours() + ':' + currentTime.getMinutes() + ":" + currentTime.getSeconds();
            //let wpsClientAdditionActionOption=window.parent.getActionOptionToThisWindow();
            console.log(actionOption);
            wps.OAAssist.WebNotify("这行内容由wps加载项主动送达给业务系统，可以任意自定义, 比如时间值:" + timeStr, true);
        }
    }
}
</script>

<style scoped>

</style>