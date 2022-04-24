<template>
  <div id="htmlDesignRuntimeWrap">
  </div>
</template>

<script>

import WebFormRuntimeUtility from './WebFormRuntimeUtility.js';

export default {
  name: "ui-runtime-root",
  data(){
    return {
      formRuntimeInst:null
    }
  },
  mounted() {
    this.formRuntimeInst=WebFormRuntimeUtility.pageReady(false,function () {

    },WebFormRuntimeUtility.getWebFormRTParasWithListButtonId,null);
  }
}
</script>

<style scoped>

</style>