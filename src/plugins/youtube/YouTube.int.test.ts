import Nock from 'nock';
import { processMessage } from './YouTube';

Nock.disableNetConnect();

describe("YouTube plugin", () => {
	test("Handles non-200 codes", async () => {
		Nock("https://www.googleapis.com")
			.get("/youtube/v3/search")
			.query(true)
			.reply(404)

		await expect(processMessage("!yt oh no")).rejects.toEqual(new Error("Error connecting to YouTube API while searching, status code: 404"));
	});

	test("gives correct info for link", async () => {
		Nock("https://www.googleapis.com")
			.get("/youtube/v3/videos")
			.query(true)
			.reply(200, {
				items: [{
					contentDetails: { duration: "PT15M33S" },
					snippet: { title: "Fake video" }
				}]
			});
		const res = await processMessage("youtu.be/totallyRealId");
		expect(res).toBe("[YouTube] Fake video (15:33)");
	});
});
