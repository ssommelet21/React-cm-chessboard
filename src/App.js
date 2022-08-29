import React, { useState } from "react";

import { COLOR, BORDER_TYPE, MARKER_TYPE } from "cm-chessboard";

import { ARROW_TYPE } from "cm-chessboard/src/cm-chessboard/extensions/arrows/Arrows";

import ReactCMChessboard from "./ReactCMChessboard";

function App() {
  //
  //**************************************************************************************************
  // 1/ variables
  //**************************************************************************************************

  //**************************************************************************************************
  // 2/ useState
  //**************************************************************************************************

  const [position, setPosition] = useState(
    "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2"
  );

  const [boardOrientation, setboardOrientation] = useState(COLOR.white);
  const [markers, setMarkers] = useState([]);
  const [arrows, setArrows] = useState([]);

  //**************************************************************************************************
  // 3/ useEffect
  //**************************************************************************************************

  //**************************************************************************************************
  // 4/ general functions
  //**************************************************************************************************

  /*

  const handleMove = (valueFen, valueMove) => {
    const temp_FenMove = {
      fen: DeleteMovesFromFen(valueFen),
      move: valueMove,
    };
    //
    sound.play();
    //
    props.refreshFunction(temp_FenMove);
  };

 */

  const AddMarker = () => {
    // const MarkersCopy = [...markers];
    const MarkersNoCopy = [];

    const newMarker = {
      type: MARKER_TYPE.frame,
      from: "b6",
    };

    MarkersNoCopy.push(newMarker);
    setMarkers(MarkersNoCopy);
  };

  const AddArrow = () => {
    // const ArrowsCopy = [...arrows];
    const ArrowsNoCopy = [];

    const newArrow = {
      type: ARROW_TYPE.danger,
      from: "f6",
      to: "e4",
    };

    ArrowsNoCopy.push(newArrow);
    setArrows(ArrowsNoCopy);
  };

  const ClearAll = () => {
    const MarkersNoCopy = [];
    const ArrowsNoCopy = [];
    setMarkers(MarkersNoCopy);
    setArrows(ArrowsNoCopy);
  };

  const RotateBoard = () => {
    let p_boardOrientation =
      boardOrientation === COLOR.white ? COLOR.black : COLOR.white;
    setboardOrientation(p_boardOrientation);
  };

  const onMoveDone = (sourceSquare, targetSquare, san, fen) => {
    console.log("Move played is " + sourceSquare + " " + targetSquare);
    console.log("Fen is " + fen);
    setPosition(fen);
    // handleMove(fen, san);
    return true; // FIXME ?!
  };

  //**************************************************************************************************
  // 5/ return
  //**************************************************************************************************

  return (
    <>
      <button onClick={() => AddMarker()}> Add marker on b6</button>
      <button onClick={() => AddArrow()}> Add arrow f6 e4</button>
      <button onClick={() => ClearAll()}> Clear markers & arrows </button>
      <button onClick={() => RotateBoard()}> Rotate Board </button>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignContent: "center",
          backgroundColor: "lightblue",
          padding: "10px",
          width: "calc(100vw - 60px)",
          height: "calc(100vh - 100px)",
        }}
      >
        <ReactCMChessboard
          animationDuration={600}
          boardWidth={800}
          showCoordinates={false}
          position={position}
          boardOrientation={boardOrientation}
          cssClass={""} // "", "chessboard-js", "chess-club", "blue", or "green"
          borderType={BORDER_TYPE.none} // frame, thin, none
          onMoveDone={onMoveDone}
          showMarker={markers}
          showArrow={arrows}
        />
      </div>
    </>
  );
}

export default App;
