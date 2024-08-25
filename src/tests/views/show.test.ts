import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { VueWrapper, flushPromises, mount } from "@vue/test-utils";
import { testSeasonId, testShowId } from "@/constants/tests";
import router from "@/router";
import { useShowStore } from "@/store";
import Show from "@/views/Show.vue";

describe("Show View", () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    // Creates a pinia instance to be used by store initializer
    setActivePinia(createPinia());

    router.push("/");
    await router.isReady();

    const store = useShowStore();
    await store.getShowData(testShowId);
    await store.getSeasonEpisodesData(testSeasonId);

    wrapper = mount(Show, {
      global: {
        plugins: [router],
      },
    });

    await flushPromises();
  });

  it.concurrent("Render show information", async () => {
    const store = useShowStore();
    const show = store.getShow(testShowId);

    const showInfoContainer = wrapper.find(".show-info-container");
    expect(showInfoContainer.exists()).toBe(true);

    if (show) {
      expect(showInfoContainer.find("h1.show-title").html()).toContain(
        show.name
      );

      expect(
        showInfoContainer
          .find(
            `.show-image-container picture,
            .show-image-container .missing-image`
          )
          .exists()
      ).toBe(true);

      expect(showInfoContainer.find(".description p").html()).toContain(
        show.summary
      );
    }
  });

  it.concurrent("Render season list", async () => {
    const store = useShowStore();
    const show = store.getShow(testShowId);
    const season = store.getSeason(testSeasonId);

    const seasonListContainer = wrapper.find(".season-list-container");
    expect(seasonListContainer.exists()).toBe(true);

    if (show && season) {
      expect(seasonListContainer.findAll("ul li").length).toBe(
        show.seasons.length
      );

      expect(seasonListContainer.find(".episode-count").html()).toContain(
        `${season.episodeOrder} episodes`
      );
    }
  });

  it.concurrent("Render episode list", async () => {
    const store = useShowStore();
    const season = store.getSeason(testSeasonId);

    const episodeListContainer = wrapper.find(".episode-list-container");
    expect(episodeListContainer.exists()).toBe(true);

    if (season) {
      expect(episodeListContainer.findAll("ul li").length).toBe(
        season.episodes.length
      );
    }
  });

  it.concurrent("Render season by parameter", async () => {
    await router.push(`/show/${testShowId}?season=2`);
    await router.isReady();

    wrapper = mount(Show, {
      global: {
        plugins: [router],
      },
    });

    await flushPromises();

    expect(
      wrapper.find(".season-list-container ul li:nth-child(2) button").classes()
    ).toContain("active");
  });

  it("Change selected season", async () => {
    const triggerButton = wrapper.find(
      ".season-list-container ul li:nth-child(2) button"
    );

    await triggerButton.trigger("click");

    expect(triggerButton.classes()).toContain("active");
  });

  it("Navigate to episode detail", () => {
    const store = useShowStore();
    const push = vi.spyOn(router, "push");
    wrapper.find(".episode-list-container ul li a").trigger("click");

    expect(push).toBeCalledTimes(1);
    expect(push).toBeCalledWith(
      `/show/${testShowId}/episode/${store.episodes[0].id}`
    );
  });
});
