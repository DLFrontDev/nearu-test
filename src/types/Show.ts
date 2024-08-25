import { convertDate } from "@/utils/convertDate";
import { SeasonApiData } from "./Season";

export type ShowApiData = {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number;
  averageRuntime: number;
  premiered: string | null;
  ended: string | null;
  officialSite: null;
  schedule: {
    time: string;
    days: string[];
  };
  rating: {
    average: number;
  };
  weight: number;
  network: {
    id: number;
    name: string;
    country: {
      code: string;
      name: string;
      timezone: string;
    };
    officialSite: null;
  };
  webChannel: null;
  dvdCountry: null;
  externals: {
    tvrage: number;
    thetvdb: number;
    imdb: string;
  };
  image: {
    medium: string;
    original: string;
  };
  summary: string;
  updated: number;
  _embedded: {
    seasons: SeasonApiData[];
  };
  _links: {
    self: {
      href: string;
    };
    previousepisode: {
      href: string;
      name: string;
    };
  };
};

export class Show {
  id: number;
  name: string;
  type: string;
  premiered: string | null;
  ended: string | null;
  image: string | null;
  summary: string;
  seasons: { id: number; number: number }[];

  constructor(data: ShowApiData) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.premiered = convertDate(data.premiered);
    this.ended = convertDate(data.ended);
    this.image = data.image?.medium;
    this.summary = data.summary;
    this.seasons = data._embedded.seasons.map((s) => ({
      id: s.id,
      number: s.number,
    }));
  }
}
