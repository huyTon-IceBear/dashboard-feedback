import { useEffect } from "react";
import html2canvas from "html2canvas";

type HighlighterProps = {
	inspecting: boolean;
	onElementClick: (url: string) => void;
};

export default function ElementHighlighter({ inspecting, onElementClick }: HighlighterProps) {
	const highlighter = document.createElement("div");
	highlighter.style.position = "fixed";
	highlighter.style.pointerEvents = "none";
	highlighter.style.zIndex = "9999";
	highlighter.style.background = "rgba(173,216,230,0.7)"; // Light blue or light cyan color
	highlighter.style.border = "2px dashed #ff69b4";

	const captureElement = (e: MouseEvent) => {
		if (inspecting) {
			const target = e.target as HTMLElement;

			// Temporarily disable pointer events on the target element
			target.style.pointerEvents = "none";

			html2canvas(target).then((canvas) => {
				const dataUrl = canvas.toDataURL();
				onElementClick(dataUrl);
				// Enable pointer events back on the target element
				target.style.pointerEvents = "auto";
			});
		}
	};

	const handleMouseOver = (e: MouseEvent) => {
		if (inspecting) {
			const { target } = e;
			const rect = (target as HTMLElement).getBoundingClientRect();
			highlighter.style.top = `${rect.top + window.scrollY}px`;
			highlighter.style.left = `${rect.left + window.scrollX}px`;
			highlighter.style.width = `${rect.width}px`;
			highlighter.style.height = `${rect.height}px`;
			document.body.append(highlighter);
		}
	};

	const handleMouseOut = () => {
		highlighter.remove();
	};

	useEffect(() => {
		document.addEventListener("mousedown", captureElement);
		document.addEventListener("mouseover", handleMouseOver);
		document.addEventListener("mouseout", handleMouseOut);

		return () => {
			highlighter.remove();
			document.removeEventListener("mouseover", handleMouseOver);
			document.removeEventListener("mouseout", handleMouseOut);
			document.removeEventListener("mousedown", captureElement);
		};
	}, [inspecting]);

	return null;
}
