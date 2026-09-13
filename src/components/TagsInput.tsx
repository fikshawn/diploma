import { X } from "lucide-react";
import { useState } from "react";

type TagsInputProps = {
	value: string[];
	onChange: (tags: string[]) => void;
};

export function TagsInput({ value, onChange }: TagsInputProps) {
	const [input, setInput] = useState("");
	const [isActive, setIsActive] = useState(false);

	const addTag = (raw: string) => {
		const tag = raw.trim();
		if (tag && !value.includes(tag)) {
			onChange([...value, tag]);
		}
		setInput("");
	};

	const removeTag = (tag: string) => {
		onChange(value.filter((t) => t !== tag));
	};

	return (
		<div
			className={`input-group flex flex-wrap items-center gap-2 bg-white rounded border px-4 py-2.5 transition ${
				isActive
					? "border-slate-400 ring-2 ring-indigo-100"
					: "border-slate-200/80"
			}`}
		>
			{value.map((tag) => (
				<span
					key={tag}
					className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-sm px-2.5 py-0.5 rounded-full"
				>
					{tag}
					<button
						type="button"
						onClick={() => removeTag(tag)}
						className="text-indigo-400 hover:text-indigo-700 transition"
						aria-label={`Verwijder ${tag}`}
					>
						<X size={14} />
					</button>
				</span>
			))}
			<input
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onFocus={() => setIsActive(true)}
				onBlur={() => {
					setIsActive(false);
					addTag(input);
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === ",") {
						e.preventDefault();
						addTag(input);
					} else if (
						e.key === "Backspace" &&
						input === "" &&
						value.length > 0
					) {
						removeTag(value[value.length - 1]);
					}
				}}
				placeholder={value.length === 0 ? "Typ een tag en druk op Enter" : ""}
				className="flex-1 min-w-[120px] bg-transparent border-0 focus:ring-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
			/>
		</div>
	);
}
