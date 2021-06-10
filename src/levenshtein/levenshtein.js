class LevenshteinSearchableString extends String {
  lev() {
    let rep = 0;
    let rem = 1;
    let ins = 1;
    let min = null;
  }

  _lev({ letter1, letter2, replace, remove, insert }) {
    return Math.min(rep + 1, rem + 1, ins + 1);
  }
}
