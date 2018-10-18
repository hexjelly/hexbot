import Nock from 'nock';
import { getDefinition, formatMessage } from './Dictionary';

Nock.disableNetConnect();


describe("Dictionary plugin", () => {
	test("Formats messages correctly", () => {
		expect(formatMessage("a".repeat(500), 450)).toHaveLength(450);
	});

	test("Handles non-200 codes", async () => {
		Nock("https://api.wordnik.com")
			.get("/v4/word.json/root/definitions")
			.query(true)
			.reply(404);

		await expect(getDefinition("root")).rejects.toEqual(new Error("Error connecting to WordNik API, status code: 404"));

	});

	test("Handles missing definition", async () => {
		Nock("https://api.wordnik.com")
			.get("/v4/word.json/root/definitions")
			.query(true)
			.reply(200, {});

		const def = await getDefinition("root");
		expect(def).toBe("Couldn't find definition for 'root'.");
	});

	test("Gets correct definition", async () => {
		Nock("https://api.wordnik.com")
			.get("/v4/word.json/root/definitions")
			.query(true)
			.reply(200, [{ word: "root", text: "first definition" }, { text: "second definition" }, { text: "third definition" }, { text: "fourth definition" }]);

		const def_multiple = await getDefinition("root");
		expect(def_multiple).toBe("root - 1: first definition 2: second definition 3: third definition 4: fourth definition");

		Nock("https://api.wordnik.com")
			.get("/v4/word.json/root/definitions")
			.query(true)
			.reply(200, [{ word: "root", text: "only definition" }]);

		const def_single = await getDefinition("root");
		expect(def_single).toBe("root - 1: only definition");
	});
});
