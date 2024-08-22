<template>
  <div class="spinner" />
</template>

<style lang="scss" scoped>
.spinner {
  width: 80px;
  height: 80px;
  border-width: 7px;
  border-style: solid;
  border-color: $color-white;
  border-bottom-color: rgba($color-white, 0.2);
  border-radius: 50%;
  animation: spin 1.5s infinite;
  animation-timing-function: linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
