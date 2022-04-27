<template>
  <div id="htmlDesignRuntimeWrap" class="uid-runtime-default-theme-root">
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
      this.formRuntimeInst = WebFormRuntimeUtility.pageReady({
          isPreview: false,
          rendererChainCompletedFunc: null,
          getWebFormRTParasFunc: WebFormRuntimeUtility.getWebFormRTParasWithListButtonId,
          pageHostInstance: null,
          rendererToId:"htmlDesignRuntimeWrap",
          rendererInnerButtonsToId:"innerButtonWrapOuter",
      });
  }
}
</script>

<style scoped>

</style>