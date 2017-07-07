import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, NavParams } from 'ionic-angular';

import { ZetaPushConnection } from 'zetapush-angular';

import { ServerRoom, ServerMember } from '../../services/server.room-interfaces.service';
import { ServerCommunication, ServerQuestion, ServerScore } from '../../services/server.quizz-interfaces.service';

import { RoomService } from '../../services/rooms.service';
import { QuizzService } from '../../services/quizz.service';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class Game {

    // List of players in our room
    participants: Array<ServerMember> = [];
    membersSubscription: any;
    notifSubscription: any;
    scoreSubscription: any;

    // Informations about the room itself
    gameData: ServerRoom;

    // Time before something happens (game or question)
    timeLeft: number = 60;

    // Boolean changing the displayed view
    gameStarted: boolean = false;
    gameEnded: boolean = false;

    // Loading hidden when a question is received
    // And shown when a question ended
    waitingQuestion: any;

    // Boolean allowing to send answers
    canAnswer: boolean = false;

    // Timer stored to be cleared
    timer: any;

    instance: ServerQuestion;
    instanceNumero: number = 0;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams,
              private roomService: RoomService,
              private quizzService: QuizzService,
              private zpConnection: ZetaPushConnection) {

  }

  ionViewWillEnter() {

      // TODO: obtain time left before starting

      // 1°) load the nav parameters
      this.gameData = this.navParams.get('data');

      // 2°) join the room
      this.roomService.join(this.gameData.id);

      // 3°) subscribe to the observables given by the quizz service
      this.membersSubscription = this.roomService.roomMembers.subscribe(
          result => {
              this.participants = result;
          }
      );

      // 4°) calculation of the time left before starting
      const now: number = Date.now();
      const willCloseAt: number = this.gameData.metadata.createdAt + this.gameData.metadata.openDelay;

      // We parse it in milliseconds
      this.timeLeft = Math.floor((willCloseAt - now)/1000);

      // 5°) other game variables initialization
      this.gameStarted = false;
      this.gameEnded = false;

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
      // LEAVING ROOM

      console.log('Cleaning environment');
      this.membersSubscription.unsubscribe();
      if(this.timer){
          clearTimeout(this.timer)
      }
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
      // Leaving the room
      this.roomService.leave(this.gameData.id).then(
          () => {
              // Disconnecting from ZetaPush
              this.zpConnection.disconnect();

              // Coming back Home
              this.navCtrl.setRoot(HomePage);
          }

      );

  }

  // Function decreasing time before game starts
  decreaseTime() {
      if(this.timeLeft > 1) {
          this.timeLeft--;
          return true;
      } else if(this.timeLeft === 1) {
          this.timeLeft--;

          this.startGame();

          return false;
      }
  }


  startGame() {

      this.gameStarted = true;

      this.quizzService.open();

      // Showing a loading
      let loading = this.loadingCtrl.create({
          content: "Game starting"
      });
      loading.present();
      setTimeout(() => {
          loading.dismiss();

          console.log('Showing loader and subscribing to questions');
          this.waitingQuestion = this.loadingCtrl.create({
              content: "Waiting next question..."
          });
          this.waitingQuestion.present();

          this.quizzService.questions.subscribe(
              question => {
                  this.receiveQuestion(question);
              },
              error => {
                  console.error(error);
              },
              () => {
                  this.endQuizz();
              }
          );

          this.notifSubscription = this.quizzService.notifs.subscribe(
              notif => {
                  this.showNotif(notif);
              }
          );

          this.scoreSubscription = this.quizzService.scores.subscribe(
              scores => {
                  this.receiveScores(scores);
              }
          );

      }, 1500);

  }

  // Function decreasing time before question ends
  decreaseQuestionTime() {
      if(this.timeLeft > 1) {
          this.timeLeft--;
          return true;
      } else if(this.timeLeft === 1) {
          this.timeLeft--;
          return false;
      }
  }

  bestParticipants(): Array<ServerMember> {
      if(this.gameEnded) {
          return this.participants;
      } else {
          return this.participants.slice(0,3);
      }
  }

  endQuizz() {
      console.log('Well received, no more questions');
      this.gameEnded = true;

      this.waitingQuestion.dismiss();
      let toast = this.toastCtrl.create({
          message: "No more question, quizz ended !",
          position: "middle",
          duration: 2000
      });
      toast.present();


      this.notifSubscription.unsubscribe();
      this.scoreSubscription.unsubscribe();

      this.quizzService.close();
  }

  // Logic applied when we received a question
  receiveQuestion(communication: ServerCommunication) {

      this.waitingQuestion.dismiss();

      console.log('We received a question,', communication);
      this.instance = communication['content'];

      this.instanceNumero++;
      this.timeLeft = this.instance.time;
      this.canAnswer = true;

      clearInterval(this.timer);
      this.timer = setInterval(() => {
          // If it was the last decrease tick
          if(!this.decreaseQuestionTime()){

              this.canAnswer = false;
              clearInterval(this.timer);

              this.waitingQuestion = this.loadingCtrl.create({
                  content: "Waiting next question..."
              });
              this.waitingQuestion.present();

          }
      }, 1000);
  }

  // TODO: Reduce complexity
  receiveScores(scores: Array<ServerScore>): void {
      for(let i: number = 0; i < scores.length; i++){
          for(let j: number = 0; j < this.participants.length; j++){
              if(scores[i].userKey === this.participants[j].userKey){
                  this.participants[j].score = scores[i].score;
              }
          }
      }
  }

  answerQuestion(answerChosen) {
      if(this.canAnswer){
          this.canAnswer = false;

          // Sending response to server
          this.quizzService.answer(this.gameData.id, answerChosen);

      }
  }

  showNotif(notif: ServerCommunication) {
      let toast = this.toastCtrl.create({
          message: notif.message,
          position: "bottom",
          duration: 1000
      });
      toast.present();
  }



}
