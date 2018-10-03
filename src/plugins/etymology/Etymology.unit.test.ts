import Nock from 'nock';
import { getDefinition, formatMessage, processMessage } from './Etymology';

Nock.disableNetConnect();

const root = `
<div class="word--C9UPa"><h1 class="notranslate word__name--TTbAA">root (n.)</h1>
	<section class="word__defination--2q7ZH">
		<p>this is totally the real etymology of root</p>
	</section>
</div>

<div class="word--C9UPa"><h1 class="notranslate word__name--TTbAA">root (v.1)</h1>
	<section class="word__defination--2q7ZH">
		<p>This is super long and should get truncated at some point. This is super long and should get truncated at some point. 
		This is super long and should get truncated at some point. This is super long and should get truncated at some point. 
		This is super long and should get truncated at some point. This is super long and should get truncated at some point. 
		This is super long and should get truncated at some point. This is super long and should get truncated at some point. 
		This is super long and should get truncated at some point. This is super long and should get truncated at some point.</p>
	</section>
</div>

<div class="word--C9UPa"><h1 class="notranslate word__name--TTbAA">root (v.2)</h1>
	<section class="word__defination--2q7ZH">
		<p>second verb etymology</p>
	</section>
</div>`

describe("Etymology plugin", () => {
	test("Processes messages correctly", () => {
		expect(processMessage("!ety root")).toEqual({ word: "root", modifier: undefined });
		expect(processMessage("!etym root :v.1")).toEqual({ word: "root", modifier: "v.1" });
		expect(processMessage("!etymology root :v.2")).toEqual({ word: "root", modifier: "v.2" });
	});

	test("Formats messages correctly", () => {
		expect(formatMessage("a".repeat(500), "root", 450)).toHaveLength(450);
	});

	test("Handles non-200 codes", async () => {
		Nock("https://www.etymonline.com")
			.get("/word/root")
			.query(true)
			.reply(404);

		expect((await getDefinition("root", null))).toBe("Error connecting to etymonline site, status code: 404");
	});

	test("Gets correct definition", async () => {
		Nock("https://www.etymonline.com")
			.get("/word/root")
			.reply(200, root);

		const def_n = await getDefinition("root", null);
		expect(def_n).toBe("root (n.): this is totally the real etymology of root");

		Nock("https://www.etymonline.com")
			.get("/word/root")
			.reply(200, root);

		const def_v1 = await getDefinition("root", "v.1");
		expect(def_v1).toBe("root (v.1): This is super long and should get truncated at some point. This is super long and should get truncated at some point.This is super long and should get truncated at some point. This is super long and should get truncated at some point.This is super long and should get truncated at some point. This is super long and should get truncated at some point.This is super long and should get truncated at some point. This is super long and should get truncated at some point.This is super long and should get truncated at some point. This is super long and should get truncated at some point.");
	});
});
