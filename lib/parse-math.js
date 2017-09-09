'use babel';
'use-strict';


const standardTranslations = [{
    regex: /^\\\(/,
    func: ""
  },
  {
    regex: /\\\)$/,
    func: ""
  },
  {
    regex: /^\\\[/,
    func: ""
  },
  {
    regex: /\\\]$/,
    func: ""
  },
  {
    regex: /^\$+/,
    func: ""
  },
  {
    regex: /\$+$/,
    func: ""
  },
  { // Replace all double ampersands with 8 spaces
    // TODO: Broken with &&&&
    regex: /([^\\]|^)&\s*&/g,
    func: "$1 \\quad\\quad "
  },
  { // Strip all singular &
    regex: /([^\\]|^)&\s*/g,
    func: "$1"
  },
  {
    regex: /\\\\$/,
    func: ""
  }
];


// Make translations a list of objects which each have a regex and a function
// to callback from someString.repace(regex, this callback)
function performTranslations(someString, translations) {
  translations.forEach(translation =>
    someString = someString.replace(translation.regex, translation.func)
  );
  return someString;
}




export default {
  // Returns a math string to render based on an atom TextEditor object
  getMathFromEditor(editor, translations) {
    translations = translations || [];
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
    return [performTranslations(mathsTextIncludingEnds, translations.concat(standardTranslations)), true];
    // TODO change display mode.
  }

};
