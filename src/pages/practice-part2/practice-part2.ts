import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Lesson} from '../../models/lesson';
@Component({
  selector: 'page-practice-part2',
  templateUrl: 'practice-part2.html'
})
export class PracticePart2 {

selectedLesson: Lesson;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
     this.selectedLesson = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticePart2Page');
  }

}
