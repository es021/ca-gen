<script>
// ################################################################
// ################################################################
// Calendar Library - PickADay ------------------------------------------

(function(root,factory)
{'use strict';var moment;if(typeof exports==='object'){try{moment=require('moment');}catch(e){}
module.exports=factory(moment);}else if(typeof define==='function'&&define.amd){define(function(req)
{var id='moment';try{moment=req(id);}catch(e){}
return factory(moment);});}else{root.Pikaday=factory(root.moment);}}(this,function(moment)
{'use strict';var hasMoment=typeof moment==='function',hasEventListeners=!!window.addEventListener,document=window.document,sto=window.setTimeout,addEvent=function(el,e,callback,capture)
{if(hasEventListeners){el.addEventListener(e,callback,!!capture);}else{el.attachEvent('on'+e,callback);}},removeEvent=function(el,e,callback,capture)
{if(hasEventListeners){el.removeEventListener(e,callback,!!capture);}else{el.detachEvent('on'+e,callback);}},trim=function(str)
{return str.trim?str.trim():str.replace(/^\s+|\s+$/g,'');},hasClass=function(el,cn)
{return(' '+el.className+' ').indexOf(' '+cn+' ')!==-1;},addClass=function(el,cn)
{if(!hasClass(el,cn)){el.className=(el.className==='')?cn:el.className+' '+cn;}},removeClass=function(el,cn)
{el.className=trim((' '+el.className+' ').replace(' '+cn+' ',' '));},isArray=function(obj)
{return(/Array/).test(Object.prototype.toString.call(obj));},isDate=function(obj)
{return(/Date/).test(Object.prototype.toString.call(obj))&&!isNaN(obj.getTime());},isWeekend=function(date)
{var day=date.getDay();return day===0||day===6;},isLeapYear=function(year)
{return year%4===0&&year%100!==0||year%400===0;},getDaysInMonth=function(year,month)
{return[31,isLeapYear(year)?29:28,31,30,31,30,31,31,30,31,30,31][month];},setToStartOfDay=function(date)
{if(isDate(date))date.setHours(0,0,0,0);},compareDates=function(a,b)
{return a.getTime()===b.getTime();},extend=function(to,from,overwrite)
{var prop,hasProp;for(prop in from){hasProp=to[prop]!==undefined;if(hasProp&&typeof from[prop]==='object'&&from[prop]!==null&&from[prop].nodeName===undefined){if(isDate(from[prop])){if(overwrite){to[prop]=new Date(from[prop].getTime());}}
else if(isArray(from[prop])){if(overwrite){to[prop]=from[prop].slice(0);}}else{to[prop]=extend({},from[prop],overwrite);}}else if(overwrite||!hasProp){to[prop]=from[prop];}}
return to;},fireEvent=function(el,eventName,data)
{var ev;if(document.createEvent){ev=document.createEvent('HTMLEvents');ev.initEvent(eventName,true,false);ev=extend(ev,data);el.dispatchEvent(ev);}else if(document.createEventObject){ev=document.createEventObject();ev=extend(ev,data);el.fireEvent('on'+eventName,ev);}},adjustCalendar=function(calendar){if(calendar.month<0){calendar.year-=Math.ceil(Math.abs(calendar.month)/12);calendar.month+=12;}
if(calendar.month>11){calendar.year+=Math.floor(Math.abs(calendar.month)/12);calendar.month-=12;}
return calendar;},defaults={field:null,bound:undefined,ariaLabel:'Use the arrow keys to pick a date',position:'bottom left',reposition:true,format:'YYYY-MM-DD',toString:null,parse:null,defaultDate:null,setDefaultDate:false,firstDay:0,formatStrict:false,minDate:null,maxDate:null,yearRange:10,showWeekNumber:false,pickWholeWeek:false,minYear:0,maxYear:9999,minMonth:undefined,maxMonth:undefined,startRange:null,endRange:null,isRTL:false,yearSuffix:'',showMonthAfterYear:false,showDaysInNextAndPreviousMonths:false,enableSelectionDaysInNextAndPreviousMonths:false,numberOfMonths:1,mainCalendar:'left',container:undefined,blurFieldOnSelect:true,i18n:{previousMonth:'Previous Month',nextMonth:'Next Month',months:['January','February','March','April','May','June','July','August','September','October','November','December'],weekdays:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],weekdaysShort:['Sun','Mon','Tue','Wed','Thu','Fri','Sat']},theme:null,events:[],onSelect:null,onOpen:null,onClose:null,onDraw:null,keyboardInput:true},renderDayName=function(opts,day,abbr)
{day+=opts.firstDay;while(day>=7){day-=7;}
return abbr?opts.i18n.weekdaysShort[day]:opts.i18n.weekdays[day];},renderDay=function(opts)
{var arr=[];var ariaSelected='false';if(opts.isEmpty){if(opts.showDaysInNextAndPreviousMonths){arr.push('is-outside-current-month');if(!opts.enableSelectionDaysInNextAndPreviousMonths){arr.push('is-selection-disabled');}}else{return'<td class="is-empty"></td>';}}
if(opts.isDisabled){arr.push('is-disabled');}
if(opts.isToday){arr.push('is-today');}
if(opts.isSelected){arr.push('is-selected');ariaSelected='true';}
if(opts.hasEvent){arr.push('has-event');}
if(opts.isInRange){arr.push('is-inrange');}
if(opts.isStartRange){arr.push('is-startrange');}
if(opts.isEndRange){arr.push('is-endrange');}
return'<td data-day="'+opts.day+'" class="'+arr.join(' ')+'" aria-selected="'+ariaSelected+'">'+'<button class="pika-button pika-day" type="button" '+'data-pika-year="'+opts.year+'" data-pika-month="'+opts.month+'" data-pika-day="'+opts.day+'">'+
opts.day+'</button>'+'</td>';},renderWeek=function(d,m,y){var onejan=new Date(y,0,1),weekNum=Math.ceil((((new Date(y,m,d)-onejan)/86400000)+onejan.getDay()+1)/7);return'<td class="pika-week">'+weekNum+'</td>';},renderRow=function(days,isRTL,pickWholeWeek,isRowSelected)
{return'<tr class="pika-row'+(pickWholeWeek?' pick-whole-week':'')+(isRowSelected?' is-selected':'')+'">'+(isRTL?days.reverse():days).join('')+'</tr>';},renderBody=function(rows)
{return'<tbody>'+rows.join('')+'</tbody>';},renderHead=function(opts)
{var i,arr=[];if(opts.showWeekNumber){arr.push('<th></th>');}
for(i=0;i<7;i++){arr.push('<th scope="col"><abbr title="'+renderDayName(opts,i)+'">'+renderDayName(opts,i,true)+'</abbr></th>');}
return'<thead><tr>'+(opts.isRTL?arr.reverse():arr).join('')+'</tr></thead>';},renderTitle=function(instance,c,year,month,refYear,randId)
{var i,j,arr,opts=instance._o,isMinYear=year===opts.minYear,isMaxYear=year===opts.maxYear,html='<div id="'+randId+'" class="pika-title" role="heading" aria-live="assertive">',monthHtml,yearHtml,prev=true,next=true;for(arr=[],i=0;i<12;i++){arr.push('<option value="'+(year===refYear?i-c:12+i-c)+'"'+
(i===month?' selected="selected"':'')+
((isMinYear&&i<opts.minMonth)||(isMaxYear&&i>opts.maxMonth)?'disabled="disabled"':'')+'>'+
opts.i18n.months[i]+'</option>');}
monthHtml='<div class="pika-label">'+opts.i18n.months[month]+'<select class="pika-select pika-select-month" tabindex="-1">'+arr.join('')+'</select></div>';if(isArray(opts.yearRange)){i=opts.yearRange[0];j=opts.yearRange[1]+1;}else{i=year-opts.yearRange;j=1+year+opts.yearRange;}
for(arr=[];i<j&&i<=opts.maxYear;i++){if(i>=opts.minYear){arr.push('<option value="'+i+'"'+(i===year?' selected="selected"':'')+'>'+(i)+'</option>');}}
yearHtml='<div class="pika-label">'+year+opts.yearSuffix+'<select class="pika-select pika-select-year" tabindex="-1">'+arr.join('')+'</select></div>';if(opts.showMonthAfterYear){html+=yearHtml+monthHtml;}else{html+=monthHtml+yearHtml;}
if(isMinYear&&(month===0||opts.minMonth>=month)){prev=false;}
if(isMaxYear&&(month===11||opts.maxMonth<=month)){next=false;}
if(c===0){html+='<button class="pika-prev'+(prev?'':' is-disabled')+'" type="button">'+opts.i18n.previousMonth+'</button>';}
if(c===(instance._o.numberOfMonths-1)){html+='<button class="pika-next'+(next?'':' is-disabled')+'" type="button">'+opts.i18n.nextMonth+'</button>';}
return html+='</div>';},renderTable=function(opts,data,randId)
{return'<table cellpadding="0" cellspacing="0" class="pika-table" role="grid" aria-labelledby="'+randId+'">'+renderHead(opts)+renderBody(data)+'</table>';},Pikaday=function(options)
{var self=this,opts=self.config(options);self._onMouseDown=function(e)
{if(!self._v){return;}
e=e||window.event;var target=e.target||e.srcElement;if(!target){return;}
if(!hasClass(target,'is-disabled')){if(hasClass(target,'pika-button')&&!hasClass(target,'is-empty')&&!hasClass(target.parentNode,'is-disabled')){self.setDate(new Date(target.getAttribute('data-pika-year'),target.getAttribute('data-pika-month'),target.getAttribute('data-pika-day')));if(opts.bound){sto(function(){self.hide();if(opts.blurFieldOnSelect&&opts.field){opts.field.blur();}},100);}}
else if(hasClass(target,'pika-prev')){self.prevMonth();}
else if(hasClass(target,'pika-next')){self.nextMonth();}}
if(!hasClass(target,'pika-select')){if(e.preventDefault){e.preventDefault();}else{e.returnValue=false;return false;}}else{self._c=true;}};self._onChange=function(e)
{e=e||window.event;var target=e.target||e.srcElement;if(!target){return;}
if(hasClass(target,'pika-select-month')){self.gotoMonth(target.value);}
else if(hasClass(target,'pika-select-year')){self.gotoYear(target.value);}};self._onKeyChange=function(e)
{e=e||window.event;if(self.isVisible()){switch(e.keyCode){case 13:case 27:if(opts.field){opts.field.blur();}
break;case 37:e.preventDefault();self.adjustDate('subtract',1);break;case 38:self.adjustDate('subtract',7);break;case 39:self.adjustDate('add',1);break;case 40:self.adjustDate('add',7);break;}}};self._onInputChange=function(e)
{var date;if(e.firedBy===self){return;}
if(opts.parse){date=opts.parse(opts.field.value,opts.format);}else if(hasMoment){date=moment(opts.field.value,opts.format,opts.formatStrict);date=(date&&date.isValid())?date.toDate():null;}
else{date=new Date(Date.parse(opts.field.value));}
if(isDate(date)){self.setDate(date);}
if(!self._v){self.show();}};self._onInputFocus=function()
{self.show();};self._onInputClick=function()
{self.show();};self._onInputBlur=function()
{var pEl=document.activeElement;do{if(hasClass(pEl,'pika-single')){return;}}
while((pEl=pEl.parentNode));if(!self._c){self._b=sto(function(){self.hide();},50);}
self._c=false;};self._onClick=function(e)
{e=e||window.event;var target=e.target||e.srcElement,pEl=target;if(!target){return;}
if(!hasEventListeners&&hasClass(target,'pika-select')){if(!target.onchange){target.setAttribute('onchange','return;');addEvent(target,'change',self._onChange);}}
do{if(hasClass(pEl,'pika-single')||pEl===opts.trigger){return;}}
while((pEl=pEl.parentNode));if(self._v&&target!==opts.trigger&&pEl!==opts.trigger){self.hide();}};self.el=document.createElement('div');self.el.className='pika-single'+(opts.isRTL?' is-rtl':'')+(opts.theme?' '+opts.theme:'');addEvent(self.el,'mousedown',self._onMouseDown,true);addEvent(self.el,'touchend',self._onMouseDown,true);addEvent(self.el,'change',self._onChange);if(opts.keyboardInput){addEvent(document,'keydown',self._onKeyChange);}
if(opts.field){if(opts.container){opts.container.appendChild(self.el);}else if(opts.bound){document.body.appendChild(self.el);}else{opts.field.parentNode.insertBefore(self.el,opts.field.nextSibling);}
addEvent(opts.field,'change',self._onInputChange);if(!opts.defaultDate){if(hasMoment&&opts.field.value){opts.defaultDate=moment(opts.field.value,opts.format).toDate();}else{opts.defaultDate=new Date(Date.parse(opts.field.value));}
opts.setDefaultDate=true;}}
var defDate=opts.defaultDate;if(isDate(defDate)){if(opts.setDefaultDate){self.setDate(defDate,true);}else{self.gotoDate(defDate);}}else{self.gotoDate(new Date());}
if(opts.bound){this.hide();self.el.className+=' is-bound';addEvent(opts.trigger,'click',self._onInputClick);addEvent(opts.trigger,'focus',self._onInputFocus);addEvent(opts.trigger,'blur',self._onInputBlur);}else{this.show();}};Pikaday.prototype={config:function(options)
{if(!this._o){this._o=extend({},defaults,true);}
var opts=extend(this._o,options,true);opts.isRTL=!!opts.isRTL;opts.field=(opts.field&&opts.field.nodeName)?opts.field:null;opts.theme=(typeof opts.theme)==='string'&&opts.theme?opts.theme:null;opts.bound=!!(opts.bound!==undefined?opts.field&&opts.bound:opts.field);opts.trigger=(opts.trigger&&opts.trigger.nodeName)?opts.trigger:opts.field;opts.disableWeekends=!!opts.disableWeekends;opts.disableDayFn=(typeof opts.disableDayFn)==='function'?opts.disableDayFn:null;var nom=parseInt(opts.numberOfMonths,10)||1;opts.numberOfMonths=nom>4?4:nom;if(!isDate(opts.minDate)){opts.minDate=false;}
if(!isDate(opts.maxDate)){opts.maxDate=false;}
if((opts.minDate&&opts.maxDate)&&opts.maxDate<opts.minDate){opts.maxDate=opts.minDate=false;}
if(opts.minDate){this.setMinDate(opts.minDate);}
if(opts.maxDate){this.setMaxDate(opts.maxDate);}
if(isArray(opts.yearRange)){var fallback=new Date().getFullYear()-10;opts.yearRange[0]=parseInt(opts.yearRange[0],10)||fallback;opts.yearRange[1]=parseInt(opts.yearRange[1],10)||fallback;}else{opts.yearRange=Math.abs(parseInt(opts.yearRange,10))||defaults.yearRange;if(opts.yearRange>100){opts.yearRange=100;}}
return opts;},toString:function(format)
{format=format||this._o.format;if(!isDate(this._d)){return'';}
if(this._o.toString){return this._o.toString(this._d,format);}
if(hasMoment){return moment(this._d).format(format);}
return this._d.toDateString();},getMoment:function()
{return hasMoment?moment(this._d):null;},setMoment:function(date,preventOnSelect)
{if(hasMoment&&moment.isMoment(date)){this.setDate(date.toDate(),preventOnSelect);}},getDate:function()
{return isDate(this._d)?new Date(this._d.getTime()):null;},setDate:function(date,preventOnSelect)
{if(!date){this._d=null;if(this._o.field){this._o.field.value='';fireEvent(this._o.field,'change',{firedBy:this});}
return this.draw();}
if(typeof date==='string'){date=new Date(Date.parse(date));}
if(!isDate(date)){return;}
var min=this._o.minDate,max=this._o.maxDate;if(isDate(min)&&date<min){date=min;}else if(isDate(max)&&date>max){date=max;}
this._d=new Date(date.getTime());setToStartOfDay(this._d);this.gotoDate(this._d);if(this._o.field){this._o.field.value=this.toString();fireEvent(this._o.field,'change',{firedBy:this});}
if(!preventOnSelect&&typeof this._o.onSelect==='function'){this._o.onSelect.call(this,this.getDate());}},gotoDate:function(date)
{var newCalendar=true;if(!isDate(date)){return;}
if(this.calendars){var firstVisibleDate=new Date(this.calendars[0].year,this.calendars[0].month,1),lastVisibleDate=new Date(this.calendars[this.calendars.length-1].year,this.calendars[this.calendars.length-1].month,1),visibleDate=date.getTime();lastVisibleDate.setMonth(lastVisibleDate.getMonth()+1);lastVisibleDate.setDate(lastVisibleDate.getDate()-1);newCalendar=(visibleDate<firstVisibleDate.getTime()||lastVisibleDate.getTime()<visibleDate);}
if(newCalendar){this.calendars=[{month:date.getMonth(),year:date.getFullYear()}];if(this._o.mainCalendar==='right'){this.calendars[0].month+=1-this._o.numberOfMonths;}}
this.adjustCalendars();},adjustDate:function(sign,days){var day=this.getDate()||new Date();var difference=parseInt(days)*24*60*60*1000;var newDay;if(sign==='add'){newDay=new Date(day.valueOf()+difference);}else if(sign==='subtract'){newDay=new Date(day.valueOf()-difference);}
this.setDate(newDay);},adjustCalendars:function(){this.calendars[0]=adjustCalendar(this.calendars[0]);for(var c=1;c<this._o.numberOfMonths;c++){this.calendars[c]=adjustCalendar({month:this.calendars[0].month+c,year:this.calendars[0].year});}
this.draw();},gotoToday:function()
{this.gotoDate(new Date());},gotoMonth:function(month)
{if(!isNaN(month)){this.calendars[0].month=parseInt(month,10);this.adjustCalendars();}},nextMonth:function()
{this.calendars[0].month++;this.adjustCalendars();},prevMonth:function()
{this.calendars[0].month--;this.adjustCalendars();},gotoYear:function(year)
{if(!isNaN(year)){this.calendars[0].year=parseInt(year,10);this.adjustCalendars();}},setMinDate:function(value)
{if(value instanceof Date){setToStartOfDay(value);this._o.minDate=value;this._o.minYear=value.getFullYear();this._o.minMonth=value.getMonth();}else{this._o.minDate=defaults.minDate;this._o.minYear=defaults.minYear;this._o.minMonth=defaults.minMonth;this._o.startRange=defaults.startRange;}
this.draw();},setMaxDate:function(value)
{if(value instanceof Date){setToStartOfDay(value);this._o.maxDate=value;this._o.maxYear=value.getFullYear();this._o.maxMonth=value.getMonth();}else{this._o.maxDate=defaults.maxDate;this._o.maxYear=defaults.maxYear;this._o.maxMonth=defaults.maxMonth;this._o.endRange=defaults.endRange;}
this.draw();},setStartRange:function(value)
{this._o.startRange=value;},setEndRange:function(value)
{this._o.endRange=value;},draw:function(force)
{if(!this._v&&!force){return;}
var opts=this._o,minYear=opts.minYear,maxYear=opts.maxYear,minMonth=opts.minMonth,maxMonth=opts.maxMonth,html='',randId;if(this._y<=minYear){this._y=minYear;if(!isNaN(minMonth)&&this._m<minMonth){this._m=minMonth;}}
if(this._y>=maxYear){this._y=maxYear;if(!isNaN(maxMonth)&&this._m>maxMonth){this._m=maxMonth;}}
randId='pika-title-'+Math.random().toString(36).replace(/[^a-z]+/g,'').substr(0,2);for(var c=0;c<opts.numberOfMonths;c++){html+='<div class="pika-lendar">'+renderTitle(this,c,this.calendars[c].year,this.calendars[c].month,this.calendars[0].year,randId)+this.render(this.calendars[c].year,this.calendars[c].month,randId)+'</div>';}
this.el.innerHTML=html;if(opts.bound){if(opts.field.type!=='hidden'){sto(function(){opts.trigger.focus();},1);}}
if(typeof this._o.onDraw==='function'){this._o.onDraw(this);}
if(opts.bound){opts.field.setAttribute('aria-label',opts.ariaLabel);}},adjustPosition:function()
{var field,pEl,width,height,viewportWidth,viewportHeight,scrollTop,left,top,clientRect,leftAligned,bottomAligned;if(this._o.container)return;this.el.style.position='absolute';field=this._o.trigger;pEl=field;width=this.el.offsetWidth;height=this.el.offsetHeight;viewportWidth=window.innerWidth||document.documentElement.clientWidth;viewportHeight=window.innerHeight||document.documentElement.clientHeight;scrollTop=window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop;leftAligned=true;bottomAligned=true;if(typeof field.getBoundingClientRect==='function'){clientRect=field.getBoundingClientRect();left=clientRect.left+window.pageXOffset;top=clientRect.bottom+window.pageYOffset;}else{left=pEl.offsetLeft;top=pEl.offsetTop+pEl.offsetHeight;while((pEl=pEl.offsetParent)){left+=pEl.offsetLeft;top+=pEl.offsetTop;}}
if((this._o.reposition&&left+width>viewportWidth)||(this._o.position.indexOf('right')>-1&&left-width+field.offsetWidth>0)){left=left-width+field.offsetWidth;leftAligned=false;}
if((this._o.reposition&&top+height>viewportHeight+scrollTop)||(this._o.position.indexOf('top')>-1&&top-height-field.offsetHeight>0)){top=top-height-field.offsetHeight;bottomAligned=false;}
this.el.style.left=left+'px';this.el.style.top=top+'px';addClass(this.el,leftAligned?'left-aligned':'right-aligned');addClass(this.el,bottomAligned?'bottom-aligned':'top-aligned');removeClass(this.el,!leftAligned?'left-aligned':'right-aligned');removeClass(this.el,!bottomAligned?'bottom-aligned':'top-aligned');},render:function(year,month,randId)
{var opts=this._o,now=new Date(),days=getDaysInMonth(year,month),before=new Date(year,month,1).getDay(),data=[],row=[];setToStartOfDay(now);if(opts.firstDay>0){before-=opts.firstDay;if(before<0){before+=7;}}
var previousMonth=month===0?11:month-1,nextMonth=month===11?0:month+1,yearOfPreviousMonth=month===0?year-1:year,yearOfNextMonth=month===11?year+1:year,daysInPreviousMonth=getDaysInMonth(yearOfPreviousMonth,previousMonth);var cells=days+before,after=cells;while(after>7){after-=7;}
cells+=7-after;var isWeekSelected=false;for(var i=0,r=0;i<cells;i++)
{var day=new Date(year,month,1+(i-before)),isSelected=isDate(this._d)?compareDates(day,this._d):false,isToday=compareDates(day,now),hasEvent=opts.events.indexOf(day.toDateString())!==-1?true:false,isEmpty=i<before||i>=(days+before),dayNumber=1+(i-before),monthNumber=month,yearNumber=year,isStartRange=opts.startRange&&compareDates(opts.startRange,day),isEndRange=opts.endRange&&compareDates(opts.endRange,day),isInRange=opts.startRange&&opts.endRange&&opts.startRange<day&&day<opts.endRange,isDisabled=(opts.minDate&&day<opts.minDate)||(opts.maxDate&&day>opts.maxDate)||(opts.disableWeekends&&isWeekend(day))||(opts.disableDayFn&&opts.disableDayFn(day));if(isEmpty){if(i<before){dayNumber=daysInPreviousMonth+dayNumber;monthNumber=previousMonth;yearNumber=yearOfPreviousMonth;}else{dayNumber=dayNumber-days;monthNumber=nextMonth;yearNumber=yearOfNextMonth;}}
var dayConfig={day:dayNumber,month:monthNumber,year:yearNumber,hasEvent:hasEvent,isSelected:isSelected,isToday:isToday,isDisabled:isDisabled,isEmpty:isEmpty,isStartRange:isStartRange,isEndRange:isEndRange,isInRange:isInRange,showDaysInNextAndPreviousMonths:opts.showDaysInNextAndPreviousMonths,enableSelectionDaysInNextAndPreviousMonths:opts.enableSelectionDaysInNextAndPreviousMonths};if(opts.pickWholeWeek&&isSelected){isWeekSelected=true;}
row.push(renderDay(dayConfig));if(++r===7){if(opts.showWeekNumber){row.unshift(renderWeek(i-before,month,year));}
data.push(renderRow(row,opts.isRTL,opts.pickWholeWeek,isWeekSelected));row=[];r=0;isWeekSelected=false;}}
return renderTable(opts,data,randId);},isVisible:function()
{return this._v;},show:function()
{if(!this.isVisible()){this._v=true;this.draw();removeClass(this.el,'is-hidden');if(this._o.bound){addEvent(document,'click',this._onClick);this.adjustPosition();}
if(typeof this._o.onOpen==='function'){this._o.onOpen.call(this);}}},hide:function()
{var v=this._v;if(v!==false){if(this._o.bound){removeEvent(document,'click',this._onClick);}
this.el.style.position='static';this.el.style.left='auto';this.el.style.top='auto';addClass(this.el,'is-hidden');this._v=false;if(v!==undefined&&typeof this._o.onClose==='function'){this._o.onClose.call(this);}}},destroy:function()
{var opts=this._o;this.hide();removeEvent(this.el,'mousedown',this._onMouseDown,true);removeEvent(this.el,'touchend',this._onMouseDown,true);removeEvent(this.el,'change',this._onChange);if(opts.keyboardInput){removeEvent(document,'keydown',this._onKeyChange);}
if(opts.field){removeEvent(opts.field,'change',this._onInputChange);if(opts.bound){removeEvent(opts.trigger,'click',this._onInputClick);removeEvent(opts.trigger,'focus',this._onInputFocus);removeEvent(opts.trigger,'blur',this._onInputBlur);}}
if(this.el.parentNode){this.el.parentNode.removeChild(this.el);}}};return Pikaday;}));

// ################################################################
// ################################################################
// Constant ------------------------------------------

var IS_TESTING_WZS = location.pathname.indexOf("ca-gen/test.html") >=0 ;

// ################################################################
// ################################################################
// Calendar ------------------------------------------

function initCustomCalendar(){

	// amira's
	if(location.pathname.indexOf("w3850102.jsp") >= 0 || IS_TESTING_WZS){
		addCalendar("t1_ef_tarikh_permohonan");
		addCalendar("t1_ef_tarikh_perintah");
	}	
	
	// jubli's
	if(location.pathname.indexOf("w3820501.jsp") >= 0 || IS_TESTING_WZS){
		addCalendar("tab1_ef_tarikh_permohonan");
		addCalendar("tab1_ef_tarikh_perintah");
	}

	function addCalendar(elemId){
		var INTERVAL_TIME = 500;
		var interval = setInterval(function () {
			try {
				var el = document.getElementById(elemId);
		
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
			var a = `{"login_time":1526865746,"authenticated":true,"user":{"BRANCH_CODE":"16011019","PC_ID":"031","OPER_ID":"MOON"}}`;
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
		if(pathname.indexOf("w3850102.jsp") >= 0 || IS_TESTING_WZS){
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