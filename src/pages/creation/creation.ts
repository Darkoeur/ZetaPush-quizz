import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController, NavParams } from 'ionic-angular';
import { Game } from '../game/game';

@Component({
    selector: 'page-creation',
    templateUrl: 'creation.html',
})
export class Creation {

    constructor(public navCtrl: NavController,
        public viewCtrl: ViewController,
        public loadingCtrl: LoadingController,
        public navParams: NavParams) {
        }

        ionViewDidLoad() {
            console.log('ionViewDidLoad Creation');
        }

        createRoom() {
            // TODO: Api call, waiting the response with a Promise
            let waiting = this.loadingCtrl.create({
                content: "Waiting for creation ...",
                duration: 10000,
                dismissOnPageChange: true
            });
            waiting.present();

            setTimeout(() => {
                // TODO: Pass navParams to Game (the infos obtained by an api call)
                this.navCtrl.setRoot(Game);
                setTimeout(() => {
                    waiting.dismiss();
                }, 300);
            }, 2500);

        }

        dismiss() {
            this.viewCtrl.dismiss();
        }

    }
