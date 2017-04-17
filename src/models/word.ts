export interface Word {
  wordID: number,
  word: string,
  type: string,
  lessonID: number,
  meaning: string,
  phienAm: string,
  favorite: number,
  linkAudio: string,
  linkImg: string,
  examples: Example[],
  families: Family[]
}

export  interface Example {
    ID: number,
    sentence: string,
    wordID: number
}

export  interface Family {
    ID: number,
    word: string,
    wordID: number,
    type: string,
    example: string
}