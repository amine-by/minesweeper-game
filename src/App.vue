<script setup lang="ts"></script>

<template>
  <div v-for="r in 8" :key="r">
    <button v-for="c in 8" :key="c" data-test="cell" />
  </div>
</template>

<style scoped></style>
