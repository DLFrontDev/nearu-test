import { Episode, EpisodeApiData } from "@/types/Episode";
import { Season } from "@/types/Season";
import { Show, ShowApiData } from "@/types/Show";
import { createPinia, defineStore } from "pinia";
import { computed, Ref, ref } from "vue";
import { useRoute } from "vue-router";

const getTypes = (obj: any) =>
  Object.entries(obj)
    .map(([p, v]): string => {
      switch (typeof v) {
        case "object":
          if (v) {
            return Array.isArray(v)
              ? `${p}: 
            ${getTypes(v[0])}[]`
              : `${p}: {
            ${getTypes(v)}
          }`;
          } else {
            return `${p}: ${v}`;
          }

        default:
          return `${p}: ${typeof v}`;
      }
    })
    .join("; ");

export const useShowStore = defineStore("show", () => {
  const shows: Ref<Show[]> = ref([]);
  const seasons: Ref<Season[]> = ref([]);
  const episodes: Ref<Episode[]> = ref([]);

  const getShowData = (showId: number) =>
    fetch(`https://api.tvmaze.com/shows/${showId}?embed=seasons`)
      .then((response) => response.json())
      .then((data: ShowApiData) => {
        shows.value.push(new Show(data));

        data._embedded.seasons.forEach((s) => {
          if (!seasons.value.find((sR) => sR.id == s.id)) {
            seasons.value.push(new Season(s));
          }
        });

        return data.id;
      });

  const getSeasonEpisodesData = (seasonId: number) =>
    fetch(`https://api.tvmaze.com/seasons/${seasonId}/episodes`)
      .then((response) => response.json())
      .then((data: EpisodeApiData[]) => {
        const season = seasons.value.find((s) => s.id == seasonId);

        data.forEach((e) => {
          if (!episodes.value.find((eR) => eR.id == e.id)) {
            episodes.value.push(new Episode(e));
          }

          if (season) {
            season.episodes.push(e.id);
          }
        });
      });

  const getEpisodeData = (episodeId: number) =>
    fetch(`https://api.tvmaze.com/episodes/${episodeId}`)
      .then((response) => response.json())
      .then((data: EpisodeApiData) => {
        const episode = new Episode(data);

        if (!episodes.value.find((e) => e.id == episode.id)) {
          episodes.value.push(episode);
        }

        return episode;
      });

  const getShow = (showId: number) => shows.value.find((s) => s.id == showId);

  const getSeason = (seasonId: number) =>
    seasons.value.find((s) => s.id == seasonId);

  const getSeasonEpisodes = (seasonId: number) => {
    const season = seasons.value.find((s) => s.id == seasonId);

    return season
      ? episodes.value.filter((e) => season.episodes.includes(e.id))
      : undefined;
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
