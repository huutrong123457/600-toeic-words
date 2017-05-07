import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';

import { Lesson } from '../../models/lesson';
import { Part2 } from '../../models/part2';

import { SQLite } from 'ionic-native';

@Component({
  selector: 'page-practice-part2',
  templateUrl: 'practice-part2.html'
})
export class PracticePart2 {

  public database: SQLite;
  public part2Array: Array<Part2>; // 2 questions part2
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
        this.loadPart2Data(this.selectedLesson.lessonID);  // load data when open database succefully
      }, (err) => {
        console.log("Error opening database: " + err);
        alert("Error opening database: " + err);
      });
    }
    );
  } // end constructor

  loadPart2Data(lessonSelectedID) {
 // check if array lesson is empty
    if (!this.part2Array) {
      // using loading controller to create loading icon while loading data
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      // display loading icon
      loading.present();
      // get data and push in to array 
      this.database.executeSql("SELECT * FROM part2s WHERE LessonID=" + lessonSelectedID, []).then((part2s) => {
        this.part2Array = [];
        if (part2s.rows.length > 0) {
          for (var i = 0; i < part2s.rows.length; i++) {
            // temporary variable store one question in part2
            let question: Part2 = {
              ID: part2s.rows.item(i).ID,
              LessonID: part2s.rows.item(i).LessonID,
              Question: part2s.rows.item(i).Question,
              urlAudio: part2s.rows.item(i).urlAudio,
              Answer: part2s.rows.item(i).Answer,
              A: part2s.rows.item(i).A,
              B: part2s.rows.item(i).B,
              C: part2s.rows.item(i).C,
            }
            this.part2Array.push(question);
          } // end for loop get question in part2s
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
  } // end load Part2 data

  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticePart2Page');
  }

}