<script setup lang="ts">
defineProps({
  isHidden: Boolean,
  isMine: Boolean,
  adjacentMinesCount: Number,
});
</script>

<template>
  <button @click.left="$emit('reveal')" />
</template>
