import { redirect } from "next/navigation";

export default function Home() {
	const url = "/chat";

	redirect(url);
}
