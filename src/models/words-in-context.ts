export interface WordsInContextQuestion {
  ID: number,
  QuestionText: string,
  LessonID: number,
  keys:     WordsInContextKey[],
}

export  interface WordsInContextKey {
    ID:         number,
    OrderWord:   number,
    AnswerKey: string
    WordsInContextID:  number
}

