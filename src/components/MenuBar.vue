<template>
  <nav id="page-header">
    <ContentContainer class="header-container">
      <RouterLink to="/">Home</RouterLink>
      <div class="link-container">
        <RouterLink to="/show/1955">Original Series</RouterLink>
        <RouterLink to="/show/26437">Powerpuff Z</RouterLink>
        <RouterLink to="/show/6771">Powerpuff 2016</RouterLink>
      </div>
      <div class="btn-container">
        <button @click="toggleModal">Other Series</button>
      </div>
    </ContentContainer>
    <Teleport to="body">
      <Transition name="fade">
        <div class="modal" v-if="modalActive">
          <ContentContainer class="modal-content">
            <div class="link-container">
              <RouterLink @click="toggleModal" to="/show/1955"
                >Original Series</RouterLink
              >
              <RouterLink @click="toggleModal" to="/show/26437"
                >Powerpuff Z</RouterLink
              >
              <RouterLink @click="toggleModal" to="/show/6771"
                >Powerpuff 2016</RouterLink
              >
            </div>
          </ContentContainer>
        </div>
      </Transition>
    </Teleport>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ContentContainer from "@/components/ContentContainer.vue";

const modalActive = ref();

const toggleModal = () => {
  modalActive.value = !modalActive.value;
};
</script>

<style lang="scss" scoped>
#page-header {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  padding: 12px 0;
  background-color: $color-grey;
  border-bottom: 1px solid $color-light-grey;
  z-index: 1;

  .header-container {
    display: flex;
    gap: 24px;
    justify-content: space-between;

    @media screen and (min-width: $break-sm-min) {
      justify-content: flex-start;
    }
  }

  .link-container {
    display: none;
    margin-left: 24px;
    gap: 16px;

    @media screen and (min-width: $break-sm-min) {
      display: flex;
    }
  }

  .btn-container {
    @media screen and (min-width: $break-sm-min) {
      display: none;
    }

    button {
      font-size: 16px;
      color: $color-white;
      font-weight: 700;
      @include reset-button;
    }
  }
}

.modal {
  position: fixed;
  top: 45px;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  background: $color-dark-grey;

  @media screen and (min-width: $break-sm-min) {
    display: none;
  }

  .modal-content {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  .link-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

a {
  color: $color-white;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease-in-out;

  &:hover {
    color: $color-blue;
  }
}

@include fade-transition;
</style>
