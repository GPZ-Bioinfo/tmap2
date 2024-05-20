<template>
  <div>
    <!-- 上半部分直方图和表格按钮 -->
    <div style="position: relative; padding: 20px; text-align: center">
      <p>Summary</p>
      <el-button type="text" icon="el-icon-menu" style="position: absolute; bottom: 10px; right: 10px" @click="openTableDialog"></el-button>
    </div>

    <!-- 下半部分直方图和表格 -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="Tab 1" name="1">
        <div slot="label"><v-icon>mdi-chart-gantt</v-icon></div>
        <!-- 内容1 -->
        <div style="padding: 20px">
          <el-card v-for="item in contentItems" :key="item.id" class="card-item">
            <div>
              <p>{{ item.text }}</p>
              <div class="progress-bar">
                <div class="progress" :style="{ width: item.value * 100 + '%' }"></div>
                <div class="progress-label">{{ item.value }}</div>
              </div>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Tab 2" name="2">
        <div slot="label"><v-icon>mdi-scale-balance</v-icon></div>
        <canvas ref="chartCanvas" width="400" height="1000"></canvas>
      </el-tab-pane>
      <el-tab-pane label="Tab 3" name="3">
        <div slot="label"><v-icon>mdi-cog</v-icon></div>
        <p>内容3</p>
      </el-tab-pane>
    </el-tabs>

    <!-- 弹窗 -->
    <el-dialog :visible.sync="dialogVisible" width="50%">
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
      <!-- 导出图片按钮 -->
      <el-button type="text" icon="el-icon-download" class="export-button" @click="exportImage"></el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: '1',
      dialogVisible: false,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      contentItems: [
        { id: 1, text: 'dst', value: 0.557 },
        { id: 2, text: 'srv', value: 0.545 },
        { id: 3, text: 'rerror', value: 0.556 }
      ]
    }
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    handleTabClick(tab) {
      console.log(tab.name)
    },
    openTableDialog() {
      this.dialogVisible = true
      this.tableData = [
        { column1: 'A', column2: 123, column3: 'X', column4: 1 },
        { column1: 'B', column2: 456, column3: 'Y', column4: 1 },
        { column1: 'C', column2: 789, column3: 'Z', column4: 1 }
        // 其他数据...
      ]
    },
    drawChart() {
      const canvas = this.$refs.chartCanvas
      const ctx = canvas.getContext('2d')

      const barWidth = 40
      const spacing = 20
      const startX = 50
      const maxHeight = 200
      const gap = 50 // 两个直方图之间的空白距离

      // 上半部分直方图
      ctx.fillStyle = 'blue'
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(startX + i * (barWidth + spacing), 200 - gap, barWidth, -Math.random() * maxHeight)
      }

      // 下半部分直方图
      ctx.fillStyle = 'red'
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(startX + i * (barWidth + spacing), 200 + gap, barWidth, Math.random() * maxHeight)
      }
    },
    fetchData() {
      // 数据获取逻辑，可以根据需要自行修改
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1 // 重置为第一页
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    }
  }
}
</script>

<style scoped="scoped">
.card-item {
  margin-bottom: 20px;
}

.progress-bar {
  position: relative;
  width: 100%;
  height: 20px; /* 调整百分比条的高度 */
  background-color: #f0f0f0;
  border-radius: 5px;
}

.progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 5px;
  background-color: orange;
  transition: width 0.5s; /* 添加过渡效果 */
}

.progress-label {
  position: absolute;
  bottom: -20px;
  left: 5px;
}
.export-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 25px;
  width: 45px;
  height: 45px;
  color: #ffff;
  background-color: #c8d0d4;
}

.export-button:hover {
  color: #409eff; /* 鼠标悬停时的颜色 */
}
</style>
