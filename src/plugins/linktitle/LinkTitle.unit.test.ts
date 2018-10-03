import Nock from 'nock';
import { getPage, processPage, processMessage } from './LinkTitle';

Nock.disableNetConnect();

describe("LinkTitle plugin", () => {
	test("regex matches correctly", () => {
		expect(processMessage("www.hexjelly.com"))
			.toBe("http://www.hexjelly.com");

		expect(processMessage("some text http://subdomain.hexjelly.com more text"))
			.toBe("http://subdomain.hexjelly.com");

		expect(processMessage("some text again http://sub.subdomain.hexjelly.com/"))
			.toBe("http://sub.subdomain.hexjelly.com/");

		expect(processMessage("hexjelly.com"))
			.toBe(false);

		expect(processMessage("https://hexjelly.com"))
			.toBe("https://hexjelly.com");

		expect(processMessage("some text https://hexjelly.com/somepath/file.html"))
			.toBe("https://hexjelly.com/somepath/file.html");

		expect(processMessage("https://hexjelly.com/?somequery=true&someotherquery=false some text again"))
			.toBe("https://hexjelly.com/?somequery=true&someotherquery=false");
	});

	test("only fetches pages that are text/html", async () => {
		Nock('https://hexjelly.com')
			.head('/')
			.reply(200, null, { 'Content-Type': 'text/html' })
			.get('/')
			.reply(200, '<html>Yay</html>', { 'Content-Type': 'text/html' });
		expect(await getPage("https://hexjelly.com")).toBe('<html>Yay</html>');

		Nock('https://hexjelly.com')
			.head('/')
			.reply(200, null, { 'Content-Type': 'application/json' })
		expect(await getPage("https://hexjelly.com")).toBe(false);
	});

	test("Handles non-200 codes", async () => {
		Nock("https://hexjelly.com")
			.head("/")
			.reply(404);

		expect((await getPage("https://hexjelly.com"))).toBe(false);
	});

	test("fetches title correctly", () => {
		const htmlWithRandomWhitespace = "<html><head><title> Some random \r\n\r \n \r title</title></head></html>";
		expect(processPage(htmlWithRandomWhitespace)).toBe(" Some random title");

		const htmlWithMultipleTitles = "<title>Two</title><title>titles</title>";
		expect(processPage(htmlWithMultipleTitles)).toBe("Two");

		const htmlWithNoTitle = "<div>No title here buddy</div>";
		expect(processPage(htmlWithNoTitle)).toBe("");
	});
});
