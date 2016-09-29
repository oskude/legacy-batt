var ruleTable = document.getElementById("ruleTable");

function onRequestRuleChange (evt)
{
	chrome.runtime.sendMessage({
		"type": "setRequestRule",
		"data": {
			"requestListIndex": evt.target.dataset.requestListIndex,
			"url": evt.target.dataset.url,
			"allowRequest": evt.target.checked
		}
	});
}

function createRuleRow (rule, index)
{
	var row = ruleTable.insertRow();
	var cbox = document.createElement("input");
	var match = rule.url.match(/(^.+):\/\/([^\/]+)(.*)/);
	var protocol = match[1];
	var host = match[2];
	var path = match[3];

	cbox.type = "checkbox";
	cbox.checked = rule.allowRequest;
	cbox.dataset.url = rule.url;
	cbox.dataset.requestListIndex = index;
	cbox.onchange = onRequestRuleChange;

	var cell = row.insertCell();
	cell.classList.add("textCell");
	cell.appendChild(document.createTextNode(index));

	var cell = row.insertCell();
	cell.classList.add("textCell");
	cell.appendChild(document.createTextNode(protocol));

	var cell = row.insertCell();
	cell.classList.add("textCell");
	cell.appendChild(document.createTextNode(host));

	var cell = row.insertCell();
	cell.classList.add("textCell");
	cell.classList.add("urlPath");
	cell.appendChild(document.createTextNode(path));

	var cell = row.insertCell();
	cell.classList.add("textCell");
	cell.appendChild(document.createTextNode(rule.type));

	var cell = row.insertCell();
	cell.appendChild(cbox);
}

chrome.storage.local.get("myRequests", (item)=>{
	for (var i in item.myRequests) {
		var req = item.myRequests[i];
		createRuleRow(req, i);
	}

	var thead = ruleTable.createTHead();
	var trow = thead.insertRow();

	var cell = trow.insertCell();
	cell.appendChild(document.createTextNode("O"));
	cell.title = "Order";

	var cell = trow.insertCell();
	cell.appendChild(document.createTextNode("Proto"));
	cell.title = "Protocol";

	var cell = trow.insertCell();
	cell.appendChild(document.createTextNode("Host"));
	cell.title = "Host";

	var cell = trow.insertCell();
	cell.appendChild(document.createTextNode("Path"));
	cell.title = "Path";

	var cell = trow.insertCell();
	cell.appendChild(document.createTextNode("Type"));
	cell.title = "Type";

	var cell = trow.insertCell();
	cell.appendChild(document.createTextNode("D"));
	cell.title = "Download";
});
