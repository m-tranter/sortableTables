<script src="https://cdn.jsdelivr.net/npm/luxon@3.0.4/build/global/luxon.min.js"></script>
<script>
  "use strict"; 
function makeSortable(e) {
  const rows = Array.from(e.rows);
  const heads = Array.from(rows[0].cells);
  const reg = /^-?[0-9]\d*(\.\d+)?/;
  const curr = /^£?[0-9]\d*(\.\d+)?/;
  const note = document.createElement("p");
  note.setAttribute("id", "tableNote");
  note.appendChild(
    document.createTextNode("Click on a heading to sort by that column.")
  );
  note.classList.add("cec-green");
  e.parentNode.insertBefore(note, e);

  heads.forEach((cell, k) => {
    cell.id = rows[0].cells[k].innerText;
    let str = rows[1].cells[k].innerText;
    if (parseDate(str)) {
      cell.func = sortDate;
    } else if (str.match(reg)) {
      cell.func = sortInitialNum;
    } else if (str.match(curr)) {
      cell.func = sortCurr;
    } else {
      cell.func = sortStr;
    }
    setUp(cell);
  });

  let items = rows.slice(1).reduce((acc, row, i) => {
    return [
      ...acc,
      Array.from(row.cells).reduce((objAcc, cell, j) => {
        return {
          ...objAcc,
          ...{
            index: i,
            [heads[j].id]: cell.innerHTML,
            [`${heads[j].id}inner`]: parseDate(cell.innerText)
              ? new luxon.DateTime.fromFormat(cell.innerText, "dd/MM/yyyy")
              : cell.innerText,
          },
        };
      }, {}),
    ];
  }, []);

  function sortInitialNum(f) {  
    return (a, b) => {
        if (a[f] === undefined || b[f] === undefined) {
      return 0;
    }
      return toFloat(a[f]) - toFloat(b[f]);
    };
  }

  function sortCurr(f) {
    return (a, b) => {
          if (a[f] === undefined || b[f] === undefined) {
      return 0;
    }
      return parseFloat(a[f].slice(1)) - parseFloat(b[f].slice(1));
    };
  }

  function sortDate(f) {
    return (a, b) => {
          if (a[f] === undefined || b[f] === undefined) {
      return 0;
    }
      if (a[f] < b[f]) {
        return -1;
      }
      if (a[f] > b[f]) {
        return 1;
      }
      return 0;
    };
  }

  function sortStr(f) {
    return (a, b) => {
          if (a[f] === undefined || b[f] === undefined) {
      return 0;
    }
      let x = a[f].toLowerCase();
      let y = b[f].toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    };
  }

  function setUp(e) {
    const text = e.innerText;
    const row = document.createElement("div");
    const container = document.createElement("div");
    const titleDiv = document.createElement("div");
    const iconDiv = document.createElement("div");
    const up = document.createElement("span");
    const down = document.createElement("span");
    // Use unicode up and down arrows.
    up.innerHTML = "&#9650;";
    down.innerHTML = "&#9660;";
    up.classList.add("upIcon");
    down.classList.add("downIcon");
    // Clear out the th element.
    e.firstChild.remove();
    e.classList.add("p-0", "align-middle", "tableHead");
    // Create bootstrap column structure.
    container.classList.add("container");
    row.classList.add("row", "align-items-center");
    iconDiv.classList.add("col-1", "p-0");
    titleDiv.classList.add("col-11", "ps-2", "pt-1");
    // Put the column name in the new title div.
    titleDiv.innerText = text;
    // Save the elem ids so we can change colours.
    e.up = up;
    e.down = down;
    // Build the element.
    iconDiv.appendChild(up);
    iconDiv.appendChild(down);
    row.appendChild(titleDiv);
    row.appendChild(iconDiv);
    container.appendChild(row);
    e.appendChild(container);
    e.setAttribute("tabindex", "0");
    e.addEventListener("click", () => {
      sortByField(e);
    });
    e.addEventListener("keydown", (e) => {
      if (e.code === "Enter") {
        sortByField(e);
      }
    });
  }

  function resetIcons() {
    heads.forEach((obj) => {
      obj.up.style.color = "gray";
      obj.down.style.color = "gray";
    });
  }

  function sortByField(e) {
    resetIcons();
    let temp = [...items];
    temp.sort(e.func(e.id + "inner"));
    if (temp.some((e, i) => e.index !== items[i].index)) {
      items = [...temp];
      e.up.style.color = "black";
    } else {
      items = [...temp].reverse();
      e.down.style.color = "black";
    }
    redrawTable();
  }

  function toFloat(n) {
    let match = n.match(reg);
    return match === null ? 0 : parseFloat(match);
  }

  function parseDate(str) {
    return str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) !== null;
  }

  function redrawTable() {
    rows.slice(1).forEach((row, i) => {
      Array.from(row.cells).forEach((cell, j) => {
        cell.innerHTML = items[i][heads[j].id];
      });
    });
  }
}

Array.from(document.getElementsByTagName("table")).forEach((e) => {
  makeSortable(e);
});
</script>
