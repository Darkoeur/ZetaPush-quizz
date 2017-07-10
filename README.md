# ZetaPush-quizz
Real-time quizz with websockets and multiple rooms

## First step : login

![alt text][login]

## Second step : lobby

Since you've joined the lobby you have three choices :
* Join a room
* Create your own
* Wait, as the lobby is real-time sync, there is no need for refreshing !

![alt text][lobby]

![alt text][creation]

The creation view allows you to define custom parameters such as the number of questions, or the delay before game starts.

## Third step : game (before)

No difference between the creator of the room and the others who joined,
Just wait the game to start and observe who will play with you.

![alt text][gameLobby]

## Fourth step : game (during)

Once the game has started, nobody can enter the room and questions are sent by the server each X seconds.

![alt text][gameQuestion]

Once answering server notifies you about the correctness and then refresh scores for all players. All players will be aware in real-time of who is winning.

![alt text][gameAnswer]

At the end game ladder is displayed, and the players can return to lobby.

## Fifth step : game (after)

The room stays visible a certain time before it is destroyed.

![alt text][end]

[login]: https://wires.fr/imgs/quizz-login.png "Login - the entry point of the app"
[lobby0]: https://wires.fr/imgs/quizz-lobby0.png "Lobby - when there is 0 room available"
[lobby]: https://wires.fr/imgs/quizz-lobby.png "Lobby - where you can decide what to do next"
[creation]: https://wires.fr/imgs/quizz-creation.png "Creation - start your own room with custom parameters"
[gameLobby]: https://wires.fr/imgs/quizz-game1.png "Game - you will automatically join your room"
[gameQuestion]: https://wires.fr/imgs/quizz-game2.png "Game - questions will be sent by the server"
[gameAnswer]: https://wires.fr/imgs/quizz-game3.png "Game - answering can be done only once"
[gameLadder]: https://wires.fr/imgs/quizz-game4.png "Game - winners are displayed at the end"

[end]: https://wires.fr/imgs/quizz-end.png "Lobby - from there you can play again or disconnect"
