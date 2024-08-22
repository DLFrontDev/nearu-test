<template>
  <ContentContainer id="page-show">
    <Transition name="fade" mode="out-in">
      <div
        class="loading-container"
        v-if="loading.show || (loading.show && loading.season)"
      >
        <Spinner />
      </div>
      <div class="show-detail" v-else-if="activeShow && activeSeason">
        <div class="show-info-container">
          <div class="show-image">
            <picture>
              <img :src="activeShow.image" />
            </picture>
          </div>
          <h1 class="show-title">{{ activeShow.name }}</h1>
          <div class="show-info">
            <p>{{ activeShow.type }}</p>
            <p>
              Aired from <b>{{ activeShow.premiered }}</b> to
              <b>{{ activeShow.ended }}</b>
            </p>
            <div class="description" v-html="activeShow.summary" />
          </div>
        </div>
        <div class="season-list-container">
          <h3>Seasons</h3>
          <ul>
            <li v-for="season in activeShow.seasons">
              <button
                @click="selectedSeason = season.id"
                :class="{ active: selectedSeason == season.id }"
              >
                {{ season.number }}
              </button>
            </li>
          </ul>
          <div class="episode-count">
            {{ activeSeason.episodeOrder }} episodes
          </div>
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
              <li v-for="episode in activeEpisodeList">
                <RouterLink
                  :to="`/show/${activeShow.id}/episode/${episode.id}`"
                >
                  <div class="episode-number">
                    {{ episode.number || "S" }}
                  </div>
                  <div class="episode-name">
                    {{ episode.name }}
                  </div>
                  <div class="episode-runtime">{{ episode.runtime }}min</div>
                  <div class="episode-airdate">
                    {{ convertDate(episode.airdate) }}
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
import { ref, Ref, computed, onBeforeMount, watch } from "vue";
import { useRoute } from "vue-router";
import ContentContainer from "@/components/ContentContainer.vue";
import Spinner from "@/components/Spinner.vue";
import { useShowStore } from "@/store";
import { convertDate } from "@/utils/convertDate";

const route = useRoute();
const store = useShowStore();

const loading = ref({
  show: false,
  season: false,
});
const selectedSeason: Ref<number | undefined> = ref();

const showId = computed(() =>
  parseInt(
    typeof route.params.showId == "string"
      ? route.params.showId
      : route.params.showId[0]
  )
);

const activeShow = computed(() => store.getShow(showId.value));

const activeSeason = computed(() =>
  selectedSeason.value ? store.getSeason(selectedSeason.value) : undefined
);

const activeEpisodeList = computed(() =>
  activeSeason.value
    ? store.getSeasonEpisodes(activeSeason.value?.id)
    : undefined
);

const loadShow = async () => {
  // Check if show exists before requesting
  if (!store.getShow(showId.value)) {
    loading.value.show = true;

    await store.getShowData(showId.value);

    loading.value.show = false;
  }

  const show = store.shows.find((s) => s.id == showId.value);

  // Select season from query when returning from episode
  selectedSeason.value = route.query.season
    ? show?.seasons.find(
        (s) => s.number == parseInt(route.query.season as string)
      )?.id
    : show?.seasons[0].id;
};

const loadSeason = () => {
  // Check if season exists before requesting
  if (selectedSeason.value && !activeSeason.value?.episodes.length) {
    loading.value.season = true;

    store.getSeasonEpisodesData(selectedSeason.value).then(() => {
      loading.value.season = false;
    });
  }
};

onBeforeMount(() => {
  loadShow();
});

// Required for show to show navigation
watch(showId, () => {
  loadShow();
});

watch(selectedSeason, () => {
  loadSeason();
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

    .show-image {
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
