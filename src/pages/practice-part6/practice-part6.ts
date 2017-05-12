import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';

import { Part6 } from '../../models/part6';

import { SQLite } from 'ionic-native';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Lesson } from '../../models/lesson';

@Component({
  selector: 'page-practice-part6',
  templateUrl: 'practice-part6.html'
})
export class PracticePart6 {

  selectedLesson: Lesson;
  public database: SQLite;
  public part6QuestionsArray: Array<Part6>; 
  paragraph: string;
  length: number = 0;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public platform: Platform, private http: Http) {
        // get selectedLesson
    this.selectedLesson = navParams.data;
    this.database = new SQLite();
    // when platform ready-> open DB and load data from words table in db
    platform.ready().then(() => {
      this.database.openDatabase({
        name: 'toeic-voca.db',
        location: 'default'
      }).then((successed) => {
        this.loadPart6Data(this.selectedLesson.lessonID);  // load data when open database succefully

      }, (err) => {
        console.log("Error opening database: " + err);
        alert("Error opening database: " + err);
      });
    }
    );
  }

  loadParagraph(src: string){
    this.http.get(src).map(res => res.text()).subscribe(data => {
        this.paragraph = data;
    }, err => {
      console.log(err);
    });
  }

  choose(){
    
  }

   loadPart6Data(lessonSelectedID) {
    // check if array question part6 is empty
    if (!this.part6QuestionsArray) {
      // using loading controller to create loading icon while loading data
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      // display loading icon
      loading.present();
      // get data and push in to array 
      this.database.executeSql("SELECT * FROM part6s WHERE LessonID=" + lessonSelectedID, []).then((part6s) => {
        this.part6QuestionsArray = [];
        if (part6s.rows.length > 0) {
          this.length = part6s.rows.length;
          for (var i = 0; i < part6s.rows.length; i++) {
            // temporary variable store one question in part6
            let question: Part6 = {
              ID: part6s.rows.item(i).ID,
              LessonID: part6s.rows.item(i).LessonID,
              urlParagraph: part6s.rows.item(i).Paragraph,
              Answer: part6s.rows.item(i).Answer,
              A: part6s.rows.item(i).A,
              B: part6s.rows.item(i).B,
              C: part6s.rows.item(i).C,
              D: part6s.rows.item(i).D,
              cssKeyA: '',
              cssKeyB: '',
              cssKeyC: '',
              cssKeyD: '',
              keyChoose: ''
            }
            this.part6QuestionsArray.push(question);
          } // end for loop get question in part5
          loading.dismiss(); // disappear icon loading when done
          // load paragraph
          this.loadParagraph('assets/html/'+this.part6QuestionsArray[0].urlParagraph+'.html');
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
  } // end load Part6Data


  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticePart6Page');
  }

}
