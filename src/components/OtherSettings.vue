<template>
  <div>
    <el-form label-width="170px" :rules="settingsFormRules" :model="settingsForm" ref="settingsFormRef">
      <el-form-item label="Copy Format" prop="copyType">
        <el-select v-model="settingsForm.copyType">
          <el-option v-for="item of typeArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

  </div>
</template>
<script setup="OtherSettings">
import {ref} from "vue";
const settingsFormRef = ref()
import {useSettingsStore} from "../stores/settingsData.js";

let settingsForm = ref(
    {
      copyType: "",
    }
)
const settingsFormRules = ref({
  copyType: [{required: true, message: 'Please Select Copy Type',trigger: 'select'}],
})

const typeArr = ref([
  {
    label: "markdown format",
    value:"markdown"
  },
  {
    label: "origin format",
    value:"origin"
  }
])

function init() {
  console.log("other settings init")
  settingsForm.value = {...useSettingsStore().otherSettings}
}


const update = () =>{
  settingsFormRef.value.validate((valid, fields) => {
    if (valid) {
      useSettingsStore().setOtherSettings(settingsForm.value)
    }
  })
}

defineExpose({
  init,
  update
})


</script>

<style scoped>

</style>