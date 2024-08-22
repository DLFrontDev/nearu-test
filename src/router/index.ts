import { createWebHistory, createRouter } from "vue-router";

import Show from "@/views/Show.vue";
import Episode from "@/views/Episode.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/show/1955" },
    { path: "/show/:showId", component: Show },
    {
      path: "/show/:showId/episode/:episodeId",
      component: Episode,
    },
  ],
});
