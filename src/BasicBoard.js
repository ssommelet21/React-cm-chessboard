import React, { useState, useEffect } from "react";

import { Chess } from "chess.js";

import {
  INPUT_EVENT_TYPE,
  COLOR,
  Chessboard,
  BORDER_TYPE,
  MARKER_TYPE,
} from "cm-chessboard";

import "./styles/cm-chessboard.css";

const BasicBoard = (props) => {
  //
  //**************************************************************************************************
  // 1/ variables
  //**************************************************************************************************

  var board;

  //**************************************************************************************************
  // 2/ useState
  //**************************************************************************************************

  const [chess, setChess] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [history, setHistory] = useState([]);

  //**************************************************************************************************
  // 3/ useEffect
  //**************************************************************************************************

  useEffect(() => {
    const boardDiv = document.getElementById("board"); // from parent : App.js

    board = new Chessboard(boardDiv, {
      position: chess.fen(),
      sprite: { url: "/images/chessboard-sprite-staunty.svg" },
      style: {
        cssClass: "", // green, chessboard-js, chess-club, blue, "", green
        borderType: BORDER_TYPE.frame, // frame, thin, none
        aspectRatio: 1,
        showCoordinates: true,
        moveFromMarker: MARKER_TYPE.square,
        moveToMarker: MARKER_TYPE.square,
      },
      orientation: COLOR.white,
      animationDuration: 1000,
      responsive: true,
      accessibility: {
        brailleNotationInAlt: true, // show the braille notation of the game in the alt attribute of the svg
        movePieceForm: true, // display a form to move a piece (from, to, move)
        boardAsTable: true, // display the board additionally as HTML table
        piecesAsList: true, // display the pieces additionally as List
        visuallyHidden: true, // hide all those extra outputs visually but keep them accessible for screen readers and braille displays
      },
    });

    board.enableMoveInput(inputHandler, COLOR.white);

    return () => {
      board.destroy();
      const boardDiv = document.getElementById("board"); // from parent : App.js
      boardDiv.innerHTML = ""; // cleaning ...
    };
  }, []);

  //**************************************************************************************************
  // 4/ general functions
  //**************************************************************************************************

  function inputHandler(event) {
    console.log("event", event);
    event.chessboard.removeMarkers(MARKER_TYPE.dot);
    if (event.type === INPUT_EVENT_TYPE.moveStart) {
      const moves = chess.moves({ square: event.square, verbose: true });
      for (const move of moves) {
        // draw dots on possible squares
        event.chessboard.addMarker(MARKER_TYPE.dot, move.to);
      }
      return moves.length > 0;
    } else if (event.type === INPUT_EVENT_TYPE.moveDone) {
      const move = { from: event.squareFrom, to: event.squareTo };
      const result = chess.move(move);
      if (result) {
        event.chessboard.disableMoveInput();
        const possibleMoves = chess.moves({ verbose: true });
        if (possibleMoves.length > 0) {
          const randomIndex = Math.floor(Math.random() * possibleMoves.length);
          const randomMove = possibleMoves[randomIndex];
          setTimeout(() => {
            // smoother with 500ms delay
            chess.move({ from: randomMove.from, to: randomMove.to });

            //
            setFen(chess.fen());
            setHistory(chess.history({ verbose: true }));
            //

            event.chessboard.enableMoveInput(inputHandler, COLOR.white);
            event.chessboard.setPosition(chess.fen(), true);
          }, 500);
        }

        //
        setFen(chess.fen());
        setHistory(chess.history({ verbose: true }));
        //
      } else {
        console.warn("invalid move", move);
      }
      return result;
    }
  }

  //**************************************************************************************************
  // 5/ return
  //**************************************************************************************************

  return (
    <div
      id="board"
      style={{
        float: "left",
        width: `500px`,
        height: `500px`,
        marginRight: "20p",
        marginBottom: "20px",
      }}
    ></div>
  );
};

export default BasicBoard;
