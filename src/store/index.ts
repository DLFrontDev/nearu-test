import { Episode, EpisodeApiData } from "@/types/Episode";
import { Season } from "@/types/Season";
import { Show, ShowApiData } from "@/types/Show";
import { createPinia, defineStore } from "pinia";
import { Ref, ref } from "vue";

export const useShowStore = defineStore("show", () => {
  const shows: Ref<Show[]> = ref([]);
  const seasons: Ref<Season[]> = ref([]);
  const episodes: Ref<Episode[]> = ref([]);

  const getShowData = (showId: number) => {
    const show = getShow(showId);

    if (!show) {
      return fetch(`https://api.tvmaze.com/shows/${showId}?embed=seasons`)
        .then((response) => response.json())
        .then((data: ShowApiData) => {
          if (!getShow(data.id)) {
            shows.value.push(new Show(data));
          }

          data._embedded.seasons.forEach((s) => {
            if (!getSeason(s.id)) {
              seasons.value.push(new Season(s));
            }
          });
        });
    }

    // Return resolved promise in case data already exists
    return Promise.resolve();
  };

  const getSeasonEpisodesData = (seasonId: number) => {
    const season = getSeason(seasonId);
    const seasonEpisodes = getSeasonEpisodes(seasonId);

    // Fetch in case that seasonEpisodes do not exist or are incomplete
    if (
      !seasonEpisodes.length ||
      season?.episodes.length != seasonEpisodes?.length
    ) {
      return fetch(`https://api.tvmaze.com/seasons/${seasonId}/episodes`)
        .then((response) => response.json())
        .then((data: EpisodeApiData[]) => {
          const season = getSeason(seasonId);

          data.forEach((e) => {
            if (!getEpisode(e.id)) {
              episodes.value.push(new Episode(e));
            }

            if (season && !season.episodes.includes(e.id)) {
              season.episodes.push(e.id);
            }
          });
        });
    }

    // Return resolved promise in case data already exists
    return Promise.resolve();
  };

  const getEpisodeData = (episodeId: number) => {
    // Fetch in case that episode does not exist or is incomplete
    if (!getEpisode(episodeId)) {
      return fetch(`https://api.tvmaze.com/episodes/${episodeId}`)
        .then((response) => response.json())
        .then((data: EpisodeApiData) => {
          const episode = new Episode(data);

          episodes.value.push(episode);
        });
    }

    // Return resolved promise in case data already exists
    return Promise.resolve();
  };

  const getShow = (showId: number) => shows.value.find((s) => s.id == showId);

  const getSeason = (seasonId: number) =>
    seasons.value.find((s) => s.id == seasonId);

  const getSeasonEpisodes = (seasonId: number) => {
    const season = seasons.value.find((s) => s.id == seasonId);

    return season
      ? episodes.value
          .filter((e) => season.episodes.includes(e.id))
          .sort((a, b) => (a.number ? a.number - b.number : 1))
      : [];
  };

  const getEpisode = (episodeId: number) =>
    episodes.value.find((e) => e.id == episodeId);

  return {
    shows,
    seasons,
    episodes,

    getShowData,
    getSeasonEpisodesData,
    getEpisodeData,

    getShow,
    getSeason,
    getSeasonEpisodes,
    getEpisode,
  };
});

export const Pinia = createPinia();
