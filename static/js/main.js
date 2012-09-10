//inital prototyping

function populateDOM(vidArray) {
	$("#diva-results").empty();
	$("#diva-videos").empty();
	var templateList = $("#tpl-proto").html();
	var compiledList = _.template(templateList);
	var templatePlayer = $("#tpl-proto-player").html();
	var compiledPlayer = _.template(templatePlayer);
	$.each(vidArray, function(index, video) {
		var vidDiv = compiledList({ thumbnail: video.img, title: video.title, ytid: video.id });
		var player = compiledPlayer({ ytid: video.id });
		$("#diva-results").append(vidDiv);
		$("#diva-videos").append(player);
	});
}

function parseJSON(json) {
	var videos = json.data.items;
	var vidCollection = [];
	$.each(videos, function(index, video) {
		var videoObj = {};
		videoObj.id = video.id;
		videoObj.title = video.title;
		videoObj.img = video.thumbnail.sqDefault;
		if (video.accessControl.embed === "allowed") {
			videoObj.embed = true;
		} else {
			videoObj.embed = false;
		}
		vidCollection.push(videoObj);
	});
	populateDOM(vidCollection);
}

function divaSearch(diva) {
	$.ajax({
		url: "https://gdata.youtube.com/feeds/api/videos",
		data: {
			"q": diva,
			"key": "AI39si4TJhL042ksIPEJ2e7X4FI0N4ow47lz97Cms1erDN4TmE06CHG3OD1bru-4NWGtGGYm1lEQBAnTTPKY1XME4ehFoXVv-Q",
			"alt": "jsonc",
			"v": "2",
			"max-results": "4"
		},
		dataType: "jsonp",
		success: parseJSON
	});
}

$("#diva-search").click(function() {
	var input = $("#diva-input").val();
	divaSearch(input);
});

