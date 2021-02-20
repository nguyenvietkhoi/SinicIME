var ipaSQL = [];
var ipadb;

self.addEventListener('fetch', function (event) {
    event.respondWith(
      caches.match(event.request).then(function (request) {
          return request || fetch(event.request)
      })
    )
})

//self.addEventListener('install', function (event) {
//    event.waitUntil(
//      caches.open('v1').then(function (cache) {
//          return cache.addAll([
//            '../Resources/ipa.jpg',
//          ]);
//      })
//    );
//});


// Connect to sqlite db file
var xhr = new XMLHttpRequest();
xhr.open('GET', '../Resources/ipa.jpg', true);
xhr.responseType = 'arraybuffer';
xhr.onload = function (e) {
    var uInt8Array = new Uint8Array(this.response);
    ipadb = new SQL.Database(uInt8Array);
    ipaSQL = ipadb.exec("SELECT HoaAn FROM Tay where phone='a' ");
    // contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]
    console.log(ipaSQL[0].values[0]);
};
xhr.send();

function TaiDamIPA(w, accent) {
    var ipastr = "";
    var ipa = {};
    var tmpconso = "";
    ipa.onset = "", ipa.onset2 = "", ipa.rime = "", ipa.tone = "", ipa.toneclass = 0;
    var ipalist = [];
    w = w.replace('ꫛ', 'ꪶꪁꪙ');
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("ꪀꪄꪈꪬꪮꪆꪊꪐꪤꪒꪔꪖꪘꪎꪦꪨꪚꪜꪢꪠꪪꪁꪅꪉꪭꪯꪇꪋꪑꪥꪓꪕꪗꪙꪏꪧꪩꪛꪝꪣꪡꪫ".includes(c)) {
            if (ipa.onset == "") {
                ipa.onset = c;
                ipa.rime += "◌";
                if ("ꪀꪄꪈꪬꪮꪆꪊꪐꪤꪒꪔꪖꪘꪎꪦꪨꪚꪜꪢꪠꪪ".includes(c))
                    ipa.toneclass = 1;
                else if ("ꪁꪅꪉꪭꪯꪇꪋꪑꪥꪓꪕꪗꪙꪏꪧꪩꪛꪝꪣꪡꪫ".includes(c))
                    ipa.toneclass = 2;
            }
            else if (((ipa.rime == "") || (ipa.rime.endsWith("◌"))) && (c != "ꪮ") && (!ipa.onset2.endsWith("1"))) {
                if (c == "ꪫ") {
                    c = "ꪫ1";
                }
                ipa.onset2 += c;
            }
            else {
                if ("ꪀꪒꪚ".includes(c)) {
                    tmpconso = c;
                    if (ipa.tone == "") {
                        if ("◌ꪳ◌ꪱ◌ꪮꪹ◌ꪵ◌◌ꪸ◌ꪺꪹ◌ꪷ".includes(ipa.rime)) {
                            ipa.tone = "5";
                        }
                        else {
                            ipa.tone = "4";
                        }
                    }
                    else {
                        ipa.tone = "ˀ";
                    }
                    ipa.rime += c;

                    ipalist.push(Object.assign({}, ipa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    continue;
                }
                else if ("ꪥꪫꪉꪙꪣ".includes(c)) {
                    tmpconso = c;
                    if (ipa.tone == "") {
                        ipa.tone = "0";
                    }
                    if (ipa.onset == "") {
                        ipa.onset = "∅";
                    }
                    ipa.rime += c;
                    ipa.rime = ipa.rime.replace("̽", "");

                    ipalist.push(Object.assign({}, ipa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    continue;
                }
                else if (c == "ꪮ") {
                    tmpconso = c;
                    ipa.rime += c;
                }
                else {
                    if (ipa.tone == "") {
                        ipa.tone = "0";
                        if ((ipa.onset2 != "") && ((ipa.rime == "ꪵ◌") || (ipa.rime == "ꪹ◌") || (ipa.rime == "ꪶ◌"))) {
                            var coda = ipa.onset2.slice(-1);
                            if (coda == "1") {
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                                coda = ipa.onset2.slice(-1);
                            }
                            if ("ꪀꪒꪚ".includes(coda)) {
                                if ("◌ꪳ◌ꪱ◌ꪮꪹ◌ꪵ◌◌ꪸ◌ꪺꪹ◌ꪷ".includes(ipa.rime)) {
                                    ipa.tone = "5";
                                }
                                else {
                                    ipa.tone = "4";
                                }
                                ipa.rime += coda;
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
                            else if ("ꪥꪫꪉꪙꪣ".includes(coda)) {
                                if (ipa.tone == "") {
                                    ipa.tone = "0";
                                }
                                if (ipa.onset == "") {
                                    ipa.onset = "∅";
                                }
                                ipa.rime += coda;
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
                            else if (coda == "ꪮ") {
                                ipa.rime += coda;
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
                            else {
                                ipa.tone = "0";
                            }
                        }
                    }
                    tmpconso = "";
                    ipa.rime = ipa.rime.replace("̽", "");
                    ipalist.push(Object.assign({}, ipa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    i--;
                    continue;
                }
            }
        }
        else if ("꪿꫁".includes(c)) {
            ipa.tone = c;
            ipa.rime += "̽";
        }
        else if ((ipa.rime != "") && ("ꪵꪹꪶꪻꪼ".includes(c))) {
            if (ipa.tone == "") {
                ipa.tone = "0";
                if ((ipa.onset2 != "") && ((ipa.rime == "ꪵ◌") || (ipa.rime == "ꪹ◌") || (ipa.rime == "ꪶ◌"))) {
                    var coda = ipa.onset2.slice(-1);
                    if (coda == "1") {
                        ipa.onset2 = ipa.onset2.slice(0, -1);
                        coda = ipa.onset2.slice(-1);
                    }
                    if ("ꪀꪒꪚ".includes(coda)) {
                        if ("◌ꪳ◌ꪱ◌ꪮꪹ◌ꪵ◌◌ꪸ◌ꪺꪹ◌ꪷ".includes(ipa.rime)) {
                            ipa.tone = "5";
                        }
                        else {
                            ipa.tone = "4";
                        }
                        ipa.rime += coda;
                        ipa.onset2 = ipa.onset2.slice(0, -1);
                    }
                    else if ("ꪥꪫꪉꪙꪣ".includes(coda)) {
                        if (ipa.tone == "") {
                            ipa.tone = "0";
                        }
                        if (ipa.onset == "") {
                            ipa.onset = "∅";
                        }
                        ipa.rime += coda;
                        ipa.onset2 = ipa.onset2.slice(0, -1);
                    }
                    else if (coda == "ꪮ") {
                        ipa.rime += coda;
                        ipa.onset2 = ipa.onset2.slice(0, -1);
                    }
                    else {
                        ipa.tone = "0";
                    }
                }
            }
            ipa.rime = ipa.rime.replace("̽", "");
            ipalist.push(Object.assign({}, ipa));
            ipa.onset = "";
            ipa.onset2 = "";
            ipa.rime = "";
            ipa.tone = "";
            ipa.toneclass = 0;
            i--;
            continue;
        }
        else {
            if ((ipa.onset == "") && (!"ꪵ◌ꪹ◌ꪶ◌ꪻ◌ꪼ◌".includes(c))) {
                if ("ꪀꪄꪈꪬꪮꪆꪊꪐꪤꪒꪔꪖꪘꪎꪦꪨꪚꪜꪢꪠꪪꪁꪅꪉꪭꪯꪇꪋꪑꪥꪓꪕꪗꪙꪏꪧꪩꪛꪝꪣꪡꪫ".includes(tmpconso)) {
                    tmpconso = "";
                    var previpa = ipalist.pop();
                    previpa.rime = previpa.rime.slice(0, -1);
                    if ((previpa.tone == "4") || (previpa.tone == "5"))
                        previpa.tone = "0";
                    else if (previpa.tone == "ˀ") {
                        if (previpa.toneclass == 1)
                            previpa.tone = "꪿"
                        else if (previpa.toneclass == 2)
                            previpa.tone = "꫁"
                    }
                    previpa.rime = previpa.rime.replace("̽", "");
                    ipalist.push(Object.assign({}, previpa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    i -= 2;
                    continue;
                }
                else {
                    tmpconso = "";
                    ipa.onset = "∅";
                }
            }
            ipa.rime += c;
        }
    }

    if ((ipa.onset2 != "") && ((ipa.rime == "ꪵ◌") || (ipa.rime == "ꪹ◌") || (ipa.rime == "ꪶ◌"))) {
        var coda = ipa.onset2.slice(-1);
        if (coda == "1") {
            ipa.onset2 = ipa.onset2.slice(0, -1);
            coda = ipa.onset2.slice(-1);
        }
        if ("ꪀꪒꪚ".includes(coda)) {
            if ("◌ꪳ◌ꪱ◌ꪮꪹ◌ꪵ◌◌ꪸ◌ꪺꪹ◌ꪷ".includes(ipa.rime)) {
                ipa.tone = "5";
            }
            else {
                ipa.tone = "4";
            }
            ipa.rime += coda;
            ipa.onset2 = ipa.onset2.slice(0, -1);
        }
        else if ("ꪥꪫꪉꪙꪣ".includes(coda)) {
            if (ipa.tone == "") {
                ipa.tone = "0";
            }
            if (ipa.onset == "") {
                ipa.onset = "∅";
            }
            ipa.rime += coda;
            ipa.onset2 = ipa.onset2.slice(0, -1);
        }
        else if (coda == "ꪮ") {
            ipa.rime += coda;
            ipa.onset2 = ipa.onset2.slice(0, -1);
        }
        else {
            ipa.tone = "0";
        }
    }
    ipa.rime = ipa.rime.replace("̽", "");
    if (ipa.tone == "") {
        ipa.tone = "0";
    }
    if (ipa.onset == "") {
        ipa.onset = "∅";
        if (ipalist.length == 0)
            ipalist.push(Object.assign({}, ipa));
    }
    else
        ipalist.push(Object.assign({}, ipa));

    var minorsyllable = "";
    ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDam where phone='◌' ");
    if (ipaSQL.length > 0)
        minorsyllable = ipaSQL[0].values[0];

    while (ipalist.length != 0) {
        var ipatmp = ipalist.pop();
        var minortone = "";
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDam where phone='ˀ" + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            minortone = ipaSQL[0].values[0];
        var onsets = [ipatmp.onset];
        if (ipatmp.onset2.endsWith("1")) {
            onsets = onsets.concat(ipatmp.onset2.slice(0, -2).split(''));
            ipatmp.onset2 = ipatmp.onset2.slice(-2);
        }
        else {
            onsets = onsets.concat(ipatmp.onset2.split(''));
            ipatmp.onset2 = "";
        }

        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDam where phone='" + onsets.join('') + "' ");
        if (ipaSQL.length > 0)
            ipatmp.onset = ipaSQL[0].values[0];
        else {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDam where phone='" + onsets[onsets.length - 1] + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset = ipaSQL[0].values[0];
            else {
                ipatmp.onset = "∅";
            }
            for (var j = (onsets.length - 2); j >= 0; j--) {
                ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDam where phone='" + onsets[j] + "' ");
                if (ipaSQL.length > 0)
                    ipatmp.onset = ipaSQL[0].values[0] + minorsyllable + minortone + " " + ipatmp.onset;
                else {
                    ipatmp.onset = "∅";
                }
            }
        }
        if (ipatmp.onset2 != "") {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDam where phone='" + ipatmp.onset2 + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset += ipaSQL[0].values[0];
            else {
                ipastr = (" ∅") + ipastr;
                continue;
            }
        }
        if (ipatmp.rime == '◌')
            ipatmp.tone = 'ˀ';
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDam where phone='" + ipatmp.rime + "' ");
        if (ipaSQL.length > 0)
            ipatmp.rime = ipaSQL[0].values[0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDam where phone='" + ipatmp.tone + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            ipatmp.tone = ipaSQL[0].values[0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }

        ipastr = " " + ipatmp.onset + ipatmp.rime + ipatmp.tone + ipastr;
    }

    return (ipastr.substring(1));
}

function TaiYoIPA(w, accent) {
    var ipastr = "";
    var ipa = {};
    var tmpconso = "";
    ipa.onset = "", ipa.onset2 = "", ipa.rime = "", ipa.tone = "", ipa.toneclass = 0;
    var ipalist = [];
    w = w.replace('𖱉', '𖰟𖰻𖰇');
    for (var i = 0; i < [...w].length; i++) {
        var c = [...w][i];
        if ("𖰰𖰀𖰂𖰆𖰪𖰬𖰄𖰈𖰌𖰠𖰎𖰐𖰒𖰔𖰊𖰢𖰤𖰖𖰘𖰚𖰟𖰜𖰦𖰨𖰮𖰁𖰃𖰇𖰫𖰭𖰅𖰉𖰍𖰡𖰏𖰑𖰓𖰕𖰋𖰣𖰥𖰗𖰙𖰛𖰞𖰝𖰧𖰩𖰯".includes(c)) {
            if (ipa.onset == "") {
                ipa.onset = c;
                if ("𖰰𖰀𖰂𖰆𖰪𖰬𖰄𖰈𖰌𖰠𖰎𖰐𖰒𖰔𖰊𖰢𖰤𖰖𖰘𖰚𖰞𖰜𖰦𖰨𖰮".includes(c))
                    ipa.toneclass = 1;
                else if ("𖰁𖰃𖰇𖰫𖰭𖰅𖰉𖰍𖰡𖰏𖰑𖰓𖰕𖰋𖰣𖰥𖰗𖰙𖰛𖰟𖰝𖰧𖰩𖰯".includes(c))
                    ipa.toneclass = 2;
            }
            else if ((ipa.rime == "") && (ipa.tone == "") && ("𖰁𖰂𖰃𖰄𖰅𖰇𖰆".includes(ipa.onset)) && (c == "𖰧") && (!ipa.onset2.endsWith("1"))) {
                c = "𖰧1";
                ipa.onset2 += c;
            }
            else if ((ipa.rime != "") && ("𖰀𖰎𖰖".includes(c))) {
                tmpconso = c;
                if ("𖰸𖰳𖰹𖰵𖰴𖰾".includes(ipa.rime))
                    ipa.tone = "5";
                else
                    ipa.tone = "4";
                ipa.rime += c;

                ipalist.push(Object.assign({}, ipa));
                ipa.onset = "";
                ipa.onset2 = "";
                ipa.rime = "";
                ipa.tone = "";
                ipa.toneclass = 0;
                continue;
            }
            else if ((ipa.rime != "") && ("𖰍𖰧𖰇𖰕𖰟".includes(c))) {
                tmpconso = c;
                if (ipa.tone == "") {
                    ipa.tone = "0";
                }
                if (ipa.onset == "") {
                    ipa.onset = "∅";
                }
                ipa.rime += c;

                ipalist.push(Object.assign({}, ipa));
                ipa.onset = "";
                ipa.onset2 = "";
                ipa.rime = "";
                ipa.tone = "";
                ipa.toneclass = 0;
                continue;
            }
            else {
                tmpconso = "";
                if (ipa.tone == "") {
                    ipa.tone = "0";
                }
                if (ipa.rime == "") {
                    ipa.rime = "◌";
                }

                ipalist.push(Object.assign({}, ipa));
                ipa.onset = "";
                ipa.onset2 = "";
                ipa.rime = "";
                ipa.tone = "";
                ipa.toneclass = 0;
                i--;
                continue;
            }
        }
        else if ((ipa.rime == "") && ("𖱄𖱅𖱃".includes(c))) {
            ipa.tone = "5";
            ipa.rime += c;
        }
        else if ("𖱊𖱋".includes(c)) {
            ipa.tone = c;
        }
        else {
            if (ipa.onset == "") {
                if ("𖰰𖰀𖰂𖰆𖰪𖰬𖰄𖰈𖰌𖰠𖰎𖰐𖰒𖰔𖰊𖰢𖰤𖰖𖰘𖰚𖰟𖰜𖰦𖰨𖰮𖰁𖰃𖰇𖰫𖰭𖰅𖰉𖰍𖰡𖰏𖰑𖰓𖰕𖰋𖰣𖰥𖰗𖰙𖰛𖰞𖰝𖰧𖰩𖰯".includes(tmpconso)) {
                    tmpconso = "";
                    var previpa = ipalist.pop();
                    previpa.rime = [...previpa.rime].slice(0, -1);
                    if (previpa.tone == "4")
                        previpa.tone = "0";
                    ipalist.push(Object.assign({}, previpa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    i -= 2;
                    continue;
                }
                else {
                    tmpconso = "";
                    ipa.onset = "∅";
                }
            }
            ipa.rime += c;
        }
    }
    
    if (ipa.tone == "") {
        ipa.tone = "0";
    }
    if (ipa.rime == "") {
        ipa.rime = "◌";
    }
    if (ipa.onset == "") {
        ipa.onset = "∅";
        if (ipalist.length == 0)
            ipalist.push(Object.assign({}, ipa));
    }
    else
        ipalist.push(Object.assign({}, ipa));

    while (ipalist.length != 0) {
        var ipatmp = ipalist.pop();
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiYo where phone='" + ipatmp.onset + "' ");
        if (ipaSQL.length > 0)
            ipatmp.onset = ipaSQL[0].values[0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }
        if (ipatmp.onset2 != "") {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiYo where phone='" + ipatmp.onset2 + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset += ipaSQL[0].values[0];
            else {
                ipastr = (" ∅") + ipastr;
                continue;
            }
        }
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiYo where phone='" + ipatmp.rime + "' ");
        if (ipaSQL.length > 0)
            ipatmp.rime = ipaSQL[0].values[0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiYo where phone='" + ipatmp.tone + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            ipatmp.tone = ipaSQL[0].values[0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }

        if (accent == "roman")
            ipastr = " " + ((ipatmp.onset == 'ʔ') ? '' : ipatmp.onset) + TaiYorimetone(ipatmp.rime[0], ipatmp.tone[0]) + ipastr;
        else
            ipastr = " " + ipatmp.onset + ipatmp.rime + ipatmp.tone + ipastr;
    }

    return (ipastr.substring(1));
}

function TaiYorimetone(rime, tone) {
    var rimetone = rime;
    switch (tone) {
        case "́":
            rimetone = rime.replace("iê", "iế").replace("uô", "uố").replace("ươ", "ướ");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "á").replace("ă", "ắ").replace("ơ", "ớ").replace("o", "ó").replace("ô", "ố").replace("e", "é").replace("ê", "ế").replace("u", "ú").replace("ư", "ứ");
                if (rimetone == rime) {
                    rimetone = rime.replace("i", "í");
                }
            }
            break;
        case "̀":
            rimetone = rime.replace("iê", "iề").replace("uô", "uồ").replace("ươ", "ườ");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "à").replace("ă", "ằ").replace("ơ", "ờ").replace("o", "ò").replace("ô", "ồ").replace("e", "è").replace("ê", "ề").replace("u", "ù").replace("ư", "ừ");
                if (rimetone == rime) {
                    rimetone = rime.replace("i", "ì");
                }
            }
            break;
        case "̣":
            rimetone = rime.replace("iê", "iệ").replace("uô", "uộ").replace("ươ", "ượ");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "ạ").replace("ă", "ặ").replace("ơ", "ợ").replace("o", "ọ").replace("ô", "ộ").replace("e", "ẹ").replace("ê", "ệ").replace("u", "ụ").replace("ư", "ự");
                if (rimetone == rime) {
                    rimetone = rime.replace("i", "ị");
                }
            }
            break;
        case "̄":
            rimetone = rime.replace("iê", "iê̄").replace("uô", "uô̄").replace("ươ", "ươ̄");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "ā").replace("ă", "ă̄").replace("ơ", "ơ̄").replace("o", "ō").replace("ô", "ô̄").replace("e", "ē").replace("ê", "ê̄").replace("u", "ū").replace("ư", "ư̄");
                if (rimetone == rime) {
                    rimetone = rime.replace("i", "ī");
                }
            }
            break;
        case "̌":
            rimetone = rime.replace("iê", "iê̌").replace("uô", "uô̌").replace("ươ", "ươ̌");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "ǎ").replace("ă", "ă̌").replace("ơ", "ơ̌").replace("o", "ǒ").replace("ô", "ô̌").replace("e", "ě").replace("ê", "ê̌").replace("u", "ǔ").replace("ư", "ư̌");
                if (rimetone == rime) {
                    rimetone = rime.replace("i", "ǐ");
                }
            }
            break;
        default:
            break;
    }
    return rimetone;
}

function TayIPA(w, accent) {
    var ipa = {};
    ipa.onset = "", ipa.rime = "", ipa.tone = "";
    var toneclass = 1;
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("qrtpsdđfghjklzxcvbnm".includes(c)) {
            ipa.onset += c;
        }
        else {
            if (ipa.onset == "q") {
                ipa.onset = "qu";
                ipa.rime = w.substring(i + 1);
            } else {
                ipa.rime = w.substring(i);
            }
            break;
        }
    }

    for (var i = 0; i < ipa.rime.length; i++) {
        var c = ipa.rime.charAt(i);
        var c_plain = "";
        switch (c) {
            case 'á': ipa.tone = "́"; c_plain = 'a'; break; case 'à': ipa.tone = "̀"; c_plain = 'a'; toneclass = 2; break; case 'ả': ipa.tone = "̉"; c_plain = 'a'; break; case 'ã': ipa.tone = "̣"; c_plain = 'a'; break; case 'ạ': ipa.tone = "̣"; c_plain = 'a'; toneclass = 2; break;
            case 'ấ': ipa.tone = "́"; c_plain = 'â'; break; case 'ầ': ipa.tone = "̀"; c_plain = 'â'; toneclass = 2; break; case 'ẩ': ipa.tone = "̉"; c_plain = 'â'; break; case 'ẫ': ipa.tone = "̣"; c_plain = 'â'; break; case 'ậ': ipa.tone = "̣"; c_plain = 'â'; toneclass = 2; break;
            case 'ắ': ipa.tone = "́"; c_plain = 'ă'; break; case 'ằ': ipa.tone = "̀"; c_plain = 'ă'; toneclass = 2; break; case 'ẳ': ipa.tone = "̉"; c_plain = 'ă'; break; case 'ẵ': ipa.tone = "̣"; c_plain = 'ă'; break; case 'ặ': ipa.tone = "̣"; c_plain = 'ă'; toneclass = 2; break;
            case 'é': ipa.tone = "́"; c_plain = 'e'; break; case 'è': ipa.tone = "̀"; c_plain = 'e'; toneclass = 2; break; case 'ẻ': ipa.tone = "̉"; c_plain = 'e'; break; case 'ẽ': ipa.tone = "̣"; c_plain = 'e'; break; case 'ẹ': ipa.tone = "̣"; c_plain = 'e'; toneclass = 2; break;
            case 'ế': ipa.tone = "́"; c_plain = 'ê'; break; case 'ề': ipa.tone = "̀"; c_plain = 'ê'; toneclass = 2; break; case 'ể': ipa.tone = "̉"; c_plain = 'ê'; break; case 'ễ': ipa.tone = "̣"; c_plain = 'ê'; break; case 'ệ': ipa.tone = "̣"; c_plain = 'ê'; toneclass = 2; break;
            case 'í': ipa.tone = "́"; c_plain = 'i'; break; case 'ì': ipa.tone = "̀"; c_plain = 'i'; toneclass = 2; break; case 'ỉ': ipa.tone = "̉"; c_plain = 'i'; break; case 'ĩ': ipa.tone = "̣"; c_plain = 'i'; break; case 'ị': ipa.tone = "̣"; c_plain = 'i'; toneclass = 2; break;
            case 'ó': ipa.tone = "́"; c_plain = 'o'; break; case 'ò': ipa.tone = "̀"; c_plain = 'o'; toneclass = 2; break; case 'ỏ': ipa.tone = "̉"; c_plain = 'o'; break; case 'õ': ipa.tone = "̣"; c_plain = 'o'; break; case 'ọ': ipa.tone = "̣"; c_plain = 'o'; toneclass = 2; break;
            case 'ố': ipa.tone = "́"; c_plain = 'ô'; break; case 'ồ': ipa.tone = "̀"; c_plain = 'ô'; toneclass = 2; break; case 'ổ': ipa.tone = "̉"; c_plain = 'ô'; break; case 'ỗ': ipa.tone = "̣"; c_plain = 'ô'; break; case 'ộ': ipa.tone = "̣"; c_plain = 'ô'; toneclass = 2; break;
            case 'ớ': ipa.tone = "́"; c_plain = 'ơ'; break; case 'ờ': ipa.tone = "̀"; c_plain = 'ơ'; toneclass = 2; break; case 'ở': ipa.tone = "̉"; c_plain = 'ơ'; break; case 'ỡ': ipa.tone = "̣"; c_plain = 'ơ'; break; case 'ợ': ipa.tone = "̣"; c_plain = 'ơ'; toneclass = 2; break;
            case 'ú': ipa.tone = "́"; c_plain = 'u'; break; case 'ù': ipa.tone = "̀"; c_plain = 'u'; toneclass = 2; break; case 'ủ': ipa.tone = "̉"; c_plain = 'u'; break; case 'ũ': ipa.tone = "̣"; c_plain = 'u'; break; case 'ụ': ipa.tone = "̣"; c_plain = 'u'; toneclass = 2; break;
            case 'ứ': ipa.tone = "́"; c_plain = 'ư'; break; case 'ừ': ipa.tone = "̀"; c_plain = 'ư'; toneclass = 2; break; case 'ử': ipa.tone = "̉"; c_plain = 'ư'; break; case 'ữ': ipa.tone = "̣"; c_plain = 'ư'; break; case 'ự': ipa.tone = "̣"; c_plain = 'ư'; toneclass = 2; break;
            case 'ý': ipa.tone = "́"; c_plain = 'y'; break; case 'ỳ': ipa.tone = "̀"; c_plain = 'y'; toneclass = 2; break; case 'ỷ': ipa.tone = "̉"; c_plain = 'y'; break; case 'ỹ': ipa.tone = "̣"; c_plain = 'y'; break; case 'ỵ': ipa.tone = "̣"; c_plain = 'y'; toneclass = 2; break;
            case '̱': c_plain = ""; ipa.tone = "̱"; toneclass = 2; break;
            default: c_plain = c; break;
        }
        if (c_plain != c) {
            ipa.rime = ipa.rime.substr(0, i) + c_plain + ipa.rime.substr(i + 1);
            break;
        }
    }
    var deadcons = ipa.rime.slice(ipa.rime.length - 1)
    if ("pct".includes(deadcons) || (ipa.rime.slice(ipa.rime.length - 1) == "ch"))
        ipa.tone += "ˀ";

    if (ipa.tone == "") {
        ipa.tone = "ʔ";
    }
    if (ipa.onset == "") {
        ipa.onset = "∅";
    }
    if (['c', 'k', 'qu', 'kr', 'ch', 'x', 't', 'p', 'pj', 'pr', 'f'].includes(ipa.onset) && (toneclass == 2)) {
        ipa.onset += "̤";
    }

    ipaSQL = ipadb.exec("SELECT " + accent + " FROM Tay where phone='" + ipa.onset + "' ");
    if (ipaSQL.length > 0)
        ipa.onset = ipaSQL[0].values[0];
    else
        return { onset: "", rime: "∅", tone: "" };
    ipaSQL = ipadb.exec("SELECT " + accent + " FROM Tay where phone='" + ipa.rime + "' ");
    if (ipaSQL.length > 0)
        ipa.rime = ipaSQL[0].values[0];
    else
        return { onset: "", rime: "∅", tone: "" };
    ipaSQL = ipadb.exec("SELECT " + accent + " FROM Tay where phone='" + ipa.tone + "' ");
    if (ipaSQL.length > 0)
        ipa.tone = ipaSQL[0].values[0];
    else
        return { onset: "", rime: "∅", tone: "" };

    return (ipa);
}

function VietIPA(w, accent) {
    var ipa = {};
    ipa.onset = "", ipa.rime = "", ipa.tone = "";
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("qrtpsdđfghjklzxcvbnm".includes(c)) {
            ipa.onset += c;
        }
        else {
            if (ipa.onset == "q") {
                ipa.onset = "qu";
                ipa.rime = w.substring(i + 1);
            } else if ((ipa.onset == "g") && (i == 1) && "iìíỉĩịyỳýỷỹỵ".includes(c)) {
                ipa.onset = "gi";
                ipa.rime = w.substring(i);
            } else {
                ipa.rime = w.substring(i);
            }
            break;
        }
    }

    for (var i = 0; i < ipa.rime.length; i++) {
        var c = ipa.rime.charAt(i);
        var c_plain = "";
        switch (c) {
            case 'á': ipa.tone = "́"; c_plain = 'a'; break; case 'à': ipa.tone = "̀"; c_plain = 'a'; break; case 'ả': ipa.tone = "̉"; c_plain = 'a'; break; case 'ã': ipa.tone = "̃"; c_plain = 'a'; break; case 'ạ': ipa.tone = "̣"; c_plain = 'a'; break;
            case 'ấ': ipa.tone = "́"; c_plain = 'â'; break; case 'ầ': ipa.tone = "̀"; c_plain = 'â'; break; case 'ẩ': ipa.tone = "̉"; c_plain = 'â'; break; case 'ẫ': ipa.tone = "̃"; c_plain = 'â'; break; case 'ậ': ipa.tone = "̣"; c_plain = 'â'; break;
            case 'ắ': ipa.tone = "́"; c_plain = 'ă'; break; case 'ằ': ipa.tone = "̀"; c_plain = 'ă'; break; case 'ẳ': ipa.tone = "̉"; c_plain = 'ă'; break; case 'ẵ': ipa.tone = "̃"; c_plain = 'ă'; break; case 'ặ': ipa.tone = "̣"; c_plain = 'ă'; break;
            case 'é': ipa.tone = "́"; c_plain = 'e'; break; case 'è': ipa.tone = "̀"; c_plain = 'e'; break; case 'ẻ': ipa.tone = "̉"; c_plain = 'e'; break; case 'ẽ': ipa.tone = "̃"; c_plain = 'e'; break; case 'ẹ': ipa.tone = "̣"; c_plain = 'e'; break;
            case 'ế': ipa.tone = "́"; c_plain = 'ê'; break; case 'ề': ipa.tone = "̀"; c_plain = 'ê'; break; case 'ể': ipa.tone = "̉"; c_plain = 'ê'; break; case 'ễ': ipa.tone = "̃"; c_plain = 'ê'; break; case 'ệ': ipa.tone = "̣"; c_plain = 'ê'; break;
            case 'í': ipa.tone = "́"; c_plain = 'i'; break; case 'ì': ipa.tone = "̀"; c_plain = 'i'; break; case 'ỉ': ipa.tone = "̉"; c_plain = 'i'; break; case 'ĩ': ipa.tone = "̃"; c_plain = 'i'; break; case 'ị': ipa.tone = "̣"; c_plain = 'i'; break;
            case 'ó': ipa.tone = "́"; c_plain = 'o'; break; case 'ò': ipa.tone = "̀"; c_plain = 'o'; break; case 'ỏ': ipa.tone = "̉"; c_plain = 'o'; break; case 'õ': ipa.tone = "̃"; c_plain = 'o'; break; case 'ọ': ipa.tone = "̣"; c_plain = 'o'; break;
            case 'ố': ipa.tone = "́"; c_plain = 'ô'; break; case 'ồ': ipa.tone = "̀"; c_plain = 'ô'; break; case 'ổ': ipa.tone = "̉"; c_plain = 'ô'; break; case 'ỗ': ipa.tone = "̃"; c_plain = 'ô'; break; case 'ộ': ipa.tone = "̣"; c_plain = 'ô'; break;
            case 'ớ': ipa.tone = "́"; c_plain = 'ơ'; break; case 'ờ': ipa.tone = "̀"; c_plain = 'ơ'; break; case 'ở': ipa.tone = "̉"; c_plain = 'ơ'; break; case 'ỡ': ipa.tone = "̃"; c_plain = 'ơ'; break; case 'ợ': ipa.tone = "̣"; c_plain = 'ơ'; break;
            case 'ú': ipa.tone = "́"; c_plain = 'u'; break; case 'ù': ipa.tone = "̀"; c_plain = 'u'; break; case 'ủ': ipa.tone = "̉"; c_plain = 'u'; break; case 'ũ': ipa.tone = "̃"; c_plain = 'u'; break; case 'ụ': ipa.tone = "̣"; c_plain = 'u'; break;
            case 'ứ': ipa.tone = "́"; c_plain = 'ư'; break; case 'ừ': ipa.tone = "̀"; c_plain = 'ư'; break; case 'ử': ipa.tone = "̉"; c_plain = 'ư'; break; case 'ữ': ipa.tone = "̃"; c_plain = 'ư'; break; case 'ự': ipa.tone = "̣"; c_plain = 'ư'; break;
            case 'ý': ipa.tone = "́"; c_plain = 'y'; break; case 'ỳ': ipa.tone = "̀"; c_plain = 'y'; break; case 'ỷ': ipa.tone = "̉"; c_plain = 'y'; break; case 'ỹ': ipa.tone = "̃"; c_plain = 'y'; break; case 'ỵ': ipa.tone = "̣"; c_plain = 'y'; break;
            default: c_plain = c; break;
        }
        if (c_plain != c) {
            ipa.rime = ipa.rime.substr(0, i) + c_plain + ipa.rime.substr(i + 1);
            break;
        }
    }
    var deadcons = ipa.rime.slice(ipa.rime.length - 1)
    if ("pct".includes(deadcons) || (ipa.rime.slice(ipa.rime.length - 1) == "ch"))
        ipa.tone += "ˀ";

    if (ipa.tone == "") {
        ipa.tone = "ʔ";
    }
    if (ipa.onset == "") {
        ipa.onset = "∅";
    }
    if ((ipa.onset == "qu") && (ipa.rime == "ôc")) {
        ipa.onset = "q";
        ipa.rime = "uâc";
    }
    if ((ipa.onset == "gi") && !['i', 'in', 'it', 'inh', 'ich', 'im', 'ip', 'iên', 'iêt', 'iêng', 'iêc', 'iêm', 'iêp', 'ya'].includes(ipa.rime)) {
        ipa.rime = ipa.rime.substring(1);
    }

    ipaSQL = ipadb.exec("SELECT " + accent + " FROM Viet where phone='" + ipa.onset + "' ");
    if (ipaSQL.length > 0)
        ipa.onset = ipaSQL[0].values[0];
    else
        return { onset: "", rime: "∅", tone: "" };
    ipaSQL = ipadb.exec("SELECT " + accent + " FROM Viet where phone='" + ipa.rime + "' ");
    if (ipaSQL.length > 0)
        ipa.rime = ipaSQL[0].values[0];
    else
        return { onset: "", rime: "∅", tone: "" };
    ipaSQL = ipadb.exec("SELECT " + accent + " FROM Viet where phone='" + ipa.tone + "' ");
    if (ipaSQL.length > 0)
        ipa.tone = ipaSQL[0].values[0];
    else
        return {onset: "", rime: "∅", tone: ""};

    return (ipa);
}