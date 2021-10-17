# AxForm
```vue
<template>
  <div class="home">
    <ax-form :config="formConfig" ref="formRef">
<!--      <template #usernameFormItem="{ formItem }">-->
<!--        自定义FormItem{{ formItem }}-->
<!--      </template>-->
<!--      <template #username="{field}">-->
<!--        自定义input: {{ field }}-->
<!--      </template>-->
    </ax-form>
  </div>
</template>
<script>
import { reactive, toRefs, defineComponent, computed } from 'vue'
export default defineComponent({
  setup (props, context) {
    const state = reactive({
      formConfig: {
        labelCol: { span: 2 },
        formItems: [
          {
            name: 'username', value: '',
            label: '用户名', width: '100px',
            type: 'a-input',
            rules: [{required: true, message: '请输入手机号', trigger: ['change', 'blur']}],
            attrs: {
              placeholder: '请输入用户名',
            }
          }, {
            name: 'loveFruits', value: [],
            label: '喜欢的水果', width: '100px',
            type: 'ax-checkbox-group',
            attrs: {
              options: [
                { label: '苹果', value: 'apple' },
                { label: '橙子', value: 'orange' },
              ]
            }
          }, {
            name: 'rememberMe', value: true,
            label: '记住我',
            type: 'a-checkbox',
            attrs: { label: '记住' }
          }
        ],
        operationsFormItem: {
          wrapperCol: { offset: 2 },
        }
      },
    })
    return { ...toRefs(state) }
  },
})
</script>
<style lang="scss" scoped>
</style>
```

# AxTable
```vue
<template>
  <div class="home">
    <ax-table :config="tableConfig" style="width: 100%" @selection-change="selectionChange">
<!--      自定义SearchBar -->
<!--      <template #searchBar="{formItems, config, searchQuery}">-->
<!--        <div>自定义SearchBar: {{ formItems }} - {{ config }} - {{ searchQuery }}</div>-->
<!--      </template>-->
<!--      searchBar query item slot`-->
      <template #nameFormItemQuery="{ formItem, formItemAttrs }">
        <a-form-item v-bind="formItemAttrs">
          <a-input v-model:value="formItem.value" v-bind="formItem.attrs"></a-input>
        </a-form-item>
      </template>
<!--      自定义searchBar 按钮组-->
<!--      <template #operationsQuery="{ onSubmit, onReset }">-->
<!--        <div>自定义searchBar, 操作按钮组</div>-->
<!--        <el-button type="primary" @click="onSubmit">搜索1</el-button>-->
<!--        <el-button @click="onReset">重置1</el-button>-->
<!--      </template>-->
<!--      table column item slot-->
      <template #nameColumn="{row, column, $index}">
        <el-button>{{ row }} - {{ column }} - {{ $index }}</el-button>
      </template>
    </ax-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableConfig: {
        searchBar: {
          layout: 'inline',
          formItems: [
            { name: 'name', value: '', label: '姓名', type: 'a-input',
              attrs: { placeholder: '请输入姓名' }, // 绑定到type组件上的属性
            },
            {
              name: 'gender', value: '', label: '性别', type: 'ax-select',
              attrs: { placeholder: '请选择性别', options: [{label: '男', value: 'male'}, {label: '女', value: 'female'}], style: { 'min-width': '100px' }, },
            },
            { name: 'isAdult', value: '', label: '是否成年', type: 'ax-select',
              attrs: { placeholder: '请选择类型', allowClear: true, options: [{label: '成年', value: 'true'}, {label: '未成年', value: 'false'}], },
              getValue(formItem, form) {
                // 根据当前搜索的值，给搜索form添加额外搜索字段
                if (/true|false/.test(formItem.value)) {
                  form.hi = formItem.value === 'true' ? 'hello' : 'world'
                } else {
                  delete form.hi
                }
                // 搜索一般都是get请求所以boolean值数字最后都要转为字符串，所以这里直接用字符串表识一般情况下并没有什么问题
                return formItem.value === 'true' ? '1' : formItem.value === 'false' ? '0' : ''
              },
              setValue(formItem, form) {
                formItem.value = form[formItem.name] === '1' ? 'true' : form[formItem.name] === '0' ? 'false' : ''
              }
            },
          ]
        },
        fetchData: (query) => new Promise((resolve, _reject) => {
          console.log('fetchData', query)
          setTimeout(() => {
            resolve({
              data: {
                pageNo: query.pageNo || 1,
                pageSize: query.pageSize || 10,
                total: 99,
                list: [
                  { date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄', key: 10 },
                  { date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄', },
                ]
              },
            })
          }, 3000)
        }),
        columns: [
          //{ type: 'selection', width: 55 },
          { title: '日期', dataIndex: 'date', },
          { title: '姓名', dataIndex: 'name', },
          { title: '地址', dataIndex: 'address', },
        ],
        // 优先级: (<elx-table :data="data" />) > config.data > config.fetchData()
        //data: [
        //	{ date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄', },
        //	{ date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄', },
        //],
      },
    }
  },
  methods: {
    selectionChange(items) {
      console.log('selectedItems', items)
    }
  }
}
</script>

```