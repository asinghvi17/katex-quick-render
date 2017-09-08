'use babel';
'use-strict';

export default {
  // Returns a math string to render based on an atom TextEditor object
  // Intended to be changed but for now it returns anything within $$ or $$
  // which the cursor is inside.
  getMathFromEditor(editor) {
    let displayMode = true;
    cursor = editor.getCursorBufferPosition();
    // console.log(editor.scopeDescriptorForBufferPosition(cursor));
    // console.log(editor.scopeDescriptorForBufferPosition(cursor).scopes);
    let mathsScopes = [];
    editor.scopeDescriptorForBufferPosition(cursor).scopes.forEach(scopeStr => {
      if (scopeStr.includes("math") && scopeStr != "meta.function.environment.math.latex") {
        mathsScopes.push(scopeStr);
      }
    });
    let mathsBufferRange;
    for (let oneScope of mathsScopes) {
      mathsBufferRange = editor.bufferRangeForScopeAtCursor(oneScope);
      if (mathsBufferRange !== undefined) {
        break;
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
