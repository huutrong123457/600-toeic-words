import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';

import { SQLite } from 'ionic-native';

import { Word } from '../../models/word';
import { Lesson} from '../../models/lesson';

import { WordsDetail } from '../words-detail/words-detail';

@Component({
  selector: 'page-words-list',
  templateUrl: 'words-list.html',
})
export class WordsList {

  // object connect to db
  public database: SQLite;
  // words list 
  public words: Array<Word>;

  selectedLesson: Lesson;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public platform: Platform) {
    // get selected lesson from homePage
    this.selectedLesson = navParams.data;
    // create object sqlite
    this.database = new SQLite();
    // when platform ready-> open DB and load data from words table in db
    platform.ready().then(() => {
      this.database.openDatabase({
        name: 'toeic-voca.db',
        location: 'default',
        createFromLocation: 1
      }).then((successed) => {
        this.loadWordsData(this.selectedLesson.lessonID)  // load data when open database succefully
      }, (err) => {
        console.log("Error opening database: " + err);
        alert("Error opening database: " + err);
      });
    }
    );
  } // end constructor

  ionViewDidLoad() {
    console.log('ionViewDidLoad WordsList');
  }

  goToWordsDetail(selectedWord){
        this.navCtrl.parent.parent.push(WordsDetail, selectedWord);
  }

  // function load data
  loadWordsData(lessonSelectedID) {
    // check if array lesson is empty
    if (!this.words) {
      // using loading controller to create loading icon while loading data
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      // display loading icon
      loading.present();
      // get data and push in to array this.lessons
      this.database.executeSql("SELECT * FROM words WHERE LessonID=" + lessonSelectedID, []).then((wordsData) => {
        this.words = [];
        // alert("words total: " + wordsData.rows.length);
        if (wordsData.rows.length > 0) {
          for (var i = 0; i < wordsData.rows.length; i++) {
            // temporary variable store one word
            let wordTemp: Word = {
              wordID:     wordsData.rows.item(i).WordID,
              word:       wordsData.rows.item(i).Word,
              type:       wordsData.rows.item(i).Type,
              lessonID:   wordsData.rows.item(i).LessonID,
              meaning:    wordsData.rows.item(i).Meaning,
              favorite:   wordsData.rows.item(i).Favorite,
              phienAm:    wordsData.rows.item(i).PhienAm,
              linkImg:    wordsData.rows.item(i).linkImage,
              linkAudio:  wordsData.rows.item(i).linkAudio,
              examples:   [],
              families:   []
            }
            // Push word completed to array words
            this.words.push(wordTemp);
          } // end for loop get words

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
  } // end function getWordsData

}
