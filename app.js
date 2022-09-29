"use strict";
for (var table of document.getElementsByTagName("table")) {
    sortableTable(table);
}

function sortableTable(myTable) {
    const reg = /^-?[0-9]\d*(\.\d+)?/;
    var items = [];
    var cols = [];
    var funcs = {};
    var lastSort = "";
    var op = 0;

    for (var cell of myTable.rows[0].cells) {
        cols.push(cell.innerText);
        funcs[cell.innerText] = "";
        setUp(cell);
    }

    for (var k = 0; k < myTable.rows[1].cells.length; k++) {
        let f = cols[k];
        let str = myTable.rows[1].cells[k].innerText;
        let date = parseDate(str);
        if (date != null) {
            funcs[f] = sortDate(f);
        } else if (str.match(reg) == null) {
            funcs[f] = sortStr(f);
        } else {
            funcs[f] = sortInitialNum(f);
        }
    }

    for (var i = 1; i < myTable.rows.length; i++) {
        items.push({});
        for (var j = 0; j < myTable.rows[i].cells.length; j++) {
            items[i - 1][cols[j]] = myTable.rows[i].cells[j].innerHTML;
            items[i - 1][`${cols[j]}inner`] = myTable.rows[i].cells[j].innerText;
        }
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
        for (var i = 1; i < myTable.rows.length; i++) {
            for (var j = 0; j < myTable.rows[i].cells.length; j++) {
                myTable.rows[i].cells[j].innerHTML = items[i - 1][cols[j]];
            }
        }
    }
}