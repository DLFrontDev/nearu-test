<template>
  <ContentContainer id="page-show">
    <Transition name="fade" mode="out-in">
      <div class="loading-container" v-if="loading.show && loading.season">
        <Spinner />
      </div>
      <div class="show-detail" v-else-if="show && season">
        <div class="show-info-container">
          <div class="show-image-container">
            <picture v-if="show.image">
              <img :src="show.image" />
            </picture>
            <p class="missing-image" v-else>Missing image</p>
          </div>
          <h1 class="show-title">{{ show.name }}</h1>
          <div class="show-info">
            <p>{{ show.type }}</p>
            <p v-if="show.premiered && show.ended">
              Aired from <b>{{ show.premiered }}</b> to
              <b>{{ show.ended }}</b>
            </p>
            <div class="description" v-html="show.summary" />
          </div>
        </div>
        <div class="season-list-container">
          <h3>Seasons</h3>
          <ul>
            <li v-for="season in show.seasons">
              <button
                @click="selectedSeason = season.id"
                :class="{ active: selectedSeason == season.id }"
              >
                {{ season.number }}
              </button>
            </li>
          </ul>
          <div class="episode-count">{{ season.episodeOrder }} episodes</div>
        </div>
        <Transition name="fade" mode="out-in">
          <div class="loading-container" v-if="loading.season">
            <Spinner />
          </div>
          <div class="episode-list-container" v-else>
            <div class="list-label">
              <div class="label-number">N</div>
              <div class="label-name">Episode Name</div>
              <div class="label-runtime">Runtime</div>
              <div class="label-airdate">Air date</div>
            </div>
            <ul>
              <li v-for="episode in episodeList">
                <RouterLink :to="`/show/${show.id}/episode/${episode.id}`">
                  <div class="episode-number">
                    {{ episode.number || "S" }}
                  </div>
                  <div class="episode-name">
                    {{ episode.name }}
                  </div>
                  <div class="episode-runtime">{{ episode.runtime }}min</div>
                  <div class="episode-airdate">
                    {{ episode.airdate }}
                  </div>
                </RouterLink>
              </li>
            </ul>
          </div>
        </Transition>
      </div>
    </Transition>
  </ContentContainer>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import ContentContainer from "@/components/ContentContainer.vue";
import Spinner from "@/components/Spinner.vue";
import { useShowStore } from "@/store";

const route = useRoute();
const store = useShowStore();

const loading = ref({
  show: false,
  season: false,
});
const selectedSeason: Ref<number | undefined> = ref();

const routeParamShowId = computed(() =>
  parseInt(
    typeof route.params.showId == "string"
      ? route.params.showId
      : route.params.showId[0]
  )
);
const routeQuerySeason = computed(() =>
  route.query.season ? parseInt(route.query.season as string) : undefined
);

const show = computed(() => store.getShow(routeParamShowId.value));

const season = computed(() =>
  selectedSeason.value ? store.getSeason(selectedSeason.value) : undefined
);

const episodeList = computed(() =>
  season.value ? store.getSeasonEpisodes(season.value?.id) : undefined
);

watch(
  routeParamShowId,
  () => {
    store.getShowData(routeParamShowId.value).then(() => {
      loading.value.show = false;

      const show = store.getShow(routeParamShowId.value);

      // Select season from query when returning from episode
      selectedSeason.value = routeQuerySeason.value
        ? show?.seasons.find((s) => s.number == routeQuerySeason.value)?.id
        : show?.seasons[0].id;
    });
  },
  {
    immediate: true,
  }
);

watch(selectedSeason, () => {
  if (selectedSeason.value) {
    loading.value.season = true;

    store.getSeasonEpisodesData(selectedSeason.value).then(() => {
      loading.value.season = false;
    });
  }
});
</script>

<style lang="scss" scoped>
#page-show {
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

  @include fade-transition;

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  > .loading-container {
    min-height: 500px;
  }

  .show-info-container {
    display: grid;
    row-gap: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid $color-light-grey;
    margin-bottom: 32px;

    @media screen and (min-width: $break-md-min) {
      grid-template-columns: auto 1fr;
      grid-template-rows: auto 1fr;
      column-gap: 32px;
    }

    .show-image-container {
      grid-area: 2 / 1 / 3 / 2;
      display: flex;
      justify-content: center;

      @media screen and (min-width: $break-md-min) {
        grid-area: 1 / 1 / 3 / 2;
      }

      img {
        display: block;
        max-width: 100%;
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

    .show-title {
      font-size: 24px;
      margin: 0;
      text-align: center;

      @media screen and (min-width: $break-md-min) {
        font-size: 32px;
        text-align: left;
      }
    }

    .show-info {
      :deep(p) {
        margin: 0 0 12px;
      }
    }
  }

  .season-list-container {
    margin-bottom: 32px;
    display: grid;
    gap: 20px;

    @media screen and (min-width: $break-sm-min) {
      grid-template-rows: auto auto;
      grid-template-columns: 1fr auto;
      align-items: center;
    }

    h3 {
      margin: 0;
    }

    ul {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      @include reset-ul;
      grid-area: 2 / 1 / 3 / 2;

      li {
        button {
          @include reset-button;
          color: $color-white;
          border-radius: 8px;
          padding: 10px;
          opacity: 0.3;
          font-size: 24px;
          font-weight: 700;
          transition: all 0.3s ease-in-out;
          width: 48px;
          height: 48px;

          &.active,
          &:hover {
            color: $color-dark-grey;
            background: $color-white;
            opacity: 1;
          }
        }
      }
    }

    .episode-count {
      font-size: 18px;

      @media screen and (min-width: $break-sm-min) {
        grid-area: 2 / 2 / 3 / 3;
      }
    }
  }

  .episode-list-container {
    .list-label {
      display: grid;
      gap: 16px;
      grid-template-columns: 20px 1fr;
      margin-bottom: 24px;

      @media screen and (min-width: $break-md-min) {
        grid-template-columns: 20px 1fr 60px 80px;
      }

      .label-runtime,
      .label-airdate {
        display: none;

        @media screen and (min-width: $break-md-min) {
          display: block;
          text-align: right;
        }
      }
    }

    ul {
      display: grid;
      gap: 12px;
      @include reset-ul;

      li {
        &:not(:last-child) {
          padding-bottom: 12px;
          border-bottom: 1px solid $color-light-grey;
        }

        a {
          display: grid;
          gap: 16px;
          grid-template-columns: 20px 1fr;
          text-decoration: none;
          color: $color-white;
          transition: all 0.3s ease-in-out;

          @media screen and (min-width: $break-md-min) {
            grid-template-columns: 20px 1fr 60px 80px;
          }

          &:hover {
            color: $color-blue;
          }

          .episode-runtime,
          .episode-airdate {
            display: none;

            @media screen and (min-width: $break-md-min) {
              display: block;
              text-align: right;
            }
          }
        }
      }
    }
  }
}
</style>
