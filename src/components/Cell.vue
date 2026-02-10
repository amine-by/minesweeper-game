<script setup lang="ts">
defineProps({
  isHidden: Boolean,
  isMine: Boolean,
});
</script>

<template>
  <button @click.left="$emit('reveal')" />
</template>
