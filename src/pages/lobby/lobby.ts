import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, NavParams } from 'ionic-angular';

import { Creation } from '../creation/creation';
import { Game } from '../game/game';
import { ServerRoom } from '../../services/server.interfaces.service';
import { RoomService } from '../../services/rooms.service';

@Component({
    selector: 'page-lobby',
    templateUrl: 'lobby.html',
})
export class Lobby {

    existingRooms: Array<ServerRoom>;

    constructor(public navCtrl: NavController,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController,
        public navParams: NavParams,
        private roomService: RoomService) {

            roomService.rooms.subscribe(
                result => {
                    this.existingRooms = result;
                }
            );

            roomService.roomMembers.subscribe(
                result => {
                    console.debug(result);
                }
            )

        }


        ionViewWillEnter() {
            // List all the existing rooms
            this.roomService.list();
        }



        // When joining a room
        joinRoom(data: ServerRoom) {
            if(data.metadata.open){
                // We ask the server
                this.roomService.join(data.id).then(
                    result => {
                        if(result.isOpen){
                            // If it's OK, we navigate to the game view
                            this.navCtrl.setRoot(Game, {data: data});
                        } else {
                            this.roomService.joinLobby();
                            this.roomService.list();
                            let alert = this.alertCtrl.create({
                                title: 'Impossible !',
                                subTitle: 'It looks like the room you have tried to join is now closed..',
                                buttons: ['OK']
                            });
                            alert.present();
                        }
                    },
                    error => {
                        console.log('Error occurred during join process');
                    }
                );
            }
        }


        // When the user would like to create is own room
        hostRoom() {
            this.goToCreation();
        }

        goToCreation() {
            let form = this.modalCtrl.create(Creation);
            form.present();
        }

    }
