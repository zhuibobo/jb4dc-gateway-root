<template>
    <div>
        <Button type="primary" @click="printWpsRpc">打印Wps_Rpc</Button>
        <Button type="primary" @click="newDoc">新建文档</Button>
        <Button type="primary" @click="getDocumentName">获取当前打开文件的文件名</Button>
        <Button type="primary" @click="openSmallSizeDocument">打开服务端小文档</Button>
        <Button type="primary" @click="openBigSizeDocument">打开服务端大文档</Button>
        <Input v-model="provideForServerCallResult" :rows="18" type="textarea" />
    </div>
</template>

<script>
import { WpsJsRPCUtility } from '../Utility/WpsJsRPCUtility.js';

export default {
    name: "wps-word-content-edit",
    data: function () {
        return {
            provideForServerCallResult: ""
        }
    },
    mounted() {
        /*WpsJsRPCUtility.regWebNotify((message) => {
            this.provideForServerCallResult = message;
        });*/
    },
    methods: {
        printWpsRpc: function () {
            WpsJsRPCUtility.printWpsRpc();
        },
        newDoc: function () {
            let currentTime = new Date()
            let timeStr = currentTime.getHours() + ':' + currentTime.getMinutes() + ":" + currentTime.getSeconds();

            WpsJsRPCUtility.newDocument({
                instanceId: timeStr
            }, (result) => {
                this.provideForServerCallResult = JSON.stringify(result, null, 2);
            });
        },
        getDocumentName: function () {
            WpsJsRPCUtility.getDocumentName((result) => {
                this.provideForServerCallResult = JSON.stringify(result, null, 2);
            });
        },
        openSmallSizeDocument: function () {
            WpsJsRPCUtility.openSmallSizeDocument('https://alex-files82.oss-cn-beijing.aliyuncs.com/1M.docx?versionId=CAEQEBiBgICJ3LGL0RciIGJmMmQxMTZkMTQxYzRhNGI5ZDNjM2QzMTY5OTFmMzA3', (result) => {
                this.provideForServerCallResult = JSON.stringify(result, null, 2);
            });
        },
        openBigSizeDocument: function () {
            WpsJsRPCUtility.openBigSizeDocument('https://alex-files82.oss-cn-beijing.aliyuncs.com/100M.doc?versionId=CAEQEBiBgMDimIyJ0RciIDEyZTFiNDc0MmRjOTRkMTNiNzVmYzlmNWE1ODA1ZGU1', (result) => {
                this.provideForServerCallResult = JSON.stringify(result, null, 2);
            });
        }
    }
}
</script>

<style scoped>

</style>