let xmlhttp = new XMLHttpRequest();
let data;
var columnlist = [];
var headerlist = [];
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.responseText).feed.entry;
        loadDB();
    }
};

xmlhttp.open(
  "GET",
  "https://spreadsheets.google.com/feeds/list/10QEwpszfwhcsprJalSO-mwhMg3VaYhdnlyaE6nq8rmQ/1/public/values?alt=json",
  true
);
xmlhttp.send();

function loadDB() {
    $("#waitscreen").css({ display: 'block' });
        let i;
        var sheet = "";
        sheet += "<thead style='font-size: 12px; font-weight: normal; background: url(/Resources/wave.png) fixed;'><tr><th>" +
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
                sheet += "<th>Dọ Pao</th><th>" + "Dọ Tay</th><th>" + "Dọ Latin</th><th>";
                break;
            case 'deng':
                columnlist.push("gsx$red");
                headerlist.push("F");
                sheet += "<th>Đeng</th><th>";
                break;
            case 'don':
                columnlist.push("gsx$white");
                headerlist.push("G");
                sheet += "<th>Đón</th><th>";
                break;
            case 'nuea':
                columnlist.push("gsx$upper");
                headerlist.push("I");
                sheet += "<th>Nưa</th><th>";
                break;
            case 'dam':
                columnlist.push("gsx$blacktai");
                columnlist.push("gsx$blackrom");
                headerlist.push("K");
                headerlist.push("L");
                sheet += "<th>Đăm</th><th>" + "Đăm Latin</th><th>";
                break;
            case 'lue':
                columnlist.push("gsx$lue");
                headerlist.push("M");
                sheet += "<th>Lự</th><th>";
                break;
            case 'lanna':
                columnlist.push("gsx$lanna");
                headerlist.push("O");
                sheet += "<th>Lanna</th><th>";
                break;
            case 'khuen':
                columnlist.push("gsx$khuen");
                headerlist.push("N");
                sheet += "<th>Khưn</th><th>";
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
        headerlist.push("R");
        headerlist.push("S");
        headerlist.push("U");
        headerlist.push("AB");
        headerlist.push("AC");
        sheet += "Siam</th><th>" +
        "Tày Nùng</th><th>" +
        "Cuengh</th><th>" +
        "Viet</th><th>" +
        "English</th></tr></thead><tbody>";

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
            data[i]["gsx$viet"]["$t"] + "</td><td onblur='updatecell(this)' contenteditable='true'>";
            data[i]["gsx$english"]["$t"] + "</td></tr><tbody>";
        }
        document.getElementById("googleSheet").innerHTML = sheet;
        $("#waitscreen").css({ display: 'none' });
}

function updatecell(x) {
    var origincell = data[x.parentNode.rowIndex - 1][columnlist[x.cellIndex]]["$t"];
    if (origincell != x.innerHTML.replace("*", "")) {
        x.innerHTML = "*" + x.innerHTML.replace("*", "");
        var r = confirm("Update " + headerlist[x.cellIndex] + ": " + x.innerHTML + "\n" + x.parentNode.innerText);
        if (r == true) {
            sendupdate(x.parentNode.rowIndex + 1, headerlist[x.cellIndex], x.innerHTML);
        } else {
            x.innerHTML = origincell;
        }
    }
}

function sendupdate(row, field, value) {
    var gurl = "https://script.google.com/macros/s/AKfycbzJEH_f4PU_KJsDHRtqRkywrnBVGPH8Geu0NAfxfkSy3dkmEEGePERYDw/exec?row=" + row + "&field=" + field + "&value=" + value;
    const Http = new XMLHttpRequest();
    Http.open("GET", gurl);
    Http.send();
}