function Mensa(mensaID, label, adress, openTime, url, lat, lon, email, externalID) {
	this.mensaID = mensaID;
	this.label = label;
	this.adress = adress;
	this.openTime = openTime;
	this.url = url;
	this.lat = lat;
	this.lon = lon;
	this.email = email;
	this.externalID = externalID;
}

function Fach(bezeichnung, nachname, vorname, fachkuerzel, dozentkuerzel) {
	this.bezeichnung = bezeichnung;
	this.nachname = nachname;
	this.vorname = vorname;
	this.fachkuerzel = fachkuerzel;
	this.dozentkuerzel = dozentkuerzel;
}

function loadData() {

	function callbackjson(data) {
		//alert('get here?');
	}

	
	$.ajax({
		type: 'GET',
		url: 'http://edb.gm.fh-koeln.de/services/evaluation_service.jsp?call=getFaecher',
		dataType: 'jsonp',
		success: function(data) {
			//alert('only get in success function');
			parseJSON(data);
		},
		error: function(xhr, textStatus, thrownError) {
			//alert(thrownError);
			if(textStatus == "timeout") {
				//alert('Bitte verbinden Sie sich mit dem Internet um die App benutzen zu können');
			}
			else {
				//alert('Die App muss neu gestartet werden!');
			}
		},
		jsonpCallback: 'callbackjson',
		timeout: 10000
		
	});
}



function parseJSON(data) {

	var bez, nachname, vorname, fachkuerzel, dozentkuerzel;
	var fach;
	fachArray = [];
	
	for(i = 0; i < data.length; ++i) {
		bez = data[i].Bezeichnung;
		
		nachname = data[i].NACHNAME;
		vorname = data[i].Vorname;
		fachkuerzel = data[i].fachkuerzel;
		dozentkuerzel = data[i].dozentkuerzel;
		fach = new Fach(bez, nachname, vorname, fachkuerzel, dozentkuerzel);
		fachArray.push(fach);
	}
	
	displayFaecher();
}

function displayFaecher() {

	document.getElementById('floatingCirclesG').style.display = 'none';
	$('#wrapper').empty();
	
	$('#wrapper').append('<div id="scroller"></div>');
	$('#scroller').append('<ul id="thelist"></ul>');
	
	
	$('#wrapper').prepend('<h2>Wähle Dein Fach</h2>');
	
	var bez, nachname, vorname, fachkuerzel, dozentkuerzel;
	var fach;
	
	for(i = 0; i < fachArray.length; ++i) {
		fach = fachArray[i];
		bez = fach.bezeichnung;
		nachname = fach.nachname;
		vorname = fach.vorname;
		fachkuerzel = fach.fachkuerzel;
		dozentkuerzel = fach.dozentkuerzel;
		
		$('#thelist').append('<li id="listItem'+i+'" class="listItem"><span  class="listTitle">' +  bez + ' - ' + fachkuerzel +'</span><br/>'+nachname+', '+vorname+'</li>');
		$('#listItem'+i).data('fachkuerzel', fachkuerzel);
		$('#listItem'+i).data('dozentkuerzel', dozentkuerzel);
		$('#listItem'+i).data('nachname', nachname);
		$('#listItem'+i).data('vorname', vorname);
		$('#listItem'+i).data('bez', bez);
	}
	
	$('.listItem').unbind('click');
	
	$('.listItem').click(function() {
		var fachkuerzel = $(this).data('fachkuerzel');
		var dozentkuerzel = $(this).data('dozentkuerzel');
		var nachname = $(this).data('nachname');
		var vorname = $(this).data('vorname');
		var bez = $(this).data('bez');
		
		displayFach(fachkuerzel, dozentkuerzel, nachname, vorname, bez);
	});
	
	
	mainScroll = new iScroll('scroller',  {zoom: false, hScrollbar: false, vScrollbar: true} );

}




function proxyPost(mensaID, day) {

	var url = "http://gyoca.com/cloud/demos/mensa_app/res/php/getMenu/:"+mensaID+"/:"+day;
	url = String(url);
	
	function callback() {
		--alert('works?');
	}

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		contentType: "application/json; charset=windows-1252",
		success: function(data) {
			//alert('only get in success function');
			
			if(day == "heute") {
				$('#detailContent').append(data.data);
				$('#detailContent').append('<div class="zusatzDiv">Legende evtl. vorhandener Zusatzstoffe:<div class="zusatz">	1 = mit Farbstoff </div><div class="zusatz">    2 = mit Konservierungsstoff</div><div class="zusatz">    3 = mit Antioxidationsmittel</div><div class="zusatz">    4 = mit Geschmacksverstärker</div><div class="zusatz">    5 = geschwefelt</div><div class="zusatz">    6 = geschwärzt</div><div class="zusatz">    7 = gewachst</div><div class="zusatz">    8 = mit Phosphat</div><div class="zusatz">    9 = mit Süßstoff</div><div class="zusatz">    10 = enthält eine Phenylalaninquelle</div></div>');
				detailScroll.refresh();
				//var detailScroll = 
			}
			else {
				$('#secondDetailContent').append(data.data);
				$('#secondDetailContent').append('<div class="zusatzDiv">Legende evtl. vorhandener Zusatzstoffe:<div class="zusatz">	1 = mit Farbstoff </div><div class="zusatz">    2 = mit Konservierungsstoff</div><div class="zusatz">    3 = mit Antioxidationsmittel</div><div class="zusatz">    4 = mit Geschmacksverstärker</div><div class="zusatz">    5 = geschwefelt</div><div class="zusatz">    6 = geschwärzt</div><div class="zusatz">    7 = gewachst</div><div class="zusatz">    8 = mit Phosphat</div><div class="zusatz">    9 = mit Süßstoff</div><div class="zusatz">    10 = enthält eine Phenylalaninquelle</div></div>');
				secondDetailScroll.refresh();
			}
			document.getElementById('floatingCirclesG').style.display = 'none' ;
			
		},
		error: function(xhr, textStatus, thrownError) {
			if(thrownError == "Error: callback was not called") {
				//alert('hello');
			}
			else {
				//alert(thrownError);
			}
			if(textStatus == "timeout") {
				if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {	
					navigator.notification.alert('Verbinden Sie sich mit dem Internet um alle aktuellen Speisepläne sehen zu können.');
				}
				else {
					alert('Verbinden Sie sich mit dem Internet um alle aktuellen Speisepläne sehen zu können.');
				}
			}
			document.getElementById('floatingCirclesG').style.display = 'none' ;
			
		},
		jsonpCallback: 'callback',
		timeout: 10000
		
	});

}



function crossDomainPost(mensaID, day) {
  // Add the iframe with a unique name
  
  //alert(mensaID + " " + day);
  
  var previousFrame = document.getElementById("frame"+day);
  if(previousFrame != null) {
	previousFrame.remove();
  }
  
  var iframe = document.createElement("iframe");
  iframe.id = "frame" + day;
  //alert(iframe.id);
  var uniqueString = iframe.id;
  //document.body.appendChild(iframe);
  
  if(day == "heute") {
	$('#detailContent').append(iframe);
  }
  else {
	$('#secondDetailContent').append(iframe);
  }
  
  iframe.style.display = "inline";
  iframe.contentWindow.name = uniqueString;
  // construct a form with hidden inputs, targeting the iframe
  
  var prevForm = document.getElementById("form" + day);
  if(prevForm != null) {
	prevForm.remove();
  }
  
  var form = document.createElement("form");
  form.id = "form" + day;
  form.target=uniqueString;
  form.action = "http://www.kstw.de/handy/default.asp?act=show";
  form.method = "POST";

  // repeat for each parameter

  var input = document.createElement("input");
  input.type = "hidden";
  input.name = "R1";
  input.value = day;
  form.appendChild(input);
  
  var mensaInput = document.createElement('input');
  mensaInput.type = "hidden";
  mensaInput.name = "mensa";
  mensaInput.value = mensaID;
  form.appendChild(mensaInput);

  //document.body.appendChild(form);
  
  if(day == "heute") {
	$('#detailContent').append(form);
	//var frameScroll = new iScroll('detailContent');
  }
  else {
	$('#secondDetailContent').append(form);
	//var frameScroll = new iScroll('secondDetailContent');
  }
  
  form.submit();
  
}

function displayMealPlan(mensaID, day) {
	
	document.getElementById('floatingCirclesG').style.display = 'inline';
	
	currentMensaID = mensaID;
	var title;
	window.localStorage.setItem('mensaSelected', 'true');
	window.localStorage.setItem('mensaID', currentMensaID);
		
	var index;
	for (index = 0; index < mensaArray.length; index++) {
		if(currentMensaID == mensaArray[index].externalID) {
			title = mensaArray[index].label;
			break;
		}
	}
		
		
	$('#header').text(title);
	$('#header').append('<img id="appIcon" src="res/img/ic_launcher48.png">');
		
	//document.getElementById('#infoDetailPage').setAttribute('class', 'detailPage');
	//alert('get here');
	document.getElementById("infoDetailPage").setAttribute('class', 'detailPage');
	
	//alert(currentMensaID);
	//alert(mensaID + " " + day);
	
	if(day == "heute") {
	
		$('#detailContent').empty();
		
		var today = new Date();
		var dd = today.getDate();
		var mm = monthArray[today.getMonth()];

		$('#detailContent').append('<h1>Menü für heute, den '+dd+'. '+mm+'</h1>');
		
		$('#btnNext').remove();
		
		
		
		//$('#header').append('<span id="btnNext">Morgen</span>');
		$('#header').after('<img id="btnNext" src="res/img/arrowRight3.png">');
		
		$('#btnNext').click(function() {
			//alert('clicked');
			displayMealPlan(currentMensaID, "morgen")
		});
		
		$("#btnNext").mousedown(function(){
			$('#btnNext').attr('src', 'res/img/arrowRightLight.png');
		});
		$("#btnNext").mouseup(function(){
			$('#btnNext').attr('src', 'res/img/arrowRight3.png');
		});
		$("#btnNext").bind('touchstart', function(){
			$('#btnNext').attr('src', 'res/img/arrowRightLight.png');
		}).bind('touchend', function(){
			$('#btnNext').attr('src', 'res/img/arrowRight3.png');
		});
		
	}
	else {
		$('#secondDetailContent').empty();
		
		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		var dd = tomorrow.getDate();
		var mm = monthArray[tomorrow.getMonth()];

		$('#secondDetailContent').append('<h1>Menü für morgen, den '+dd+'. '+mm+'</h1>');
		$('#btnNext').remove();
		
		//$('#header').append('<span id="btnNext">Heute</span>');
		$('#header').after('<img id="btnNext" src="res/img/arrowLeft3.png">');
		
		$('#btnNext').click(function() {
			//alert('clicked');
			displayMealPlan(currentMensaID, "heute")
		});
		
		$("#btnNext").mousedown(function(){
			$('#btnNext').attr('src', 'res/img/arrowLeftLight.png');
		});
		$("#btnNext").mouseup(function(){
			$('#btnNext').attr('src', 'res/img/arrowLeft3.png');
		});
		
		$("#btnNext").bind('touchstart', function(){
			$('#btnNext').attr('src', 'res/img/arrowLeftLight.png');
		}).bind('touchend', function(){
			$('#btnNext').attr('src', 'res/img/arrowLeft3.png');
		});
	
	}
	
	
	
	//crossDomainPost(mensaID, day);
	proxyPost(mensaID, day);
	
	document.getElementById("footer").setAttribute('class', 'footerVis');
	if(day == "heute") {
		
		document.getElementById("secondDetailPage").setAttribute('class', 'detailPage');
		document.getElementById("detailPage").setAttribute('class', 'detailPageVis');
		
		detailScroll.refresh();
		setTimeout(function() {
			detailScroll.refresh();
		}, 2000);
		setTimeout(function() {
			detailScroll.refresh();
		}, 5000);
	}
	else {
		document.getElementById("secondDetailPage").setAttribute('class', 'detailPageVis');
		
		
		secondDetailScroll.refresh();
		setTimeout(function() {
			secondDetailScroll.refresh();
		}, 2000);
		setTimeout(function() {
			secondDetailScroll.refresh();
		}, 5000);
	}
	
}

function displayTime() {
	currentPage = 'time';
	document.getElementById('floatingCirclesG').style.display = 'none';
	$('#infoDetailPage').empty();
	$('#infoDetailPage').append('<div id="thirdDetailScroll"></div>');
	$('#thirdDetailScroll').append('<div id="thirdDetailContent"></div>');

	document.getElementById("infoDetailPage").style.backgroundColor = "#FFFFFF";

	$('#thirdDetailContent').empty();
	
	// add current time
	var i;
	var mensa;
	for(i = 0; i < mensaArray.length; ++i) {
		if(mensaArray[i].externalID == currentMensaID) {
			mensa = mensaArray[i];
			break;
		}
	}
	
	$('#btnNext').remove();
		
		
	//$('#header').append('<span id="btnNext">Heute</span>');
	$('#header').after('<img id="btnNext" src="res/img/arrowLeft3.png">');
		
	$('#btnNext').click(function() {
		
		displayMealPlan(currentMensaID, "heute")
	});
	$("#btnNext").mousedown(function(){
		$('#btnNext').attr('src', 'res/img/arrowLeftLight.png');
	});
	$("#btnNext").mouseup(function(){
		$('#btnNext').attr('src', 'res/img/arrowLeft3.png');
	});
	
	$("#btnNext").bind('touchstart', function(){
        $('#btnNext').attr('src', 'res/img/arrowLeftLight.png');
    }).bind('touchend', function(){
        $('#btnNext').attr('src', 'res/img/arrowLeft3.png');
    });
	
	$('#thirdDetailContent').append('<h2 style="text-decoration: underline">Öffnungszeiten</h2>');
	$('#thirdDetailContent').append(mensa.openTime);
	
	document.getElementById("infoDetailPage").setAttribute('class', 'detailPageVis');
	
	var infoScroll = new iScroll('thirdDetailScroll', {zoom: true, hScrollbar: false, vScrollbar: false});

}

function renderMap() {
	currentPage = 'map';
	document.getElementById('floatingCirclesG').style.display = 'none';
	$('#thirdDetailContent').empty();
	
	// add current time
	var i;
	var mensa;
	for(i = 0; i < mensaArray.length; ++i) {
		if(mensaArray[i].externalID == currentMensaID) {
			mensa = mensaArray[i];
			break;
		}
	}
	
	$('#btnNext').remove();
		
		
	//$('#header').append('<span id="btnNext">Heute</span>');
	$('#header').after('<img id="btnNext" src="res/img/arrowLeft3.png">');
		
	$('#btnNext').click(function() {
		
		displayMealPlan(currentMensaID, "heute")
	});
	$("#btnNext").mousedown(function(){
			$('#btnNext').attr('src', 'res/img/arrowLeftLight.png');
	});
	$("#btnNext").mouseup(function(){
		$('#btnNext').attr('src', 'res/img/arrowLeft3.png');
	});
	
	$("#btnNext").bind('touchstart', function(){
        $('#btnNext').attr('src', 'res/img/arrowLeftLight.png');
    }).bind('touchend', function(){
        $('#btnNext').attr('src', 'res/img/arrowLeft3.png');
    });
	
	
	var mapProp;
	var lat, lon;
	lat = mensa.lat;
	lon = mensa.lon;
	//alert(lat + " " + lon);
	mapProp = {
		center:new google.maps.LatLng(lat, lon),
		zoom: 16,
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};
	
	var page = document.getElementById("infoDetailPage");
	//page.style.width = "98%";
	var map = new google.maps.Map(page, mapProp);
	
	myLatLong = new google.maps.LatLng(lat, lon);
	var marker =  new google.maps.Marker({
		position: myLatLong,
		map: map,
		title: mensa.label
	  
	});
	
	var content = '<h2>' + mensa.label + '</h2>' + '<div>' + mensa.adress + '</div>';
	
	var infoWindow = new google.maps.InfoWindow({
			content: content,
			maxWidth: 300,
			maxHeight: 300
	});
	
	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.open(map,marker);
	});

		//markerList.push(marker);
		
	
	
	
	//$('#thirdDetailContent').append('<h2>Öffnungszeiten</h2>');
	//$('#thirdDetailContent').append(mensa.openTime);
	document.getElementById("infoDetailPage").setAttribute('class', 'detailPageVis');
		
}




function displayFach(fachkuerzel, dozentkuerzel, nachname, vorname, bez) {

	$('#detailContent').empty();
	$('#detailScroll').append('<div id="detailContent"></div>');
	
	$('#detailContent').append('<h1>Evaluierung des Fachs '+fachkuerzel+'</h1>');

	$('#detailContent').append('<form action="http://edb.gm.fh-koeln.de/services/evaluation_service.jsp?call=setEvaluation" method="POST" id="bewertungForm"></form>');
	
	$('#bewertungForm').append('<input name="fachkuerzel" value="'+fachkuerzel+'" style="display:none">');
	$('#bewertungForm').append('<input name="dozentkuerzel" value="'+dozentkuerzel+'" style="display:none">');
	
	$('#bewertungForm').append('<h2>1.	Die Lerninhalte und Methoden wurden für mich klar erkennbar dargestellt</h2><br><input class="slider" type="range" name="frage1" min=1 max=5><input class="sliderText" type="text" disabled><br>');
	$('#bewertungForm').append('<h2>2.	Die Dozentin/der Dozent führt die Lehrveranstaltung engagiert durch:</h2><br><input class="slider" type="range" name="frage2" min=1 max=5><input class="sliderText" type="text" disabled><br>');
	$('#bewertungForm').append('<h2>3.	Inhalte der Veranstaltung waren für mich interessant und neu.</h2><br><input class="slider" type="range" name="frage3" min=1 max=5><input class="sliderText" type="text" disabled><br>');
	
	$('#bewertungForm').append('<h2>Welche Themen wurden zu kurz behandelt?</h2><textarea name="frage4" class="textarea"></textarea><br>');
	$('#bewertungForm').append('<h2>Welche Themen könnten gekürzt werden?</h2><textarea name="frage5" class="textarea"></textarea><br>');
	$('#bewertungForm').append('<h2>Sonstige Anmerkungen oder Verbesserungsvorschläge!</h2><textarea name="frage6" class="textarea"></textarea><br>');
	
	$('#detailContent').append('<button id="btnSubmit">Submit</button>');
	document.getElementById("detailPage").setAttribute('class', 'detailPageVis');
	
	$('.slider').next().val('3');
	
	$('.slider').change(function() {
		$(this).next().val($(this).val());
		//detailScroll.scrollTo(0, 1, 0, true)
	});
	
	$('.slider').bind('touchend', function(e) {
		// here we should make only for android, ios no problem
		detailScroll.scrollTo(0, 1, 0, true);
	});
	
	$('*').click(function() {
		if($(this).prop('tagName') == 'TEXTAREA') {
		
		}
		else {
			$('textarea').blur();
			//alert('should blur here');
		}
		
	});
	
	$('textarea').click(function(e) {
		//alert('get here, ' + $(this).prop('tagName'));
		e.stopPropagation();
	});
	
	
	$('#btnSubmit').click(function(e) {
		
		var data = $('#bewertungForm').serializeArray();
		//console.log(data);
		$.ajax({
			type: 'POST',
			crossDomain: true,
			url: 'http://edb.gm.fh-koeln.de/services/evaluation_service.jsp?call=setEvaluation',
			data: data,
			success: function(data, textStatus, jqXHR) {
				//alert('yes');
				//$('#listItem' + feedback_id).data('votes', votes);
				//populateDetail(object); 
				alert('works');
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//alert(jqXHR.status + " " + textStatus + " " + errorThrown);
				if(jqXHR.status == 0) {
					alert('might work');
				}
				else {
					alert(jqXHR.status + " " textStatus + " " + errorThrown);
				}
				
		}
		
	});
		
		
		//$('#bewertungForm').submit();
		//e.preventDefault();

	});
		
	detailScroll.refresh();
	setTimeout(function() {
		detailScroll.refresh();
	}, 2000);
	setTimeout(function() {
		detailScroll.refresh();
	}, 5000);

	
	
	// fachkuerzel, dozentkuerzel, 6 questions
	// if this doesn't work, do a proxy over internet services or another server
	/*$.ajax({
		type: 'POST',
		crossDomain: true,
		url: 'http://edb.gm.fh-koeln.de/services/evaluation_service.jsp?call=setEvaluation',
		//data: formToJSON(feedback_id, votes),
		success: function(data, textStatus, jqXHR) {
			//alert('yes');
			//$('#listItem' + feedback_id).data('votes', votes);
			//populateDetail(object); 
			alert('works');
		},
		error: function(jqXHR, textStatus, errorThrown) {
			//alert(jqXHR.status + " " + textStatus + " " + errorThrown);
			if(jqXHR.status == 0) {
				//alert('might work');
			}
			else {
				//alert('Post doesn\'t work');
			}
		}
		
	});*/
}

function displaySelectMenu() {

	document.getElementById('floatingCirclesG').style.display = 'none';
	$('#wrapper').empty();
	
	$('#wrapper').append('<div id="scroller"></div>');
	$('#scroller').append('<ul id="thelist"></ul>');
	
	
	$('#wrapper').prepend('<h2>Wähle Deine Mensa</h2>');
	
	var i, id, label, adress, openTime, url, lat, lon, email, externalID;
	var mensa;
	
	for(i = 0; i < mensaArray.length; ++i) {
		mensa = mensaArray[i];
		mensaID = mensa.mensaID;
		label = mensa.label;
		adress = mensa.adress;
		openTime = mensa.openTime;
		url = mensa.url;
		lat = mensa.lat;
		lon = mensa.lon;
		email = mensa.email;
		externalID = mensa.externalID;
		
		$('#thelist').append('<li id="listItem'+mensaID+'" class="listItem"><span  class="listTitle">'+label+'</span><br/>'+adress+'</li>');
		$('#listItem'+mensaID).data('externalID', externalID);
	}
	
	$('.listItem').unbind('click');
	
	$('.listItem').click(function() {
		//alert(this.id);
		/*if(currentPage != "main") {
			return;
		}
		else {
			currentPage = "detail";
		}*/
		var mensaID = $('#' + this.id).data('externalID');
		//alert(mensaID);
		
		
		displayMealPlan(mensaID, "heute");
		
	});
	
	
	mainScroll = new iScroll('scroller',  {
		zoom: false, 
		hScrollbar: false, 
		vScrollbar: true,
		useTransform: false,
		onBeforeScrollStart: function (e) {
			var target = e.target;
			while (target.nodeType != 1) target = target.parentNode;

			if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
				e.preventDefault();
		}
		
	});
	
}



function bindEvents() {
	
	
	
}



// starting function
{

	var fachArray = new Array();
	var mainScroll;
	// currentPage can be ['mensaList', 'heute', 'morgen', 'time', 'map']
	var currentPage;
	var detailScroll;
	var secondDetailScroll;
	
	document.addEventListener("deviceready", function() {

			// check if android device
			if(navigator.userAgent.match(/Android/i)) {
				$('*').prop('webkitUserModify', 'none');
				$('*').prop('webkitUserSelect', 'none');
			}

			document.addEventListener("backButton", function() {
				//alert('back button pressed');
				//goLeft();
				if(document.getElementById("detailPage").getAttribute('class') == 'detailPageVis') {
					document.getElementById("detailPage").setAttribute('class', 'detailPage');
				}
				else if(document.getElementById("detailPage").getAttribute('class') == 'detailPage') {
					device.exitApp();
				}
				
			}, false);
			document.addEventListener("menubutton", function() {
				//alert("menu button pressed");
			}, false);
			
	}, false);

	$('#detailPage').swipe({
		swipe: function(event, direction, distance, duration, fingerCount) {
			if(direction == "left") {
				//alert('go to tomorrow');
				//goLeft();
				//$('#btnNext').click();
			}
			else if (direction =="right") {
				//alert('go to mensa list page');
				//$('#btnMensaList').click();
				// here should unfocus input if going back
				document.getElementById('detailPage').setAttribute('class', 'detailPage');
				
				
			}
		}
	});
	
	$('#secondDetailPage').swipe({
		swipe: function(event, direction, distance, duration, fingerCount) {
			if(direction == "left") {
				//alert('do nothing');
				//document.getElementById('detailPage').setAttribute('class', 'detailPage');
				//goLeft();
			}
			else if (direction =="right") {
				//alert('go to today');
				$('#btnNext').click();
			}
		}
	});
	
	$('#infoDetailPage').swipe({
		swipe: function(event, direction, distance, duration, fingerCount) {
			if(direction == "left") {
				//alert('do nothing');
				//document.getElementById('detailPage').setAttribute('class', 'detailPage');
				//goLeft();
			}
			else if (direction =="right") {
				//alert('go to today');
				if(currentPage != 'map') {
					$('#btnNext').click();
				}
			}
		}
	});
	
	//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	
	document.addEventListener('DOMContentLoaded', function () { 
		detailScroll = new iScroll('detailScroll',  {
			zoom: true, 
			hScrollbar: false, 
			vScrollbar: false,
			useTransform: false,
			onBeforeScrollStart: function (e) {
				var target = e.target;
				while (target.nodeType != 1) target = target.parentNode;

				//if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
				//	e.preventDefault();
			}
		});
		secondDetailScroll = new iScroll('secondDetailScroll',  {
			zoom: false, 
			hScrollbar: false, 
			vScrollbar: false,
			useTransform: false,
			onBeforeScrollStart: function (e) {
				var target = e.target;
				while (target.nodeType != 1) target = target.parentNode;

				if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA' && target.tagName != 'FORM')
					e.preventDefault();
			}
		});
		bindEvents();
		loadData();
	}, false);

	document.addEventListener("resume", function() {
		// resuming mensa app - have to test on actual device
		//if(document.getElementById("detailPage").getAttribute('class') == 'detailPageVis') {
		//loadData();
		//document.getElementById("secondDetailPage").setAttribute('class', 'detailPage');
		//document.getElementById("infoDetailPage").setAttribute('class', 'detailPage');
		//}
		
	}, false);
}

