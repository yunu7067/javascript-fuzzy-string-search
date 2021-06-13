class LevenshteinSearchableString extends String {
  lev(foo) {
    if (typeof foo !== "string") return undefined;

    const x = this.length + 1;
    const y = foo.length + 1;
    const matrix = Array.from({ length: y }).map((_, row) =>
      Array.from({ length: x }).map((_, col) => {
        if (row === 0) {
          return col;
        } else if (col === 0) {
          return row;
        }
        return undefined;
      })
    );

    matrix.map((row, rowIndex) => {
      row.map((col, colIndex) => {
        if (col !== undefined) return;

        matrix[rowIndex][colIndex] = this._lev({
          letter1: this[colIndex - 1],
          letter2: foo[rowIndex - 1],
          replace: matrix[rowIndex - 1][colIndex - 1],
          remove: matrix[rowIndex - 1][colIndex],
          insert: matrix[rowIndex][colIndex - 1],
        });
      });
    });
    //console.log(matrix);

    return { distance: matrix[y - 1][x - 1] };
  }

  _lev({ letter1, letter2, replace, remove, insert }) {
    if (letter1 !== letter2) {
      return Math.min(replace + 1, remove + 1, insert + 1);
    } else {
      return replace;
    }
  }
}

const test = new LevenshteinSearchableString("did you mean");
console.log(test.toString(), test.lev("dd u meant"));
