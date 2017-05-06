import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';

import { Lesson } from '../../models/lesson';
import { Part1 } from '../../models/part1';

import { SQLite } from 'ionic-native';

@Component({
  selector: 'page-practice-part1',
  templateUrl: 'practice-part1.html',
})
export class PracticePart1 {

  public database: SQLite;
  part1Object: Part1;
  selectedLesson: Lesson;

  // temp variables
  A: string;
  B: string;
  C: string;
  D: string;
  Answer: string;
  urlAudio: string;
  urlImg: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public platform: Platform) {

    // get selected lesson from homePage
    this.selectedLesson = navParams.data;
    // get part 1 data
    this.database = new SQLite();
    // when platform ready-> open DB and load data from words table in db
    platform.ready().then(() => {
      this.database.openDatabase({
        name: 'toeic-voca.db',
        location: 'default',
        createFromLocation: 1
      }).then((successed) => {
        this.loadPart1Data(this.selectedLesson.lessonID);  // load data when open database succefully
      }, (err) => {
        console.log("Error opening database: " + err);
        alert("Error opening database: " + err);
      });
    }
    );
  } // end constructor

  loadPart1Data(lessonSelectedID) {
    if (!this.part1Object) {
      // using loading controller to create loading icon while loading data
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      // display loading icon
      loading.present();
      this.database.executeSql("SELECT * FROM part1s WHERE LessonID=" + lessonSelectedID, []).then((part1s) => {
        if (part1s.rows.length > 0) {
          this.part1Object = {
            ID: part1s.rows.item(0).ID,
            LessonID: part1s.rows.item(0).LessonID,
            urlImg: part1s.rows.item(0).urlImg,
            urlAudio: part1s.rows.item(0).urlAudio,
            Answer: part1s.rows.item(0).Answer,
            A: part1s.rows.item(0).A,
            B: part1s.rows.item(0).B,
            C: part1s.rows.item(0).C,
            D: part1s.rows.item(0).D
          }
          loading.dismiss(); // disappear icon loading when done
          
          this.A = this.part1Object.A;
          this.B = this.part1Object.B;
          this.C = this.part1Object.C;
          this.D = this.part1Object.D;
          this.Answer = this.part1Object.Answer;
          this.urlAudio = this.part1Object.urlAudio;
          this.urlImg = this.part1Object.urlImg;
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
  } // end loadPart1Data

  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticePart1');
  }

}
