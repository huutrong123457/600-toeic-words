import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Lesson} from '../../models/lesson';
@Component({
  selector: 'page-practice-part1',
  templateUrl: 'practice-part1.html',
})
export class PracticePart1 {

  selectedLesson: Lesson;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
      // get selected lesson from homePage
    this.selectedLesson = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticePart1');
  }

}
