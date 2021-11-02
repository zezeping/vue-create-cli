# ElxForm
```vue
<template>
  <div class="home">
    <elx-form :config="formConfig" ref="formRef">
<!--      <template #usernameFormItem="{ formItem }">-->
<!--        自定义FormItem{{ formItem }}-->
<!--      </template>-->
<!--      <template #username="{ formItem }">-->
<!--        自定义input: {{ formItem }}-->
<!--      </template>-->
    </elx-form>
  </div>
</template>
<script>
import { reactive, toRefs, defineComponent } from 'vue'
export default defineComponent({
  setup (props, ctx) {
    const state = reactive({
      formConfig: {
        labelWidth: '120px',
        formItems: [
          {
            prop: 'username', value: '',
            label: '用户名', width: '100px',
            type: 'el-input',
            rules: [{required: true, message: '请输入手机号', trigger: ['change', 'blur']}],
            attrs: {
              placeholder: '请输入用户名',
            }
          }, {
            prop: 'loveFruits', value: [],
            label: '喜欢的水果', width: '100px',
            type: 'elx-checkbox-group',
            attrs: {
              options: [
                { label: '苹果', value: 'apple' },
                { label: '橙子', value: 'orange' },
              ]
            }
          }, {
            prop: 'rememberMe', value: true,
            label: '记住我',
            type: 'el-checkbox',
            attrs: { label: '记住' }
          }
        ],
        operationsFormItem: {
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

# ElxTable
```vue
<template>
  <div class="home">
    <elx-table :config="tableConfig" style="width: 100%" @selection-change="selectionChange">
<!--      自定义SearchBar -->
<!--      <template #searchBar="{queryList, config, getTableQuery}">-->
<!--        <div>自定义SearchBar: {{ queryList }} - {{ config }} - {{ getTableQuery }}</div>-->
<!--      </template>-->
<!--      searchBar query item slot`-->
      <template #nameFormItemQuery="{ formItem, formItemAttrs }">
        <el-form-item v-bind="formItemAttrs">
          <el-input v-model="formItem.value" v-bind="formItem.attrs"></el-input>
        </el-form-item>
      </template>
<!--      自定义searchBar 按钮组-->
<!--      <template #operationsQuery="{ onSubmit, onReset }">-->
<!--        <div>自定义searchBar, 操作按钮组</div>-->
<!--        <el-button type="primary" @click="onSubmit">搜索1</el-button>-->
<!--        <el-button @click="onReset">重置1</el-button>-->
<!--      </template>-->
      <!--table column item slot-->
      <template #nameColumn="{row, column, $index}">
        <el-button>{{ row }} - {{ column }} - {{ $index }}</el-button>
      </template>
<!--      自定义pagination-->
<!--      <template #pagination="{data, mapKeys}">-->
<!--        <div>{{ data }} - {{ mapKeys }}</div>-->
<!--      </template>-->
    </elx-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableConfig: {
        searchBar: {
          inline: true,
          formItems: [
            { prop: 'name', value: '', label: '姓名', type: 'el-input',
              attrs: { placeholder: '请输入姓名', clearable: true }, // 绑定到type组件上的属性
            },
            {
              prop: 'gender', value: '', label: '性别', type: 'elx-select',
              attrs: { placeholder: '请选择性别', options: [{label: '男', value: 'male'}, {label: '女', value: 'female'}], },
            },
            { prop: 'isAdult', value: '', label: '是否成年', type: 'elx-select',
              attrs: { placeholder: '请选择类型', clearable: true, options: [{label: '成年', value: 'true'}, {label: '未成年', value: 'false'}], },
              getValue(queryItem, form) {
                // 根据当前搜索的值，给搜索form添加额外搜索字段
                if (/true|false/.test(queryItem.value)) {
                  form.hi = queryItem.value === 'true' ? 'hello' : 'world'
                } else {
                  delete form.hi
                }
                // 搜索一般都是get请求所以boolean值数字最后都要转为字符串，所以这里直接用字符串表识一般情况下并没有什么问题
                return queryItem.value === 'true' ? '1' : queryItem.value === 'false' ? '0' : ''
              },
              setValue(queryItem, form) {
                queryItem.value = form[queryItem.prop] === '1' ? 'true' : form[queryItem.prop] === '0' ? 'false' : ''
              }
              //customHandleValue: (form, item) => {
              //	form[item.key] = item.value === true ? 1 : 0
              //}
            },
          ]
        },
        fetchData: (query) => new Promise((resolve, _reject) => {
          console.log(123, 'fetchData', query)
          setTimeout(() => {
            resolve({
              data: {
                pageNo: query.pageNo || 1,
                pageSize: query.pageSize || 10,
                total: 99,
                list: [
                  { date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄', },
                  { date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄', },
                ]
              },
            })
          }, 3000)
        }),
        columns: [
          { type: 'selection', width: 55 },
          { label: '日期', prop: 'date' },
          { label: '姓名', prop: 'name' },
          { label: '地址', prop: 'address' },
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