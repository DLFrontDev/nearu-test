import { setActivePinia, createPinia } from "pinia";
import { useShowStore } from "@/store";
import { beforeEach, describe, expect, it } from "vitest";
import { testEpisodeId, testSeasonId, testShowId } from "@/constants/tests";

describe("Show Store", () => {
  beforeEach(() => {
    // Creates a pinia instance to be used by store initializer
    setActivePinia(createPinia());
  });

  it.concurrent("Get show data", async () => {
    const store = useShowStore();

    expect(store.shows.length).toBe(0);
    expect(store.seasons.length).toBe(0);

    await store.getShowData(testShowId);

    const show = store.getShow(testShowId);

    expect(store.shows.length).toBe(1);
    expect(store.seasons.length).toBeGreaterThan(0);

    if (show) {
      expect(show.seasons.length).toBeGreaterThan(0);
    }
  });

  it.concurrent("Get season episodes data", async () => {
    const store = useShowStore();

    expect(store.episodes.length).toBe(0);
    await store.getShowData(testShowId);

    const season = store.getSeason(store.seasons[0].id);

    if (season) {
      await store.getSeasonEpisodesData(season.id);

      expect(store.episodes.length).toBeGreaterThan(0);
      expect(season.episodes.length).toBeGreaterThan(0);
    }
  });

  it.concurrent("Get episode data", async () => {
    const store = useShowStore();

    expect(store.episodes.length).toBe(0);
    await store.getEpisodeData(testEpisodeId);

    expect(store.episodes.length).toBeGreaterThan(0);
  });

  it.concurrent("Get show", async () => {
    const store = useShowStore();

    await store.getShowData(testShowId);

    expect(store.getShow(testShowId)).toBeTruthy();
    expect(store.getShow(1)).toBe(undefined);
  });

  it.concurrent("Get season", async () => {
    const store = useShowStore();

    await store.getShowData(testShowId);

    expect(store.getSeason(testSeasonId)).toBeTruthy();
    expect(store.getSeason(1)).toBe(undefined);
  });

  it.concurrent("Get season episodes", async () => {
    const store = useShowStore();

    await store.getShowData(testShowId);

    const season = store.getSeason(store.seasons[0].id);

    if (season) {
      await store.getSeasonEpisodesData(season.id);

      expect(store.getSeasonEpisodes(testSeasonId).length).toBeGreaterThan(0);
    }
  });

  it.concurrent("Get episode", async () => {
    const store = useShowStore();

    await store.getEpisodeData(testEpisodeId);

    expect(store.getEpisode(testEpisodeId)).toBeTruthy();
    expect(store.getEpisode(1)).toBe(undefined);
  });
});
