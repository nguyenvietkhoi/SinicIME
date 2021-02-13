function loadTaiDB() {
    $("#waitscreen").css({ display: 'block' });
    $("#googleSheet").css({ 'font-family': 'Cambria, Tahoma, "Tai Lanna", "Cambria Tai", "Lanexang Mon4", "Microsoft New Tai Lue", sans-serif, "Tai Son La", TaiViet, "Segoe Ahom Print", "Helvetica Neue", Helvetica, Arial, HanaMinA, HanaMinB, sim-ch_n5100, SimSun, "Malgun Gothic", "BabelStone Han", Sawndip, SimSun-ExtB, "Nom Na Tong", "Han-Nom Gothic Supplement"' });
        let i;
        var sheet = "";
        sheet += "<thead style='font-size: 12px; font-weight: normal; background: url(./Resources/wave.png) fixed;'><tr><th>" +
          "Proto-Tai</th><th style='width: 40px'>" + "Sawndip</th>";
        columnlist = ["gsx$prototai", "gsx$ndip"];
        headerlist = ["A", "T"];
        //"Aiton</th><th>" +
        switch (document.getElementById("selLang").value) {
            case 'yo':
                columnlist.push("gsx$yopao");
                columnlist.push("gsx$yotai");
                columnlist.push("gsx$yorom");
                headerlist.push("C");
                headerlist.push("D");
                headerlist.push("E");
                sheet += "<th>Lai Pao</th><th>" + "Lai Tay</th><th>" + "Yo Latin</th><th>";
                break;
            case 'deng':
                $("#googleSheet").css({ 'font-family': $("#googleSheet").css('font-family').replace("Tai Son La", "Tai Muong Deng") });
                columnlist.push("gsx$red");
                headerlist.push("F");
                sheet += "<th>Daeng</th><th>";
                break;
            case 'don':
                $("#googleSheet").css({ 'font-family': $("#googleSheet").css('font-family').replace("Tai Son La", "Tai Muong Lay") });
                columnlist.push("gsx$white");
                headerlist.push("G");
                sheet += "<th>Don</th><th>";
                break;
            case 'nuea':
                columnlist.push("gsx$upper");
                headerlist.push("I");
                sheet += "<th>Nuea</th><th>";
                break;
            case 'dam':
                columnlist.push("gsx$blacktai");
                columnlist.push("gsx$blackrom");
                headerlist.push("K");
                headerlist.push("L");
                sheet += "<th>Dam</th><th>" + "Latin</th><th>";
                break;
            case 'lue':
                columnlist.push("gsx$lue");
                headerlist.push("M");
                sheet += "<th>Lue</th><th>";
                break;
            case 'lanna':
                columnlist.push("gsx$lanna");
                headerlist.push("O");
                sheet += "<th>Lanna</th><th>";
                break;
            case 'khuen':
                columnlist.push("gsx$khuen");
                headerlist.push("N");
                sheet += "<th>Khuen</th><th>";
                break;
            case 'ahom':
                columnlist.push("gsx$ahom");
                headerlist.push("J");
                sheet += "<th>Ahom</th><th>";
                break;
            case 'yai':
                columnlist.push("gsx$yai");
                headerlist.push("P");
                sheet += "<th>Yai</th><th>";
                break;
            case 'lao':
                columnlist.push("gsx$lao");
                headerlist.push("Q");
                sheet += "<th>Lao</th><th>";
                break;
            case 'yang':
                columnlist.push("gsx$yang");
                headerlist.push("W");
                sheet += "<th>Yang</th><th>";
                break;
            case 'saek':
                columnlist.push("gsx$saekrom");
                headerlist.push("H");
                sheet += "<th>Saek</th><th>";
                break;
            case 'yay':
                columnlist.push("gsx$yay");
                headerlist.push("V");
                sheet += "<th>Yay</th><th>";
                break;
            default:
                sheet += "<th>";
                break;
        }

        columnlist.push("gsx$siam");
        columnlist.push("gsx$taynung");
        columnlist.push("gsx$zhuang");
        columnlist.push("gsx$viet");
        columnlist.push("gsx$english");
        columnlist.push("gsx$notes");
        headerlist.push("R");
        headerlist.push("S");
        headerlist.push("U");
        headerlist.push("AB");
        headerlist.push("AC");
        headerlist.push("AF");
        sheet += "Siam</th><th>" +
        "Tày Nùng</th><th>" +
        "Cuengh</th><th>" +
        "Việt</th><th>" +
        "English</th><th>" +
        "Notes</th></tr></thead><tbody>";

        for (i = 0; i < data.length; i++) {

            sheet += "<tr><td onblur='updatecell(this)' contenteditable='true'>" +
            data[i]["gsx$prototai"]["$t"] + "</td><th>" +
            data[i]["gsx$ndip"]["$t"] + "</th>";

            //data[i]["gsx$aiton"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>" +
            switch (document.getElementById("selLang").value) {
                case 'yo':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$yopao"]["$t"] + "</td><th onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$yotai"]["$t"] + "</th><td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$yorom"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'deng':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$red"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'don':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$white"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'nuea':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$upper"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'dam':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$blacktai"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$blackrom"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'lue':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$lue"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'lanna':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$lanna"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'khuen':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$khuen"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'ahom':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$ahom"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'yai':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$yai"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'lao':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$lao"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'yang':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$yang"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'saek':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$saekrom"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                case 'yay':
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$yay"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                    break;
                default:
                    sheet += "<td onblur='updatecell(this)' contenteditable='true'>";
                    break;
            }

            sheet += data[i]["gsx$siam"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>" +
            data[i]["gsx$taynung"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>" +
            data[i]["gsx$zhuang"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>" +
            data[i]["gsx$viet"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>" +
            data[i]["gsx$english"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>" +
            data[i]["gsx$notes"]["$t"] + "</td></tr><tbody>";
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
    columnlist = ["gsx$nom"];
    headerlist = ["A"];
    //"Aiton</th><th>" +
    switch (document.getElementById("selLang").value) {
        case 'khmer':
            columnlist.push("gsx$khmer");
            headerlist.push("J");
            sheet += "<th>Khmer</th><th>";
            break;
        case 'bahnar':
            columnlist.push("gsx$bahnar");
            headerlist.push("M");
            sheet += "<th>Bahnar</th><th>";
            break;
        case 'cuoi':
            columnlist.push("gsx$cuoi");
            headerlist.push("F");
            sheet += "<th>Cuói</th><th>";
            break;
        case 'chut':
            columnlist.push("gsx$chut");
            headerlist.push("G");
            sheet += "<th>Chứt</th><th>";
            break;
        case 'paco':
            columnlist.push("gsx$pacoh");
            headerlist.push("H");
            sheet += "<th>Pa Kô</th><th>";
            break;
        case 'khmu':
            columnlist.push("gsx$khmu");
            headerlist.push("I");
            sheet += "<th>Khmú</th><th>";
            break;
        case 'mon':
            columnlist.push("gsx$mon");
            headerlist.push("K");
            sheet += "<th>Mon</th><th>";
            break;
        case 'santali':
            columnlist.push("gsx$santali");
            headerlist.push("L");
            sheet += "<th>Santali</th><th>";
            break;
        default:
            sheet += "<th>";
            break;
    }

    columnlist.push("gsx$viet");
    columnlist.push("gsx$muong");
    columnlist.push("gsx$meaning");
    headerlist.push("D");
    headerlist.push("E");
    headerlist.push("N");
    sheet += "Việt</th><th>" +
    "Mol</th><th>" +
    "Meaning</th></tr></thead><tbody>";

    for (i = 0; i < data.length; i++) {

        sheet += "<tr><th>" +
        data[i]["gsx$nom"]["$t"] + "</th>";

        //data[i]["gsx$aiton"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>" +
        switch (document.getElementById("selLang").value) {
            case 'khmer':
                sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$khmer"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                break;
            case 'bahnar':
                sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$bahnar"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                break;
            case 'cuoi':
                sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$cuoi"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                break;
            case 'chut':
                sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$chut"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                break;
            case 'paco':
                sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$pacoh"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                break;
            case 'khmu':
                sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$khmu"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                break;
            case 'mon':
                sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$mon"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                break;
            case 'santali':
                sheet += "<td onblur='updatecell(this)' contenteditable='true'>" + data[i]["gsx$santali"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
                break;
            default:
                sheet += "<td onblur='updatecell(this)' contenteditable='true'>";
                break;
        }

        sheet += data[i]["gsx$viet"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>" +
        data[i]["gsx$muong"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>" +
        data[i]["gsx$meaning"]["$t"] + "</td></tr><tbody>";
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
    var origincell = data[x.parentNode.rowIndex - 1][columnlist[x.cellIndex]]["$t"];
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