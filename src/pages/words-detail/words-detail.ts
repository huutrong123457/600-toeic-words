import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, Slides } from 'ionic-angular';

import { Word } from '../../models/word';
import { SQLite } from 'ionic-native';
import { NativeAudio } from '@ionic-native/native-audio';

@Component({
  selector: 'page-words-detail',
  templateUrl: 'words-detail.html',
})
export class WordsDetail {
  @ViewChild(Slides) slides: Slides;

  selectedWord: Word;
  listWords: Array<Word>;
  public database: SQLite;
  startIndex: number = -1;
  index: number = -1;
  length: number = 0;
  lstKey: string[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public platform: Platform, public nativeAudio: NativeAudio) {
    // get selectedWord
    this.selectedWord = navParams.data;
    //
    this.database = new SQLite();
    // when platform ready-> open DB and load data from words table in db 
    platform.ready().then(() => {
      this.database.openDatabase({
        name: 'toeic-voca.db',
        location: 'default',
        createFromLocation: 1
      }).then((successed) => {
        this.loadListWords(this.selectedWord);
      }, (err) => {
        console.log("Error opening database: " + err);
        alert("Error opening database: " + err);
      });
    }
    );
  } // end constructor

  ionViewDidLoad() {

  }

  next() {
    if (this.startIndex == this.index || this.index == this.length - 1) {
      this.startIndex = -1;
      return;
    }
    this.index++;
    this.play(this.lstKey[this.index]);
  }

  pre() {
    console.log(this.lstKey);
    if (this.index == 0) {
      return;
    }
    this.index--;
    this.play(this.lstKey[this.index]);
  }

  playAudio(word) {
    this.play(word.word);
  }

  //play sound
  play(id: string) {
    this.nativeAudio.play(id)
      .then(() => { console.log('success') }, (error) => { console.log(error) });
  }

  //get sound in temp memory
  prepareAudio(id: string, asset: string) {
    this.nativeAudio.preloadComplex(id, asset, 1, 1, 0)
      .then(() => { }, (error) => { console.log(error) });
  }

  //////////// method LOAD List words  ////////////////
  loadListWords(selectedWord) {
    // check if array lesson is empty
    if (!this.listWords) {
      // using loading controller to create loading icon while loading data
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      // display loading icon
      loading.present();
      // get data and push in to array this.lessons
      this.database.executeSql("SELECT * FROM words WHERE LessonID=" + selectedWord.lessonID, []).then((wordsData) => {
        this.listWords = [];
        this.length = wordsData.rows.length;
        // alert("words total: " + wordsData.rows.length);
        if (wordsData.rows.length > 0) {
          for (var i = 0; i < wordsData.rows.length; i++) {
            // temporary variable store one word
            if (wordsData.rows.item(i).WordID === selectedWord.wordID) {
              this.index = i;
              this.startIndex = this.index;
            }

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
            this.lstKey.push(wordTemp.word);
            this.prepareAudio(wordTemp.word, 'assets/audio/words/' + wordTemp.linkAudio + '.mp3');
            this.getWordExamplesData(wordTemp);
            this.getWordsFamiliesData(wordTemp);
            // Push word completed to array words
            this.listWords.push(wordTemp);
          } // end for loop get words

          loading.dismiss(); // disappear icon loading when done
          this.slides.update();
          setTimeout(() => {
            this.slides.slideTo(this.index);
            this.play(this.lstKey[this.index]);
          }, 200);
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
  } // end function getListWords

  /////// Function get examples
  getWordExamplesData(wordTemp) {
    // BLOCK of code query examples data and words families data 
    // GET examples for wordTemp
    this.database.executeSql("SELECT * FROM examples WHERE WordID=" + wordTemp.wordID, []).then((examplesData) => {
      if (examplesData.rows.length > 0) {
        for (var i = 0; i < examplesData.rows.length; i++) {
          wordTemp.examples.push({
            wordID: examplesData.rows.item(i).ID,
            ID: examplesData.rows.item(i).ExampleID,
            sentence: examplesData.rows.item(i).Sentence
          });
        }
      }
    }, (error) => {
      console.log("ERROR when get examples: " + JSON.stringify(error) + " wordID:" + wordTemp.wordID);
      alert("error when get examples: " + error + " wordID:" + wordTemp.wordID); // disappear icon loading even if error
    });
  } // end GET examples

  ////// function get wordsFamilies
  getWordsFamiliesData(wordTemp) {
    // GET word families for wordTemp
    this.database.executeSql("SELECT * FROM families WHERE WordID=" + wordTemp.wordID, []).then((familiesData) => {
      if (familiesData.rows.length > 0) {
        for (var i = 0; i < familiesData.rows.length; i++) {
          wordTemp.families.push({
            wordID: familiesData.rows.item(i).ID,
            ID: familiesData.rows.item(i).FamilyID,
            word: familiesData.rows.item(i).Word,
            type: familiesData.rows.item(i).Type,
            example: familiesData.rows.item(i).Example
          });
        }
      }
    }, (error) => {
      console.log("ERROR when get words families: " + JSON.stringify(error) + " wordID:" + wordTemp.wordID);
      alert("error when get words families: " + error + " wordID:" + wordTemp.wordID); // disappear icon loading even if error
    });
  } // end GET word families 
}
