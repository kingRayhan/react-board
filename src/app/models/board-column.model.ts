import { ICard } from "./card.model";

export interface IBoardColumn {
  id?: string;
  name: string;
  index: number;
  cards?: ICard[];
}
