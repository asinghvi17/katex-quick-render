'use babel';
'use-strict';

export default {
  // Returns a math string to render based on an atom TextEditor object
  // Intended to be changed but for now it returns anything within $$ or $$
  // which the cursor is inside.
  getMathFromEditor(editor) {
    let displayMode = true;
    cursor = editor.getCursorBufferPosition();
    let mathsBufferRange;
    for (let scopeStr of editor.scopeDescriptorForBufferPosition(cursor).scopes) {
      if (scopeStr.includes("math") && scopeStr != "meta.function.environment.math.latex") {
        mathsBufferRange = editor.bufferRangeForScopeAtCursor(scopeStr);
        if (mathsBufferRange !== undefined) {
          break;
        }
      }
    }
    if (mathsBufferRange == undefined) {
      return [null, displayMode];
    }
    let mathsTextIncludingEnds = editor.getTextInBufferRange(mathsBufferRange);
    let mathsText = mathsTextIncludingEnds.replace(/^\\\(/, "")
      .replace(/\\\)$/, "")
      .replace(/^\\\[/, "")
      .replace(/\\\]$/, "")
      .replace(/^\$+/, "")
      .replace(/\$+$/, "");
    let mathsTextWithoutAmpOrSlash = mathsText.replace("&", "").replace("\\\\", "");
    return [mathsTextWithoutAmpOrSlash, true];
    // TODO change display mode.
  }

};
