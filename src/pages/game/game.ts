import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, NavParams } from 'ionic-angular';

import { Room, GameMetadata, Player, QuestionInstance, Answer } from '../../services/interfaces.service';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class Game {

    participants: Array<Player>;
    gameData: Room;
    timeLeft: number = 60;
    gameStarted: boolean = false;
    canAnswer: boolean = false;

    timer: any;

    instance: QuestionInstance;
    instanceNumero: number = 0;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

      this.participants = [
          {
              nickname: 'Antoine',
              key: '@xAdfezau19X',
              score: 0
          },
          {
              nickname: 'Zetapush',
              key: 'dkzq]12oJAd8',
              score: 0
          },
          {
              nickname: 'Mathys',
              key: 'norandomid',
              score: 0
          }
      ];
  }

  ionViewWillEnter() {

      // TODO: load participants
      // TODO: obtain time left before starting
      this.gameData = this.navParams.get('data');
      this.timeLeft = 5;
      this.gameStarted = false;

      // Interval decreasing the counter before game starts
      this.timer = setInterval(() => {
          if(!this.decreaseTime()){
              // Game has started
              clearTimeout(this.timer);
          }
          console.log('iteration');
      }, 1000);
  }

  ionViewWillLeave() {
      console.log('clearing events');
      if(this.timer){
          clearTimeout(this.timer)
      }
      return true;
  }

  ionViewDidEnter() {
      let toast = this.toastCtrl.create({
          message: 'You\'ve join the room !',
          duration: 2000,
          position: 'bottom'
      });
      toast.present();
  }

  exit() {
      this.navCtrl.setRoot(HomePage);
  }

  // Function decreasing time before game starts
  decreaseTime() {
      if(this.timeLeft > 1) {
          this.timeLeft--;
          return true;
      } else if(this.timeLeft === 1) {
          this.timeLeft--;
          let loading = this.loadingCtrl.create({
              content: "Game starting"
          });
          loading.present();
          setTimeout(() => {
              loading.dismiss();
              this.gameStarted = true;
              // TODO: subscribe to a server specific channel
              this.receiveQuestion();
          }, 1500);
          return false;
      }
  }

  // Function decreasing time before question ends
  decreaseQuestionTime() {
      if(this.timeLeft > 1) {
          this.timeLeft--;
          return true;
      } else if(this.timeLeft === 1) {
          this.timeLeft--;
          let toast = this.toastCtrl.create({
              message: "Question ended ! Waiting for next one...",
              position: "middle",
              duration: 2000
          });
          toast.present();
          return false;
      }
  }

  bestParticipants(): Array<Player> {
      return this.participants.slice(0,3);
  }

  receiveQuestion() {
      // TODO: Observable listening for the Server
      // (the server will emit questions each X seconds)
      this.instance = {
          question: {
              text: 'Quelle est la capitale de la France ?',
              reward: 3,
              category: 'Géographie'
          },
          answers: [
              {
                  text: 'Marseille'
              },
              {
                  text: 'Rennes'
              },
              {
                  text: 'Paris'
              },
              {
                  text: 'Lyon'
              }
          ],
          time: 10
      };

      this.instanceNumero++;
      this.timeLeft = this.instance.time;
      this.canAnswer = true;

      this.timer = setInterval(() => {
          // If it was the last decrease tick
          if(!this.decreaseQuestionTime()){

              this.canAnswer = false;
              clearTimeout(this.timer);
              setTimeout(() => {
                  this.receiveQuestion();
              }, 2000);

          }
      }, 1000);
  }

  answerQuestion(answerChosen: Answer) {
      if(this.canAnswer){
          this.canAnswer = false;
          // TODO: Api call sending response
          let toast = this.toastCtrl.create({
              message: "Response submitted !",
              position: "bottom",
              duration: 2000
          });
          toast.present();
      }
  }



}
