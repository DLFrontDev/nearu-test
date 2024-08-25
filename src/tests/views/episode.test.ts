import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { VueWrapper, flushPromises, mount } from "@vue/test-utils";
import { useShowStore } from "@/store";
import { testEpisodeId, testShowId } from "@/constants/tests";
import router from "@/router";
import Episode from "@/views/Episode.vue";

describe("Episode View", () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    // Creates a pinia instance to be used by store initializer
    setActivePinia(createPinia());

    router.push(`/show/${testShowId}/episode/${testEpisodeId}`);
    await router.isReady();

    const store = useShowStore();
    await store.getEpisodeData(testEpisodeId);

    wrapper = mount(Episode, {
      global: {
        plugins: [router],
      },
    });

    await flushPromises();
  });

  it.concurrent("Render episode information", async () => {
    const store = useShowStore();
    const episode = store.getEpisode(testEpisodeId);

    const episodeInfoContainer = wrapper.find(".episode-info-container");
    expect(episodeInfoContainer.exists()).toBe(true);

    if (episode) {
      expect(episodeInfoContainer.find(".episode-title").html()).toContain(
        episode.name
      );

      expect(
        episodeInfoContainer
          .find(
            `.episode-image picture,
            .episode-image .missing-image`
          )
          .exists()
      ).toBe(true);

      expect(episodeInfoContainer.find(".episode-title").html()).toContain(
        episode.name
      );

      expect(
        episodeInfoContainer.find(".episode-info .description").html()
      ).toContain(episode.summary);
    }
  });

  it.concurrent("Navigate to show detail", async () => {
    const store = useShowStore();
    const episode = store.getEpisode(testEpisodeId);

    if (episode) {
      const push = vi.spyOn(router, "push");
      wrapper.find(".back-container a").trigger("click");

      expect(push).toBeCalledTimes(1);
      expect(push).toBeCalledWith(
        `/show/${testShowId}?season=${episode.season}`
      );
    }
  });
});
