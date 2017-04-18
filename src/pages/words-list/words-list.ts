import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';

import { SQLite } from 'ionic-native';

import { Word, Example, Family } from '../../models/word';
import { Lesson} from '../../models/lesson';

@Component({
  selector: 'page-words-list',
  templateUrl: 'words-list.html',
})
export class WordsList {

  // object connect to db
  public database: SQLite;
  // words list 
  public words: Array<Word>;

  // examples list 
  public examplesTemp: Array<Example>;

  // families list 
  public familiesTemp: Array<Family>;

  selectedLesson: Lesson;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public platform: Platform) {
    // get selected lesson from homePage
    this.selectedLesson = navParams.data;
    // create object sqlite
    this.database = new SQLite();
    // when platform ready-> open DB and load data from sounds table in db
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

  goToWordsDetail(word){

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
              wordID: wordsData.rows.item(i).WordID,
              word: wordsData.rows.item(i).Word,
              type: wordsData.rows.item(i).Type,
              lessonID: wordsData.rows.item(i).LessonID,
              meaning: wordsData.rows.item(i).Meaning,
              favorite: wordsData.rows.item(i).Favorite,
              phienAm: wordsData.rows.item(i).PhienAm,
              linkImg: wordsData.rows.item(i).linkImage,
              linkAudio: wordsData.rows.item(i).linkAudio,
              examples: [],
              families: []
            }
//
            // GET examples for wordTemp
            this.database.executeSql("SELECT * FROM examples WHERE WordID=" + wordTemp.wordID, []).then((examplesData) => {
              if (examplesData.rows.length > 0) {
                for (var i = 0; i < examplesData.rows.length; i++) {
                  wordTemp.examples.push({
                    wordID:   examplesData.rows.item(i).ID,
                    ID:       examplesData.rows.item(i).ExampleID,
                    sentence: examplesData.rows.item(i).Sentence
                  });
                }
              }
            }, (error) => {
              console.log("ERROR when get examples: " + JSON.stringify(error) +" wordID:" + wordTemp.wordID);
              alert("error when get examples: " + error +" wordID:" + wordTemp.wordID); // disappear icon loading even if error
            }); // end GET examples


            // GET word families for wordTemp
            this.database.executeSql("SELECT * FROM families WHERE WordID=" + wordTemp.wordID, []).then((familiesData) => {
              if (familiesData.rows.length > 0) {
                for (var i = 0; i < familiesData.rows.length; i++) {
                  wordTemp.families.push({
                    wordID:   familiesData.rows.item(i).ID,
                    ID:       familiesData.rows.item(i).FamilyID,
                    word:     familiesData.rows.item(i).Word,
                    type:     familiesData.rows.item(i).Type,
                    example:  familiesData.rows.item(i).Example
                  });
                }
              }
            }, (error) => {
              console.log("ERROR when get words families: " + JSON.stringify(error) +" wordID:" + wordTemp.wordID);
              alert("error when get words families: " + error +" wordID:" + wordTemp.wordID); // disappear icon loading even if error
            }); // end GET word families
 // 
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
