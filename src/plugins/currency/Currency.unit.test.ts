import Nock from 'nock';
import { getRates, processMessage } from './Currency';

Nock.disableNetConnect();

describe("Currency plugin", () => {
	test("Processes messages correctly", () => {
		expect(processMessage("!curr usd eur")).toEqual({ from: "USD", to: "EUR", amount: 1 });
		expect(processMessage("!cur eur to gbp")).toEqual({ from: "EUR", to: "GBP", amount: 1 });
		expect(processMessage("!currency 5 nOk DEk")).toEqual({ from: "NOK", to: "DEK", amount: 5 });
		expect(processMessage("!cur 25.5 USD   eh CAD")).toEqual({ from: "USD", to: "CAD", amount: 25.5 });
		expect(processMessage("!curr 0 usd eur")).toEqual({ from: "USD", to: "EUR", amount: 1 });

		expect(processMessage("!curr eur")).toBe(false);
		expect(processMessage("!curr 3 dk sv")).toBe(false);
		expect(processMessage("!currency some random other text")).toBe(false);
	});

	test("Handles non-200 codes", async () => {
		Nock("https://api.exchangeratesapi.io")
			.get("/latest")
			.query(true)
			.reply(404);

		expect((await getRates("USD", "GBP", 1))).toBe("Error connecting to currency site, status code: 404");
	});

	test("Converts correctly", async () => {
		const validResponse = {
			"base": "USD",
			"rates": {
				"USD": 1.0,
				"GBP": 0.7664996545
			},
			"date": "2018-09-28"
		};

		const invalidResponse = {
			"error": "Symbols 'usd,GBP' are invalid for date 2018-09-29."
		};

		Nock("https://api.exchangeratesapi.io")
			.get("/latest")
			.query(true)
			.reply(200, validResponse);

		const valid = await getRates("USD", "GBP", 1);

		Nock("https://api.exchangeratesapi.io")
			.get("/latest")
			.query(true)
			.reply(200, invalidResponse);

		const invalid = await getRates("eee", "amz", 0);

		expect(valid).toBe(0.7664996545);
		expect(invalid).toBe("Symbols 'usd,GBP' are invalid for date 2018-09-29.");
	});
});
