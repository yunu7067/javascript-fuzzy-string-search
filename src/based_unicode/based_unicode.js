class SearchableObject extends Object {
  constructor(obj) {
    super(obj, obj);
    Object.assign(this, obj);
  }

  /**
   *
   * @param {String} keyword
   * @returns {Boolean}
   */
  search(keyword) {
    const regex = this._createFuzzyMatcher(keyword);
    const find = Object.values(this).filter((value) => typeof value === "string");
    //console.log("test", find, regex);
    return !!find.find((text) => regex.test(text));
  }

  /**
   *
   * @param {String} keyword
   * @param {String} marker
   */
  searchAndMarking(keyword, marker) {}

  _createFuzzyMatcher(keyword) {
    const pattern = keyword
      .split("")
      .map((char) => this._createFuzzyPattern(char))
      .join(".*?");

    console.log("pattern", pattern);
    return new RegExp(pattern);
  }

  _createFuzzyPattern(character) {
    if (/[가-힣]/.test(character)) {
      return this._createKoreanSyllablePattern(character);
    } else if (/[ㄱ-ㅎ]/.test(character)) {
      return this._createKoreanConsonantPattern(character);
    } else {
      return this._createEnglishFuzzyPattern(character);
    }
  }

  _createKoreanSyllablePattern(character) {
    const offset = 44032;
    const charCode = character.charCodeAt(0) - offset;
    if (charCode % 28 > 0) {
      return character;
    }
    const begin = Math.floor(charCode / 28) * 28 + offset;
    const end = begin + 27;

    return `[\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
  }

  _createKoreanConsonantPattern(character) {
    const consonant2Syllable = {
      ㄱ: "가".charCodeAt(0),
      ㄲ: "까".charCodeAt(0),
      ㄴ: "나".charCodeAt(0),
      ㄷ: "다".charCodeAt(0),
      ㄸ: "따".charCodeAt(0),
      ㄹ: "라".charCodeAt(0),
      ㅁ: "마".charCodeAt(0),
      ㅂ: "바".charCodeAt(0),
      ㅃ: "빠".charCodeAt(0),
      ㅅ: "사".charCodeAt(0),
    };
    const begin = consonant2Syllable[character] || (character.charCodeAt(0) - 12613) * 588 + consonant2Syllable["ㅅ"];
    const end = begin + 587;

    return `[${character}\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
  }

  _createEnglishFuzzyPattern(keyword) {
    return keyword
      .split("")
      .map((text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join(".*?");
  }
}

// const test = new SearchableObject();

// test[1] = "크리스마스";
// test["test"] = "test string...";
// test[2] = 65535;
// console.log(test);

// const res = test.search("ㅅㅁㅋ");

// console.log(res);
