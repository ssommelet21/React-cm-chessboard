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

  const handleCloseModal = (e) => {
    const modalpiece = e.target.getAttribute("data-piece");
    props.refreshFunction(modalpiece);
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
          <label
            class="btn btn-sm btn-circle absolute right-2 top-2"
            data-piece=""
            onClick={(e) => handleCloseModal(e)}
          >
            ✕
          </label>
          <h3 className="font-bold text-lg">Promotion</h3>
          <div className="grid grid-cols-4 items-start gap-0 bg-white">
            <div className="cursor-pointer p-5 duration-300 hover:-translate-y-1 hover:shadow-xl flex justify-center items-center">
              <svg width="40" height="40" data-piece="q">
                <use
                  data-piece="q"
                  onClick={(e) => handleCloseModal(e)}
                  xlinkHref="#bq"
                />
              </svg>
            </div>

            <div className="cursor-pointer p-5 duration-300 hover:-translate-y-1 hover:shadow-xl flex justify-center items-center">
              <svg width="40" height="40" data-piece="r">
                <use
                  data-piece="r"
                  href="#wr"
                  onClick={(e) => handleCloseModal(e)}
                  xlinkHref="#wr"
                />
              </svg>
            </div>

            <div className="cursor-pointer p-5 duration-300 hover:-translate-y-1 hover:shadow-xl flex justify-center items-center">
              <svg width="40" height="40" data-piece="n">
                <use
                  data-piece="n"
                  onClick={(e) => handleCloseModal(e)}
                  xlinkHref="#wn"
                />
              </svg>
            </div>

            <div className="cursor-pointer p-5 duration-300 hover:-translate-y-1 hover:shadow-xl flex justify-center items-center">
              <svg width="40" height="40" data-piece="b">
                <use
                  data-piece="b"
                  onClick={(e) => handleCloseModal(e)}
                  xlinkHref="#wb"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Promotion;
