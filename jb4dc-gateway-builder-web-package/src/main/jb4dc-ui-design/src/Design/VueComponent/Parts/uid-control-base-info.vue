<template>
    <table class="html-design-plugin-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
        <colgroup>
            <col style="width: 100px" />
            <col style="width: 240px" />
            <col style="width: 90px" />
            <col style="width: 170px" />
            <col style="width: 90px" />
            <col />
        </colgroup>
        <tbody>
        <tr>
            <td>ID：</td>
            <td>
                <input type="text" v-model="baseInfo.id" />
            </td>
            <td>Serialize：</td>
            <td style="text-align: center">
                <a-radio-group type="button" style="margin: auto" v-model:value="baseInfo.serialize">
                    <a-radio-button value="true">是</a-radio-button>
                    <a-radio-button value="false">否</a-radio-button>
                </a-radio-group >
            </td>
            <td>启用：</td>
            <td style="text-align: center">
                <a-radio-group type="button" style="margin: auto" v-model:value="baseInfo.status">
                    <a-radio-button value="enable">是</a-radio-button>
                    <a-radio-button value="disable">否</a-radio-button>
                </a-radio-group>
            </td>
        </tr>
        <tr>
            <td>Name：</td>
            <td>
                <input type="text" v-model="baseInfo.name" />
            </td>
            <td>Readonly：</td>
            <td style="text-align: center">
                <a-radio-group type="button" style="margin: auto" v-model:value="baseInfo.custReadonly">
                    <a-radio-button value="readonly">是</a-radio-button>
                    <a-radio-button value="noreadonly">否</a-radio-button>
                </a-radio-group>
            </td>
            <td>Disabled：</td>
            <td style="text-align: center">
                <a-radio-group type="button" style="margin: auto" v-model:value="baseInfo.custDisabled">
                    <a-radio-button value="disabled">是</a-radio-button>
                    <a-radio-button value="nodisabled">否</a-radio-button>
                </a-radio-group>
            </td>
        </tr>
        <tr>
            <td>Placeholder</td>
            <td>
                <input type="text" v-model="baseInfo.placeholder" />
            </td>
            <td>ClassName：</td>
            <td colspan="3">
                <input type="text" v-model="baseInfo.className" placeholder="设置的class只在运行时起效 " />
            </td>
        </tr>
        <tr>
            <td>Group</td>
            <td>
                <input type="text" v-model="baseInfo.groupName" />
            </td>
            <td></td>
            <td colspan="3">
            </td>
        </tr>
        <tr>
            <td>样式：</td>
            <td colspan="5">
                <textarea rows="7" v-model="baseInfo.style"></textarea>
            </td>
        </tr>
        <tr>
            <td>备注：</td>
            <td colspan="5">
                <textarea rows="4" v-model="baseInfo.desc"></textarea>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    name: "uid-control-base-info",
    props: ["value"],
    data: function () {
        return {
            baseInfo: {
                id: "",
                serialize: "",
                name: "",
                className: "",
                placeholder: "",
                custReadonly: "",
                custDisabled: "",
                style: "",
                desc: "",
                status:"",
                groupName:""
            }
        }
    },
    //新增result的watch，监听变更同步到openStatus
    //监听父组件对props属性result的修改，并同步到组件内的data属性
    watch: {
        baseInfo: function (newVal) {
            // 必须是input
            this.$emit('input', newVal)
        },
        value: function (newVal) {
            this.baseInfo = newVal;
        }
    },
    mounted: function () {
        //debugger;
        this.baseInfo = this.value;
        if(!this.baseInfo.status){
            this.baseInfo.status="enable";
        }
    },
    methods: {}
}
</script>

<style scoped>

</style>