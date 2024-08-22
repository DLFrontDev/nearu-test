<template>
  <MenuBar />
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<script lang="ts" setup>
import MenuBar from "@/components/MenuBar.vue";
</script>

<style lang="scss" scoped>
@include fade-transition;
</style>
