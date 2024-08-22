<template>
  <div class="page-container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.page-container {
  padding-left: 24px;
  padding-right: 24px;

  @media screen and (min-width: $break-md-min) {
    padding-left: 40px;
    padding-right: 40px;
  }

  @media screen and (min-width: $break-xl-min) {
    padding-left: 64px;
    padding-right: 64px;
    max-width: 1440px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
