import { useEffect } from "react";
import html2canvas from "html2canvas";

// Define types for the HighlighterProps
type HighlighterProps = {
  inspecting: boolean;
  onElementClick: (url: string) => void;
};

/**
 * ElementHighlighter component for visually highlighting and capturing elements.
 * @param {HighlighterProps} props - Component props for ElementHighlighter.
 */
export default function ElementHighlighter({
  inspecting,
  onElementClick,
}: HighlighterProps) {
  // Create a highlighter div element with styling
  const highlighter = document.createElement("div");
  highlighter.style.position = "fixed";
  highlighter.style.pointerEvents = "none";
  highlighter.style.zIndex = "9999";
  highlighter.style.background = "rgba(173,216,230,0.7)"; // Light blue or light cyan color
  highlighter.style.border = "2px dashed #ff69b4";

  // Function to capture an element when clicked
  const captureElement = (e: MouseEvent) => {
    if (inspecting) {
      const target = e.target as HTMLElement;

      // Temporarily disable pointer events on the target element
      target.style.pointerEvents = "none";

      // Use html2canvas to capture the target element
      html2canvas(target).then((canvas) => {
        const dataUrl = canvas.toDataURL();
        // Trigger the onElementClick callback with the captured data URL
        onElementClick(dataUrl);
        // Enable pointer events back on the target element
        target.style.pointerEvents = "auto";
      });
    }
  };

  // Function to handle mouseover events
  const handleMouseOver = (e: MouseEvent) => {
    if (inspecting) {
      const { target } = e;
      const rect = (target as HTMLElement).getBoundingClientRect();

      // Set the position and size of the highlighter to match the target element
      highlighter.style.top = `${rect.top + window.scrollY}px`;
      highlighter.style.left = `${rect.left + window.scrollX}px`;
      highlighter.style.width = `${rect.width}px`;
      highlighter.style.height = `${rect.height}px`;

      // Append the highlighter to the body
      document.body.append(highlighter);
    }
  };

  // Function to handle mouseout events
  const handleMouseOut = () => {
    // Remove the highlighter from the body
    highlighter.remove();
  };

  // useEffect to add and remove event listeners based on the inspecting state
  useEffect(() => {
    // Add event listeners when inspecting is true
    document.addEventListener("mousedown", captureElement);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    // Remove event listeners and highlighter when inspecting is false
    return () => {
      highlighter.remove();
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mousedown", captureElement);
    };
  }, [inspecting]);

  // The component does not render anything visible
  return null;
}
