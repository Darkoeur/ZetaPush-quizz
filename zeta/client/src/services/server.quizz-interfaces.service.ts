export interface ServerCommunication {
    type: string;
    content: ServerQuestion | any;
    message: string;
}

export interface ServerQuestion {
    question: string;
    category: string;
    answers: Array<string>;
    time: number;
}

export interface ServerScore {
    userKey: string;
    score: number;
}
