import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { RoomApi } from './rooms.api.service';
import { ServerCommunication, ServerQuestion, ServerScore } from './server.quizz-interfaces.service';

import { services } from 'zetapush-js';
import { ZetaPushClient } from 'zetapush-angular';

@Injectable()
export class QuizzService {

    private _questions: Subject<ServerCommunication>;
    public questions: Observable<ServerCommunication>;
    public listener: any;

    private _scores:Subject<Array<ServerScore>>;
    public scores: Observable<Array<ServerScore>>;

    private _notifs: Subject<ServerCommunication>;
    public notifs: Observable<ServerCommunication>;

    constructor(private roomApi: RoomApi, private zpClient: ZetaPushClient) {

    }

    open() {

        this._questions = new Subject();
        this.questions = this._questions.asObservable();

        this._scores = new Subject();
        this.scores = this._scores.asObservable();

        this._notifs = new Subject();
        this.notifs = this._notifs.asObservable();

        // Adding a listener
        this.listener = this.zpClient.createService({
            Type: services['Messaging'],
            listener: {
                message: (message) => {
                    console.debug('Received from server the following : ', message['data']['data']);

                    const communication: ServerCommunication = message['data']['data'];

                    switch(communication['type']){

                        case 'question':
                            this._questions.next(communication);
                            break;

                        case 'notification':
                            console.log('received a notif');
                            this._notifs.next(communication);
                            break;

                        case 'scores':
                            this._scores.next(communication['content']);
                            break;

                        case 'complete':
                            this._questions.complete();
                            break;

                        default:
                            console.log('Type of the communication unknown');
                            break;
                    }
                },
                error: (error) => {
                    console.error(error);
                }
            }
        });
    }

    close() {
        // Deleting the listener
        this.zpClient.unsubscribe(this.listener);
    }

    answer(room: string, given: string) {
        this.roomApi.answerQuestion({room: room, givenAnswer: given});
    }


}
