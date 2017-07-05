import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// ?!
// import { Client } from 'zetapush-js';

import { ZetaPushClientConfig, ZetaPushModule } from 'zetapush-angular';
import { RoomApiProvider } from '../services/rooms.api.service';
import { RoomService } from '../services/rooms.service';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Lobby } from '../pages/lobby/lobby';
import { Creation } from '../pages/creation/creation';
import { Game } from '../pages/game/game';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Lobby,
    Creation,
    Game
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ZetaPushModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Lobby,
    Creation,
    Game
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: ZetaPushClientConfig, useValue: {sandboxId: 'zpZ2OwJe'}},
    RoomApiProvider,
    RoomService
  ]
})
export class AppModule {}
