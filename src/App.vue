<script setup lang="ts">
import Cell from "./components/Cell.vue";
</script>

<template>
  <div v-for="r in 8" :key="r">
    <Cell v-for="c in 8" :key="c" :is-hidden="true" />
  </div>
</template>

<style scoped></style>
