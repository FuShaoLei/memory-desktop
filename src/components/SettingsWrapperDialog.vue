<template>
  <el-dialog
      title="Setting"
      width="70%"
      :model-value="showDialog"
      :before-close="closeDialog"
      v-loading="isLoading">

    <el-tabs type="border-card" tab-position="left" style="height: 200px" class="demo-tabs">
      <el-tab-pane label="Github">
        <GithubSettings ref="githubSettings"/>
      </el-tab-pane>
      <el-tab-pane label="Other">
        <OtherSettings ref="otherSettings"/>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <el-button @click="closeDialog">Cancel</el-button>
      <el-button @click="confirmDialog" type="primary">Confirm</el-button>
    </template>
  </el-dialog>
</template>
<script setup="SettingsWrapperDialog">
import GithubSettings from "./GithubSettings.vue";
import OtherSettings from "./OtherSettings.vue";
import {ref} from "vue";

const props = defineProps({
  showDialog: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(['close', 'confirm'])

const isLoading = ref(false)
const githubSettings = ref(null)
const otherSettings = ref(null)
const closeDialog = () => emit('close')

const confirmDialog = () => {
  githubSettings.value.updateSettingsData()
  otherSettings.value.update()

  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    emit('confirm')
  }, 500)

}

const init = () => {
  console.log("dialog init")
  githubSettings.value.init()
  otherSettings.value.init()
}

defineExpose({
  init
})


</script>

<style scoped>

</style>