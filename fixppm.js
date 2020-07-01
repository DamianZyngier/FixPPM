// ==UserScript==
// @name         More readable PPM
// @namespace    https://itg.crifnet.com/itg/tm/EditTimeSheet.do?timesheetId=*
// @homepage https://github.com/DamianZyngier/FixPPM/
// @homepageURL https://github.com/DamianZyngier/FixPPM/
// @updateURL https://github.com/DamianZyngier/FixPPM/blob/master/fixppm.js
// @downloadURL https://github.com/DamianZyngier/FixPPM/blob/master/fixppm.js
// @version      1.2
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

    function createButton(context, func, value) {
        var button = document.createElement("input");
        button.type = "button";
        button.value = value;
        button.onclick = func;
        button.style.padding = "5px";
        button.style.marginLeft = "10px";
        button.style.fontSize = "15px";

        context.appendChild(button);
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
	
	function validate() {
		colorTdsInTable('#table7');
		var resultTable = document.querySelector('#table7');
		var resultNodes = resultTable.querySelectorAll("span");
		for (i = 0; i < resultNodes.length; i++) {
			if(typeof resultNodes[i] == "undefined" || resultNodes[i].parentNode.style.backgroundColor == bgColorSaturday || resultNodes[i].parentNode.style.backgroundColor == bgColorSunday) {
				continue;
			}
			
			if (resultNodes[i].innerHTML == maxValueString) {
				resultNodes[i].parentNode.style.backgroundColor = "lightgreen";
			} else if (parseFloat(resultNodes[i].innerHTML.replace(",",".")) > maxValue || parseFloat(resultNodes[i].innerHTML.replace(",",".")) % 0.5 != 0) {
				resultNodes[i].parentNode.style.backgroundColor = bgColorWarning;
			} else {
				resultNodes[i].parentNode.style.backgroundColor = bgColorDefault;
			}
		}
		
		var value;
		var inputsTable = document.querySelector('#table4');
		var inputNodes = inputsTable.querySelectorAll("input");
		for (i = 0; i < inputNodes.length; i++) {
			if(typeof inputNodes[i] == "undefined" || inputNodes[i].type == "hidden" || inputNodes[i].parentNode.style.backgroundColor == bgColorSaturday || inputNodes[i].parentNode.style.backgroundColor == bgColorSunday) {
				continue;
			}
			
			value = parseFloat(inputNodes[i].value.replace(",","."));
			if (!isNaN(value) && (value % 0.5 != 0 || value > maxValue)) {
				console.log(inputNodes[i].value);
				inputNodes[i].parentNode.style.backgroundColor = bgColorWarning
			} else {
				inputNodes[i].parentNode.style.backgroundColor = bgColorDefault;
			}
		}
		
	}
	
	function colorTdsInTable(tableId) {	
		var mainTable = document.querySelector(tableId);
		var trSelectors = mainTable.querySelectorAll('tr');
		var tdSelectors, j;
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
				}
				
				if (sundays.includes(j)) {
					tdSelectors[j].style.backgroundColor = bgColorSunday;
					tdSelectors[j].style.color = textColorSunday;
				}
			}
		}
	}
	
    createButton(document.body, clearZeros, "Clear all 0,00");
    createButton(document.body, validate, "Validate");
		
	clearZeros();

	var i;
	var x = document.getElementById("table1");
	
	var headerTable = document.querySelector('#table1');
	var headerNodes = headerTable.querySelectorAll('.ellipsisCell');
	
	var saturdays = [];
	var sundays = [];
	
	for (i = 0; i < headerNodes.length; i++) {	
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
	
	colorTdsInTable('#table4');
	colorTdsInTable('#table7');
})();
