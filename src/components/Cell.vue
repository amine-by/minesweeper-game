<script setup lang="ts">
defineProps({
  state: String,
  isMine: Boolean,
  adjacentMinesCount: Number,
});
</script>

<template>
  <button @click.left="$emit('reveal')" @click.right="$emit('flag')" />
</template>
