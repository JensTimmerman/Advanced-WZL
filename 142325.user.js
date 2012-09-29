// ==UserScript==
// @name           Advanced WZL
// @version        2.16
// @namespace      http://www.userscripts.org
// @creator        SaWey+Efari
// @description    Filter WZL fun page naar wens
// @include        http://*wzl.be/*
// @include        http://*wijfzonderlijf.be/*

// ==/UserScript==
//beta voor versie 3

//Browser detection
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();
//controleer op firefox nightly (18) of chrome
var is_ffnightly=false;
if(BrowserDetect.browser=="Firefox" && BrowserDetect.version>=18){
	is_ffnightly=true;
}


//rest van script
    //controleer op chrome of ffnightly, zoja, maak dan youtube links embed, voor fullscreen te enablen
if(/.*post.*/.test(window.location.href)){
    //dit enkel doen op een post
    var fnresize = document.createElement("script");
    fnresize.type="text/javascript";
    fnresize.innerHTML="var embedddd = document.getElementsByTagName('embed');\n\
    function resize(i,bln){\n\
    if(bln){\n\
        embedddd[i].setAttribute('width',embedddd[i].width*1.1);\n\
        embedddd[i].setAttribute('height',embedddd[i].height*1.1);\n\
    }else{\n\
        embedddd[i].setAttribute('width',embedddd[i].width*0.9);\n\
        embedddd[i].setAttribute('height',embedddd[i].height*0.9);\n\
    }\n\
}";
    document.getElementsByTagName("head")[0].appendChild(fnresize);
    
    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    if(is_chrome || is_ffnightly){
        var embedd = document.getElementsByTagName("embed");
        if(embedd!=null){
            for(i=0; i<embedd.length;i++){
                var embed = embedd[i];
                var parent = embed.parentNode;
                var src = embed.getAttribute("src");
                var srcv = src.split("/v/")[1].split("&")[0];
                var vid = document.createElement("embed");
                vid.setAttribute("src","http://www.youtube.com/embed/"+srcv);
                vid.setAttribute("width","640");
                vid.setAttribute("height","400");
                var br = document.createElement("br");
                parent.appendChild(br);
                parent.insertBefore(vid,embed);
                parent.removeChild(embed);
                parent.getElementsByTagName("a");
            }
        }
    }
    //make resize button
    var jsresize = document.createElement("script");
    jsresize.type="text/javascript";
    jsresize.innerHTML='var embeddd = document.getElementsByTagName("embed");\n\
    var j=0;\n\
    if(embeddd!=null){\n\
    var embed = embeddd[0];\n\
    var parent = embed.parentNode\n\
    var parent2=parent;\n\
    for(i=0;i<embeddd.length;i++){\n\
    embed = embeddd[i];\n\
    parent = embed.parentNode\n\
    if(parent!=parent2){\n\
        j=0;}\n\
    var parent2=parent;\n\
    var plus = document.createElement("span");\n\
    var min = document.createElement("span");\n\
    var br = document.createElement("br");\n\
    plus.innerHTML = "+";\n\
    plus.style.cursor = "pointer";\n\
    plus.setAttribute("onClick","resize("+i+",true)");\n\
    min.innerHTML = "-";\n\
    min.style.cursor = "pointer";\n\
    min.setAttribute("onClick","resize("+i+",false)");\n\
    parent.insertBefore(plus,parent.getElementsByTagName("embed")[j]);\n\
    parent.insertBefore(br,parent.getElementsByTagName("embed")[j]);\n\
    parent.insertBefore(min,parent.getElementsByTagName("embed")[j]);\n\
    parent.insertBefore(br,parent.getElementsByTagName("embed")[j]);\n\
    j=j+1;\n\
}\n\
}';
    document.getElementsByTagName("head")[0].appendChild(jsresize);

}
    
    
    function insertSC(){
    var textarea = document.getElementsByTagName("textarea")[0];
    var a = textarea
    var b = createlink(a);
    textarea.value = b;
}

function createlink(a){
	b = a.value.split("\n");
	var c="";
	for(i=0; i<b.length;i++){
		//voor elke regel in de post/comment
		if(/.*youtube\.com\/watch.*/.test(b[i])){
			//regel is een youtube-link
			c += "[movie=http://www.youtube.com/v/" + b[i].split("=")[1].split("&")[0] + " w=640 h=400]\n" ;
		} else if(/.*\.jpg/.test(b[i].toLowerCase()) || /.*\.png/.test(b[i].toLowerCase()) || /.*\.gif/.test(b[i].toLowerCase()) || /.*\.bmp/.test(b[i].toLowerCase())){
			//regel is een afbeelding
			if(!/.*\[image\=.*/.test(b[i])){
				c+= "\[image="+ b[i] +"\]\n";
			} else {c +=b[i] + "\n"}
		} else if(/.*www\..*\..*/.test(b[i]) || /.*http\:\/\/.*\..*/.test(b[i])){
            //regel is een link
            if(!/.*\[link\=.*/.test(b[i])){
                var text1 = b[i].split("http://")[0];
                c+= text1 + "[link=http://";
                if(/.*;.*/.test(b[i])){
                    var link = b[i].split("http://")[1].split(";")[0];
                    var linktext = b[i].split("http://")[1].split(";")[1];
                    var text2 = b[i].split(";;")[1];
                    c+= link +"]"+ linktext + "[/link]" + text2 + "\n";
                } else {
                    var link = b[i].split("http://")[1].split(" ")[0];
                    var text2 = "";
                    if(b[i].split("http://")[1].split(link)[1]!=null){
                        var text2 = b[i].split("http://")[1].split(link)[1];
                    }
                    c+= link +"]"+ link + "[/link] " + text2 + "\n";
                }
			} else {c +=b[i] + "\n"}
            
        } else {c +=b[i] + "\n"}
	}
    
    c=c.slice(0,[c.length - 1]);
	return c
}

//we gaan in de post-editor
var parent_header = document.getElementsByClassName("editorcontrols")[0];

if(parent_header != null){
	//als die class bestaat, voeg de knop toe
	var text = document.createElement("span");
	text.innerHTML = ' ';
	var imgSC = document.createElement("img");
	imgSC.title = "Smart Content";
	imgSC.src="http://wzl.be/imgs/tabs/balzak/balzak_bullet1.gif";
	imgSC.border = 0;
	imgSC.style.cursor = "pointer";
	imgSC.addEventListener('click', insertSC , true);
	parent_header.appendChild(text);
	parent_header.appendChild(imgSC);
}



//zoekmachine
if(/.*f_search/.test(window.location.href)){
    var fnzoek = document.createElement("script");
    fnzoek.type="text/javascript";
    fnzoek.innerHTML="function zoek(a){\nwindow.open(\"http://www.google.com/search?as_sitesearch=wzl.be&as_q=\"+a, '_blank');\nwindow.focus();\n}";
    document.getElementsByTagName("head")[0].appendChild(fnzoek);
    var parent_header = document.getElementsByTagName("form")[0];
    parent_header.removeAttribute("action");
    var searchbutton = document.getElementsByClassName("button")[0];
    var searchbox = document.getElementsByTagName("input")[0];
    //parent_header.removeChild(searchbutton);
    //var searchbutton2 = document.createElement("input");
    //searchbutton2.type="Submit";
    searchbutton.value="Zoeken!!!!!";
    //searchbutton2.setAttribute("class","button");
    searchbutton.setAttribute("onClick","zoek(document.getElementsByTagName(\"input\")[0].value)");
    //searchbutton2.addEventListener('click', zoek(searchbox.value) , true);
    //parent_header.appendChild(searchbutton2);
}
   

if(!/.*post.*/.test(window.location.href) && !/.*music.*/.test(window.location.href) && !/.*freetime.*/.test(window.location.href) && !/.*sports.*/.test(window.location.href) ){
	//als we in fun, babe of stud tab zitten, dus niet in nieuwe post aanmaken, music tab, freetime tab of sportstab
	//blacklist opvragen aan GreaseMonkey
    
    
    var actief = GM_getValue("wzlBLA");

    function addToBlacklist(e){
		//waarde toevoegen aan blacklist
        var string = document.getElementById('blacklistMe').value;
        if(trim(string) == ""){
            alert("Gelieve een waarde in te vullen.");		
        }else{
            var str = GM_getValue("wzlBL");
            GM_setValue("wzlBL", str + "|" + string);
            var check = GM_getValue("wzlLijst");
            if(check == 0){
                blacklist();
            }else{
                whitelist();	
            }	
            document.getElementById("blacklistMe").value = "Toegevoegd";
            setTimeout("document.getElementById(\"blacklistMe\").value = \"\"",500);
        }
    }
    
    function blacklist(){
		//blacklist uitvoeren
        var str = GM_getValue("wzlBL");
        strArr = "";
        if(str !=null){
            strArr = str.split("|");
        }	
        var blacklist = new Array();
        for(n=0; n<strArr.length; n++){
            if(trim(strArr[n]) != ""){
				//in elke record van blacklist staat nu een opgeslagen waarde
                blacklist[n] = strArr[n];
            }
        }
        
        var parent_td = document.getElementsByClassName("center")[0]; //de middelste kolom op wzl
        var items = parent_td.getElementsByTagName("td");
        for(o=0; o<items.length; o++){
            for(p=0; p<blacklist.length; p++){
                if(items[o].innerHTML.match(blacklist[p]) && blacklist[p] != null){
                    items[o].parentNode.style.display = "none";					
                }
            }
    }
            
    }
    
    function showBL(e){//toon de blacklist rechts
        var str = GM_getValue("wzlBL");
        var strArr = "";
        if(str !=null){
            strArr = str.split("|");
        }	
        var blacklist = new Array();
        var bl = document.getElementById("blList");
        bl.innerHTML = "<br /> ";
        for(n=0; n<strArr.length; n++){
            if(trim(strArr[n]) != "" && trim(strArr[n]) != null){
                var imgv = document.createElement("img");
                imgv.title = "Verwijder uit lijst!";
                imgv.id = strArr[n];
                imgv.src = "http://www.wzl.be/imgs/common/hot2.gif";
                imgv.style.cursor = "pointer";
                imgv.addEventListener('click', verwVanBlacklist , true);
                var text = document.createElement("span");
                text.innerHTML = strArr[n] + "<br />";
                bl.appendChild(imgv);
                bl.appendChild(text);
            }
        }
    }
    
    
    function verwVanBlacklist(e){
        var str = GM_getValue("wzlBL");
        strArr = "";
        if(str !=null){
            strArr = str.split("|");
        }
        var blacklist = new Array();
        var blacklistStr = "";
        var bl = document.getElementById("blList");
        bl.innerHTML = " ";
        for(n=0; n<strArr.length; n++){
            if(strArr[n] != this.id && strArr[n] != ""){
                blacklistStr += "|" + strArr[n];
            }else{
                blacklistStr += "";
                }
        }
        GM_setValue("wzlBL", blacklistStr);
        window.location=window.location.href;
    }
    
    function whitelist(){
        var str = GM_getValue("wzlBL");
        strArr = "";
        if(str !=null){
            strArr = str.split("|");
        }	
        var whitelist = new Array();
        for(n=0; n<strArr.length; n++){
            if(trim(strArr[n]) != ""){
                whitelist[n] = strArr[n];
            }
        }
        var ko = 0;
        var temp = new Array();
        var parent_td = document.getElementsByClassName("center")[0];
        var items = parent_td.getElementsByTagName("td");
        for(o=0; o<items.length; o++){
            for(p=0; p<whitelist.length; p++){
                if(items[o].innerHTML.match(whitelist[p]) && whitelist[p] != null){
                    temp.push(o);
                    //items[o].parentNode.style.display = "";	
                }else{
                    items[o].parentNode.style.display = "none";	
                }
            }
        }
        for(o=0; o<temp.length; o++){
            items[temp[o]].parentNode.style.display = "";
        }
    }
    
    function trim(value) {//inputwaarde trimmen uiteraard
      value = value.replace(/^\s+/,''); 
      value = value.replace(/\s+$/,'');
      return value;
    }
    
    function activatewhitelist(e){
        GM_setValue("wzlLijst", 1);	
        whitelist();
        var img_white = document.getElementById("whitelisticon");
        img_white.style.display = "none";
        var img_black = document.getElementById("blacklisticon");
        img_black.style.display = "";
        var titel = document.getElementById("lijstTitel");
        titel.innerHTML = "Whitelist: ";
    }
    
    function activateBlacklist(e){
        GM_setValue("wzlLijst", 0);	
        window.location=window.location.href;
        var img_white = document.getElementById("whitelisticon");
        img_white.style.display = "";
        var img_black = document.getElementById("blacklisticon");
        img_black.style.display = "none";
        var titel = document.getElementById("lijstTitel");
        titel.innerHTML = "Blacklist: ";
    }
    
    function resetEntries(){//alles wissen
        GM_setValue("wzlBL", "");
    }
    
    function toggleActive(){
        if(actief){
            actief=false;
            GM_setValue("wzlBLA", false);
        }else{
            actief=true;
            GM_setValue("wzlBLA", true);
        }
        window.location.reload();
    }
    
    var lijst = 0;//blacklist by default
    
    if(GM_getValue("wzlLijst") != null){
        lijst = GM_getValue("wzlLijst");
    }
    if(actief){
        if(lijst == 0){
            blacklist();	
        }else{
            whitelist();	
        }
    }
    
    //extra filtermenu aanmaken
    

    var parent_header = document.getElementsByClassName("right")[0].getElementsByTagName("FORM");
    
    var br = document.createElement("BR");
    parent_header[0].appendChild(br);
    
    
    var box = document.createElement("input");//activatieknop
    box.type = "Checkbox";
    box.id = "enableBL";
    box.name ="enableBL";
    if(actief)
        box.checked = true;
    box.addEventListener('click',toggleActive, true);
    //////////////////////////////////////////////
    var title = document.createElement("H2");
    //////////////////////////////////////////////
    var imgf = document.createElement("img");//f-icoontje
    imgf.title = "Toon lijst";
    imgf.src = "http://www.wzl.be/imgs/tabs/fun/fun_icon.gif";
    imgf.border = 0;
    imgf.height = 9;
    imgf.width = 11;
    imgf.style.cursor = "pointer";
    imgf.addEventListener('click', showBL , true);
    //////////////////////////////////////////////
    var whitelisticon = document.createElement("img");//w-icoontje
    whitelisticon.id = "whitelisticon";
    whitelisticon.title = "Toggle whitelist";
    whitelisticon.src = "http://www.wzl.be/imgs/tabs/my/my_icon.gif";
    whitelisticon.border = 0;
    whitelisticon.height = 9;
    whitelisticon.width = 11;
    whitelisticon.style.cursor = "pointer";
    whitelisticon.addEventListener('click', activatewhitelist , true);
    //////////////////////////////////////////////
    var blacklisticon = document.createElement("img");//b-icoontje
    blacklisticon.id = "blacklisticon";
    blacklisticon.title = "Toggle blacklist";
    blacklisticon.src = "http://wzl.be/imgs/tabs/balzak/balzak_icon.gif";
    blacklisticon.border = 0;
    blacklisticon.height = 9;
    blacklisticon.width = 11;
    blacklisticon.style.cursor = "pointer";
    blacklisticon.addEventListener('click', activateBlacklist , true);
    //////////////////////////////////////////////
    if(lijst == 0){
        blacklisticon.style.display = "none";
        whitelisticon.style.display = "";
    }else{
        blacklisticon.style.display = "";
        whitelisticon.style.display = "none";	
    }
    
    
    var text = document.createElement("span");//tekst
    text.innerHTML = "&nbsp;&nbsp;ADV FILTER &nbsp;&nbsp;&nbsp;";
    
    parent_header[0].appendChild(title);
    title.appendChild(imgf);
    title.appendChild(text);
    title.appendChild(whitelisticon);
    title.appendChild(blacklisticon);
    
    
    var descr = document.createElement("B");
    descr.id = "lijstTitel";
    if(lijst == 0){
        descr.innerHTML = 'Blacklist: ';
    }else{
        descr.innerHTML = 'Whitelist: ';
        }
    parent_header[0].appendChild(box);
    parent_header[0].appendChild(descr);
    
    
    var input = document.createElement("input");//textinput
    input.type = "text";
    input.id = "blacklistMe";
    input.name = "blacklistMe";
    input.width = 130;
    parent_header[0].appendChild(input);
    
    var img = document.createElement("img");//filter-icoontje
    img.id = "blacklistMeImg";
    img.title = "Voeg toe aan lijst!";
    img.src = "http://wzl.be/imgs/common/filter.gif";
    img.style.cursor = "pointer";
    img.addEventListener('click', addToBlacklist , true);
    parent_header[0].appendChild(img);
    
    var bl = document.createElement("span");
    bl.id = "blList";
    bl.innerHTML = "";
    parent_header[0].appendChild(bl);
    
    

    //resetknop aanmaken
    var  parent_td = document.getElementsByClassName("footer")[0];
    var reset = document.createElement("a");
    reset.href="http://wzl.be";
    reset.style.cursor = "pointer";
    reset.innerHTML = " | Reset Wzl Adv Filter";
    reset.addEventListener('click', resetEntries , true);
    parent_td.appendChild(reset);
} else {

}