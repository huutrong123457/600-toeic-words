import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { Lesson } from '../../models/lesson';
import { Part4 } from '../../models/part4';

import { SQLite } from 'ionic-native';

@Component({
  selector: 'page-practice-part4',
  templateUrl: 'practice-part4.html'
})
export class PracticePart4 {

  public database: SQLite;
  public part4QuestionsArray: Array<Part4>; // 6 questions part4
  selectedLesson: Lesson;

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
        location: 'default',
        createFromLocation: 1
      }).then((successed) => {
        this.loadPart4Data(this.selectedLesson.lessonID);  // load data when open database succefully
      }, (err) => {
        console.log("Error opening database: " + err);
        alert("Error opening database: " + err);
      });
    }
    );
  } // end constructor

  loadPart4Data(lessonSelectedID) {
// check if array question part4 is empty
    if (!this.part4QuestionsArray) {
      // using loading controller to create loading icon while loading data
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      // display loading icon
      loading.present();
      // get data and push in to array 
      this.database.executeSql("SELECT * FROM part4s WHERE LessonID=" + lessonSelectedID, []).then((part4s) => {
        this.part4QuestionsArray = [];
        if (part4s.rows.length > 0) {
          for (var i = 0; i < part4s.rows.length; i++) {
            // temporary variable store one question in part4
            let question: Part4 = {
              ID: part4s.rows.item(i).ID,
              LessonID: part4s.rows.item(i).LessonID,
              Question: part4s.rows.item(i).Question,
              urlAudio: part4s.rows.item(i).urlAudio,
              Answer: part4s.rows.item(i).Answer,
              A: part4s.rows.item(i).A,
              B: part4s.rows.item(i).B,
              C: part4s.rows.item(i).C,
              D: part4s.rows.item(i).D
            }
            this.part4QuestionsArray.push(question);
          } // end for loop get question in part4s
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
  } // end laod Part4Data

  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticePart4Page');
  }

}
