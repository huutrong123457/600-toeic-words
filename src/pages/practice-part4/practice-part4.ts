import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, Content } from 'ionic-angular';
import { Lesson } from '../../models/lesson';
import { Part4 } from '../../models/part4';

import { SQLite } from 'ionic-native';
import { MediaObject, MediaPlugin } from '@ionic-native/media';

@Component({
  selector: 'page-practice-part4',
  templateUrl: 'practice-part4.html'
})
export class PracticePart4 implements OnDestroy {
  @ViewChild(Content) content: Content;

  public database: SQLite;
  public part4QuestionsArray: Array<Part4>; // 6 questions part4
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
        this.loadPart4Data(this.selectedLesson.lessonID);  // load data when open database succefully
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
      console.log("Part4 scrollToTop completed!");
    }, (error) => {
      console.log("Part4 scrollToTop failed!");
    });
    this.part4QuestionsArray.forEach(part => {
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
    this.part4QuestionsArray[index].keyChoose = key;
    switch (key) {
      case 'A':
        this.part4QuestionsArray[index].cssKeyA = 'correct';
        this.part4QuestionsArray[index].cssKeyC = '';
        this.part4QuestionsArray[index].cssKeyB = '';
        this.part4QuestionsArray[index].cssKeyD = '';
        break;
      case 'B':
        this.part4QuestionsArray[index].cssKeyB = 'correct';
        this.part4QuestionsArray[index].cssKeyC = '';
        this.part4QuestionsArray[index].cssKeyA = '';
        this.part4QuestionsArray[index].cssKeyD = '';
        break;
      case 'C':
        this.part4QuestionsArray[index].cssKeyC = 'correct';
        this.part4QuestionsArray[index].cssKeyA = '';
        this.part4QuestionsArray[index].cssKeyB = '';
        this.part4QuestionsArray[index].cssKeyD = '';
        break;
      case 'D':
        this.part4QuestionsArray[index].cssKeyC = '';
        this.part4QuestionsArray[index].cssKeyA = '';
        this.part4QuestionsArray[index].cssKeyB = '';
        this.part4QuestionsArray[index].cssKeyD = 'correct';
        break;
    }
  }

  playAudio() {
    if (!this.isPlay) {
      this.file = this.media.create('/android_asset/www/assets/audio/practices/' + this.part4QuestionsArray[0].urlAudio + '.mp3',
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
          this.length = part4s.rows.length;
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
              D: part4s.rows.item(i).D,
              cssKeyA: '',
              cssKeyB: '',
              cssKeyC: '',
              cssKeyD: '',
              keyChoose: ''
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
