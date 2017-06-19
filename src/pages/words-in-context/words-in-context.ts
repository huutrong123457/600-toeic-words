import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';

import { WordsInContextQuestion, WordsInContextKey } from '../../models/words-in-context';
import { Lesson } from '../../models/lesson';

import { SQLite } from 'ionic-native';

@Component({
  selector: 'page-words-in-context',
  templateUrl: 'words-in-context.html'
})
export class WordsInContext {

  selectedLesson: Lesson;
  wordInContextObj: WordsInContextQuestion;
  wordInContextKeys: Array<WordsInContextKey>;
  questionTextToArray: Array<QuestionTextItem>;
  lastText: number;
  showPoint: boolean = false;
  point: number = 0;
  checkAnswer: boolean = false;
  showErr: boolean = false;

  public database: SQLite;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public platform: Platform) {

    this.selectedLesson = navParams.data;
    //
    this.database = new SQLite();
    // when platform ready-> open DB and load data from words table in db 
    platform.ready().then(() => {
      this.database.openDatabase({
        name: 'toeic-voca.db',
        location: 'default'
      }).then((successed) => {
        this.loadWordsInContextLesson(this.selectedLesson.lessonID);

      }, (err) => {
        console.log("Error opening database: " + err);
        alert("Error opening database: " + err);
      });
    });
  }

  doCheck() {
    let validCount = 0;
    this.questionTextToArray.forEach(q => {
      if (q.keyChoose.trim() == '') {
        q.cssClass = 'invalid';
        validCount++;
      }
    });
    if (validCount != 1) {
      this.showErr = true;
      return;
    }
    this.showErr = false;
    if (!this.checkAnswer) {
      for (let i = 0; i < this.questionTextToArray.length - 1; i++) {
        let key = this.wordInContextObj.keys[i].AnswerKey;
        if (this.questionTextToArray[i].keyChoose == key) {
          this.questionTextToArray[i].cssClass = 'correct';
          this.point++;
        } else {
          this.questionTextToArray[i].cssClass = 'wrong';
        }

      }
      this.checkAnswer = true;
      this.showPoint = true;
    }
  }

  showAnswer() {
    for (let i = 0; i < this.questionTextToArray.length - 1; i++) {
      this.questionTextToArray[i].keyChoose = this.wordInContextObj.keys[i].AnswerKey;
      this.questionTextToArray[i].cssClass = 'correct';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WordsInContextPage');
  }

  loadWordsInContextLesson(selectedLessonID) {
    // check if array lesson is empty
    if (!this.wordInContextObj) {
      // using loading controller to create loading icon while loading data
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      // display loading icon
      loading.present();
      // get data and push in to array this.lessons
      this.database.executeSql("SELECT * FROM word_in_context WHERE LessonID=" + selectedLessonID, []).then((data) => {
        if (data.rows.length > 0) {
          this.wordInContextObj = {
            ID: data.rows.item(0).ID,
            LessonID: data.rows.item(0).LessonID,
            QuestionText: data.rows.item(0).QuestionText,
            keys: []
          }

          let tempArray = this.wordInContextObj.QuestionText.split('|');
          this.questionTextToArray = [];
          for (let q in tempArray) {
            let questiemItem: QuestionTextItem =
              { text: tempArray[q], keyChoose: '', cssClass: '' };
            this.questionTextToArray.push(questiemItem);
          }
          this.lastText = this.questionTextToArray.length - 1;

          this.getKeysData(this.wordInContextObj);
          this.wordInContextKeys = this.wordInContextObj.keys;
          loading.dismiss(); // disappear icon loading when done
        }
        else { // when data is empty
          loading.dismiss(); // disappear icon loading when done
        }
      }, (error) => {
        console.log("ERROR: " + JSON.stringify(error));
        alert("error: " + error);
        loading.dismiss(); // disappear icon loading even if error
      });
    }
  }

  getKeysData(wordInContextObj) {
    this.database.executeSql("SELECT * FROM word_in_context_key WHERE WordInContextID=" + wordInContextObj.ID, []).then((data) => {
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          wordInContextObj.keys.push({
            ID: data.rows.item(i).ID,
            OrderWord: data.rows.item(i).OrderWord,
            AnswerKey: data.rows.item(i).AnswerKey,
            WordInContextID: data.rows.item(i).WordInContextID
          });
        }
      }
    }, (error) => {
      console.log("ERROR when get keys: " + JSON.stringify(error) + " wordInContextID:" + wordInContextObj.ID);
      alert("error when get keys: " + error + " wordInContextID:" + wordInContextObj.ID); // disappear icon loading even if error
    });
  }
}

interface QuestionTextItem {
  text: string;
  keyChoose: string;
  cssClass: string;
}
