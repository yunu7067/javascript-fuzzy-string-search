class SearchableObject extends Object {
  _weight = Number.NEGATIVE_INFINITY;

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
    const values = Object.values(this).filter((value) => typeof value === 'string');
    const found = !!values.find((text) => regex.test(text));

    return found;
  }

  /**
   *
   * @param {String} keyword
   * @param {String} marker
   * @param {String} marker.before
   * @param {String} marker.after
   */
  searchAndMarking(keyword, { before, after }) {
    const regex = this._createFuzzyMatcher(keyword);
    const keys = Object.keys(this);
    let found = false;

    if (keys.length === 0) {
      return found;
    }

    const copiedObj = Object.assign({}, this);
    keys
      .filter((key) => typeof copiedObj[key] === 'string')
      .map((key) => {
        const value = copiedObj[key];
        found = found || regex.test(value);

        copiedObj[key] = value.replace(regex, (match, ...groups) => {
          const letters = groups.slice(0, groups.length - 2);
          let lastIndex = 0;
          const highlighted = [];

          letters.map((letter, i) => {
            const index = match.indexOf(letter, lastIndex);
            copiedObj._weight = Math.max(copiedObj._weight, index - lastIndex);
            highlighted.push(match.substring(index, lastIndex));
            highlighted.push(`${before}${letter}${after}`);
            lastIndex = index + 1;
          });

          return highlighted.join('');
        });
      });

    return found && copiedObj;
  }

  _createFuzzyMatcher(keyword) {
    const pattern = keyword
      .split('')
      .map((char) => this._createFuzzyPattern(char))
      .map((pattern) => '(' + pattern + ')')
      .join('.*?');

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
      ㄱ: '가'.charCodeAt(0),
      ㄲ: '까'.charCodeAt(0),
      ㄴ: '나'.charCodeAt(0),
      ㄷ: '다'.charCodeAt(0),
      ㄸ: '따'.charCodeAt(0),
      ㄹ: '라'.charCodeAt(0),
      ㅁ: '마'.charCodeAt(0),
      ㅂ: '바'.charCodeAt(0),
      ㅃ: '빠'.charCodeAt(0),
      ㅅ: '사'.charCodeAt(0),
    };
    const begin = consonant2Syllable[character] || (character.charCodeAt(0) - 12613) * 588 + consonant2Syllable['ㅅ'];
    const end = begin + 587;

    return `[${character}\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
  }

  _createEnglishFuzzyPattern(keyword) {
    return keyword
      .split('')
      .map((text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('.*?');
  }

  /**
   *
   * @param {SearchableObject} so
   * @param {"asc" | "desc"} [order = "asc"]
   * @returns
   */
  compareWeight = function (so, order = 'asc') {
    const so_weight = so._weight;
    if (typeof so === 'object' && typeof so_weight !== 'undefined') {
      if (order === 'asc') {
        return this._weight > so_weight;
      } else if (order === 'desc') {
        return this._weight < so_weight;
      }
    } else {
      return undefined;
    }
  };
}
