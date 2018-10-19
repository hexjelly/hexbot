import Nock from 'nock';
import { processMessage, formatResponse, getWR } from './ElmaWRs';
import { wr_html_table } from './ElmaWrs.unit.test.data';

Nock.disableNetConnect();

describe("ElmaWRs plugin", () => {
	test("parses command correctly", () => {
		expect(processMessage("!wr 1")).toBe(1);
		expect(processMessage("!wr 54")).toBe(54);
		expect(processMessage("!wr 10 29")).toBe(false);
		expect(processMessage("!wr 0")).toBe(false);
		expect(processMessage("!wr 55")).toBe(false);
		expect(processMessage("!wr steppes")).toBe(false);
		expect(processMessage("blah")).toBe(false);
	});

	test("formats response correctly", async () => {
		expect(await formatResponse(wr_html_table, 1)).toBe("1. Warm Up: 13,88 by danitah");
		expect(await formatResponse(wr_html_table, 10)).toBe("10. The Steppes: 10,50 by Spef");
		expect(await formatResponse(wr_html_table, 27)).toBe("27. Shelf Life: 32,92 by Spef");
		expect(await formatResponse(wr_html_table, 28)).toBe("28. Bounce Back: 46,19 by Zweq");
		expect(await formatResponse(wr_html_table, 54)).toBe("54. Apple Harvest: 1:12,89 by Kazan");
	});

	test("handles non-200 codes", async () => {
		Nock("http://www.moposite.com")
			.get("/records_elma_wrs.php")
			.query(true)
			.reply(404);

		expect(await getWR(29)).toBe("Error connecting to moposite, status code: 404");
	});
});
