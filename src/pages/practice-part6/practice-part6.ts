import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, Content } from 'ionic-angular';

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
  @ViewChild(Content) content: Content;

  selectedLesson: Lesson;
  public database: SQLite;
  public part6QuestionsArray: Array<Part6>;
  paragraph: string;
  point: number = 0;
  length: number = 0;
  showPoint: boolean = false;

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

  loadParagraph(src: string) {
    this.http.get(src).map(res => res.text()).subscribe(data => {
      this.paragraph = data;
    }, err => {
      console.log(err);
    });
  }

  doCheck() {
    this.point = 0;
    this.content.scrollToTop(500).then((success) => {
      console.log("Part6 scrollToTop completed!");
    }, (error) => {
      console.log("Part6 scrollToTop failed!");
    });
    this.part6QuestionsArray.forEach(part => {
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
    this.part6QuestionsArray[index].keyChoose = key;
    switch (key) {
      case 'A':
        this.part6QuestionsArray[index].cssKeyA = 'correct';
        this.part6QuestionsArray[index].cssKeyC = '';
        this.part6QuestionsArray[index].cssKeyB = '';
        this.part6QuestionsArray[index].cssKeyD = '';
        break;
      case 'B':
        this.part6QuestionsArray[index].cssKeyB = 'correct';
        this.part6QuestionsArray[index].cssKeyC = '';
        this.part6QuestionsArray[index].cssKeyA = '';
        this.part6QuestionsArray[index].cssKeyD = '';
        break;
      case 'C':
        this.part6QuestionsArray[index].cssKeyC = 'correct';
        this.part6QuestionsArray[index].cssKeyA = '';
        this.part6QuestionsArray[index].cssKeyB = '';
        this.part6QuestionsArray[index].cssKeyD = '';
        break;
      case 'D':
        this.part6QuestionsArray[index].cssKeyC = '';
        this.part6QuestionsArray[index].cssKeyA = '';
        this.part6QuestionsArray[index].cssKeyB = '';
        this.part6QuestionsArray[index].cssKeyD = 'correct';
        break;
    }
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
          this.loadParagraph('assets/html/' + this.part6QuestionsArray[0].urlParagraph + '.html');
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
