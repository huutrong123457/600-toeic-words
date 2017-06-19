import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, Content } from 'ionic-angular';

import { Lesson } from '../../models/lesson';
import { Http } from '@angular/http';
import { Part7 } from '../../models/part7';

import { SQLite } from 'ionic-native';

import 'rxjs/add/operator/map';

@Component({
  selector: 'page-practice-part7',
  templateUrl: 'practice-part7.html'
})
export class PracticePart7 {
  @ViewChild(Content) content: Content;

  selectedLesson: Lesson;
  paragraph1: string;
  paragraph2: string;
  public database: SQLite;
  public part7QuestionsArray: Array<Part7>
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
        this.loadPart7Data(this.selectedLesson.lessonID);  // load data when open database succefully
      }, (err) => {
        console.log("Error opening database: " + err);
        alert("Error opening database: " + err);
      });
    }
    );

  }

  loadParagraph1(src: string) {
    this.http.get(src).map(res => res.text()).subscribe(data => {
      this.paragraph1 = data;
    }, err => {
      console.log(err);
    });
  }

  loadParagraph2(src: string) {
    this.http.get(src).map(res => res.text()).subscribe(data => {
      this.paragraph2 = data;
    }, err => {
      console.log(err);
    });
  }

  doCheck() {
    if (!this.isAllQuestionWasChoosen()) {
      alert("You have to answer all the questions!");
    }
    else {
      this.point = 0;
      this.content.scrollToTop(500).then((success) => {
        console.log("Part7 scrollToTop completed!");
      }, (error) => {
        console.log("Part7 scrollToTop failed!");
      });
      this.part7QuestionsArray.forEach(part => {
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
        part.isChoosen = false;
      });
      this.showPoint = true;
    }
  }

  isAllQuestionWasChoosen(): boolean {
    for (let i = 0; i < this.part7QuestionsArray.length; i++) {
      if (!this.part7QuestionsArray[i].isChoosen)
        return false;
    }
    return true;
  }

  choose(index, key) {
    this.part7QuestionsArray[index].isChoosen = true;
    this.part7QuestionsArray[index].keyChoose = key;
    switch (key) {
      case 'A':
        this.part7QuestionsArray[index].cssKeyA = 'correct';
        this.part7QuestionsArray[index].cssKeyC = '';
        this.part7QuestionsArray[index].cssKeyB = '';
        this.part7QuestionsArray[index].cssKeyD = '';
        break;
      case 'B':
        this.part7QuestionsArray[index].cssKeyB = 'correct';
        this.part7QuestionsArray[index].cssKeyC = '';
        this.part7QuestionsArray[index].cssKeyA = '';
        this.part7QuestionsArray[index].cssKeyD = '';
        break;
      case 'C':
        this.part7QuestionsArray[index].cssKeyC = 'correct';
        this.part7QuestionsArray[index].cssKeyA = '';
        this.part7QuestionsArray[index].cssKeyB = '';
        this.part7QuestionsArray[index].cssKeyD = '';
        break;
      case 'D':
        this.part7QuestionsArray[index].cssKeyC = '';
        this.part7QuestionsArray[index].cssKeyA = '';
        this.part7QuestionsArray[index].cssKeyB = '';
        this.part7QuestionsArray[index].cssKeyD = 'correct';
        break;
    }
  }

  loadPart7Data(lessonSelectedID) {
    // check if array question part6 is empty
    if (!this.part7QuestionsArray) {
      // using loading controller to create loading icon while loading data
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      // display loading icon
      loading.present();
      // get data and push in to array 
      this.database.executeSql("SELECT * FROM part7s WHERE LessonID=" + lessonSelectedID, []).then((part7s) => {
        this.part7QuestionsArray = [];
        if (part7s.rows.length > 0) {
          this.length = part7s.rows.length;
          for (var i = 0; i < part7s.rows.length; i++) {
            // temporary variable store one question in part7
            let question: Part7 = {
              ID: part7s.rows.item(i).ID,
              LessonID: part7s.rows.item(i).LessonID,
              urlParagraph1: part7s.rows.item(i).Paragraph1,
              urlParagraph2: part7s.rows.item(i).Paragraph2,
              Question: part7s.rows.item(i).Question,
              Answer: part7s.rows.item(i).Answer,
              A: part7s.rows.item(i).A,
              B: part7s.rows.item(i).B,
              C: part7s.rows.item(i).C,
              D: part7s.rows.item(i).D,
              cssKeyA: '',
              cssKeyB: '',
              cssKeyC: '',
              cssKeyD: '',
              keyChoose: '',
              isChoosen: false
            }
            this.part7QuestionsArray.push(question);
          } // end for loop get question in part7
          loading.dismiss(); // disappear icon loading when done
          // load paragraph 1 & 2
          this.loadParagraph1('assets/html/' + this.part7QuestionsArray[0].urlParagraph1 + '.html');
          this.loadParagraph2('assets/html/' + this.part7QuestionsArray[0].urlParagraph2 + '.html');
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
  } // end load Part7Data

  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticePart7Page');
  }

}
