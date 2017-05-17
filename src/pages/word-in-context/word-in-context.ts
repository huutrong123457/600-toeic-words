import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Lesson } from '../../models/lesson';


@Component({
  selector: 'page-word-in-context',
  templateUrl: 'word-in-context.html'
})
export class WordInContextPage {
  selectedLesson: Lesson;
  questionTextToArray: string[];
  wordArray: string[];
  lastText: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selectedLesson = navParams.data;
    console.log(this.selectedLesson);
    this.wordArray = ["abide by", "assurance", "specific", "test"];
    this.loadData();
  }

  loadData() {
    const text = 'It can take a long time to become successful in your chosen field, however talented you are. One thing you have to be | of is that you will face criticism along the way. The world is | of people who would rather say something negative than positive. If you’ve made up your | to achieve a certain goal, such as writing a novel, | the negative criticism of others prevent you from reaching your target, and let the constructive criticism have a positive effect on your work. If someone says you’re totally in the | of talent, ignore them. That’s negative criticism. If |, someone advises you to revise your work and gives you a good reason for doing so, you should consider their suggestions carefully. There are many film stars | were once out of work . There are many famous novelists who made a complete mess of their first novel – or who didn’t, but had to keep on approaching hundreds of publishers before they could get it |. Being successful does depend on luck, to a | extent. But things are more likely to | well if you persevere and stay positive.';
    this.questionTextToArray = text.split('|');
    this.lastText = this.questionTextToArray.length - 1;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WordInContextPage');
  }

}
