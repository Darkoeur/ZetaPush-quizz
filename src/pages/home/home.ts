import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Lobby } from '../lobby/lobby';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  submit() {
      // TODO: Server check, API calls
      this.goToLobby();
  }

  goToLobby() {
      this.navCtrl.setRoot(Lobby);
  }

}
