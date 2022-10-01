const GetActiveColorFromFen = (fen) => {
  // fen like : "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq -" or "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

  const regExp = /\s(.)/;

  return regExp.exec(fen)[1];
};

const get_piece_positions = (game, piece) => {
  return []
    .concat(...game.board())
    .map((p, index) => {
      if (p !== null && p.type === piece.type && p.color === piece.color) {
        return index;
      }
    })
    .filter(Number.isInteger)
    .map((piece_index) => {
      const row = "abcdefgh"[piece_index % 8];
      const column = Math.ceil((64 - piece_index) / 8);
      return row + column;
    });
};

exports.GetActiveColorFromFen = GetActiveColorFromFen;
exports.get_piece_positions = get_piece_positions;
