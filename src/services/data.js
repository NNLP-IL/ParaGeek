class DataService {
  _ids = [];
  _index = -1;

  pad(num, size) {
    if (!num) {
      return null;
    }
    if (typeof num === "number") {
      num = `${num}`;
    }
    while (num.length < size) {
      num = "0" + num;
    }
    return num;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  initializeByLimits(min = 21, max = 1389) {
    const length = max - min + 1;
    const ids = Array.from({ length }, (_, i) => i + min);
    this._ids = this.shuffle(ids);
    this._index = -1;
  }

  initializeByIds(ids) {
    this._ids = this.shuffle([...ids]);
    this._index = -1;
  }

  getNextId(isAllowLoop = false) {
    if (this._index + 1 >= this._ids.length) {
      if (isAllowLoop) {
        this._index = -1;
      } else {
        return null;
      }
    }
    const index = ++this._index;
    const id = this._ids[index];
    return id;
  }

  isAtEnd() {
    return this._index === this._ids.length;
  }

  resetIndex() {
    this._index = -1;
  }
}

export const dataService = new DataService();
