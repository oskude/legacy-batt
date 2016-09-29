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
	var url = new URL(rule.url);

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
	cell.appendChild(document.createTextNode(url.protocol));

	var cell = row.insertCell();
	cell.classList.add("textCell");
	cell.appendChild(document.createTextNode(url.host));

	var cell = row.insertCell();
	var node = document.createElement("span");
	node.appendChild(document.createTextNode(url.pathname));
	cell.appendChild(node);
	if (url.search) {
		var node = document.createElement("span");
		node.appendChild(document.createTextNode(url.search));
		node.classList.add("queryString");
		cell.appendChild(node);
	}
	cell.classList.add("textCell");
	cell.classList.add("urlPath");

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
