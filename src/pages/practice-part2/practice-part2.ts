import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';

import { Lesson } from '../../models/lesson';
import { Part2 } from '../../models/part2';

import { SQLite } from 'ionic-native';
import { MediaPlugin, MediaObject } from '@ionic-native/media';

@Component({
  selector: 'page-practice-part2',
  templateUrl: 'practice-part2.html'
})
export class PracticePart2 implements OnDestroy {

  public database: SQLite;
  public part2Array: Array<Part2>; // 2 questions part2
  selectedLesson: Lesson;
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
        this.loadPart2Data(this.selectedLesson.lessonID);  // load data when open database succefully
      }, (err) => {
        console.log("Error opening database: " + err);
        alert("Error opening database: " + err);
      });
    }
    );
  } // end constructor

  choose(index, key) {
    this.part2Array[index].keyChoose = key;
    switch (key) {
      case 'A':
        this.part2Array[index].cssKeyA = 'correct';
        this.part2Array[index].cssKeyC = '';
        this.part2Array[index].cssKeyB = '';
        break;
      case 'B':
        this.part2Array[index].cssKeyB = 'correct';
        this.part2Array[index].cssKeyC = '';
        this.part2Array[index].cssKeyA = '';
        break;
      case 'C':
        this.part2Array[index].cssKeyC = 'correct';
        this.part2Array[index].cssKeyA = '';
        this.part2Array[index].cssKeyB = '';
        break;
    }
  }

  doCheck() {
    this.part2Array.forEach(part => {
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
        }
      }
      part.keyA = part.A;
      part.keyB = part.B;
      part.keyC = part.C;
      part.keyQuestion = true;
      this.showPoint = true;
    });
  }

  playAudio(index) {
    if (!this.part2Array[index].isPlay) {
      this.part2Array[index].media = this.media.create('/android_asset/www/assets/audio/practices/' + this.part2Array[index].urlAudio + '.mp3',
        (status) => console.log(status),
        () => console.log('Action is successful.'),
        (error) => console.log(error));

      let counter = 0;
      let dur = setInterval(() => {
        counter += 100;
        if (counter > 2000)
          clearInterval(dur);
        let duration = this.part2Array[index].media.getDuration();
        console.log(duration);
        if (duration > 0) {
          clearInterval(dur);
          this.part2Array[index].duration = duration;
        }
      }, 100);

      this.part2Array[index].media.play();

      let media = setInterval(() => {
        this.part2Array[index].media.getCurrentPosition().then((position) => {
          if (position >= 0) {
            this.part2Array[index].currentTime = position;
            this.setRange(position, this.part2Array[index].duration, index);
          } else {
            this.part2Array[index].isPlay = false;
            this.part2Array[index].currentTime = 0;
            clearInterval(media);
          }

        }, (err) => {
          console.log(err);
        });
      }, 1000);
      this.part2Array[index].isPlay = true;
    }
  }

  ngOnDestroy(): void {
    this.part2Array.forEach(part => {
      if (part.media != undefined) {
        part.media.stop();
        part.media.release();
      }
    });

  }

  setRange(current: number, duration: number, index) {
    if (current <= 0 || duration <= 0)
      return;
    this.part2Array[index].process = Math.ceil(current * 100 / duration);
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
          this.length = part2s.rows.length;
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
              keyA: 'Listen and choose your answer',
              keyB: 'Listen and choose your answer',
              keyC: 'Listen and choose your answer',
              keyChoose: '',
              keyQuestion: false,
              currentTime: 0,
              duration: 0,
              process: 0,
              cssKeyA: '',
              cssKeyB: '',
              cssKeyC: '',
              isPlay: false,
              media: undefined
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