import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LessonTabs } from '../pages/lesson-tabs/lesson-tabs';
import { WordsList } from '../pages/words-list/words-list';
import { PracticeParts } from '../pages/practice-parts/pratice-parts';
import { GamesList } from '../pages/games-list/games-list';

import { WordsDetail } from '../pages/words-detail/words-detail';
import { PracticePart1 } from '../pages/practice-part1/practice-part1';
import { PracticePart2 } from '../pages/practice-part2/practice-part2';
import { PracticePart3 } from '../pages/practice-part3/practice-part3';
import { PracticePart4 } from '../pages/practice-part4/practice-part4';
import { PracticePart5 } from '../pages/practice-part5/practice-part5';
import { PracticePart6 } from '../pages/practice-part6/practice-part6';
import { PracticePart7 } from '../pages/practice-part7/practice-part7';
import { WordInContextPage } from '../pages/word-in-context/word-in-context';
import { GameWordFill} from '../pages/game-word-fill/game-word-fill';

import { SafeHtml } from '../pipe/safe-html'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import{ NativeAudio } from '@ionic-native/native-audio';

import { MediaPlugin } from '@ionic-native/media'
import { HttpModule } from '@angular/http'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LessonTabs,
    WordsList,
    PracticeParts,
    GamesList,
    WordsDetail,
    PracticePart1,
    PracticePart2,
    PracticePart3,
    PracticePart4,
    PracticePart5,
    PracticePart6,
    PracticePart7,
    GameWordFill,
    WordInContextPage,
    SafeHtml
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LessonTabs,
    WordsList,
    PracticeParts,
    GamesList,
    WordsDetail,
    PracticePart1,
    PracticePart2,
    PracticePart3,
    PracticePart4,
    PracticePart5,
    PracticePart6,
    PracticePart7,
    GameWordFill,
    WordInContextPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeAudio,
    MediaPlugin,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
