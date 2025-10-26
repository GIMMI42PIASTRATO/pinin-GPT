// Custom server import
import { createServer } from "http";
import { parse } from "url";
import next from "next";

// Custom request/response classes
import {
	AppRequest,
	AppResponse,
} from "./src/lib/server/customRequestResponse";

// Event sender function import
import { handleChatRequest } from "./src/events/chatEvents";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	createServer((req, res) => {
		const parsedUrl = parse(req.url!, true);

		if (parsedUrl.pathname === "/api/stream") {
			// Cast to custom classes to add body parsing and SSE helpers
			const appReq = Object.setPrototypeOf(
				req,
				AppRequest.prototype
			) as AppRequest;
			const appRes = Object.setPrototypeOf(
				res,
				AppResponse.prototype
			) as AppResponse;

			// Handle the chat request with streaming
			handleChatRequest(appReq, appRes).catch((error) => {
				console.error("Error handling chat request:", error);
				if (!appRes.headersSent) {
					appRes.error("Internal server error", 500);
				}
			});

			return;
		}

		handle(req, res, parsedUrl);
	}).listen(port);

	console.log(
		`> Custom server listening at http://localhost:${port} as ${
			dev ? "development" : process.env.NODE_ENV
		}`
	);
});
