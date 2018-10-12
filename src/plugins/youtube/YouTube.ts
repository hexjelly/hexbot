import Needle from 'needle';
import Chalk from 'chalk';

export async function getInfo(id, showLink: boolean) {
	const url = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${process.env.YOUTUBE_APIKEY}&fields=items(snippet(title),contentDetails(duration))&part=snippet,contentDetails`;
	const response = await Needle('get', url);
	if (response.statusCode != 200) throw new Error(`Error connecting to YouTube API, status code: ${response.statusCode}`);

	const durationPattern = /P(?:(?:(\d+)W)?(?:(\d+)DT|T))?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i;
	const duration = durationPattern.exec(response.body.items[0].contentDetails.duration);
	if (!duration) throw new Error("Unexpected API error while parsing duration");

	const durationWeeks = (duration[1] ? duration[1] + "w " : "");
	const durationDays = (duration[2] ? duration[2] + "d " : "");
	const durationHours = (duration[3] ? duration[3] + ":" : "");
	const durationMins = (duration[4] ? duration[4].padStart(2, "0") + ":" : "00:");
	const durationSecs = (duration[5] ? duration[5].padStart(2, "0") : "00");
	const title = response.body.items[0].snippet.title || "";
	const link = showLink ? ` https://www.youtube.com/watch?v=${id}` : "";
	const result = `[YouTube] ${title} (${durationWeeks}${durationDays}${durationHours}${durationMins}${durationSecs})${link}`;

	return result;
}

export async function searchTitle(title) {
	const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(title)}&type=video&key=${process.env.YOUTUBE_APIKEY}`;
	const response = await Needle('get', url);

	if (response.statusCode != 200) throw new Error(`Error connecting to YouTube API while searching, status code: ${response.statusCode}`);
	if (response.body.error) throw new Error(`API error: ${response.body.error}`);
	if (!response.body.items[0]) return `[YouTube] No search results for "${title}"`;

	const result = await getInfo(response.body.items[0].id.videoId, true);
	return result;
}

export async function processMessage(message) {
	const pattern = /(?:^!youtube|^!yt)\s(.+)|.*(?:youtube.com\/watch\?.*v=|youtu.be\/)([\w-]{11})/i;
	const result = pattern.exec(message);

	if (!result) return false;

	if (result[2]) { // normal link
		return await getInfo(result[2], false);
	} else if (result[1]) { // search
		return await searchTitle(result[1]);
	}
}

function YouTubeHandler(command, event, client, next) {
	if (!process.env.YOUTUBE_APIKEY) {
		console.warn(Chalk.yellow("[YouTube] Missing YOUTUBE_APIKEY environment variable, skipping middleware"));
		return next();
	}

	if (command === "privmsg" && event.nick != client.user.nick) {
		processMessage(event.message).then(result => {
			if (!result) return next();
			client.say(event.target, result);
		})
			.catch(error => console.error(Chalk.red(`[YouTube] ${error}`)));
	} else {
		return next();
	}
}

export function YouTube() {
	return function YouTubeMiddleWare(_client, _raw_events, parsed_events) {
		parsed_events.use(YouTubeHandler);
	}
}
