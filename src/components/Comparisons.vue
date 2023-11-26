<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="source" prop="column1" sortable></el-table-column>
      <el-table-column label="target" prop="column2" sortable></el-table-column>
      <el-table-column label="value" prop="column3" sortable></el-table-column>
      <el-table-column label="time" prop="column4" sortable></el-table-column>
      <!-- 其他列... -->
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalItems"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0
    }
  },
  methods: {
    fetchData() {
      // 模拟数据接口返回的数据
      // 实际应用中，你需要替换成从服务器获取数据的逻辑
      const mockData = [
        { column1: 'A', column2: 123, column3: 'X', column4: 1 },
        { column1: 'B', column2: 456, column3: 'Y', column4: 1 },
        { column1: 'C', column2: 789, column3: 'Z', column4: 1 },
        { column1: 'D', column2: 101, column3: 'W', column4: 1 },
        { column1: 'E', column2: 202, column3: 'V', column4: 1 },
        { column1: 'F', column2: 303, column3: 'U', column4: 1 },
        { column1: 'G', column2: 404, column3: 'T', column4: 1 },
        { column1: 'H', column2: 505, column3: 'S', column4: 1 },
        { column1: 'I', column2: 606, column3: 'R', column4: 1 },
        { column1: 'J', column2: 707, column3: 'Q', column4: 1 },
        { column1: 'K', column2: 808, column3: 'P', column4: 1 },
        { column1: 'L', column2: 909, column3: 'O', column4: 1 },
        { column1: 'M', column2: 1010, column3: 'N', column4: 1 },
        { column1: 'N', column2: 1111, column3: 'M', column4: 1 },
        { column1: 'O', column2: 1212, column3: 'L', column4: 1 },
        { column1: 'P', column2: 1313, column3: 'K', column4: 1 },
        { column1: 'Q', column2: 1414, column3: 'J', column4: 1 },
        { column1: 'R', column2: 1515, column3: 'I', column4: 1 },
        { column1: 'S', column2: 1616, column3: 'H', column4: 1 },
        { column1: 'T', column2: 1717, column3: 'G', column4: 1 }
        // ... 至少20条数据1
      ]

      // 模拟总条数
      const total = 20 // 假设总共有20条数据

      // 计算当前页的数据起始索引和结束索引
      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = startIndex + this.pageSize

      // 获取当前页的数据
      this.tableData = mockData.slice(startIndex, endIndex)
      this.totalItems = total
    },
    handleSizeChange(val) {
      // 处理每页显示条数变化逻辑
      this.pageSize = val
      this.currentPage = 1 // 重置为第一页
      this.fetchData()
    },
    handleCurrentChange(val) {
      // 处理当前页变化逻辑
      this.currentPage = val
      this.fetchData()
    }
  },
  mounted() {
    // 页面加载时初始化数据
    this.fetchData()
  }
}
</script>

<style scoped="scoped">
/deep/.el-table thead tr > th {
  background-color: #e0e0e0;
}
/deep/.el-table tbody tr > td {
  background-color: #fff;
}
/deep/.el-table tbody tr:hover > td {
  background-color: #fff !important;
}
/deep/.el-table tbody tr > td:hover {
  background-color: #f0f0f0 !important;
}
/deep/.el-table thead tr > th:hover {
  background-color: #fefefe !important;
}
</style>
