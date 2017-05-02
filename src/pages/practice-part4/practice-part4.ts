import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Lesson} from '../../models/lesson';

@Component({
  selector: 'page-practice-part4',
  templateUrl: 'practice-part4.html'
})
export class PracticePart4 {

  selectedLesson: Lesson;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
     this.selectedLesson = navParams.data;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticePart4Page');
  }

}
