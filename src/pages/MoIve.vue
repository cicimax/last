<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '肖申克的救赎',
    director: '弗兰克·德拉邦特',
    releaseYear: 1994,
    rating: 9.7,
    status: '已上映'
  },
  {
    id: 2,
    name: '泰坦尼克号',
    director: '詹姆斯·卡梅隆',
    releaseYear: 1997,
    rating: 9.4,
    status: '已上映'
  }
])

// 搜索表单
const searchForm = ref({
  name: '',
  director: '',
  status: ''
})

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('添加电影')
const formRef = ref(null)
const form = ref({
  id: '',
  name: '',
  director: '',
  releaseYear: '',
  rating: '',
  status: ''
})

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入电影名称', trigger: 'blur' }],
  director: [{ required: true, message: '请输入导演名称', trigger: 'blur' }],
  releaseYear: [{ required: true, message: '请输入发行年份', trigger: 'blur' }],
  rating: [
    { required: true, message: '请输入评分', trigger: 'blur' },
    { type: 'number', min: 0, max: 10, message: '评分范围为0-10', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 状态选项
const statusOptions = [
  { value: '已上映', label: '已上映' },
  { value: '未上映', label: '未上映' },
  { value: '下架', label: '下架' }
]

// 处理搜索
const handleSearch = () => {
  // TODO: 实现搜索逻辑
  ElMessage.success('搜索功能待实现')
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    name: '',
    director: '',
    status: ''
  }
}

// 打开添加对话框
const handleAdd = () => {
  dialogTitle.value = '添加电影'
  form.value = {
    id: '',
    name: '',
    director: '',
    releaseYear: '',
    rating: '',
    status: ''
  }
  dialogVisible.value = true
}

// 打开编辑对话框
const handleEdit = (row) => {
  dialogTitle.value = '编辑电影'
  form.value = { ...row }
  dialogVisible.value = true
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该电影记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // TODO: 实现删除逻辑
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    if (form.value.id) {
      // 编辑
      const index = tableData.value.findIndex(item => item.id === form.value.id)
      if (index > -1) {
        tableData.value[index] = { ...form.value }
      }
    } else {
      // 添加
      form.value.id = tableData.value.length + 1
      tableData.value.push({ ...form.value })
    }
    ElMessage.success(form.value.id ? '编辑成功' : '添加成功')
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('请检查表单信息')
  }
}
</script>

<template>
  <div class="movie-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="电影名称">
          <el-input v-model="searchForm.name" placeholder="请输入电影名称" clearable />
        </el-form-item>
        <el-form-item label="导演">
          <el-input v-model="searchForm.director" placeholder="请输入导演名称" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>电影列表</span>
          <el-button type="primary" @click="handleAdd">添加电影</el-button>
        </div>
      </template>

      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="电影名称" />
        <el-table-column prop="director" label="导演" />
        <el-table-column prop="releaseYear" label="发行年份" width="100" />
        <el-table-column prop="rating" label="评分" width="80" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="电影名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入电影名称" />
        </el-form-item>
        <el-form-item label="导演" prop="director">
          <el-input v-model="form.director" placeholder="请输入导演名称" />
        </el-form-item>
        <el-form-item label="发行年份" prop="releaseYear">
          <el-input-number
            v-model="form.releaseYear"
            :min="1900"
            :max="2100"
            placeholder="请输入发行年份"
          />
        </el-form-item>
        <el-form-item label="评分" prop="rating">
          <el-input-number
            v-model="form.rating"
            :min="0"
            :max="10"
            :precision="1"
            :step="0.1"
            placeholder="请输入评分"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.movie-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-card {
  margin-bottom: 20px;
}

:deep(.el-card__header) {
  padding: 15px 20px;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
</style>