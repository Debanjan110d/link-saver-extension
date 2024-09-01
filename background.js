chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.local.set({ links: [] }, function () {
		console.log("Link Saver initialized with an empty list.");
	});
});
