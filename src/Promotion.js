import React from "react";

function Promotion(props) {
  //
  //**************************************************************************************************
  // 1/ variables
  //**************************************************************************************************

  //**************************************************************************************************
  // 2/ useState
  //**************************************************************************************************

  //**************************************************************************************************
  // 3/ general functions
  //**************************************************************************************************

  const handleCloseModal = () => {
    // modal.piece = event.target.getAttribute("data-piece")
    console.log("lol");
    props.refreshFunction("queen");
    // setShow(!show);
  };

  //**************************************************************************************************
  // 4/ return
  //**************************************************************************************************

  return (
    <div className="text-black">
      <label>
        <input
          checked={props.show}
          className="modal-toggle"
          id="main-modal"
          onChange={handleCloseModal}
          type="checkbox"
        />
        Event promote!
      </label>

      <input
        checked={props.show}
        className="modal-toggle"
        id="main-modal"
        onChange={handleCloseModal}
        type="checkbox"
      />

      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Promotion!</h3>
          <p className="py-4">Click a piece or cancel this window</p>
          <div className="flex flex-wrap">
            <div className="flex-[1_0_0%] text-center">
              <svg height="100" width="100" data-piece="q">
                <use data-piece="q" xlinkHref="#bq" />
              </svg>
            </div>

            <div className="flex-[1_0_0%] text-center">
              <svg height="100" width="100" data-piece="r">
                <use data-piece="r" href="#wr" xlinkHref="#wr" />
              </svg>
            </div>

            <div className="flex-[1_0_0%] text-center">
              <svg height="100" width="100" data-piece="n">
                <use data-piece="n" xlinkHref="#wn" />
              </svg>
            </div>

            <div className="flex-[1_0_0%] text-center">
              <svg height="100" width="100" data-piece="b">
                <use data-piece="b" xlinkHref="#wb" />
              </svg>
            </div>
          </div>

          <div className="modal-action mt-0">
            <label
              htmlFor="my-modal"
              className="btn"
              onClick={handleCloseModal}
            >
              Cancel
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Promotion;
