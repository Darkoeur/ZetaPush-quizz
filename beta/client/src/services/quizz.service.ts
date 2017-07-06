import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ServerCommunication, ServerQuestion } from './server.quizz-interfaces.service';

import { services } from 'zetapush-js';
import { ZetaPushClient } from 'zetapush-angular';

@Injectable()
export class QuizzService {

    private _questions: Subject<ServerCommunication>;
    public questions: Observable<ServerCommunication>;
    public listener: any;

    constructor(private zpClient: ZetaPushClient) {

    }

    open() {

        this._questions = new Subject();
        this.questions = this._questions.asObservable();

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

                        case 'complete':
                            console.debug('Ending the quizz');
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


}
