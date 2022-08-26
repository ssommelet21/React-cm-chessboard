import React, { useState } from "react";

import { BORDER_TYPE, COLOR } from "cm-chessboard";
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

  function onMoveDone(sourceSquare, targetSquare, fen) {
    console.log("Move played is " + sourceSquare + " " + targetSquare);
    console.log("Fen is " + fen);
    setPosition(fen);
    // handleMove(calculed_fen, move.san);
    return true; // FIXME ?!
  }

  //**************************************************************************************************
  // 5/ return
  //**************************************************************************************************

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "lightblue",
        padding: "10px",
        width: "calc(100vw - 60px)",
        height: "calc(100vh - 60px)",
      }}
    >
      <ReactCMChessboard
        animationDuration={600}
        boardWidth={900}
        showCoordinates={false}
        position={position}
        boardOrientation={boardOrientation}
        cssClass={""} // "", "chessboard-js", "chess-club", "blue", or ""
        borderType={BORDER_TYPE.none} // frame, thin, none
        onMoveDone={onMoveDone}
      />
    </div>
  );
}

export default App;
