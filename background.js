var myRules = {};
var myRequests = [];

function requestHandler (req) {
	if (req.url.startsWith("chrome-extension://")) {
		return {cancel: false};
	}

	if (!myRules[req.url]) {
		myRules[req.url] = {
			"url": req.url,
			"type": req.type,
			"allowRequest": false
		}
		chrome.storage.local.set({"myRules": myRules});
	}

	myRequests.push(myRules[req.url]);
	chrome.storage.local.set({"myRequests": myRequests});

	if (myRules[req.url].allowRequest) {
		return {cancel: false};
	}
	return {cancel: true};
}

chrome.runtime.onMessage.addListener(
	(req, sender, res) => {
		if (req.type === "setRequestRule") {
			myRules[req.data.url].allowRequest = req.data.allowRequest;
			myRequests[req.data.requestListIndex] = myRules[req.data.url];
			chrome.storage.local.set({"myRules": myRules});
			chrome.storage.local.set({"myRequests": myRequests});
		}
	}
);

chrome.storage.local.get("myRules", (item)=>{
	if (item.myRules) {
		myRules = item.myRules;
	}
});

chrome.webRequest.onBeforeRequest.addListener(
	requestHandler,
	{urls: ["<all_urls>"]},
	["blocking"]
);

chrome.webNavigation.onBeforeNavigate.addListener((details)=>{
	if (details.parentFrameId < 0) {
		myRequests = [];
	}
});
