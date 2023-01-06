function loadTaiDB() {
    $("#waitscreen").css({ display: 'block' });
    $("#googleSheet").css({ 'font-family': 'Cambria, Tahoma, "Tai Lanna", "Cambria Tai Yo", "Lanexang Mon4", "Microsoft New Tai Lue", sans-serif, "Tai Son La", TaiViet, "Segoe Ahom Print", "Helvetica Neue", Helvetica, Arial, HanaMinA, HanaMinB, sim-ch_n5100, SimSun, "Malgun Gothic", "BabelStone Han", Sawndip, SimSun-ExtB, "Nom Na Tong", "Han-Nom Gothic Supplement"' });
        let i;
        var sheet = "";
        sheet += "<thead style='font-size: 12px; font-weight: normal; background: url(./Resources/wave.png) fixed;'><tr><th>" +
          "Proto-Tai</th><th style='width: 40px'>" + "Sawndip</th>";
        columnlist = [0, 19];
        headerlist = ["A", "T"];
        //"Aiton</th><th>" +
        switch (document.getElementById("selLang").value) {
            case 'yo':
                columnlist.push(2);
                columnlist.push(3);
                columnlist.push(4);
                headerlist.push("C");
                headerlist.push("D");
                headerlist.push("E");
                sheet += "<th>Lai Pao</th><th>" + "Lai Tay</th><th>" + "Yo Latin</th><th>";
                break;
            case 'deng':
                $("#googleSheet").css({ 'font-family': $("#googleSheet").css('font-family').replace("Tai Son La", "Tai Muong Deng") });
                columnlist.push(5);
                headerlist.push("F");
                sheet += "<th>Đeng</th><th>";
                break;
            case 'don':
                $("#googleSheet").css({ 'font-family': $("#googleSheet").css('font-family').replace("Tai Son La", "Tai Muong Lay") });
                columnlist.push(6);
                headerlist.push("G");
                sheet += "<th>Đón</th><th>";
                break;
            case 'nuea':
                columnlist.push(8);
                headerlist.push("I");
                sheet += "<th>Nưa</th><th>";
                break;
            case 'dam':
                columnlist.push(10);
                columnlist.push(11);
                headerlist.push("K");
                headerlist.push("L");
                sheet += "<th>Đăm</th><th>" + "Latin</th><th>";
                break;
            case 'lue':
                columnlist.push(12);
                headerlist.push("M");
                sheet += "<th>Lự</th><th>";
                break;
            case 'lanna':
                columnlist.push(13);
                headerlist.push("O");
                sheet += "<th>Lạn Nà</th><th>";
                break;
            case 'khuen':
                $("#googleSheet").css({ 'font-family': $("#googleSheet").css('font-family').replace("Tai Lanna", "Tai Khuen") });
                columnlist.push(14);
                headerlist.push("N");
                sheet += "<th>Khưn</th><th>";
                break;
            case 'ahom':
                columnlist.push(9);
                headerlist.push("J");
                sheet += "<th>Ahom</th><th>";
                break;
            case 'yai':
                columnlist.push(15);
                headerlist.push("P");
                sheet += "<th>Nháư</th><th>";
                break;
            case 'lao':
                columnlist.push(16);
                headerlist.push("Q");
                sheet += "<th>Lào</th><th>";
                break;
            case 'yang':
                columnlist.push(22);
                headerlist.push("W");
                sheet += "<th>Yang</th><th>";
                break;
            case 'nung':
                columnlist.push(23);
                headerlist.push("X");
                sheet += "<th>Nùng</th><th>";
                break;
            case 'saek':
                columnlist.push(7);
                headerlist.push("H");
                sheet += "<th>Sek</th><th>";
                break;
            case 'yay':
                columnlist.push(21);
                headerlist.push("V");
                sheet += "<th>Yáy</th><th>";
                break;
            default:
                sheet += "<th>";
                break;
        }

        columnlist.push(17);
        columnlist.push(18);
        columnlist.push(20);
        columnlist.push(28);
        columnlist.push(29);
        columnlist.push(32);
        headerlist.push("R");
        headerlist.push("S");
        headerlist.push("U");
        headerlist.push("AC");
        headerlist.push("AD");
        headerlist.push("AG");
        sheet += "Siam</th><th>" +
        "Tày</th><th>" +
        "Cuengh</th><th>" +
        "Việt</th><th>" +
        "English</th><th>" +
        "Notes</th></tr></thead><tbody>";

        for (i = 1; i < data.length; i++) {

            sheet += "<tr><td onblur='updatecell(this)' contenteditable='true'>" +
            data[i][0] + "</td><th>" +
            data[i][19] + "</th>";

            //data[i]["gsx$aiton"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>" +
            switch (document.getElementById("selLang").value) {
                case 'yo':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i][2] + "</td><th onblur='updatecell(this)' contenteditable='true'>" + data[i][3] + "</th><td onblur='updatecell(this)' contenteditable='true'>" + data[i][4] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'deng':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i][5] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'don':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i][6] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'nuea':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i][8] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'dam':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i][10] + "</td><td onblur='updatecell(this)' contenteditable='true'>" + data[i][11] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'lue':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i][12] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'lanna':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i][14] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'khuen':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i][13] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'ahom':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i][9] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'yai':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i][15] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'lao':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i][16] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'yang':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + ((data[i][22] === undefined) ? "" : data[i][22]) + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'nung':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + ((data[i][23] === undefined) ? "" : data[i][23]) + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'saek':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i][7] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'yay':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + ((data[i][21] === undefined) ? "" : data[i][21]) + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                default:
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>";
                    break;
            }

            sheet += data[i][17] + "</td><td onblur='updatecell(this)' contenteditable='true'>" +
            data[i][18] + "</td><td onblur='updatecell(this)' contenteditable='true'>" +
            ((data[i][20] === undefined) ? "" : data[i][20]) + "</td><td onblur='updatecell(this)' contenteditable='true'>" +
            ((data[i][28] === undefined) ? "" : data[i][28]) + "</td><td onblur='updatecell(this)' contenteditable='true'>" +
            ((data[i][29] === undefined) ? "" : data[i][29]) + "</td><td onblur='updatecell(this)' contenteditable='true'>" +
            ((data[i][32] === undefined) ? "" : data[i][32]) + "</td></tr><tbody>";
        }
        document.getElementById("googleSheet").innerHTML = sheet;
        $("#waitscreen").css({ display: 'none' });
        $("#googleSheet th[contenteditable]").keypress(function (evt) {
            var keycode = evt.charCode || evt.keyCode;
            if (keycode == 13) { //Enter key's keycode
                $(this).blur();
                return false;
            }
        });
        $("#googleSheet td[contenteditable]").keypress(function (evt) {
            var keycode = evt.charCode || evt.keyCode;
            if (keycode == 13) { //Enter key's keycode
                $(this).blur();
                return false;
            }
        });
}

function loadAusAsiaDB() {
    $("#waitscreen").css({ display: 'block' });
    let i;
    var sheet = "";
    sheet += "<thead style='font-size: 12px; font-weight: normal; background: url(./Resources/wave.png) fixed;'><tr>" +
      "<th style='width: 40px'>Nôm</th>";
    columnlist = [0];
    headerlist = ["A"];
    //"Aiton</th><th>" +
    switch (document.getElementById("selLang").value) {
        case 'khmer':
            columnlist.push(9);
            headerlist.push("J");
            sheet += "<th>Khmer</th><th>";
            break;
        case 'bahnar':
            columnlist.push(12);
            headerlist.push("M");
            sheet += "<th>Bahnar</th><th>";
            break;
        case 'cuoi':
            columnlist.push(5);
            headerlist.push("F");
            sheet += "<th>Cuói</th><th>";
            break;
        case 'chut':
            columnlist.push(6);
            headerlist.push("G");
            sheet += "<th>Chứt</th><th>";
            break;
        case 'paco':
            columnlist.push(7);
            headerlist.push("H");
            sheet += "<th>Pacoh</th><th>";
            break;
        case 'khmu':
            columnlist.push(8);
            headerlist.push("I");
            sheet += "<th>Khmú</th><th>";
            break;
        case 'mon':
            columnlist.push(10);
            headerlist.push("K");
            sheet += "<th>Mon</th><th>";
            break;
        case 'santali':
            columnlist.push(11);
            headerlist.push("L");
            sheet += "<th>Santali</th><th>";
            break;
        default:
            sheet += "<th>";
            break;
    }

    columnlist.push(3);
    columnlist.push(4);
    columnlist.push(13);
    headerlist.push("D");
    headerlist.push("E");
    headerlist.push("N");
    sheet += "Việt</th><th>" +
    "Mol</th><th>" +
    "Meaning</th></tr></thead><tbody>";

    for (i = 1; i < data.length; i++) {

        sheet += "<tr><th>" +
        data[i][0] + "</th>";

        //data[i]["gsx$aiton"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>" +
        switch (document.getElementById("selLang").value) {
            case 'khmer':
                sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + ((data[i][9] === undefined) ? "" : data[i][9]) + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                break;
            case 'bahnar':
                sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + ((data[i][12] === undefined) ? "" : data[i][12]) + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                break;
            case 'cuoi':
                sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + ((data[i][5] === undefined) ? "" : data[i][5]) + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                break;
            case 'chut':
                sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + ((data[i][6] === undefined) ? "" : data[i][6]) + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                break;
            case 'paco':
                sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + ((data[i][7] === undefined) ? "" : data[i][7]) + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                break;
            case 'khmu':
                sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + ((data[i][8] === undefined) ? "" : data[i][8]) + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                break;
            case 'mon':
                sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + ((data[i][10] === undefined) ? "" : data[i][10]) + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                break;
            case 'santali':
                sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + ((data[i][11] === undefined) ? "" : data[i][11]) + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                break;
            default:
                sheet += "<td onblur='updatecell(this)' contenteditable='true'>";
                break;
        }

        sheet += ((data[i][3] === undefined) ? "" : data[i][3]) + "</td><td onblur='updatecell(this)' contenteditable='true'>" +
        ((data[i][4] === undefined) ? "" : data[i][4]) + "</td><td onblur='updatecell(this)' contenteditable='true'>" +
        ((data[i][13] === undefined) ? "" : data[i][13]) + "</td></tr><tbody>";
    }
    document.getElementById("googleSheet").innerHTML = sheet;
    $("#waitscreen").css({ display: 'none' });
    $("#googleSheet th[contenteditable]").keypress(function (evt) {
        var keycode = evt.charCode || evt.keyCode;
        if (keycode == 13) { //Enter key's keycode
            $(this).blur();
            return false;
        }
    });
    $("#googleSheet td[contenteditable]").keypress(function (evt) {
        var keycode = evt.charCode || evt.keyCode;
        if (keycode == 13) { //Enter key's keycode
            $(this).blur();
            return false;
        }
    });
}

function updatecell(x) {
    var origincell = ((data[x.parentNode.rowIndex][columnlist[x.cellIndex]] === undefined) ? "" : data[x.parentNode.rowIndex][columnlist[x.cellIndex]]);
    if (origincell.replace("*", "") != x.innerHTML.replace("*", "").replace("<br>", "")) {
        x.innerHTML = "*" + x.innerHTML.replace("*", "").replace("<br>", "");
        var r = confirm("Agree to Update to: \"" + x.innerHTML + "\" ?");
        if (r == true) {
            sendupdate(x.parentNode.rowIndex + 1, headerlist[x.cellIndex], x.innerHTML);
        } else {
            x.innerHTML = origincell;
        }
    }
}

function sendupdate(row, field, value) {
    hasChanged = true;
    var gurl = ggdblink + "row=" + row + "&field=" + field + "&value=" + value;
    const Http = new XMLHttpRequest();
    Http.open("GET", gurl);
    Http.send();
}