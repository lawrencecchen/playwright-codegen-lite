let previousLines: Array<string> = [];
export function rewriteLines(textLines: string[]) {
	const numLines = textLines.length; // get the number of lines
	// move cursor up by the number of lines, or the number of previous lines if there are fewer
	process.stdout.moveCursor(0, -Math.min(numLines, previousLines.length));

	for (let i = 0; i < numLines; i++) {
		// move cursor to the beginning of the current line
		process.stdout.cursorTo(0);
		process.stdout.clearLine(0);
		// overwrite the current line with the new text, including a newline character
		process.stdout.write(textLines[i] + "\n");
	}

	// store the new lines of text as the previous lines
	previousLines = textLines;
}
