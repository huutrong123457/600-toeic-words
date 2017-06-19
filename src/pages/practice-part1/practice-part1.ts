import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, Content } from 'ionic-angular';

import { Lesson } from '../../models/lesson';
import { Part1 } from '../../models/part1';

import { MediaPlugin, MediaObject } from '@ionic-native/media'

import { SQLite } from 'ionic-native';

@Component({
  selector: 'page-practice-part1',
  templateUrl: 'practice-part1.html',
})
export class PracticePart1 implements OnDestroy {
  @ViewChild(Content) content: Content;

  public database: SQLite;
  part1Object: Part1;
  selectedLesson: Lesson;

  currentTime: number;
  duration: number;
  process: number;
  // temp variables
  A: string;
  B: string;
  C: string;
  D: string;
  keyA: string = 'Listen and choose your answer';
  keyB: string = 'Listen and choose your answer';
  keyC: string = 'Listen and choose your answer';
  keyD: string = 'Listen and choose your answer';
  cssKeyA: string = '';
  cssKeyB: string = '';
  cssKeyC: string = '';
  cssKeyD: string = '';
  keyChoose: string;
  Answer: string;
  urlAudio: string;
  urlImg: string;
  isPlay: boolean = false;
  file: MediaObject;
  point: number = 0;
  length: number = 0;
  showPoint: boolean = false;

  isAnswerChoosen: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public platform: Platform, private media: MediaPlugin) {

    // get selected lesson from homePage
    this.selectedLesson = navParams.data;
    // get part 1 data
    this.database = new SQLite();
    // when platform ready-> open DB and load data from words table in db
    platform.ready().then(() => {
      this.database.openDatabase({
        name: 'toeic-voca.db',
        location: 'default'
      }).then((successed) => {
        this.loadPart1Data(this.selectedLesson.lessonID);  // load data when open database succefully
      }, (err) => {
        console.log("Error opening database: " + err);
        alert("Error opening database: " + err);
      });
    }
    );
  } // end constructor

  ngOnDestroy(): void {
    if (this.file != undefined) {
      this.file.stop();
      this.file.release();
    }
  }

  doCheck() {
    if (!this.isAnswerChoosen) {
      alert("You have to choose your answer!");
    }
    else {
      this.point = 0;
      this.isAnswerChoosen = false;
      // scroll the screen to top 
      this.content.scrollToTop(500).then((success) => {
        console.log("Part1 scrollToTop completed!");
      }, (error) => {
        console.log("Part1 scrollToTop failed!");
      });

      console.log(this.keyChoose, this.Answer);
      if (this.keyChoose === this.Answer) {
        this.point++;
        //set css when true
        switch (this.Answer) {
          case 'A':
            this.cssKeyA = 'correct';
            break;
          case 'B':
            this.cssKeyB = 'correct';
            break;
          case 'C':
            this.cssKeyC = 'correct';
            break;
          case 'D':
            this.cssKeyD = 'correct';
            break;
        }
      } else {
        //set css when false
        switch (this.Answer) {
          case 'A':
            this.cssKeyA = 'correct';
            break;
          case 'B':
            this.cssKeyB = 'correct';
            break;
          case 'C':
            this.cssKeyC = 'correct';
            break;
          case 'D':
            this.cssKeyD = 'correct';
            break;
        }
        switch (this.keyChoose) {
          case 'A':
            this.cssKeyA = 'wrong';
            break;
          case 'B':
            this.cssKeyB = 'wrong';
            break;
          case 'C':
            this.cssKeyC = 'wrong';
            break;
          case 'D':
            this.cssKeyD = 'wrong';
            break;
        }
      }
      this.showPoint = true;
      this.keyA = this.A;
      this.keyB = this.B;
      this.keyC = this.C;
      this.keyD = this.D;
    }
  }

  choose(key) {
    this.isAnswerChoosen = true;
    this.keyChoose = key;
    switch (key) {
      case 'A':
        this.cssKeyA = 'correct';
        this.cssKeyC = '';
        this.cssKeyB = '';
        this.cssKeyD = '';
        break;
      case 'B':
        this.cssKeyB = 'correct';
        this.cssKeyC = '';
        this.cssKeyA = '';
        this.cssKeyD = '';
        break;
      case 'C':
        this.cssKeyC = 'correct';
        this.cssKeyA = '';
        this.cssKeyB = '';
        this.cssKeyD = '';
        break;
      case 'D':
        this.cssKeyD = 'correct';
        this.cssKeyC = '';
        this.cssKeyB = '';
        this.cssKeyA = '';
        break;
    }
  }

  playAudio() {
    if (!this.isPlay) {
      this.file = this.media.create('/android_asset/www/assets/audio/practices/' + this.urlAudio + '.mp3',
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
          this.length = part1s.rows.length;
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
