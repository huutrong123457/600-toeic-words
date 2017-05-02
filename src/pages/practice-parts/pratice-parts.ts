import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Lesson} from '../../models/lesson';

import { PracticePart1 } from '../practice-part1/practice-part1';
import { PracticePart2 } from '../practice-part2/practice-part2';
import { PracticePart3 } from '../practice-part3/practice-part3';
import { PracticePart4 } from '../practice-part4/practice-part4';

@Component({
  selector: 'page-pratice-parts',
  templateUrl: 'practice-parts.html',
})
export class PracticeParts {

 selectedLesson: Lesson;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
     // get selected lesson from homePage
    this.selectedLesson = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PraticeParts');
  }

  goToPartDetail(whichPart) {
    switch(whichPart) {
      case 1: this.navCtrl.parent.parent.push(PracticePart1, this.selectedLesson); break;
      case 2: this.navCtrl.parent.parent.push(PracticePart2, this.selectedLesson); break;
      case 3: this.navCtrl.parent.parent.push(PracticePart3, this.selectedLesson); break;
      case 4: this.navCtrl.parent.parent.push(PracticePart4, this.selectedLesson); break;
      default:
        alert("No corrected part selected!");
    }
  }

}
