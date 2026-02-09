<script setup lang="ts">
defineProps({
  isHidden: Boolean,
});
</script>

<template>
  <button @click.left="$emit('reveal')" />
</template>
