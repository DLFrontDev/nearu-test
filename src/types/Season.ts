import { convertDate } from "@/utils/convertDate";

export type SeasonApiData = {
  id: number;
  url: string;
  number: number;
  name: string;
  episodeOrder: number;
  premiereDate: string;
  endDate: string;
  network: {
    id: number;
    name: string;
    country: {
      name: string;
      code: string;
      timezone: string;
    };
    officialSite: null;
  };
  webChannel: null;
  image: null;
  summary: null;
  _links: {
    self: {
      href: string;
    };
  };
};

export class Season {
  id: number;
  number: number;
  episodeOrder: number;
  premiereDate: string;
  endDate: string;
  episodes: number[];

  constructor(data: SeasonApiData) {
    this.id = data.id;
    this.number = data.number;
    this.episodeOrder = data.episodeOrder;
    this.premiereDate = convertDate(data.premiereDate);
    this.endDate = convertDate(data.endDate);
    this.episodes = [];
  }
}
