import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { Creation } from '../creation/creation';
import { Game } from '../game/game';

import { Room, GameMetadata } from '../../services/interfaces.service';

@Component({
  selector: 'page-lobby',
  templateUrl: 'lobby.html',
})
export class Lobby {

    existingRooms: Array<Room>;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams) {
      this.existingRooms = [
          {
              name: 'Antoine\'s room',
              people: 3,
              open: true,
              metadata: {
                  owner: '@xAdfezau19X'
              }
          },
          {
              name: 'Server party',
              people: 9,
              open: false,
              metadata: {
                  owner: 'dkzq]12oJAd8'
              }
          },
          {
              name: 'Newbies welcomed',
              people: 2,
              open: true,
              metadata: {
                  owner: 'noideayet'
              }
          }
      ];
      // this.existingRooms = [];
  }

  ionViewWillEnter() {
      // TODO: Load rooms
  }


  hostRoom() {
      this.goToCreation();
  }

  joinRoom(data: Room) {
      if(data.open){
          this.navCtrl.setRoot(Game, {data: data});
      }
  }

  goToCreation() {
      let form = this.modalCtrl.create(Creation);
      form.present();
  }

}
