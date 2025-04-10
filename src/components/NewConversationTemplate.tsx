import { useState } from "react";
import { useChatContext } from "@/contexts/chatContext";

import { Code, GraduationCap, Newspaper, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { setPriority } from "os";

export default function NewConversationTemplate() {
	const [activeButtonId, setActiveButtonId] = useState<number | null>(null);

	const { setCurrentPrompt } = useChatContext();

	const buttonTypes = [
		{
			id: 1,
			icon: <Sparkles />,
			text: "Crea",
		},
		{
			id: 2,
			icon: <Newspaper />,
			text: "Esplora",
		},
		{
			id: 3,
			icon: <Code />,
			text: "Programma",
		},
		{
			id: 4,
			icon: <GraduationCap />,
			text: "Impara",
		},
	];

	const suggestionTypes = [
		{
			id: 0,
			prompts: [
				"Come funziona l'IA?",
				"I buchi neri esistono?",
				"Quante R ha 'fragola'?",
				"Qual è il senso della vita?",
			],
		},
		{
			id: 1,
			prompts: [
				"Scrivi una breve storia su un robot che scopre le emozioni",
				"Aiutatemi a delineare un romanzo di fantascienza ambientato in un mondo post-apocalittico.",
				"Creare il profilo del personaggio di un cattivo complesso con motivazioni simpatiche.",
				"Datemi 5 spunti di scrittura creativa per la narrativa flash",
			],
		},
		{
			id: 2,
			prompts: [
				"Buoni libri per i fan di George Orwell.",
				"Paesi classificati per numero di corgis.",
				"Le aziende di maggior successo al mondo.",
				"Quanto costa Claude di Antropic?",
			],
		},
		{
			id: 3,
			prompts: [
				"Scrivere codice per invertire un albero di ricerca binario in Python",
				"Qual è la differenza tra Promise.all e Promise.allSettled?",
				"Spiegare la funzione di clean-up dello useEffect di React",
				"Le migliori pratiche per la gestione degli errori in async/await",
			],
		},
		{
			id: 4,
			prompts: [
				"Guida per principianti su Typescript.",
				"Spiegare il teorema CAP nei sistemi distribuiti.",
				"Perché l'AI è così costosa?",
				"Spiega la relatività generale.",
			],
		},
	];

	const activePromptsId = activeButtonId || 0;
	const activePrompts =
		suggestionTypes.find((type) => type.id === activePromptsId)?.prompts ||
		[];

	return (
		<div className="w-full space-y-6 px-2 pt-32 duration-300 animate-in fade-in-50 zoom-in-95 sm:px-8 sm:pt-48">
			<h2 className="text-3xl font-semibold">Come posso aiutarti?</h2>
			<div className="flex flex-row flex-wrap gap-2.5 text-sm max-sm:justify-evenly">
				{buttonTypes.map(({ icon, text, id }) => (
					<Button
						key={id}
						className="rounded-full"
						onClick={() =>
							setActiveButtonId(id === activeButtonId ? null : id)
						}
						variant={
							id === activeButtonId ? "default" : "secondary"
						}
					>
						<>
							{icon}
							<span>{text}</span>
						</>
					</Button>
				))}
			</div>
			<div className="flex flex-col text-foreground">
				{activePrompts.map((prompt, index) => (
					<div
						key={index}
						className="flex items-start gap-2 border-t border-secondary py-2 first:border-none"
					>
						<Button
							onClick={() => setCurrentPrompt(prompt)}
							variant="ghost"
							className="justify-baseline w-full rounded-md py-2 text-secondary-foreground hover:bg-secondary sm:px-3"
						>
							<span>{prompt}</span>
						</Button>
					</div>
				))}
			</div>
		</div>
	);
}
