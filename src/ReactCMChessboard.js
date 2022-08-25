import React, { useState, useEffect } from "react";

import { Chess } from "chess.js";

import { v4 as uuid } from "uuid";

import {
  INPUT_EVENT_TYPE,
  COLOR,
  Chessboard,
  BORDER_TYPE,
  MARKER_TYPE,
} from "cm-chessboard";

import "./styles/cm-chessboard.css";

const ReactCMChessboard = (props) => {
  //
  //**************************************************************************************************
  // 1/ variables
  //**************************************************************************************************

  var board; // FIXME using REF instead ?

  //**************************************************************************************************
  // 2/ useState
  //**************************************************************************************************

  const [uniqueId, setUniqueId] = useState(uuid());

  const [chess, setChess] = useState(
    new Chess(props.position ? props.position : "")
  );

  //**************************************************************************************************
  // 3/ useEffect
  //**************************************************************************************************

  useEffect(() => {
    //**************************************************************************************************
    // a/ Manage props
    //**************************************************************************************************

    let p_animationDuration = props.animationDuration
      ? props.animationDuration
      : 300;

    let p_boardWidth = props.boardWidth ? props.boardWidth : 500;

    let p_showCoordinates = props.showCoordinates
      ? props.showCoordinates
      : false;

    let p_boardOrientation = props.boardOrientation
      ? props.boardOrientation
      : COLOR.white;

    //**************************************************************************************************
    // b/ Display chessboard
    //**************************************************************************************************

    const boardDiv = document.getElementById("board_" + uniqueId); // from parent : App.js

    board = new Chessboard(boardDiv, {
      position: chess.fen(),
      sprite: { url: "/images/chessboard-sprite-staunty.svg" },
      style: {
        cssClass: "", // green, chessboard-js, chess-club, blue, "", green
        borderType: BORDER_TYPE.thin, // frame, thin, none
        aspectRatio: 1,
        showCoordinates: p_showCoordinates,
        moveFromMarker: MARKER_TYPE.square,
        moveToMarker: MARKER_TYPE.square,
      },
      orientation: p_boardOrientation,
      animationDuration: p_animationDuration,
      responsive: true,
      accessibility: {
        brailleNotationInAlt: true, // show the braille notation of the game in the alt attribute of the svg
        movePieceForm: true, // display a form to move a piece (from, to, move)
        boardAsTable: true, // display the board additionally as HTML table
        piecesAsList: true, // display the pieces additionally as List
        visuallyHidden: true, // hide all those extra outputs visually but keep them accessible for screen readers and braille displays
      },
    });

    board.enableMoveInput(inputHandler);

    //**************************************************************************************************
    // c/ Unmount chessboard
    //**************************************************************************************************

    return () => {
      board.destroy();
      const boardDiv = document.getElementById("board_" + uniqueId); // from parent : App.js
      boardDiv.innerHTML = ""; // cleaning ...
    };
  }, []);

  //**************************************************************************************************
  // 4/ general functions
  //**************************************************************************************************

  const handleOnMoveDone = (value, fen) => {
    props.onMoveDone(value.from, value.to, fen);
  };

  function inputHandler(event) {
    event.chessboard.removeMarkers(MARKER_TYPE.dot);

    switch (event.type) {
      case INPUT_EVENT_TYPE.moveStart:
        const moves = chess.moves({ square: event.square, verbose: true });
        for (const move of moves) {
          // draw dots on possible squares
          event.chessboard.addMarker(MARKER_TYPE.dot, move.to);
        }
        return moves.length > 0;
      case INPUT_EVENT_TYPE.moveDone:
        const move = { from: event.squareFrom, to: event.squareTo };
        const result = chess.move(move);
        if (result) {
          handleOnMoveDone(move, chess.fen());
          setTimeout(() => {
            event.chessboard.setPosition(chess.fen(), true);
          }, 500);
        } else {
          console.warn("invalid move", move);
        }
        return result;
      case INPUT_EVENT_TYPE.moveCanceled:
        console.log(`moveCanceled`);
        break;
      default:
        console.log(INPUT_EVENT_TYPE);
        break;
    }
  }

  //**************************************************************************************************
  // 5/ return
  //**************************************************************************************************

  return (
    <div
      id={"board_" + uniqueId}
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

export default ReactCMChessboard;
