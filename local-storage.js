<script>
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
		console.log("initializing Custom Popup");
		CUSTOM_POPUP = new CustomPopupClass();
	}

	var type = CUSTOM_POPUP.TYPE_ERR;
	CUSTOM_POPUP.openPopup(type, message);
	return;
}

//setTimeout(function () {
//	alert("test");
//}, 1000);

// ################################################################
// ################################################################
// Custom Event Handler ------------------------------------------

function customEventHandler() {
	var CLEAR_ALL_TIMEOUT = 8000;
	var INTERVAL_TIME = 200;

	var CUSTOM_CLASS = {
		DISABLED: "INPUT-DISABLED",
		MANDATORY: "INPUT-MANDATORY",
		TAB_DISABLED:"TAB-DISABLED",
		BTN_DISABLED:"MENU-BTN-DISABLED",
	};

	var intervals = {};
	intervals[CUSTOM_CLASS.DISABLED] = setInterval(function () {
			inputEvent(CUSTOM_CLASS.DISABLED);
		}, INTERVAL_TIME);
		
	intervals[CUSTOM_CLASS.MANDATORY] = setInterval(function () {
			inputEvent(CUSTOM_CLASS.MANDATORY);
		}, INTERVAL_TIME);

	intervals[CUSTOM_CLASS.TAB_DISABLED] = setInterval(function () {
			inputEvent(CUSTOM_CLASS.TAB_DISABLED);
		}, INTERVAL_TIME);


	function inputEventAction(e, className) {
		e.removeAttribute("required");
		e.removeAttribute("disabled");
		
		if (className == CUSTOM_CLASS.DISABLED || className == CUSTOM_CLASS.TAB_DISABLED || className == CUSTOM_CLASS.BTN_DISABLED) {
			e.setAttribute("disabled", "");
		} else if (className == CUSTOM_CLASS.MANDATORY) {
			e.setAttribute("required", "");
		}
	}

	setTimeout(function () {
		for (var i in intervals) {
			clearInterval(intervals[i]);
		}
	}, CLEAR_ALL_TIMEOUT);

	function clearIntervalByClass(className) {
		clearInterval(intervals[className]);
	}

	function inputEvent(className) {
		var namedInput = document.getElementsByClassName(className);
		var success = false;
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
				success = true;
			} catch (err) {
				console.log(err);
			}
		}

		if (success) {
			clearIntervalByClass(className);
		}

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
			})
	}
}

customEventHandler();

// ################################################################
// ################################################################
// Custom Local Storage ------------------------------------------

function customLocalStorage() {
	var LS_AUTH = "JPN-LOCAL-STORAGE-AUTH";

	function setLocalStorage() {
		var tempLS = localStorage.getItem(LS_AUTH);
		if (tempLS == null || typeof tempLS === "undefined") {
			var a = `{"login_time":1526865746,"authenticated":true,"user":{"BRANCH_CODE":"16011019","PC_ID":"031","OPER_ID":"MOON"}}`;
			localStorage.setItem(LS_AUTH, a);
		}
	}

	function getLocalStorage() {
		var obj = localStorage.getItem(LS_AUTH);
		if (obj !== null) {
			obj = JSON.parse(obj);
		}
		
		try{
			setNewApplicationNo(obj.user.BRANCH_CODE, obj.user.PC_ID);
		}catch(err){
			console.log("setNewApplicationNo err",err);
		}
		
		setValue('PC_ID', obj.user.PC_ID);
		setValue('BRANCH_CODE', obj.user.BRANCH_CODE);
		setValue('OPER_ID', obj.user.OPER_ID);
	}

	function setNewApplicationNo(cawangan, pcid) {
		console.log("setNewApplicationNo", cawangan, pcid);
		var d = new Date();
		var noPermohonan = cawangan + '-' + d.getFullYear() + '' + ('0' + (d.getMonth() + 1)).slice(-2) + '' + ('0' + d.getDate()).slice(-2)
			 + '-' + ('0' + d.getHours()).slice(-2) + '' + ('0' + d.getMinutes()).slice(-2) + '' + ('0' + d.getSeconds()).slice(-2) + '-' + pcid.slice(-2);
		setValue('t1_ef_no_permohonan', noPermohonan);
	}

	function setValue(elemId, elemVal) {
		var interval = setInterval(function () {
			
			try{
				var el = document.getElementById(elemId);
				//var el = document.getElementsByClassName(elemId)[0];
				if (el != null && typeof el !== "undefined") {
					el.value = elemVal;
					el.setAttribute("disabled","");
					//clearInterval(interval)
				}
			}catch(err){
				console.log("setValue err",err);
			}
				
			}, 500);
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