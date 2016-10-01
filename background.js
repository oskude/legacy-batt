var battTabs = {}
var battRules = {};
var battRequests = {};

function getRule (host, url)
{
	var rule = {
		allowAllways: false,
		allowTemporary: false
	}

	if (battRules[host] && battRules[host][url]) {
		rule.allowAllways = battRules[host][url].allowAllways;
		rule.allowTemporary = true;
	}

	return rule;
}

function setRule (host, url, x)
{
	switch (x) {
		case 1: // temporary
			_createRule(host, url);
			battRules[host][url].allowAllways = false;
			_removeStoreRule(host, url);
			break;
		case 2: // allways
			_createRule(host, url);
			battRules[host][url].allowAllways = true;
			_saveStoreRules(host);
			break;
		default: // never
			delete battRules[host][url];
			_saveStoreRules(host);
	}
}

function _createRule (host, url)
{
	if (!battRules[host]) {
		battRules[host] = {};
	}
	if (!battRules[host][url]) {
		battRules[host][url] = {};
	}
}

function _removeStoreRule (host, url)
{
	var meh = {}
	meh["battRule:"+host] = Object.assign({}, battRules[host]);
	delete meh["battRule:"+host][url];
	chrome.storage.local.set(meh);
}

function _saveStoreRules (host)
{
	var meh = {}
	meh["battRule:"+host] = battRules[host];
	chrome.storage.local.set(meh);
}

chrome.storage.local.get(null, (item)=>{
	for (var key in item) {
		var meh = key.split(":", 2);
		if (meh[0] === "battRule") {
			battRules[meh[1]] = item[key];
		}
	}
});

chrome.webNavigation.onBeforeNavigate.addListener((nav)=>{
	if (nav.frameId === 0) {
		var url = new URL(nav.url);
		battTabs[nav.tabId] = url.hostname;
		battRequests[nav.tabId] = [];
	}
});

chrome.webRequest.onBeforeRequest.addListener((req)=>{
	// TODO: can we ignore chrome-extension: earlier?
	if (req.url.startsWith("chrome-extension:")) {
		return {cancel: false};
	}

	var url = req.url;
	var tab = req.tabId;
	var type = req.type;
	var host = battTabs[tab];

	battRequests[tab].push({
		type: type,
		url: url
	});

	if (battRules[host] && battRules[host][url]) {
		return {cancel: false}
	}

	return {cancel: true}
},
	{urls: ["<all_urls>"]},
	["blocking"]
);
