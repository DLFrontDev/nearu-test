export type SeasonApiData = {
  id: number;
  url: string;
  number: number;
  name: string;
  episodeOrder: number;
  premiereDate: string | null;
  endDate: string | null;
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
  episodes: number[];

  constructor(data: SeasonApiData) {
    this.id = data.id;
    this.number = data.number;
    this.episodeOrder = data.episodeOrder;
    this.episodes = [];
  }
}
