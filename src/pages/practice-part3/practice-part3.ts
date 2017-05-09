import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { Lesson } from '../../models/lesson';
import { Part3 } from '../../models/part3';

import { SQLite } from 'ionic-native';

@Component({
  selector: 'page-practice-part3',
  templateUrl: 'practice-part3.html'
})
export class PracticePart3 {

  public database: SQLite;
  public part3QuestionsArray: Array<Part3>; // 3 questions part3
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
        location: 'default'
      }).then((successed) => {
        this.loadPart3Data(this.selectedLesson.lessonID);  // load data when open database succefully
      }, (err) => {
        console.log("Error opening database: " + err);
        alert("Error opening database: " + err);
      });
    }
    );
  } // end constructor

  loadPart3Data(lessonSelectedID) {
// check if array questions in part3 is empty
    if (!this.part3QuestionsArray) {
      // using loading controller to create loading icon while loading data
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      // display loading icon
      loading.present();
      // get data and push in to array 
      this.database.executeSql("SELECT * FROM part3s WHERE LessonID=" + lessonSelectedID, []).then((part3s) => {
        this.part3QuestionsArray = [];
        if (part3s.rows.length > 0) {
          for (var i = 0; i < part3s.rows.length; i++) {
            // temporary variable store one question in part3
            let question: Part3 = {
              ID: part3s.rows.item(i).ID,
              LessonID: part3s.rows.item(i).LessonID,
              Question: part3s.rows.item(i).Question,
              urlAudio: part3s.rows.item(i).urlAudio,
              Answer: part3s.rows.item(i).Answer,
              A: part3s.rows.item(i).A,
              B: part3s.rows.item(i).B,
              C: part3s.rows.item(i).C,
              D: part3s.rows.item(i).D
            }
            this.part3QuestionsArray.push(question);
          } // end for loop get question in part3s
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
  } // end laod Part3Data


  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticePart3Page');
  }

}
