import React, { useEffect } from "react";

import { Chess } from "chess.js";

import {
  INPUT_EVENT_TYPE,
  COLOR,
  Chessboard,
  MARKER_TYPE,
} from "cm-chessboard";

import "./assets/styles/cm-chessboard.css";

const BasicBoard = (props) => {
  //
  //**************************************************************************************************
  // 1/ variables
  //**************************************************************************************************

  const chess = new Chess();

  var board;

  useEffect(() => {
    console.log("useEffect2 called here");

    const boardsDiv = document.getElementById("board");
    const boardDiv = document.createElement("div");
    // boardDiv.setAttribute("class", "board1");
    boardsDiv.appendChild(boardDiv);

    board = new Chessboard(boardDiv, {
      position: chess.fen(),
      sprite: { url: "/images/chessboard-sprite-staunty.svg" },
      style: {
        moveFromMarker: MARKER_TYPE.square,
        moveToMarker: MARKER_TYPE.square,
      },
      orientation: COLOR.white,
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
      boardsDiv.removeChild(boardDiv);
    };
  }, []);

  //**************************************************************************************************
  // 4/ functions générales
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
            event.chessboard.enableMoveInput(inputHandler, COLOR.white);
            event.chessboard.setPosition(chess.fen(), true);
          }, 500);
        }
      } else {
        console.warn("invalid move", move);
      }
      return result;
    }
  }

  //**************************************************************************************************
  // 4/ return
  //**************************************************************************************************

  return;
};

export default BasicBoard;
