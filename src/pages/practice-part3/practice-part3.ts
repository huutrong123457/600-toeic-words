import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { Lesson } from '../../models/lesson';
import { Part3 } from '../../models/part3';

import { SQLite } from 'ionic-native';
import { MediaPlugin, MediaObject } from '@ionic-native/media'

@Component({
  selector: 'page-practice-part3',
  templateUrl: 'practice-part3.html'
})
export class PracticePart3 implements OnDestroy {


  public database: SQLite;
  public part3QuestionsArray: Array<Part3>; // 3 questions part3
  selectedLesson: Lesson;
  isPlay: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  process: number = 0;
  file: MediaObject;
  point: number = 0;
  length: number = 0;
  showPoint: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public platform: Platform, private media: MediaPlugin) {
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

  doCheck() {
    this.point = 0;
    this.part3QuestionsArray.forEach(part => {
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
    this.part3QuestionsArray[index].keyChoose = key;
    switch (key) {
      case 'A':
        this.part3QuestionsArray[index].cssKeyA = 'correct';
        this.part3QuestionsArray[index].cssKeyC = '';
        this.part3QuestionsArray[index].cssKeyB = '';
        this.part3QuestionsArray[index].cssKeyD = '';
        break;
      case 'B':
        this.part3QuestionsArray[index].cssKeyB = 'correct';
        this.part3QuestionsArray[index].cssKeyC = '';
        this.part3QuestionsArray[index].cssKeyA = '';
        this.part3QuestionsArray[index].cssKeyD = '';
        break;
      case 'C':
        this.part3QuestionsArray[index].cssKeyC = 'correct';
        this.part3QuestionsArray[index].cssKeyA = '';
        this.part3QuestionsArray[index].cssKeyB = '';
        this.part3QuestionsArray[index].cssKeyD = '';
        break;
      case 'D':
        this.part3QuestionsArray[index].cssKeyC = '';
        this.part3QuestionsArray[index].cssKeyA = '';
        this.part3QuestionsArray[index].cssKeyB = '';
        this.part3QuestionsArray[index].cssKeyD = 'correct';
        break;
    }
  }

  playAudio() {
    if (!this.isPlay) {
      this.file = this.media.create('/android_asset/www/assets/audio/practices/' + this.part3QuestionsArray[0].urlAudio + '.mp3',
        (status) => console.log(status),
        () => console.log('Action is successful.'),
        (error) => console.log(error));

      let counter = 0;
      let dur = setInterval(() => {
        counter += 100;
        if (counter > 2000)
          clearInterval(dur);
        let duration = this.file.getDuration();
        console.log(duration);
        if (duration > 0) {
          clearInterval(dur);
          this.duration = duration;
        }
      }, 100);

      this.file.play();

      let media = setInterval(() => {
        this.file.getCurrentPosition().then((position) => {
          if (position >= 0) {
            this.currentTime = position;
            this.setRange(position, this.duration);
          } else {
            this.isPlay = false;
            this.currentTime = 0;
            clearInterval(media);
          }

        }, (err) => {
          console.log(err);
        });
      }, 1000);
      this.isPlay = true;
    }
  }

  ngOnDestroy(): void {
    if (this.file != undefined) {
      this.file.stop();
      this.file.release();
    }
  }

  setRange(current: number, duration: number) {
    if (current <= 0 || duration <= 0)
      return;
    this.process = Math.ceil(current * 100 / duration);
  }

  convertTime(time: number): string {
    if (time <= 0 || time === undefined)
      return '00:00';
    time = Math.ceil(time);
    let min = Math.floor(time / 60);
    let sec = time - 60 * min;
    let str = '';
    if (min < 10) {
      str += '0' + min;
    } else {
      str += min;
    }
    if (sec < 10) {
      str += ':0' + sec;
    } else {
      str += ':' + sec;
    }

    return str;
  }

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
          this.length = part3s.rows.length;
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
              D: part3s.rows.item(i).D,
              cssKeyA: '',
              cssKeyB: '',
              cssKeyC: '',
              cssKeyD: '',
              keyChoose: ''
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
