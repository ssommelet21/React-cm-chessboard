import React, { useState, useEffect, useRef } from "react";

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
import "./styles/cm-chessNObook.css";
import "./styles/textured.css";
import "./styles/arrows/arrows.css";

//**************************************************************************************************
// require
//**************************************************************************************************

const {
  GetActiveColorFromFen,
  get_piece_positions,
} = require("./Includes/global");

const ReactCMChessboard = (props) => {
  //
  //**************************************************************************************************
  // 1/ variables
  //**************************************************************************************************

  const MarkerCheckType = {
    class: "markerCheckCircleRed",
    slice: "markerDot",
  };

  //**************************************************************************************************
  // 2/ useState & useRef
  //**************************************************************************************************

  const [board, setBoard] = useState(null);
  const boardRef = useRef(board);

  const [show, setShow] = useState({
    From: "",
    To: "",
    IsShow: false,
    Color: null,
  });
  const showRef = useRef(show);

  const [uniqueId, setUniqueId] = useState(uuid());

  const [chess, setChess] = useState(
    new Chess(props.position ? props.position : "")
  );

  //**************************************************************************************************
  // 3/ useEffect
  //**************************************************************************************************

  useEffect(() => {
    showRef.current = show;
  }, [show]);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  useEffect(() => {
    console.log("redisplay marker and arrow and check");
    displayMarkerAndArrowAndCheck();
  });

  //
  // FIXME check if fen from parent is the same in ReactCMChessboard after manual move it is always the case ...
  // but it can be different, because the parent control ReactCMChessboard
  //
  useEffect(() => {
    if (board) {
      console.log("Fen position is changed on cm-chessboard !");
      if (props.position !== chess.fen()) {
        chess.load(props.position);
        RemoveKingCheckIfExist();
        displayKingCheck();
        // board.disableMoveInput();
        if (board.state.moveInputProcess === undefined) {
          board.setPosition(props.position, true).then(() => {
            console.log("setPosition is setback ! with : " + props.position);
          });
        } else {
          board.state.moveInputProcess.then(() => {
            board.setPosition(props.position, true).then(() => {
              console.log("setPosition is setback ! with : " + props.position);
            });
          });
        }
      }
    }
  }, [props.position, props.repaint]);

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

  const displayMarkerAndArrowAndCheck = () => {
    let board = boardRef.current;
    if (board) {
      //
      try {
        board.removeMarkers();
        props.showMarker.map((marker) => {
          board.addMarker(marker.type, marker.from);
        });
      } catch (error) {}
      //
      try {
        board.removeArrows();
        props.showArrow.map((arrow) => {
          board.addArrow(arrow.type, arrow.from, arrow.to);
        });
      } catch (error) {}
      //
      displayKingCheck();
    }
  };

  const RemoveKingCheckIfExist = () => {
    let board = boardRef.current;
    board.removeMarkers(MarkerCheckType, undefined);
  };

  const displayKingCheck = () => {
    let board = boardRef.current;
    if (chess.in_check()) {
      const return_king = get_piece_positions(chess, {
        type: "k",
        color: GetActiveColorFromFen(chess.fen()),
      });
      board.addMarker(MarkerCheckType, return_king[0]);
    }
  };

  const updateShow = (retour) => {
    let temp_oldShow = { ...showRef.current };
    setShow({
      From: "",
      To: "",
      IsShow: false,
      Color: null,
    });
    if (retour) {
      console.log(retour);
      handleOnMoveDoneAction(chess, temp_oldShow.From, temp_oldShow.To, retour);
    }
  };

  const handleOnMoveStart = (chess, event) => {
    // const myMarkerType = { class: "markerCircleRed", slice: "markerCircle" }; // class and id svg
    // const myMarkerType = { class: "markerCheckCircleRed", slice: "markerDot" }; // class and id svg
    //
    // markerFrame markerCircle markerDot markerSquare : from chessboard-sprite-staunty.svg or others
    let typeOfPiece;
    const moves = chess.moves({ square: event.square, verbose: true });
    for (const move of moves) {
      typeOfPiece = chess.get(move.to);
      if (typeOfPiece !== null) {
        event.chessboard.addMarker(MARKER_TYPE.frame, move.to);
      } else {
        event.chessboard.addMarker(MARKER_TYPE.dot, move.to); // myMarkerType, move.to
      }
    }
    displayKingCheck(); // add a marker red on king if the king is attacked
    return moves.length > 0;
  };

  const handleOnMoveDone = (chess, event) => {
    const move = {
      from: event.squareFrom,
      to: event.squareTo,
      promotion: "q",
    };
    const new_chess = new Chess(chess.fen()); // in fact the move need to be tested BEFORE to be played for handle promotion ...
    const result = new_chess.move(move); // so we use a new chess.js object
    if (result) {
      const typeOfPiece = chess.get(event.squareFrom);
      let typeOfPiece_pawn = typeOfPiece ? true : false;
      //
      if (!(typeOfPiece_pawn && typeOfPiece.type === "p")) {
        typeOfPiece_pawn = false; // correction : not a pawn
      }
      //
      if (
        (event.squareTo.substring(1, 2) === "8" ||
          event.squareTo.substring(1, 2) === "1") &&
        typeOfPiece_pawn
      ) {
        setShow({
          From: event.squareFrom,
          To: event.squareTo,
          IsShow: true,
          Color: chess.turn(),
        });
        return;
      } else {
        return handleOnMoveDoneAction(chess, event.squareFrom, event.squareTo);
      }
    } else {
      console.warn("invalid move", move);
      return result;
    }
  };

  const handleOnMoveDoneAction = (
    chess,
    squareFrom,
    squareTo,
    piecePromotion = "q"
  ) => {
    const temp_board = boardRef.current;
    const move = {
      from: squareFrom,
      to: squareTo,
      promotion: piecePromotion,
    };

    const result = chess.move(move); // move is always valid because it was called by handleOnMoveDone

    // temp_board.disableMoveInput();
    if (temp_board.state.moveInputProcess === undefined) {
      temp_board.setPosition(chess.fen(), true).then(() => {
        console.log("setPosition is set ! with : " + chess.fen());
        props.onMoveDone(move.from, move.to, result.san, chess.fen());
      });
    } else {
      temp_board.state.moveInputProcess.then(() => {
        temp_board.setPosition(chess.fen(), true).then(() => {
          console.log("setPosition is set ! with : " + chess.fen());
          props.onMoveDone(move.from, move.to, result.san, chess.fen());
        });
      });
    }

    return result;
  };

  function inputHandler(event) {
    //
    event.chessboard.removeMarkers();
    event.chessboard.removeArrows();
    //

    switch (event.type) {
      case INPUT_EVENT_TYPE.moveStart:
        return handleOnMoveStart(chess, event); // draw dots, frames on possible squares
      case INPUT_EVENT_TYPE.moveDone:
        return handleOnMoveDone(chess, event); // check move valid or not
      case INPUT_EVENT_TYPE.moveCanceled:
        console.log("moveCanceled");
        displayKingCheck(); // add a marker red on king if the king is attacked
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
    width: p_boardWidth + "px",
    height: p_boardWidth + "px",
  };

  return (
    <>
      <div
        id={"board_" + uniqueId}
        className="ReactCMChessboard"
        style={divStyle}
      ></div>
      <Promotion
        show={show.IsShow}
        color={show.Color}
        refreshFunction={updateShow}
      />
    </>
  );
};

export default ReactCMChessboard;
