<template>
  <a-upload v-model:file-list="currentValue" :beforeUpload="beforeUpload" :customRequest="customRequest">
    <a-button :loading="uploading" :disabled="currentValue.length >= maxSize">
      <upload-outlined></upload-outlined>
      点击上传
    </a-button>
  </a-upload>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent, computed } from 'vue'
import { notification } from 'ant-design-vue'
//import { uploadFile } from '@/api/system'
//import { useStore } from 'vuex'

export default defineComponent({
  props: {
    maxSize: {
      type: Number,
      default: 9999999
    },
    modelValue: {
      type: Array,
    },
    beforeUpload: {
      type: Function,
      default: () => () => false
    }
  },
  setup (props, ctx) {
    //const store = useStore()
    const state = reactive({
      uploading: computed(() => {
        let uploading = false
        if (state.currentValue.find(item => item.status === 'uploading')) {
          uploading = true
        }
        return uploading
      }),
      currentValue: computed({
        get: () => props.modelValue,
        set(nv) {
          ctx.emit('update:modelValue', nv)
        }
      }),
      //accept: computed(() => '*'),
      //headers: computed(() => ({
      //  Authorization: `bearer ${store.state.user.authInfo.token}`
      //})),
      //async uploadFile(file) {
      //  console.log(file)
      //  return `/gateway/opf-common-file-consumer/rest/common/file/change?params={"userId": ${store.state.user.userInfo.id}, "fileType": "project-manage-tasks"}`
      //}
      // https://github.com/react-component/upload/blob/master/docs/examples/customRequest.tsx
      async customRequest({ data, file, withCredentials, onError, onProgress, onSuccess, }) {
        const formData = new FormData();
        if (data) {
          Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
          });
        }
        formData.append('file', file);
        //const {data: resData} = await uploadFile(formData, {
        //  withCredentials,
        //  headers: state.headers,
        //  onUploadProgress: ({ total, loaded }) => {
        //    onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file);
        //  },
        //  params: { params: { userId: store.getters['user/userId'], fileType: 'project-manage-tasks' } },
        //}).catch(onError)
        //if (resData.errorCode !== '0') {
        //  onError(new Error(resData.errorMsg))
        //  notification.error(resData.errorMsg)
        //} else {
        //  onSuccess(resData, file);
        //}
      }
    })
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
</style>