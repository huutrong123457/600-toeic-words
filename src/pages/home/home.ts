import { Component } from '@angular/core';
import { NavController, LoadingController, Platform } from 'ionic-angular';

import {LessonTabs} from '../lesson-tabs/lesson-tabs';

import { SQLite } from 'ionic-native';

import { Lesson } from '../../models/lesson';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // object connect to db
  public database: SQLite;
  // lessons list 
  public lessons: Array<Lesson>;

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public platform: Platform) {
       // create object sqlite
    this.database = new SQLite();

    // when platform ready-> open DB and load data from sounds table in db
    platform.ready().then(() => {
      this.database.openDatabase({
        name: 'toeic-voca.db',
        location: 'default',
        createFromLocation: 1
      }).then((successed) => {
        this.loadData()  // load data when open database succefully
      }, (err) => {
        console.log("Error opening database: " + err);
        alert("Error opening database: " + err);
      });
    }
    );
  }

  loadData() {
        // check if array lesson is empty
    if (!this.lessons) {
      // using loading controller to create loading icon while loading data
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      // display
      loading.present();
      // get data and push in to array this.lessons
      this.database.executeSql("SELECT * FROM lessons", []).then((data) => {
        this.lessons = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            this.lessons.push({
              lessonID: data.rows.item(i).ID,
              lesson: data.rows.item(i).Lesson,
              linkImg: data.rows.item(i).linkImgage,
            });
          }
          loading.dismiss(); // disappear icon loading when done
        }
      }, (error) => {
        console.log("ERROR: " + JSON.stringify(error));
        alert("error: " + error);
        loading.dismiss(); // disappear icon loading even if error
      });
    }
  }

  goToLessonTabs(lesson){
    this.navCtrl.push(LessonTabs, lesson);
  }

}
