// ==UserScript==
// @name         More readable PPM
// @namespace    https://itg.crifnet.com/itg/tm/EditTimeSheet.do?timesheetId=*
// @homepage     https://github.com/DamianZyngier/FixPPM/
// @homepageURL  https://github.com/DamianZyngier/FixPPM/
// @updateURL    https://raw.githubusercontent.com/DamianZyngier/FixPPM/master/fixppm.js
// @downloadURL  https://raw.githubusercontent.com/DamianZyngier/FixPPM/master/fixppm.js
// @version      1.6
// @description  Finally, I see where to report!
// @author       Damian Zyngier
// @match        https://itg.crifnet.com/itg/tm/EditTimeSheet.do?timesheetId=*
// @grant        GM_addStyle
// ==/UserScript==

(function() {

	"use strict";

	var maxValue = 8;

	var bgColorSaturday = "#ff9999"
	var textColorSaturday = "black"
	var bgColorSunday = "#ff6666"
	var textColorSunday = "black"
	var bgColorWarning = "#f9f966"
	var bgColorDefault = "white"
	var bgColorCorrect = "#98bf69"

	GM_addStyle("#wiTable_leftDataDiv, #wiTable_middleDataDiv, #wiTable_rightDataDiv { height: 100% !important; }" +
				 ".sticky { position: fixed !important; top: 0 !important; z-index: 300 !important; }" +
				 "td { border-radius: 10px; text-align: center !important; padding: 1px !important; margin: 10px !important; }" +
				 "input { border-radius: 2px; border: 1px solid black !important; }" +
				 "#table4 .tab-list-data-R { border: 1px solid lightgrey !important; }" +
				 "#table1 td { color: black; }" +
				 "#wiTable_rightHeaderDiv, #wiTable_rightTotalDiv { width: 102px !important; }" +
				 ".h_border_onlyRow_middle, .h_border_onlyRow_last, .noTopBorder, .resultH, .resultMD { color: black !important; font-weight: bold; font-size: 12px; }" +
				 ".result0 { font-weight: normal; color: lightgrey !important; }" +
				 ".subgroupings-right, .subgroupings-left { color: black !important; background-color: #d0d1ff !important; }");

	function createButton(context, func, value) {
		var button = document.createElement("input");
		button.type = "button";
		button.value = value;
		button.onclick = func;
		button.style.padding = "5px";
		button.style.marginLeft = "10px";
		button.style.fontSize = "15px";
		button.style.verticalAlign = "middle";

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
		checkbox.style.verticalAlign = "middle";
		checkbox.style.zoom = "1.5";

		var label = document.createElement("label");
		label.innerHTML = labelValue;
		label.style.verticalAlign = "middle";
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
		for (var i = 0; i < allInputs.length; i++) {
			if(typeof allInputs[i] == "undefined") {
				continue;
			}

			if (allInputs[i].value == "0,00") {
				allInputs[i].value = "";
			}
		}
	}

	function validateAllFields() {
		var value,
			inputsTable = document.querySelector("#table4"),
			inputNodes = inputsTable.querySelectorAll("input");
		for (var i = 0; i < inputNodes.length; i++) {
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
		calculateMdCell();
	}

	function validateAndColorInput(object) {
		var nodeValue = parseFloat(object.value.replace(",","."));

		if (!isNaN(nodeValue) && (object.value.length > 4 || nodeValue % 0.5 != 0 || nodeValue > maxValue )) {
			object.parentNode.style.backgroundColor = bgColorWarning;
		} else if (nodeValue == maxValue) {
			object.parentNode.style.backgroundColor = bgColorCorrect;
		} else if (!isNaN(nodeValue) && nodeValue != 0) {
			object.parentNode.style.backgroundColor = bgColorDefault;
		} else {
			colorDefaultInput(object.parentNode);
		}
	}

	function validateResults() {
		var nodeValue,
			resultTable = document.querySelector('#table7'),
			resultNodes = resultTable.querySelectorAll("span");
		for (var i = 0; i < resultNodes.length; i++) {
			if(typeof resultNodes[i] == "undefined") {
				continue;
			}

			nodeValue = parseFloat(resultNodes[i].innerHTML.replace(",","."));
			if (nodeValue == maxValue) {
				resultNodes[i].parentNode.style.backgroundColor = bgColorCorrect;
			} else if (nodeValue > 9999 || nodeValue > maxValue || nodeValue % 0.5 != 0) {
				resultNodes[i].parentNode.style.backgroundColor = bgColorWarning;
			} else if (nodeValue != 0) {
				resultNodes[i].parentNode.style.backgroundColor = bgColorDefault;
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
		var tdSelectors,
			mainTable = document.querySelector(tableId),
			trSelectors = mainTable.querySelectorAll('tr');

		for (var i = 0; i < trSelectors.length; i++) {
			if(typeof trSelectors[i] == "undefined") {
				continue;
			}
			tdSelectors = trSelectors[i].querySelectorAll('td');

			for (var j = 0; j < tdSelectors.length; j++) {
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

		for (var i = 0; i < inputNodes.length; i++) {
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

	function saveEvent() {
		var inputsTable = document.querySelector("#table4"),
			inputNodes = inputsTable.querySelectorAll("input");
		for (var i = 0; i < inputNodes.length; i++) {
			if(typeof inputNodes[i] == "undefined" || inputNodes[i].type == "hidden") {
				continue;
			}

			if (inputNodes[i].value == "") {
				inputNodes[i].value = "0,00";
			}
		}
	}

	function scrollHeader() {
		if (window.pageYOffset > stickyHeader) {
			document.getElementById("wiTable_leftHeaderDiv").classList.add("sticky");
			document.getElementById("wiTable_middleHeaderDiv").classList.add("sticky");
			document.getElementById("wiTable_rightHeaderDiv").classList.add("sticky");
			document.getElementById("wiTable_leftDataDiv").style.marginTop = document.getElementById('wiTable_middleHeaderDiv').offsetHeight;
			document.getElementById("wiTable_middleDataDiv").style.marginTop = document.getElementById('wiTable_middleHeaderDiv').offsetHeight;
			document.getElementById("wiTable_rightDataDiv").style.marginTop = document.getElementById('wiTable_middleHeaderDiv').offsetHeight;
		} else {
			document.getElementById("wiTable_leftHeaderDiv").classList.remove("sticky");
			document.getElementById("wiTable_middleHeaderDiv").classList.remove("sticky");
			document.getElementById("wiTable_rightHeaderDiv").classList.remove("sticky");
			document.getElementById("wiTable_leftDataDiv").style.marginTop = 0;
			document.getElementById("wiTable_middleDataDiv").style.marginTop = 0;
			document.getElementById("wiTable_rightDataDiv").style.marginTop = 0;
		}
	}

	function addMdCell(tableId) {
		var tdSelector, cell, spanH, spanMD,
			table = document.querySelector(tableId),
			trSelectors = table.querySelectorAll('tr');


		for (var i = 0; i < trSelectors.length; i++) {
			if(typeof trSelectors[i] == "undefined" || trSelectors[i].getElementsByClassName("subgroupings-left").length != 0 || trSelectors[i].getElementsByTagName("tr").length == 0) {
				continue;
			}

			tdSelector = trSelectors[i].firstChild;

			if(typeof tdSelector == "undefined") {
				continue;
			}
			rowsTotal++;
			tdSelector.colSpan = 1;

			spanH = tdSelector.getElementsByTagName("span")[0];
			spanH.classList.add("resultH", "resultH" + rowsTotal);

			cell = trSelectors[i].insertCell(1);
			cell.colSpan = 1;
			cell.appendChild(createTable());
			cell.classList.add("h_border_onlyColumn_last", "ellipsisCell");

			spanMD = cell.getElementsByTagName("span")[0]
			spanMD.classList.add("resultMD", "resultMD" + rowsTotal);
		}
	}

	function createTable() {
			var table = document.createElement('table'),
				tbody = document.createElement('tbody'),
				span = document.createElement('span'),
				cell, row;
			table.width = "100%";
			table.appendChild(tbody);

            row = table.insertRow(0);
            cell = row.insertCell(0);
            span = cell.appendChild(span);
			return table;
	}

	function calculateMdCell() {
		var cellH = document.getElementsByClassName("resultH"),
			cellMD = document.getElementsByClassName("resultMD"),
			cellHValue;

		for (var i = 0; i < rowsTotal; i++) {
			if (cellH[i].innerHTML == "0,00") {
				cellH[i].classList.add("result0");
				cellMD[i].classList.add("result0");
			} else {
				cellH[i].classList.remove("result0");
				cellMD[i].classList.remove("result0");
			}

			cellHValue = parseFloat(cellH[i].innerHTML.replace(",","."));
			cellMD[i].innerHTML = Math.floor(cellHValue / 8) + "d " + cellHValue % 8 + "h";
		}

	}

	var x = document.getElementById("table1");

	var saturdays = [];
	var sundays = [];
	var rowsTotal = 0;

	colorHeaderRow();

	createButton(document.body, clearZeros, "Clear all 0,00");
	createButton(document.body, validateAllFields, "Validate");
	createCheckbox(document.body, checkTheBox, "Auto clear & validate");

	document.getElementById("wiTable_rightDataDiv").classList.remove("verticalScrollDiv");

	clearZeros();
	colorAllTdsInTable("#table4");
	colorAllTdsInTable("#table7");
	addMdCell("#table5");
	addMdCell("#table8");

	document.getElementById("save_top").addEventListener("mousedown", saveEvent);
	document.getElementById("release_top").addEventListener("mousedown", saveEvent);

	if (document.getElementById("fixPpmAuto").checked) {
		validateAllFields();
		calculateMdCell();
	}

	window.onscroll = function() {scrollHeader()};
	var header = document.getElementById("myHeader");

	var stickyHeader = document.getElementById("wiTable_middleHeaderDiv").offsetTop + document.getElementById("headerMenu").offsetHeight + 15;
})();