export type Point = { x: number; y: number };

export type Mode = "inspecting" | "recording" | "none";

export type EventData = {
	event:
		| "clear"
		| "resume"
		| "step"
		| "pause"
		| "setMode"
		| "selectorUpdated"
		| "fileChanged";
	params: any;
};

export type UIState = {
	mode: Mode;
	actionPoint?: Point;
	actionSelector?: string;
	language: "javascript" | "python" | "java" | "csharp";
	testIdAttributeName: string;
};
