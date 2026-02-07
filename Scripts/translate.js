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
	var outpos = [];
    var words = sentence.split(" ");
    words = words.filter(function (a) { return a !== '' });	
	
	//duplicator
	for (j = 1; j < words.length; j++) {
		if (words[j] == "꫟")
			words[j] = words[j-1];
	}
	
	let i = 0;
	while (i < words.length) {
		let matched = false;
    // Try the longest possible match from current word
    for (let len = Math.min(5, words.length - i); len > 0; len--) {
      var compound = words.slice(i, i + len).join(' ');
	  contents = condb3.exec("SELECT viet,pos,(level % " + maxlevel + ") FROM trans" + transtable + " WHERE " + transtable + " = '" + compound.toLowerCase().replace(/\'/g, "''") + "' order by (level % " + maxlevel + ") desc");
      if (contents.length != 0) {
        output.push(contents[0].values[0][0]);
        outpos.push(contents[0].values[0][1]);
        i += len;
        matched = true;
        break;
      } else {
		  var outsyntax = [];
		  [matched, outsyntax] = searchbetween(compound, maxlevel);
		  if (matched) {
					output.push(outsyntax.res);
					outpos.push(outsyntax.pos);
			i += len;			  
			break;
		  } else {
			    var prev = i > 0 ? words[i-1] : null;
				[matched, outsyntax] = searchstart(compound, maxlevel, prev);
				if (matched) {
					output.push(outsyntax.res);
					outpos.push(outsyntax.pos);
					i += len;			  
					break;
				}  else {
					var next = i < words.length-1 ? words[i+1] : null;
					[matched, outsyntax] = searchend(compound, maxlevel, next);
						if (matched) {
						output.push(outsyntax.res);
						outpos.push(outsyntax.pos);
						i += len;			  
						break;
				}
		  }
		  }
	  }
    }

    // If no match found, keep the original word
    if (!matched) {
      contents = condb3.exec("select viet,pos,(level % " + maxlevel + ") from trans" + transtable + " where " + transtable + "='" + words[i].toLowerCase().replace(/\'/g, "''") + "' order by (level % " + maxlevel + ") desc");
	  if (contents.length != 0) {
		  output.push(contents[0].values[0][0]);
		  outpos.push(contents[0].values[0][1]);
	  } else {
		  output.push(words[i]);
		  outpos.push(null);
	  }
      i++;
    }
	}
  
  return {res: output, pos: outpos};
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
	
    phrase = phrase.replace(/ꫜ/g, "ꪙꪳ꪿ꪉ");
    phrase = phrase.replace(/ꫛ/g, "ꪶꪁꪙ");
    var sentence = phrase.split("|");
    sentence = sentence.filter(function (a) { return a !== '' });	
	
	var output = [];
	for (var ise=0; ise<sentence.length; ise++) {	
		output = translatesentence(sentence[ise], maxlevel);
		outputarr.push(...output.res);
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
	const words = phrase.split(" ");
	
	var contents = condb3.exec("SELECT viet, id, " + transtable + "S, " + transtable + "E, (level % " + maxlevel + ") FROM between" + transtable + " WHERE " + transtable + "S = '" + words[0].toLowerCase().replace(/\'/g, "''") + "' AND " + transtable + "E = '" + words[words.length - 1].toLowerCase().replace(/\'/g, "''") + "' order by (level % " + maxlevel + ") desc limit 1");
	if (contents.length != 0) {
		var middle = words.length > 2 ? words.slice(1, -1).join(' ') : '';		
		if (middle.length != 0) {
var pos = null;
switch(Math.floor(contents[0].values[0][1])) {
  case 1: //ngày
    if (!middle.includes(" ") && (middle != "ꪏꪱꪫ")) {
		contents = condb3.exec("SELECT viet, id, " + transtable + "S, " + transtable + "E, (level % " + maxlevel + ") FROM between" + transtable + " WHERE id = 1.0");
	} else {
		contents = condb3.exec("SELECT viet, id, " + transtable + "S, " + transtable + "E, (level % " + maxlevel + ") FROM between" + transtable + " WHERE id = 1.1");
	}
	pos = "N";
    break;
  default:
}
			return [true, {res: contents[0].values[0][0].replace(/\$/g, translatesentence(middle, maxlevel).res), pos: pos}];
		} else {
			return [false, null];
		}
	} else {
		return [false, null];
	}
}

function searchend(phrase, maxlevel, next) {
	const words = phrase.split(" ");
	var countablenoun;
	var contents = condb3.exec("SELECT viet, id, " + transtable + ", (level % " + maxlevel + ") FROM end" + transtable + " WHERE " + transtable + " = '" + words.slice(-1)[0].toLowerCase().replace(/\'/g, "''") + "' order by (level % " + maxlevel + ") desc limit 1");
	if (contents.length != 0) {
		var init = words.length > 1 ? words.slice(0, -1).join(' ') : '';		
		if (init.length != 0) {
switch(Math.floor(contents[0].values[0][1])) {
  case 1: //một
	if ((words.slice(-2)[0] == "ꪜꪱꪥ") && init.includes(" "))
		return [false, null];
	if (words.slice(0, -1).includes("ꪙꪳ꪿ꪉ"))
		return [false, null];	
  case 2: //mỗi một
    var phrasalnoun = translatesentence(init, maxlevel);
	if (phrasalnoun.pos[0]==null)
		return [false, null];	
	if (phrasalnoun.pos[0].split(',').includes("N") || phrasalnoun.pos[0].split(',').includes("Cl")) {
			return [true, {res: contents[0].values[0][0].replace(/\$/g, phrasalnoun.res.join(' ')), pos: "N"}];	
	} else {
			return [false, null];	
	}
	break;
  case 3: //chỉ
    var phrasalverb = translatesentence(init, maxlevel);
	if (phrasalverb.pos.length!=1)
		return [false, null];
	if (phrasalverb.pos[0]==null)
		return [false, null];
	var contents2 = condb3.exec("SELECT viet,pos,(level % " + maxlevel + ") FROM trans" + transtable + " WHERE " + transtable + " = '" + (words.slice(-1)[0] + " " + next).toLowerCase().replace(/\'/g, "''") + "' order by (level % " + maxlevel + ") desc");
	if (contents.length != 0) {
			return [false, null];			
	}
	if (phrasalverb.pos[0].split(',').includes("V")) {
			return [true, {res: contents[0].values[0][0].replace(/\$/g, phrasalverb.res.join(' ')), pos: "V"}];	
	} else {
			return [false, null];	
	}
	break;
  case 4: //động từ + vào
    var phrasalverb = translatesentence(init, maxlevel);
	if (phrasalverb.pos.length!=1)
		return [false, null];
	if (phrasalverb.pos[0]==null)
		return [false, null];
	if (phrasalverb.pos[0].split(',').includes("V")) {
			return [true, {res: contents[0].values[0][0].replace(/\$/g, phrasalverb.res.join(' ')), pos: "V"}];	
	} else {
			return [false, null];	
	}
	break;
  default:
}
			return [true, {res: contents[0].values[0][0].replace(/\$/g, translatesentence(init, maxlevel).res.join(' ')), pos: null}];
		} else {
			return [false, null];
		}
	} else {
		contents = condb3.exec("SELECT viet, id, " + transtable + ", (level % " + maxlevel + ") FROM end" + transtable + " WHERE " + transtable + " like '% " + words.slice(-1)[0].toLowerCase().replace(/\'/g, "''") + "' order by (level % " + maxlevel + ") desc limit 1");
		if (contents.length != 0) {
		  for (let i = 0; i < contents[0].values.length; i++) {
			var keyword = contents[0].values[i][2];
			if (words.slice(-keyword.split(" ").length).join(' ')==keyword) {
				var init = words.length > 1 ? words.slice(0, -keyword.split(" ").length).join(' ') : '';		
				if (init.length != 0) {
switch(Math.floor(contents[0].values[i][1])) {
  case 5: //rất
    var phrasalnoun = translatesentence(init, maxlevel);
	if (phrasalnoun.pos[0]==null)
		return [false, null];	
	if (phrasalnoun.pos[0].split(',').includes("Aj")) {
			return [true, {res: contents[0].values[0][0].replace(/\$/g, phrasalnoun.res.join(' ')), pos: "Aj"}];	
	} else {
			return [false, null];	
	}
	break;
  default:
}
       return [true, {res: contents[0].values[i][0].replace(/\$/g, translatesentence(init, maxlevel).res.join(' ')), pos: null}];
				} else {
					return [false, null];
				}
			}
		  }
		} else {
				return [false, null];
		}
	}
}

function searchstart(phrase, maxlevel, prev) {
	const words = phrase.split(" ");	
	var contents = condb3.exec("SELECT viet, id, " + transtable + ", (level % " + maxlevel + ") FROM start" + transtable + " WHERE " + transtable + " = '" + words[0].toLowerCase().replace(/\'/g, "''") + "' order by (level % " + maxlevel + ") desc limit 1");
	if (contents.length != 0) {
		var tail = words.length > 1 ? words.slice(1).join(' ') : '';		
		if (tail.length != 0) {
			var pos = null;			
switch(Math.floor(contents[0].values[0][1])) {
  case 1: //linh
	if (prev == null)
		return [false, null];
    var isANumber = translatesentence(prev, maxlevel).pos[0].split(',').includes("No");
	if (!isANumber)
		return [false, null];
    var phrasalnoun = translatesentence(tail, maxlevel);
	if (phrasalnoun.pos.includes(null))
		return [false, null];	
	if (phrasalnoun.pos.every(str => str.split(',').includes("No"))) {
		if (["ꪙꪳ꪿ꪉ","ꪎꪮꪉ","ꪎꪱꪣ","ꪎꪲ꪿","ꪬ꫁ꪱ","ꪶꪬ꪿ꪀ","ꪹꪊꪸ꪿ꪒ","ꪵꪜꪒ","ꪹꪀ꫁ꪱ"].includes(tail)) {
			contents = condb3.exec("SELECT viet, id, " + transtable + ", (level % " + maxlevel + ") FROM start" + transtable + " WHERE id = 1.0");
		} else {
			contents = condb3.exec("SELECT viet, id, " + transtable + ", (level % " + maxlevel + ") FROM start" + transtable + " WHERE id = 1.1");
		}
		return [true, {res: contents[0].values[0][0].replace(/\$/g, phrasalnoun.res.join(' ')), pos: "No"}];	
	} else {
		return [false, null];
	}
    break;
  default:
}
		} else {
			return [false, null];
		}
	} else {
		return [false, null];
	}
}

function virtualkey(key) {
	virtualtype(key);
	document.getElementById("txtPad").focus();
}