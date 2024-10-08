<template>
  <ContentContainer id="page-episode" v-if="episode">
    <div class="back-container">
      <RouterLink :to="`/show/${$route.params.showId}?season=${episode.season}`"
        >Return</RouterLink
      >
    </div>
    <Transition name="fade" mode="out-in">
      <div class="loading-container" v-if="loading">
        <Spinner />
      </div>
      <div class="episode-info-container" v-else>
        <div class="episode-image">
          <picture v-if="episode.image">
            <img :src="episode.image" />
          </picture>
          <p class="missing-image" v-else>Missing image</p>
        </div>
        <div class="episode-title">
          <h1>{{ episode.name }}</h1>
        </div>
        <div class="episode-info">
          <p>{{ episode.runtime }} minutes</p>
          <p>Aired {{ episode.airdate }}</p>
          <div class="description" v-html="episode.summary" />
        </div>
      </div>
    </Transition>
  </ContentContainer>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useShowStore } from "@/store";
import ContentContainer from "@/components/ContentContainer.vue";
import Spinner from "@/components/Spinner.vue";

const route = useRoute();
const store = useShowStore();

const loading = ref(false);

const routeParamEpisodeId = computed(() =>
  parseInt(
    typeof route.params.episodeId == "string"
      ? route.params.episodeId
      : route.params.episodeId[0]
  )
);

const episode = computed(() => store.getEpisode(routeParamEpisodeId.value));

watch(
  routeParamEpisodeId,
  () => {
    if (!store.getEpisode(routeParamEpisodeId.value)) {
      loading.value = true;

      store.getEpisodeData(routeParamEpisodeId.value).then(() => {
        loading.value = false;
      });
    }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
#page-episode {
  padding-top: 24px;
  padding-bottom: 40px;

  @media screen and (min-width: $break-md-min) {
    padding-top: 40px;
    padding-bottom: 60px;
  }

  @media screen and (min-width: $break-xl-min) {
    padding-top: 64px;
    padding-bottom: 80px;
  }

  .back-container {
    margin-bottom: 20px;

    a {
      color: $color-white;
      text-decoration: none;
      font-weight: 700;
      font-size: 20px;
      transition: all 0.3s ease-in-out;

      &:hover {
        color: $color-blue;
      }
    }
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
  }

  .episode-info-container {
    display: grid;
    gap: 16px 32px;

    @media screen and (min-width: $break-md-min) {
      grid-template-columns: 300px 1fr;
      grid-template-rows: auto 1fr;
    }

    .episode-image {
      display: flex;
      justify-content: center;
      align-items: center;

      @media screen and (min-width: $break-md-min) {
        grid-area: 1 / 1 / 3 / 2;
      }

      picture {
        img {
          display: block;
          max-width: 100%;
        }
      }

      .missing-image {
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid $color-light-grey;
        border-radius: 8px;
        width: 100%;
        height: 100%;
        padding: 10px;
        margin: 0;
      }
    }

    .episode-title {
      h1 {
        margin: 0;
      }
    }

    .episode-info {
      :deep(p) {
        margin: 0 0 16px;

        &:last-child {
          margin: 0;
        }
      }
    }
  }
}
</style>
