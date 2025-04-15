quocngu = 17;
opttable = "rubytaidam";
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
	
function translatesentence(sentence, maxlevel) {
	var output = [];
    var words = sentence.split(" ");
    words = words.filter(function (a) { return a !== '' });	
	let i = 0;
	while (i < words.length) {
		let matched = false;
    // Try the longest possible match from current word
    for (let len = Math.min(5, words.length - i); len > 0; len--) {
      var compound = words.slice(i, i + len).join(' ');
	  contents = condb3.exec("SELECT viet, " + transtable + " FROM trans" + transtable + " WHERE " + transtable + " = '" + compound.toLowerCase().replace(/\'/g, "''") + "'");
      if (contents.length != 0) {
        output.push(contents[0].values[0][0]);
        i += len;
        matched = true;
        break;
      } else {
		  var outsyntax = [];
		  [matched, outsyntax] = searchbetween(compound, maxlevel);
		  if (matched) {
			output.push(outsyntax);
			i += len;			  
			break;
		  } else {
				[matched, outsyntax] = searchend(compound, maxlevel);
				if (matched) {
					output.push(outsyntax);
					i += len;			  
					break;
				}
		  }
	  }
    }

    // If no match found, keep the original word
    if (!matched) {
      contents = condb3.exec("select viet,(level % " + maxlevel + ") from trans" + transtable + " where " + transtable + "='" + words[i].toLowerCase().replace(/\'/g, "''") + "' order by (level % " + maxlevel + ") desc");
	  if (contents.length != 0) {
		  output.push(contents[0].values[0][0]);
	  } else {
		  output.push(words[i]);
	  }
      i++;
    }
	}
  
  return output;
}

function translatepad(maxlevel) {
	var phrase = $("#txtPad").val();
    var outputarr = [];
    phrase = phrase.replace(/\./g, " .|");
    phrase = phrase.replace(/\?/g, " ?|");
    phrase = phrase.replace(/!/g, " !|");
    phrase = phrase.replace(/\n/g, " \n|");
    phrase = phrase.replace(/,/g, " ,");
    phrase = phrase.replace(/:/g, " :");
    phrase = phrase.replace(/;/g, " ;");
    var sentence = phrase.split("|");
    sentence = sentence.filter(function (a) { return a !== '' });	
	
	var output = [];
	for (var ise=0; ise<sentence.length; ise++) {	
		output = translatesentence(sentence[ise], maxlevel);
		outputarr.push(...output);
	}

    var ttt = outputarr[0];
    var icubo;
    for (icubo = 1; icubo < outputarr.length; icubo++) {
        ttt = ttt + " " + outputarr[icubo];
    }
ttt=ttt.replace(/ \s*([.,!?;:])/g, "$1");
ttt = ttt.trim();
if (ttt.length > 0) {
    ttt = ttt[0].toLocaleUpperCase("vi") + ttt.slice(1);
}
ttt = ttt.replace(/([.!?\n])\s+([a-záàảãạâấầẩẫậăắằẳẵặéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ])/gi, 
    (_, punc, letter) => punc + ' ' + letter.toLocaleUpperCase("vi")
  ).replace(/\n /g, "\n");
$("#txtPadout").html(ttt);
}

function searchbetween(phrase, maxlevel) {
	const words = phrase.trim().replace(/[.,!?;:()"]/g, '').split(/\s+/);
	
	contents = condb3.exec("SELECT viet, id, " + transtable + "S, " + transtable + "E, (level % " + maxlevel + ") FROM between" + transtable + " WHERE " + transtable + "S = '" + words[0].toLowerCase().replace(/\'/g, "''") + "' AND " + transtable + "E = '" + words[words.length - 1].toLowerCase().replace(/\'/g, "''") + "' order by (level % " + maxlevel + ") desc limit 1");
	if (contents.length != 0) {
		var middle = words.length > 2 ? words.slice(1, -1).join(' ') : '';		
		if (middle.length != 0) {
switch(Math.floor(contents[0].values[0][1])) {
  case 1: //ngày
    if (!middle.includes(" ") && (middle != "ꪏꪱꪫ")) {
		contents = condb3.exec("SELECT viet, id, " + transtable + "S, " + transtable + "E, (level % " + maxlevel + ") FROM between" + transtable + " WHERE id = 1.0");
	} else {
		contents = condb3.exec("SELECT viet, id, " + transtable + "S, " + transtable + "E, (level % " + maxlevel + ") FROM between" + transtable + " WHERE id = 1.1");
	}
    break;
  default:
}
			return [true, contents[0].values[0][0].replace(/\$/g, translatesentence(middle, maxlevel))];
		} else {
			return [false, []];
		}
	} else {
		return [false, []];
	}
}

function searchend(phrase, maxlevel) {
	const words = phrase.trim().replace(/[.,!?;:()"]+$/g, '').split(/\s+/);
	
	contents = condb3.exec("SELECT viet, id, " + transtable + ", (level % " + maxlevel + ") FROM end" + transtable + " WHERE " + transtable + " = '" + words[words.length - 1].toLowerCase().replace(/\'/g, "''") + "' order by (level % " + maxlevel + ") desc limit 1");
	if (contents.length != 0) {
		var middle = words.length > 1 ? words.slice(0, -1).join(' ') : '';		
		if (middle.length != 0) {
switch(Math.floor(contents[0].values[0][1])) {
  case 1: //một
    countablenoun = condb3.exec("SELECT viet, " + transtable + ",pos FROM trans" + transtable + " WHERE " + transtable + " = '" + middle.toLowerCase().replace(/\'/g, "''") + "'");
    if (countablenoun.length != 0) {
		var pos = countablenoun[0].values[0][2].split(",");
		if (pos.includes("N")) {
			return [true, contents[0].values[0][0].replace(/\$/g, countablenoun[0].values[0][0])];	
		} else {		
			return [false, []];	
		}
    } else {		
		return [false, []];	
	}
	break;
  case 2: //mỗi một
	if (middle.includes(" ")) {
		return [false, []];		
	}
    if (middle == "ꪀꪷ") {
		contents = condb3.exec("SELECT viet, id, " + transtable + ", (level % " + maxlevel + ") FROM end" + transtable + " WHERE id = 2.1");
	} else {
		contents = condb3.exec("SELECT viet, id, " + transtable + ", (level % " + maxlevel + ") FROM end" + transtable + " WHERE id = 2.0");
	}
    break;
  default:
}
			return [true, contents[0].values[0][0].replace(/\$/g, translatesentence(middle, maxlevel))];
		} else {
			return [false, []];
		}
	} else {
		return [false, []];
	}
}

function virtualkey(key) {
	virtualtype(key);
	document.getElementById("txtPad").focus();
}