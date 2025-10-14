// Custom server import
import { createServer } from "http";
import { parse } from "url";
import next from "next";

// Event sender funtion import
import { handleChatRequest } from "@/events/chatEvents";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	createServer((req, res) => {
		const parsedUrl = parse(req.url!, true);

		if (parsedUrl.pathname === "/api/stream") {
			res.writeHead(200, {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				Connection: "keep-alive",
				"Access-Control-Allow-Origin": "*",
			});

			const intervalId = setInterval(() => {
				handleChatRequest(req, res);
			}, 1000);

			req.on("close", () => {
				clearInterval(intervalId);
			});
		}
		handle(req, res, parsedUrl);
	}).listen(port);

	console.log(
		`> Custom server listening at http://localhost:${port} as ${
			dev ? "development" : process.env.NODE_ENV
		}`
	);
});
