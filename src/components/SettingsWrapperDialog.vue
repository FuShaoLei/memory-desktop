<template>
  <el-dialog
      title="Upload Image"
      width="50%"
      :model-value="showDialog"
      :before-close="closeDialog">

    <Settings/>

  </el-dialog>
</template>
<script setup="SettingsWrapperDialog">
import Settings from "./Settings.vue";

const props = defineProps({
  showDialog: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(['close', 'confirm'])

const closeDialog = () => emit('close')



</script>

<style scoped>

</style>