
<script>
// ################################################################
// ################################################################
// Constant ------------------------------------------

var IS_TESTING_WZS = location.pathname.indexOf("ca-gen/test.html") >=0 ;
var IS_LOCATION = {
	P3850101 : location.pathname.indexOf("P3850101") >= 0 || IS_TESTING_WZS
	, P3820501 : location.pathname.indexOf("w3820501") >= 0 || location.pathname.indexOf("JUB2050") >= 0  ||  IS_TESTING_WZS
}
	
// ################################################################
// ################################################################
// Calendar ------------------------------------------

function initCustomCalendar(){
	console.log("initCustomCalendar",location.pathname, IS_LOCATION);
	// amira's
	if(IS_LOCATION["P3850101"]){
		addCalendar("t1_ef_tarikh_permohonan");
		addCalendar("t1_ef_tarikh_perintah");
	}	
	
	// jubli's
	if(IS_LOCATION["P3820501"]){
		addCalendar("tab1_ef_tarikh_permohonan");
		addCalendar("tab1_ef_tarikh_perintah");
	}

	function addCalendar(elemId){
		var INTERVAL_TIME = 500;
		var interval = setInterval(function () {
			try {
				var el = document.getElementById(elemId);
				console.log(el);
				if (el != null && typeof el !== "undefined") {
					var isDisabled = el.className.indexOf("DISABLED") >= 0;
					// create calendar
					var width = 20;
					var left = el.style.left;
					try{
						left = Number.parseInt(el.style.width.replace("px","")) + Number.parseInt(el.style.left.replace("px",""));
						left -= width;
					}catch(err){
						console.log("addCalendar left err",err);
					}
					
					var calendar = document.createElement("span");
					//calendar.setAttribute("type","date");
					//calendar.id = el.id + "_calendar";
					calendar.innerHTML = "C";
					calendar.style.textAlign = "center";
					calendar.style.backgroundColor = !isDisabled ? "#1549ab" : "rgb(103, 146, 227)";
					calendar.style.color = "white";
					calendar.style.fontWeight = "bold";
					calendar.style.cursor = "pointer";
					calendar.style.width = width + "px";
					calendar.style.height = el.style.height;
					calendar.style.position = "absolute";
					calendar.style.left =  left+"px";
					calendar.style.right = el.style.right;
					calendar.style.top = el.style.top;
					calendar.style.bottom = el.style.bottom;
					
					var cInput = document.createElement("input");
					//cInput.setAttribute("type","date");
					cInput.setAttribute("parentId", el.id);
					cInput.id = el.id + "_calendar";
					cInput.style.position = "absolute";
					cInput.style.cursor = "pointer";
					cInput.style.opacity = "0";
					cInput.style.left = "0px";
					cInput.style.width = width + "px";
					
					var picker = new Pikaday({ 
						field: cInput,
						format: 'D MMM YYYY',
						onSelect: function() {
						
						var parent = document.getElementById(cInput.getAttribute("parentId"));
							if (parent != null && typeof parent !== "undefined") {
								
								var isDisabledParent = el.className.indexOf("DISABLED") >= 0;
								calendar.style.backgroundColor = !isDisabledParent ? "#1549ab" : "rgb(103, 146, 227)";
								
								if(isDisabledParent){
									parent.value = "";
									return;
								}
							
								// generate date
								var date = this._d;
								var d = date.getDate();
								var m = date.getMonth() + 1;
								var y = date.getFullYear();
								
								if(m < 10){
									m = "0"+m;
								}
								
								if(d < 10){
									d = "0"+d;
								}
								
								parent.value = d+"/"+m+"/"+y;
							}
						}
					});
					
					/*
					cInput.addEventListener("change", function(){
						var parent = document.getElementById(cInput.getAttribute("parentId"));
						if (parent != null && typeof parent !== "undefined") {
							var isDisabledParent = el.className.indexOf("DISABLED") >= 0;
							calendar.style.backgroundColor = !isDisabledParent ? "#1549ab" : "rgb(103, 146, 227)";
							
							var val = this.value;	//2018-06-14
							if(val == "" || isDisabledParent){
								parent.value = "";
								return;
							}
							
							var valArr = val.split("-");
							var newDate = valArr[2]+"/"+valArr[1]+"/"+valArr[0];
							parent.value = newDate;
						}
					});
					*/
					
					calendar.appendChild(cInput);
					el.parentElement.appendChild(calendar);
					
					// clear interval
					clearInterval(interval);
				}
			} catch (err) {
				console.log("addCalendar err", err);
			}

		}, INTERVAL_TIME);
	}
}

initCustomCalendar();

// ################################################################
// ################################################################
// Custom Popup ------------------------------------------

var CUSTOM_POPUP = null;
var CustomPopupClass = function () {
	this.TYPE_ERR = "error";
	this.TYPE_INFO = "info";
	this.TYPE_SUCCESS = "success";

	this.elem = document.createElement('div');
	this.elem.id = "custom-popup";

	this.background = document.createElement('div');
	this.background.id = "cp-background";

	this.content = document.createElement('div');
	this.content.id = "cp-content";

	this.header = document.createElement('div');
	this.header.id = "cp-header";

	this.close = document.createElement('div');
	this.close.id = "cp-close";
	this.close.innerHTML = "X";

	this.body = document.createElement('div');
	this.body.id = "cp-body";

	this.content.appendChild(this.close);
	this.content.appendChild(this.header);
	this.content.appendChild(this.body);

	this.elem.appendChild(this.background);
	this.elem.appendChild(this.content);

	document.body.appendChild(this.elem);

	this.registerEvent();
};

CustomPopupClass.prototype.openPopup = function (type, message) {
	console.log("CustomPopupClass", type, message);
	this.content.className = "cp-" + type;
	this.header.innerHTML = type;
	this.body.innerHTML = message;
	this.elem.style.display = "flex";
};

CustomPopupClass.prototype.closePopup = function () {
	this.elem.style.display = "none";
}

CustomPopupClass.prototype.registerEvent = function () {
	var obj = this;

	this.close.addEventListener("click", function () {
		obj.closePopup();
	});

	this.background.addEventListener("click", function () {
		obj.closePopup();
	});
};

function alert(message) {

	if (CUSTOM_POPUP == null) {
		console.log("initializing Custom Popup from alert");
		CUSTOM_POPUP = new CustomPopupClass();
	}

	var type = CUSTOM_POPUP.TYPE_ERR;
	CUSTOM_POPUP.openPopup(type, message);
	return;
}

window.alert = function (message) {
	if (CUSTOM_POPUP == null) {
		console.log("initializing Custom Popup from window.alert");
		CUSTOM_POPUP = new CustomPopupClass();
	}

	var type = CUSTOM_POPUP.TYPE_ERR;
	CUSTOM_POPUP.openPopup(type, message);
	return;
}


// ################################################################
// ################################################################
// Custom Event Handler ------------------------------------------

function customEventHandler() {
	var CLEAR_ALL_TIMEOUT = 8000;
	var INTERVAL_TIME = 200;

	var CUSTOM_CLASS = {
		DISABLED: "INPUT-DISABLED",
		PROTECTED: "INPUT-PROTECTED",
		MANDATORY: "INPUT-MANDATORY",
		MUSTKEYIN: "INPUT-MUSTKEYIN",
		TAB_DISABLED: "TAB-DISABLED",
		BTN_DISABLED: "MENU-BTN-DISABLED",
		NAV_BTN_DISABLED: "NAVBTN-DISABLED",
	};
	
	
	for(var k in CUSTOM_CLASS){
		inputEvent(CUSTOM_CLASS[k]);
	}
	
	
	function inputEventAction(e, className) {
		e.removeAttribute("required");
		e.removeAttribute("disabled");
		
		if ([CUSTOM_CLASS.DISABLED, CUSTOM_CLASS.PROTECTED, CUSTOM_CLASS.TAB_DISABLED, CUSTOM_CLASS.BTN_DISABLED, CUSTOM_CLASS.NAV_BTN_DISABLED].indexOf(className) >= 0) {
			e.setAttribute("disabled", "");
		} else if ([CUSTOM_CLASS.MANDATORY, CUSTOM_CLASS.MUSTKEYIN].indexOf(className) >= 0) {
			e.setAttribute("required", "");
		}
	}
	
	/*
	var intervals = {};
	intervals[CUSTOM_CLASS.DISABLED] = setInterval(function () {
			inputEvent(CUSTOM_CLASS.DISABLED);
		}, INTERVAL_TIME);	
		
	intervals[CUSTOM_CLASS.PROTECTED] = setInterval(function () {
			inputEvent(CUSTOM_CLASS.PROTECTED);
		}, INTERVAL_TIME);

	intervals[CUSTOM_CLASS.MANDATORY] = setInterval(function () {
			inputEvent(CUSTOM_CLASS.MANDATORY);
		}, INTERVAL_TIME);

	intervals[CUSTOM_CLASS.MUSTKEYIN] = setInterval(function () {
			inputEvent(CUSTOM_CLASS.MUSTKEYIN);
		}, INTERVAL_TIME);
		
	intervals[CUSTOM_CLASS.TAB_DISABLED] = setInterval(function () {
			inputEvent(CUSTOM_CLASS.TAB_DISABLED);
		}, INTERVAL_TIME);

	intervals[CUSTOM_CLASS.BTN_DISABLED] = setInterval(function () {
			inputEvent(CUSTOM_CLASS.TAB_DISABLED);
		}, INTERVAL_TIME);
		
	intervals[CUSTOM_CLASS.NAV_BTN_DISABLED] = setInterval(function () {
			inputEvent(CUSTOM_CLASS.NAV_BTN_DISABLED);
		}, INTERVAL_TIME);
	*/
	

	/*
	setTimeout(function () {
		for (var i in intervals) {
			clearInterval(intervals[i]);
		}
	}, CLEAR_ALL_TIMEOUT);
	*/
	
	/*
	function clearIntervalByClass(className) {
		clearInterval(intervals[className]);
	}
	*/

	function inputEvent(className) {
		var namedInput = document.getElementsByClassName(className);
		//var success = false;
		//console.log("trying ... ", className);
		for (var i in namedInput) {
			try {
				i = Number.parseInt(i);
				if (Number.isNaN(i)) {
					continue;
				}

				var e = namedInput[i];
				inputEventAction(e, className);
				addClassObserver(e);
				//success = true;
			} catch (err) {
				console.log(err);
			}
		}

		//if (success) {
		//	clearIntervalByClass(className);
		//}

	}

	function addClassObserver(e) {
		var observer = new MutationObserver(function (event) {
				inputEventAction(e, e.className);
			})

			observer.observe(e, {
				attributes: true,
				attributeFilter: ['class'],
				childList: false,
				characterData: false
			});
	}
}

setInterval(function(){customEventHandler();},500);

// ################################################################
// ################################################################
// Custom Local Storage ------------------------------------------

function customLocalStorage() {
	var LS_AUTH = "JPN-LOCAL-STORAGE-AUTH";
	var INTERVAL_TIME = 500;

	function setLocalStorage() {
		var tempLS = localStorage.getItem(LS_AUTH);
		if (tempLS == null || typeof tempLS === "undefined") {
			var a = "";
			
			if(IS_LOCATION.P3850101){
				a = `{"login_time":1526865746,"authenticated":true,"user":{"BRANCH_CODE":"16011011","PC_ID":"031","OPER_ID":"AMIRA"}}`;
			}
			
			if(IS_LOCATION.P3820501){
				a = `{"login_time":1526865746,"authenticated":true,"user":{"BRANCH_CODE":"16011011","PC_ID":"031","OPER_ID":"JUBLI"}}`;
			}
			
			localStorage.setItem(LS_AUTH, a);
		}
	}

	function getLocalStorage() {
		var obj = localStorage.getItem(LS_AUTH);
		if (obj !== null) {
			obj = JSON.parse(obj);
			
			setValue('PC_ID', obj.user.PC_ID);
			setValue('BRANCH_CODE', obj.user.BRANCH_CODE);
			setValue('OPER_ID', obj.user.OPER_ID);
			
			setDefaultValue(obj);
		}
	}
	

	function setDefaultValue(obj){
		var pathname = location.pathname;
		
		// only in amira's page
		if(IS_LOCATION["P3850101"]){
			console.log("yo");
			try {
				setNewApplicationNo(obj.user.BRANCH_CODE, obj.user.PC_ID);
			} catch (err) {
				console.log("setNewApplicationNo err", err);
			}
			
			try {
				setPejabatPendaftaran("t1_lb_pej_daftar", obj.user.BRANCH_CODE);
			} catch (err) {
				console.log("setPejabatPendaftaran err", err);
			}
		}
	}

	function setNewApplicationNo(cawangan, pcid) {
		console.log("setNewApplicationNo", cawangan, pcid);
		var d = new Date();
		var noPermohonan = cawangan + '-' + d.getFullYear() + '' + ('0' + (d.getMonth() + 1)).slice(-2) + '' + ('0' + d.getDate()).slice(-2)
			 + '-' + ('0' + d.getHours()).slice(-2) + '' + ('0' + d.getMinutes()).slice(-2) + '' + ('0' + d.getSeconds()).slice(-2) + '-' + pcid.slice(-2);
		setValue('t1_ef_no_permohonan', noPermohonan);
	}
	
	
	function setValueAction(el, elemVal){
		
		el.value = elemVal;
		el.setAttribute("disabled", "");
		el.setAttribute("value", elemVal);
	}
	
	function setValue(elemId, elemVal) {
		var interval = setInterval(function () {
				try {
					var el = document.getElementById(elemId);
					//var el = document.getElementsByClassName(elemId)[0];
					if (el != null && typeof el !== "undefined") {
						setValueAction(el, elemVal);
						//clearInterval(interval)
					}
				} catch (err) {
					console.log("setValue err", err);
				}

			}, INTERVAL_TIME);
	}
	
	var cawanganSelectIndex = null;
	function setPejabatPendaftaran(elemId, cawangan){
		console.log("setPejabatPendaftaran", elemId, cawangan);

		var interval = setInterval(function () {

			try {
				var el = document.getElementById(elemId);
				if (el != null && typeof el !== "undefined") {
				
					if(cawanganSelectIndex == null){
						for (var i = 0; i < el.length; i++) {
							 var val =el[i].text;
							 valArr = val.split("-");
							 
							 if(typeof valArr[0] === "string"){
								var cawanganCode = valArr[0].trim();							 
								if(cawangan == cawanganCode){
									cawanganSelectIndex = i;
								}
							 }
						}
					}
					
					if(cawanganSelectIndex != null){
						el.selectedIndex = cawanganSelectIndex;
					}
					
					clearInterval(interval);
				}
			} catch (err) {
				console.log("setValue setPejabatPendaftaran err", err);
			}
		}, INTERVAL_TIME);
	}
	
	try {
		setLocalStorage();
	} catch (err) {
		console.log("error setLocalStorage", err);
	}
	try {
		getLocalStorage();
	} catch (err) {
		console.log("error getLocalStorage", err);
	}
}

customLocalStorage();

</script>