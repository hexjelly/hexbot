import Needle from 'needle';
import Chalk from 'chalk';
import Cheerio from 'cheerio';

const INTERNALS = ['Warm Up','Flat Track','Twin Peaks','Over and Under','Uphill Battle','Long Haul',
                  'Hi Flyer','Tag','Tunnel Terror','The Steppes','Gravity Ride','Islands in the Sky',
                  'Hill Legend','Loop-de-Loop','Serpents Tale','New Wave','Labyrinth','Spiral',
                  'Turnaround','Upside Down','Hangman','Slalom','Quick Round','Ramp Frenzy','Precarious',
                  'Circuitous','Shelf Life','Bounce Back','Headbanger', 'Pipe','Animal Farm','Steep Corner',
                  'Zig-Zag','Bumpy Journey','Labyrinth Pro','Fruit in the Den','Jaws','Curvaceous',
                  'Haircut','Double Trouble','Framework','Enduro','He He','Freefall','Sink','Bowling',
                  'Enigma','Downhill','What the Heck','Expert System','Tricks Abound','Hang Tight',
                  'Hooked','Apple Harvest'];


export async function getWR(internal) {
	const url = 'http://www.moposite.com/records_elma_wrs.php';
	const response = await Needle('get', url);

	if (response.statusCode != 200) return `Error connecting to moposite, status code: ${response.statusCode}`;

	return formatResponse(response.body, internal);
}

export async function formatResponse(body, nr) {
    const element_nr = (nr < 28 ? (nr * 6) + 2 : ((nr-27) * 6) + 5);
    const $ = Cheerio.load(body);
    const time = $('td', '.wrtable').eq(element_nr-1).text();
    const kuski = $('td', '.wrtable').eq(element_nr).text().trim();
    const lev = INTERNALS[nr-1];

    return { time, kuski, lev };
}

export function formatMessage(internal, name, time, kuski) {
	return `${internal}. ${name}: ${time} by ${kuski}`;
}

export function processMessage(message) {
	const pattern = /^!wr\s*0*(\d*)$/i;
	const result = pattern.exec(message);

	if (!result) return false;

	const internal = parseInt(result[1].toString());
    if (isNaN(internal) || internal < 1 || internal > 54) return false;

    return internal;
}

function ElmaWRsHandler(command, event, client, next) {
	if (command === "privmsg" && event.nick != client.user.nick) {
		const internal = processMessage(event.message);

		if (!internal) return next();

		getWR(internal)
			.then( wr => {
				client.say(event.target, formatMessage(internal, wr.lev, wr.time, wr.kuski));
			})
			.catch(error => console.error(Chalk.red(error)));

		return;
	}

	next();
}

export function ElmaWRs() {
	return function ElmaWRsMiddleWare(_client, _raw_events, parsed_events) {
		parsed_events.use(ElmaWRsHandler);
	}
}
