// ==UserScript==
// @name         More readable PPM
// @namespace    https://itg.crifnet.com/itg/tm/EditTimeSheet.do?timesheetId=*
// @homepage     https://github.com/DamianZyngier/FixPPM/
// @homepageURL  https://github.com/DamianZyngier/FixPPM/
// @updateURL    https://raw.githubusercontent.com/DamianZyngier/FixPPM/master/fixppm.js
// @downloadURL  https://raw.githubusercontent.com/DamianZyngier/FixPPM/master/fixppm.js
// @version      1.3
// @description  Finally, I see where to report!
// @author       Damian Zyngier
// @match        https://itg.crifnet.com/itg/tm/EditTimeSheet.do?timesheetId=*
// ==/UserScript==

(function() {
    'use strict';

	var maxValue = 8;
	var maxValueString = "8,00";
	
	var bgColorSaturday = "grey"
	var textColorSaturday = "white"
	var bgColorSunday = "black"
	var textColorSunday = "white"
	var bgColorWarning = "orange"
	var bgColorDefault = "white"
	var bgColorCorrect = "lightgreen"
	
	function createButton(context, func, value) {
		var button = document.createElement("input");
		button.type = "button";
		button.value = value;
		button.onclick = func;
		button.style.padding = "5px";
		button.style.marginLeft = "10px";
		button.style.fontSize = "15px";
		button.style.verticalAlign  = "middle";
		
		context.appendChild(button);
	}

	function createCheckbox(context, func, labelValue) {
		var checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.onclick = func;
		checkbox.id = "fixPpmAuto";
		checkbox.style.padding = "5px";
		checkbox.style.marginLeft = "10px";
		checkbox.style.fontSize = "15px";
		checkbox.style.verticalAlign  = "middle";
		checkbox.style.zoom  = "1.5";
		
		var label = document.createElement("label");
		label.innerHTML = labelValue;
		label.style.verticalAlign  = "middle";
		label.style.padding = "2px";
		label.style.fontSize = "15px";
		
		context.appendChild(checkbox);
		context.appendChild(label);
		
		if (localStorage.getItem("isFixPpmAutoChecked") == "true") {
			checkbox.click();
		}
	}

	function clearZeros() {
		var allInputs = document.getElementsByTagName("input");
		for (i = 0; i < allInputs.length; i++) {
			if(typeof allInputs[i] == "undefined") {
				continue;
			}

			if (allInputs[i].value == "0,00") {
				allInputs[i].value = "";
			}
		}
	}
	
	function validateAllFields() {
		var value;
		var inputsTable = document.querySelector("#table4");
		var inputNodes = inputsTable.querySelectorAll("input");
		for (i = 0; i < inputNodes.length; i++) {
			if(typeof inputNodes[i] == "undefined" || inputNodes[i].type == "hidden") {
				continue;
			}
			
			validateAndColorInput(inputNodes[i]);
		}
		
		validateResults();
	}
	
	function validateInputEvent() {
		if (this.value == "0,00") {
			this.value = "";
			colorDefaultInput(this.parentNode);
		} else {
			validateAndColorInput(this);
		}
		validateResults();
	}
	
	function validateAndColorInput(object) {
			console.log(object.value);
		
		var nodeValue = parseFloat(object.value.replace(",","."));
		
		if (!isNaN(nodeValue) && (object.value.length > 4 || nodeValue % 0.5 != 0 || nodeValue > maxValue )) {
			object.parentNode.style.backgroundColor = bgColorWarning;
		} else {
			colorDefaultInput(object.parentNode);
		}
	}
	
	function validateResults() {
		var nodeValue;
		var resultTable = document.querySelector('#table7');
		var resultNodes = resultTable.querySelectorAll("span");
		for (i = 0; i < resultNodes.length; i++) {
			if(typeof resultNodes[i] == "undefined") {
				continue;
			}
			nodeValue = resultNodes[i].innerHTML;
			if (nodeValue == maxValueString) {
				resultNodes[i].parentNode.style.backgroundColor = bgColorCorrect;
			} else if (nodeValue.length > 10 || parseFloat(nodeValue.replace(",",".")) > maxValue || parseFloat(nodeValue.replace(",",".")) % 0.5 != 0) {
				resultNodes[i].parentNode.style.backgroundColor = bgColorWarning;
			} else {
				colorDefaultInput(resultNodes[i].parentNode);
			}
		}
	}
	
	function colorDefaultInput(object) {
		if (object.classList.contains("sat")) {
			object.style.backgroundColor = bgColorSaturday;
		} else if (object.classList.contains("sun")) {
			object.style.backgroundColor = bgColorSunday;
		} else {
			object.style.backgroundColor = bgColorDefault;
		}
	}
	
	
	function colorAllTdsInTable(tableId) {
		var mainTable = document.querySelector(tableId);
		var trSelectors = mainTable.querySelectorAll('tr');
		var tdSelectors, i, j;
		for (i = 0; i < trSelectors.length; i++) {
			if(typeof trSelectors[i] == "undefined") {
				continue;
			}
			tdSelectors = trSelectors[i].querySelectorAll('td');
			
			for (j = 0; j < tdSelectors.length; j++) {	
				if(typeof tdSelectors[j] == "undefined" || tdSelectors.length < 3) {
					continue;
				}
				
				if (saturdays.includes(j)) {
					tdSelectors[j].style.backgroundColor = bgColorSaturday;
					tdSelectors[j].style.color = textColorSaturday;
					tdSelectors[j].classList.add("sat");
				}
				
				if (sundays.includes(j)) {
					tdSelectors[j].style.backgroundColor = bgColorSunday;
					tdSelectors[j].style.color = textColorSunday;
					tdSelectors[j].classList.add("sun");
				}
			}
		}
	}
	
	function checkTheBox () {
		clearZeros();
		validateAllFields();
		
		var isChecked = document.getElementById("fixPpmAuto").checked;
		localStorage.setItem("isFixPpmAutoChecked", isChecked);
		
		var inputsTable = document.querySelector('#table4');
		var inputNodes = inputsTable.querySelectorAll("input");
		for (i = 0; i < inputNodes.length; i++) {
			if(typeof inputNodes[i] == "undefined" || inputNodes[i].type == "hidden") {
				continue;
			}
			if (isChecked) {
				inputNodes[i].addEventListener("change", validateInputEvent);
			} else {	
				inputNodes[i].removeEventListener("change", validateInputEvent);
			}
		}
	}
	
	function colorHeaderRow() {	
		var headerTable = document.querySelector('#table1');
		var headerNodes = headerTable.querySelectorAll('.ellipsisCell');
		
		for (var i = 0; i < headerNodes.length; i++) {	
			if(typeof headerNodes[i] == "undefined") {
				continue;
			}
			
			if (headerNodes[i].innerHTML.includes("So<br>")) {
				headerNodes[i].style.backgroundColor = bgColorSaturday;
				headerNodes[i].style.color = textColorSaturday;
				saturdays[saturdays.length] = i;
			}
			
			if (headerNodes[i].innerHTML.includes("N<br>")) {
				headerNodes[i].style.backgroundColor = bgColorSunday;
				headerNodes[i].style.color = textColorSunday;
				sundays[sundays.length] = i;
			}
		}
	}
	
	var x = document.getElementById("table1");
	
	var saturdays = [];
	var sundays = [];
	
	colorHeaderRow();
	
	createButton(document.body, clearZeros, "Clear all 0,00");
	createButton(document.body, validateAllFields, "Validate");
	createCheckbox(document.body, checkTheBox, "Auto clear & validate");

	clearZeros();

	colorAllTdsInTable("#table4");
	colorAllTdsInTable("#table7");
})();
