'use babel';
'use-strict';

export default {
  // Returns a math string to render based on an atom TextEditor object
  // Intended to be changed but for now it returns anything within $$ or $$
  // which the cursor is inside.
  getMathFromEditor(editor) {
    paragraph = editor.getCurrentParagraphBufferRange();
    let theMathStringWhenFound = null;
    let displayMode = true;
    if (typeof paragraph !== "undefined") {
      cursor = editor.getCursorBufferPosition();
      editor.scanInBufferRange(/\$+[\s\S]+?\$+/g, paragraph, matchObj => {
        if (matchObj.computedRange.containsPoint(cursor)) {
          // return only the match objects that contain the cursor.
          if(matchObj.matchText[0] == "$" && matchObj.matchText[1] != "$")
            displayMode = false;
          theMathStringWhenFound = matchObj.matchText.replace(/\$/g, "");
          matchObj.stop();
        }
      });
    }
    return [theMathStringWhenFound, displayMode];
  }
};
