var BattRuleUi = function (parent, api)
{
	this.api = api;
	this.rowData = [];
	this.table = document.createElement("table");
	this.table.cellPadding = 0;
	this.table.cellSpacing = 0;
	parent.appendChild(this.table);
}

BattRuleUi.prototype.render = function (tabId)
{
	var requests = this.api.battRequests[tabId];
	var host = this.api.battTabs[tabId];

	for (var i in requests) {
		var request = requests[i];
		var row = this.api.getRule(host, request.url);
		row.host = host;
		row.type = request.type;
		row.url = request.url;
		this.rowData.push(row);
		this._renderRow(i, row);
	}

	this._renderHead();
}

BattRuleUi.prototype._renderHead = function ()
{
	var thead = this.table.createTHead();
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
}

BattRuleUi.prototype._renderRow = function (index, data)
{
	var url = new URL(data.url);
	var row = this.table.insertRow();

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
	cell.appendChild(document.createTextNode(data.type));

	var cell = row.insertCell();
	var sel = document.createElement("select");
	sel.dataset.rowDataIndex = index;
	sel.title = "never";
	var opt = document.createElement("option");
	opt.value = 0;
	opt.text = "○";
	opt.title = "never"; // TODO: doesnt really work?
	sel.add(opt);
	var opt = document.createElement("option");
	opt.value = 1;
	opt.text = "◍";
	opt.title = "temporary";
	if (data.allowTemporary) {
		opt.selected = true;
		sel.title = "temporary"
	}
	sel.add(opt);
	var opt = document.createElement("option");
	opt.value = 2;
	opt.text = "●";
	opt.title = "always";
	if (data.allowAllways) {
		opt.selected = true;
		sel.title = "always";
	}
	sel.add(opt);
	sel.onchange = this._onRequestRuleChange.bind(this);
	cell.appendChild(sel);
}

BattRuleUi.prototype._onRequestRuleChange = function (evt)
{
	var i = evt.target.dataset.rowDataIndex;
	var x = evt.target.selectedIndex;
	evt.target.title = evt.target.options[x].title;
	this.api.setRule(
		this.rowData[i].host,
		this.rowData[i].url,
		evt.target.selectedIndex
	);
}

chrome.tabs.query(
	{
		active: true,
		currentWindow: true
	},
	(tabs)=>{
		var ui = new BattRuleUi(
			document.body,
			chrome.extension.getBackgroundPage()
		);
		ui.render(tabs[0].id);
	}
);
