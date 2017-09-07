'use babel';
'use-strict';

export default {
  // Returns a math string to render based on an atom TextEditor object
  // Intended to be changed but for now it returns anything within $$ or $$
  // which the cursor is inside.
  getMathFromEditor(editor) {
    paragraph = editor.getCurrentParagraphBufferRange();
    let displayMode = true;
    if (typeof paragraph !== "undefined") {
      cursor = editor.getCursorBufferPosition();
      // console.log(editor.scopeDescriptorForBufferPosition(cursor));
      // console.log(editor.scopeDescriptorForBufferPosition(cursor).scopes);
      let largestMathScope = null;
      editor.scopeDescriptorForBufferPosition(cursor).scopes.forEach(scopeStr => {
        if (scopeStr.includes("math")) {
          largestMathScope = scopeStr;
        }
      });
      if (largestMathScope !== null) {
        mathsTextIncludingEnds = editor.getTextInBufferRange(editor.bufferRangeForScopeAtCursor(largestMathScope));
        let mathsText = mathsTextIncludingEnds.replace(/^\\\(/, "")
        .replace(/\\\)$/, "")
        .replace(/^\\\[/, "")
        .replace(/\\\]$/, "")
        .replace(/^\$+/, "")
        .replace(/\$+$/, "");
        let mathsTextWithoutAmpOrSlash = mathsText.replace("&", "").replace("\\\\", "");
        return [mathsTextWithoutAmpOrSlash, true];

        // TODO change display mode

      }

    }
    return [null, displayMode];
  }
};
