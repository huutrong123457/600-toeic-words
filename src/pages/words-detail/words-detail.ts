import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';

import { Word } from '../../models/word';
import { SQLite } from 'ionic-native';

@Component({
  selector: 'page-words-detail',
  templateUrl: 'words-detail.html',
})
export class WordsDetail {

  selectedWord: Word;
  public database: SQLite;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public platform: Platform) {
    // get selectedWord
    this.selectedWord = navParams.data;

    //
    this.database = new SQLite();
    // using loading controller to create loading icon while loading data
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    // display loading icon
    loading.present();
    // when platform ready-> open DB and load data from words table in db 
    platform.ready().then(() => {
      this.database.openDatabase({
        name: 'toeic-voca.db',
        location: 'default',
        createFromLocation: 1
      }).then((successed) => {
        this.getWordExamplesData(this.selectedWord.wordID);  // load data when open database succefully
        this.getWordsFamiliesData(this.selectedWord.wordID);

        loading.dismiss();
      }, (err) => {
        console.log("Error opening database: " + err);
        alert("Error opening database: " + err);
        loading.dismiss();
      });
    }
    );
  } // end constructor

  ionViewDidLoad() {
    console.log('ionViewDidLoad WordsDetail');
  }

  getWordData(wordID) {
    // using loading controller to create loading icon while loading data
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    // display loading icon
    loading.present();
    this.platform.ready().then(() => {
      this.database.openDatabase({
        name: 'toeic-voca.db',
        location: 'default',
        createFromLocation: 1
      }).then((successed) => {
        // load data when open database succefully
        this.database.executeSql("SELECT * FROM words WHERE WordID=" + wordID, []).then((wordsData) => {
          if (wordsData.rows.length > 0) {
            this.selectedWord = {
              wordID: wordsData.rows.item(0).WordID,
              word: wordsData.rows.item(0).Word,
              type: wordsData.rows.item(0).Type,
              lessonID: wordsData.rows.item(0).LessonID,
              meaning: wordsData.rows.item(0).Meaning,
              favorite: wordsData.rows.item(0).Favorite,
              phienAm: wordsData.rows.item(0).PhienAm,
              linkImg: wordsData.rows.item(0).linkImage,
              linkAudio: wordsData.rows.item(0).linkAudio,
              examples: [],
              families: []
            };

            this.getWordExamplesData(this.selectedWord.wordID);
            this.getWordsFamiliesData(this.selectedWord.wordID);
            loading.dismiss();
          }
          else{ // word is empty
             loading.dismiss();
          }
        }, (error) => {
          loading.dismiss();
          console.log("ERROR when get one word: " + JSON.stringify(error) + " wordID:" + wordID);
          alert("error when get one word: " + error + " wordID:" + wordID); // disappear icon loading even if error
        }); // end GET one word
      }, (err) => {
        loading.dismiss();
        console.log("Error opening database: " + err);
        alert("Error opening database: " + err);
      });
    }
    );
  }
  // Function get examples of selectedWord
  getWordExamplesData(wordID) {
    // BLOCK of code query examples data and words families data 
    // GET examples for wordTemp
    this.database.executeSql("SELECT * FROM examples WHERE WordID=" + wordID, []).then((examplesData) => {
      if (examplesData.rows.length > 0) {
        for (var i = 0; i < examplesData.rows.length; i++) {
          this.selectedWord.examples.push({
            wordID: examplesData.rows.item(i).ID,
            ID: examplesData.rows.item(i).ExampleID,
            sentence: examplesData.rows.item(i).Sentence
          });
        }
      }
    }, (error) => {
      console.log("ERROR when get examples: " + JSON.stringify(error) + " wordID:" + wordID);
      alert("error when get examples: " + error + " wordID:" + wordID); // disappear icon loading even if error
    }); // end GET examples
    // END BLOCK 
  }
  // function get wordsFamilies of selected word
  getWordsFamiliesData(wordID) {
    // GET word families for wordTemp
    this.database.executeSql("SELECT * FROM families WHERE WordID=" + wordID, []).then((familiesData) => {
      if (familiesData.rows.length > 0) {
        for (var i = 0; i < familiesData.rows.length; i++) {
          this.selectedWord.families.push({
            wordID: familiesData.rows.item(i).ID,
            ID: familiesData.rows.item(i).FamilyID,
            word: familiesData.rows.item(i).Word,
            type: familiesData.rows.item(i).Type,
            example: familiesData.rows.item(i).Example
          });
        }
      }
    }, (error) => {
      console.log("ERROR when get words families: " + JSON.stringify(error) + " wordID:" + wordID);
      alert("error when get words families: " + error + " wordID:" + wordID); // disappear icon loading even if error
    }); // end GET word families 
  }

}
