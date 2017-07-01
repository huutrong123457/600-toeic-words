import { Word } from "./word";

export interface QuestionGame {
  keyword:       Word,
  word1:         Word,
  word2:         Word,
  word3: Word,
  indexKey: number;
}
