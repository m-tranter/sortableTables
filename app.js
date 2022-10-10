"use strict";

function makeSortable(e) {
  let rows = Array.from(e.rows);
  let reg = /^-?[0-9]\d*(\.\d+)?/;
  let items = [];
  let funcs = {};
  let lastSort = "";
  let op = 0;

  const note = document.createElement("p");
  note.appendChild(document.createTextNode(
    "Click on a heading to sort by that column."));
  note.classList.add("cec-green");
  e.parentNode.insertBefore(note, e);

  Array.from(rows[0].cells).forEach(cell => {
    funcs[cell.innerText] = "";
    setUp(cell);
  });

  Array.from(rows[1].cells).forEach((cell, k) => {
    let f = key(k);
    let str = cell.innerText;
    let date = parseDate(str);
    if (date !== null) {
      funcs[f] = sortDate(f);
    } else if (str.match(reg) === null) {
      funcs[f] = sortStr(f);
    } else {
      funcs[f] = sortInitialNum(f);
    }
  });

  Array.from(rows).slice(1).forEach((row, i) => {
    items.push({});
    Array.from(row.cells).forEach((cell, j) => {
      items[i][key(j)] = cell.innerHTML;
      items[i][`${key(j)}inner`] = cell.innerText;
    });
  });

  function key(ind) {
    return Object.keys(funcs)[ind];
  }

  function sortInitialNum(f) {
    f += 'inner';
    return (a, b) => {
      return (toFloat(a[f]) - toFloat(b[f])) * op;
    };
  }

  function sortStr(f) {
    f += 'inner';
    return (a, b) => {
      let x = a[f].toLowerCase();
      let y = b[f].toLowerCase();
      if (x < y) {
        return -1 * op;
      }
      if (x > y) {
        return 1 * op;
      }
      return 0;
    };
  }

  function sortDate(f) {
    f += 'inner';
    return (a, b) => {
      let x = parseDate(a[f]);
      let y = parseDate(b[f]);
      if (x < y) {
        return -1 * op;
      }
      if (x > y) {
        return 1 * op;
      }
      return 0;
    };
  }

  function setUp(e) {
    let temp = e.innerText;
    e.setAttribute("tabindex", "0");
    e.addEventListener(
      "mouseover",
      () => (e.style.backgroundColor = "PaleGreen")
    );
    e.addEventListener(
      "focus",
      () => (e.style.backgroundColor = "PaleGreen")
    );
    e.addEventListener(
      "mouseout",
      () => (e.style.backgroundColor = "White")
    );
    e.addEventListener("blur", () => (e.style.backgroundColor = "White"));
    e.addEventListener("click", () => sortByField(temp));
    e.addEventListener("keydown", (e) => {
      if (e.code === "Enter") {
        sortByField(temp);
      }
    });
  }

  function sortByField(f) {
    op = lastSort === f ? -op : 1;
    lastSort = f;
    items.sort(funcs[f]);
    redrawTable();
  }

  function toFloat(n) {
    let match = n.match(reg);
    return match === null ? 0 : parseFloat(match);
  }

  function parseDate(str) {
    var m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    return m ? new Date(m[3], m[2] - 1, m[1]) : null;
  }

  function redrawTable() {
    Array.from(rows).slice(1).forEach((row, i) => {
      Array.from(row.cells).forEach((cell, j) => {
        cell.innerHTML = items[i][key(j)];
      });
    });
  }
}

Array.from(document.getElementsByTagName("table")).forEach(e => {
  makeSortable(e);
});

