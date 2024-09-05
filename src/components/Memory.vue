<template>
  <div class="wrapper">

    <div class="top_btn_container">
      <el-button type="warning" size="large" @click="requestLatestData" :icon="Refresh"></el-button>
      <el-button type="warning" size="large" @click="openSettingsTestDialog" :icon="Setting"></el-button>
      <el-button type="primary" size="large" @click="openUploadImageDialog" :icon="Upload"></el-button>
    </div>

    <div class="img-show-wrapper" v-loading="imgListLoading">
      <div class="img-show-item" v-for="item in showImgData" :key="item.path">
        <img :src="pre + item.path" :alt="pre + item.path"/>
        <div class="img-show-btn-group">
          <div>
            <el-tooltip
                class="box-item"
                content="Copy Link"
                effect="light"
                placement="top-start"
            >
              <el-button size="small" :icon="CopyDocument" type="primary" @click="copy2Clip(pre + item.path)"></el-button>
            </el-tooltip>
          </div>

        </div>
      </div>
    </div>
    <div style="float: right">
      <el-pagination
          background
          v-show="imgPageDataTotal > 0"
          style="margin: 20px 0;"
          :total="imgPageDataTotal"
          v-model:current-page="imgPageQueryParams.pageNum"
          v-model:page-size="imgPageQueryParams.pageSize"
          @current-change="handelShowImgData"/>
    </div>

    <el-dialog
        :close-on-click-modal="false"
        title="Upload Image"
        width="70%"
        v-model="isShowUploadImageDialog">

      <el-upload
          class="upload-demo"
          drag
          action="none"
          multiple
          :before-upload="stopUpload"
          v-loading="uploadDialogLoading"
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            jpg/png files with a size less than 500kb
          </div>
        </template>
      </el-upload>


    </el-dialog>

    <SettingsWrapperDialog
        :show-dialog="isShowSettingsTestDialog"
        v-if="isShowSettingsTestDialog"
        @close="closeSettingsTestDialog"
        @confirm="confirmSettingsTestDialog"
        ref="settingWrapperDialog"
    />

  </div>
</template>
<script setup="Memory">
import SettingsWrapperDialog from "./SettingsWrapperDialog.vue";
import {getContents, upload} from "../api/GithubApi.js"
import {useSettingsStore} from "../stores/settingsData.js";

import {computed, getCurrentInstance, onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {CopyDocument, Refresh, Setting, Upload, UploadFilled} from '@element-plus/icons-vue'

const { proxy } =  getCurrentInstance()



const mSettingsStore = useSettingsStore()

let allImgData = ref([])
let showImgData = ref([])

let imgListLoading = ref(false)
let uploadDialogLoading = ref(false)

let pre = computed(()=>{
  return `https://cdn.jsdelivr.net/gh/${mSettingsStore.githubSettings.name}/${mSettingsStore.githubSettings.repo}@${mSettingsStore.githubSettings.branch}/`
})

let imgPageDataTotal = ref(0)
let imgPageQueryParams = ref({
  pageNum: 1,
  pageSize: 20
})

let isShowUploadImageDialog = ref(false)
let isShowSettingsDialog = ref(false)

/** 复制到剪切板 */
let copy2Clip = str => {

  let copyUrl = ''
  if (mSettingsStore.otherSettings.copyType === 'origin') {
    copyUrl = str
  } else { // markdown
    copyUrl = `![](${str})`
  }

  navigator.clipboard.writeText(copyUrl)

  ElMessage({
    message: 'Copy Success!',
    type: 'success',
  })
}


let stopUpload = (rawFile) => {
  realUpload(rawFile)
  return false
}

let realUpload = (rawFile) => {
  uploadDialogLoading.value = true

  const tailName = rawFile.name.substring(rawFile.name.lastIndexOf('.')); // 提取尾缀，比如说 .jpg .png
  const uploadName = timeStr() + tailName.toLocaleLowerCase()

  const reader = new FileReader()
  reader.readAsDataURL(rawFile)
  reader.onloadend = () => {
    const uploadContent = reader.result.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, '') // 去掉base64前面那串无用的字符串

    const requestData = {
      message: 'upload image',
      content: uploadContent
    }
    upload(uploadName, requestData).then(res => {
    }).finally(() => {
      uploadDialogLoading.value = false
      isShowUploadImageDialog.value = false
      ElMessage({
        message: 'Upload Success!',
        type: 'success',
      })
      requestLatestData()
    })


  }
}

function timeStr() {
  // 获取当前时间
  let now = new Date();

  let year = now.getFullYear();
  let month = (now.getMonth() + 1).toString().padStart(2, '0'); // 月份是从0开始的，所以要加1
  let day = now.getDate().toString().padStart(2, '0');
  let hour = now.getHours().toString().padStart(2, '0');
  let minute = now.getMinutes().toString().padStart(2, '0');
  let second = now.getSeconds().toString().padStart(2, '0');
  let milliSeconds = now.getMilliseconds().toString().padStart(2, '0');


  return year + month + day + hour + minute + second + milliSeconds;
}


let openUploadImageDialog = () => {
  isShowUploadImageDialog.value = true
}


/** 处理分页数据 */
let handelShowImgData = () => {
  let pageNum = imgPageQueryParams.value.pageNum
  let pageSize = imgPageQueryParams.value.pageSize
  let allData = [...allImgData.value]
  let allDataLength = allData.length
  let preAllSum = (pageNum - 1) * pageSize

  imgPageDataTotal.value = allDataLength

  if ((allDataLength - preAllSum) >= pageSize) {
    showImgData.value = [...allData.slice(preAllSum, pageSize * pageNum)]
  } else {
    showImgData.value = [...allData.slice(preAllSum, allDataLength)]
  }
  document.documentElement.scrollTop = 0;
}

let requestLatestData = () => {

  if (useSettingsStore().githubSettings.token.length > 0) {
    imgListLoading.value = true
    allImgData.value = []
    showImgData.value = []

    getContents().then(res => {

      allImgData.value = res.data.filter(item => {
        return imgTailName.some(ext => item.name.toLowerCase().endsWith(ext)) && item.type === "file"
      }).sort((a, b) => b.name.localeCompare(a.name))

    }).finally(() => {
      handelShowImgData()
      imgListLoading.value = false
    })
  } else {
    ElMessage({
      message:"set token pls.",
      type: 'error',
    })
  }


}

const imgTailName = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg", ".raw"]
onMounted(() => {
  requestLatestData()
})


const settingWrapperDialog = ref(null)

const isShowSettingsTestDialog = ref(false)

const openSettingsTestDialog = () => {
  isShowSettingsTestDialog.value = true

  proxy.$nextTick(() => {settingWrapperDialog.value.init()})
}

const closeSettingsTestDialog = () => isShowSettingsTestDialog.value = false

const confirmSettingsTestDialog = (data) => {

  requestLatestData()
  closeSettingsTestDialog()
}



</script>

<style scoped>
@import "../css/MemoryStyle.css";
</style>
