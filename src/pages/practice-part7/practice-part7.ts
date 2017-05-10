import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';

import { Lesson } from '../../models/lesson';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-practice-part7',
  templateUrl: 'practice-part7.html'
})
export class PracticePart7 {

  selectedLesson: Lesson;
  paragraph: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public platform: Platform, private http: Http) {
    // get selectedLesson
    this.selectedLesson = navParams.data;
    this.loadParagraph('assets/html/lesson1_part6.html');
  }

  loadParagraph(src: string) {
    this.http.get(src).map(res => res.text()).subscribe(data => {
      this.paragraph = data;
    }, err => {
      console.log(err);
    });
  }

  choose() {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticePart7Page');
  }

}
