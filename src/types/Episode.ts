import { convertDate } from "@/utils/convertDate";

export type EpisodeApiData = {
  id: number;
  url: string;
  name: string;
  season: number;
  number: number;
  type: string;
  airdate: string | null;
  airtime: string;
  airstamp: string;
  runtime: number;
  rating: {
    average: null;
  };
  image: {
    medium: string;
    original: string;
  } | null;
  summary: string;
  _links: {
    self: {
      href: string;
    };
    show: {
      href: string;
      name: string;
    };
  };
};

export class Episode {
  id: number;
  name: string;
  season: number;
  number: number;
  type: string;
  airdate: string | null;
  runtime: number;
  image: string | undefined;
  summary: string;

  constructor(data: EpisodeApiData) {
    this.id = data.id;
    this.name = data.name;
    this.season = data.season;
    this.number = data.number;
    this.type = data.type;
    this.airdate = convertDate(data.airdate);
    this.runtime = data.runtime;
    this.image = data.image?.original;
    this.summary = data.summary;
  }
}
