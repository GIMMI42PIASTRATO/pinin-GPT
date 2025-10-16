import { IncomingMessage, ServerResponse } from "http";

/**
 * Custom Request class that extends IncomingMessage
 * Adds body parsing functionality
 */
export class AppRequest extends IncomingMessage {
	private _body: any = null;
	private _bodyParsed = false;

	/**
	 * Parse the request body as JSON
	 */
	async parseBody<T = any>(): Promise<T> {
		if (this._bodyParsed) {
			return this._body;
		}

		return new Promise((resolve, reject) => {
			let body = "";

			this.on("data", (chunk) => {
				body += chunk.toString();
			});

			this.on("end", () => {
				try {
					this._body = body ? JSON.parse(body) : {};
					this._bodyParsed = true;
					resolve(this._body);
				} catch (error) {
					reject(new Error("Invalid JSON in request body"));
				}
			});

			this.on("error", (error) => {
				reject(error);
			});
		});
	}

	/**
	 * Get the parsed body (must call parseBody first)
	 */
	get body(): any {
		return this._body;
	}
}

/**
 * Custom Response class that extends ServerResponse
 * Adds helper methods for SSE and JSON responses
 */
export class AppResponse extends ServerResponse {
	/**
	 * Send a JSON response
	 */
	json(data: any, statusCode: number = 200): void {
		this.writeHead(statusCode, {
			"Content-Type": "application/json",
		});
		this.end(JSON.stringify(data));
	}

	/**
	 * Send an error response
	 */
	error(message: string, statusCode: number = 500): void {
		this.json({ error: message }, statusCode);
	}

	/**
	 * Send a Server-Sent Event
	 */
	sendSSE(event: string, data: any): void {
		this.write(`event: ${event}\n`);
		this.write(`data: ${JSON.stringify(data)}\n\n`);
	}

	/**
	 * Initialize SSE connection
	 */
	initSSE(): void {
		this.writeHead(200, {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
			"Access-Control-Allow-Origin": "*",
		});
	}

	/**
	 * Send a simple SSE message (without event type)
	 */
	sendSSEData(data: any): void {
		this.write(`data: ${JSON.stringify(data)}\n\n`);
	}

	/**
	 * End the SSE connection
	 */
	endSSE(): void {
		this.write("data: [DONE]\n\n");
		this.end();
	}
}
