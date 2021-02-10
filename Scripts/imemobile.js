var curtxtPadlength = 0;

function virtualtypemob(key) {
    var value = $("#txtPad").val();
    var start = $("#txtPad")[0].selectionStart;
    var end = $("#txtPad")[0].selectionEnd;
    $("#txtPad").val(value.slice(0, start) + key + value.slice(end));
    $("#txtPad")[0].selectionStart = $("#txtPad")[0].selectionEnd = start + key.length;

    document.getElementById('txtPad').dispatchEvent(new KeyboardEvent('keyup', { 'key': key, 'keyCode': key.charCodeAt(0), 'which': key.charCodeAt(0), 'bubbles': true, 'cancelable': true, 'returnValue': true, 'composed': true }));
}

//keydown mobile
function txtPadKeyDown(evt) {
    
}
//keytype mobile
function txtPadKeyInput(evt) {
    var evtK = evt.keyCode || evt.charCode;
    var rubystr = $("#rubytype").text();
    var curcaret = $("#txtPad")[0].selectionEnd;
    var newtxtPadlength = document.getElementById("txtPad").value.length;
    if ([...$("#rubytype").text()].length >= 12) {
        contail = conqueue = "";
        conlenbuf = 0;
        delList();
        $("#rubytype").html("");
        lentype = 0;
        return;
    }
  if (newtxtPadlength < curtxtPadlength) { //BKSPC
      if (curtxtPadlength - newtxtPadlength > 1) {
          $("#rubytype").html("");
          listUpdate();
          lentype = 0;
          curtxtPadlength = document.getElementById("txtPad").value.length;
          return;
      }
      if (rubystr.length > 0) {
          $("#rubytype").html(rubystr.substring(0, rubystr.length - 1));
          lentype--;
      } else
          lentype = 0;
      listUpdate();
      curtxtPadlength = document.getElementById("txtPad").value.length;
      return;
  }
  if (newtxtPadlength > curtxtPadlength) {
      var evtC = document.getElementById("txtPad").value.substring(curcaret - 1, curcaret);
      if (evtK == 13) {   //ENTER
          $("#rubytype").html("");
          listUpdate();
          lentype = 0;
          curtxtPadlength = document.getElementById("txtPad").value.length;
          return;
      }
      var ind = selectedindex - 1;
      var tonechar = toneNumb(evtC);
      if ((optionlist.length != 0) && !isNaN(parseInt(tonechar)) && (evtC != tonechar)) {   //SHIFT + Num
          var selnum = parseInt(tonechar);
          evt.preventDefault();
          conqueue = contail = "";
          if (selnum == 0) {
              putWord(rubystr);
              curtxtPadlength = document.getElementById("txtPad").value.length;
              return;
          }
          if (optionlist.length >= selnum) {
              if ((selnum > conrSz) && (selnum <= contrSz))
                  conlenbuf = conlentail;
              if (selnum > contrSz)
                  conlenbuf = 0;
              putWord($("#w" + selnum).text());
          } else {
              var txtarea = $("#txtPad").val();
              var caretend = $("#txtPad")[0].selectionEnd;
              $("#txtPad").val(txtarea.substring(0, caretend) + evtC + txtarea.substring(caretend, txtarea.length));
              $("#txtPad")[0].selectionStart = $("#txtPad")[0].selectionEnd = caretend + evtC.length;
              $("#rubytype").html("");
              lentype = 0;
              delList();
          }
          conqueue = contail = "";
          conlenbuf = 0;
          curtxtPadlength = document.getElementById("txtPad").value.length;
          return;
      } else if (evtC == ' ') {    //SPACE
          $("#txtPad").val($("#txtPad").val().substring(0, curcaret - 1) + $("#txtPad").val().substring(curcaret, $("#txtPad").val().length));
          $("#txtPad")[0].selectionStart = $("#txtPad")[0].selectionEnd = curcaret - 1;
          if (optionlist.length == 1) {
              if (isNoSpaceLang(quocngu)) {
                  listUpdate();
              } else {
                  $("#rubytype").html(rubystr + " ");
                  listUpdate();
              }
          }
          if (ind < concSz) {
              if (concSz == conqSz)
                  conqueue = "";
              else
                  conqueue = conqueue + rubystr + " ";
              contail = "";
          } else if (ind < conqSz) {
              conqueue = conqueue + rubystr + " ";
              contail = rubystr + " ";
          } else if (ind < conrSz)
              conqueue = contail = "";
          else if (ind < contcSz) {
              conlenbuf = conlentail;
              if (contcSz == contqSz)
                  conqueue = "";
              else
                  conqueue = contail + rubystr + " ";
              contail = "";
          } else if (ind < contqSz) {
              conlenbuf = conlentail;
              conqueue = contail + rubystr + " ";
              contail = rubystr + " ";
          } else if (ind < contrSz) {
              conlenbuf = conlentail;
              conqueue = contail = "";
          } else {
              conqueue = rubystr + " ";
              contail = "";
              conlenbuf = 0;
          }
          if (optionlist.length != 0) {
              evt.preventDefault();
              conlentmp = $("#w" + selectedindex).text().length;
              putWord($("#w" + selectedindex).text());
          }
          curtxtPadlength = document.getElementById("txtPad").value.length;
          $("#txtPad").focus();
          return;
      } else if ((evtC == '.') || (evtC == ',')) {    //Punctuation
          $("#txtPad").val($("#txtPad").val().substring(0, curcaret - 1) + evtC + $("#txtPad").val().substring(curcaret, $("#txtPad").val().length));
          $("#txtPad")[0].selectionStart = $("#txtPad")[0].selectionEnd = curcaret - 1;
          if ((ind >= conrSz) && (ind < contrSz))
              conlenbuf = conlentail;
          if (ind >= contrSz)
              conlenbuf = 0;
          if (optionlist.length != 0) {
              putWord($("#w" + selectedindex).text());
          }
          conqueue = contail = "";
          conlenbuf = 0;
          lentype = 0;
          $("#txtPad")[0].selectionStart = $("#txtPad")[0].selectionEnd = $("#txtPad")[0].selectionEnd + 1;
          lentype++;
          $("#rubytype").html(typeChar($("#rubytype").text(), evtC));
      } else if (evtK != 8) {
          lentype++;
          $("#rubytype").html(typeChar($("#rubytype").text(), evtC));
      }
      listUpdate();
      curtxtPadlength = document.getElementById("txtPad").value.length;
      return;
  }
}

function rightopt() {
    if (bPgdn) {
        dnPage();
        setSelectedIndex(1);
    }
    if (carpos == -1)
        carpos = $('#txtPad')[0].selectionEnd;
    return;
}
function leftopt() {
    if (bPgup) {
        upPage();
        setSelectedIndex(1);
    }
    if (carpos == -1)
        carpos = $('#txtPad')[0].selectionEnd;
    return;
}
