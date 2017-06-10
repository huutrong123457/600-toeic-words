import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Lesson } from '../../models/lesson';

import { WordMatchingPage } from '../word-matching/word-matching';

@Component({
  selector: 'page-games-list',
  templateUrl: 'games-list.html',
})
export class GamesList {

  selectedLesson: Lesson;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selectedLesson = navParams.data;
  }

  goToWordMatchingGame() {
      this.navCtrl.parent.parent.push(WordMatchingPage, this.selectedLesson);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamesList');
  }

}
