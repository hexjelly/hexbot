import Nock from 'nock';
import { formatResponse, searchIMDb, getIMDb } from './IMDb';

describe("IMDb plugin", () => {
	test("formats response correctly", () => {
		const casablanca = {
			"Title": "Casablanca",
			"Year": "1942",
			"imdbRating": "8.5",
			"imdbID": "tt0034583",
			"Response": "True"
		};
		expect(formatResponse(casablanca)).toBe("[IMDb] Casablanca (1942) 8.5/10");
	});

	test("gives correct title info when searching", async () => {
		// intercept API call and reply with expected JSON
		Nock("http://www.omdbapi.com")
			.get("/")
			.query(true)
			.reply(200, {
				"Title": "Fake movie",
				"Year": "2018",
				"imdbRating": "10",
				"imdbID": "tt9600051",
				"Response": "True"
			});
		const res = await searchIMDb("Fake movie");
		expect(res).toBe("[IMDb] Fake movie (2018) 10/10 https://www.imdb.com/title/tt9600051/");
	});

	test("gives correct title info when retrieving", async () => {
		// intercept API call and reply with expected JSON
		Nock("http://www.omdbapi.com")
			.get("/")
			.query(true)
			.reply(200, {
				"Title": "Fake movie",
				"Year": "2018",
				"imdbRating": "10",
				"imdbID": "tt9600051",
				"Response": "True"
			});
		const res = await getIMDb("Fake movie");
		expect(res).toBe("[IMDb] Fake movie (2018) 10/10");
	});
});
