export interface Room {
    name: string;
    people: number;
    open: boolean;
    metadata: GameMetadata;
}



export interface GameMetadata {
    owner: string;
}

export interface Player {
    nickname: string;
    key: string;
    score?: number;
}

/* Interfaces related to the game itself */

export interface QuestionInstance {
    question: Question;
    answers: Array<Answer>;
    time: number;
}

export interface Question {
    text: string;
    category: string;
    reward: number;
}

export interface Answer {
    text: string;
}
