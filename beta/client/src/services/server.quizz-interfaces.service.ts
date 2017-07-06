export interface ServerCommunication {
    type: string;
    content: ServerQuestion;
    message: string;
}

export interface ServerQuestion {
    question: string;
    category: string;
    answers: Array<string>;
    time: number;
}
