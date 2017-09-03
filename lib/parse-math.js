'use babel';
'use-strict';


// Returns an ordered list of all the maths expressions in some passed text.
function parseText(someText) {
  throw Error("NOT CURRENTLY USED! - legacy / future use.");
  let match = someText.match(/\$+.+?\$+/g);
  let dollars = match === null ? [] : match.map(el => el.replace(/\$/g, ""));
  return dollars;
}

export default {
  // Returns a math string to render based on an atom TextEditor object
  // Intended to be changed but for now it returns anything within $$ or $$
  // which the cursor is inside.
  getMathFromEditor(editor) {
    paragraph = editor.getCurrentParagraphBufferRange();
    let theMathStringWhenFound = null;
    if (typeof paragraph !== "undefined") {
      cursor = editor.getCursorBufferPosition();
      editor.scanInBufferRange(/\$+[\s\S]+?\$+/g, paragraph, matchObj => {
        // matchObj.stop, matchObj.replace
        if (matchObj.computedRange.containsPoint(cursor)) {
          // return only the match objects that contain the cursor.
          theMathStringWhenFound = matchObj.matchText.replace(/\$/g, "");
        }
      });

      // beforeCursor = editor.getTextInBufferRange(
      //   [paragraph.start, cursor]
      // );
      // afterCursor = editor.getTextInBufferRange(
      //   [cursor, paragraph.end]
      // );
      //
      //
      // console.log(beforeCursor);
      // console.log(afterCursor);
    }
    return theMathStringWhenFound;
  }
};
