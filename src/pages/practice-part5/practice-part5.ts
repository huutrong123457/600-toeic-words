import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, Content } from 'ionic-angular';
import { Lesson } from '../../models/lesson';
import { Part5 } from '../../models/part5';

import { SQLite } from 'ionic-native';


@Component({
  selector: 'page-practice-part5',
  templateUrl: 'practice-part5.html'
})
export class PracticePart5 {
  @ViewChild(Content) content: Content;
  public database: SQLite;
  public part5QuestionsArray: Array<Part5>; // 6 questions part5
  selectedLesson: Lesson;
  point: number = 0;
  length: number = 0;
  showPoint: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public platform: Platform) {
    // get selectedLesson
    this.selectedLesson = navParams.data;
    this.database = new SQLite();
    // when platform ready-> open DB and load data from words table in db
    platform.ready().then(() => {
      this.database.openDatabase({
        name: 'toeic-voca.db',
        location: 'default'
      }).then((successed) => {
        this.loadPart5Data(this.selectedLesson.lessonID);  // load data when open database succefully
      }, (err) => {
        console.log("Error opening database: " + err);
        alert("Error opening database: " + err);
      });
    }
    );
  } // end constructor

  doCheck() {
    this.point = 0;
    this.content.scrollToTop(500).then((success) => {
      console.log("Part5 scrollToTop completed!");
    }, (error) => {
      console.log("Part5 scrollToTop failed!");
    });
    this.part5QuestionsArray.forEach(part => {
      if (part.keyChoose === part.Answer) {
        this.point++;
        //set css when true
        switch (part.Answer) {
          case 'A':
            part.cssKeyA = 'correct';
            break;
          case 'B':
            part.cssKeyB = 'correct';
            break;
          case 'C':
            part.cssKeyC = 'correct';
            break;
          case 'D':
            part.cssKeyD = 'correct';
            break;
        }
      } else {
        //set css when false
        switch (part.Answer) {
          case 'A':
            part.cssKeyA = 'correct';
            break;
          case 'B':
            part.cssKeyB = 'correct';
            break;
          case 'C':
            part.cssKeyC = 'correct';
            break;
          case 'D':
            part.cssKeyD = 'correct';
            break;
        }
        switch (part.keyChoose) {
          case 'A':
            part.cssKeyA = 'wrong';
            break;
          case 'B':
            part.cssKeyB = 'wrong';
            break;
          case 'C':
            part.cssKeyC = 'wrong';
            break;
          case 'D':
            part.cssKeyD = 'wrong';
            break;
        }
      }
    });
    this.showPoint = true;

  }

  choose(index, key) {
    this.part5QuestionsArray[index].keyChoose = key;
    switch (key) {
      case 'A':
        this.part5QuestionsArray[index].cssKeyA = 'correct';
        this.part5QuestionsArray[index].cssKeyC = '';
        this.part5QuestionsArray[index].cssKeyB = '';
        this.part5QuestionsArray[index].cssKeyD = '';
        break;
      case 'B':
        this.part5QuestionsArray[index].cssKeyB = 'correct';
        this.part5QuestionsArray[index].cssKeyC = '';
        this.part5QuestionsArray[index].cssKeyA = '';
        this.part5QuestionsArray[index].cssKeyD = '';
        break;
      case 'C':
        this.part5QuestionsArray[index].cssKeyC = 'correct';
        this.part5QuestionsArray[index].cssKeyA = '';
        this.part5QuestionsArray[index].cssKeyB = '';
        this.part5QuestionsArray[index].cssKeyD = '';
        break;
      case 'D':
        this.part5QuestionsArray[index].cssKeyC = '';
        this.part5QuestionsArray[index].cssKeyA = '';
        this.part5QuestionsArray[index].cssKeyB = '';
        this.part5QuestionsArray[index].cssKeyD = 'correct';
        break;
    }
  }

  // load part5 data
  loadPart5Data(lessonSelectedID) {
    // check if array question part5 is empty
    if (!this.part5QuestionsArray) {
      // using loading controller to create loading icon while loading data
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      // display loading icon
      loading.present();
      // get data and push in to array 
      this.database.executeSql("SELECT * FROM part5s WHERE LessonID=" + lessonSelectedID, []).then((part5s) => {
        this.part5QuestionsArray = [];
        if (part5s.rows.length > 0) {

          this.length = part5s.rows.length;
          for (var i = 0; i < part5s.rows.length; i++) {
            // temporary variable store one question in part4
            let question: Part5 = {
              ID: part5s.rows.item(i).ID,
              LessonID: part5s.rows.item(i).LessonID,
              Question: part5s.rows.item(i).Question,
              Answer: part5s.rows.item(i).Answer,
              A: part5s.rows.item(i).A,
              B: part5s.rows.item(i).B,
              C: part5s.rows.item(i).C,
              D: part5s.rows.item(i).D,
              cssKeyA: '',
              cssKeyB: '',
              cssKeyC: '',
              cssKeyD: '',
              keyChoose: ''
            }
            this.part5QuestionsArray.push(question);
          } // end for loop get question in part5
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
  } // end load Part5Data

  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticePart5Page');
  }

}
