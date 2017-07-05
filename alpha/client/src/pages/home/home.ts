import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Lobby } from '../lobby/lobby';

import { ZetaPushConnection } from 'zetapush-angular';
import { RoomService } from '../../services/rooms.service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    login: string = "";
    password: string = "";

    constructor(public navCtrl: NavController,
                private zpConnection: ZetaPushConnection,
                private roomService: RoomService) {

    }

    submit() {
        // On success we go to lobby
        this.zpConnection.connect({login: this.login, password: this.password}).then(
            () => {
                console.debug('CONNECTED');

                this.goToLobby();
            },
            err => {
                console.debug('FAILED TO CONNECT');
            }
        );

    }

    goToLobby() {
        // Join the lobby room (idempotent)
        this.roomService.joinLobby();

        // Show the associated view
        this.navCtrl.setRoot(Lobby);
    }

}
