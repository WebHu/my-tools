<template>
  <el-config-provider>
    <router-view v-if="!error" />
    <el-alert
      v-else
      :title="error"
      type="error"
      :closable="false"
      center
      show-icon
    />
  </el-config-provider>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const error = ref(null)

onErrorCaptured((err) => {
  error.value = err.message
  return false
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100%;
}
</style>