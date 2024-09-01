document.addEventListener("DOMContentLoaded", function () {
	const titleInput = document.getElementById("titleInput");
	const linkInput = document.getElementById("linkInput");
	const saveLinkBtn = document.getElementById("saveLinkBtn");
	const generateLinkBtn = document.getElementById("generateLinkBtn");
	const linkList = document.getElementById("linkList");

	// Load saved links
	chrome.storage.local.get(["links"], function (result) {
		const links = result.links || [];
		links.forEach((linkObj, index) => {
			addLinkToList(linkObj, index);
		});
	});

	// Save link
	saveLinkBtn.addEventListener("click", function () {
		const title = titleInput.value;
		const link = linkInput.value;
		if (link) {
			chrome.storage.local.get(["links"], function (result) {
				const links = result.links || [];
				const linkObj = { title: title || "No Title", url: link };
				links.push(linkObj);
				chrome.storage.local.set({ links: links }, function () {
					addLinkToList(linkObj, links.length - 1);
					titleInput.value = "";
					linkInput.value = "";
				});
			});
		}
	});

	// Generate shareable link
	generateLinkBtn.addEventListener("click", function () {
		chrome.storage.local.get(["links"], function (result) {
			const links = result.links || [];
			if (links.length > 0) {
				const blob = new Blob(
					[links.map((link) => `${link.title}: ${link.url}`).join("\n")],
					{ type: "text/plain" }
				);
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = "saved_links.txt";
				a.click();
				URL.revokeObjectURL(url);
			} else {
				alert("No links to share.");
			}
		});
	});

	// Add link to the list
	function addLinkToList(linkObj, index) {
		const li = document.createElement("li");
		li.innerHTML = `<strong>${linkObj.title}</strong>: <a href="${linkObj.url}" target="_blank">${linkObj.url}</a> 
                        <button class="deleteBtn" data-index="${index}">Delete</button>`;
		linkList.appendChild(li);

		// Add delete functionality
		li.querySelector(".deleteBtn").addEventListener("click", function () {
			deleteLink(index);
		});
	}

	// Delete link
	function deleteLink(index) {
		chrome.storage.local.get(["links"], function (result) {
			const links = result.links || [];
			links.splice(index, 1);
			chrome.storage.local.set({ links: links }, function () {
				linkList.innerHTML = ""; // Clear list
				links.forEach((linkObj, i) => {
					addLinkToList(linkObj, i); // Re-render list
				});
			});
		});
	}
});
