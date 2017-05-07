import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';

import { Lesson } from '../../models/lesson';

@Component({
  selector: 'page-practice-part7',
  templateUrl: 'practice-part7.html'
})
export class PracticePart7 {

  selectedLesson: Lesson;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public platform: Platform) {
    // get selectedLesson
    this.selectedLesson = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticePart7Page');
  }

}
