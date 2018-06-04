
var LS_AUTH = "JPN-LOCAL-STORAGE-AUTH";

function setLocalStorage() {
	var tempLS = localStorage.getItem(LS_AUTH);
	if(tempLS == null || typeof tempLS === "undefined"){
		var a = `{"login_time":1526865746,"authenticated":true,"user":{"BRANCH_CODE":"16011019","PC_ID":"031","OPER_ID":"MOON"}}`;
		localStorage.setItem(LS_AUTH,a);
	}
}

function getLocalStorage() {
	var obj =   localStorage.getItem(LS_AUTH);
	if(obj !== null){
		obj = JSON.parse(obj);
	}
	setNewApplicationNo(obj.user.BRANCH_CODE, obj.user.PC_ID);
	setValue('PC_ID',obj.user.PC_ID);
	setValue('BRANCH_CODE',obj.user.BRANCH_CODE);
	setValue('OPER_ID',obj.user.OPER_ID);
}

function setNewApplicationNo(cawangan, pcid) {
	console.log("setNewApplicationNo",cawangan,pcid);
	var d = new Date();
	var noPermohonan = cawangan + '-' + d.getFullYear() +''+ ('0' + (d.getMonth() + 1)).slice(-2) +''+ ('0' + d.getDate()).slice(-2)
            +'-'+ ('0' + d.getHours()).slice(-2) +''+ ('0' + d.getMinutes()).slice(-2) +''+ ('0' + d.getSeconds()).slice(-2) +'-'+ pcid.slice(-2);
	setValue('t1_ef_no_permohonan', noPermohonan);
}

function setValue(elemId, elemVal) {
	var interval = setInterval(function(){
    //var el = document.getElementById(elemId);
    var el = document.getElementsByClassName(elemId)[0];
    if(el != null && typeof el !== "undefined"){
      el.value = elemVal;
      clearInterval(interval)
    }
  },500);
}
  
try{setLocalStorage();}catch(err){console.log("error setLocalStorage",err);}
try{getLocalStorage();}catch(err){console.log("error getLocalStorage",err);}
