import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {LessonTabs} from '../lesson-tabs/lesson-tabs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  goToLesson(){
    this.navCtrl.push(LessonTabs, {greeting:"hello"});
  }

}
