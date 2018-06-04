function getCookie(a) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(a + "=");
        if (c_start != -1) {
            c_start = c_start + a.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length
            }
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

function setCookie(b, c, a) {
    var d = new Date();
    d.setDate(d.getDate() + a);
    document.cookie = b + "=" + escape(c) + ((a == null) ? "" : ";expires=" + d.toGMTString())
}

function addJsToHeader(){
	document.write('<script type="text/javascript" src="gen/skins/xp/configuration.js"><\/script>');
	document.write('<script type="text/javascript" src="gen/skins/xp/local-storage.js"><\/script>');
}

var skinName = getCookie("genSkin");
if ((skinName == "") || (skinName == "xp")) { 
	addJsToHeader();
   
    document.write("<style>");
    document.write('@import url("gen/skins/xp/window.primary.css");');
    document.write('@import url("gen/skins/xp/window.popup.dialog.css");');
    document.write('@import url("gen/skins/xp/menu.horizontal.css");');
    document.write('@import url("gen/skins/xp/menu.vertical.css");');
    document.write('@import url("gen/skins/xp/toolbar.css");');
    document.write('@import url("gen/skins/xp/messagebox.css");');
    document.write('@import url("gen/skins/xp/framework.css");');
    document.write("</style>")
} else {
    if ((skinName == "ca")) {
        addJsToHeader();
  
		document.write("<style>");
		document.write('@import url("gen/skins/ca/window.primary.css");');
        document.write('@import url("gen/skins/ca/window.popup.dialog.css");');
        document.write('@import url("gen/skins/ca/menu.horizontal.css");');
        document.write('@import url("gen/skins/ca/menu.vertical.css");');
        document.write('@import url("gen/skins/ca/toolbar.css");');
        document.write('@import url("gen/skins/ca/messagebox.css");');
		document.write('@import url("gen/skins/xp/framework.css");');
        document.write("</style>")
    } else {
        addJsToHeader();
		
		document.write("<style>");
        document.write('@import url("gen/skins/xp/window.primary.css");');
        document.write('@import url("gen/skins/xp/window.popup.dialog.css");');
        document.write('@import url("gen/skins/xp/menu.horizontal.css");');
        document.write('@import url("gen/skins/xp/menu.vertical.css");');
        document.write('@import url("gen/skins/xp/toolbar.css");');
        document.write('@import url("gen/skins/xp/messagebox.css");');
		document.write('@import url("gen/skins/xp/framework.css");');
        document.write("</style>")
    }
};