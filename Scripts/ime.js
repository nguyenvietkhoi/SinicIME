String.prototype.replaceLast = function (search, replace) {
    return this.replace(new RegExp(search + "([^" + search + "]*)$"), replace + "$1");
}

var shiftbool = false;
var opttablelist = [$('#Hannom').val(), $('#Midchinese').val(), $('#Southmin').val(), $('#Eastmin').val(), $('#Hakka').val(), $('#Mandarin').val(), $('#Yue').val(), $('#Wu').val(), $('#Hankor').val(), $('#Japanese').val(), $('#Sawndip').val(), $('#SinoYay').val(), $('#SinoSaek').val(), $('#SinoYang').val(), $('#Tay').val(), $('#SinoThai').val(), $('#SinoLao').val(), $('#SinoTaidam').val(), $('#SinoTaidon').val(), $('#SinoLanna').val(), $('#SinoKhuen').val(), $('#SinoTaiyai').val(), $('#SinoTainuea').val(), $('#SinoTailue').val(), $('#SinoTaiyo').val(), $('#SinoTaipao').val(), $('#SinoAhom').val(), $('#SinoTaideng').val(), $('#SinoNung').val(), $('#Muong').val(), $('#Sukhothai').val(), $('#Kemmun').val(), $('#Iumien').val()];
var kblist = ["E→文", "E→อ", "อ→文"];
var keyboard = 0;
var contents = [];
var condb;
var condb2;
var conlenbuf = 0;
var conlentmp = 0;
var conlentail = 0;
var concSz = 0;
var conqSz = 0;
var conrSz = 0;
var contcSz = 0;
var contqSz = 0;
var contrSz = 0;
var contail = "";
var conqueue = "";

var lentype = 0;
var carpos = -1;
var optionlist = [];
var selectedindex = 0;
var pgBe = 0;
var pgEn = 0;
var bPgup = false;
var bPgdn = false;
var opttable = "rubynom";
var optruby = "ruby";
var optlev = "and level>1";
var sugCB = false;
var quocngu = 0;
var convertdeftext = '<li onclick="convertpad(1,20)"><a>→ 文</a></li><li onclick="tovertical()"><a>' + $('#Vertical').val() + '</a></li>';

var oo = false;
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
//            '../Resources/nomime.jpg',
//            '../Resources/tho.png',
//            '../Scripts/sql.js'
//          ]);
//      })
//    );
//});

// Connect to sqlite db file
var xhr = new XMLHttpRequest();
xhr.open('GET', './Resources/nomime.jpg', true);
xhr.responseType = 'arraybuffer';
xhr.onload = function (e) {
    var uInt8Array = new Uint8Array(this.response);
    condb = new SQL.Database(uInt8Array);
    contents = condb.exec("SELECT word FROM rubynom where ruby='là' ");
    // contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]
    console.log(contents[0].values[0]);
    $("#waitscreen").css({ display: 'none' });
    $("#txtPad").focus();
};
xhr.send();

var xhr2 = new XMLHttpRequest();
xhr2.open('GET', './Resources/proto.jpg', true);
xhr2.responseType = 'arraybuffer';
xhr2.onload = function (e) {
    var uInt8Array = new Uint8Array(this.response);
    condb2 = new SQL.Database(uInt8Array);
    contents = condb2.exec("SELECT ruby FROM ProtoVietic where word='䏧' ");
    // contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]
    console.log(contents[0].values[0]);
};
xhr2.send();

function isNoSpaceLang(qn) {
    return ((qn == 8) || (qn == 9) || (qn == 15) || (qn == 16) || (qn == 19) || (qn == 20) || (qn == 26) || (qn == 30));
}

function virtualtype(key) {
    document.getElementById('txtPad').dispatchEvent(new KeyboardEvent('keydown', { 'key': key, 'keyCode': key.charCodeAt(0), 'charCode': key.charCodeAt(0), 'which': key.charCodeAt(0), 'bubbles': true, 'cancelable': true, 'returnValue': true, 'composed': true }));
    document.getElementById('txtPad').dispatchEvent(new KeyboardEvent('keypress', { 'key': key, 'keyCode': key.charCodeAt(0), 'charCode': key.charCodeAt(0), 'which': key.charCodeAt(0), 'bubbles': true, 'cancelable': true, 'returnValue': true, 'composed': true }));
    if (key != " ") {
        var value = $("#txtPad").val();
        var start = $("#txtPad")[0].selectionStart;
        var end = $("#txtPad")[0].selectionEnd;
        $("#txtPad").val(value.slice(0, start) + key + value.slice(end));
        $("#txtPad")[0].selectionStart = $("#txtPad")[0].selectionEnd = start + key.length;
    }
}

function tovertical() {
    $("#txtPad").css({ 'width': '50%' });
    $("#txtPadout").css({ 'writing-mode': 'vertical-rl' });
    $("#txtPadout").css({ 'display': 'block' });
    $("#copy_button").css({ 'display': 'block' });
    var vertxt = $("#txtPad").val().replace(/\n/g, "<br>").replace(/、/g, "︑").replace(/。/g, "︒").replace(/：/g, "︓").replace(/；/g, "︔").replace(/！/g, "︕").replace(/？/g, "︖").replace(/…/g, "︙");
    $("#txtPadout").html(vertxt);
}

function myCheck(boxclick) {
    var ele;
    switch (boxclick) {
        case 0: ele = $("#borrowings"); break;
        case 1: ele = $("#variants"); break;
        case 2: ele = $("#autocomplete"); break;
        default: break;
    }
    if (ele.hasClass('active'))
        ele.removeClass('active');
    else
        ele.addClass('active');

    optlev = "and level>1";
    if ($("#variants").hasClass('active') && $("#borrowings").hasClass('active'))
        optlev = "";
    else if ($("#variants").hasClass('active') && !$("#borrowings").hasClass('active'))
        optlev = "and level>0";
    else if ($("#borrowings").hasClass('active'))
        optlev = "and (level>1 or level=0)";
    sugCB = $("#autocomplete").hasClass('active');
    $("#txtPad").focus();
}

function opttableselect(tablesel) {
    quocngu = tablesel;
    $("#keyboard").css({ 'font-family': 'Lexend, "Leelawadee UI", Tahoma, "Tai Lanna", "Cambria Tai Yo", "Lanexang Mon4", "Microsoft New Tai Lue", sans-serif, "Tai Son La", TaiViet, "Segoe Ahom Print", "Helvetica Neue", Helvetica, Arial, SimSun, FSung-2, FSung-3, "Malgun Gothic", "BabelStone Han", Sawndip, SimSun-ExtB, SimSun-ExtG, Sukhothai, "Nom Na Tong", "Han-Nom Gothic Supplement"' });
    $("body").css({ 'font-family': 'Lexend, "Leelawadee UI", Tahoma, "Tai Lanna", "Cambria Tai Yo", "Lanexang Mon4", "Microsoft New Tai Lue", sans-serif, "Tai Son La", TaiViet, "Segoe Ahom Print", "Helvetica Neue", Helvetica, Arial, SimSun, FSung-2, FSung-3, "Malgun Gothic", "BabelStone Han", Sawndip, SimSun-ExtB, SimSun-ExtG, Sukhothai, "Nom Na Tong", "Han-Nom Gothic Supplement"' });
    $("#txtPad").css({ 'font-family': 'Cambria, serif, "Tai Lanna", "Cambria Tai Yo", "Leelawadee UI", Tahoma, "Lanexang Mon4", "Microsoft New Tai Lue", sans-serif, "Tai Son La", TaiViet, "Segoe Ahom Print", "Helvetica Neue", Helvetica, Arial, SimSun, FSung-2, FSung-3, "Malgun Gothic", "BabelStone Han", Sawndip, SimSun-ExtB, SimSun-ExtG, Sukhothai, "Nom Na Tong", "Han-Nom Gothic Supplement"' });
    $("#txtPadout").css({ 'font-family': 'Cambria, serif, "Tai Lanna", "Cambria Tai Yo", "Leelawadee UI", Tahoma, "Lanexang Mon4", "Microsoft New Tai Lue", sans-serif, "Tai Son La", TaiViet, "Segoe Ahom Print", "Helvetica Neue", Helvetica, Arial, SimSun, SimSun-ExtB, SimSun-ExtG, "Malgun Gothic", "BabelStone Han", Sawndip, Sukhothai, "Nom Na Tong", "Han-Nom Gothic Supplement"' });
    switch (quocngu) {
        case 1: opttable = "rubytriung";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="proto(\'OldChinese\')"><a>Old Chinese</a></li>' +
			'<li onclick="convertpad(0,20)"><a>→ abc</a></li>' + convertdeftext);
            break;
        case 2: opttable = "rubyhok";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>'+$("#Taipei").val()+'</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>→ abc</a></li>' + convertdeftext);
            break;
        case 3: opttable = "rubyfoo";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>→ abc</a></li>' + convertdeftext);
            break;
        case 4: opttable = "rubyhakk";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>→ abc</a></li>' + convertdeftext);
            break;
        case 5: opttable = "rubymand";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>'+$("#Beijing").val()+'</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>→ abc</a></li>' + convertdeftext);
            break;
        case 6: opttable = "rubycant";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>'+$("#HongKong").val()+'</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>→ abc</a></li>' + convertdeftext);
            break;
        case 7: opttable = "rubysou";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>→ abc</a></li>' + convertdeftext);
            break;
        case 8: opttable = "rubykor";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>'+$("#Seoul").val()+'</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>文 → 한</a></li>' + convertdeftext);
            break;
        case 9: opttable = "rubyjap";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>'+$("#Tokyo").val()+'</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>文 → かな</a></li>' + convertdeftext);
            break;
        case 10: opttable = "rubycuen";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,14)"><a>→ abc: ' + $("#NungAn").val() + '</a></li>' +
                '<li onclick="convertpad(0,10)"><a>→ abc: ' + $("#WuMing").val() + '</a></li>' + convertdeftext);
            break;
        case 29: opttable = "rubymol";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>→ abc</a></li>' + convertdeftext);
            break;
        case 30: opttable = "rubysukho";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="proto(\'ProtoTai\')"><a>Proto-Tai</a></li>' +
			'<li onclick="convertpad(0,20)"><a>→ abc</a></li>' + convertdeftext);
            break;
        case 31: opttable = "rubymun";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>→ abc</a></li>' + convertdeftext);
            break;
        case 32: opttable = "rubymien";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>→ abc</a></li>' + convertdeftext);
            break;
        case 2: opttable = "rubyhok";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>' + $("#Taipei").val() + '</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>→ abc</a></li>' + convertdeftext);
            break;
        case 11: opttable = "rubyyay";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>→ abc: ' + $("#Sapa").val() + '</a></li>' +
                '<li onclick="convertpad(0,15)"><a>→ abc: ' + $("#WeangzMox").val() + '</a></li>' + convertdeftext);
            break;
        case 12: opttable = "rubysaek";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>→ abc</a></li>' + convertdeftext);
            break;
        case 13: opttable = "rubyyang";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,10)"><a>→ abc: ' + $("#NungDin").val() + '</a></li>' +
                '<li onclick="convertpad(0,14)"><a>→ abc: ' + $("#Debao").val() + '</a></li>' + convertdeftext);
            break;
        case 28: opttable = "rubynung";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,11)"><a>→ abc: ' + $("#NungMin").val() + '</a></li>' +
                '<li onclick="convertpad(0,15)"><a>→ abc: ' + $("#NungLoi").val() + '</a></li>' +
                '<li onclick="convertpad(0,11)"><a>→ abc: ' + $("#NungFS").val() + '</a></li>' +
                '<li onclick="convertpad(0,12)"><a>→ abc: ' + $("#NungChao").val() + '</a></li>' +
                '<li onclick="convertpad(0,14)"><a>→ abc: ' + $("#NungInh").val() + '</a></li>' + convertdeftext);
            break;
        case 14: opttable = "rubytay";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="logo2ipa(\'HoaAn\',20)"><a>IPA: ' + $("#HoaAn").val() + '</a></li>' + '<li onclick="logo2ipa(\'CoXau\',20)"><a>IPA: ' + $("#CoXau").val() + '</a></li>' + '<li onclick="logo2ipa(\'PhjaGha\',20)"><a>IPA: ' + $("#PhjaGha").val() + '</a></li>' +
                '<li onclick="logo2roman(20)"><a>→ dha̤y</a></li>' +
                '<li onclick="convertpad(0,12)"><a>→ tày: ' + $("#BaoYen").val() + '</a></li>' +
                '<li onclick="convertpad(0,20)"><a>→ tày: ' + $("#CaoBang").val() + '</a></li>' + convertdeftext);
            break;
        case 15: opttable = "rubythai";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>' + $("#Bangkok").val() + '</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>文 → ท</a></li>' + convertdeftext);
            break;
        case 16: opttable = "rubylao";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>' + $("#Vientiane").val() + '</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>文 → ທ</a></li>' + convertdeftext);
            break;
        case 17: opttable = "rubytaidam";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="logo2ipa(\'SonLa\',20)"><a>IPA: ' + $("#SonLa").val() + '</a></li>' +
                '<li onclick="logo2roman(20)"><a>→ abc</a></li>' +
                '<li onclick="roma2phone()"><a>abc → ꪕ</a></li>' +
                '<li onclick="convertpad(0,20)"><a>文 → ꪕ</a></li>' + convertdeftext);
            break;
        case 18: opttable = "rubytaidon";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="logo2ipa(\'MuongLay\',20)"><a>IPA: ' + $("#MuongLay").val() + '</a></li>' +
                '<li onclick="logo2roman(20)"><a>→ abc</a></li>' +
                '<li onclick="roma2phone()"><a>abc → ꪕ</a></li>' +
                '<li onclick="convertpad(0,20)"><a>文 → ꪕ</a></li>' + convertdeftext);
            $("body").css({ 'font-family': $("body").css('font-family').replace("Tai Son La", "Muong So Cursive") });
            $("#keyboard").css({ 'font-family': $("#keyboard").css('font-family').replace("Tai Son La", "Muong So Cursive") });
            $("#txtPad").css({ 'font-family': $("#txtPad").css('font-family').replace("Tai Son La", "Muong So Cursive") });
            $("#txtPadout").css({ 'font-family': $("#txtPadout").css('font-family').replace("Tai Son La", "Muong So Cursive") });
            break;
        case 19: opttable = "rubylanna";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>文 → ᨴ</a></li>' + convertdeftext);
            break;
        case 20: opttable = "rubykhuen";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>文 → ᨴ</a></li>' + convertdeftext);
            $("body").css({ 'font-family': $("body").css('font-family').replace("Tai Lanna", "Tai Khuen") });
            $("#keyboard").css({ 'font-family': $("#keyboard").css('font-family').replace("Tai Lanna", "Tai Khuen") });
            $("#txtPad").css({ 'font-family': $("#txtPad").css('font-family').replace("Tai Lanna", "Tai Khuen") });
            $("#txtPadout").css({ 'font-family': $("#txtPadout").css('font-family').replace("Tai Lanna", "Tai Khuen") });
            break;
        case 21: opttable = "rubytaiyai";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>文 → တ</a></li>' + convertdeftext);
            break;
        case 22: opttable = "rubytainuea";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="logo2ipa(\'MangShi\',20)"><a>IPA: ' + $("#MangShi").val() + '</a></li>' +
                '<li onclick="logo2roman(20)"><a>→ abc</a></li>' +
                '<li onclick="roma2phone()"><a>abc → ᥖ</a></li>' +
                '<li onclick="convertpad(0,20)"><a>文 → ᥖ</a></li>' + convertdeftext);
            break;
        case 23: opttable = "rubytailue";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="logo2ipa(\'PanNa\',20)"><a>IPA: ' + $("#PanNa").val() + '</a></li>' +
                '<li onclick="logo2roman(20)"><a>→ abc</a></li>' +
                '<li onclick="roma2phone()"><a>abc → ᦑ</a></li>' +
                '<li onclick="convertpad(0,20)"><a>文 → ᦑ</a></li>' + convertdeftext);
            break;
        case 24: opttable = "rubytaiyo";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="logo2ipa(\'QuyChau\',20)"><a>IPA: ' + $("#QuyChau").val() + '</a></li>' + '<li onclick="logo2ipa(\'ChauLi\',20)"><a>IPA: ' + $("#ChauLi").val() +
                '<li onclick="logo2roman(20)"><a>→ abc</a></li>' +
                '<li onclick="roma2phone()"><a>abc → 𞛍</a></li>' +
                '<li onclick="convertpad(0,20)"><a>文 → 𞛍</a></li>' + convertdeftext);
            break;
        case 25: opttable = "rubytaipao";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="logo2ipa(\'TuongDuong\',20)"><a>IPA: ' + $("#TuongDuong").val() + '</a></li>' +
                '<li onclick="logo2roman(20)"><a>→ abc</a></li>' +
                '<li onclick="roma2phone()"><a>abc → 𕉥</a></li>' +
                '<li onclick="convertpad(0,20)"><a>文 → 𕉥</a></li>' + convertdeftext);
            break;
        case 26: opttable = "rubyahom";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="convertpad(0,20)"><a>文 → 𑜄</a></li>' + convertdeftext);
            break;
        case 27: opttable = "rubytaideng";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>N/A</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="logo2ipa(\'MuongDaeng\',20)"><a>IPA: ' + $("#MuongDaeng").val() + '</a></li>' +
                '<li onclick="logo2roman(20)"><a>→ abc</a></li>' +
                '<li onclick="roma2phone()"><a>abc → ꪕ</a></li>' +
                '<li onclick="convertpad(0,20)"><a>文 → ꪕ</a></li>' + convertdeftext);
            $("body").css({ 'font-family': $("body").css('font-family').replace("Tai Son La", "Tai Muong Deng") });
            $("#keyboard").css({ 'font-family': $("#keyboard").css('font-family').replace("Tai Son La", "Tai Muong Deng") });
            $("#txtPad").css({ 'font-family': $("#txtPad").css('font-family').replace("Tai Son La", "Tai Muong Deng") });
            $("#txtPadout").css({ 'font-family': $("#txtPadout").css('font-family').replace("Tai Son La", "Tai Muong Deng") });
            break;
        case 0:
        default: opttable = "rubynom";
            document.getElementById('accentspeak').innerHTML = ('<li onclick="speakpad(' + quocngu + ',20)"><a>'+$("#HaNoi").val()+'</a></li>');
            document.getElementById('accentipa').innerHTML = ('<li onclick="proto(\'ProtoVietic\')"><a>Proto-Vietic</a></li>' +
			'<li onclick="logo2ipa(\'HaNoi\',20)"><a>IPA: ' + $("#HaNoi").val() + '</a></li>' +
                '<li onclick="logo2ipa(\'NamDinh\',20)"><a>IPA: ' + $("#NamDinh").val() + '</a></li>' +
                '<li onclick="logo2ipa(\'Vinh\',20)"><a>IPA: ' + $("#Vinh").val() + '</a></li>' +
                '<li onclick="logo2ipa(\'QuangNam\',20)"><a>IPA: ' + $("#QuangNam").val() + '</a></li>' +
                '<li onclick="logo2ipa(\'BinhDinh\',20)"><a>IPA: ' + $("#BinhDinh").val() + '</a></li>' +
                '<li onclick="logo2ipa(\'SaiGon\',20)"><a>IPA: ' + $("#SaiGon").val() + '</a></li>' +
                '<li onclick="convertpad(0,20)"><a>→ abc</a></li>' + convertdeftext);
            break;
    }
    loadkeyboard();
    $("#opttablename").html(opttablelist[tablesel]);
    $("#txtPad").focus();
}

function optkeyboard(kbsel) {
    keyboard = kbsel;
    $("#kbname").html(kblist[kbsel]);
    loadkeyboard();
    $("#txtPad").focus();
}

//keydown
function txtPadKeyPressed(evt) {
    var evtK = evt.keyCode || evt.charCode;
    if ((evtK == 17) || (evtK == 27) || ([...$("#rubytype").text()].length >= 12)) { //CTRL or ESC
        contail = conqueue = "";
        conlenbuf = 0;
        delList();
        $("#rubytype").html("");
        lentype = 0;
        return;
    }
    // SHIFT
    if (evtK == 16) {
        if (!shiftbool) {
            shiftbool = true;
            var ind = selectedindex;
            if (ind > 0) {
                selExample($("#w" + ind).text(), $("#rubytype").text());
                return;
            }
            var selstart = $("#txtPad")[0].selectionStart;
            var selend = $("#txtPad")[0].selectionEnd;
            var subtxt = $('#txtPad').val().substring(selstart, selend);
            if (subtxt.length > 0)
                $("#example").html("<table><tr><td>" + logo2phon(subtxt, false, 20) + "</td></tr></table>");
        }
    }

    if (optionlist.length != 0) {
        if (evtK == 38) {   //UP
            var ind = selectedindex;
            if (ind > 0) {
                if (bPgup && (ind == 1)) {
                    upPage();
                    setSelectedIndex(9);
                    if (carpos == -1)
                        carpos = $('#txtPad')[0].selectionEnd;
                    return;
                }
                setSelectedIndex(ind - 1);
                if (carpos == -1)
                    carpos = $('#txtPad')[0].selectionEnd;
                return;
            } else
                console.log("alert!!");
        }
        if (evtK == 40) {   //DOWN
            var ind = selectedindex;
            if (ind > 0) {
                if (bPgdn && (ind == 9)) {
                    dnPage();
                    setSelectedIndex(1);
                    if (carpos == -1)
                        carpos = $('#txtPad')[0].selectionEnd;
                    return;
                }
                setSelectedIndex(ind + 1);
                if (carpos == -1)
                    carpos = $('#txtPad')[0].selectionEnd;
                return;
            } else
                console.log("alert!!");
        }
        if (evtK == 39) { //RIGHT
            if (bPgdn) {
                dnPage();
                setSelectedIndex(1);
            }
            if (carpos == -1)
                carpos = $('#txtPad')[0].selectionEnd;
            return;
        }
        if (evtK == 37) { //LEFT
            if (bPgup) {
                upPage();
                setSelectedIndex(1);
            }
            if (carpos == -1)
                carpos = $('#txtPad')[0].selectionEnd;
            return;
        }
    } else {
        if ((evtK >= 37) && (evtK <= 40)) {
            contail = conqueue = "";
            conlenbuf = 0;
            delList();
            $("#rubytype").html("");
            lentype = 0;
            return;
        }
    }

    var rubystr = $("#rubytype").text();
    var utf = 1;
    var rt = rubystr.charCodeAt(rubystr.length - 1);
    if ((rt >= 0xD800) && (rt <= 0xDFFF))
        utf = 2;
    if (evtK == 8) {    //BKSPC
        if (rubystr.length > 0) {
            $("#rubytype").html(rubystr.substring(0, rubystr.length - utf));
            lentype--;
        } else
            lentype = 0;
        listUpdate();
    }

}

//keytype
function txtPadKeyTyped(evt) {
    var evtK = evt.keyCode || evt.charCode;
    var evtC = String.fromCharCode(evtK);
    var rubystr = $("#rubytype").text();
    if (evtK == 13) {   //ENTER
        $("#rubytype").html("");
        listUpdate();
        lentype = 0;
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
        return;
    } else if (evtK == 32) {    //SPACE
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
        $("#txtPad").focus();
        return;
    } else if (((evtK > 31) && (evtK < 39)) || ((evtK > 39) && (evtK < 48)) || ((evtK > 57) && (evtK < 65)) || ((evtK > 90) && (evtK < 96)) || ((evtK > 122) && (evtK < 127))) {    //Punctuation
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
        lentype++;
        $("#rubytype").html(typeChar($("#rubytype").text(), evtC));
    } else if (evtK != 8) {
        lentype++;
        $("#rubytype").html(typeChar($("#rubytype").text(), evtC));
    }
    listUpdate();
    
}

//keyup
function txtPadKeyReleased(evt) {
    $("#example").html("<table><tr><td>"+$("#DictGuide").val()+"</td></tr></table>");
    if (carpos != -1) {
        $('#txtPad')[0].selectionStart = carpos;
        $('#txtPad')[0].selectionEnd = carpos;
        carpos = -1;
    }
    var evtK = evt.keyCode || evt.charCode;
    if (evtK == 16)
        shiftbool = false;
}

function putWord(instr) {
    var txtarea = $("#txtPad").val();
    $("#txtPad")[0].selectionStart = $("#txtPad")[0].selectionEnd - lentype - conlenbuf;
    var caretbeg = $("#txtPad")[0].selectionStart;
    var caretend = $("#txtPad")[0].selectionEnd;
    $("#txtPad").val(txtarea.substring(0, caretbeg) + instr + txtarea.substring(caretend, txtarea.length));
    conlenbuf = 0;
    $("#txtPad")[0].selectionStart = $("#txtPad")[0].selectionEnd = caretbeg + instr.length;
    $("#rubytype").html("");
    lentype = 0;
    delList();
}

function upPage() {
    pgEn = pgBe;
    pgBe -= 9;
    conqSz += 9;
    concSz += 9;
    conrSz += 9;
    contqSz += 9;
    contcSz += 9;
    contrSz += 9;
    bPgdn = true;
    if (pgBe == 0) {
        bPgup = false;
        bPgdn = true;
    }
    var optionsublist = optionlist.slice(pgBe, pgEn);
    var i;
    for (i = 1; i <= 9; i++) {
        $("#w" + i).html(optionsublist[i - 1]);
    }
}

function dnPage() {
    pgBe += 9;
    conqSz -= 9;
    concSz -= 9;
    conrSz -= 9;
    contqSz -= 9;
    contcSz -= 9;
    contrSz -= 9;
    bPgup = true;
    var optionsublist;
    var i;
    if (optionlist.length > (9 + pgBe)) {
        pgEn = pgBe + 9;
        optionsublist = optionlist.slice(pgBe, pgEn);
        for (i = 1; i <= 9; i++) {
            $("#w" + i).html(optionsublist[i - 1]);
        }
    } else {
        pgEn = optionlist.length;
        bPgdn = false;
        optionsublist = optionlist.slice(pgBe, pgEn);
        var listsize = pgEn - pgBe;
        whitelist();
        for (i = 1; i <= listsize; i++) {
            $("#w" + i).html(optionsublist[i - 1]);
        }
    }
}

//Parse selRuby results from db to optionlist
function addSelRuby(ruby) {
    var cubo = [];
    if (keyboard == 1) {
        cubo.push(ruby);
        optionlist = optionlist.concat(cubo);
        return;
    }

    if (ruby == ".") {
        cubo.push("。");
        cubo.push("．");
        cubo.push("：");
        cubo.push("？");
        cubo.push("…");
        cubo.push(ruby);
        optionlist = optionlist.concat(cubo);
        return;
    }

    if (ruby == ",") {
        cubo.push("、");
        cubo.push("，");
        cubo.push("；");
        cubo.push("！");
        cubo.push("　");
        cubo.push(ruby);
        optionlist = optionlist.concat(cubo);
        return;
    }

    contents = condb.exec("SELECT word FROM " + opttable + " WHERE " + optruby + " = '" + ruby.replace(/\'/g, "''").toLowerCase() + "' " + optlev + " order by level desc");
    if (contents.length != 0) {
        var i = 0;
        for (i = 0; i < contents[0].values.length; i++) {
            cubo.push(contents[0].values[i]);
        }
    }

    if (sugCB) {
        contents = condb.exec("select word, ruby from " + opttable + " where " + optruby + " like '" + ruby.replace(/\'/g, "''").toLowerCase() + "%' and " + optruby + "!='" + ruby + "' " + optlev + "");
        if (contents.length != 0) {
            if (cubo.length > 0)
                cubo.push(ruby);
            for (i = 0; i < contents[0].values.length; i++) {
                cubo.push(contents[0].values[i][0] + ' ' + contents[0].values[i][1]);
            }
        }
    }

    cubo.push(ruby);
    optionlist = optionlist.concat(cubo);
}

//Parse selCompound results from db to optionlist
function addSelCompound(ruby) {
    if ((conqueue == "") || (keyboard == 1))
        return;
    var optta = opttable;
    var cruby = conqueue + ruby;
    var csize = cruby.split(" ").length;
    contents = condb.exec("SELECT cword, c" + optta + " FROM cmpnom WHERE c" + optta + " = '" + cruby.replace(/\'/g, "''") + "'");
    var split = null;
    var cubo = [];
    var i, j;
    var xstr = "";
    if (contents.length != 0) {
        for (i = 0; i < contents[0].values.length; i++) {
            split = contents[0].values[i][0].split(":");
            xstr = "";
            for (j = 0; j != csize; j++)
                xstr += split[j];
            cubo.push(xstr);
            conlenbuf = conlentmp;
        }
    }
    
    conqSz = conrSz = concSz = cubo.length;
    contents = condb.exec("SELECT cword, c" + optta + " FROM cmpnom WHERE c" + optta + " like '" + cruby.replace(/\'/g, "''") + " %'");
    xstr = "";
    split = null;
    var rubo = [];
    if (contents.length != 0) {
        for (i = 0; i < contents[0].values.length; i++) {
            split = contents[0].values[i][0].split(":");
            xstr = "";
            for (j = 0; j != split.length; j++)
                xstr += split[j];
            rubo.push(xstr);
            conlenbuf = conlentmp;
        }
    }
    if (split != null) {
        xstr = "";
        for (i = 0; i != csize; i++)
            xstr += split[i];
        conlentail = split[i-1].length;
        cubo.push(xstr);
        cubo = cubo.concat(rubo);
        conqSz++;
        conrSz = cubo.length;
    }
    tqSz = trSz = tcSz = cubo.length;

    if (contail != "") {
        var truby = contail + ruby;
        var tsize = truby.split(" ").length;
        contents = condb.exec("SELECT cword, c" + optta + " FROM cmpnom WHERE c" + optta + " = '" + truby.replace(/\'/g, "''") + "'");
        if (contents.length != 0) {
            for (i = 0; i < contents[0].values.length; i++) {
                split = contents[0].values[i][0].split(":");
                xstr = "";
                for (j = 0; j != tsize; j++)
                    xstr += split[j];
                cubo.push(xstr);
                conlenbuf = conlentmp;
            }
        }
        tqSz = trSz = tcSz = cubo.length;
        contents = condb.exec("SELECT cword, c" + optta + " FROM cmpnom WHERE c" + optta + " like '" + truby.replace(/\'/g, "''") + " %'");
        xstr = "";
        split = null;
        rubo = [];
        if (contents.length != 0) {
            for (i = 0; i < contents[0].values.length; i++) {
                split = contents[0].values[i][0].split(":");
                xstr = "";
                for (j = 0; j != split.length; j++)
                    xstr += split[j];
                rubo.push(xstr);
                conlenbuf = conlentmp;
            }
        }

        if (split != null) {
            xstr = "";
            for (i = 0; i != csize; i++)
                xstr += split[i];
            conlentail = split[i - 1].length;
            cubo.push(xstr);
            cubo = cubo.concat(rubo);
            contqSz++;
            contrSz = cubo.length;
        }
    }
    optionlist = optionlist.concat(cubo);
}

function convertpad(direction, maxlevel) {
    var convtxt = "";
    switch (direction) {
        case 0:
            convtxt = logo2phon($("#txtPad").val(), true, maxlevel);
            break;
        case 1:
            convtxt = phon2logo($("#txtPad").val(), maxlevel);
            break;
        default: break;
    }
    if (convtxt.length > 0) {
        $("#txtPad").css({ 'width': '50%' });
        $("#txtPadout").css({ 'writing-mode': 'horizontal-tb' });
        $("#txtPadout").css({ 'display': 'block' });
        $("#txtPadout").html(convtxt.replace(/\n/g, " <br> "));
		$("#copy_button").css({ 'display': 'block' });
    } else {
        offpad();
    }
}

function logo2ipa(accent, maxlevel) {
    var phrase = "";
    var convtxt = "";
    var ipaword;
    phrase = logo2phon($("#txtPad").val().toLowerCase(), false, maxlevel);

    if (phrase.length > 0) {
        phrase = phrase.replace(/\./g, " | ");
        phrase = phrase.replace(/,/g, " | ");
        phrase = phrase.replace(/:/g, " | ");
        phrase = phrase.replace(/;/g, " | ");
        phrase = phrase.replace(/\//g, " / ");
        phrase = phrase.replace(/\?/g, " ? ");
        phrase = phrase.replace(/!/g, " ! ");
        phrase = phrase.replace(/\t/g, " \t ");
        phrase = phrase.replace(/\n/g, " \n ");
        phrase = phrase.replace(/\r/g, " \r ");
        phrase = phrase.replace(/  /g, " ");
        var word = phrase.split(" ");
        var prespace = "";
        for (var i = 0; i < word.length; i++) {
            if (i > 0)
                prespace = " ";
            if ("|/?!\t\n\r".includes(word[i]))
                convtxt += prespace + word[i];
            else {
                switch (accent) {
                    case 'HoaAn': case 'CoXau': case 'PhjaGha':
                        ipaword = TayIPA(word[i], accent);
                        convtxt += (prespace + ipaword.onset + ipaword.rime + ipaword.tone);
                        break;
                    case 'HaNoi': case 'NamDinh': case 'Vinh': case 'QuangNam': case 'BinhDinh': case 'SaiGon':
                        ipaword = VietIPA(word[i], accent);
                        convtxt += (prespace + ipaword.onset + ipaword.rime + ipaword.tone);
                        break;
                    case 'MuongLay':
                        ipaword = TaiDonIPA(word[i], accent);
                        convtxt += (prespace + ipaword);
                        break;
                    case 'MuongDaeng':
                        ipaword = TaiDaengIPA(word[i], accent);
                        convtxt += (prespace + ipaword);
                        break;
                    case 'SonLa':
                        ipaword = TaiDamIPA(word[i], accent);
                        convtxt += (prespace + ipaword);
                        break;
                    case 'MangShi':
                        ipaword = TaiNueaIPA(word[i], accent);
                        convtxt += (prespace + ipaword);
                        break;
                    case 'PanNa':
                        ipaword = TaiLueIPA(word[i], accent);
                        convtxt += (prespace + ipaword);
                        break;
                    case 'QuyChau': case 'ChauLi':
                        ipaword = TaiYoIPA(word[i], accent);
                        convtxt += (prespace + ipaword);
                        break;
                    case 'TuongDuong':
                        ipaword = TaiPaoIPA(word[i], accent);
                        convtxt += (prespace + ipaword);
                        break;
                    default: break;
                }
            }
        }
        convtxt
        $("#txtPad").css({ 'width': '50%' });
        $("#txtPadout").css({ 'writing-mode': 'horizontal-tb' });
        $("#txtPadout").css({ 'display': 'block' });
		$("#copy_button").css({ 'display': 'block' });
        $("#txtPadout").html(convtxt.replace(/\n/g, "<br>").replace(/\r/g, "<br>"));
    } else {
        offpad();
    }
}

function logo2roman(maxlevel) {
    var phrase = "";
    var convtxt = "";
    var ipaword;
    phrase = logo2phon($("#txtPad").val(), false, maxlevel);

    if (phrase.length > 0) {
        phrase = phrase.replace(/\./g, " | ");
        phrase = phrase.replace(/,/g, " | ");
        phrase = phrase.replace(/:/g, " | ");
        phrase = phrase.replace(/;/g, " | ");
        phrase = phrase.replace(/\//g, " / ");
        phrase = phrase.replace(/\?/g, " ? ");
        phrase = phrase.replace(/!/g, " ! ");
        phrase = phrase.replace(/\t/g, " \t ");
        phrase = phrase.replace(/\n/g, " \n ");
        phrase = phrase.replace(/\r/g, " \r ");
        phrase = phrase.replace(/  /g, " ");
        var word = phrase.split(" ");
        var prespace = "";
        for (var i = 0; i < word.length; i++) {
            if (i > 0)
                prespace = " ";
            if ("|/?!\t\n\r".includes(word[i]))
                convtxt += prespace + word[i];
            else {
                switch (quocngu) {
                    case 14:
                        ipaword = TayIPA(word[i].toLowerCase(), "roman");
                        convtxt += (prespace + ipaword);
                        break;
                    case 17:
                        ipaword = TaiDamIPA(word[i], "roman");
                        convtxt += (prespace + ipaword);
                        break;
                    case 18:
                        ipaword = TaiDonIPA(word[i], "roman");
                        convtxt += (prespace + ipaword);
                        break;
                    case 22:
                        ipaword = TaiNueaIPA(word[i], "roman");
                        convtxt += (prespace + ipaword);
                        break;
                    case 27:
                        ipaword = TaiDaengIPA(word[i], "roman");
                        convtxt += (prespace + ipaword);
                        break;
                    case 23:
                        ipaword = TaiLueIPA(word[i], "roman");
                        convtxt += (prespace + ipaword);
                        break;
                    case 24:
                        ipaword = TaiYoIPA(word[i], "roman");
                        convtxt += (prespace + ipaword);
                        break;
                    case 25:
                        ipaword = TaiPaoIPA(word[i], "roman");
                        convtxt += (prespace + ipaword);
                        break;
                    default: break;
                }
            }
        }

        $("#txtPad").css({ 'width': '50%' });
        $("#txtPadout").css({ 'writing-mode': 'horizontal-tb' });
        $("#txtPadout").css({ 'display': 'block' });
		$("#copy_button").css({ 'display': 'block' });
        $("#txtPadout").html(convtxt.replace(/\n/g, "<br>").replace(/\r/g, "<br>"));
    } else {
        offpad();
    }
}

function focuspad() {
    if ($("#txtPadout").html() == "") {
        offpad();
    }
}

function offpad() {
        $("#txtPadout").css({ 'display': 'none' });
        $("#txtPadout").css({ 'writing-mode': 'horizontal-tb' });
		$("#copy_button").css({ 'display': 'none' });
        $("#txtPad").css({ 'width': '100%' });
}
function proto(language) {
    var phrase = $("#txtPad").val();
    if (phrase == "")
        return "";
	
    var outputarr = [];
    var sss = "";
    var word = phrase;
    var k;
    var sql = "";
    var fullchar;


    for (k = 0; k != word.length; k++) {
        if ((word[k].charCodeAt(0) < 0xD800) || (word[k].charCodeAt(0) >= 0xE000)) {
            fullchar = word[k];
        } else {
            fullchar = word[k] + word[k + 1];
            k++;
        }


        sql = "select ruby from " + language + " where word='" + fullchar+"'";
        contents = condb2.exec(sql);
        if (contents.length != 0) {
            sss = contents[0].values[0][0];
                for (q = 1; q < contents[0].values.length; q++) {
                    sss = sss + "/" + contents[0].values[q][0];
                }
        }

        {
            if (sss.length > 0)
                outputarr.push(sss);
            else
                outputarr.push("$" + fullchar);
        }
        sss = "";
    }
	
    var i;
    var ttt;
    ttt = outputarr[0].replace(/\$/g, "");
    for (i = 1; i < outputarr.length; i++) {
        var nextword = "";
        nextword = outputarr[i];
        
        if (nextword.startsWith('$')) {
            nextword = outputarr[i].substring(1);
            if (("。、，：；？！…".includes(nextword)) && (quocngu != 24)) {
                nextword = nextword.replace(/。/g, ".");
                nextword = nextword.replace(/、/g, ",");
                nextword = nextword.replace(/：/g, ":");
                nextword = nextword.replace(/；/g, ";");
                nextword = nextword.replace(/？/g, "?");
                nextword = nextword.replace(/！/g, "!");
                nextword = nextword.replace(/，/g, ",");
                if ((nospace) && (isNoSpaceLang(quocngu)))
                    nextword += " ";
            }
            ttt = ttt + nextword;
        } else if (ttt.slice(-1) == "\n")
            ttt = ttt + nextword;
        else
            ttt = ttt + " " + nextword;
    }
    if (ttt.length > 0) {
        $("#txtPad").css({ 'width': '50%' });
        $("#txtPadout").css({ 'writing-mode': 'horizontal-tb' });
        $("#txtPadout").css({ 'display': 'block' });
        $("#txtPadout").html(ttt.replace(/\n/g, " <br> "));
		$("#copy_button").css({ 'display': 'block' });
    } else {
        offpad();
    }
}
function logo2phon(pad, nospace, maxlevel) {
    if (pad == "")
        return "";
    var cubo = selPhone(pad, maxlevel, true);
    var i;
    var ttt;
    ttt = cubo[0].replace(/\$/g, "");
    for (i = 1; i < cubo.length; i++) {
        var nextword = "";
        nextword = cubo[i];
        
        if (nextword.startsWith('$')) {
            nextword = cubo[i].substring(1);
            if (("。、，：；？！…".includes(nextword)) && (quocngu != 24)) {
                nextword = nextword.replace(/。/g, ".");
                nextword = nextword.replace(/、/g, ",");
                nextword = nextword.replace(/：/g, ":");
                nextword = nextword.replace(/；/g, ";");
                nextword = nextword.replace(/？/g, "?");
                nextword = nextword.replace(/！/g, "!");
                nextword = nextword.replace(/，/g, ",");
                if ((nospace) && (isNoSpaceLang(quocngu)))
                    nextword += " ";
            }
            ttt = ttt + nextword;
        } else if ((nospace) && (isNoSpaceLang(quocngu))) {
            ttt = ttt + nextword;
        }
        else if (ttt.slice(-1) == "\n")
            ttt = ttt + nextword;
        else
            ttt = ttt + " " + nextword;
    }
    return ttt;
}

function roma2phone() {
    var phrase = $("#txtPad").val().toLowerCase();
    var convtxt = "";
    var ipaword;

    if (phrase.length > 0) {
        phrase = phrase.replace(/\./g, " . ");
        phrase = phrase.replace(/,/g, " , ");
        phrase = phrase.replace(/:/g, " : ");
        phrase = phrase.replace(/;/g, " ; ");
        phrase = phrase.replace(/\//g, " / ");
        phrase = phrase.replace(/\?/g, " ? ");
        phrase = phrase.replace(/!/g, " ! ");
        phrase = phrase.replace(/\t/g, " \t ");
        phrase = phrase.replace(/\n/g, " \n ");
        phrase = phrase.replace(/\r/g, " \r ");
        phrase = phrase.replace(/  /g, " ");
        var word = phrase.split(" ");
        var prespace = "";
        for (var i = 0; i < word.length; i++) {
            if (i > 0)
                prespace = " ";
            if ("|/?!\t\n\r".includes(word[i]))
                convtxt += prespace + word[i];
            else {
                switch (quocngu) {
                    case 17:
                        ipaword = TaiDamRoma(word[i]);
                        convtxt += (prespace + ipaword);
                        break;
                    case 18:
                        ipaword = TaiDonRoma(word[i]);
                        convtxt += (prespace + ipaword);
                        break;
                    case 22:
                        ipaword = TaiNueaRoma(word[i]);
                        convtxt += (prespace + ipaword);
                        break;
                    case 27:
                        ipaword = TaiDaengRoma(word[i]);
                        convtxt += (prespace + ipaword);
                        break;
                    case 23:
                        ipaword = TaiLueRoma(word[i]);
                        convtxt += (prespace + ipaword);
                        break;
                    case 24:
                        ipaword = TaiYoRoma(word[i]);
                        convtxt += (prespace + ipaword);
                        break;
                    case 25:
                        ipaword = TaiPaoRoma(word[i]);
                        convtxt += (prespace + ipaword);
                        break;
                    default: break;
                }
            }
        }
        convtxt
        $("#txtPad").css({ 'width': '50%' });
        $("#txtPadout").css({ 'writing-mode': 'horizontal-tb' });
        $("#txtPadout").css({ 'display': 'block' });
		$("#copy_button").css({ 'display': 'block' });
        $("#txtPadout").html(convtxt.replace(/\n/g, "<br>").replace(/\r/g, "<br>"));
    } else {
        offpad();
    }
}

function phon2logo(pad, maxlevel) {
    if (pad == "")
        return "";
    var cubo = selChar(pad, maxlevel, true);
    var i;
    var ttt = cubo[0];
    for (i = 1; i < cubo.length; i++) {
        ttt = ttt + cubo[i];
    }
    return ttt;
}

function selPhone(phrase, maxlevel, defa){
    var ext = !defa;
    if ((phrase.length == 1) && defa)
        ext = true;
    var outputarr = [];
    var sss = "";
    var word = phrase;
    var k;
    var sql = "";
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
        if ((word[k].charCodeAt(0) < 0xD800) || (word[k].charCodeAt(0) >= 0xE000)) {
            fullchar = word[k];
        } else {
            fullchar = word[k] + word[k + 1];
            //sql = "select "+optruby+" from "+opttable+" where HEX(word)='"+SuppChar.asHex(word2)+"' order by level desc";
            if ((phrase.length == 2) && !ext)
                ext = true;
            k++;
        }

        pcubo = [];
        if (pconqueue != "") {
            var optta = opttable;
            var cfullchar = pconqueue + fullchar;
            var csize = cfullchar.split(":").length;
            contents = condb.exec("SELECT c" + optta + ", cword FROM cmpnom WHERE cword = '" + cfullchar + "' AND c" + optta + " <> '' AND c" + optta + " IS NOT NULL");
            var split = null;
            var i, j;

            if (contents.length != 0) {
                for (i = 0; i < contents[0].values.length; i++) {
                    split = contents[0].values[i][0].split(" ");
                    xstr = [];
                    for (j = 0; j != csize; j++)
                        xstr.push(split[j]);
                    pcubo.push(xstr);
                    pconlenbuf = pconlentmp;
                }
            }

            pconqSz = pconrSz = pconcSz = pcubo.length;
            contents = condb.exec("SELECT c" + optta + ", cword FROM cmpnom WHERE cword like '" + cfullchar + ":%' AND c" + optta + " <> '' AND c" + optta + " IS NOT NULL");
            xstr = [];
            split = null;
            var rubo = [];
            if (contents.length != 0) {
                for (i = 0; i < contents[0].values.length; i++) {
                    split = contents[0].values[i][0].split(" ");
                    xstr = [];
                    for (j = 0; j != split.length; j++)
                        xstr.push(split[j]);
                    rubo.push(xstr);
                    pconlenbuf = pconlentmp;
                }
            }
            if (split != null) {
                xstr = [];
                for (i = 0; i != csize; i++)
                    xstr.push(split[i]);
                pconlentail = split[i - 1].length;
                pcubo.push(xstr);
                pcubo = pcubo.concat(rubo);
                pconqSz++;
                pconrSz = pcubo.length;
            }
            ptqSz = ptrSz = ptcSz = pcubo.length;

            if (pcontail != "") {
                var truby = pcontail + fullchar;
                var tsize = truby.split(":").length;
                contents = condb.exec("SELECT c" + optta + ", cword FROM cmpnom WHERE cword = '" + truby + "' AND c" + optta + " <> '' AND c" + optta + " IS NOT NULL");
                if (contents.length != 0) {
                    for (i = 0; i < contents[0].values.length; i++) {
                        split = contents[0].values[i][0].split(" ");
                        xstr = [];
                        for (j = 0; j != tsize; j++)
                            xstr.push(split[j]);
                        pcubo.push(xstr);
                        pconlenbuf = pconlentmp;
                    }
                }
                ptqSz = ptrSz = ptcSz = pcubo.length;
                contents = condb.exec("SELECT c" + optta + ", cword FROM cmpnom WHERE cword like '" + truby + ":%' AND c" + optta + " <> '' AND c" + optta + " IS NOT NULL");
                xstr = [];
                split = null;
                rubo = [];
                if (contents.length != 0) {
                    for (i = 0; i < contents[0].values.length; i++) {
                        split = contents[0].values[i][0].split(" ");
                        xstr = [];
                        for (j = 0; j != split.length; j++)
                            xstr.push(split[j]);
                        rubo.push(xstr);
                        pconlenbuf = pconlentmp;
                    }
                }

                if (split != null) {
                    xstr = [];
                    for (i = 0; i != csize; i++)
                        xstr.push(split[i]);
                    pconlentail = split[i - 1].length;
                    pcubo.push(xstr);
                    pcubo = pcubo.concat(rubo);
                    pcontqSz++;
                    pcontrSz = pcubo.length;
                }
            }
        }
        var q;

        sql = "select " + optruby + ", (level % " + maxlevel + ") from " + opttable + " where word='" + fullchar + "' order by (level % " + maxlevel + ") desc";
        contents = condb.exec(sql);
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
                pconqueue = pconqueue + fullchar + ":";
            pcontail = "";
        } else if (pconqSz > 0) {
            pconqueue = pconqueue + fullchar + ":";
            pcontail = fullchar + ":";
        } else if (pconrSz > 0) {
            pconqueue = pcontail = "";
        } else if (pcontcSz > 0) {
            pconlenbuf = pconlentail;
            if (pcontcSz == pcontqSz)
                pconqueue = "";
            else
                pconqueue = pcontail + fullchar + ":";
            pcontail = "";
        } else if (pcontqSz > 0) {
            pconlenbuf = pconlentail;
            pconqueue = pcontail + fullchar + ":";
            pcontail = fullchar + ":";
        } else if (pcontrSz > 0) {
            pconlenbuf = pconlentail;
            pconqueue = pcontail = "";
        } else {
            pconqueue = fullchar + ":";
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
                outputarr.push("$" + fullchar);
        }
        sss = "";
    }

    return outputarr;
}

function selChar(phrase, maxlevel, defa) {
    var ext = !defa;
    if ((phrase.length == 1) && defa)
        ext = true;
    var outputarr = [];
    var sss = "";
    phrase = phrase.replace(/\./g, " 。 ");
    phrase = phrase.replace(/,/g, " 、 ");
    phrase = phrase.replace(/:/g, " ： ");
    phrase = phrase.replace(/;/g, " ； ");
    phrase = phrase.replace(/\?/g, " ？ ");
    phrase = phrase.replace(/!/g, " ！ ");
    phrase = phrase.replace(/\t/g, " \t ");
    phrase = phrase.replace(/\n/g, " \n ");
    phrase = phrase.replace(/\r/g, " \r ");
    var word = phrase.split(" ");
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
            var optta = opttable;
            var cfullchar = pconqueue + fullchar;
            var csize = cfullchar.split(" ").length;
            contents = condb.exec("SELECT cword, c" + optta + " FROM cmpnom WHERE c" + optta + " = '" + cfullchar.replace(/\'/g, "''") + "'");
            var split = null;
            var i, j;

            if (contents.length != 0) {
                for (i = 0; i < contents[0].values.length; i++) {
                    split = contents[0].values[i][0].split(":");
                    xstr = [];
                    for (j = 0; j != csize; j++)
                        xstr.push(split[j]);
                    pcubo.push(xstr);
                    pconlenbuf = pconlentmp;
                }
            }

            pconqSz = pconrSz = pconcSz = pcubo.length;
            contents = condb.exec("SELECT cword, c" + optta + " FROM cmpnom WHERE c" + optta + " like '" + cfullchar.replace(/\'/g, "''") + " %'");
            xstr = [];
            split = null;
            var rubo = [];
            if (contents.length != 0) {
                for (i = 0; i < contents[0].values.length; i++) {
                    split = contents[0].values[i][0].split(":");
                    xstr = [];
                    for (j = 0; j != split.length; j++)
                        xstr.push(split[j]);
                    rubo.push(xstr);
                    pconlenbuf = pconlentmp;
                }
            }
            if (split != null) {
                xstr = [];
                for (i = 0; i != csize; i++)
                    xstr.push(split[i]);
                pconlentail = split[i - 1].length;
                pcubo.push(xstr);
                pcubo = pcubo.concat(rubo);
                pconqSz++;
                pconrSz = pcubo.length;
            }
            ptqSz = ptrSz = ptcSz = pcubo.length;

            if (pcontail != "") {
                var truby = pcontail + fullchar;
                var tsize = truby.split(" ").length;
                contents = condb.exec("SELECT cword, c" + optta + " FROM cmpnom WHERE c" + optta + " = '" + truby.replace(/\'/g, "''") + "'");
                if (contents.length != 0) {
                    for (i = 0; i < contents[0].values.length; i++) {
                        split = contents[0].values[i][0].split(":");
                        xstr = [];
                        for (j = 0; j != tsize; j++)
                            xstr.push(split[j]);
                        pcubo.push(xstr);
                        pconlenbuf = pconlentmp;
                    }
                }
                ptqSz = ptrSz = ptcSz = pcubo.length;
                contents = condb.exec("SELECT cword, c" + optta + " FROM cmpnom WHERE c" + optta + " like '" + truby.replace(/\'/g, "''") + " %'");
                xstr = [];
                split = null;
                rubo = [];
                if (contents.length != 0) {
                    for (i = 0; i < contents[0].values.length; i++) {
                        split = contents[0].values[i][0].split(":");
                        xstr = [];
                        for (j = 0; j != split.length; j++)
                            xstr.push(split[j]);
                        rubo.push(xstr);
                        pconlenbuf = pconlentmp;
                    }
                }

                if (split != null) {
                    xstr = [];
                    for (i = 0; i != csize; i++)
                        xstr.push(split[i]);
                    pconlentail = split[i - 1].length;
                    pcubo.push(xstr);
                    pcubo = pcubo.concat(rubo);
                    pcontqSz++;
                    pcontrSz = pcubo.length;
                }
            }
        }
        var q;

        sql = "select word,(level % " + maxlevel + ") from " + opttable + " where " + optruby + "='" + fullchar.replace(/\'/g, "''") + "' order by (level % " + maxlevel + ") desc";
        contents = condb.exec(sql);
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

    return outputarr;
}

function selExample(word, ruby) {
    var cubo = [];
    var i;
    var cubostr = "<table>";
    if (quocngu == 1) {
        cubostr += "</table>";
        $("#example").html(cubostr);
        return;
    }
    contents = condb.exec("SELECT cword, c" + opttable + " FROM cmpnom WHERE c" + opttable + " LIKE '" + ruby.replace(/\'/g, "''") + " %' OR c" + opttable + " LIKE '% " + ruby.replace(/\'/g, "''") + "' OR c" + opttable + " LIKE '% " + ruby.replace(/\'/g, "''") + " %'");
    if (contents.length != 0) {
        for (i = 0; i < contents[0].values.length; i++) {
            if (contents[0].values[i][0].indexOf(word) > -1) {
                if (isNoSpaceLang(quocngu)) {
                    cubostr += "<tr><td>" + contents[0].values[i][0].replace(/:/g, "") + "</td><td>" + contents[0].values[i][1].replace(/ /g, "") + "</td></tr>";
                }
                else {
                    cubostr += "<tr><td>" + contents[0].values[i][0].replace(/:/g, "") + "</td><td>" + contents[0].values[i][1] + "</td></tr>";
                }
            }
        }
    }
    cubostr += "</table>";
    $("#example").html(cubostr);
    return;
}
function listUpdate() {
    var rubystr = $("#rubytype").text();
    delList();
    if (rubystr == "")
        return;

    addSelCompound(rubystr.toLowerCase());
    addSelRuby(rubystr.toLowerCase());
    if (optionlist.length > 9) {
        bPgdn = true;
        var i;
        for (i = 1; i <= 9; i++) {
            $("#w" + i).html(optionlist[i - 1]);
        }
        setSelectedIndex(1);
    } else {
        var i;
        whitelist();
        for (i = 1; i <= optionlist.length; i++) {
            $("#w" + i).html(optionlist[i - 1]);
        }
        setSelectedIndex(1);
    }

}

function delList() {
    optionlist = [];
    conqSz = conrSz = concSz = contqSz = contrSz = contcSz = 0;
    selectedindex = 0;
    pgBe = 0;
    pgEn = 0;
    bPgup = false;
    bPgdn = false;
    whitelist();
}

function whitelist() {
    $(".outopt").css({ 'background': 'none', 'color': '#f0e0c0' });
    $("#w1").html("");
    $("#w2").html("");
    $("#w3").html("");
    $("#w4").html("");
    $("#w5").html("");
    $("#w6").html("");
    $("#w7").html("");
    $("#w8").html("");
    $("#w9").html("");
}

function setSelectedIndex(ind) {
    if ($("#w" + ind).text() != "") {
        selectedindex = ind;
        $(".outopt").css({ 'background': 'none', 'color': '#f0e0c0' });
        $("#w" + ind).css({ 'background': '#eee', 'color': '#000' });
    }
    $("#txtPad").focus();
}

function toneNumb(tonechar) {
    switch (tonechar) {
        case('!'):
            return '1';
        case('@'):
            return '2';
        case('#'):
            return '3';
        case('$'):
            return '4';
        case('%'):
            return '5';
        case('^'):
            return '6';
        case('&'):
            return '7';
        case('*'):
            return '8';
        case('('):
            return '9';
        case(')'):
            return '0';
        
    }
    return tonechar;
}
function typeChar(text, ch) {
    if (keyboard != 2) {
        switch (quocngu) {
            case 0: return TELEX(text, ch, 0);
            case 29: return TELEX(text, ch, 0);
            case 31: return KEMMUN(text, ch, 0);
            case 32: return TELEX(text, ch, 0);
            case 2: return POJ(text, ch, 0);
            case 3: return BUC(text, ch);
            case 4: return POJ(text, ch, 1);
            case 5: return PINYIN(text, ch);
            case 8: return HANGUL(text, ch);
            case 9: return KANA(text, ch);
            case 13: return YANGPINYIN(text, ch);
            case 28: return NONGLAT(text, ch);
            case 14: return TELEX(text, ch, 1);
            case 15: return THAI(text, ch);
            case 30: return SUKHOTHAI(text, ch);
            case 16: return LAO(text, ch);
            case 17: return TAIDAM(text, ch);
            case 18: return TAIDON(text, ch);
            case 19: case 20: return TAITHAM(text, ch);
            case 21: return TAIYAI(text, ch);
            case 22: return TAILE(text, ch);
            case 23: return TAILUE(text, ch);
            case 27: return TAIDENG(text, ch);
            case 24: return TAIYO(text, ch);
            case 25: return LAIPAO(text, ch);
            case 26: return TAIAHOM(text, ch);
        }
    }
    return text + ch;
}

function THAI(text, ch) {
    var tch = "";
    switch (ch) {
        case '0': tch = "ั"; break;
        case '1': tch = "่"; break;
        case '2': tch = "้"; break;
        case '3': tch = "๊"; break;
        case '4': tch = "๋"; break;
        case '5': tch = "โ"; break;
        case '6': tch = "ใ"; break;
        case '7': tch = "ไ"; break;
        case '8': tch = "ำ"; break;
        case '9': tch = "็"; break;
        case 'a': tch = "า"; break;
        case 'b': tch = "บ"; break;
        case 'c': tch = "จ"; break;
        case 'd': tch = "ด"; break;
        case 'e': tch = "เ"; break;
        case 'f': tch = "พ"; break;
        case 'g': tch = "ง"; break;
        case 'h': tch = "ห"; break;
        case 'i': tch = "ิ"; break;
        case 'j': tch = "ท"; break;
        case 'k': tch = "ก"; break;
        case 'l': tch = "ล"; break;
        case 'm': tch = "ม"; break;
        case 'n': tch = "น"; break;
        case 'o': tch = "อ"; break;
        case 'p': tch = "ผ"; break;
        case 'q': tch = "ช"; break;
        case 'r': tch = "ร"; break;
        case 's': tch = "ส"; break;
        case 't': tch = "ต"; break;
        case 'u': tch = "ุ"; break;
        case 'v': tch = "ว"; break;
        case 'w': tch = "ึ"; break;
        case 'x': tch = "ข"; break;
        case 'y': tch = "ย"; break;
        case 'z': tch = "ถ"; break;
        default: tch = ch; break;
    }
    if (text == "") {
        return tch;
    }

    var t = text[text.length - 1];
    var roma = t + ch;
    switch (roma) {
        case '\'h': roma = "ห"; break;
        case '\'k': roma = "ฅ"; break;
        case '\'x': roma = "ฃ"; break;
        case '\'p': roma = "๎"; break;
        case '\'a': roma = "์"; break;
        case 'กh': roma = "ค"; break;
        case 'ขh': roma = "ฆ"; break;
        case '\'q': roma = "ซ"; break;
        case 'จh': roma = "ฉ"; break;
        case 'ชh': roma = "ฌ"; break;
        case '\'s': roma = "ษ"; break;
        case 'สh': roma = "ศ"; break;
        case '\'d': roma = "ฎ"; break;
        case '\'t': roma = "ฏ"; break;
        case '\'z': roma = "ฐ"; break;
        case '\'j': roma = "ฑ"; break;
        case 'ตh': roma = "ฒ"; break;
        case 'ดh': roma = "ธ"; break;
        case 'นh': roma = "ญ"; break;
        case '\'n': roma = "ณ"; break;
        case 'วh': roma = "ภ"; break;
        case 'บh': roma = "ป"; break;
        case 'ผh': roma = "ฝ"; break;
        case 'พh': roma = "ฟ"; break;
        case '\'r': roma = "ฤ"; break;
        case '\'l': roma = "ฦ"; break;
        case 'ลh': roma = "ฬ"; break;
        case 'อh': roma = "ฮ"; break;
        case '\'m': roma = "ํ"; break;
        case 'าa': roma = "ๅ"; break;
        case 'เe': roma = "แ"; break;
        case '\'e': roma = "เ"; break;
        case 'ั0': roma = "ะ"; break;
        case 'ิi': roma = "ี"; break;
        case 'ุu': roma = "ู"; break;
        case 'ึw': roma = "ื"; break;
        case '\'o': roma = "ฺ"; break;
        case '\'v': roma = "ๆ"; break;
        case '\'b': roma = "฿"; break;
        case '\'c': roma = "๏"; break;
        case '\'f': roma = "๛"; break;
        case '\'u': roma = "ฯ"; break;
        case '\'i': roma = "๚"; break;
        case '\'0': roma = "๐"; break;
        case '\'1': roma = "๑"; break;
        case '\'2': roma = "๒"; break;
        case '\'3': roma = "๓"; break;
        case '\'4': roma = "๔"; break;
        case '\'5': roma = "๕"; break;
        case '\'6': roma = "๖"; break;
        case '\'7': roma = "๗"; break;
        case '\'8': roma = "๘"; break;
        case '\'9': roma = "๙"; break;
        default: roma = t + tch; break;
    }
    return text.substring(0, text.length - 1) + roma;
}

function SUKHOTHAI(text, ch) {
    var tch = "";
    switch (ch) {
        case '0': tch = "𕋚"; break;
        case '1': tch = "𕋬"; break;
        case '2': tch = "𕋮"; break;
        case '3': tch = "𕋭"; break;
        case '4': tch = "𕋥"; break;
        case '5': tch = "𕋢"; break;
        case '6': tch = "𕋣"; break;
        case '7': tch = "𕋤"; break;
        case '8': tch = "𕋞"; break;
        case '9': tch = "𕋟"; break;
        case 'a': tch = "𕋙"; break;
        case 'b': tch = "𕋆"; break;
        case 'c': tch = "𕊷"; break;
        case 'd': tch = "𕋀"; break;
        case 'e': tch = "𕋠"; break;
        case 'f': tch = "𕋊"; break;
        case 'g': tch = "𕊶"; break;
        case 'h': tch = "𕋕"; break;
        case 'i': tch = "𕋜"; break;
        case 'j': tch = "𕋃"; break;
        case 'k': tch = "𕊰"; break;
        case 'l': tch = "𕋐"; break;
        case 'm': tch = "𕋍"; break;
        case 'n': tch = "𕋅"; break;
        case 'o': tch = "𕋖"; break;
        case 'p': tch = "𕋈"; break;
        case 'q': tch = "𕊹"; break;
        case 'r': tch = "𕋏"; break;
        case 's': tch = "𕋔"; break;
        case 't': tch = "𕋁"; break;
        case 'u': tch = "𕋛"; break;
        case 'v': tch = "𕋑"; break;
        case 'w': tch = "𕋝"; break;
        case 'x': tch = "𕊱"; break;
        case 'y': tch = "𕋎"; break;
        case 'z': tch = "𕋂"; break;
        default: tch = ch; break;
    }
    if (text == "") {
        return tch;
    }
    var t;
    var utf = 1;
    if ((text.charCodeAt(text.length - 1) >= 0xD800) && (text.charCodeAt(text.length - 1) <= 0xDFFF)) {
        t = text[text.length - 2].concat(text[text.length - 1]);
        utf = 2;
    }
    else
        t = text[text.length - 1];
    var roma = t + ch;
    switch (roma) {
        case '\'h': roma = "𕋕"; break;
        case '\'k': roma = "𕊴"; break;
        case '\'x': roma = "𕊲"; break;
        case '\'w': roma = "𕋨"; break;
        case '𕊰h': roma = "𕊳"; break;
        case '𕊱h': roma = "𕊵"; break;
        case '\'q': roma = "𕊺"; break;
        case '𕊷h': roma = "𕊸"; break;
        case '\'s': roma = "𕋓"; break;
        case '𕋔h': roma = "𕋒"; break;
        case '\'d': roma = "𕋻"; break;
        case '\'t': roma = "𕊼"; break;
        case '\'z': roma = "𕊾"; break;
        case '𕋁h': roma = "𕊽"; break;
        case '𕋀h': roma = "𕋄"; break;
        case '𕋅h': roma = "𕊻"; break;
        case '\'n': roma = "𕊿"; break;
        case '𕋑h': roma = "𕋌"; break;
        case '𕋆h': roma = "𕋇"; break;
        case '𕋈h': roma = "𕋉"; break;
        case '𕋊h': roma = "𕋋"; break;
        case '\'r': roma = "𕋺"; break;
        case '\'l': roma = "𕋽"; break;
        case '𕋖h': roma = "𕋗"; break;
        case '𕋙a': roma = "𕋯"; break;
        case '𕋠e': roma = "𕋡"; break;
        case '\'e': roma = "𕋠"; break;
        case '𕋚0': roma = "𕋘"; break;
        case '𕋜i': roma = "𕋧"; break;
        case '𕋛u': roma = "𕋦"; break;
        case '𕋝w': roma = "𕋩"; break;
        case '\'o': roma = "𕋼"; break;
        case '\'b': roma = "𕋾"; break;
        case '\'c': roma = "𕋿"; break;
        case '\'u': roma = "𕋪"; break;
        case '\'i': roma = "𕋫"; break;
        case '\'0': roma = "𕋰"; break;
        case '\'1': roma = "𕋱"; break;
        case '\'2': roma = "𕋲"; break;
        case '\'3': roma = "𕋳"; break;
        case '\'4': roma = "𕋴"; break;
        case '\'5': roma = "𕋵"; break;
        case '\'6': roma = "𕋶"; break;
        case '\'7': roma = "𕋷"; break;
        case '\'8': roma = "𕋸"; break;
        case '\'9': roma = "𕋹"; break;
        default: roma = t + tch; break;
    }
    return text.substring(0, text.length - utf) + roma;
}

function LAO(text, ch) {
    var tch = "";
    switch (ch) {
        case '0': tch = "ັ"; break;
        case '1': tch = "່"; break;
        case '2': tch = "້"; break;
        case '3': tch = "໊"; break;
        case '4': tch = "໋"; break;
        case '5': tch = "ໂ"; break;
        case '6': tch = "ໃ"; break;
        case '7': tch = "ໄ"; break;
        case '8': tch = "ຽ"; break;
        case '9': tch = "ົ"; break;
        case 'a': tch = "າ"; break;
        case 'b': tch = "ບ"; break;
        case 'c': tch = "ຈ"; break;
        case 'd': tch = "ດ"; break;
        case 'e': tch = "ເ"; break;
        case 'f': tch = "ພ"; break;
        case 'g': tch = "ງ"; break;
        case 'h': tch = "ຫ"; break;
        case 'i': tch = "ິ"; break;
        case 'j': tch = "ທ"; break;
        case 'k': tch = "ກ"; break;
        case 'l': tch = "ລ"; break;
        case 'm': tch = "ມ"; break;
        case 'n': tch = "ນ"; break;
        case 'o': tch = "ອ"; break;
        case 'p': tch = "ຜ"; break;
        case 'q': tch = "ຊ"; break;
        case 'r': tch = "ຣ"; break;
        case 's': tch = "ສ"; break;
        case 't': tch = "ຕ"; break;
        case 'u': tch = "ຸ"; break;
        case 'v': tch = "ວ"; break;
        case 'w': tch = "ຶ"; break;
        case 'x': tch = "ຂ"; break;
        case 'y': tch = "ຍ"; break;
        case 'z': tch = "ຖ"; break;
        default: tch = ch; break;
    }
    if (text == "") {
        return tch;
    }

    var t = text[text.length - 1];
    var roma = t + ch;
    switch (roma) {
        case '\'h': roma = "ຫ"; break;
        case '\'n': roma = "ນ"; break;
        case '\'m': roma = "ມ"; break;
        case '\'a': roma = "໌"; break;
        case 'ກh': roma = "ຄ"; break;
        case 'ຂh': roma = "ຆ"; break;
        case 'ຈh': roma = "ຉ"; break;
        case 'ຊh': roma = "ຌ"; break;
        case '\'s': roma = "ຩ"; break;
        case 'ສh': roma = "ຨ"; break;
        case '\'t': roma = "ຏ"; break;
        case '\'z': roma = "ຐ"; break;
        case '\'j': roma = "ຑ"; break;
        case 'ຕh': roma = "ຒ"; break;
        case 'ດh': roma = "ຘ"; break;
        case 'ນh': roma = "ຎ"; break;
        case '\'n': roma = "ຓ"; break;
        case 'ຍh': roma = "ຢ"; break;
        case 'ວh': roma = "ຠ"; break;
        case 'ບh': roma = "ປ"; break;
        case 'ຜh': roma = "ຝ"; break;
        case 'ພh': roma = "ຟ"; break;
        case '\'l': roma = "ຼ"; break;
        case 'ຫn': roma = "ໜ"; break;
        case 'ຫm': roma = "ໝ"; break;
        case 'ລh': roma = "ຬ"; break;
        case 'ຣh': roma = "ຮ"; break;
        case 'ອh': roma = "ໍ"; break;
        case 'ງh': roma = "ໞ"; break;
        case 'ມh': roma = "ຳ"; break;
        case 'ເe': roma = "ແ"; break;
        case '\'e': roma = "ເ"; break;
        case 'ັ0': roma = "ະ"; break;
        case 'ິi': roma = "ີ"; break;
        case 'ຸu': roma = "ູ"; break;
        case 'ຶw': roma = "ື"; break;
        case '\'y': roma = "ໟ"; break;
        case '\'o': roma = "຺"; break;
        case '\'v': roma = "ໆ"; break;
        case '\'u': roma = "ຯ"; break;
        case '\'0': roma = "໐"; break;
        case '\'1': roma = "໑"; break;
        case '\'2': roma = "໒"; break;
        case '\'3': roma = "໓"; break;
        case '\'4': roma = "໔"; break;
        case '\'5': roma = "໕"; break;
        case '\'6': roma = "໖"; break;
        case '\'7': roma = "໗"; break;
        case '\'8': roma = "໘"; break;
        case '\'9': roma = "໙"; break;
        default: roma = t + tch; break;
    }
    return text.substring(0, text.length - 1) + roma;
}

function TAITHAM(text, ch) {
    var tch = "";
    switch (ch) {
        case '0': tch = "ᩫ"; break;
        case '1': tch = "᩵"; break;
        case '2': tch = "᩶"; break;
        case '3': tch = "ᩕ"; break;
        case '4': tch = "ᩖ"; break;
        case '5': tch = "ᩰ"; break;
        case '6': tch = "ᩲ"; break;
        case '7': tch = "ᩱ"; break;
        case '8': tch = "᩠"; break;
        case '9': tch = "ᩢ"; break;
        case 'a': tch = "ᩣ"; break;
        case 'b': tch = "ᨷ"; break;
        case 'c': tch = "ᨧ"; break;
        case 'd': tch = "ᨯ"; break;
        case 'e': tch = "ᩮ"; break;
        case 'f': tch = "ᨹ"; break;
        case 'g': tch = "ᨦ"; break;
        case 'h': tch = "ᩉ"; break;
        case 'i': tch = "ᩥ"; break;
        case 'j': tch = "ᩧ"; break;
        case 'k': tch = "ᨠ"; break;
        case 'l': tch = "ᩃ"; break;
        case 'm': tch = "ᨾ"; break;
        case 'n': tch = "ᨶ"; break;
        case 'o': tch = "ᩋ"; break;
        case 'p': tch = "ᨻ"; break;
        case 'q': tch = "ᨩ"; break;
        case 'r': tch = "ᩁ"; break;
        case 's': tch = "ᩈ"; break;
        case 't': tch = "ᨲ"; break;
        case 'u': tch = "ᩩ"; break;
        case 'v': tch = "ᩅ"; break;
        case 'w': tch = "ᩪ"; break;
        case 'x': tch = "ᨡ"; break;
        case 'y': tch = "ᨿ"; break;
        case 'z': tch = "ᨴ"; break;
        default: tch = ch; break;
    }
    if (text == "") {
        return tch;
    }

    var t = text[text.length - 1];
    var roma = t + ch;
    switch (roma) {
        case '\'h': roma = "ᩉ"; break;
        case '\'k': roma = "ᨤ"; break;
        case '\'x': roma = "ᨢ"; break;
        case '\'a': roma = "᩹"; break;
        case '\'\'': roma = "᩻"; break;
        case 'ᩣa': roma = "ᩤ"; break;
        case '\'z': roma = "ᩔ"; break;
        case 'ᩉh': roma = "ᩌ"; break;
        case 'ᨠh': roma = "ᨣ"; break;
        case 'ᨡh': roma = "ᨥ"; break;
        case '\'q': roma = "ᨪ"; break;
        case 'ᨧh': roma = "ᨨ"; break;
        case 'ᨩh': roma = "ᨫ"; break;
        case 'ᨴh': roma = "ᨳ"; break;
        case '\'c': roma = "ᩆ"; break;
        case 'ᩈh': roma = "ᩇ"; break;
        case '\'d': roma = "ᨰ"; break;
        case '\'t': roma = "ᨮ"; break;
        case '\'y': roma = "ᩀ"; break;
        case 'ᨲh': roma = "ᨭ"; break;
        case 'ᨯh': roma = "ᨵ"; break;
        case 'ᨶh': roma = "ᨬ"; break;
        case '\'n': roma = "ᨱ"; break;
        case 'ᨷh': roma = "ᨸ"; break;
        case 'ᨻh': roma = "ᨼ"; break;
        case 'ᨹh': roma = "ᨺ"; break;
        case '\'r': roma = "ᩂ"; break;
        case '\'l': roma = "ᩄ"; break;
        case 'ᨦh': roma = "ᩊ"; break;
        case 'ᩃh': roma = "ᩓ"; break;
        case 'ᩅh': roma = "ᨽ"; break;
        case 'ᨾh': roma = "ᩘ"; break;
        case 'ᩮe': roma = "ᩯ"; break;
        case '\'e': roma = "ᩑ"; break;
        case 'ᩰ5': roma = "ᩒ"; break;
        case 'ᩫ0': roma = "ᩡ"; break;
        case 'ᩥi': roma = "ᩦ"; break;
        case 'ᩧj': roma = "ᩨ"; break;
        case 'ᩋo': roma = "ᩬ"; break;
        case 'ᨿh': roma = "ᩭ"; break;
        case 'ᩩu': roma = "ᩳ"; break;
        case 'ᩖ4': roma = "ᩗ"; break;
        case 'ᩢ9': roma = "ᩴ"; break;
        case '᩵1': roma = "᩷"; break;
        case '᩶2': roma = "᩸"; break;
        case '᩠8': roma = "᩼"; break;
        case 'ᩁh': roma = "᩺"; break;
        case '\'o': roma = "ᩋ"; break;
        case '\'p': roma = "ᩚ"; break;
        case '\'g': roma = "ᩙ"; break;
        case '\'m': roma = "ᩜ"; break;
        case '\'v': roma = "ᩛ"; break;
        case '\'b': roma = "ᩝ"; break;
        case '\'s': roma = "ᩞ"; break;
        case '\'u': roma = "ᩏ"; break;
        case '\'w': roma = "ᩐ"; break;
        case '\'i': roma = "ᩍ"; break;
        case '\'j': roma = "ᩎ"; break;
        case '\'f': roma = "᩿"; break;
        case '\'0': roma = "᪐"; break;
        case '\'1': roma = "᪑"; break;
        case '\'2': roma = "᪒"; break;
        case '\'3': roma = "᪓"; break;
        case '\'4': roma = "᪔"; break;
        case '\'5': roma = "᪕"; break;
        case '\'6': roma = "᪖"; break;
        case '\'7': roma = "᪗"; break;
        case '\'8': roma = "᪘"; break;
        case '\'9': roma = "᪙"; break;
        case 'ᩫ\'': roma = "᪀"; break;
        case '᩵\'': roma = "᪁"; break;
        case '᩶\'': roma = "᪂"; break;
        case 'ᩕ\'': roma = "᪃"; break;
        case 'ᩖ\'': roma = "᪄"; break;
        case 'ᩰ\'': roma = "᪅"; break;
        case 'ᩲ\'': roma = "᪆"; break;
        case 'ᩱ\'': roma = "᪇"; break;
        case '᩠\'': roma = "᪈"; break;
        case 'ᩢ\'': roma = "᪉"; break;
        default: roma = t + tch; break;
    }
    return text.substring(0, text.length - 1) + roma;
}

function TAIDAM(text, ch) {
    var tch = "";
    switch (ch) {
        case '0': tch = "ꪰ"; break;
        case '1': tch = "꪿"; break;
        case '2': tch = "꫁"; break;
        case '3': tch = "ꪶ"; break;
        case '4': tch = "ꪵ"; break;
        case '5': tch = "ꪺ"; break;
        case '6': tch = "ꪻ"; break;
        case '7': tch = "ꪼ"; break;
        case '8': tch = "ꪸ"; break;
        case '9': tch = "ꪳ"; break;
        case 'a': tch = "ꪱ"; break;
        case 'b': tch = "ꪚ"; break;
        case 'c': tch = "ꪊ"; break;
        case 'd': tch = "ꪒ"; break;
        case 'e': tch = "ꪹ"; break;
        case 'f': tch = "ꪠ"; break;
        case 'g': tch = "ꪉ"; break;
        case 'h': tch = "ꪬ"; break;
        case 'i': tch = "ꪲ"; break;
        case 'j': tch = "ꪑ"; break;
        case 'k': tch = "ꪀ"; break;
        case 'l': tch = "ꪩ"; break;
        case 'm': tch = "ꪣ"; break;
        case 'n': tch = "ꪙ"; break;
        case 'o': tch = "ꪮ"; break;
        case 'p': tch = "ꪜ"; break;
        case 'q': tch = "ꪅ"; break;
        case 'r': tch = "ꪭ"; break;
        case 's': tch = "ꪎ"; break;
        case 't': tch = "ꪔ"; break;
        case 'u': tch = "ꪴ"; break;
        case 'v': tch = "ꪫ"; break;
        case 'w': tch = "ꪷ"; break;
        case 'x': tch = "ꪄ"; break;
        case 'y': tch = "ꪥ"; break;
        case 'z': tch = "ꪖ"; break;
        default: tch = ch; break;
    }
    if (text == "") {
        return tch;
    }

    var t = text[text.length - 1];
    var roma = t + ch;
    switch (roma) {
        case '\'h': roma = "ꪬ"; break;
        case '\'k': roma = "ꪁ"; break;
        case '\'x': roma = "ꪂ"; break;
        case '\'q': roma = "ꪃ"; break;
        case 'ꪀh': roma = "ꪆ"; break;
        case 'ꪅh': roma = "ꪇ"; break;
        case 'ꪬg': roma = "ꪈ"; break;
        case '\'g': roma = "ꪉ"; break;
        case '\'c': roma = "ꪋ"; break;
        case 'ꪊh': roma = "ꪌ"; break;
        case 'ꪎh': roma = "ꪍ"; break;
        case '\'s': roma = "ꪏ"; break;
        case 'ꪬj': roma = "ꪐ"; break;
        case '\'j': roma = "ꪑ"; break;
        case '\'d': roma = "ꪓ"; break;
        case '\'t': roma = "ꪕ"; break;
        case '\'z': roma = "ꪗ"; break;
        case 'ꪬn': roma = "ꪘ"; break;
        case '\'n': roma = "ꪙ"; break;
        case '\'b': roma = "ꪛ"; break;
        case '\'p': roma = "ꪝ"; break;
        case 'ꪠh': roma = "ꪞ"; break;
        case 'ꪜh': roma = "ꪟ"; break;
        case '\'f': roma = "ꪡ"; break;
        case 'ꪬm': roma = "ꪢ"; break;
        case '\'m': roma = "ꪣ"; break;
        case 'ꪬy': roma = "ꪤ"; break;
        case '\'y': roma = "ꪥ"; break;
        case 'ꪭr': roma = "ꪦ"; break;
        case '\'r': roma = "ꪧ"; break;
        case 'ꪬl': roma = "ꪨ"; break;
        case '\'l': roma = "ꪩ"; break;
        case 'ꪬv': roma = "ꪪ"; break;
        case '\'v': roma = "ꪫ"; break;
        case '\'o': roma = "ꪯ"; break;
        case 'ꪰn': roma = "ꪽ"; break;
        case 'ꪰm': roma = "ꪾ"; break;
        case '꪿h': roma = "ꫀ"; break;
        case '꫁h': roma = "ꫂ"; break;
        default: roma = t + tch; break;
    }
    return text.substring(0, text.length - 1) + roma;
}

function TAIDON(text, ch) {
    var tch = "";
    switch (ch) {
        case '0': tch = "ꪰ"; break;
        case '1': tch = "꪿"; break;
        case '2': tch = "꫁"; break;
        case '3': tch = "ꪶ"; break;
        case '4': tch = "ꪵ"; break;
        case '5': tch = "ꪺ"; break;
        case '6': tch = "ꪻ"; break;
        case '7': tch = "ꪼ"; break;
        case '8': tch = "ꪸ"; break;
        case '9': tch = "ꪳ"; break;
        case 'a': tch = "ꪱ"; break;
        case 'b': tch = "ꪚ"; break;
        case 'c': tch = "ꪊ"; break;
        case 'd': tch = "ꪒ"; break;
        case 'e': tch = "ꪹ"; break;
        case 'f': tch = "ꪠ"; break;
        case 'g': tch = "ꪉ"; break;
        case 'h': tch = "ꪬ"; break;
        case 'i': tch = "ꪲ"; break;
        case 'j': tch = "ꪑ"; break;
        case 'k': tch = "ꪀ"; break;
        case 'l': tch = "ꪩ"; break;
        case 'm': tch = "ꪣ"; break;
        case 'n': tch = "ꪙ"; break;
        case 'o': tch = "ꪮ"; break;
        case 'p': tch = "ꪜ"; break;
        case 'q': tch = "ꪅ"; break;
        case 'r': tch = "ꪭ"; break;
        case 's': tch = "ꪎ"; break;
        case 't': tch = "ꪔ"; break;
        case 'u': tch = "ꪴ"; break;
        case 'v': tch = "ꪫ"; break;
        case 'w': tch = "ꪷ"; break;
        case 'x': tch = "ꪄ"; break;
        case 'y': tch = "ꪥ"; break;
        case 'z': tch = "ꪖ"; break;
        default: tch = ch; break;
    }
    if (text == "") {
        return tch;
    }

    var t = text[text.length - 1];
    var alt = 1;
    if ((t == "‍") && (text.length >= 2)) {
        t = text[text.length - 2].concat(text[text.length - 1]);
        alt = 2;
    }
    var roma = t + ch;
    switch (roma) {
        case 'ꪷw': roma = "ꪷꪷ"; break;
        case 'ꪱa': roma = "꫏"; break;
        case 'ꪶ3': roma = "ꪶ‍"; break;
        case '\'h': roma = "ꪬ"; break;
        case '\'k': roma = "ꪁ"; break;
        case '\'x': roma = "ꪂ"; break;
        case '\'q': roma = "ꪃ"; break;
        case 'ꪀh': roma = "ꪆ"; break;
        case 'ꪬg': roma = "ꪈ"; break;
        case '\'g': roma = "ꪉ"; break;
        case '\'c': roma = "ꪋ"; break;
        case 'ꪊh': roma = "ꪌ"; break;
        case 'ꪎh': roma = "ꪍ"; break;
        case '\'s': roma = "ꪏ"; break;
        case 'ꪬj': roma = "ꪐ"; break;
        case '\'j': roma = "ꪑ"; break;
        case '\'d': roma = "ꪓ"; break;
        case '\'t': roma = "ꪕ"; break;
        case '\'z': roma = "ꪗ"; break;
        case 'ꪬn': roma = "ꪘ"; break;
        case '\'n': roma = "ꪙ"; break;
        case '\'b': roma = "ꪛ"; break;
        case '\'p': roma = "ꪝ"; break;
        case 'ꪠh': roma = "ꪞ"; break;
        case 'ꪜh': roma = "ꪟ"; break;
        case '\'f': roma = "ꪡ"; break;
        case 'ꪬm': roma = "ꪢ"; break;
        case '\'m': roma = "ꪣ"; break;
        case 'ꪬy': roma = "ꪤ"; break;
        case '\'y': roma = "ꪥ"; break;
        case 'ꪭr': roma = "ꪦ"; break;
        case '\'r': roma = "ꪧ"; break;
        case 'ꪬl': roma = "ꪨ"; break;
        case '\'l': roma = "ꪩ"; break;
        case 'ꪬv': roma = "ꪪ"; break;
        case '\'v': roma = "ꪫ"; break;
        case '\'o': roma = "ꪯ"; break;
        case 'ꪰn': roma = "ꪽ"; break;
        case 'ꪰm': roma = "ꪾ"; break;
        case 'ꪰd': roma = "꫉"; break;
        case '꪿h': roma = "ꫀ"; break;
        case '꫁h': roma = "ꫂ"; break;
        default: roma = t + tch; break;
    }
    return text.substring(0, text.length - alt) + roma;
}

function TAIDENG(text, ch) {
    var tch = "";
    switch (ch) {
        case '0': tch = "ꪷ"; break;
        case '1': tch = "꪿"; break;
        case '2': tch = "꫁"; break;
        case '3': tch = "ꪶ"; break;
        case '4': tch = "ꪵ"; break;
        case '5': tch = "ꪺ"; break;
        case '6': tch = "ꪻ"; break;
        case '7': tch = "ꪼ"; break;
        case '8': tch = "ꪸ"; break;
        case '9': tch = "ꪳ"; break;
        case 'a': tch = "ꪱ"; break;
        case 'b': tch = "ꪚ"; break;
        case 'c': tch = "ꪊ"; break;
        case 'd': tch = "ꪒ"; break;
        case 'e': tch = "ꪹ"; break;
        case 'f': tch = "ꪌ"; break;
        case 'g': tch = "ꪉ‍"; break;
        case 'h': tch = "ꪬ"; break;
        case 'i': tch = "ꪲ"; break;
        case 'j': tch = "ꪑ"; break;
        case 'k': tch = "ꪀ"; break;
        case 'l': tch = "ꪩ"; break;
        case 'm': tch = "ꪣ"; break;
        case 'n': tch = "ꪙ"; break;
        case 'o': tch = "ꪮ"; break;
        case 'p': tch = "ꪜ"; break;
        case 'q': tch = "ꪅ"; break;
        case 'r': tch = "ꪭ"; break;
        case 's': tch = "ꪎ‍"; break;
        case 't': tch = "ꪔ"; break;
        case 'u': tch = "ꪴ"; break;
        case 'v': tch = "ꪫ‍"; break;
        case 'w': tch = "ꪰ"; break;
        case 'x': tch = "ꪄ‍"; break;
        case 'y': tch = "ꪥ"; break;
        case 'z': tch = "ꪖ"; break;
        default: tch = ch; break;
    }
    if (text == "") {
        return tch;
    }

    var t = text[text.length - 1];
    var alt = 1;
    if ((t == "‍") && (text.length >= 2)) {
        t = text[text.length - 2].concat(text[text.length - 1]);
        alt = 2;
    }
    var roma = t + ch;
    switch (roma) {
        case 'ꪀn': roma = "ꪀ‍ꪙ"; break;
        case 'ꪀv': roma = "ꪀ‍ꪫ‍"; break;
        case 'ꪷ0': roma = "꫊"; break;
        case 'ꪶ3': roma = "ꪶ‍"; break;
        case '\'h': roma = "ꪬ"; break;
        case '\'k': roma = "ꪁ‍"; break;
        case '\'x': roma = "ꪂ‍"; break;
        case '\'q': roma = "ꪃ"; break;
        case 'ꪀh': roma = "ꪆ"; break;
        case 'ꪅh': roma = "ꪇ"; break;
        case 'ꪬg': roma = "ꪈ‍"; break;
        case '\'g': roma = "ꪉ‍"; break;
        case '\'c': roma = "ꪋ"; break;
        case 'ꪊh': roma = "ꪠ‍"; break;
        case 'ꪎ‍h': roma = "ꪍ"; break;
        case '\'s': roma = "ꪏ"; break;
        case 'ꪬj': roma = "ꪐ"; break;
        case '\'j': roma = "ꪑ"; break;
        case '\'d': roma = "ꪓ"; break;
        case '\'t': roma = "ꪕ"; break;
        case '\'z': roma = "ꪗ‍"; break;
        case 'ꪬn': roma = "ꪘ"; break;
        case '\'n': roma = "ꪙ"; break;
        case '\'b': roma = "ꪛ"; break;
        case '\'p': roma = "ꪝ"; break;
        case 'ꪌh': roma = "ꪞ"; break;
        case 'ꪜh': roma = "ꪟ"; break;
        case '\'f': roma = "ꪡ"; break;
        case 'ꪬm': roma = "ꪢ"; break;
        case '\'m': roma = "ꪣ"; break;
        case 'ꪬy': roma = "ꪤ‍"; break;
        case '\'y': roma = "ꪥ"; break;
        case 'ꪭr': roma = "ꪦ"; break;
        case '\'r': roma = "ꪧ"; break;
        case 'ꪬl': roma = "ꪨ"; break;
        case '\'l': roma = "ꪩ"; break;
        case 'ꪬv': roma = "ꪪ‍"; break;
        case '\'v': roma = "ꪫ‍"; break;
        case '\'o': roma = "ꪯ"; break;
        case 'ꪷn': roma = "ꪽ"; break;
        case 'ꪷm': roma = "ꪾ"; break;
        case '꪿h': roma = "ꫀ"; break;
        case '꫁h': roma = "ꫂ"; break;
        default: roma = t + tch; break;
    }
    return text.substring(0, text.length - alt) + roma;
}

function TAIYAI(text, ch) {
    var tch = "";
    switch (ch) {
        case '0': tch = "ႂ"; break;
        case '1': tch = "်"; break;
        case '2': tch = "ႇ"; break;
        case '3': tch = "ႈ"; break;
        case '4': tch = "း"; break;
        case '5': tch = "ႉ"; break;
        case '6': tch = "ႊ"; break;
        case '7': tch = "ဵ"; break;
        case '8': tch = "ႅ"; break;
        case '9': tch = "ႆ"; break;
        case 'a': tch = "ၢ"; break;
        case 'b': tch = "ပ"; break;
        case 'c': tch = "ၸ"; break;
        case 'd': tch = "တ"; break;
        case 'e': tch = "ေ"; break;
        case 'f': tch = "ႄ"; break;
        case 'g': tch = "င"; break;
        case 'h': tch = "ႁ"; break;
        case 'i': tch = "ိ"; break;
        case 'j': tch = "ၺ"; break;
        case 'k': tch = "ၵ"; break;
        case 'l': tch = "လ"; break;
        case 'm': tch = "မ"; break;
        case 'n': tch = "ၼ"; break;
        case 'o': tch = "ူ"; break;
        case 'p': tch = "ၽ"; break;
        case 'q': tch = "ဢ"; break;
        case 'r': tch = "ြ"; break;
        case 's': tch = "သ"; break;
        case 't': tch = "ထ"; break;
        case 'u': tch = "ု"; break;
        case 'v': tch = "ဝ"; break;
        case 'w': tch = "ွ"; break;
        case 'x': tch = "ၶ"; break;
        case 'y': tch = "ယ"; break;
        case 'z': tch = "ျ"; break;
        default: tch = ch; break;
    }
    if (text == "") {
        return tch;
    }

    var t = text[text.length - 1];
    var roma = t + ch;
    switch (roma) {
        case 'ၢa': roma = "ႃ"; break;
        case 'ိi': roma = "ီ"; break;
        case 'ၽh': roma = "ၾ"; break;
        case 'ြr': roma = "ရ"; break;
        case '\'h': roma = "ႁ"; break;
        case 'ၵh': roma = "ၷ"; break;
        case 'ၸh': roma = "ၹ"; break;
        case 'ပh': roma = "ၿ"; break;
        case 'တh': roma = "ၻ"; break;
        case 'သh': roma = "ႀ"; break;
        default: roma = t + tch; break;
    }
    return text.substring(0, text.length - 1) + roma;
}

function TAILE(text, ch) {
    var tch = "";
    switch (ch) {
        case '0': tch = "0"; break;
        case '1': tch = "ᥴ"; break;
        case '2': tch = "ᥰ"; break;
        case '3': tch = "ᥱ"; break;
        case '4': tch = "ᥲ"; break;
        case '5': tch = "ᥳ"; break;
        case '6': tch = "ᥨ"; break;
        case '7': tch = "ᥦ"; break;
        case '8': tch = "ᥪ"; break;
        case '9': tch = "ᥫ"; break;
        case 'a': tch = "ᥣ"; break;
        case 'b': tch = "ᥙ"; break;
        case 'c': tch = "ᥓ"; break;
        case 'd': tch = "ᥖ"; break;
        case 'e': tch = "ᥥ"; break;
        case 'f': tch = "ᥜ"; break;
        case 'g': tch = "ᥒ"; break;
        case 'h': tch = "ᥞ"; break;
        case 'i': tch = "ᥤ"; break;
        case 'j': tch = "ᥕ"; break;
        case 'k': tch = "ᥐ"; break;
        case 'l': tch = "ᥘ"; break;
        case 'm': tch = "ᥛ"; break;
        case 'n': tch = "ᥢ"; break;
        case 'o': tch = "ᥩ"; break;
        case 'p': tch = "ᥚ"; break;
        case 'q': tch = "ᥟ"; break;
        case 'r': tch = "ᥠ"; break;
        case 's': tch = "ᥔ"; break;
        case 't': tch = "ᥗ"; break;
        case 'u': tch = "ᥧ"; break;
        case 'v': tch = "ᥝ"; break;
        case 'w': tch = "ᥬ"; break;
        case 'x': tch = "ᥑ"; break;
        case 'y': tch = "ᥭ"; break;
        case 'z': tch = "ᥡ"; break;
        default: tch = ch; break;
    }
    if (text == "") {
        return tch;
    }

    var t = text[text.length - 1];
    var roma = t + ch;
    switch (roma) {
        case '01': roma = "́"; break;
        case '02': roma = "̈"; break;
        case '03': roma = "̌"; break;
        case '04': roma = "̀"; break;
        case '05': roma = "̇"; break;
        default: roma = t + tch; break;
    }
    return text.substring(0, text.length - 1) + roma;
}

function TAILUE(text, ch) {
    var tch = "";
    switch (ch) {
        case '0': tch = "ᦰ"; break;
        case '1': tch = "ᧈ"; break;
        case '2': tch = "ᧉ"; break;
        case '3': tch = "ᦹ"; break;
        case '4': tch = "᧞"; break;
        case '5': tch = "ᦷ"; break;
        case '6': tch = "ᦴ"; break;
        case '7': tch = "ᦺ"; break;
        case '8': tch = "ᦲ"; break;
        case '9': tch = "ᦸ"; break;
        case 'a': tch = "ᦱ"; break;
        case 'b': tch = "ᦢ"; break;
        case 'c': tch = "ᦈ"; break;
        case 'd': tch = "ᦡ"; break;
        case 'e': tch = "ᦵ"; break;
        case 'f': tch = "ᦚ"; break;
        case 'g': tch = "ᦇ"; break;
        case 'h': tch = "ᦠ"; break;
        case 'i': tch = "ᦏ"; break;
        case 'j': tch = "ᦆ"; break;
        case 'k': tch = "ᦂ"; break;
        case 'l': tch = "ᦟ"; break;
        case 'm': tch = "ᦙ"; break;
        case 'n': tch = "ᦓ"; break;
        case 'o': tch = "ᦀ"; break;
        case 'p': tch = "ᦔ"; break;
        case 'q': tch = "ᦅ"; break;
        case 'r': tch = "ᦣ"; break;
        case 's': tch = "ᦉ"; break;
        case 't': tch = "ᦎ"; break;
        case 'u': tch = "ᦳ"; break;
        case 'v': tch = "ᦞ"; break;
        case 'w': tch = "ᦕ"; break;
        case 'x': tch = "ᦃ"; break;
        case 'y': tch = "ᦊ"; break;
        case 'z': tch = "ᦌ"; break;
        default: tch = ch; break;
    }
    if (text == "") {
        return tch;
    }

    var t = text[text.length - 1];
    var roma = t + ch;
    switch (roma) {
        case '\'h': roma = "ᦠ"; break;
        case '\'n': roma = "ᦓ"; break;
        case '\'m': roma = "ᦙ"; break;
        case '\'g': roma = "ᦇ"; break;
        case '\'l': roma = "ᦟ"; break;
        case '\'v': roma = "ᦞ"; break;
        case '\'y': roma = "ᦊ"; break;
        case '\'a': roma = "᧚"; break;
        case 'ᦂh': roma = "ᧅ"; break;
        case 'ᦡh': roma = "ᧆ"; break;
        case 'ᦢh': roma = "ᧇ"; break;
        case 'ᦇh': roma = "ᧂ"; break;
        case 'ᦓh': roma = "ᧃ"; break;
        case 'ᦙh': roma = "ᧄ"; break;
        case 'ᦞh': roma = "ᧁ"; break;
        case '\'o': roma = "ᦁ"; break;
        case '\'j': roma = "ᦍ"; break;
        case '\'c': roma = "ᦋ"; break;
        case '\'t': roma = "ᦑ"; break;
        case '\'i': roma = "ᦒ"; break;
        case '\'p': roma = "ᦗ"; break;
        case '\'w': roma = "ᦘ"; break;
        case '\'f': roma = "ᦝ"; break;
        case '\'d': roma = "ᦤ"; break;
        case '\'b': roma = "ᦥ"; break;
        case 'ᦂv': roma = "ᦦ"; break;
        case 'ᦅv': roma = "ᦨ"; break;
        case 'ᦃv': roma = "ᦧ"; break;
        case 'ᦆv': roma = "ᦩ"; break;
        case 'ᦉv': roma = "ᦪ"; break;
        case 'ᦌv': roma = "ᦫ"; break;
        case '᧞v': roma = "᧟"; break;
        case 'ᦵe': roma = "ᦶ"; break;
        case '\'e': roma = "ᦵ"; break;
        case 'ᦱy': roma = "ᦻ"; break;
        case 'ᦴy': roma = "ᦼ"; break;
        case 'ᦞy': roma = "ᦽ"; break;
        case 'ᦸy': roma = "ᦾ"; break;
        case 'ᦹy': roma = "ᦿ"; break;
        case 'ᦲy': roma = "ᧀ"; break;
        case 'ᦠn': roma = "ᦐ"; break;
        case 'ᦠm': roma = "ᦖ"; break;
        case 'ᦠg': roma = "ᦄ"; break;
        case 'ᦠl': roma = "ᦜ"; break;
        case 'ᦠv': roma = "ᦛ"; break;
        case '\'0': roma = "᧐"; break;
        case '\'1': roma = "᧑"; break;
        case '\'2': roma = "᧒"; break;
        case '\'3': roma = "᧓"; break;
        case '\'4': roma = "᧔"; break;
        case '\'5': roma = "᧕"; break;
        case '\'6': roma = "᧖"; break;
        case '\'7': roma = "᧗"; break;
        case '\'8': roma = "᧘"; break;
        case '\'9': roma = "᧙"; break;
        default: roma = t + tch; break;
    }
    return text.substring(0, text.length - 1) + roma;
}

function LAIPAO(text, ch) {
    var tch = "";
    switch (ch) {
        case '0': tch = "𕊀"; break;
        case '1': tch = "𕊑"; break;
        case '2': tch = "𕊒"; break;
        case '3': tch = "𕊃"; break;
        case '4': tch = "𕊆"; break;
        case '5': tch = "𕊄"; break;
        case '6': tch = "𕊈"; break;
        case '7': tch = "𕊐"; break;
        case '8': tch = "𕊂"; break;
        case '9': tch = "𕊉"; break;
        case 'a': tch = "𕊁"; break;
        case 'b': tch = "𕉪"; break;
        case 'c': tch = "𕉚"; break;
        case 'd': tch = "𕉢"; break;
        case 'e': tch = "𕊅"; break;
        case 'f': tch = "𕉰"; break;
        case 'g': tch = "𕉙"; break;
        case 'h': tch = "𕉼"; break;
        case 'i': tch = "𕉜"; break;
        case 'j': tch = "𕉡"; break;
        case 'k': tch = "𕉐"; break;
        case 'l': tch = "𕉹"; break;
        case 'm': tch = "𕉳"; break;
        case 'n': tch = "𕉩"; break;
        case 'o': tch = "𕉾"; break;
        case 'p': tch = "𕉬"; break;
        case 'q': tch = "𕉖"; break;
        case 'r': tch = "𕉶"; break;
        case 's': tch = "𕉞"; break;
        case 't': tch = "𕉤"; break;
        case 'u': tch = "𕉒"; break;
        case 'v': tch = "𕉻"; break;
        case 'w': tch = "𕉮"; break;
        case 'x': tch = "𕉔"; break;
        case 'y': tch = "𕉵"; break;
        case 'z': tch = "𕉦"; break;
        default: tch = ch; break;
    }
    if (text == "") {
        return tch;
    }

    var t;
    var utf = 1;
    if ((text.charCodeAt(text.length - 1) >= 0xD800) && (text.charCodeAt(text.length - 1) <= 0xDFFF)) {
        t = text[text.length - 2].concat(text[text.length - 1]);
        utf = 2;
    }
    else
        t = text[text.length - 1];
    var roma = t + ch;
    switch (roma) {
        case '\'h': roma = "𕉽"; break;
        case '\'k': roma = "𕉑"; break;
        case '\'x': roma = "𕉕"; break;
        case '\'q': roma = "𕉗"; break;
        case '\'u': roma = "𕉓"; break;
        case '𕉼g': roma = "𕉘"; break;
        case '𕉼j': roma = "𕉠"; break;
        case '𕉼n': roma = "𕉨"; break;
        case '𕉼m': roma = "𕉲"; break;
        case '𕉼l': roma = "𕉸"; break;
        case '𕉼v': roma = "𕉺"; break;
        case '𕉼y': roma = "𕉴"; break;
        case '\'g': roma = "𕉙"; break;
        case '\'o': roma = "𕉿"; break;
        case '\'c': roma = "𕉛"; break;
        case '\'i': roma = "𕉝"; break;
        case '\'s': roma = "𕉟"; break;
        case '\'d': roma = "𕉣"; break;
        case '\'t': roma = "𕉥"; break;
        case '\'y': roma = "𕉵"; break;
        case '\'z': roma = "𕉧"; break;
        case '\'b': roma = "𕉫"; break;
        case '\'p': roma = "𕉭"; break;
        case '\'w': roma = "𕉯"; break;
        case '\'f': roma = "𕉱"; break;
        case '𕊑1': roma = "𕊝"; break;
        case '𕊒2': roma = "𕊞"; break;
        case '𕊃3': roma = "𕊋"; break;
        case '𕊆4': roma = "𕊍"; break;
        case '𕊄5': roma = "𕊌"; break;
        case '𕊈6': roma = "𕊖"; break;
        case '𕊐7': roma = "𕊔"; break;
        case '𕊂8': roma = "𕊊"; break;
        case '𕊉9': roma = "𕊕"; break;
        case '𕊀0': roma = "𕊜"; break;
        case '𕊅e': roma = "𕊇"; break;
        case '\'r': roma = "𕉷"; break;
        case '\'l': roma = "𕉹"; break;
        case '\'n': roma = "𕉩"; break;
        case '\'v': roma = "𕉻"; break;
        case '\'m': roma = "𕉳"; break;
        case '\'j': roma = "𕉡"; break;
        case '𕊀n': roma = "𕊎"; break;
        case '𕊀m': roma = "𕊏"; break;
        case '\'a': roma = "𕊟"; break;
        default: roma = t + tch; break;
    }
    return text.substring(0, text.length - utf) + roma;
}

function TAIYO(text, ch) {
    var tch = "";
    switch (ch) {
        case '0': tch = "𞛦"; break;
        case '1': tch = "𞛼"; break;
        case '2': tch = "𞛽"; break;
        case '3': tch = "𞛪"; break;
        case '4': tch = "𞛥"; break;
        case '5': tch = "𞛫"; break;
        case '6': tch = "𞛭"; break;
        case '7': tch = "𞛮"; break;
        case '8': tch = "𞛩"; break;
        case '9': tch = "𞛧"; break;
        case 'a': tch = "𞛠"; break;
        case 'b': tch = "𞛐"; break;
        case 'c': tch = "𞛆"; break;
        case 'd': tch = "𞛋"; break;
        case 'e': tch = "𞛨"; break;
        case 'f': tch = "𞛔"; break;
        case 'g': tch = "𞛅"; break;
        case 'h': tch = "𞛚"; break;
        case 'i': tch = "𞛡"; break;
        case 'j': tch = "𞛉"; break;
        case 'k': tch = "𞛀"; break;
        case 'l': tch = "𞛘"; break;
        case 'm': tch = "𞛖"; break;
        case 'n': tch = "𞛏"; break;
        case 'o': tch = "𞛬"; break;
        case 'p': tch = "𞛑"; break;
        case 'q': tch = "𞛜"; break;
        case 'r': tch = "𞛣"; break;
        case 's': tch = "𞛇"; break;
        case 't': tch = "𞛌"; break;
        case 'u': tch = "𞛤"; break;
        case 'v': tch = "𞛙"; break;
        case 'w': tch = "𞛓"; break;
        case 'x': tch = "𞛂"; break;
        case 'y': tch = "𞛗"; break;
        case 'z': tch = "𞛎"; break;
        default: tch = ch; break;
    }
    if (text == "") {
        return tch;
    }
    var t;
    var utf = 1;
    if ((text.charCodeAt(text.length - 1) >= 0xD800) && (text.charCodeAt(text.length - 1) <= 0xDFFF)) {
        t = text[text.length - 2].concat(text[text.length - 1]);
        utf = 2;
    }
    else
        t = text[text.length - 1];
    var roma = t + ch;
    switch (roma) {
        case '\'h': roma = "𞛛"; break;
        case '\'k': roma = "𞛁"; break;
        case '\'x': roma = "𞛃"; break;
        case '\'f': roma = "𞛕"; break;
        case '\'w': roma = "𞛷"; break;
        case '\'c': roma = "𞛟"; break;
        case '\'s': roma = "𞛈"; break;
        case '\'t': roma = "𞛍"; break;
        case '\'z': roma = "𞛶"; break;
        case '\'p': roma = "𞛒"; break;
        case '\'b': roma = "𞛹"; break;
        case '\'d': roma = "𞛸"; break;
        case '\'q': roma = "𞛻"; break;
        case '\'y': roma = "𞛺"; break;
        case '\'j': roma = "𞛊"; break;
        case '𞛬o': roma = "𞜎"; break;
        case '𞛦0': roma = "𞛵"; break;
        case '𞛦d': roma = "𞛳"; break;
        case '𞛦b': roma = "𞛴"; break;
        case '𞛦k': roma = "𞛲"; break;
        case '𞛦n': roma = "𞛰"; break;
        case '𞛦m': roma = "𞛱"; break;
        case '𞛦g': roma = "𞛯"; break;
        case '\'v': roma = "𞛙"; break;
        case '\'l': roma = "𞛘"; break;
        case '\'m': roma = "𞛖"; break;
        case '\'n': roma = "𞛏"; break;
        case '\'g': roma = "𞛅"; break;
        case '𞛀v': roma = "𞛝"; break;
        case '𞛁v': roma = "𞛞"; break;
        case '\'o': roma = "𞛿"; break;
        case '\'a': roma = "𞛾"; break;
        case '\'e': roma = "𞜇"; break;
        case '\'r': roma = "𞜆"; break;
        case '\'u': roma = "𞜋"; break;
        case '\'i': roma = "𞜊"; break;
        case '\'9': roma = "𞜏"; break;
        case '𞛂h': roma = "𞜈"; break;
        case '𞛎h': roma = "𞜉"; break;
        case '𞛀h': roma = "𞛄"; break;
        case '𞛅h': roma = "𞜅"; break;
        default: roma = t + tch; break;
    }
    return text.substring(0, text.length - utf) + roma;
}

function TAIAHOM(text, ch) {
    var tch = "";
    switch (ch) {
        case '0': tch = "𑜠"; break;
        case '1': tch = "𑜜"; break;
        case '2': tch = "𑜬"; break;
        case '3': tch = "𑜭"; break;
        case '4': tch = "𑜮"; break;
        case '5': tch = "𑜯"; break;
        case '6': tch = "𑜞"; break;
        case '7': tch = "𑜩"; break;
        case '8': tch = "𑜪"; break;
        case '9': tch = "𑜫"; break;
        case 'a': tch = "𑜡"; break;
        case 'b': tch = "𑜈"; break;
        case 'c': tch = "𑜋"; break;
        case 'd': tch = "𑜓"; break;
        case 'e': tch = "𑜦"; break;
        case 'f': tch = "𑜇"; break;
        case 'g': tch = "𑜂"; break;
        case 'h': tch = "𑜑"; break;
        case 'i': tch = "𑜢"; break;
        case 'j': tch = "𑜐"; break;
        case 'k': tch = "𑜀"; break;
        case 'l': tch = "𑜎"; break;
        case 'm': tch = "𑜉"; break;
        case 'n': tch = "𑜃"; break;
        case 'o': tch = "𑜨"; break;
        case 'p': tch = "𑜆"; break;
        case 'q': tch = "𑜕"; break;
        case 'r': tch = "𑜍"; break;
        case 's': tch = "𑜏"; break;
        case 't': tch = "𑜄"; break;
        case 'u': tch = "𑜤"; break;
        case 'v': tch = "𑜒"; break;
        case 'w': tch = "𑜧"; break;
        case 'x': tch = "𑜁"; break;
        case 'y': tch = "𑜊"; break;
        case 'z': tch = "𑜌"; break;
        default: tch = ch; break;
    }
    if (text == "") {
        return tch;
    }
    var t;
    var utf = 1;
    if ((text.charCodeAt(text.length - 1) >= 0xD800) && (text.charCodeAt(text.length - 1) <= 0xDFFF)) {
        t = text[text.length - 2].concat(text[text.length - 1]);
        utf = 2;
    }
    else
        t = text[text.length - 1];
    var roma = t + ch;
    switch (roma) {
        case '𑜌z': roma = "𑜔"; break;
        case '𑜁x': roma = "𑜗"; break;
        case '𑜇f': roma = "𑜘"; break;
        case '𑜊y': roma = "𑜙"; break;
        case '\'0': roma = "𑜰"; break;
        case '\'1': roma = "𑜱"; break;
        case '\'2': roma = "𑜲"; break;
        case '\'3': roma = "𑜳"; break;
        case '\'4': roma = "𑜴"; break;
        case '\'5': roma = "𑜵"; break;
        case '\'6': roma = "𑜶"; break;
        case '\'7': roma = "𑜷"; break;
        case '\'8': roma = "𑜸"; break;
        case '\'9': roma = "𑜹"; break;
        case '\'s': roma = "𑜺"; break;
        case '\'w': roma = "𑜻"; break;
        case '\'a': roma = "𑜾"; break;
        case '\'v': roma = "𑜿"; break;
        case '\'o': roma = "𑜼"; break;
        case '\'p': roma = "𑜽"; break;
        case '𑜤u': roma = "𑜥"; break;
        case '𑜢i': roma = "𑜣"; break;
        case '𑜎l': roma = "𑜝"; break;
        case '𑜍r': roma = "𑜟"; break;
        case '𑜄t': roma = "𑜅"; break;
        case '𑜕q': roma = "𑜖"; break;
        case '𑜈b': roma = "𑜚"; break;
        case '\'z': roma = "𑜌"; break;
        case '\'x': roma = "𑜁"; break;
        case '\'f': roma = "𑜇"; break;
        case '\'y': roma = "𑜊"; break;
        case '\'u': roma = "𑜤"; break;
        case '\'i': roma = "𑜢"; break;
        case '\'l': roma = "𑜎"; break;
        case '\'r': roma = "𑜍"; break;
        case '\'t': roma = "𑜄"; break;
        case '\'q': roma = "𑜕"; break;
        case '\'b': roma = "𑜈"; break;
        default: roma = t + tch; break;
    }
    return text.substring(0, text.length - utf) + roma;
}

function TELEX(text, ch, ethn) {
    if (text.length == 0)
        return text + ch;
    var nc;
    var qu = -1;
    var gi = -1;
    var a = text;
    if (text.startsWith("qu"))
        qu = 1;
    if (text.startsWith("gi"))
        gi = qu = 1;
    var l = text.length - 1;
    if (l > 0) {
        switch (a[l]) {
            case 'y':
                switch (a[l - 1]) {
                    case 'a':
                    case 'â':
                        l--;
                        break;
                }
                break;
            case 'a':
                switch (a[l - 1]) {
                    case 'i':
                        if (gi == -1)
                            l--;
                        break;
                    case 'u':
                        if (ch == 'a')
                            break;
                    case 'ư':
                        if ((qu == -1) || (gi != -1))
                            l--;
                        break;
                    case 'y':
                            l--;
                        break;
                }
                break;
            case 'o':
            case 'ư':
                if ((a[l - 1] == 'u') || (a[l - 1] == 'i'))
                    break;
            case 'u':
                if ((gi == 1) && (a[l - 1] == 'i'))
                    break;
            case 'i':
                if ((qu == 1) && (gi == -1) && (a[l - 1] == 'u'))
                    break;
				nc = mcTELEX(a[l - 1], ch, ethn);
				if (nc=="")
					return a.substring(0, l - 1) + a.substring(l);
                if (a[l - 1] != nc) {
                    a = a.substring(0, l - 1) + nc + a.substring(l);
                    return a;
                }
                break;
        }
    }
    var i;
    for (i=l; i!=qu; i--) {
            nc = mcTELEX(a[i], ch, ethn);
			if (nc=="")
				return a.substring(0, i) + a.substring(i + 1);
            if (a[i]!=nc) {
                a = a.substring(0, i) + nc + a.substring(i + 1);
                if (oo) {
                    oo = false;
                    return (a + 'o');
                }
                return a;
            }
    }
    if (qu == 1) {
        nc = mcTELEX(a[1], ch, ethn);
		if (nc=="")
			return a.substring(0, 1) + a.substring(1 + 1);
        if (a[1] != nc) {
            a = a.substring(0, 1) + nc + a.substring(1 + 1);
            return a;
        }
    }
    return text + ch;
}

function mcTELEX(c, m, ethn) {
    switch (m) {
        case 'd':
            if (c == 'd') return 'đ';
            break;
        case 'a':
            if (c == 'a') return 'â';
            break;
        case 'e':
            if (c == 'e') return 'ê';
            break;
        case 'o':
            if (c == 'o') return 'ô';
            if (c == 'ô') { oo = true; return 'o'; }
            break;
        case 'w':
            if (c == 'a') return 'ă';
            if (c == 'o') return 'ơ';
            if (c == 'u') return 'ư';
            break;
        case 's':
            if (c == 'a') return 'á';
            if (c == 'e') return 'é';
            if (c == 'i') return 'í';
            if (c == 'o') return 'ó';
            if (c == 'u') return 'ú';
            if (c == 'â') return 'ấ';
            if (c == 'ă') return 'ắ';
            if (c == 'ô') return 'ố';
            if (c == 'ê') return 'ế';
            if (c == 'ư') return 'ứ';
            if (c == 'ơ') return 'ớ';
            if (c == 'y') return 'ý';
            break;
        case 'f':
            if (c == 'a') return 'à';
            if (c == 'e') return 'è';
            if (c == 'i') return 'ì';
            if (c == 'o') return 'ò';
            if (c == 'u') return 'ù';
            if (c == 'â') return 'ầ';
            if (c == 'ă') return 'ằ';
            if (c == 'ô') return 'ồ';
            if (c == 'ê') return 'ề';
            if (c == 'ư') return 'ừ';
            if (c == 'ơ') return 'ờ';
            if (c == 'y') return 'ỳ';
            break;
        case 'j':
            if (c == 'a') return 'ạ';
            if (c == 'e') return 'ẹ';
            if (c == 'i') return 'ị';
            if (c == 'o') return 'ọ';
            if (c == 'u') return 'ụ';
            if (c == 'â') return 'ậ';
            if (c == 'ă') return 'ặ';
            if (c == 'ô') return 'ộ';
            if (c == 'ê') return 'ệ';
            if (c == 'ư') return 'ự';
            if (c == 'ơ') return 'ợ';
            if (c == 'y') return 'ỵ';
            break;
        case 'x':
            if (c == 'a') return 'ã';
            if (c == 'e') return 'ẽ';
            if (c == 'i') return 'ĩ';
            if (c == 'o') return 'õ';
            if (c == 'u') return 'ũ';
            if (c == 'â') return 'ẫ';
            if (c == 'ă') return 'ẵ';
            if (c == 'ô') return 'ỗ';
            if (c == 'ê') return 'ễ';
            if (c == 'ư') return 'ữ';
            if (c == 'ơ') return 'ỡ';
            if (c == 'y') return 'ỹ';
            break;
        case 'r':
            if (c == 'a') return 'ả';
            if (c == 'e') return 'ẻ';
            if (c == 'i') return 'ỉ';
            if (c == 'o') return 'ỏ';
            if (c == 'u') return 'ủ';
            if (c == 'â') return 'ẩ';
            if (c == 'ă') return 'ẳ';
            if (c == 'ô') return 'ổ';
            if (c == 'ê') return 'ể';
            if (c == 'ư') return 'ử';
            if (c == 'ơ') return 'ở';
            if (c == 'y') return 'ỷ';
            break;
        case 'v':
            if (ethn==1)
            {
                if(c=='a') return "a̱";
                if(c=='e') return "e̱";
                if(c=='i') return "i̱";
                if(c=='o') return "o̱";
                if(c=='u') return "u̱";
                if(c=='â') return "â̱";
                if(c=='ă') return "ă̱";
                if(c=='ô') return "ô̱";
                if(c=='ê') return "ê̱";
                if(c=='ư') return "ư̱";
                if(c=='ơ') return "ơ̱";
                if(c=='y') return "y̱";
            }
            break;
		case 'z':
            switch (c) {
                case 'á': case 'à': case 'ả': case 'ã': case 'ạ':
                    return 'a';
                case 'ấ': case 'ầ': case 'ẩ': case 'ẫ': case 'ậ':
                    return 'â';
                case 'ắ': case 'ằ': case 'ẳ': case 'ẵ': case 'ặ':
                    return 'ă';
                case 'é': case 'è': case 'ẻ': case 'ẽ': case 'ẹ':
                    return 'e';
                case 'ế': case 'ề': case 'ể': case 'ễ': case 'ệ':
                    return 'ê';
                case 'í': case 'ì': case 'ỉ': case 'ĩ': case 'ị':
                    return 'i';
                case 'ó': case 'ò': case 'ỏ': case 'õ': case 'ọ':
                    return 'o';
                case 'ố': case 'ồ': case 'ổ': case 'ỗ': case 'ộ':
                    return 'ô';
                case 'ớ': case 'ờ': case 'ở': case 'ỡ': case 'ợ':
                    return 'ơ';
                case 'ú': case 'ù': case 'ủ': case 'ũ': case 'ụ':
                    return 'u';
                case 'ứ': case 'ừ': case 'ử': case 'ữ': case 'ự':
                    return 'ư';
                case 'ý': case 'ỳ': case 'ỷ': case 'ỹ': case 'ỵ':
                    return 'y';
				case '̱':
					return "";
            }
            break;
    }
    return c;
}

function PINYIN(text, ch) {
    if (text == "")
        return text + ch;
    if (ch == "v")
        return text + 'ü';
    if (!isNaN(ch)) {
        if (ch == '5') {
            var a = text;
            var i = 0;
            for (i = text.length - 1; i >= 0; i--) {
                if ("áàǎāéèěēóòôǒōúùǔūüǘǜǚǖíìǐīńǹ̂̌̄̈ḿ̂̌̄̀".indexOf(a[i]) > -1) {
                    var ns = text.replace(a[i], mcPINYIN(a[i], ch));
                    return ns;
                }
            }
            return text;
        }
        var ns;
        ns = text.replace("a", mcPINYIN("a", ch));
        if (text != ns)
            return ns;
        ns = text.replace("e", mcPINYIN("e", ch));
        if (text != ns)
            return ns;
        ns = text.replace("o", mcPINYIN("o", ch));
        if (text != ns)
            return ns;
        ns = text.replace("ui", mcPINYIN("y", ch));
        if (text != ns)
            return ns;
        ns = text.replace("u", mcPINYIN("u", ch));
        if (text != ns)
            return ns;
        ns = text.replace("i", mcPINYIN("i", ch));
        if (text != ns)
            return ns;
        ns = text.replace("ü", mcPINYIN("ü", ch));
        if (text != ns)
            return ns;
        ns = text.replace("m", mcPINYIN("m", ch));
        if (text != ns)
            return ns;
        ns = text.replace("n", mcPINYIN("n", ch));
        if (text != ns)
            return ns;
    }
    return text + ch;
}

function mcPINYIN(c, m) {
    if (m == '5') {
        switch (c) {
            case 'á': case 'à': case 'ǎ': case 'ā':
                return "a";
            case 'é': case 'è': case 'ě': case 'ē':
                return "e";
            case 'ó': case 'ò': case 'ǒ': case 'ō':
                return "o";
            case 'ú': case 'ù': case 'ǔ': case 'ū':
                return "u";
            case 'ǘ': case 'ǜ': case 'ǚ': case 'ǖ':
                return "ü";
            case 'í': case 'ì': case 'ǐ': case 'ī':
                return "i";
            case 'ń': case 'ǹ':
                return "n";
            case '̂': case '̌': case '̄': case '̀':
                return "";
            case 'ḿ':
                return "m";
        }
    }
    switch (c) {
        case 'a':
            if (m == '2') return "á";
            if (m == '4') return "à";
            if (m == '3') return "ǎ";
            if (m == '1') return "ā";
            break;
        case 'e':
            if (m == '2') return "é";
            if (m == '4') return "è";
            if (m == '3') return "ě";
            if (m == '1') return "ē";
            break;
        case 'o':
            if (m == '2') return "ó";
            if (m == '4') return "ò";
            if (m == '3') return "ǒ";
            if (m == '1') return "ō";
            break;
        case 'y':
            if (m == '2') return "uí";
            if (m == '4') return "uì";
            if (m == '3') return "uǐ";
            if (m == '1') return "uī";
            return "ui";
        case 'u':
            if (m == '2') return "ú";
            if (m == '4') return "ù";
            if (m == '3') return "ǔ";
            if (m == '1') return "ū";
            break;
        case 'i':
            if (m == '2') return "í";
            if (m == '4') return "ì";
            if (m == '3') return "ǐ";
            if (m == '1') return "ī";
            break;
        case 'ü':
            if (m == '2') return "ǘ";
            if (m == '4') return "ǜ";
            if (m == '3') return "ǚ";
            if (m == '1') return "ǖ";
            break;
        case 'n':
            if (m == '2') return "ń";
            if (m == '4') return "ǹ";
            if (m == '3') return "ň";
            if (m == '1') return "n̄";
            break;
        case 'm':
            if (m == '2') return "ḿ";
            if (m == '4') return "m̀";
            if (m == '3') return "m̌";
            if (m == '1') return "m̄";
            break;
    }
    return c;
}

function KEMMUN(text, ch) {
    if (text == "")
        return text + ch;
    
	nc = mcKEMMUN(text[text.length-1], ch);
	return text.substring(0, text.length-1) + nc;
}

function mcKEMMUN(c, m) {
    switch (m) {
        case 'a':
            if (c == 'a') return 'â';
            break;
        case 'e':
            if (c == 'e') return 'ê';
            break;
        case 'o':
            if (c == 'o') return 'ô';
            break;
        case 'w':
            if (c == 'a') return 'ă';
            if (c == 'o') return 'ŏ';
            if (c == 'u') return 'ŭ';
            if (c == 'i') return 'ĭ';
            if (c == 'e') return 'ĕ';
            break;
    }
    return c+m;
}

function YANGPINYIN(text, ch) {
    if (text == "")
        return text + ch;
    if (!isNaN(ch)) {
        if (ch == '4') {
            var a = text;
            var i = 0;
            for (i = text.length - 1; i >= 0; i--) {
                if ("áàâéèêóòôúùûíìî".indexOf(a[i]) > -1) {
                    var ns = text.replace(a[i], mcYANGPINYIN(a[i], ch));
                    return ns;
                }
            }
            return text;
        }
        var ns;
        ns = text.replace("oa", mcYANGPINYIN("ã", ch));
        if (text != ns)
            return ns;
        ns = text.replace("oi", mcYANGPINYIN("ĩ", ch));
        if (text != ns)
            return ns;
        ns = text.replace("ui", mcYANGPINYIN("ỹ", ch));
        if (text != ns)
            return ns;
        ns = text.replace("oe", mcYANGPINYIN("ẽ", ch));
        if (text != ns)
            return ns;
        ns = text.replace("a", mcYANGPINYIN("a", ch));
        if (text != ns)
            return ns;
        ns = text.replace("e", mcYANGPINYIN("e", ch));
        if (text != ns)
            return ns;
        ns = text.replace("o", mcYANGPINYIN("o", ch));
        if (text != ns)
            return ns;
        ns = text.replace("u", mcYANGPINYIN("u", ch));
        if (text != ns)
            return ns;
        ns = text.replace("i", mcYANGPINYIN("i", ch));
        if (text != ns)
            return ns;
    }
    return text + ch;
}

function NONGLAT(text, ch) {
    if (text == "")
        return text + ch;
    if ((ch == 'd') && (text[text.length - 1] == 'd')) {
        return text.replace(/.$/,"đ");
    }
    if ((ch == 'u') && (text[text.length - 1] == 'u')) {
        return text.replace(/.$/, "ư");
    }
    if (!isNaN(ch)) {
        if (ch == '0') {
            var a = text;
            var i = 0;
            for (i = text.length - 1; i >= 0; i--) {
                if ("äëïöüǎěǐǒǔāēīōū".indexOf(a[i]) > -1) {
                    var ns = text.replace(a[i], mcNONGLAT(a[i], ch));
                    return ns;
                }
                if ("̤̬̱̈̌̄".indexOf(a[i]) > -1) {
                    var ns = text.replace(a[i],"");
                    return ns;
                }
            }
            return text;
        }
        var ns;
        ns = text.replace("aư", mcNONGLAT("a", ch) + "ư");
        if (text != ns)
            return ns;
        ns = text.replace("ei", mcNONGLAT("e", ch) + "i");
        if (text != ns)
            return ns;
        ns = text.replace("ou", mcNONGLAT("o", ch) + "u");
        if (text != ns)
            return ns;
        ns = text.replaceLast("a", mcNONGLAT("a", ch));
        if (text != ns)
            return ns;
        ns = text.replaceLast("e", mcNONGLAT("e", ch));
        if (text != ns)
            return ns;
        ns = text.replaceLast("o", mcNONGLAT("o", ch));
        if (text != ns)
            return ns;
        ns = text.replaceLast("u", mcNONGLAT("u", ch));
        if (text != ns)
            return ns;
        ns = text.replaceLast("i", mcNONGLAT("i", ch));
        if (text != ns)
            return ns;
        ns = text.replaceLast("ư", mcNONGLAT("ư", ch));
        if (text != ns)
            return ns;
    }
    return text + ch;
}

function mcNONGLAT(c, m) {
    if (m == '0') {
        switch (c) {
            case 'ä': case 'ǎ': case 'ā':
                return "a";
            case 'ë': case 'ě': case 'ē':
                return "e";
            case 'ö': case 'ǒ': case 'ō':
                return "o";
            case 'ü': case 'ǔ': case 'ū':
                return "u";
            case 'ï': case 'ǐ': case 'ī':
                return "i";
        }
    }
    if (m == '4') return c + "̤";
    if (m == '5') return c + "̬";
    if (m == '6') return c + "̱";
    switch (c) {
        case 'ã':
            if (m == '1') return "äư";
            if (m == '2') return "ǎư";
            if (m == '3') return "āư";
            return "oa";
        case 'ĩ':
            if (m == '1') return "ëi";
            if (m == '2') return "ěi";
            if (m == '3') return "ēi";
            return "oi";
        case 'ũ':
            if (m == '1') return "öu";
            if (m == '2') return "ǒu";
            if (m == '3') return "ōu";
            return "oe";
        case 'a':
            if (m == '1') return "ä";
            if (m == '2') return "ǎ";
            if (m == '3') return "ā";
            break;
        case 'e':
            if (m == '1') return "ë";
            if (m == '2') return "ě";
            if (m == '3') return "ē";
            break;
        case 'o':
            if (m == '1') return "ö";
            if (m == '2') return "ǒ";
            if (m == '3') return "ō";
            break;
        case 'u':
            if (m == '1') return "ü";
            if (m == '2') return "ǔ";
            if (m == '3') return "ū";
            break;
        case 'i':
            if (m == '1') return "ï";
            if (m == '2') return "ǐ";
            if (m == '3') return "ī";
            break;
        case 'ư':
            if (m == '1') return "ư̈";
            if (m == '2') return "ư̌";
            if (m == '3') return "ư̄";
            break;
    }
    return c;
}



function mcYANGPINYIN(c, m) {
    if (m == '4') {
        switch (c) {
            case 'á': case 'à': case 'â':
                return "a";
            case 'é': case 'è': case 'ě':
                return "e";
            case 'ó': case 'ò': case 'ô':
                return "o";
            case 'ú': case 'ù': case 'û':
                return "u";
            case 'í': case 'ì': case 'î':
                return "i";
        }
    }
    switch (c) {
        case 'ã':
            if (m == '1') return "oá";
            if (m == '2') return "oà";
            if (m == '3') return "oâ";
            return "oa";
        case 'ĩ':
            if (m == '1') return "oí";
            if (m == '2') return "oì";
            if (m == '3') return "oî";
            return "oi";
        case 'ỹ':
            if (m == '1') return "uí";
            if (m == '2') return "uì";
            if (m == '3') return "uî";
            return "oi";
        case 'ẽ':
            if (m == '1') return "oé";
            if (m == '2') return "oè";
            if (m == '3') return "oê";
            return "oe";
        case 'a':
            if (m == '1') return "á";
            if (m == '2') return "à";
            if (m == '3') return "â";
            break;
        case 'e':
            if (m == '1') return "é";
            if (m == '2') return "è";
            if (m == '3') return "ê";
            break;
        case 'o':
            if (m == '1') return "ó";
            if (m == '2') return "ò";
            if (m == '3') return "ô";
            break;
        case 'u':
            if (m == '1') return "ú";
            if (m == '2') return "ù";
            if (m == '3') return "û";
            break;
        case 'i':
            if (m == '1') return "í";
            if (m == '2') return "ì";
            if (m == '3') return "î";
            break;
    }
    return c;
}

function KANA(text, ch) {
    if (text == "") {
        switch (ch) {
            case 'a': return "あ";
            case 'i': return "い";
            case 'u': return "う";
            case 'e': return "え";
            case 'o': return "お";
            case 'q': return "っ";
            case 'l': return "ん";
            case '1': return "゙";
            case '2': return "゚";
            case '8': return "ゝ";
            case '9': return "ゞ";
            case '`': return "々";
            default: return ch;
        }
    }

    var t = text[text.length - 1];
    var tcode = text.charCodeAt(text.length - 1);
    var roma = "";

    if (tcode > 0x3040) {
        switch (ch) {
            case 'a': return text + "あ";
            case 'i': return text + "い";
            case 'u': return text + "う";
            case 'e': return text + "え";
            case 'o': return text + "お";
            case 'q': return text + "っ";
            case 'l': return text + "ん";
            case '1': return text + "゙";
            case '2': return text + "゚";
            case '8': return text + "ゝ";
            case '9': return text + "ゞ";
            case '`': return text + "々";
            default: return text + ch;
        }
    }

    var text2 = "";
    if (text.length == 1) {
        roma = text + ch;
    } else {
        var t2 = text[text.length - 2];
        var tcode2 = text.charCodeAt(text.length - 2);
        if (tcode2 < 0x0080) {
            text2 = text.substring(0, text.length - 2);
            roma = t2 + t + ch;
        } else {
            text2 = text.substring(0, text.length - 1);
            roma = t + ch;
        }
    }
    switch (roma) {
            case 'ka': return text2 + "か";
            case 'ga': return text2 + "が";
            case 'ki': return text2 + "き";
            case 'gi': return text2 + "ぎ";
            case 'ku': return text2 + "く";
            case 'gu': return text2 + "ぐ";
            case 'ke': return text2 + "け";
            case 'ge': return text2 + "げ";
            case 'ko': return text2 + "こ";
            case 'go': return text2 + "ご";
            case 'sa': return text2 + "さ";
            case 'za': return text2 + "ざ";
            case 'shi': return text2 + "し";
            case 'ji': return text2 + "じ";
            case 'su': return text2 + "す";
            case 'zu': return text2 + "ず";
            case 'se': return text2 + "せ";
            case 'ze': return text2 + "ぜ";
            case 'so': return text2 + "そ";
            case 'zo': return text2 + "ぞ";
            case 'ta': return text2 + "た";
            case 'da': return text2 + "だ";
            case 'chi': return text2 + "ち";
            case 'ji': return text2 + "ぢ";
        case 'zi': return text2 + "ぢ";
            case 'ti': return text2 + "ち";
            case 'di': return text2 + "ぢ";
            case 'tsu': return text2 + "つ";
        case 'dzu': return text2 + "づ";
        case 'du': return text2 + "づ";
            case 'te': return text2 + "て";
            case 'de': return text2 + "で";
            case 'to': return text2 + "と";
            case 'do': return text2 + "ど";
            case 'na': return text2 + "な";
            case 'ni': return text2 + "に";
            case 'nu': return text2 + "ぬ";
            case 'ne': return text2 + "ね";
            case 'no': return text2 + "の";
            case 'ha': return text2 + "は";
            case 'ba': return text2 + "ば";
            case 'pa': return text2 + "ぱ";
            case 'hi': return text2 + "ひ";
            case 'bi': return text2 + "び";
            case 'pi': return text2 + "ぴ";
            case 'fu': return text2 + "ふ";
            case 'hu': return text2 + "ふ";
            case 'bu': return text2 + "ぶ";
            case 'pu': return text2 + "ぷ";
            case 'he': return text2 + "へ";
            case 'be': return text2 + "べ";
            case 'pe': return text2 + "ぺ";
            case 'ho': return text2 + "ほ";
            case 'bo': return text2 + "ぼ";
            case 'po': return text2 + "ぽ";
            case 'ma': return text2 + "ま";
            case 'mi': return text2 + "み";
            case 'mu': return text2 + "む";
            case 'me': return text2 + "め";
            case 'mo': return text2 + "も";
            case 'ya': return text2 + "や";
            case 'yu': return text2 + "ゆ";
            case 'yo': return text2 + "よ";
            case 'ra': return text2 + "ら";
            case 'ri': return text2 + "り";
            case 'ru': return text2 + "る";
            case 're': return text2 + "れ";
            case 'ro': return text2 + "ろ";
            case 'wa': return text2 + "わ";
            case 'wi': return text2 + "ゐ";
            case 'we': return text2 + "ゑ";
            case 'wo': return text2 + "を";
            case 'vu': return text2 + "ゔ";
        case 'xa': return text2 + "ぁ";
        case 'xi': return text2 + "ぃ";
        case 'xe': return text2 + "ぇ";
        case 'xo': return text2 + "ぉ";
        case 'xu': return text2 + "ぅ";
        case 'xya': return text2 + "ゃ";
        case 'xyo': return text2 + "ょ";
        case 'xyu': return text2 + "ゅ";
        case 'xwa': return text2 + "ゎ";
        case 'wwa': return text2 + "うゎ";
        case 'wwo': return text2 + "うぉ";
        case 'wwi': return text2 + "うぃ";
        case 'wwe': return text2 + "うぇ";
        case 'wyi': return text2 + "ゑぃ";
        case 'kya': return text2 + "きゃ";
        case 'kyo': return text2 + "きょ";
        case 'kyu': return text2 + "きゅ";
        case 'gya': return text2 + "ぎゃ";
        case 'gyo': return text2 + "ぎょ";
        case 'gyu': return text2 + "ぎゅ";
        case 'sha': return text2 + "しゃ";
        case 'sho': return text2 + "しょ";
        case 'shu': return text2 + "しゅ";
        case 'she': return text2 + "しぇ";
        case 'ja': return text2 + "じゃ";
        case 'jo': return text2 + "じょ";
        case 'ju': return text2 + "じゅ";
        case 'je': return text2 + "じぇ";
        case 'cha': return text2 + "ちゃ";
        case 'cho': return text2 + "ちょ";
        case 'chu': return text2 + "ちゅ";
        case 'che': return text2 + "ちぇ";
        case 'nya': return text2 + "にゃ";
        case 'nyo': return text2 + "にょ";
        case 'nyu': return text2 + "にゅ";
        case 'hya': return text2 + "ひゃ";
        case 'hyo': return text2 + "ひょ";
        case 'hyu': return text2 + "ひゅ";
        case 'bya': return text2 + "びゃ";
        case 'byo': return text2 + "びょ";
        case 'byu': return text2 + "びゅ";
        case 'pya': return text2 + "ぴゃ";
        case 'pyo': return text2 + "ぴょ";
        case 'pyu': return text2 + "ぴゅ";
        case 'mya': return text2 + "みゃ";
        case 'myo': return text2 + "みょ";
        case 'myu': return text2 + "みゅ";
        case 'rya': return text2 + "りゃ";
        case 'ryo': return text2 + "りょ";
        case 'ryu': return text2 + "りゅ";
        case 'wi': return text2 + "ゐ";
        case 'wu': return text2 + "をぅ";
        case 'we': return text2 + "ゑ";
        case 'yi': return text2 + "いぃ";
        case 'ye': return text2 + "いぇ";
        case 'swi': return text2 + "すぃ";
        case 'zwi': return text2 + "ずぃ";
        case 'twi': return text2 + "てぃ";
        case 'dwi': return text2 + "でぃ";
        case 'twu': return text2 + "とぅ";
        case 'dwu': return text2 + "どぅ";
        case 'kwa': return text2 + "くぁ";
        case 'kwi': return text2 + "くぃ";
        case 'kwe': return text2 + "くぇ";
        case 'kwo': return text2 + "くぉ";
        case 'gwa': return text2 + "ぐぁ";
        case 'gwi': return text2 + "ぐぃ";
        case 'gwe': return text2 + "ぐぇ";
        case 'gwo': return text2 + "ぐぉ";
        case 'kva': return text2 + "くゎ";
        case 'gva': return text2 + "ぐゎ";
        case 'va': return text2 + "ゔぁ";
        case 'vi': return text2 + "ゔぃ";
        case 've': return text2 + "ゔぇ";
        case 'vo': return text2 + "ゔぉ";
        case 'vwa': return text2 + "ゔゎ";
        case 'tsa': return text2 + "つぁ";
        case 'tsi': return text2 + "つぃ";
        case 'tse': return text2 + "つぇ";
        case 'tso': return text2 + "つぉ";
        case 'fa': return text2 + "ふぁ";
        case 'fi': return text2 + "ふぃ";
        case 'fe': return text2 + "ふぇ";
        case 'fo': return text2 + "ふぉ";
            default: return text2 + roma;
    }
}

function HANGUL(text, ch) {
    switch (ch) {
        case '1': ch = "〮"; return text + ch;
        case '2': ch = "〯"; return text + ch;
        case '4':
            ch = 'ᅠ';
            if (text.length > 0)
                if (((text.charCodeAt(0) >= 0x1100) && (text.charCodeAt(0) <= 0x115E)) || ((text.charCodeAt(0) >= 0xA960) && (text.charCodeAt(0) <= 0xA97F)))
                    return text + ch;
        default: break;
    }
    if (text == "") {
        switch (ch) {
            case 'g': return "ㄱ";
            case 'n': return "ㄴ";
            case 'd': return "ㄷ";
            case 'l': return "ㄹ";
            case 'm': return "ㅁ";
            case 'b': return "ㅂ";
            case 's': return "ㅅ";
            case 'q': return "ㅇ";
            case 'j': return "ㅈ";
            case 'c': return "ㅊ";
            case 'k': return "ㅋ";
            case 't': return "ㅌ";
            case 'p': return "ㅍ";
            case 'h': return "ㅎ";
            case 'z': return "ㅿ";
            case 'x': return "ㆆ";
            case 'v': return "ㆁ";
            default: return ch;
        }
    }
    if (text.length == 1) {
        var t = text[0];
        var tcode = text.charCodeAt(0);
        var tc = t;
        var jamo = t;
        var tccode = tcode;
        var buff=-1;
    }
    else {
        var lastjamo = text.charCodeAt(text.length - 1);
        var tccode;
        if (((lastjamo >= 0x1161) && (lastjamo <= 0x11A7)) || ((lastjamo >= 0xD7B0) && (lastjamo <= 0xD7C6))) {
            switch (ch) {
                case 'g': return text + 'ᆨ';
                case 'n': return text + 'ᆫ';
                case 'd': return text + 'ᆮ';
                case 'l': return text + 'ᆯ';
                case 'm': return text + 'ᆷ';
                case 'b': return text + 'ᆸ';
                case 's': return text + 'ᆺ';
                case 'q': return text + 'ᆼ';
                case 'j': return text + 'ᆽ';
                case 'c': return text + 'ᆾ';
                case 'k': return text + 'ᆿ';
                case 't': return text + 'ᇀ';
                case 'p': return text + 'ᇁ';
                case 'h': return text + 'ᇂ';
                case 'v': return text + 'ᇰ';
                case 'x': return text + 'ᇹ';
                case 'z': return text + 'ᇫ';
                case 'a':
                    switch (lastjamo) {
                        case 0x1173: { tccode = 0x1163; break; }//ya
                        case 0x1169: { tccode = 0x116A; break; }//oa
                        case 0x116E: { tccode = 0x1189; break; }//ua
                        case 0x116D: { tccode = 0xD7B2; break; }//yoa
                        case 0x1172: { tccode = 0x118E; break; }//yua
                        case 0x116C: { tccode = 0x11A6; break; }//oia
                        case 0x1188: { tccode = 0x1184; break; }//yoia
                        case 0x1168: { tccode = 0x11A5; break; }//yeia
                        case 0x1196: { tccode = 0xD7B9; break; }//yya
                        case 0x1175: { tccode = 0x1198; break; }//ia
                        case 0x119C: { tccode = 0x1199; break; }//iya
                        case 0x119E: { tccode = 0xD7C5; break; }//wa
                        default: return text + ch;
                    }
                    break;
                case 'e':
                    switch (lastjamo) {
                        case 0x1173: { tccode = 0x1167; break; }//ye
                        case 0x1169: { tccode = 0x117F; break; }//oe
                        case 0x116E: { tccode = 0x116F; break; }//ue
                        case 0x116D: { tccode = 0xD7B4; break; }//yoe
                        case 0x1172: { tccode = 0x118F; break; }//yue
                        case 0x116C: { tccode = 0xD7B0; break; }//oie
                        case 0x1171: { tccode = 0xD7B5; break; }//uie
                        case 0x1188: { tccode = 0x1186; break; }//yoie
                        case 0x1194: { tccode = 0x1191; break; }//yuie
                        case 0x1196: { tccode = 0xD7BA; break; }//yye
                        case 0x119C: { tccode = 0xD7BF; break; }//iye
                        case 0x119E: { tccode = 0x119F; break; }//we
                        default: return text + ch;
                    }
                    break;
                case 'o':
                    switch (lastjamo) {
                        case 0x1173: { tccode = 0x116D; break; }//yo
                        case 0x1161: { tccode = 0x1176; break; }//ao
                        case 0x1165: { tccode = 0x117A; break; }//eo
                        case 0x1163: { tccode = 0x1178; break; }//yao
                        case 0x1167: { tccode = 0x117D; break; }//yeo
                        case 0x1164: { tccode = 0x1179; break; }//yaio
                        case 0x1169: { tccode = 0x1182; break; }//oo
                        case 0x116D: { tccode = 0x1187; break; }//yoo
                        case 0x1172: { tccode = 0xD7B8; break; }//yuo
                        case 0x1196: { tccode = 0xD7BC; break; }//yyo
                        case 0x1175: { tccode = 0x119A; break; }//io
                        case 0x119C: { tccode = 0xD7C2; break; }//iyo
                        case 0x1199: { tccode = 0xD7BD; break; }//iyao
                        default: return text + ch;
                    }
                    break;
                case 'u':
                    switch (lastjamo) {
                        case 0x1173: { tccode = 0x1172; break; }//yu
                        case 0x1161: { tccode = 0x1177; break; }//au
                        case 0x1165: { tccode = 0x117B; break; }//eu
                        case 0x1163: { tccode = 0x11A4; break; }//yau
                        case 0x1167: { tccode = 0x117E; break; }//yeu
                        case 0x1169: { tccode = 0x1183; break; }//ou
                        case 0x116E: { tccode = 0x118D; break; }//uu
                        case 0x1172: { tccode = 0x1193; break; }//yuu
                        case 0x1196: { tccode = 0x1195; break; }//yyu
                        case 0x1175: { tccode = 0x119B; break; }//iu
                        case 0x119C: { tccode = 0xD7C3; break; }//iyu
                        case 0x1174: { tccode = 0x1197; break; }//yiu
                        case 0x119E: { tccode = 0x11A0; break; }//wu
                        default: return text + ch;
                    }
                    break;
                case 'y':
                    switch (lastjamo) {
                        case 0x1173: { tccode = 0x1196; break; }//yy
                        case 0x1161: { tccode = 0x11A3; break; }//ay
                        case 0x1165: { tccode = 0x117C; break; }//ey
                        case 0x1175: { tccode = 0x119C; break; }//iy
                        case 0x116F: { tccode = 0x118B; break; }//uey
                        default: return text + ch;
                    }
                    break;
                case 'w':
                    switch (lastjamo) {
                        case 0x1175: { tccode = 0x119D; break; }//iw
                        case 0x119E: { tccode = 0x11A2; break; }//ww
                        default: return text + ch;
                    }
                    break;
                case 'i':
                    switch (lastjamo) {
                        case 0x1173: { tccode = 0x1174; break; }//yi
                        case 0x1161: { tccode = 0x1162; break; }//ai
                        case 0x1165: { tccode = 0x1166; break; }//ei
                        case 0x1163: { tccode = 0x1164; break; }//yai
                        case 0x1167: { tccode = 0x1168; break; }//yei
                        case 0x1169: { tccode = 0x116C; break; }//oi
                        case 0x116E: { tccode = 0x1171; break; }//ui
                        case 0x116A: { tccode = 0x116B; break; }//oai
                        case 0x116F: { tccode = 0x1170; break; }//uei
                        case 0x117F: { tccode = 0x1180; break; }//oei
                        case 0x1189: { tccode = 0x118A; break; }//uai
                        case 0x11A6: { tccode = 0x11A7; break; }//oiai
                        case 0xD7B5: { tccode = 0x118C; break; }//uiei
                        case 0xD7B2: { tccode = 0xD7B3; break; }//yoai
                        case 0x118E: { tccode = 0xD7B7; break; }//yuai
                        case 0x118F: { tccode = 0x1190; break; }//yuei
                        case 0x1184: { tccode = 0x1185; break; }//yoiai
                        case 0x1191: { tccode = 0x1192; break; }//yuiei
                        case 0x116D: { tccode = 0x1188; break; }//yoi
                        case 0x1172: { tccode = 0x1194; break; }//yui
                        case 0x119E: { tccode = 0x11A1; break; }//wi
                        case 0x1182: { tccode = 0xD7B1; break; }//ooi
                        case 0x1171: { tccode = 0xD7B6; break; }//uii
                        case 0xD7BA: { tccode = 0xD7BB; break; }//yyei
                        case 0x1199: { tccode = 0xD7BE; break; }//iyai
                        case 0xD7BF: { tccode = 0xD7C0; break; }//iyei
                        case 0x119A: { tccode = 0xD7C1; break; }//ioi
                        case 0x1175: { tccode = 0xD7C4; break; }//ii
                        case 0x119F: { tccode = 0xD7C6; break; }//wei
                        default: return text + ch;
                    }
                    break;
            }
            return text.substr(0, text.length - 1) + String.fromCharCode(tccode);
        }
        switch (ch) {
            case 'b':
                if (lastjamo == 0x11A8) { tccode = 0x11FB; break; }//gb
                if (lastjamo == 0xD7CD) { tccode = 0xD7CE; break; }//ddb
                if (lastjamo == 0x11AE) { tccode = 0xD7CF; break; }//db
                if (lastjamo == 0x11AF) { tccode = 0x11B2; break; }//lb
                if (lastjamo == 0x11B7) { tccode = 0x11DC; break; }//mb
                if (lastjamo == 0x11B8) { tccode = 0xD7E6; break; }//bb
                if (lastjamo == 0x11BA) { tccode = 0x11EA; break; }//sb
                if (lastjamo == 0x11EB) { tccode = 0xD7F3; break; }//zb
                if (lastjamo == 0x11BD) { tccode = 0xD7F7; break; }//jb
                if (lastjamo == 0xD7F7) { tccode = 0xD7F8; break; }//jbb
                if (lastjamo == 0x11C1) { tccode = 0x11F3; break; }//pb
                if (lastjamo == 0x11C2) { tccode = 0x11F8; break; }//hb
                return text + ch;
            case 'c':
                if (lastjamo == 0x11A8) { tccode = 0x11FC; break; }//gc
                if (lastjamo == 0x11AB) { tccode = 0xD7CC; break; }//nc
                if (lastjamo == 0x11AE) { tccode = 0xD7D3; break; }//dc
                if (lastjamo == 0x11B7) { tccode = 0x11E0; break; }//mc
                if (lastjamo == 0x11B8) { tccode = 0xD7E9; break; }//bc
                if (lastjamo == 0x11BA) { tccode = 0xD7F0; break; }//sc
                return text + ch;
            case 'd':
                if (lastjamo == 0x11AB) { tccode = 0x11C6; break; }//nd
                if (lastjamo == 0x11AE) { tccode = 0xD7CD; break; }//dd
                if (lastjamo == 0x11AF) { tccode = 0x11CE; break; }//ld
                if (lastjamo == 0x11B2) { tccode = 0xD7D9; break; }//lbd
                if (lastjamo == 0x11B8) { tccode = 0xD7E3; break; }//bd
                if (lastjamo == 0x11B9) { tccode = 0xD7E7; break; }//bsd
                if (lastjamo == 0x11BA) { tccode = 0x11E8; break; }//sd
                if (lastjamo == 0x11BB) { tccode = 0xD7ED; break; }//ssd
                return text + ch;
            case 'g':
                if (lastjamo == 0x11AA) { tccode = 0x11C4; break; }//gsg
                if (lastjamo == 0x11AB) { tccode = 0x11C5; break; }//ng
                if (lastjamo == 0x11AE) { tccode = 0x11CA; break; }//dg
                if (lastjamo == 0xD7D0) { tccode = 0xD7D1; break; }//dsg
                if (lastjamo == 0x11AF) { tccode = 0x11B0; break; }//lg
                if (lastjamo == 0x11B0) { tccode = 0xD7D5; break; }//lgg
                if (lastjamo == 0x11B1) { tccode = 0x11D1; break; }//lmg
                if (lastjamo == 0x11B7) { tccode = 0x11DA; break; }//mg
                if (lastjamo == 0x11BA) { tccode = 0x11E7; break; }//sg
                if (lastjamo == 0x11BB) { tccode = 0xD7EC; break; }//ssg
                if (lastjamo == 0x11BC) { tccode = 0x11EC; break; }//qg
                if (lastjamo == 0x11EC) { tccode = 0x11ED; break; }//qgg
                return text + ch;
            case 'h':
                if (lastjamo == 0x11A8) { tccode = 0x11FE; break; }//gh
                if (lastjamo == 0x11AB) { tccode = 0x11AD; break; }//nh
                if (lastjamo == 0x11B0) { tccode = 0xD7D6; break; }//lgh
                if (lastjamo == 0x11AF) { tccode = 0x11CF; break; }//lh
                if (lastjamo == 0x11B1) { tccode = 0xD7D8; break; }//lmh
                if (lastjamo == 0x11B2) { tccode = 0x11D4; break; }//lbh
                if (lastjamo == 0x11AF) { tccode = 0x11B6; break; }//lh
                if (lastjamo == 0x11D9) { tccode = 0xD7DC; break; }//lxh
                if (lastjamo == 0x11B7) { tccode = 0x11E1; break; }//mh
                if (lastjamo == 0x11B8) { tccode = 0x11E5; break; }//bh
                if (lastjamo == 0x11BA) { tccode = 0xD7F2; break; }//sh
                if (lastjamo == 0x11F0) { tccode = 0xD7F6; break; }//vh
                return text + ch;
            case 'j':
                if (lastjamo == 0x11AB) { tccode = 0x11AC; break; }//nj
                if (lastjamo == 0x11AE) { tccode = 0xD7D2; break; }//dj
                if (lastjamo == 0x11B7) { tccode = 0xD7E2; break; }//mj
                if (lastjamo == 0x11B8) { tccode = 0xD7E8; break; }//bj
                if (lastjamo == 0x11BA) { tccode = 0xD7EF; break; }//sj
                if (lastjamo == 0x11BD) { tccode = 0xD7F9; break; }//jj
                return text + ch;
            case 'k':
                if (lastjamo == 0x11A8) { tccode = 0x11FD; break; }//gk
                if (lastjamo == 0x11D0) { tccode = 0xD7D7; break; }//llk
                if (lastjamo == 0x11AF) { tccode = 0x11D8; break; }//lk
                if (lastjamo == 0x11BC) { tccode = 0x11EF; break; }//qk
                return text + ch;
            case 'l':
                if (lastjamo == 0x11A8) { tccode = 0x11C3; break; }//gl
                if (lastjamo == 0x11AB) { tccode = 0xD7CB; break; }//nl
                if (lastjamo == 0x11AE) { tccode = 0x11CB; break; }//dl
                if (lastjamo == 0x11AF) { tccode = 0x11D0; break; }//ll
                if (lastjamo == 0x11B7) { tccode = 0x11DB; break; }//ml
                if (lastjamo == 0x11B8) { tccode = 0x11E3; break; }//bl
                if (lastjamo == 0x11BA) { tccode = 0x11E9; break; }//sl
                if (lastjamo == 0x11BA) { tccode = 0xD7F1; break; }//sl
                if (lastjamo == 0x11C2) { tccode = 0x11F6; break; }//hl
                return text + ch;
            case 'm':
                if (lastjamo == 0x11AF) { tccode = 0x11B1; break; }//lm
                if (lastjamo == 0x11B7) { tccode = 0xD7E0; break; }//mm
                if (lastjamo == 0x11B8) { tccode = 0xD7E5; break; }//bm
                if (lastjamo == 0x11BA) { tccode = 0xD7EA; break; }//sm
                if (lastjamo == 0x11F0) { tccode = 0xD7F5; break; }//vm
                if (lastjamo == 0x11C2) { tccode = 0x11F7; break; }//hm
                return text + ch;
            case 'n':
                if (lastjamo == 0x11A8) { tccode = 0x11FA; break; }//gn
                if (lastjamo == 0x11AB) { tccode = 0x11FF; break; }//nn
                if (lastjamo == 0x11AF) { tccode = 0x11CD; break; }//ln
                if (lastjamo == 0x11B7) { tccode = 0xD7DE; break; }//mn
                if (lastjamo == 0xD7DE) { tccode = 0xD7DF; break; }//mnn
                if (lastjamo == 0x11C2) { tccode = 0x11F5; break; }//hn
                return text + ch;
            case 'p':
                if (lastjamo == 0x11B2) { tccode = 0xD7DA; break; }//lbp
                if (lastjamo == 0x11AF) { tccode = 0x11B5; break; }//lp
                if (lastjamo == 0x11E3) { tccode = 0xD7E4; break; }//blp
                if (lastjamo == 0x11B8) { tccode = 0x11E4; break; }//bp
                return text + ch;
            case 'q':
                if (lastjamo == 0x11B2) { tccode = 0x11D5; break; }//lbq
                if (lastjamo == 0x11AF) { tccode = 0xD7DD; break; }//lq
                if (lastjamo == 0x11B7) { tccode = 0x11E2; break; }//mq
                if (lastjamo == 0x11B8) { tccode = 0x11E6; break; }//bq
                if (lastjamo == 0x11EA) { tccode = 0xD7EB; break; }//sbq
                if (lastjamo == 0xD7F3) { tccode = 0xD7F4; break; }//zbq
                if (lastjamo == 0x11BC) { tccode = 0x11EE; break; }//qq
                if (lastjamo == 0x11C1) { tccode = 0x11F4; break; }//pq
                return text + ch;
            case 's':
                if (lastjamo == 0x11A8) { tccode = 0x11AA; break; }//gs
                if (lastjamo == 0x11AB) { tccode = 0x11C7; break; }//ns
                if (lastjamo == 0x11AE) { tccode = 0xD7D0; break; }//ds
                if (lastjamo == 0x11B0) { tccode = 0x11CC; break; }//lgs
                if (lastjamo == 0x11B1) { tccode = 0x11D2; break; }//lms
                if (lastjamo == 0x11B2) { tccode = 0x11D3; break; }//lbs
                if (lastjamo == 0x11AF) { tccode = 0x11B3; break; }//ls
                if (lastjamo == 0x11B3) { tccode = 0x11D6; break; }//lss
                if (lastjamo == 0x111C) { tccode = 0xD7E1; break; }//mbs
                if (lastjamo == 0x11B7) { tccode = 0x11DD; break; }//ms
                if (lastjamo == 0x11DD) { tccode = 0x11DE; break; }//mss
                if (lastjamo == 0x11B8) { tccode = 0x11B9; break; }//bs
                if (lastjamo == 0x11F0) { tccode = 0x11F1; break; }//vs
                if (lastjamo == 0x11C1) { tccode = 0xD7FA; break; }//ps
                return text + ch;
            case 't':
                if (lastjamo == 0x11AB) { tccode = 0x11C9; break; }//nt
                if (lastjamo == 0x11AE) { tccode = 0xD7D4; break; }//dt
                if (lastjamo == 0x11AF) { tccode = 0x11B4; break; }//lt
                if (lastjamo == 0x11C1) { tccode = 0xD7FB; break; }//pt
                return text + ch;
            case 'v':
                if (lastjamo == 0x11AF) { tccode = 0xD7DB; break; }//lv
                return text + ch;
            case 'x':
                if (lastjamo == 0x11AF) { tccode = 0x11D9; break; }//lx
                return text + ch;
                return text + ch;
            case 'z':
                if (lastjamo == 0x11AB) { tccode = 0x11C8; break; }//nz
                if (lastjamo == 0x11AF) { tccode = 0x11D7; break; }//lz
                if (lastjamo == 0x11B7) { tccode = 0x11DF; break; }//mz
                if (lastjamo == 0x11BA) { tccode = 0xD7EE; break; }//sz
                if (lastjamo == 0x11F0) { tccode = 0x11F2; break; }//vz
                return text + ch;
            default: return text + ch;
        }
        return text.substr(0, text.length - 1) + String.fromCharCode(tccode);
    }
    switch (t) {
        case 'ㄱ': tc = '가'; jamo = 'ᄀ'; break;
        case 'ㄴ': tc = '나'; jamo = 'ᄂ'; break;
        case 'ㄷ': tc = '다'; jamo = 'ᄃ'; break;
        case 'ㅁ': tc = '마'; jamo = 'ᄆ'; break;
        case 'ㅂ': tc = '바'; jamo = 'ᄇ'; break;
        case 'ㅈ': tc = '자'; jamo = 'ᄌ'; break;
        case 'ㅅ': tc = '사'; jamo = 'ᄉ'; break;
        case 'ㅇ': tc = '아'; jamo = 'ᄋ'; break;
        case 'ㄹ': tc = '라'; jamo = 'ᄅ'; break;
        case 'ㅎ': tc = '하'; jamo = 'ᄒ'; break;
        case 'ㅋ': tc = '카'; jamo = 'ᄏ'; break;
        case 'ㅌ': tc = '타'; jamo = 'ᄐ'; break;
        case 'ㅊ': tc = '차'; jamo = 'ᄎ'; break;
        case 'ㅍ': tc = '파'; jamo = 'ᄑ'; break;
        case 'ㄲ': tc = '까'; jamo = 'ᄁ'; break;
        case 'ㄸ': tc = '따'; jamo = 'ᄄ'; break;
        case 'ㅃ': tc = '빠'; jamo = 'ᄈ'; break;
        case 'ㅆ': tc = '싸'; jamo = 'ᄊ'; break;
        case 'ㅉ': tc = '짜'; jamo = 'ᄍ'; break;
        case 'ㅿ': tc = jamo = 'ᅀ'; break;
        case 'ㆆ': tc = jamo = 'ᅙ'; break;
        case 'ㆁ': tc = jamo = 'ᅌ'; break;
        case 'ㅥ': tc = jamo = 'ᄔ'; break;
        case 'ㅦ': tc = jamo = 'ᄕ'; break;
        case 'ㅧ': tc = jamo = 'ᅛ'; break;
        case 'ㄵ': tc = jamo = 'ᅜ'; break;
        case 'ㄶ': tc = jamo = 'ᅝ'; break;
        case 'ㄺ': tc = jamo = 'ꥤ'; break;
        case 'ㅪ': tc = jamo = 'ꥦ'; break;
        case 'ㄻ': tc = jamo = 'ꥨ'; break;
        case 'ㄼ': tc = jamo = 'ꥩ'; break;
        case 'ㄽ': tc = jamo = 'ꥬ'; break;
        case 'ㅀ': tc = jamo = 'ᄚ'; break;
        case 'ㅮ': tc = jamo = 'ᄜ'; break;
        case 'ㅱ': tc = jamo = 'ᄝ'; break;
        case 'ㅲ': tc = jamo = 'ᄞ'; break;
        case 'ㅳ': tc = jamo = 'ᄠ'; break;
        case 'ㅄ': tc = jamo = 'ᄡ'; break;
        case 'ㅴ': tc = jamo = 'ᄢ'; break;
        case 'ㅵ': tc = jamo = 'ᄣ'; break;
        case 'ㅶ': tc = jamo = 'ᄧ'; break;
        case 'ㅷ': tc = jamo = 'ᄩ'; break;
        case 'ㅸ': tc = jamo = 'ᄫ'; break;
        case 'ㅹ': tc = jamo = 'ᄬ'; break;
        case 'ㅺ': tc = jamo = 'ᄭ'; break;
        case 'ㅻ': tc = jamo = 'ᄮ'; break;
        case 'ㅼ': tc = jamo = 'ᄯ'; break;
        case 'ㅽ': tc = jamo = 'ᄲ'; break;
        case 'ㅾ': tc = jamo = 'ᄶ'; break;
        case 'ㆀ': tc = jamo = 'ᅇ'; break;
        case 'ㆄ': tc = jamo = 'ᅗ'; break;
        case 'ㆅ': tc = jamo = 'ᅘ'; break;
        default: break;
    }
    tccode = tc.charCodeAt(0);
    var pos;
    if ((tcode >= 0xAC00) && (tcode <= 0xD7AF)) {
        pos = (tcode - 0xAC00) % 0x24C;
        switch (pos) {
            case 0x1F8://y
                buff = 0; break;
            case 0://a
            case 0x70://e
                buff = 1; break;
            case 0xE0://o
                buff = 2; break;
            case 0x16C://u
                buff = 3; break;
            case 0x38://ya
            case 0xA8://ye
            case 0xFC://oa
            case 0x188://ue
                buff = 4; break;
            case 0x150://yo
            case 0x1DC://yu
            case 0x54://yai
            case 0xC4://yei
            case 0x1C://ai
            case 0x8C://ei
            case 0x134://oi
            case 0x1C0://ui
            case 0x214://yi
            case 0x118://oai
            case 0x1A4://uei
            case 0x230://i
                buff = 5; break;
            default:                
                switch (pos % 0x1C) {
                    case 1: buff = 6; break;//g
                    case 2: buff = 7; break;//gg
                    case 3: buff = 8; break;//gs
                    case 4: buff = 9; break;//n
                    case 5: buff = 10; break;//nj
                    case 6: buff = 11; break;//nh
                    case 7: buff = 12; break;//d
                    case 8: buff = 13; break;//l
                    case 9: buff = 14; break;//lg
                    case 10: buff = 15; break;//lm
                    case 11: buff = 16; break;//lb
                    case 12: buff = 17; break;//ls
                    case 13: buff = 18; break;//lt
                    case 14: buff = 19; break;//lp
                    case 15: buff = 20; break;//lh
                    case 16: buff = 21; break;//m
                    case 17: buff = 22; break;//b
                    case 18: buff = 23; break;//bs
                    case 19: buff = 24; break;//s
                    case 20: buff = 25; break;//ss
                    case 21: buff = 26; break;//q
                    case 22: buff = 27; break;//j
                    case 23: buff = 28; break;//c
                    case 24: buff = 29; break;//k
                    case 25: buff = 30; break;//t
                    case 26: buff = 31; break;//p
                    case 27: buff = 32; break;//h
                }
        }
    }
    switch (buff) {
    case -1: {        
        if (((tcode >= 0xAC00) && (tcode <= 0xD7AF)) || ((tcode >= 0x3130) && (tcode <= 0x318F)) || ((tccode >= 0x1100) && (tccode <= 0x115F))) {
            switch (ch) {
                case 'y':
                    if ((tccode >= 0xAC00) && (tccode <= 0xD7AF)) { tccode += 0x1F8; break; }
                    if ((tccode >= 0x1100) && (tccode <= 0x115F)) { return String.fromCharCode(tccode) + 'ᅳ'; }
                    return text + ch;
                case 'o':
                    if ((tccode >= 0xAC00) && (tccode <= 0xD7AF)) { tccode += 0xE0; break; }
                    if ((tccode >= 0x1100) && (tccode <= 0x115F)) { return String.fromCharCode(tccode) + 'ᅩ'; }
                    return text + ch;
                case 'u':
                    if ((tccode >= 0xAC00) && (tccode <= 0xD7AF)) { tccode += 0x16C; break; }
                    if ((tccode >= 0x1100) && (tccode <= 0x115F)) { return String.fromCharCode(tccode) + 'ᅮ'; }
                    return text + ch;
                case 'i':
                    if ((tccode >= 0xAC00) && (tccode <= 0xD7AF)) { tccode += 0x230; break; }
                    if ((tccode >= 0x1100) && (tccode <= 0x115F)) { return String.fromCharCode(tccode) + 'ᅵ'; }
                    return text + ch;
                case 'e':
                    if ((tccode >= 0xAC00) && (tccode <= 0xD7AF)) { tccode += 0x70; break; }
                    if ((tccode >= 0x1100) && (tccode <= 0x115F)) { return String.fromCharCode(tccode) + 'ᅥ'; }
                    return text + ch;
                case 'a':
                    if ((tccode >= 0xAC00) && (tccode <= 0xD7AF)) { break; }
                    if ((tccode >= 0x1100) && (tccode <= 0x115F)) { return String.fromCharCode(tccode) + 'ᅡ'; }
                    return text + ch;
                case 'w':
                    if ((tccode >= 0xAC00) && (tccode <= 0xD7AF)) { return jamo + 'ᆞ'; }
                    if ((tccode >= 0x1100) && (tccode <= 0x115F)) { return String.fromCharCode(tccode) + 'ᆞ'; }
                    return text + ch;
                case 'g':
                    if (tcode == 0x3131) { tccode = (tcode + 1); break; }//gg
                    if (tcode == 0x3139) { tccode = (tcode + 1); break; }//lg
                    if (tcode == 0x3142) { tccode = 0x3172; break; }//bg
                    if (tcode == 0x3144) { tccode = 0x3174; break; }//bsg
                    if (tcode == 0x3145) { tccode = 0x317A; break; }//sg
                    if (tcode == 0x3134) { tccode = 0x1113; break; }//ng
                    if (tcode == 0x3147) { tccode = 0x1141; break; }//qg
                    if (tcode == 0x3139) { tccode = 0xA965; break; }//lgg
                    if (tcode == 0x3141) { tccode = 0xA96F; break; }//mg
                    if (tcode == 0x3145) { tccode = 0x1133; break; }//sbg
                    return text + ch;
                case 'b':
                    if (tcode == 0x3142) { tccode = (tcode + 1); break; }//bb
                    if (tcode == 0x3139) { tccode = (tcode + 3); break; }//lb
                    if (tcode == 0x3141) { tccode = 0x316E; break; }//mb
                    if (tcode == 0x3145) { tccode = 0x317C; break; }//sb
                    if (tcode == 0x3134) { tccode = 0xA961; break; }//db
                    if (tcode == 0x314D) { tccode = 0x1156; break; }//pb
                    if (tcode == 0x3134) { tccode = 0x1116; break; }//nb
                    if (tcode == 0x3139) { tccode = 0xA96A; break; }//lbb
                    if (tcode == 0x3142) { tccode = 0x1124; break; }//bsb
                    if (tcode == 0x3145) { tccode = 0xA975; break; }//ssb
                    if (tcode == 0x3147) { tccode = 0x1144; break; }//qb
                    return text + ch;
                case 'd':
                    if (tcode == 0x3137) { tccode = (tcode + 1); break; }//dd
                    if (tcode == 0x3134) { tccode = 0x3166; break; }//nd
                    if (tcode == 0x3142) { tccode = 0x3173; break; }//bd
                    if (tcode == 0x3139) { tccode = 0x316A; break; }//ld
                    if (tcode == 0x3142) { tccode = 0x3173; break; }//bd
                    if (tcode == 0x3144) { tccode = 0x3175; break; }//bsd
                    if (tcode == 0x3145) { tccode = 0x317D; break; }//sd
                    if (tcode == 0x3131) { tccode = 0x115A; break; }//gd
                    if (tcode == 0x3139) { tccode = 0xA967; break; }//ldd
                    if (tcode == 0x3141) { tccode = 0xA970; break; }//md
                    if (tcode == 0x3147) { tccode = 0x1142; break; }//qd
                    return text + ch;
                case 's':
                    if (tcode == 0x3145) { tccode = (tcode + 1); break; }//ss
                    if (tcode == 0x3131) { tccode = (tcode + 2); break; }//gs
                    if (tcode == 0x3139) { tccode = (tcode + 4); break; }//ls
                    if (tcode == 0x3142) { tccode = (tcode + 2); break; }//bs
                    if (tcode == 0x3134) { tccode = 0x3167; break; }//ns
                    if (tcode == 0x313A) { tccode = 0x3169; break; }//lgs
                    if (tcode == 0x313C) { tccode = 0x316B; break; }//lbs
                    if (tcode == 0x3141) { tccode = 0x316F; break; }//ms
                    if (tcode == 0x3181) { tccode = 0x3182; break; }//vs
                    if (tcode == 0x3134) { tccode = 0xA962; break; }//ds
                    if (tcode == 0x3141) { tccode = 0xA971; break; }//ms
                    if (tcode == 0x3142) { tccode = 0x1125; break; }//bss
                    if (tcode == 0x3145) { tccode = 0x1134; break; }//sss
                    if (tcode == 0x3147) { tccode = 0x1145; break; }//qs
                    if (tcode == 0x314E) { tccode = 0xA97B; break; }//hs
                    return text + ch;
                case 'j':
                    if (tcode == 0x3148) { tccode = (tcode + 1); break; }//jj
                    if (tcode == 0x3134) { tccode = (tcode + 1); break; }//nj
                    if (tcode == 0x3142) { tccode = 0x3176; break; }//bj
                    if (tcode == 0x3145) { tccode = 0x317E; break; }//sj
                    if (tcode == 0x3134) { tccode = 0xA963; break; }//dj
                    if (tcode == 0x3139) { tccode = 0xA96D; break; }//lj
                    if (tcode == 0x3142) { tccode = 0x1126; break; }//bsj
                    if (tcode == 0x3147) { tccode = 0x1148; break; }//qj
                    return text + ch;
                case 'h':
                    if (tcode == 0x3134) { tccode = (tcode + 2); break; }//nh
                    if (tcode == 0x3139) { tccode = (tcode + 7); break; }//lh
                    if (tcode == 0x314E) { tccode = 0x3185; break; }//hh
                    if (tcode == 0x3145) { tccode = 0x113B; break; }//sh
                    if (tcode == 0x3142) { tccode = 0xA974; break; }//bh
                    if (tcode == 0x3147) { tccode = 0xA977; break; }//qh
                    if (tcode == 0x3148) { tccode = 0xA978; break; }//jjh
                    if (tcode == 0x314D) { tccode = 0xA97A; break; }//ph
                    return text + ch;
                case 'm':
                    if (tcode == 0x3139) { tccode = (tcode + 2); break; }//lm
                    if (tcode == 0x3147) { tccode = 0x1143; break; }//qm
                    if (tcode == 0x3137) { tccode = 0xA960; break; }//dm
                    if (tcode == 0x3145) { tccode = 0x1131; break; }//sm
                    return text + ch;
                case 't':
                    if (tcode == 0x3139) { tccode = (tcode + 5); break; }//lt
                    if (tcode == 0x3142) { tccode = 0x3177; break; }//bt
                    if (tcode == 0x3145) { tccode = 0x1139; break; }//st
                    if (tcode == 0x3142) { tccode = 0xA972; break; }//bst
                    if (tcode == 0x3147) { tccode = 0x114A; break; }//qt
                    if (tcode == 0x314C) { tccode = 0xA979; break; }//tt
                    return text + ch;
                case 'p':
                    if (tcode == 0x3139) { tccode = (tcode + 6); break; }//lp
                    if (tcode == 0x3142) { tccode = 0x112A; break; }//bp
                    if (tcode == 0x3145) { tccode = 0x113A; break; }//sp
                    if (tcode == 0x3147) { tccode = 0x114B; break; }//qp
                    return text + ch;
                case 'k':
                    if (tcode == 0x3139) { tccode = 0xA96E; break; }//lk
                    if (tcode == 0x3142) { tccode = 0xA973; break; }//bk
                    if (tcode == 0x3145) { tccode = 0x1138; break; }//sk
                    return text + ch;
                case 'c':
                    if (tcode == 0x3142) { tccode = 0x1128; break; }//bc
                    if (tcode == 0x3145) { tccode = 0x1137; break; }//sc
                    if (tcode == 0x3147) { tccode = 0x1149; break; }//qc
                    return text + ch;
                case 'q':
                    if (tcode == 0x3141) { tccode = 0x3171; break; }//mq
                    if (tcode == 0x314D) { tccode = 0x3184; break; }//pq
                    if (tcode == 0x3142) { tccode = 0x3178; break; }//bq
                    if (tcode == 0x3178) { tccode = 0x3179; break; }//bbq
                    if (tcode == 0x3147) { tccode = 0x3180; break; }//qq
                    if (tcode == 0x313C) { tccode = 0xA96B; break; }//lbq
                    if (tcode == 0x3139) { tccode = 0x111B; break; }//lq
                    if (tcode == 0x3145) { tccode = 0x1135; break; }//sq
                    if (tcode == 0x3148) { tccode = 0x114D; break; }//jq
                    return text + ch;
                case 'n':
                    if (tcode == 0x3134) { tccode = 0x3165; break; }//nn
                    if (tcode == 0x3145) { tccode = 0x317B; break; }//sn
                    if (tcode == 0x3139) { tccode = 0x1118; break; }//ln
                    if (tcode == 0x3142) { tccode = 0x111F; break; }//bn
                    return text + ch;
                case 'z':
                    if (tcode == 0x3134) { tccode = 0x3168; break; }//nz
                    if (tcode == 0x3139) { tccode = 0x316C; break; }//lz
                    if (tcode == 0x3141) { tccode = 0x3170; break; }//mz
                    if (tcode == 0x3181) { tccode = 0x3183; break; }//vz
                    if (tcode == 0x3147) { tccode = 0x1146; break; }//qz
                    return text + ch;
                case 'x':
                    if (tcode == 0x3139) { tccode = 0x316D; break; }//lx
                    if (tcode == 0x3186) { tccode = 0xA97C; break; }//xx
                    return text + ch;
                case 'l':
                    if (tcode == 0x3134) { tccode = 0x115E; break; }//dl
                    if (tcode == 0x3139) { tccode = 0x1119; break; }//ll
                    if (tcode == 0x3145) { tccode = 0x1130; break; }//sl
                    if (tcode == 0x3147) { tccode = 0xA976; break; }//ql
                    return text + ch;
                case 'f':
                    if (tcode == 0x3145) { tccode = 0x113C; break; }//sf
                    if (tcode == 0x3146) { tccode = 0x113D; break; }//ssf
                    if (tcode == 0x3148) { tccode = 0x114E; break; }//jf
                    if (tcode == 0x3149) { tccode = 0x114F; break; }//jjf
                    if (tcode == 0x314A) { tccode = 0x1154; break; }//cf
                    return text + ch;
                case 'r':
                    if (tcode == 0x3145) { tccode = 0x113E; break; }//sr
                    if (tcode == 0x3146) { tccode = 0x113F; break; }//ssf
                    if (tcode == 0x3148) { tccode = 0x1150; break; }//jr
                    if (tcode == 0x3149) { tccode = 0x1151; break; }//jjr
                    if (tcode == 0x314A) { tccode = 0x1155; break; }//cr
                    return text + ch;
                default: return text + ch;
            }
            tc = String.fromCharCode(tccode);
            return tc;
        }
        return text + ch;
    }
    case 0: {
        switch (ch) {
            case 'o': tccode -= 0xA8; break;
            case 'u': tccode -= 0x1C; break;
            case 'a': tccode -= 0x1C0; break;
            case 'e': tccode -= 0x150; break;
            case 'i': tccode += 0x1C; break;
            case 'g': tccode += 0x1; break;
            case 'n': tccode += 0x4; break;
            case 'd': tccode += 0x7; break;
            case 'l': tccode += 0x8; break;
            case 'm': tccode += 0x10; break;
            case 'b': tccode += 0x11; break;
            case 's': tccode += 0x13; break;
            case 'q': tccode += 0x15; break;
            case 'j': tccode += 0x16; break;
            case 'c': tccode += 0x17; break;
            case 'k': tccode += 0x18; break;
            case 't': tccode += 0x19; break;
            case 'p': tccode += 0x1A; break;
            case 'h': tccode += 0x1B; break;
            case 'v': return text + 'ᇰ';
            case 'x': return text + 'ᇹ';
            case 'z': return text + 'ᇫ';
            case 'y':
                return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x1196);//yy
            default: return text + ch;
        }
        tc = String.fromCharCode(tccode);
        return tc;
    }
    case 1: {
        switch (ch) {
            case 'i': tccode += 0x1C; break;
            case 'g': tccode += 0x1; break;
            case 'n': tccode += 0x4; break;
            case 'd': tccode += 0x7; break;
            case 'l': tccode += 0x8; break;
            case 'm': tccode += 0x10; break;
            case 'b': tccode += 0x11; break;
            case 's': tccode += 0x13; break;
            case 'q': tccode += 0x15; break;
            case 'j': tccode += 0x16; break;
            case 'c': tccode += 0x17; break;
            case 'k': tccode += 0x18; break;
            case 't': tccode += 0x19; break;
            case 'p': tccode += 0x1A; break;
            case 'h': tccode += 0x1B; break;
            case 'v': return text + 'ᇰ';
            case 'x': return text + 'ᇹ';
            case 'z': return text + 'ᇫ';
            case 'o':
                switch (pos) {
                    case 0: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x1176);//ao
                    case 0x70: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x117A);//eo
                    default: return text + ch;
                }
            case 'u':
                switch (pos) {
                    case 0: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x1177);//au
                    case 0x70: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x117B);//eu
                    default: return text + ch;
                }
            case 'y':
                switch (pos) {
                    case 0: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x11A3);//ay
                    case 0x70: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x117C);//ey
                    default: return text + ch;
                }
            default: return text + ch;
        }
        tc = String.fromCharCode(tccode);
        return tc;
    }
    case 2: {
        switch (ch) {
            case 'i': tccode += 0x54; break;
            case 'a': tccode += 0x1C; break;
            case 'g': tccode += 0x1; break;
            case 'n': tccode += 0x4; break;
            case 'd': tccode += 0x7; break;
            case 'l': tccode += 0x8; break;
            case 'm': tccode += 0x10; break;
            case 'b': tccode += 0x11; break;
            case 's': tccode += 0x13; break;
            case 'q': tccode += 0x15; break;
            case 'j': tccode += 0x16; break;
            case 'c': tccode += 0x17; break;
            case 'k': tccode += 0x18; break;
            case 't': tccode += 0x19; break;
            case 'p': tccode += 0x1A; break;
            case 'h': tccode += 0x1B; break;
            case 'v': return text + 'ᇰ';
            case 'x': return text + 'ᇹ';
            case 'z': return text + 'ᇫ';
            case 'e':
                return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x117F);//oe
            case 'o':
                return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x1182);//oo
            case 'u':
                return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x1183);//ou
            default: return text + ch;
        }
        tc = String.fromCharCode(tccode);
        return tc;
    }
    case 3: {
        switch (ch) {
            case 'i': tccode += 0x54; break;
            case 'e': tccode += 0x1C; break;
            case 'g': tccode += 0x1; break;
            case 'n': tccode += 0x4; break;
            case 'd': tccode += 0x7; break;
            case 'l': tccode += 0x8; break;
            case 'm': tccode += 0x10; break;
            case 'b': tccode += 0x11; break;
            case 's': tccode += 0x13; break;
            case 'q': tccode += 0x15; break;
            case 'j': tccode += 0x16; break;
            case 'c': tccode += 0x17; break;
            case 'k': tccode += 0x18; break;
            case 't': tccode += 0x19; break;
            case 'p': tccode += 0x1A; break;
            case 'h': tccode += 0x1B; break;
            case 'v': return text + 'ᇰ';
            case 'x': return text + 'ᇹ';
            case 'z': return text + 'ᇫ';
            case 'a':
                return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x1189);//ua
            case 'u':
                return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x118D);//uu
            default: return text + ch;
        }
        tc = String.fromCharCode(tccode);
        return tc;
    }
    case 4: {
        switch (ch) {
            case 'i': tccode += 0x1C; break;
            case 'g': tccode += 0x1; break;
            case 'n': tccode += 0x4; break;
            case 'd': tccode += 0x7; break;
            case 'l': tccode += 0x8; break;
            case 'm': tccode += 0x10; break;
            case 'b': tccode += 0x11; break;
            case 's': tccode += 0x13; break;
            case 'q': tccode += 0x15; break;
            case 'j': tccode += 0x16; break;
            case 'c': tccode += 0x17; break;
            case 'k': tccode += 0x18; break;
            case 't': tccode += 0x19; break;
            case 'p': tccode += 0x1A; break;
            case 'h': tccode += 0x1B; break;
            case 'v': return text + 'ᇰ';
            case 'x': return text + 'ᇹ';
            case 'z': return text + 'ᇫ';
            case 'o':
                switch (pos) {
                    case 0x38: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x1178);//yao
                    case 0xA8: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x117D);//yeo
                    default: return text + ch;
                }
            case 'u':
                switch (pos) {
                    case 0x38: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x11A4);//yau
                    case 0xA8: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x117E);//yeu
                    default: return text + ch;
                }
            case 'y':
                switch (pos) {
                    case 0x188: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x118B);//uey
                    default: return text + ch;
                }
            default: return text + ch;
        }
        tc = String.fromCharCode(tccode);
        return tc;
    }
    case 5: {
        switch (ch) {
            case 'g': tccode += 0x1; break;
            case 'n': tccode += 0x4; break;
            case 'd': tccode += 0x7; break;
            case 'l': tccode += 0x8; break;
            case 'm': tccode += 0x10; break;
            case 'b': tccode += 0x11; break;
            case 's': tccode += 0x13; break;
            case 'q': tccode += 0x15; break;
            case 'j': tccode += 0x16; break;
            case 'c': tccode += 0x17; break;
            case 'k': tccode += 0x18; break;
            case 't': tccode += 0x19; break;
            case 'p': tccode += 0x1A; break;
            case 'h': tccode += 0x1B; break;
            case 'v': return text + 'ᇰ';
            case 'x': return text + 'ᇹ';
            case 'z': return text + 'ᇫ';
            case 'a':
                switch (pos) {
                    case 0x150: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0xD7B2);//yoa
                    case 0x1DC: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x118E);//yua
                    case 0xC4: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x11A5);//yeia
                    case 0x134: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x11A6);//oia
                    case 0x230: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x1198);//ia
                    default: return text + ch;
                }
            case 'e':
                switch (pos) {
                    case 0x150: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0xD7B4);//yoe
                    case 0x1DC: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x118F);//yue
                    case 0x134: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0xD7B0);//oie
                    case 0x1C0: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0xD7B5);//uie
                    default: return text + ch;
                }
            case 'o':
                switch (pos) {
                    case 0x150: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x1187);//yoo
                    case 0x1DC: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0xD7B8);//yuo
                    case 0x54: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x1179);//yaio
                    case 0x230: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x119A);//io
                    default: return text + ch;
                }
            case 'u':
                switch (pos) {
                    case 0x1DC: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x1193);//yuu
                    case 0x214: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x1197);//yiu
                    case 0x230: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x119B);//iu
                    default: return text + ch;
                }
            case 'y':
                switch (pos) {
                    case 0x230: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x119C);//iy
                    default: return text + ch;
                }
            case 'i':
                switch (pos) {
                    case 0x150: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x1188);//yoi
                    case 0x1DC: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x1194);//yui
                    case 0x1C0: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0xD7B6);//uii
                    case 0x230: return String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0xD7C4);//ii
                    default: return text + ch;
                }
            case 'w':
                switch (pos) {
                    case 0x230: String.fromCharCode(Math.floor((tccode - 0xAC00) / 0x24C) + 0x1100) + String.fromCharCode(0x119D);//iw
                    default: return text + ch;
                }
            default: return text + ch;
        }
        tc = String.fromCharCode(tccode);
        return tc;
    }
    var lastj;
    //g
    case 6: {
        switch (ch) {
            case 'g': tccode += 0x1; break;
            case 's': tccode += 0x2; break;
            case 'l': lastj = 0x11C3; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//gl
            case 'n': lastj = 0x11FA; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//gn
            case 'b': lastj = 0x11FB; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//gb
            case 'c': lastj = 0x11FC; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//gc
            case 'k': lastj = 0x11FD; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//gk
            case 'h': lastj = 0x11FE; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//gh
            default: return text + ch;
        }
        tc = String.fromCharCode(tccode);
        return tc;
    }
    //gs
    case 6: {
        switch (ch) {
            case 'g': lastj = 0x11C4; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//gsg
            default: return text + ch;
        }
    }
    //n
    case 9: {
        switch (ch) {
            case 'j': tccode += 0x1; break;
            case 'h': tccode += 0x2; break;
            case 'g': lastj = 0x11C5; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//ng
            case 'd': lastj = 0x11C6; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//nd
            case 's': lastj = 0x11C7; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//ns
            case 'z': lastj = 0x11C8; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//nz
            case 't': lastj = 0x11C9; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//nt
            case 'n': lastj = 0x11FF; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//nn
            case 'l': lastj = 0xD7CB; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//nl
            case 'c': lastj = 0xD7CC; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//nc
            default: return text + ch;
        }
        tc = String.fromCharCode(tccode);
        return tc;
    }
    //d
    case 12: {
        switch (ch) {
            case 'g': lastj = 0x11CA; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//dg
            case 'l': lastj = 0x11CB; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//dl
            case 'd': lastj = 0xD7CD; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//dd
            case 'b': lastj = 0xD7CF; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//db
            case 's': lastj = 0xD7D0; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//ds
            case 'j': lastj = 0xD7D2; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//dj
            case 'c': lastj = 0xD7D3; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//dc
            case 't': lastj = 0xD7D4; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//dt
            default: return text + ch;
        }
    }
    //l
    case 13: {
        switch (ch) {
            case 'g': tccode += 0x1; break;
            case 'm': tccode += 0x2; break;
            case 'b': tccode += 0x3; break;
            case 's': tccode += 0x4; break;
            case 't': tccode += 0x5; break;
            case 'p': tccode += 0x6; break;
            case 'h': tccode += 0x7; break;
            case 'n': lastj = 0x11CD; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//ln
            case 'd': lastj = 0x11CE; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//ld
            case 'h': lastj = 0x11CF; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//lh
            case 'l': lastj = 0x11D0; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//ll
            case 'z': lastj = 0x11D7; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//lz
            case 'k': lastj = 0x11D8; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//lk
            case 'x': lastj = 0x11D9; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//lx
            case 'v': lastj = 0xD7DB; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//lv
            case 'q': lastj = 0xD7DD; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//lq
            default: return text + ch;
        }
        tc = String.fromCharCode(tccode);
        return tc;
    }
    //lg
    case 14: {
        switch (ch) {
            case 's': lastj = 0x11CC; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//lgs
            case 'g': lastj = 0xD7D5; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//lgg
            case 'h': lastj = 0xD7D6; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//lgh
            default: return text + ch;
        }
    }
    //lm
    case 15: {
        switch (ch) {
            case 'g': lastj = 0x11D1; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//lmg
            case 's': lastj = 0x11D2; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//lms
            case 'h': lastj = 0xD7D8; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//lmh
            default: return text + ch;
        }
    }
    //lb
    case 16: {
        switch (ch) {
            case 's': lastj = 0x11D3; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//lbs
            case 'h': lastj = 0x11D4; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//lbh
            case 'q': lastj = 0x11D5; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//lbq
            case 'd': lastj = 0xD7D9; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//lbd
            case 'p': lastj = 0xD7DA; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//lbp
            default: return text + ch;
        }
    }
    //ls
    case 17: {
        switch (ch) {
            case 's': lastj = 0x11D6; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//lss
            default: return text + ch;
        }
    }
    //m
    case 21: {
        switch (ch) {
            case 'g': lastj = 0x11DA; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//mg
            case 'l': lastj = 0x11DB; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//ml
            case 'b': lastj = 0x11DC; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//mb
            case 's': lastj = 0x11DD; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//ms
            case 'z': lastj = 0x11DF; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//mz
            case 'c': lastj = 0x11E0; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//mc
            case 'h': lastj = 0x11E1; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//mh
            case 'q': lastj = 0x11E2; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//mq
            case 'n': lastj = 0xD7DE; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//mn
            case 'm': lastj = 0xD7E0; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//mm
            case 'j': lastj = 0xD7E2; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//mj
            default: return text + ch;
        }
    }
    //b
    case 22: {
        switch (ch) {
            case 's': tccode += 0x1; break;
            case 'l': lastj = 0x11E3; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//bl
            case 'p': lastj = 0x11E4; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//bp
            case 'h': lastj = 0x11E5; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//bh
            case 'q': lastj = 0x11E6; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//bq
            case 'd': lastj = 0xD7E3; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//bd
            case 'm': lastj = 0xD7E5; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//bm
            case 'b': lastj = 0xD7E6; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//bb
            case 'j': lastj = 0xD7E8; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//bj
            case 'c': lastj = 0xD7E9; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//bc
            default: return text + ch;
        }
        tc = String.fromCharCode(tccode);
        return tc;
    }
    //bs
    case 23: {
        switch (ch) {
            case 'd': lastj = 0xD7E7; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//bsd
            default: return text + ch;
        }
    }
    //s
    case 24: {
        switch (ch) {
            case 's': tccode += 0x1; break;
            case 'g': lastj = 0x11E7; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//sg
            case 'd': lastj = 0x11E8; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//sd
            case 'l': lastj = 0x11E9; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//sl
            case 'b': lastj = 0x11EA; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//sb
            case 'm': lastj = 0xD7EA; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//sm
            case 'z': lastj = 0xD7EE; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//sz
            case 'j': lastj = 0xD7EF; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//sj
            case 'c': lastj = 0xD7F0; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//sc
            case 'l': lastj = 0xD7F1; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//sl
            case 'h': lastj = 0xD7F2; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//sh
            default: return text + ch;
        }
        tc = String.fromCharCode(tccode);
        return tc;
    }
    //ss
    case 25: {
        switch (ch) {
            case 'g': lastj = 0xD7EC; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//ssg
            case 'd': lastj = 0xD7ED; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//ssd
            default: return text + ch;
        }
    }
    //q
    case 26: {
        switch (ch) {
            case 'g': lastj = 0x11EC; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//qg
            case 'q': lastj = 0x11EE; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//qq
            case 'k': lastj = 0x11EF; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//qk
            default: return text + ch;
        }
    }
    //j
    case 27: {
        switch (ch) {
            case 'b': lastj = 0xD7F7; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//jb
            case 'j': lastj = 0xD7F9; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//jj
            default: return text + ch;
        }
    }
    //p
    case 31: {
        switch (ch) {
            case 'b': lastj = 0x11F3; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//pb
            case 'q': lastj = 0x11F4; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//pq
            case 's': lastj = 0xD7FA; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//ps
            case 't': lastj = 0xD7FB; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//pt
            default: return text + ch;
        }
    }
    //h
    case 32: {
        switch (ch) {
            case 'n': lastj = 0x11F5; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//hn
            case 'l': lastj = 0x11F6; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//hl
            case 'm': lastj = 0x11F7; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//hm
            case 'b': lastj = 0x11F8; return String.fromCharCode(tccode + 5 - buff) + String.fromCharCode(lastj);//hb
            default: return text + ch;
        }
    }
}
    return text + ch;
}

function POJ(text, ch, ethn) {
    if (text == "")
        return text + ch;
    var a = text;
    var l = text.length - 1;
    if (l >= 0) {
        switch (a[l]) {
            case 'n':
                if ((ch == 'n') && (l > 0)) {
                    a[l] = 'ⁿ';
                    return a;
                }
                break;
            case 'o':
                if ((ch == 'o') || (ch == 'u')) return text + '˙';
                break;
        }
    }
    if (!isNaN(ch)) {
        if ((ch=='1')||(ch=='4')) {
            var i;
            for (i=l;i>=0;i--) {
                if("áàâǎā̍äåéèêěēë̊óòôǒōöúùûǔūüůíìîǐīïńǹ̂̌̄̈ḿ̂̌̄̀".indexOf(a[i]) > -1){
                    var ns = text.replace(a[i], mcPOJ(a[i], ch, ethn));
                    return ns;
                }
            }
            return text;
        }
        var ns;
	  if (ethn==1)
	  {		  
        ns = text.replace("ee", mcPOJ('y', ch, ethn));
        if (text != ns)
            return ns;	  
        ns = text.replace("ui", mcPOJ('w', ch, ethn));
        if (text != ns)
            return ns;
	  }
        ns = text.replace("a", mcPOJ('a', ch, ethn));
        if (text != ns)
            return ns;
        ns = text.replace("e", mcPOJ('e', ch, ethn));
        if (text != ns)
            return ns;
        ns = text.replace("o", mcPOJ('o', ch, ethn));
        if (text != ns)
            return ns;
        ns = text.replace("u", mcPOJ('u', ch, ethn));
        if (text != ns)
            return ns;
        ns = text.replace("i", mcPOJ('i', ch, ethn));
        if (text != ns)
            return ns;
        ns = text.replace("ng", mcPOJ('g', ch, ethn));
        if (text != ns)
            return ns;
        ns = text.replace("n", mcPOJ('n', ch, ethn));
        if (text != ns)
            return ns;
        ns = text.replace("m", mcPOJ('m', ch, ethn));
        if (text != ns)
            return ns;
    }
    return text + ch;
}

function mcPOJ(c, m, ethn) {
    if ((m=='1')||(m=='4')) {
        switch(c) {
            case 'á':case 'à':case 'â':case 'ǎ':case 'ā':case 'ä':case 'å':
                return "a";
            case 'é':case 'è':case 'ê':case 'ě':case 'ē':case 'ë':
                return "e";
            case 'ó':case 'ò':case 'ô':case 'ǒ':case 'ō':case 'ö':
                return "o";
            case 'ú':case 'ù':case 'û':case 'ǔ':case 'ū':case 'ü':case 'ů':
                return "u";
            case 'í':case 'ì':case 'î':case 'ǐ':case 'ī':case 'ï':
                return "i";
            case 'ń':case 'ǹ':
                return "n";
            case '̂':case '̍':case '̌':case '̄':case '̈':case '̊':case '̀':
                return "";
            case 'ḿ':
                return "m";
        }
    }
    switch(c){
        case 'a':
            if(m=='2') return "á";
            if(m=='3') return "à";
            if(m=='5') return "â";
            if(m=='6') return "ǎ";
            if(m=='7') return "ā";
            if(m=='8') return "a̍";
            if(m=='9') return "ä";
            if(m=='0') return "å";
            break;
        case 'e':
            if(m=='2') return "é";
            if(m=='3') return "è";
            if(m=='5') return "ê";
            if(m=='6') return "ě";
            if(m=='7') return "ē";
            if(m=='8') return "e̍";
            if(m=='9') return "ë";
            if(m=='0') return "e̊";
            break;
        case 'o':
            if(m=='2') return "ó";
            if(m=='3') return "ò";
            if(m=='5') return "ô";
            if(m=='6') return "ǒ";
            if(m=='7') return "ō";
            if(m=='8') return "o̍";
            if(m=='9') return "ö";
            if(m=='0') return "o̊";
            break;
        case 'u':
            if(m=='2') return "ú";
            if(m=='3') return "ù";
            if(m=='5') return "û";
            if(m=='6') return "ǔ";
            if(m=='7') return "ū";
            if(m=='8') return "u̍";
            if(m=='9') return "ü";
            if(m=='0') return "ů";
            break;
        case 'i':
            if(m=='2') return "í";
            if(m=='3') return "ì";
            if(m=='5') return "î";
            if(m=='6') return "ǐ";
            if(m=='7') return "ī";
            if(m=='8') return "i̍";
            if(m=='9') return "ï";
            if(m=='0') return "i̊";
            break;
        case 'g':
            if(m=='2') return "ńg";
            if(m=='3') return "ǹg";
            if(m=='5') return "n̂g";
            if(m=='6') return "ňg";
            if(m=='7') return "n̄g";
            if(m=='8') return "n̍g";
            if(m=='9') return "n̈g";
            if(m=='0') return "n̊g";
            return "ng";
        case 'n':
            if(m=='2') return "ń";
            if(m=='3') return "ǹ";
            if(m=='5') return "n̂";
            if(m=='6') return "ň";
            if(m=='7') return "n̄";
            if(m=='8') return "n̍";
            if(m=='9') return "n̈";
            if(m=='0') return "n̊";
            break;
        case 'm':
            if(m=='2') return "ḿ";
            if(m=='3') return "m̀";
            if(m=='5') return "m̂";
            if(m=='6') return "m̌";
            if(m=='7') return "m̄";
            if(m=='8') return "m̍";
            if(m=='9') return "m̈";
            if(m=='0') return "m̊";
            break;
        case 'y':
		  if (ethn==1)
		  {
            if(m=='2') return "eé";
            if(m=='3') return "eè";
            if(m=='5') return "eê";
            if(m=='6') return "eě";
            if(m=='7') return "eē";
            if(m=='8') return "ee̍";
            if(m=='9') return "eë";
            if(m=='0') return "ee̊";
            break;
		  }
        case 'w':
		  if (ethn==1)
		  {
            if(m=='2') return "uí";
            if(m=='3') return "uì";
            if(m=='5') return "uî";
            if(m=='6') return "uǐ";
            if(m=='7') return "uī";
            if(m=='8') return "ui̍";
            if(m=='9') return "uï";
            if(m=='0') return "ui̊";
            break;
		  }
    }
    return c;
}

function BUC(text, ch) {
    if (text == "")
        return text + ch;
    var a = text;
    var l = text.length - 1;
    if (ch == 'w')
        return text + '̤';
    if (!isNaN(ch)) {
        if (ch == '6') {
            var i;
            for (i = l; i >= 0; i--) {
                if ("áàâǎā̍éèêěēăĕĭŏŭóòôǒōúùûǔūíìîǐīń̆ǹ̂̌̄̈ḿ̂̌̄̀".indexOf(a[i]) > -1) {
                    var ns = text.replace(a[i], mcBUC(a[i], ch));
                    return ns;
                }
            }
            return text;
        }
        var ns;
        ns = text.replace("a", mcBUC('a', ch));
        if (text != ns) return ns;
        ns = text.replace("e", mcBUC('e', ch));
        if (text != ns) return ns;
        ns = text.replace("o", mcBUC('o', ch));
        if (text != ns) return ns;
        ns = text.replace("u", mcBUC('u', ch));
        if (text != ns) return ns;
        ns = text.replace("i", mcBUC('i', ch));
        if (text != ns) return ns;
        ns = text.replace("ng", mcBUC('g', ch));
        if (text != ns) return ns;
        ns = text.replace("m", mcBUC('m', ch));
        if (text != ns) return ns;
        ns = text.replace("n", mcBUC('n', ch));
        if (text != ns) return ns;
        return text;
    }
    return text + ch;
}

function mcBUC(c, m) {
    if (m=='6') {
        switch(c) {
            case 'á':case 'à':case 'â':case 'ă':case 'ā':case 'ä':case 'å':
                return "a";
            case 'é':case 'è':case 'ê':case 'ĕ':case 'ē':case 'ë':
                return "e";
            case 'ó':case 'ò':case 'ô':case 'ŏ':case 'ō':case 'ö':
                return "o";
            case 'ú':case 'ù':case 'û':case 'ŭ':case 'ū':case 'ü':case 'ů':
                return "u";
            case 'í':case 'ì':case 'î':case 'ĭ':case 'ī':case 'ï':
                return "i";
            case 'ń':case 'ǹ':
                return "n";
            case '̂':case '̍':case '̌':case '̄':case '̆':case '̈':case '̊':case '̀':
                return "";
            case 'ḿ':
                return "m";
        }
    }
    switch(c){
        case 'a':
            if(m=='3') return "á";
            if(m=='4') return "à";
            if(m=='5') return "â";
            if(m=='1') return "ă";
            if(m=='2') return "ā";
            break;
        case 'e':
            if(m=='3') return "é";
            if(m=='4') return "è";
            if(m=='5') return "ê";
            if(m=='1') return "ĕ";
            if(m=='2') return "ē";
            break;
        case 'o':
            if(m=='3') return "ó";
            if(m=='4') return "ò";
            if(m=='5') return "ô";
            if(m=='1') return "ŏ";
            if(m=='2') return "ō";
            break;
        case 'u':
            if(m=='3') return "ú";
            if(m=='4') return "ù";
            if(m=='5') return "û";
            if(m=='1') return "ŭ";
            if(m=='2') return "ū";
            break;
        case 'i':
            if(m=='3') return "í";
            if(m=='4') return "ì";
            if(m=='5') return "î";
            if(m=='1') return "ĭ";
            if(m=='2') return "ī";
            break;
        case 'g':
            if(m=='3') return "ńg";
            if(m=='4') return "ǹg";
            if(m=='5') return "n̂g";
            if(m=='1') return "n̆g";
            if(m=='2') return "n̄g";
            return "ng";
        case 'n':
            if(m=='3') return "ń";
            if(m=='4') return "ǹ";
            if(m=='5') return "n̂";
            if(m=='1') return "n̆";
            if(m=='2') return "n̄";
            break;
        case 'm':
            if(m=='3') return "ḿ";
            if(m=='4') return "m̀";
            if(m=='5') return "m̂";
            if(m=='1') return "m̆";
            if(m=='2') return "m̄";
            break;
    }
    return c;
}

function speakHokkien(inp) {
    var audio = new Audio('https://服務.意傳.台灣/文本直接合成?查詢腔口=台語&查詢語句='+inp);  
    audio.type = 'audio/wav';

    try {
        audio.play();
        console.log('Playing...');
    } catch (err) {
        console.log('Failed to play...' + error);
    }
}

function speakpad(accentcode, maxlevel) {
    var voice = "";
    var spkcont = "";
    var convtxt = logo2phon($("#txtPad").val(), false, maxlevel);
    if (convtxt.length > 0) {
        switch (accentcode) {
            case 0: voice = "Vietnamese Male"; spkcont = convtxt; break;
            case 2:
                speakHokkien(convtxt);
                return;
            case 5: voice = "Chinese Male"; spkcont = $("#txtPad").val(); break;
            case 6: voice = "Chinese (Hong Kong) Male"; spkcont = $("#txtPad").val(); break;
            case 8: voice = "Korean Male"; spkcont = convtxt; break;
            case 9: voice = "Japanese Male"; spkcont = $("#txtPad").val();; break;
            case 15: voice = "Thai Male"; spkcont = convtxt; break;
            default: voice = ""; responsiveVoice.speak("Voice Unavailable", "UK English Male"); break;
        }
        if (voice.length > 0) {
            responsiveVoice.speak(spkcont, voice);
        }

    }
}

function togglekeyboard(evt) {
    var ele = $("#keyboardbutton");
    if (ele.hasClass('active')) {
        ele.removeClass('active');
        $("#keyboard").css({ display: 'none' });
    }
    else {
        ele.addClass('active');
        $("#keyboard").css({ display: 'block' });
        loadkeyboard();
    }

    $("#txtPad").focus();
}

function loadkeyboard() {
    if (keyboard == 2) {
        defaultkeyboard();
        return;
    }
    if ($('#keyboard').css("display") == "block") {
        switch (quocngu) {
            case 11:
                defaultkeyboard();
                $('#K86').html("<span style='color: #d48600;'>◌̱</span><br>v");
                $('#K83').html("<span style='color: #d48600;'>◌́</span><br>s");
                $('#K70').html("<span style='color: #d48600;'>◌̀</span><br>f");
                $('#K74').html("<span style='color: #d48600;'>◌̣</span><br>j");
                $('#K82').html("<span style='color: #d48600;'>◌̉</span><br>r");
                $('#K88').html("<span style='color: #d48600;'>◌̃</span><br>x");
                $('#K90').html("<span style='color: #d48600;'>◌</span><br>z");
                $('#K65').html("<span style='color: #b1bb13;'>â</span><br><span style='color: #13abbb;'>ă  </span><span style='color: #7ba064;'>a</span>");
                $('#K69').html("<span style='color: #b1bb13;'>ê</span><br><span style='color: #7ba064;'>e</span>");
                $('#K79').html("<span style='color: #b1bb13;'>ô</span><br><span style='color: #13abbb;'>ơ  </span><span style='color: #7ba064;'>o</span>");
                $('#K85').html("<br><span style='color: #13abbb;'>ư  </span>u");
                $('#K87').html("<br><span style='color: #2f80b9;'>w</span>");
                $('#K68').html("<span style='color: #b1bb13;'>đ</span><br><span style='color: #7ba064;'>d</span>");
                break;
            case 0:
            case 29:
                defaultkeyboard();
                $('#K83').html("<span style='color: #d48600;'>◌́</span><br>s");
                $('#K70').html("<span style='color: #d48600;'>◌̀</span><br>f");
                $('#K74').html("<span style='color: #d48600;'>◌̣</span><br>j");
                $('#K82').html("<span style='color: #d48600;'>◌̉</span><br>r");
                $('#K88').html("<span style='color: #d48600;'>◌̃</span><br>x");
                $('#K90').html("<span style='color: #d48600;'>◌</span><br>z");
                $('#K65').html("<span style='color: #b1bb13;'>â</span><br><span style='color: #13abbb;'>ă  </span><span style='color: #7ba064;'>a</span>");
                $('#K69').html("<span style='color: #b1bb13;'>ê</span><br><span style='color: #7ba064;'>e</span>");
                $('#K79').html("<span style='color: #b1bb13;'>ô</span><br><span style='color: #13abbb;'>ơ  </span><span style='color: #7ba064;'>o</span>");
                $('#K85').html("<br><span style='color: #13abbb;'>ư  </span>u");
                $('#K87').html("<br><span style='color: #2f80b9;'>w</span>");
                $('#K68').html("<span style='color: #b1bb13;'>đ</span><br><span style='color: #7ba064;'>d</span>");
                break;
			case 31:
                defaultkeyboard();
                $('#K65').html("<span style='color: #b1bb13;'>â</span><br><span style='color: #13abbb;'>ă  </span><span style='color: #7ba064;'>a</span>");
                $('#K69').html("<span style='color: #b1bb13;'>ê</span><br><span style='color: #13abbb;'>ĕ  </span><span style='color: #7ba064;'>e</span>");
                $('#K79').html("<span style='color: #b1bb13;'>ô</span><br><span style='color: #13abbb;'>ŏ  </span><span style='color: #7ba064;'>o</span>");
                $('#K85').html("<br><span style='color: #13abbb;'>ŭ  </span>u");
                $('#K73').html("<br><span style='color: #13abbb;'>ĭ   </span>i");
                $('#K87').html("<br><span style='color: #2f80b9;'>w</span>");
                break;
            case 14:
                defaultkeyboard();
                $('#K83').html("<span style='color: #d48600;'>◌́</span><br>s");
                $('#K70').html("<span style='color: #d48600;'>◌̀</span><br>f");
                $('#K74').html("<span style='color: #d48600;'>◌̣</span><br>j");
                $('#K82').html("<span style='color: #d48600;'>◌̉</span><br>r");
                $('#K88').html("<span style='color: #d48600;'>◌̃</span><br>x");
                $('#K86').html("<span style='color: #d48600;'>◌̱</span><br>v");
                $('#K90').html("<span style='color: #d48600;'>◌</span><br>z");
                $('#K65').html("<span style='color: #b1bb13;'>â</span><br><span style='color: #13abbb;'>ă  </span><span style='color: #7ba064;'>a</span>");
                $('#K69').html("<span style='color: #b1bb13;'>ê</span><br><span style='color: #7ba064;'>e</span>");
                $('#K79').html("<span style='color: #b1bb13;'>ô</span><br><span style='color: #13abbb;'>ơ  </span><span style='color: #7ba064;'>o</span>");
                $('#K85').html("<br><span style='color: #13abbb;'>ư  </span>u");
                $('#K87').html("<br><span style='color: #2f80b9;'>w</span>");
                $('#K68').html("<span style='color: #b1bb13;'>đ</span><br><span style='color: #7ba064;'>d</span>");
                break;
            case 2:
            case 4:
                defaultkeyboard();
                $('#K85').html("<span style='color: #b1bb13;'>o˙</span><br>u");
                $('#K79').html("<span style='color: #b1bb13;'>o˙</span><br><span style='color: #7ba064;'>o</span>");
                $('#K49').html("<span style='color: #d48600;'>◌</span><br>1");
                $('#K50').html("<span style='color: #d48600;'>◌́</span><br>2");
                $('#K51').html("<span style='color: #d48600;'>◌̀</span><br>3");
                $('#K52').html("<span style='color: #d48600;'>◌</span><br>4");
                $('#K53').html("<span style='color: #d48600;'>◌̂</span><br>5");
                $('#K54').html("<span style='color: #d48600;'>◌̌</span><br>6");
                $('#K55').html("<span style='color: #d48600;'>◌̄</span><br>7");
                $('#K56').html("<span style='color: #d48600;'>◌̍</span><br>8");
                $('#K57').html("<span style='color: #d48600;'>◌̈</span><br>9");
                $('#K48').html("<span style='color: #d48600;'>◌̊</span><br>0");
                break;
            case 3:
                defaultkeyboard();
                $('#K49').html("<span style='color: #d48600;'>◌̆</span><br>1");
                $('#K50').html("<span style='color: #d48600;'>◌̄</span><br>2");
                $('#K51').html("<span style='color: #d48600;'>◌́</span><br>3");
                $('#K52').html("<span style='color: #d48600;'>◌̀</span><br>4");
                $('#K53').html("<span style='color: #d48600;'>◌̂</span><br>5");
                $('#K54').html("<span style='color: #d48600;'>◌</span><br>6");
                break;
            case 5:
                defaultkeyboard();
                $('#K86').html("<br>ü");
                $('#K49').html("<span style='color: #d48600;'>◌̄</span><br>1");
                $('#K50').html("<span style='color: #d48600;'>◌́</span><br>2");
                $('#K51').html("<span style='color: #d48600;'>◌̌</span><br>3");
                $('#K52').html("<span style='color: #d48600;'>◌̀</span><br>4");
                $('#K53').html("<span style='color: #d48600;'>◌</span><br>5");
                break;
            case 8:
                $('#K192').html("<br>`");
                $('#K48').html("<br>0");
                $('#K49').html("<br><span style='color: #d48600;'>〮</span>");
                $('#K50').html("<br><span style='color: #d48600;'>〯</span>");
                $('#K51').html("<br>3");
                $('#K52').html("<br><span style='color: #d48600;'>〿</span>");
                $('#K53').html("<br>5");
                $('#K54').html("<br>6");
                $('#K55').html("<br>7");
                $('#K56').html("<br>8");
                $('#K57').html("<br>9");
                $('#K81').html("<br>ㅇ");
                $('#K87').html("<br>ㆍ");
                $('#K69').html("<span style='color: #b59bff;'>ㅕ</span><br>ㅓ");
                $('#K82').html("<span style='color: #b1bb13;'>ᅕᅠ ᄾᅠ<br>ᅐᅠ ᄿᅠ</span>");
                $('#K84').html("<br>ㅌ");
                $('#K89').html("<br><span style='color: #6551d9;'>ㅡ</span>");
                $('#K85').html("<span style='color: #b59bff'>ㅠ</span><br>ㅜ");
                $('#K73').html("<br>ㅣ");
                $('#K79').html("<span style='color: #b59bff;'>ㅛ</span><br>ㅗ");
                $('#K80').html("<br>ㅍ");
                $('#K219').html("<br>[");
                $('#K221').html("<br>]");
                $('#K65').html("<span style='color: #b59bff;'>ㅑ</span><br>ㅏ");
                $('#K83').html("<span style='color: #b1bb13;'>ㅆ</span><br><span style='color: #7ba064;'>ㅅ</span>");
                $('#K68').html("<span style='color: #b1bb13;'>ㄸ</span><br><span style='color: #7ba064;'>ㄷ</span>");
                $('#K70').html("<span style='color: #b1bb13;'>ᅔᅠ ᄼᅠ<br>ᅎᅠ ᄽᅠ</span>");
                $('#K71').html("<span style='color: #b1bb13;'>ㄲ</span><br><span style='color: #7ba064;'>ㄱ</span>");
                $('#K72').html("<br>ㅎ");
                $('#K74').html("<span style='color: #b1bb13;'>ㅉ</span><br><span style='color: #7ba064;'>ㅈ</span>");
                $('#K75').html("<br>ㅋ");
                $('#K76').html("<br>ㄹ");
                $('#K186').html("<br>;");
                $('#K222').html("<br>'");
                $('#K90').html("<br>ㅿ");
                $('#K88').html("<br>ㆆ");
                $('#K67').html("<br>ㅊ");
                $('#K86').html("<br>ㆁ");
                $('#K66').html("<span style='color: #b1bb13;'>ㅃ</span><br><span style='color: #7ba064;'>ㅂ</span>");
                $('#K78').html("<br>ㄴ");
                $('#K77').html("<br>ㅁ");
                $('#K188').html("<br>,");
                $('#K190').html("<br>.");
                $('#K191').html("<br>/");
                $('#K16R').html("<br>⇧");
                $('#K16L').html("<br>⇧");
                break;
            case 13:
                defaultkeyboard();
                $('#K49').html("<span style='color: #d48600;'>◌́</span><br>1");
                $('#K50').html("<span style='color: #d48600;'>◌̀</span><br>2");
                $('#K51').html("<span style='color: #d48600;'>◌̂</span><br>3");
                $('#K52').html("<span style='color: #d48600;'>◌</span><br>4");
                break;
            case 28:
                defaultkeyboard();
                $('#K48').html("<span style='color: #d48600;'>◌</span><br>0");
                $('#K49').html("<span style='color: #d48600;'>◌̈</span><br>1");
                $('#K50').html("<span style='color: #d48600;'>◌̌</span><br>2");
                $('#K51').html("<span style='color: #d48600;'>◌̄</span><br>3");
                $('#K52').html("<span style='color: #d48600;'>◌̤</span><br>4");
                $('#K53').html("<span style='color: #d48600;'>◌̬</span><br>5");
                $('#K54').html("<span style='color: #d48600;'>◌̱</span><br>6");
                $('#K85').html("<span style='color: #b1bb13;'>ư</span><br><span style='color: #7ba064;'>u</span>");
                $('#K68').html("<span style='color: #b1bb13;'>đ</span><br><span style='color: #7ba064;'>d</span>");
                break;
            case 15:
                $('#K192').html("<br>`");
                $('#K48').html("<span style='color: #d22e9f;'>๐  </span><span style='color: #b1bb13;'>ะ</span><br><span style='color: #7ba064;'>◌ั</span>");
                $('#K49').html("<span style='color: #d22e9f;'>๑   </span><br><span style='color: #d48600;'>◌่</span>");
                $('#K50').html("<span style='color: #d22e9f;'>๒   </span><br><span style='color: #d48600;'>◌้</span>");
                $('#K51').html("<span style='color: #d22e9f;'>๓   </span><br><span style='color: #d48600;'>◌๊</span>");
                $('#K52').html("<span style='color: #d22e9f;'>๔   </span><br><span style='color: #d48600;'>◌๋</span>");
                $('#K53').html("<span style='color: #d22e9f;'>๕   </span><br>โ");
                $('#K54').html("<span style='color: #d22e9f;'>๖   </span><br>ใ");
                $('#K55').html("<span style='color: #d22e9f;'>๗   </span><br>ไ");
                $('#K56').html("<span style='color: #d22e9f;'>๘   </span><br><span style='color: #7ba064;'>◌ำ</span>");
                $('#K57').html("<span style='color: #d22e9f;'>๙   </span><br><span style='color: #7ba064;'>◌็</span>");
                $('#K81').html("<span style='color: #d22e9f;'>ซ   </span><br><span style='color: #13abbb;'>ฌ </span>ช");
                $('#K87').html("<span style='color: #b1bb13;'>◌ื</span><br><span style='color: #7ba064;'>◌ึ</span>");
                $('#K69').html("<span style='color: #b1bb13;'>แ</span><br><span style='color: #7ba064;'>เ</span>");
                $('#K82').html("<span style='color: #d22e9f;'>ฤ   </span><br>ร");
                $('#K84').html("<span style='color: #d22e9f;'>ฏ   </span><br><span style='color: #13abbb;'>ฒ  </span>ต");
                $('#K89').html("<br>ย");
                $('#K85').html("<span style='color: #d22e9f;'>ฯ </span><span style='color: #b1bb13;'>◌ู</span><br><span style='color: #7ba064;'>◌ฺ</span>");
                $('#K73').html("<span style='color: #d22e9f;'>๚ </span><span style='color: #b1bb13;'>◌ี</span><br><span style='color: #7ba064;'>◌ิ</span>");
                $('#K79').html("<span style='color: #d22e9f;'>◌ฺ   </span><br><span style='color: #13abbb;'>ฮ  </span>อ");
                $('#K80').html("<span style='color: #d22e9f;'>◌๎   </span><br><span style='color: #13abbb;'>ฝ  </span>ผ");
                $('#K219').html("<br>[");
                $('#K221').html("<br>]");
                $('#K65').html("<span style='color: #d22e9f;'>◌์ </span><span style='color: #b1bb13;'>ๅ</span><br><span style='color: #7ba064;'>า</span>");
                $('#K83').html("<span style='color: #d22e9f;'>ษ   </span><br><span style='color: #13abbb;'>ศ  </span>ส");
                $('#K68').html("<span style='color: #d22e9f;'>ฎ   </span><br><span style='color: #13abbb;'>ธ  </span>ด");
                $('#K70').html("<span style='color: #d22e9f;'>๛  </span><br><span style='color: #13abbb;'>ฟ </span>พ");
                $('#K71').html("<br>ง");
                $('#K72').html("<br><span style='color: #2f80b9;'>ห</span>");
                $('#K74').html("<span style='color: #d22e9f;'>ฑ   </span><br>ท");
                $('#K75').html("<span style='color: #d22e9f;'>ฅ   </span><br><span style='color: #13abbb;'>ค  </span>ก");
                $('#K76').html("<span style='color: #d22e9f;'>ฦ   </span><br><span style='color: #13abbb;'>ฬ  </span>ล");
                $('#K186').html("<br>;");
                $('#K222').html("<br><span style='color: #cc4444;'>'</span>");
                $('#K90').html("<span style='color: #d22e9f;'>ฐ   </span><br>ถ");
                $('#K88').html("<span style='color: #d22e9f;'>ฃ   </span><br><span style='color: #13abbb;'>ฆ  </span>ข");
                $('#K67').html("<span style='color: #d22e9f;'>๏   </span><br><span style='color: #13abbb;'>ฉ  </span>จ");
                $('#K86').html("<span style='color: #d22e9f;'>ๆ   </span><br><span style='color: #13abbb;'>ภ  </span>ว");
                $('#K66').html("<span style='color: #d22e9f;'>฿   </span><br><span style='color: #13abbb;'>ป  </span>บ");
                $('#K78').html("<span style='color: #d22e9f;'>ณ   </span><br><span style='color: #13abbb;'>ญ </span>น");
                $('#K77').html("<span style='color: #d22e9f;'>◌ํ   </span><br>ม");
                $('#K188').html("<br>,");
                $('#K190').html("<br>.");
                $('#K191').html("<br>/");
                $('#K16R').html("<br>⇧");
                $('#K16L').html("<br>⇧");
                break;
            case 30:
                $('#K192').html("<br>`");
                $('#K48').html("<span style='color: #d22e9f;'>𕋰   </span><span style='color: #b1bb13;'>𕋘</span><br><span style='color: #7ba064;'>◌𕋚</span>");
                $('#K49').html("<span style='color: #d22e9f;'>𕋱    </span><br><span style='color: #d48600;'>◌𕋬</span>");
                $('#K50').html("<span style='color: #d22e9f;'>𕋲    </span><br><span style='color: #d48600;'>◌𕋮</span>");
                $('#K51').html("<span style='color: #d22e9f;'>𕋳    </span><br><span style='color: #d48600;'>◌𕋭</span>");
                $('#K52').html("<span style='color: #d22e9f;'>𕋴    </span><br><span style='color: #d48600;'>◌𕋥</span>");
                $('#K53').html("<span style='color: #d22e9f;'>𕋵    </span><br>𕋢");
                $('#K54').html("<span style='color: #d22e9f;'>𕋶    </span><br>𕋣");
                $('#K55').html("<span style='color: #d22e9f;'>𕋷    </span><br>𕋤");
                $('#K56').html("<span style='color: #d22e9f;'>𕋸    </span><br><span style='color: #7ba064;'>𕋞</span>");
                $('#K57').html("<span style='color: #d22e9f;'>𕋹    </span><br><span style='color: #7ba064;'>𕋟</span>");
                $('#K81').html("<span style='color: #d22e9f;'>𕊺   </span><br>𕊹");
                $('#K87').html("<span style='color: #d22e9f;'>◌𕋨 </span><span style='color: #b1bb13;'>◌𕋩</span><br><span style='color: #7ba064;'>𕋝</span>");
                $('#K69').html("<span style='color: #b1bb13;'>𕋡</span><br><span style='color: #7ba064;'>𕋠</span>");
                $('#K82').html("<span style='color: #d22e9f;'>𕋺   </span><br>𕋏");
                $('#K84').html("<span style='color: #d22e9f;'>𕊼   </span><br><span style='color: #13abbb;'>𕊽  </span>𕋁");
                $('#K89').html("<br>𕋎");
                $('#K85').html("<span style='color: #d22e9f;'>◌𕋪  </span><span style='color: #b1bb13;'>◌𕋦</span><br><span style='color: #7ba064;'>𕋛</span>");
                $('#K73').html("<span style='color: #d22e9f;'>◌𕋫  </span><span style='color: #b1bb13;'>◌𕋧</span><br><span style='color: #7ba064;'>𕋜</span>");
                $('#K79').html("<span style='color: #d22e9f;'>𕋼   </span><br><span style='color: #13abbb;'>𕋗  </span>𕋖");
                $('#K80').html("<br><span style='color: #13abbb;'>𕋉  </span>𕋈");
                $('#K219').html("<br>[");
                $('#K221').html("<br>]");
                $('#K65').html("<span style='color: #b1bb13;'>◌𕋯</span><br><span style='color: #7ba064;'>𕋙</span>");
                $('#K83').html("<span style='color: #d22e9f;'>𕋓   </span><br><span style='color: #13abbb;'>𕋒  </span>𕋔");
                $('#K68').html("<span style='color: #d22e9f;'>𕋻   </span><br><span style='color: #13abbb;'>𕋄  </span>𕋀");
                $('#K70').html("<br><span style='color: #13abbb;'>𕋋 </span>𕋊");
                $('#K71').html("<br>𕊶");
                $('#K72').html("<br><span style='color: #2f80b9;'>𕋕</span>");
                $('#K74').html("<br>𕋃");
                $('#K75').html("<span style='color: #d22e9f;'>𕊴   </span><br><span style='color: #13abbb;'>𕊳  </span>𕊰");
                $('#K76').html("<span style='color: #d22e9f;'>𕋽   </span><br>𕋐");
                $('#K186').html("<br>;");
                $('#K222').html("<br><span style='color: #cc4444;'>'</span>");
                $('#K90').html("<span style='color: #d22e9f;'>𕊾   </span><br>𕋂");
                $('#K88').html("<span style='color: #d22e9f;'>𕊲   </span><br><span style='color: #13abbb;'>𕊵  </span>𕊱");
                $('#K67').html("<span style='color: #d22e9f;'>𕋿   </span><br><span style='color: #13abbb;'>𕊸  </span>𕊷");
                $('#K86').html("<br><span style='color: #13abbb;'>𕋌  </span>𕋑");
                $('#K66').html("<span style='color: #d22e9f;'>𕋾   </span><br><span style='color: #13abbb;'>𕋇  </span>𕋆");
                $('#K78').html("<span style='color: #d22e9f;'>𕊿   </span><br><span style='color: #13abbb;'>𕊻 </span>𕋅");
                $('#K77').html("<br>𕋍");
                $('#K188').html("<br>,");
                $('#K190').html("<br>.");
                $('#K191').html("<br>/");
                $('#K16R').html("<br>⇧");
                $('#K16L').html("<br>⇧");
                break;
            case 16:
                $('#K192').html("<br>`");
                $('#K48').html("<span style='color: #d22e9f;'>໐ </span><span style='color: #b1bb13;'>ະ</span><br><span style='color: #7ba064;'>◌ັ</span>");
                $('#K49').html("<span style='color: #d22e9f;'>໑   </span><br><span style='color: #d48600;'>◌່</span>");
                $('#K50').html("<span style='color: #d22e9f;'>໒   </span><br><span style='color: #d48600;'>◌້</span>");
                $('#K51').html("<span style='color: #d22e9f;'>໓   </span><br><span style='color: #d48600;'>◌໊</span>");
                $('#K52').html("<span style='color: #d22e9f;'>໔   </span><br><span style='color: #d48600;'>◌໋</span>");
                $('#K53').html("<span style='color: #d22e9f;'>໕   </span><br>ໂ");
                $('#K54').html("<span style='color: #d22e9f;'>໖   </span><br>ໃ");
                $('#K55').html("<span style='color: #d22e9f;'>໗   </span><br>ໄ");
                $('#K56').html("<span style='color: #d22e9f;'>໘   </span><br>ຽ");
                $('#K57').html("<span style='color: #d22e9f;'>໙   </span><br><span style='color: #7ba064;'>◌ົ</span>");
                $('#K81').html("<br><span style='color: #13abbb;'>ຌ </span>ຊ");
                $('#K87').html("<span style='color: #b1bb13;'>◌ື</span><br><span style='color: #7ba064;'>◌ຶ</span>");
                $('#K69').html("<span style='color: #b1bb13;'>ແ</span><br><span style='color: #7ba064;'>ເ</span>");
                $('#K82').html("<br><span style='color: #13abbb;'>ຮ </span>ຣ");
                $('#K84').html("<span style='color: #d22e9f;'>ຏ   </span><br><span style='color: #13abbb;'>ຒ </span>ຕ");
                $('#K89').html("<span style='color: #d22e9f;'>ໟ   </span><br><span style='color: #13abbb;'>ຢ </span>ຍ");
                $('#K85').html("<span style='color: #d22e9f;'>ຯ  </span><span style='color: #b1bb13;'>◌ູ</span><br><span style='color: #7ba064;'>◌ຸ</span>");
                $('#K73').html("<span style='color: #b1bb13;'>◌ີ</span><br><span style='color: #7ba064;'>◌ິ</span>");
                $('#K79').html("<span style='color: #d22e9f;'>຺   </span><br><span style='color: #13abbb;'>◌ໍ </span>ອ");
                $('#K80').html("<br><span style='color: #13abbb;'>ຝ </span>ຜ");
                $('#K219').html("<br>[");
                $('#K221').html("<br>]");
                $('#K65').html("<span style='color: #d22e9f;'>◌໌   </span><br>າ");
                $('#K83').html("<span style='color: #d22e9f;'>ຩ   </span><br><span style='color: #13abbb;'>ຨ </span>ສ");
                $('#K68').html("<br><span style='color: #13abbb;'>ຘ </span>ດ");
                $('#K70').html("<br><span style='color: #13abbb;'>ຟ </span>ພ");
                $('#K71').html("<br><span style='color: #13abbb;'>ໞ </span>ງ");
                $('#K72').html("<br><span style='color: #2f80b9;'>ຫ</span>");
                $('#K74').html("<span style='color: #d22e9f;'>ຑ   </span><br>ທ");
                $('#K75').html("<br><span style='color: #13abbb;'>ຄ </span>ກ");
                $('#K76').html("<span style='color: #d22e9f;'>◌ຼ   </span><br><span style='color: #13abbb;'>ຬ </span>ລ");
                $('#K186').html("<br>;");
                $('#K222').html("<br><span style='color: #cc4444;'>'</span>");
                $('#K90').html("<span style='color: #d22e9f;'>ຐ   </span><br>ຖ");
                $('#K88').html("<br><span style='color: #13abbb;'>ຆ </span>ຂ");
                $('#K67').html("<br><span style='color: #13abbb;'>ຉ </span>ຈ");
                $('#K86').html("<span style='color: #d22e9f;'>ໆ   </span><br><span style='color: #13abbb;'>ຠ </span>ວ");
                $('#K66').html("<br><span style='color: #13abbb;'>ປ </span>ບ");
                $('#K78').html("<span style='color: #13abbb;'>ໜ   </span><br><span style='color: #13abbb;'>ຎ </span>ນ");
                $('#K77').html("<span style='color: #13abbb;'>ໝ   </span><br><span style='color: #13abbb;'>ຳ </span>ມ");
                $('#K188').html("<br>,");
                $('#K190').html("<br>.");
                $('#K191').html("<br>/");
                $('#K16R').html("<br>⇧");
                $('#K16L').html("<br>⇧");
                break;
            case 17:
                $('#K192').html("<br>`");
                $('#K48').html("<br><span style='color: #6551d9;'>◌ꪰ</span>");
                $('#K49').html("<br><span style='color: #13abbb;'>ꫀ  </span><span style='color: #d48600;'>◌꪿</span>");
                $('#K50').html("<br><span style='color: #13abbb;'>ꫂ  </span><span style='color: #d48600;'>◌꫁</span>");
                $('#K51').html("<br>ꪶ");
                $('#K52').html("<br>ꪵ");
                $('#K53').html("<br>ꪺ");
                $('#K54').html("<br>ꪻ");
                $('#K55').html("<br>ꪼ");
                $('#K56').html("<br><span style='color: #ffc000;'>◌ꪸ</span>");
                $('#K57').html("<br><span style='color: #ffc000;'>◌ꪳ</span>");
                $('#K81').html("<span style='color: #d22e9f;'>ꪃ   </span><br><span style='color: #13abbb;'>ꪇ   </span>ꪅ");
                $('#K87').html("<br><span style='color: #ffc000;'>ꪷ</span>");
                $('#K69').html("<br>ꪹ");
                $('#K82').html("<span style='color: #d22e9f;'>ꪧ   </span><span style='color: #b1bb13;'>ꪦ</span><br><span style='color: #7ba064;'>ꪭ</span>");
                $('#K84').html("<span style='color: #d22e9f;'>ꪕ   </span><br>ꪔ");
                $('#K89').html("<span style='color: #13abbb;'>ꪤ   </span><br>ꪥ");
                $('#K85').html("<br><span style='color: #ffc000;'>◌ꪴ</span>");
                $('#K73').html("<br><span style='color: #ffc000;'>◌ꪲ</span>");
                $('#K79').html("<span style='color: #d22e9f;'>ꪯ   </span><br>ꪮ");
                $('#K80').html("<span style='color: #d22e9f;'>ꪝ   </span><br><span style='color: #13abbb;'>ꪟ   </span>ꪜ");
                $('#K219').html("<br>[");
                $('#K221').html("<br>]");
                $('#K65').html("<br>ꪱ");
                $('#K83').html("<span style='color: #d22e9f;'>ꪏ   </span><br><span style='color: #13abbb;'>ꪍ   </span>ꪎ");
                $('#K68').html("<span style='color: #d22e9f;'>ꪓ   </span><br>ꪒ");
                $('#K70').html("<span style='color: #d22e9f;'>ꪡ   </span><br><span style='color: #13abbb;'>ꪞ  </span>ꪠ");
                $('#K71').html("<span style='color: #13abbb;'>ꪈ   </span><br>ꪉ");
                $('#K72').html("<br><span style='color: #2f80b9;'>ꪬ</span>");
                $('#K74').html("<span style='color: #13abbb;'>ꪐ   </span><br>ꪑ");
                $('#K75').html("<span style='color: #d22e9f;'>ꪁ   </span><br><span style='color: #13abbb;'>ꪆ  </span>ꪀ");
                $('#K76').html("<span style='color: #13abbb;'>ꪨ   </span><br>ꪩ");
                $('#K186').html("<br>;");
                $('#K222').html("<br><span style='color: #cc4444;'>'</span>");
                $('#K90').html("<span style='color: #d22e9f;'>ꪗ   </span><br>ꪖ");
                $('#K88').html("<span style='color: #d22e9f;'>ꪂ   </span><br>ꪄ");
                $('#K67').html("<span style='color: #d22e9f;'>ꪋ   </span><br><span style='color: #13abbb;'>ꪌ  </span>ꪊ");
                $('#K86').html("<span style='color: #13abbb;'>ꪪ  </span><br>ꪫ");
                $('#K66').html("<span style='color: #d22e9f;'>ꪛ   </span><br>ꪚ");
                $('#K78').html("<span style='color: #13abbb;'>ꪘ </span><span style='color: #b59bff;'>ꪽ</span><br>ꪙ");
                $('#K77').html("<span style='color: #13abbb;'>ꪢ  </span><span style='color: #b59bff;'>◌ꪾ</span><br>ꪣ");
                $('#K188').html("<br>,");
                $('#K190').html("<br>.");
                $('#K191').html("<br>/");
                $('#K16R').html("<br>⇧");
                $('#K16L').html("<br>⇧");
                break;
            case 18:
                $('#K192').html("<br>`");
                $('#K48').html("<br><span style='color: #6551d9;'>◌ꪰ</span>");
                $('#K49').html("<br><span style='color: #13abbb;'>ꫀ  </span><span style='color: #d48600;'>◌꪿</span>");
                $('#K50').html("<br><span style='color: #13abbb;'>ꫂ  </span><span style='color: #d48600;'>◌꫁</span>");
                $('#K51').html("<span style='color: #b1bb13;'>ꪶ‍ </span><br><span style='color: #7ba064;'>ꪶ</span>");
                $('#K52').html("<br>ꪵ");
                $('#K53').html("<br>ꪺ");
                $('#K54').html("<br>ꪻ");
                $('#K55').html("<br>ꪼ");
                $('#K56').html("<br><span style='color: #ffc000;'>◌ꪸ</span>");
                $('#K57').html("<br><span style='color: #ffc000;'>◌ꪳ</span>");
                $('#K81').html("<span style='color: #d22e9f;'>ꪃ   </span><br>ꪅ");
                $('#K87').html("<span style='color: #b1bb13;'>◌ꪷꪷ</span><br><span style='color: #7ba064;'>ꪷ</span>");
                $('#K69').html("<br>ꪹ");
                $('#K82').html("<span style='color: #d22e9f;'>ꪧ   </span><span style='color: #b1bb13;'>ꪦ</span><br><span style='color: #7ba064;'>ꪭ</span>");
                $('#K84').html("<span style='color: #d22e9f;'>ꪕ   </span><br>ꪔ");
                $('#K89').html("<span style='color: #13abbb;'>ꪤ   </span><br>ꪥ");
                $('#K85').html("<br><span style='color: #ffc000;'>◌ꪴ</span>");
                $('#K73').html("<br><span style='color: #ffc000;'>◌ꪲ</span>");
                $('#K79').html("<span style='color: #d22e9f;'>ꪯ   </span><br>ꪮ");
                $('#K80').html("<span style='color: #d22e9f;'>ꪝ   </span><br><span style='color: #13abbb;'>ꪟ   </span>ꪜ");
                $('#K219').html("<br>[");
                $('#K221').html("<br>]");
                $('#K65').html("<span style='color: #b1bb13;'>◌꫏</span><br><span style='color: #7ba064;'>ꪱ</span>");
                $('#K83').html("<span style='color: #d22e9f;'>ꪏ   </span><br><span style='color: #13abbb;'>ꪍ   </span>ꪎ");
                $('#K68').html("<span style='color: #d22e9f;'>ꪓ </span><span style='color: #b59bff;'>​꫉</span><br>ꪒ");
                $('#K70').html("<span style='color: #d22e9f;'>ꪡ   </span><br><span style='color: #13abbb;'>ꪞ  </span>ꪠ");
                $('#K71').html("<span style='color: #13abbb;'>ꪈ   </span><br>ꪉ");
                $('#K72').html("<br><span style='color: #2f80b9;'>ꪬ</span>");
                $('#K74').html("<span style='color: #13abbb;'>ꪐ   </span><br>ꪑ");
                $('#K75').html("<span style='color: #d22e9f;'>ꪁ   </span><br><span style='color: #13abbb;'>ꪆ  </span>ꪀ");
                $('#K76').html("<span style='color: #13abbb;'>ꪨ   </span><br>ꪩ");
                $('#K186').html("<br>;");
                $('#K222').html("<br><span style='color: #cc4444;'>'</span>");
                $('#K90').html("<span style='color: #d22e9f;'>ꪗ   </span><br>ꪖ");
                $('#K88').html("<span style='color: #d22e9f;'>ꪂ   </span><br>ꪄ");
                $('#K67').html("<span style='color: #d22e9f;'>ꪋ   </span><br><span style='color: #13abbb;'>ꪌ  </span>ꪊ");
                $('#K86').html("<span style='color: #13abbb;'>ꪪ  </span><br>ꪫ");
                $('#K66').html("<span style='color: #d22e9f;'>ꪛ   </span><br>ꪚ");
                $('#K78').html("<span style='color: #13abbb;'>ꪘ </span><span style='color: #b59bff;'>ꪽ</span><br>ꪙ");
                $('#K77').html("<span style='color: #13abbb;'>ꪢ  </span><span style='color: #b59bff;'>◌ꪾ</span><br>ꪣ");
                $('#K188').html("<br>,");
                $('#K190').html("<br>.");
                $('#K191').html("<br>/");
                $('#K16R').html("<br>⇧");
                $('#K16L').html("<br>⇧");
                break;
            case 27:
                $('#K192').html("<br>`");
                $('#K48').html("<span style='color: #b59bff;'>꫊</span><br><span style='color: #6551d9;'>ꪷ</span>");
                $('#K49').html("<br><span style='color: #13abbb;'>ꫀ  </span><span style='color: #d48600;'>◌꪿</span>");
                $('#K50').html("<br><span style='color: #13abbb;'>ꫂ  </span><span style='color: #d48600;'>◌꫁</span>");
                $('#K51').html("<span style='color: #b1bb13;'>ꪶ‍ </span><br><span style='color: #7ba064;'>ꪶ</span>");
                $('#K52').html("<br>ꪵ");
                $('#K53').html("<br>ꪺ");
                $('#K54').html("<br>ꪻ");
                $('#K55').html("<br>ꪼ");
                $('#K56').html("<span style='color: #b1bb13;'>◌ꪸꪸ</span><br><span style='color: #7ba064;'>◌ꪸ</span>");
                $('#K57').html("<span style='color: #b1bb13;'>◌ꪳꪳ</span><br><span style='color: #7ba064;'>◌ꪳ</span>");
                $('#K81').html("<span style='color: #d22e9f;'>ꪃ   </span><br><span style='color: #13abbb;'>ꪇ   </span>ꪅ");
                $('#K87').html("<br><span style='color: #ffc000;'>ꪰ</span>");
                $('#K69').html("<br>ꪹ");
                $('#K82').html("<span style='color: #d22e9f;'>ꪧ   </span><span style='color: #b1bb13;'>ꪦ</span><br><span style='color: #7ba064;'>ꪭ</span>");
                $('#K84').html("<span style='color: #d22e9f;'>ꪕ   </span><br>ꪔ");
                $('#K89').html("<span style='color: #13abbb;'>ꪤ‍   </span><br>ꪥ");
                $('#K85').html("<span style='color: #b1bb13;'>◌ꪴꪴ</span><br><span style='color: #7ba064;'>◌ꪴ</span>");
                $('#K73').html("<span style='color: #b1bb13;'>◌ꪲꪲ</span><br><span style='color: #7ba064;'>◌ꪲ</span>");
                $('#K79').html("<span style='color: #d22e9f;'>ꪯ  </span><span style='color: #b1bb13;'>ꪮ</span><br>ꪮ");
                $('#K80').html("<span style='color: #d22e9f;'>ꪝ   </span><br><span style='color: #13abbb;'>ꪟ   </span>ꪜ");
                $('#K219').html("<br>[");
                $('#K221').html("<br>]");
                $('#K65').html("<br>ꪱ");
                $('#K83').html("<span style='color: #d22e9f;'>ꪏ   </span><br><span style='color: #13abbb;'>ꪍ   </span>ꪎ‍");
                $('#K68').html("<span style='color: #d22e9f;'>ꪓ   </span><br>ꪒ");
                $('#K70').html("<span style='color: #d22e9f;'>ꪡ   </span><br><span style='color: #13abbb;'>ꪞ  </span>ꪌ");
                $('#K71').html("<span style='color: #13abbb;'>ꪈ‍   </span><br>ꪉ‍");
                $('#K72').html("<br><span style='color: #2f80b9;'>ꪬ</span>");
                $('#K74').html("<span style='color: #13abbb;'>ꪐ   </span><br>ꪑ");
                $('#K75').html("<span style='color: #d22e9f;'>ꪁ‍   </span><br><span style='color: #13abbb;'>ꪆ  </span><span style='color: #90ffc2;'>ꪀ</span>");
                $('#K76').html("<span style='color: #13abbb;'>ꪨ   </span><br>ꪩ");
                $('#K186').html("<br>;");
                $('#K222').html("<br><span style='color: #cc4444;'>'</span>");
                $('#K90').html("<span style='color: #d22e9f;'>ꪗ‍   </span><br>ꪖ");
                $('#K88').html("<span style='color: #d22e9f;'>ꪂ‍   </span><br>ꪄ‍");
                $('#K67').html("<span style='color: #d22e9f;'>ꪋ   </span><br><span style='color: #13abbb;'>ꪠ‍  </span>ꪊ");
                $('#K86').html("<span style='color: #13abbb;'>ꪪ‍ </span><span style='color: #4fd454;'>ꪀ‍ꪫ‍</span><br>ꪫ‍");
                $('#K66').html("<span style='color: #d22e9f;'>ꪛ   </span><br>ꪚ");
                $('#K78').html("<span style='color: #13abbb;'>ꪘ </span><span style='color: #b59bff;'>ꪽ</span><br><span style='color: #4fd454;'>ꪀ‍ꪙ </span>ꪙ");
                $('#K77').html("<span style='color: #13abbb;'>ꪢ  </span><span style='color: #b59bff;'>◌ꪾ</span><br>ꪣ");
                $('#K188').html("<br>,");
                $('#K190').html("<br>.");
                $('#K191').html("<br>/");
                $('#K16R').html("<br>⇧");
                $('#K16L').html("<br>⇧");
                break;
            case 19:
            case 20:
                $('#K192').html("<br>`");
                $('#K48').html("<span style='color: #d22e9f;'>᪐  </span><span style='color: #b1bb13;'>ᩡ</span><br><span style='color: #d22e9f;'>᪀  </span><span style='color: #7ba064;'> ᩫ</span>");
                $('#K49').html("<span style='color: #d22e9f;'>᪑ </span><span style='color: #b1bb13;'> ᩷</span><br><span style='color: #d22e9f;'>᪁  </span><span style='color: #7ba064;'> ᩵</span>");
                $('#K50').html("<span style='color: #d22e9f;'>᪒   </span><span style='color: #b1bb13;'> ᩸</span><br><span style='color: #d22e9f;'>᪂  </span><span style='color: #7ba064;'> ᩶</span>");
                $('#K51').html("<span style='color: #d22e9f;'>᪓   </span><br><span style='color: #d22e9f;'>᪃  </span><span style='color: #7ba064;'>ᩕ </span>");
                $('#K52').html("<span style='color: #d22e9f;'>᪔   </span><br><span style='color: #d22e9f;'>᪄   </span><span style='color: #7ba064;'> ᩖ</span>");
                $('#K53').html("<span style='color: #d22e9f;'>᪕ </span><span style='color: #b1bb13;'>ᩒ</span><br><span style='color: #d22e9f;'>᪅ </span><span style='color: #7ba064;'>ᩰ   </span>");
                $('#K54').html("<span style='color: #d22e9f;'>᪖   </span><br><span style='color: #d22e9f;'>᪆  </span>ᩲ");
                $('#K55').html("<span style='color: #d22e9f;'>᪗   </span><br><span style='color: #d22e9f;'>᪇  </span>ᩱ");
                $('#K56').html("<span style='color: #d22e9f;'>᪘ </span><span style='color: #b1bb13;'> ᩼</span><br><span style='color: #d22e9f;'>᪈ </span><span style='color: #7ba064;'> ◌​᩠</span>");
                $('#K57').html("<span style='color: #d22e9f;'>᪙   </span><span style='color: #b1bb13;'> ᩴ</span><br><span style='color: #d22e9f;'>᪉   </span><span style='color: #7ba064;'> ᩢ</span>");
                $('#K81').html("<span style='color: #d22e9f;'>ᨪ   </span><br><span style='color: #13abbb;'>ᨫ </span>ᨩ");
                $('#K87').html("<span style='color: #d22e9f;'>ᩐ   </span><br><span style='color: #7ba064;'> ᩪ</span>");
                $('#K69').html("<span style='color: #d22e9f;'>ᩑ </span><span style='color: #b1bb13;'>ᩯ</span><br><span style='color: #7ba064;'>ᩮ</span>");
                $('#K82').html("<span style='color: #d22e9f;'>ᩂ   </span><br><span style='color: #13abbb;'>◌​᩺ </span>ᩁ");
                $('#K84').html("<span style='color: #d22e9f;'>ᨮ   </span><br><span style='color: #13abbb;'>ᨭ </span>ᨲ");
                $('#K89').html("<span style='color: #d22e9f;'>ᩀ   </span><br><span style='color: #13abbb;'>◌​ᩭ </span>ᨿ");
                $('#K85').html("<span style='color: #d22e9f;'>ᩏ </span><span style='color: #b1bb13;'> ᩳ</span><br><span style='color: #7ba064;'> ᩩ</span>");
                $('#K73').html("<span style='color: #d22e9f;'>ᩍ </span><span style='color: #b1bb13;'> ᩦ</span><br><span style='color: #7ba064;'> ᩥ</span>");
                $('#K79').html("<span style='color: #b1bb13;'> ᩬ</span><br><span style='color: #7ba064;'>ᩋ</span>");
                $('#K80').html("<span style='color: #d22e9f;'> ᩚ   </span><br><span style='color: #13abbb;'>ᨼ </span>ᨻ");
                $('#K219').html("<br>[");
                $('#K221').html("<br>]");
                $('#K65').html("<span style='color: #d22e9f;'> ᩹  </span><span style='color: #b1bb13;'>ᩤ</span><br><span style='color: #7ba064;'>ᩣ</span>");
                $('#K83').html("<span style='color: #d22e9f;'> ᩞ   </span><br><span style='color: #13abbb;'>ᩇ</span>ᩈ");
                $('#K68').html("<span style='color: #d22e9f;'>ᨰ   </span><br><span style='color: #13abbb;'>ᨵ </span>ᨯ");
                $('#K70').html("<span style='color: #d22e9f;'> ᩿   </span><br><span style='color: #13abbb;'>ᨺ </span>ᨹ");
                $('#K71').html("<span style='color: #d22e9f;'> ᩙ   </span><br><span style='color: #13abbb;'>ᩊ </span>ᨦ");
                $('#K72').html("<span style='color: #13abbb;'>ᩌ</span><br><span style='color: #2f80b9;'>ᩉ</span>");
                $('#K74').html("<span style='color: #d22e9f;'>ᩎ </span><span style='color: #b1bb13;'> ᩨ</span><br><span style='color: #7ba064;'> ᩧ</span>");
                $('#K75').html("<span style='color: #d22e9f;'>ᨤ   </span><br><span style='color: #13abbb;'>ᨣ </span>ᨠ");
                $('#K76').html("<span style='color: #d22e9f;'>ᩄ   </span><br><span style='color: #13abbb;'>ᩓ</span>ᩃ");
                $('#K186').html("<br>;");
                $('#K222').html("<span style='color: #d22e9f;'> ᩻</span><br><span style='color: #cc4444;'>'</span>");
                $('#K90').html("<span style='color: #d22e9f;'>ᩔ   </span><br><span style='color: #13abbb;'>ᨳ </span>ᨴ");
                $('#K88').html("<span style='color: #d22e9f;'>ᨢ   </span><br><span style='color: #13abbb;'>ᨥ </span>ᨡ");
                $('#K67').html("<span style='color: #d22e9f;'>ᩆ   </span><br><span style='color: #13abbb;'>ᨨ </span>ᨧ");
                $('#K86').html("<span style='color: #d22e9f;'> ᩛ   </span><br><span style='color: #13abbb;'>ᨽ </span>ᩅ");
                $('#K66').html("<span style='color: #d22e9f;'> ᩝ   </span><br><span style='color: #13abbb;'>ᨸ </span>ᨷ");
                $('#K78').html("<span style='color: #d22e9f;'>ᨱ   </span><br><span style='color: #13abbb;'>ᨬ </span>ᨶ");
                $('#K77').html("<span style='color: #d22e9f;'> ᩜ   </span><br><span style='color: #13abbb;'> ᩘ </span>ᨾ");
                $('#K188').html("<br>,");
                $('#K190').html("<br>.");
                $('#K191').html("<br>/");
                $('#K16R').html("<br>⇧");
                $('#K16L').html("<br>⇧");
                break;
            case 21:
                $('#K192').html("<br>`");
                $('#K48').html("<br><span style='color: #ffc000;'>ႂ</span>");
                $('#K49').html("<br><span style='color: #ffc000;'>်</span>");
                $('#K50').html("<br><span style='color: #d48600;'>ႇ</span>");
                $('#K51').html("<br><span style='color: #d48600;'>ႈ</span>");
                $('#K52').html("<br><span style='color: #d48600;'>း</span>");
                $('#K53').html("<br><span style='color: #d48600;'>ႉ</span>");
                $('#K54').html("<br><span style='color: #13abbb;'>ႊ</span>");
                $('#K55').html("<br><span style='color: #ffc000;'>ဵ</span>");
                $('#K56').html("<br><span style='color: #ffc000;'>ႅ</span>");
                $('#K57').html("<br><span style='color: #ffc000;'>ႆ</span>");
                $('#K81').html("<br>ဢ");
                $('#K87').html("<br><span style='color: #ffc000;'>ွ</span>");
                $('#K69').html("<br><span style='color: #ffc000;'>ေ</span>");
                $('#K82').html("<span style='color: #b1bb13;'>ရ</span><br><span style='color: #7ba064;'>ြ</span>");
                $('#K84').html("<br>ထ");
                $('#K89').html("<br>ယ");
                $('#K85').html("<br><span style='color: #ffc000;'>ု</span>");
                $('#K73').html("<span style='color: #b1bb13;'>ီ</span><br><span style='color: #7ba064;'>ိ</span>");
                $('#K79').html("<br><span style='color: #ffc000;'>ူ</span>");
                $('#K80').html("<br><span style='color: #13abbb;'>ၾ</span>ၽ");
                $('#K219').html("<br>[");
                $('#K221').html("<br>]");
                $('#K65').html("<span style='color: #b1bb13;'>ႃ</span><br><span style='color: #7ba064;'>ၢ</span>");
                $('#K83').html("<br><span style='color: #13abbb;'>ႀ</span>သ");
                $('#K68').html("<br><span style='color: #13abbb;'>ၻ</span>တ");
                $('#K70').html("<br><span style='color: #ffc000;'>ႄ</span>");
                $('#K71').html("<br>င");
                $('#K72').html("<br><span style='color: #2f80b9;'>ႁ</span>");
                $('#K74').html("<br>ၺ");
                $('#K75').html("<br><span style='color: #13abbb;'>ၷ  </span>ၵ");
                $('#K76').html("<br>လ");
                $('#K186').html("<br>;");
                $('#K222').html("<br>'");
                $('#K90').html("<br>ျ");
                $('#K88').html("<br>ၶ");
                $('#K67').html("<br><span style='color: #13abbb;'>ၹ</span>ၸ");
                $('#K86').html("<br>ဝ");
                $('#K66').html("<br><span style='color: #13abbb;'>ၿ  </span>ပ");
                $('#K78').html("<br>ၼ");
                $('#K77').html("<br>မ");
                $('#K188').html("<br>,");
                $('#K190').html("<br>.");
                $('#K191').html("<br>/");
                $('#K16R').html("<br>⇧");
                $('#K16L').html("<br>⇧");
                break;
            case 22:
                $('#K192').html("<br>`");
                $('#K48').html("<br><span style='color: #cc4444;'>0</span>");
                $('#K49').html("<span style='color: #d22e9f;'>◌́   </span><br>ᥴ");
                $('#K50').html("<span style='color: #d22e9f;'>◌̈   </span><br>ᥰ");
                $('#K51').html("<span style='color: #d22e9f;'>◌̌   </span><br>ᥱ");
                $('#K52').html("<span style='color: #d22e9f;'>◌̀   </span><br>ᥲ");
                $('#K53').html("<span style='color: #d22e9f;'>◌̇   </span><br>ᥳ");
                $('#K54').html("<br>ᥨ");
                $('#K55').html("<br>ᥦ");
                $('#K56').html("<br>ᥪ");
                $('#K57').html("<br>ᥫ");
                $('#K81').html("<br>ᥟ");
                $('#K87').html("<br>ᥬ");
                $('#K69').html("<br>ᥥ");
                $('#K82').html("<br>ᥠ");
                $('#K84').html("<br>ᥗ");
                $('#K89').html("<br>ᥭ");
                $('#K85').html("<br>ᥧ");
                $('#K73').html("<br>ᥤ");
                $('#K79').html("<br>ᥩ");
                $('#K80').html("<br>ᥚ");
                $('#K219').html("<br>[");
                $('#K221').html("<br>]");
                $('#K65').html("<br>ᥣ");
                $('#K83').html("<br>ᥔ");
                $('#K68').html("<br>ᥖ");
                $('#K70').html("<br>ᥜ");
                $('#K71').html("<br>ᥒ");
                $('#K72').html("<br>ᥞ");
                $('#K74').html("<br>ᥕ");
                $('#K75').html("<br>ᥐ");
                $('#K76').html("<br>ᥘ");
                $('#K186').html("<br>;");
                $('#K222').html("<br>'");
                $('#K90').html("<br>ᥡ");
                $('#K88').html("<br>ᥑ");
                $('#K67').html("<br>ᥓ");
                $('#K86').html("<br>ᥝ");
                $('#K66').html("<br>ᥙ");
                $('#K78').html("<br>ᥢ");
                $('#K77').html("<br>ᥛ");
                $('#K188').html("<br>,");
                $('#K190').html("<br>.");
                $('#K191').html("<br>/");
                $('#K16R').html("<br>⇧");
                $('#K16L').html("<br>⇧");
                break;
            case 23:
                $('#K192').html("<br>`");
                $('#K48').html("<br>ᦰ");
                $('#K49').html("<br>ᧈ");
                $('#K50').html("<br>ᧉ");
                $('#K51').html("<span style='color: #b59bff;'>ᦿ</span><br>ᦹ");
                $('#K52').html("<span style='color: #4fd454;'>᧟</span><br>᧞");
                $('#K53').html("<br>ᦷ");
                $('#K54').html("<span style='color: #b59bff;'>ᦼ</span><br>ᦴ");
                $('#K55').html("<br>ᦺ");
                $('#K56').html("<span style='color: #b59bff;'>ᧀ</span><br>ᦲ");
                $('#K57').html("<span style='color: #b59bff;'>ᦾ</span><br>ᦸ");
                $('#K81').html("<span style='color: #4fd454;'>ᦨ</span><br>ᦅ");
                $('#K87').html("<span style='color: #d22e9f;'>ᦘ   </span><br>ᦕ");
                $('#K69').html("<span style='color: #b1bb13;'>ᦶ</span><br><span style='color: #7ba064;'>ᦵ</span>");
                $('#K82').html("<br>ᦣ");
                $('#K84').html("<span style='color: #d22e9f;'>ᦑ   </span><br>ᦎ");
                $('#K89').html("<br><span style='color: #6551d9;'>ᦊ</span>");
                $('#K85').html("<br>ᦳ");
                $('#K73').html("<span style='color: #d22e9f;'>ᦒ   </span><br>ᦏ");
                $('#K79').html("<span style='color: #d22e9f;'>ᦁ   </span><br>ᦀ");
                $('#K80').html("<span style='color: #d22e9f;'>ᦗ   </span><br>ᦔ");
                $('#K219').html("<br>[");
                $('#K221').html("<br>]");
                $('#K65').html("<span style='color: #d22e9f;'>᧚  </span><span style='color: #b59bff;'>ᦻ</span><br>ᦱ");
                $('#K83').html("<span style='color: #4fd454;'>ᦪ</span><br>ᦉ");
                $('#K68').html("<span style='color: #d22e9f;'>ᦤ   </span><br><span style='color: #13abbb;'>ᧆ  </span>ᦡ");
                $('#K70').html("<span style='color: #d22e9f;'>ᦝ   </span><br>ᦚ");
                $('#K71').html("<span style='color: #13abbb;'>ᦄ   </span><br><span style='color: #13abbb;'>ᧂ  </span>ᦇ");
                $('#K72').html("<br><span style='color: #2f80b9;'>ᦠ</span>");
                $('#K74').html("<span style='color: #d22e9f;'>ᦍ </span><span style='color: #4fd454;'>ᦩ</span><br>ᦆ");
                $('#K75').html("<span style='color: #4fd454;'>ᦦ</span><br><span style='color: #13abbb;'>ᧅ </span>ᦂ");
                $('#K76').html("<span style='color: #13abbb;'>ᦜ   </span><br>ᦟ");
                $('#K186').html("<br>;");
                $('#K222').html("<br><span style='color: #cc4444;'>'</span>");
                $('#K90').html("<span style='color: #4fd454;'>ᦫ</span><br>ᦌ");
                $('#K88').html("<span style='color: #4fd454;'>ᦧ</span><br>ᦃ");
                $('#K67').html("<span style='color: #d22e9f;'>ᦋ   </span><br>ᦈ");
                $('#K86').html("<span style='color: #13abbb;'>ᦛ </span><span style='color: #b59bff;'>ᦽ</span><br><span style='color: #13abbb;'>ᧁ  </span><span style='color: #90ffc2;'>ᦞ</span>");
                $('#K66').html("<span style='color: #d22e9f;'>ᦥ   </span><br><span style='color: #13abbb;'>ᧇ  </span>ᦢ");
                $('#K78').html("<span style='color: #13abbb;'>ᦐ   </span><br><span style='color: #13abbb;'>ᧃ  </span>ᦓ");
                $('#K77').html("<span style='color: #13abbb;'>ᦖ   </span><br><span style='color: #13abbb;'>ᧄ  </span>ᦙ");
                $('#K188').html("<br>,");
                $('#K190').html("<br>.");
                $('#K191').html("<br>/");
                $('#K16R').html("<br>⇧");
                $('#K16L').html("<br>⇧");
                break;
            case 24:
                $('#K192').html("<br>`");
                $('#K48').html("<span style='color: #b59bff;'>◌𞛵 </span><br><span style='color: #6551d9;'>◌𞛦 </span>");
                $('#K49').html("<br><span style='color: #d48600;'>◌𞛼</span>");
                $('#K50').html("<br><span style='color: #d48600;'>◌𞛽</span>");
                $('#K51').html("<br>𞛪");
                $('#K52').html("<br>𞛥");
                $('#K53').html("<br>𞛫");
                $('#K54').html("<br>𞛭");
                $('#K55').html("<br><span style='color: #ffc000;'>◌𞛮</span>");
                $('#K56').html("<br>𞛩");
                $('#K57').html("<span style='color: #d22e9f;'>𞜏    </span><br>𞛧");
                $('#K81').html("<span style='color: #d22e9f;'>𞛻    </span><br>𞛜");
                $('#K87').html("<span style='color: #d22e9f;'>𞛷   </span><br>𞛓");
                $('#K69').html("<span style='color: #d22e9f;'>𞜇  </span><br>𞛨");
                $('#K82').html("<span style='color: #d22e9f;'>𞜆 </span><br><span style='color: #ffc000;'>◌𞛣</span>");
                $('#K84').html("<span style='color: #d22e9f;'>𞛍   </span><br>𞛌");
                $('#K89').html("<span style='color: #d22e9f;'>𞛺    </span><br>𞛗");
                $('#K85').html("<span style='color: #d22e9f;'>𞜋   </span><br>𞛤");
                $('#K73').html("<span style='color: #d22e9f;'>𞜊   </span><br>𞛡");
                $('#K79').html("<span style='color: #d22e9f;'>𞛿 </span><span style='color: #b59bff;'>◌𞜎 </span><br><span style='color: #6551d9;'>𞛬</span>");
                $('#K80').html("<span style='color: #d22e9f;'>𞛒   </span><br>𞛑");
                $('#K219').html("<br>[");
                $('#K221').html("<br>]");
                $('#K65').html("<span style='color: #d22e9f;'>𞛾   </span><br>𞛠");
                $('#K83').html("<span style='color: #d22e9f;'>𞛈   </span><br>𞛇");
                $('#K68').html("<span style='color: #d22e9f;'>𞛸  </span><span style='color: #b59bff;'>𞛳</span><br>𞛋");
                $('#K70').html("<span style='color: #d22e9f;'>𞛕   </span><br>𞛔");
                $('#K71').html("<span style='color: #b59bff;'>  ◌𞛯</span><br><span style='color: #13abbb;'>𞜅 </span>𞛅");
                $('#K72').html("<span style='color: #d22e9f;'>𞛛   </span><br><span style='color: #2f80b9;'>𞛚</span>");
                $('#K74').html("<span style='color: #d22e9f;'>𞛊   </span><br>𞛉");
                $('#K75').html("<span style='color: #ff006a;'>𞛁  </span><span style='color: #b59bff;'>𞛲</span><br><span style='color: #13abbb;'>𞛄 </span><span style='color: #90ffc2;'>𞛀</span>");
                $('#K76').html("<br>𞛘");
                $('#K186').html("<br>;");
                $('#K222').html("<br><span style='color: #cc4444;'>'</span>");
                $('#K90').html("<span style='color: #d22e9f;'>𞛶   </span><br><span style='color: #13abbb;'>𞜉 </span>𞛎");
                $('#K88').html("<span style='color: #d22e9f;'>𞛃   </span><br><span style='color: #13abbb;'>𞜈 </span>𞛂");
                $('#K67').html("<span style='color: #d22e9f;'>𞛟   </span><br>𞛆");
                $('#K86').html("<span style='color: #4fd454;'>   𞛝</span><br><span style='color: #ff66b4;'>𞛞  </span>𞛙");
                $('#K66').html("<span style='color: #d22e9f;'>𞛹 </span><span style='color: #b59bff;'>𞛴</span><br>𞛐");
                $('#K78').html("<span style='color: #b59bff;'>  𞛰</span><br>𞛏");
                $('#K77').html("<span style='color: #b59bff;'>    𞛱</span><br>𞛖");
                $('#K188').html("<br>,");
                $('#K190').html("<br>.");
                $('#K191').html("<br>/");
                $('#K16R').html("<br>⇧");
                $('#K16L').html("<br>⇧");
                break;
            case 25:
                $('#K192').html("<br>`");
                $('#K48').html("<span style='color: #b59bff;'>◌𕊜</span><br><span style='color: #6551d9;'>◌𕊀 </span>");
                $('#K49').html("<span style='color: #b1bb13;'>◌𕊝</span><br><span style='color: #7ba064;'>◌𕊑</span>");
                $('#K50').html("<span style='color: #b1bb13;'>◌𕊞</span><br><span style='color: #7ba064;'>◌𕊒</span>");
                $('#K51').html("<span style='color: #b1bb13;'>◌𕊋 </span><br><span style='color: #7ba064;'>◌𕊃 </span>");
                $('#K52').html("<span style='color: #b1bb13;'>𕊍</span><br><span style='color: #7ba064;'>𕊆</span>");
                $('#K53').html("<span style='color: #b1bb13;'>𕊌</span><br><span style='color: #7ba064;'>◌𕊄</span>");
                $('#K54').html("<span style='color: #b1bb13;'>◌𕊖</span><br><span style='color: #7ba064;'>𕊈</span>");
                $('#K55').html("<span style='color: #b1bb13;'>◌𕊔</span><br><span style='color: #7ba064;'>𕊐</span>");
                $('#K56').html("<span style='color: #b1bb13;'>𕊊</span><br><span style='color: #7ba064;'>◌𕊂 </span>");
                $('#K57').html("<span style='color: #b1bb13;'>◌𕊕 </span><br><span style='color: #7ba064;'>◌𕊉 </span>");
                $('#K81').html("<span style='color: #d22e9f;'>𕉗   </span><br>𕉖");
                $('#K87').html("<span style='color: #d22e9f;'>𕉯   </span><br>𕉮");
                $('#K69').html("<span style='color: #b1bb13;'>◌𕊇 </span><br><span style='color: #7ba064;'>𕊅</span><br>");
                $('#K82').html("<span style='color: #d22e9f;'>𕉷   </span><br>𕉶");
                $('#K84').html("<span style='color: #d22e9f;'>𕉥   </span><br>𕉤");
                $('#K89').html("<span style='color: #13abbb;'>𕉴   </span><br>𕉵");
                $('#K85').html("<span style='color: #d22e9f;'>𕉓   </span><br>𕉒");
                $('#K73').html("<span style='color: #d22e9f;'>𕉝   </span><br>𕉜");
                $('#K79').html("<span style='color: #d22e9f;'>𕉿   </span><br>𕉾");
                $('#K80').html("<span style='color: #d22e9f;'>𕉭   </span><br>𕉬");
                $('#K219').html("<br>[");
                $('#K221').html("<br>]");
                $('#K65').html("<span style='color: #d22e9f;'>𕊟   </span><br>𕊁");
                $('#K83').html("<span style='color: #d22e9f;'>𕉟   </span><br>𕉞");
                $('#K68').html("<span style='color: #d22e9f;'>𕉣   </span><br>𕉢");
                $('#K70').html("<span style='color: #d22e9f;'>𕉱   </span><br>𕉰");
                $('#K71').html("<span style='color: #13abbb;'>𕉘   </span><br>𕉙");
                $('#K72').html("<span style='color: #d22e9f;'>𕉽   </span><br><span style='color: #2f80b9;'>𕉼</span>");
                $('#K74').html("<span style='color: #13abbb;'>𕉠   </span><br>𕉡");
                $('#K75').html("<span style='color: #d22e9f;'>𕉑   </span><br>𕉐");
                $('#K76').html("<span style='color: #13abbb;'>𕉸   </span><br>𕉹");
                $('#K186').html("<br>;");
                $('#K222').html("<br><span style='color: #cc4444;'>'</span>");
                $('#K90').html("<span style='color: #d22e9f;'>𕉧   </span><br>𕉦");
                $('#K88').html("<span style='color: #d22e9f;'>𕉕   </span><br>𕉔");
                $('#K67').html("<span style='color: #d22e9f;'>𕉛   </span><br>𕉚");
                $('#K86').html("<span style='color: #13abbb;'>𕉺   </span><br>𕉻");
                $('#K66').html("<span style='color: #d22e9f;'>𕉫   </span><br>𕉪");
                $('#K78').html("<span style='color: #13abbb;'>𕉨 </span><span style='color: #b59bff;'>𕊎</span><br>𕉩");
                $('#K77').html("<span style='color: #13abbb;'>𕉲  </span><span style='color: #b59bff;'>𕊏</span><br>𕉳");
                $('#K188').html("<br>,");
                $('#K190').html("<br>.");
                $('#K191').html("<br>/");
                $('#K16R').html("<br>⇧");
                $('#K16L').html("<br>⇧");
                break;
            case 26:
                $('#K192').html("<br>`");
                $('#K48').html("<span style='color: #d22e9f;'>𑜰   </span><br><span style='color: #ffc000;'>◌𑜠</span>");
                $('#K49').html("<span style='color: #d22e9f;'>𑜱   </span><br><span style='color: #d48600;'>◌𑜜</span>");
                $('#K50').html("<span style='color: #d22e9f;'>𑜲   </span><br><span style='color: #d48600;'>◌𑜬</span>");
                $('#K51').html("<span style='color: #d22e9f;'>𑜳   </span><br><span style='color: #d48600;'>◌𑜭</span>");
                $('#K52').html("<span style='color: #d22e9f;'>𑜴   </span><br><span style='color: #d48600;'>◌𑜮</span>");
                $('#K53').html("<span style='color: #d22e9f;'>𑜵   </span><br><span style='color: #d48600;'>◌𑜯</span>");
                $('#K54').html("<span style='color: #d22e9f;'>𑜶   </span><br><span style='color: #ffc000;'>◌𑜞 </span>");
                $('#K55').html("<span style='color: #d22e9f;'>𑜷   </span><br><span style='color: #ffc000;'>◌𑜩 </span>");
                $('#K56').html("<span style='color: #d22e9f;'>𑜸   </span><br><span style='color: #ffc000;'>◌𑜪 </span>");
                $('#K57').html("<span style='color: #d22e9f;'>𑜹   </span><br><span style='color: #ffc000;'>◌𑜫  </span>");
                $('#K81').html("<span style='color: #b1bb13;'>𑜖</span><br><span style='color: #7ba064;'>𑜕</span>");
                $('#K87').html("<span style='color: #d22e9f;'>𑜻    </span><br><span style='color: #ffc000;'>◌𑜧 </span>");
                $('#K69').html("<br><span style='color: #ffc000;'>◌𑜦</span>");
                $('#K82').html("<span style='color: #b1bb13;'>◌𑜟</span><br><span style='color: #7ba064;'>𑜍</span>");
                $('#K84').html("<span style='color: #b1bb13;'>𑜅</span><br><span style='color: #7ba064;'>𑜄</span>");
                $('#K89').html("<span style='color: #b1bb13;'>𑜙</span><br><span style='color: #7ba064;'>𑜊</span>");
                $('#K85').html("<span style='color: #b1bb13;'>◌𑜥 </span><br><span style='color: #7ba064;'>𑜤 </span>");
                $('#K73').html("<span style='color: #b1bb13;'>◌𑜣</span><br><span style='color: #7ba064;'>◌𑜢</span>");
                $('#K79').html("<span style='color: #d22e9f;'>𑜼    </span><br><span style='color: #ffc000;'>◌𑜨 </span>");
                $('#K80').html("<span style='color: #d22e9f;'>𑜽    </span><br><span style='color: #ffc000;'>𑜆</span>");
                $('#K219').html("<br>[");
                $('#K221').html("<br>]");
                $('#K65').html("<span style='color: #d22e9f;'>𑜾     </span><br>𑜡");
                $('#K83').html("<span style='color: #d22e9f;'>𑜺   </span><br>𑜏");
                $('#K68').html("<br>𑜓");
                $('#K70').html("<span style='color: #b1bb13;'>𑜙</span><br><span style='color: #7ba064;'>𑜊</span>");
                $('#K71').html("<br>𑜂");
                $('#K72').html("<br>𑜑");
                $('#K74').html("<br>𑜐");
                $('#K75').html("<br>𑜀");
                $('#K76').html("<span style='color: #b1bb13;'>◌𑜝</span><br><span style='color: #7ba064;'>𑜎</span>");
                $('#K186').html("<br>;");
                $('#K222').html("<br><span style='color: #cc4444;'>'</span>");
                $('#K90').html("<span style='color: #b1bb13;'>𑜔</span><br><span style='color: #7ba064;'>𑜌</span>");
                $('#K88').html("<span style='color: #b1bb13;'>𑜗</span><br><span style='color: #7ba064;'>𑜁</span>");
                $('#K67').html("<br>𑜋");
                $('#K86').html("<span style='color: #d22e9f;'>𑜿   </span><br>𑜒");
                $('#K66').html("<span style='color: #b1bb13;'>𑜚</span><br><span style='color: #7ba064;'>𑜈</span>");
                $('#K78').html("<br>𑜃");
                $('#K77').html("<br>𑜉");
                $('#K188').html("<br>,");
                $('#K190').html("<br>.");
                $('#K191').html("<br>/");
                $('#K16R').html("<br>⇧");
                $('#K16L').html("<br>⇧");
                break;
            default:
                defaultkeyboard();
                break;
        }
    }
}

function defaultkeyboard() {
    $('#K192').html("<br>`");
    $('#K48').html("<br>0");
    $('#K49').html("<br>1");
    $('#K50').html("<br>2");
    $('#K51').html("<br>3");
    $('#K52').html("<br>4");
    $('#K53').html("<br>5");
    $('#K54').html("<br>6");
    $('#K55').html("<br>7");
    $('#K56').html("<br>8");
    $('#K57').html("<br>9");
    $('#K81').html("<br>q");
    $('#K87').html("<br>w");
    $('#K69').html("<br>e");
    $('#K82').html("<br>r");
    $('#K84').html("<br>t");
    $('#K89').html("<br>y");
    $('#K85').html("<br>u");
    $('#K73').html("<br>i");
    $('#K79').html("<br>o");
    $('#K80').html("<br>p");
    $('#K219').html("<br>[");
    $('#K221').html("<br>]");
    $('#K65').html("<br>a");
    $('#K83').html("<br>s");
    $('#K68').html("<br>d");
    $('#K70').html("<br>f");
    $('#K71').html("<br>g");
    $('#K72').html("<br>h");
    $('#K74').html("<br>j");
    $('#K75').html("<br>k");
    $('#K76').html("<br>l");
    $('#K186').html("<br>;");
    $('#K222').html("<br>'");
    $('#K90').html("<br>z");
    $('#K88').html("<br>x");
    $('#K67').html("<br>c");
    $('#K86').html("<br>v");
    $('#K66').html("<br>b");
    $('#K78').html("<br>n");
    $('#K77').html("<br>m");
    $('#K188').html("<br>,");
    $('#K190').html("<br>.");
    $('#K191').html("<br>/");
    $('#K16R').html("<br>⇧");
    $('#K16L').html("<br>⇧");
}

function share() {
  navigator.clipboard.writeText($("#txtPadout").html().replace(/ <br> /g, "\n"));
}
String.prototype.startsWith = function (str) {
    return this.indexOf(str) == 0;
}