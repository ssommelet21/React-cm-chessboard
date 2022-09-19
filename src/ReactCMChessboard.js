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

import { Arrows } from "cm-chessboard/src/cm-chessboard/extensions/arrows/Arrows";

import Promotion from "./Promotion";

import "./styles/cm-chessboard.css";
import "./styles/textured.css";
import "./styles/arrows/arrows.css";

const ReactCMChessboard = (props) => {
  //
  //**************************************************************************************************
  // 1/ variables
  //**************************************************************************************************

  //**************************************************************************************************
  // 2/ useState
  //**************************************************************************************************

  const [board, setBoard] = useState(null);

  const [show, setShow] = useState(false); // promotion

  const [uniqueId, setUniqueId] = useState(uuid());

  const [chess, setChess] = useState(
    new Chess(props.position ? props.position : "")
  );

  //**************************************************************************************************
  // 3/ useEffect
  //**************************************************************************************************

  useEffect(() => {
    if (board) {
      try {
        board.removeMarkers();
        props.showMarker.map((marker) => {
          board.addMarker(marker.type, marker.from);
        });
      } catch (error) {}
    }
  });

  useEffect(() => {
    if (board) {
      try {
        board.removeArrows();
        props.showArrow.map((arrow) => {
          board.addArrow(arrow.type, arrow.from, arrow.to);
        });
      } catch (error) {}
    }
  });

  //
  // FIXME check if fen from parent is the same in ReactCMChessboard after manual move it is always the case ...
  // but it can be different, because the parent control ReactCMChessboard
  //
  useEffect(() => {
    if (board) {
      console.log("Move is played !");
      if (props.position !== chess.fen()) {
        chess.load(props.position);
        // board.disableMoveInput();
        board.state.moveInputProcess.then(() => {
          board.setPosition(props.position, true).then(() => {
            console.log("setPosition is setback ! with : " + props.position);
          });
        });
      }
    }
  }, [props.position]);

  useEffect(() => {
    if (board) {
      console.log("Board is rotated !");
      board.setOrientation(props.boardOrientation, false);
    }
  }, [props.boardOrientation]);

  useEffect(() => {
    if (board) {
      console.log("Board is ready !");
    }
  }, [board]);

  useEffect(() => {
    //**************************************************************************************************
    // a/ Manage props
    //**************************************************************************************************

    let p_animationDuration = props.animationDuration
      ? props.animationDuration
      : 300;

    let p_showCoordinates = props.showCoordinates
      ? props.showCoordinates
      : false;

    let p_boardOrientation = props.boardOrientation
      ? props.boardOrientation
      : COLOR.white;

    let p_cssClass = props.cssClass ? props.cssClass : "";

    let p_borderType = props.borderType ? props.borderType : BORDER_TYPE.thin;

    //**************************************************************************************************
    // b/ Display chessboard
    //**************************************************************************************************

    const boardDiv = document.getElementById("board_" + uniqueId); // from parent : App.js

    const aboard = new Chessboard(boardDiv, {
      position: chess.fen(),
      sprite: { url: "/images/chessboard-sprite-staunty.svg" },
      style: {
        cssClass: p_cssClass,
        borderType: p_borderType,
        aspectRatio: 1,
        showCoordinates: p_showCoordinates,
        moveFromMarker: MARKER_TYPE.square,
        moveToMarker: MARKER_TYPE.square,
      },
      extensions: [
        {
          class: Arrows,
          props: {
            sprite: {
              url: "/images/arrows.svg",
            },
          },
        },
      ],
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

    setBoard(aboard);

    aboard.enableMoveInput(inputHandler);

    /*

    aboard.addMarker(MARKER_TYPE.square, "e5");
    aboard.addMarker(MARKER_TYPE.frame, "b6");
    aboard.addMarker(MARKER_TYPE.frame, "h6");

    aboard.addArrow(ARROW_TYPE.default, "g1", "f3");
    aboard.addArrow(ARROW_TYPE.default, "b8", "c6");
    aboard.addArrow(ARROW_TYPE.pointy, "c2", "c4");
    aboard.addArrow(ARROW_TYPE.danger, "f6", "e4");

    aboard.removeMarkers(MARKER_TYPE.frame, "h6");

    */

    //**************************************************************************************************
    // c/ Unmount chessboard
    //**************************************************************************************************

    return () => {
      try {
        //
        aboard.removeMarkers(); // before aboard.destroy()
        aboard.removeArrows(); // before aboard.destroy()
        //
        aboard.destroy();
        const boardDiv = document.getElementById("board_" + uniqueId); // from parent : App.js
        boardDiv.innerHTML = ""; // cleaning ...
      } catch (error) {}
      setBoard(null);
    };
  }, []);

  //**************************************************************************************************
  // 4/ general functions
  //**************************************************************************************************

  const updateShow = (retour) => {
    console.log(retour);
    setShow(false);
  };

  const handleOnMoveStart = (chess, event) => {
    const moves = chess.moves({ square: event.square, verbose: true });
    for (const move of moves) {
      event.chessboard.addMarker(MARKER_TYPE.dot, move.to);
    }
    return moves.length > 0;
  };

  const handleOnMoveDone = (chess, event) => {
    if (
      event.squareTo.substring(1, 2) === "8" ||
      event.squareTo.substring(1, 2) === "1"
    ) {
      setShow(!show);
      return;
    }
    const move = { from: event.squareFrom, to: event.squareTo };
    const result = chess.move(move);
    if (result) {
      // event.chessboard.disableMoveInput();
      event.chessboard.state.moveInputProcess.then(() => {
        event.chessboard.setPosition(chess.fen(), true).then(() => {
          console.log("setPosition is set ! with : " + chess.fen());
          props.onMoveDone(move.from, move.to, result.san, chess.fen());
        });
      });
    } else {
      console.warn("invalid move", move);
    }
    return result;
  };

  function inputHandler(event) {
    //
    event.chessboard.removeMarkers(MARKER_TYPE.dot);
    //

    switch (event.type) {
      case INPUT_EVENT_TYPE.moveStart:
        return handleOnMoveStart(chess, event); // draw dots on possible squares
      case INPUT_EVENT_TYPE.moveDone:
        return handleOnMoveDone(chess, event); // check move valid or not
      case INPUT_EVENT_TYPE.moveCanceled:
        console.log("moveCanceled");
        break;
      default:
        console.log(INPUT_EVENT_TYPE);
        break;
    }
  }

  //**************************************************************************************************
  // 5/ return
  //**************************************************************************************************

  let p_boardWidth = props.boardWidth ? props.boardWidth : 500;

  let divStyle = {
    float: "left",
    width: p_boardWidth + "px",
    height: p_boardWidth + "px",
    marginRight: "20px",
    marginBottom: "20px",
  };

  return (
    <>
      <div
        id={"board_" + uniqueId}
        className="ReactCMChessboard"
        style={divStyle}
      ></div>
      <Promotion show={show} refreshFunction={updateShow} />
    </>
  );
};

export default ReactCMChessboard;
