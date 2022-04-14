<template>
    <div class="html-design-plugin-dialog-wraper" v-cloak>
        <a-tabs tab-position="top" size="small" type="card">
            <a-tab-pane key="baseInfo" tab="基础信息">
                <uid-control-base-info v-model:value="baseInfo">
                </uid-control-base-info>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import GeneralPlugin from "../../GeneralPlugin";

export default {
    name: "WLDCT_ListTableContainerProperty",
    data(){
        return {
          baseInfo: GeneralPlugin.defaultProps.baseInfo
        }
    },
    mounted(){

    },
    methods: {
        getControlProps() {
            let result = {
                success: true,
                baseInfo: this.baseInfo
            }
            return result;
        },
        setControlProps($elem,props) {
            this.baseInfo = props.baseInfo ? props.baseInfo : this.baseInfo;
        }
    }
}
</script>

<style scoped>

</style>