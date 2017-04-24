import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Lesson} from '../../models/lesson';
@Component({
  selector: 'page-practice-part3',
  templateUrl: 'practice-part3.html'
})
export class PracticePart3 {

 selectedLesson: Lesson;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
     this.selectedLesson = navParams.data;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticePart3Page');
  }

}
