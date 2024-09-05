<template>
    <div>
      <el-form label-width="170px" :rules="settingsFormRules" :model="settingsForm" ref="settingsFormRef">
        <el-form-item label="Token" prop="token">
          <el-input v-model="settingsForm.token" clearable style="width: 400px;margin-right: 10px"></el-input>
        </el-form-item>

        <el-form-item label="User" prop="name">
          <el-input v-model="settingsForm.name" clearable style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="Repo" prop="repo">
          <el-input v-model="settingsForm.repo" clearable style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="Branch" prop="repo">
          <el-input v-model="settingsForm.branch" clearable style="width: 400px"></el-input>
        </el-form-item>
      </el-form>
    </div>
</template>
<script setup="GithubSettings">
import {ref, defineExpose} from "vue";
import {useSettingsStore} from "../stores/settingsData.js";

const settingsFormRef = ref()
let settingsForm = ref(
    {
      token: "",
      name: "",
      repo: "",
      branch:""
    }
)
const settingsFormRules = ref({
  token: [{required: true, message: 'Please input Token',trigger: 'blur'}],
  name: [{required: true, message: 'Please input User Name',trigger: 'blur'}],
  repo: [{required: true, message: 'Please input Repo Name',trigger: 'blur'}],
  branch: [{required: true, message: 'Please input Repo Name',trigger: 'blur'}]
})

function init() {
  console.log("settings init")
  settingsForm.value = {...useSettingsStore().githubSettings}
}

function updateSettingsData() {
  settingsFormRef.value.validate((valid, fields) => {
    if (valid) {
      useSettingsStore().setGithubSettings(settingsForm.value)
    }
  })
}


defineExpose({
  init,
  updateSettingsData
})


</script>
<style scoped>

</style>