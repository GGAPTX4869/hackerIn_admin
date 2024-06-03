<!--
  Description：
  @date：2024-03-31 15:10
  @author：JokerWang
-->

<template>
  <el-card style="border-radius: 10px">
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div style="font-size: 18px">解题动态列表</div>
      <div style="vertical-align: center">
        <el-button
          type="danger"
          size="default"
          icon="Delete"
          @click="handlerMuchDel"
          :loading="isDeleting"
        >
          {{ deletingMessage }}
        </el-button>
      </div>
    </div>
    <el-table
      style="margin: 10px 0"
      border
      :data="challengeStore.challengeList"
      :default-sort="{ prop: 'createtime', order: 'descending' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label=""
        width="40px"
        align="center"
        type="selection"
      ></el-table-column>
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="60px"
      ></el-table-column>
      <el-table-column
        label="题目名称"
        align="center"
        prop="challengename"
        width="140px"
        sortable
      ></el-table-column>
      <el-table-column
        label="镜像名称"
        align="center"
        prop="imagename"
        width="140px"
        sortable
      ></el-table-column>
      <el-table-column
        label="题目Flag"
        align="center"
        prop="flag"
        width="240px"
      ></el-table-column>
      <el-table-column
        label="题目类型"
        align="center"
        prop="challengetype"
        width="140px"
        sortable
      ></el-table-column>
      <el-table-column
        label="赛题来源"
        align="center"
        prop="comptype"
        width="140px"
        sortable
      ></el-table-column>
      <el-table-column
        label="题目状态"
        align="center"
        prop="status"
        width="120px"
        sortable
      >
        <template #="{ row, $index }">
          <el-check-tag
            :checked="row.status == 1"
            type="success"
            @change="changeStatus(row)"
          >
            {{ row.status == 1 ? '启用' : '禁用' }}
          </el-check-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="default"
            icon="Edit"
            @click="editChallenge(row)"
          ></el-button>
          <el-popconfirm
            title="确认删除吗?"
            icon="delete"
            confirm-button-type="danger"
            cancel-button-type="warning"
            @confirm="deleteChallenge(row)"
          >
            <template #reference>
              <el-button type="danger" size="default" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageCurrent"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :small="small"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper,"
      :total="challengeStore.challengeTotal"
      @current-change="getDokImgInfoList"
      @size-change="sizeChange"
    />
  </el-card>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>
