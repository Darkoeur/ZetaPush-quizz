import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController, NavParams } from 'ionic-angular';
import { Game } from '../game/game';

import { ServerRoom, ServerMetadata } from '../../services/server.interfaces.service';

import { RoomService } from '../../services/rooms.service';

@Component({
    selector: 'page-creation',
    templateUrl: 'creation.html',
})
export class Creation {

    roomName: string = "";

    constructor(public navCtrl: NavController,
                public viewCtrl: ViewController,
                public loadingCtrl: LoadingController,
                public navParams: NavParams,
                private roomService: RoomService) {

        }

        createRoom() {
            // TODO: Api call, waiting the response with a Promise
            let waiting = this.loadingCtrl.create({
                content: "Waiting for creation ...",
                duration: 10000
            });
            waiting.present();

            this.roomService.create(this.roomName).then(
                result => {
                    this.navCtrl.setRoot(Game, {data: result['room']});
                    setTimeout(() => {
                        waiting.dismiss();
                    }, 300);
                },
                error => {
                    console.log('error happend');
                }
            );

        }

        dismiss() {
            this.viewCtrl.dismiss();
        }

    }
