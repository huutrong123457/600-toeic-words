import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { GamesList } from '../games-list/games-list';
import { WordsList } from '../words-list/words-list';
import { PracticeParts } from '../practice-parts/pratice-parts';
import { Lesson } from '../../models/lesson';
@Component({
  templateUrl: 'lesson-tabs.html',
})
export class LessonTabs {

  tabWordsList:any= WordsList;
  tabPractices:any= PracticeParts;
  tabGames:any= GamesList;

  selectedLesson: Lesson;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.selectedLesson = navParams.data;
    console.log(navParams.data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LessonTabs');
  }

}
