quocngu = 17;
var transtable = "taydam";
var dicID;
var dictbool = true;
	if (dicID == "0") {
		dictbool = false;
	}
    var kbbool = true;
    var dictname1 = "Tãy Đăm → Việt";
    var dictname2 = "Việt → Tãy Đăm";
	
// Connect to sqlite db file
var xhr3 = new XMLHttpRequest();
xhr3.open('GET', './Resources/transtaydam.jpg', true);
xhr3.responseType = 'arraybuffer';
xhr3.onload = function (e) {
    var uInt8Array = new Uint8Array(this.response);
    condb3 = new SQL.Database(uInt8Array);
    contents = condb3.exec("SELECT viet FROM transtaydam where taydam='ꪙꪾ꫁' ");
    // contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]
    console.log(contents[0].values[0]);
    $("#waitscreen").css({ display: 'none' });
    $("#txtPad").focus();
};
xhr3.send();


function inverse() {
        dictbool = !dictbool;
        if (dictbool) 
            $("#dict").html(dictname1);
        else
            $("#dict").html(dictname2);
    }
	
function translatepad(maxlevel) {
	var phrase = $("#txtPad").val();
	var ext = false;
    if ((phrase.length == 1) && defa)
        ext = true;
    var outputarr = [];
    var sss = "";
    phrase = phrase.replace(/\./g, " .|");
    phrase = phrase.replace(/\?/g, " ?|");
    phrase = phrase.replace(/!/g, " !|");
    phrase = phrase.replace(/,/g, " ,");
    phrase = phrase.replace(/:/g, " :");
    phrase = phrase.replace(/;/g, " ;");
    var sentence = phrase.split("|");
    sentence = sentence.filter(function (a) { return a !== '' });
	
	var ise;
for (ise = 0; ise != sentence.length; ise++) {
    var word = sentence[ise].split(" ");
    word = word.filter(function (a) { return a !== '' });
    var k;
    var sql = "";
    var fullcharcase;
    var fullchar;

    var pconlenbuf = 0;
    var pconlentmp = 0;
    var pconlentail = 0;
    var pconcSz = 0;
    var pconqSz = 0;
    var pconrSz = 0;
    var pcontcSz = 0;
    var pcontqSz = 0;
    var pcontrSz = 0;
    var pcontail = "";
    var pconqueue = "";
    var xstr = [];
    var pcubo = [];

    for (k = 0; k != word.length; k++) {
        pconqSz = pconrSz = pconcSz = pcontqSz = pcontrSz = pcontcSz = 0;

        switch (quocngu) {
            case 24:
                word[k] = TaiYoRoma(word[k]);
                break;
            default: break;
        }

        fullcharcase = word[k];

        fullchar = fullcharcase.toLowerCase();

        pcubo = [];
        if (pconqueue != "") {
            var optta = transtable;
            var cfullchar = pconqueue + fullchar;
            var csize = cfullchar.split(" ").length;
            contents = condb3.exec("SELECT viet, " + optta + " FROM trans" + optta + " WHERE " + optta + " = '" + cfullchar.replace(/\'/g, "''") + "'");
            var i, j;

            if (contents.length != 0) {
                for (i = 0; i < contents[0].values.length; i++) {
                    xstr = [];
					xstr.push(contents[0].values[i][0]);
                    pcubo.push(xstr);
                    pconlenbuf = pconlentmp;
                }
            }

            pconqSz = pconrSz = pconcSz = pcubo.length;
            contents = condb3.exec("SELECT viet, " + optta + " FROM trans" + optta + " WHERE " + optta + " like '" + cfullchar.replace(/\'/g, "''") + " %'");
            xstr = [];
            var rubo = [];
            if (contents.length != 0) {
                for (i = 0; i < contents[0].values.length; i++) {
                    xstr = [];
					xstr.push(contents[0].values[i][0]);
                    rubo.push(xstr);
                    pconlenbuf = pconlentmp;
                }
                pcubo = pcubo.concat(rubo);
                pconqSz++;
                pconrSz = pcubo.length;
            }
			
            ptqSz = ptrSz = ptcSz = pcubo.length;

            if (pcontail != "") {
                var truby = pcontail + fullchar;
                var tsize = truby.split(" ").length;
                contents = condb3.exec("SELECT viet, " + optta + " FROM trans" + optta + " WHERE " + optta + " = '" + truby.replace(/\'/g, "''") + "'");
                if (contents.length != 0) {
                    for (i = 0; i < contents[0].values.length; i++) {
                        xstr = [];
						xstr.push(contents[0].values[i][0]);
                        pcubo.push(xstr);
                        pconlenbuf = pconlentmp;
                    }
                }
                ptqSz = ptrSz = ptcSz = pcubo.length;
                contents = condb3.exec("SELECT viet, " + optta + " FROM trans" + optta + " WHERE " + optta + " like '" + truby.replace(/\'/g, "''") + " %'");
                xstr = [];
                rubo = [];
                if (contents.length != 0) {
                    for (i = 0; i < contents[0].values.length; i++) {
                        xstr = [];
						xstr.push(contents[0].values[i][0]);
                        rubo.push(xstr);
                        pconlenbuf = pconlentmp;
                    }
                    pcubo = pcubo.concat(rubo);
                    pcontqSz++;
                    pcontrSz = pcubo.length;
                }

            }
        }
        var q;

        sql = "select viet,(level % " + maxlevel + ") from trans" + transtable + " where " + transtable + "='" + fullchar.replace(/\'/g, "''") + "' order by (level % " + maxlevel + ") desc";
        contents = condb3.exec(sql);
        if (contents.length != 0) {
            sss = contents[0].values[0][0];
            if (ext) {
                for (q = 1; q < contents[0].values.length; q++) {
                    sss = sss + "/" + contents[0].values[q][0];
                }
            }
        }

        if (pconcSz > 0) {
            if (pconcSz == pconqSz)
                pconqueue = "";
            else
                pconqueue = pconqueue + fullchar + " ";
            pcontail = "";
        } else if (pconqSz > 0) {
            pconqueue = pconqueue + fullchar + " ";
            pcontail = fullchar + " ";
        } else if (pconrSz > 0) {
            pconqueue = pcontail = "";
        } else if (pcontcSz > 0) {
            pconlenbuf = pconlentail;
            if (pcontcSz == pcontqSz)
                pconqueue = "";
            else
                pconqueue = pcontail + fullchar + " ";
            pcontail = "";
        } else if (pcontqSz > 0) {
            pconlenbuf = pconlentail;
            pconqueue = pcontail + fullchar + " ";
            pcontail = fullchar + ":";
        } else if (pcontrSz > 0) {
            pconlenbuf = pconlentail;
            pconqueue = pcontail = "";
        } else {
            pconqueue = fullchar + " ";
            pcontail = "";
            pconlenbuf = 0;
            pcubo = [];
        }

        if (pcubo.length != 0) {
            for (q = 1; q < pcubo[0].length; q++) {
                outputarr.pop();
            }
            for (q = 0; q != pcubo[0].length; q++) {
                outputarr.push(pcubo[0][q]);
            }
        } else {
            if (sss.length > 0)
                outputarr.push(sss);
            else
                outputarr.push(fullcharcase);
        }
        sss = "";
    }
	outputarr.push("➕");
}
    var icubo;
    var ttt = outputarr[0];
    for (icubo = 1; icubo < outputarr.length; icubo++) {
        ttt = ttt + outputarr[icubo];
    }


$("#txtPadtrans").html(ttt.replace(/\n/g, " <br> "));
}