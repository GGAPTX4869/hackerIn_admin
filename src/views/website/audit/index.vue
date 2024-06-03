<!--
  Description：
  @date：2024-04-08 1:31
  @author：JokerWang
-->

<template>
  <el-card>
    <div class="demo-collapse">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item name="1">
          <template #title>
            <div>
              <el-badge
                :value="challengeStore.challengeAuditTotal"
                class="item"
                :show-zero="false"
              >
                <span
                  style="
                    font-size: 16px;
                    font-weight: bolder;
                    color: rgb(50 50 50 / 71%);
                  "
                >
                  待审批赛题
                </span>
              </el-badge>
            </div>
          </template>
          <Challenge />
        </el-collapse-item>
        <el-collapse-item name="2">
          <template #title>
            <el-badge
              :value="challengeStore.WpAuditTotal"
              class="item"
              :show-zero="false"
            >
              <span
                style="
                  font-size: 16px;
                  font-weight: bolder;
                  color: rgb(50 50 50 / 71%);
                "
              >
                待审批WP
              </span>
            </el-badge>
          </template>
          <WriteUp />
        </el-collapse-item>
        <el-collapse-item name="3">
          <template #title>
            <el-badge
              :value="challengeStore.teamAuditTotal"
              class="item"
              :show-zero="false"
            >
              <span
                style="
                  font-size: 16px;
                  font-weight: bolder;
                  color: rgb(50 50 50 / 71%);
                "
              >
                待审批队伍
              </span>
            </el-badge>
          </template>
          <Team />
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import Challenge from './challenge/index.vue'
import WriteUp from './writeup/index.vue'
import Team from './team/index.vue'
import useChallengeStore from '@/store/challenge/challenge.ts'
let challengeStore = useChallengeStore()
</script>

<style scoped></style>
