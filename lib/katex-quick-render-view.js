'use babel';

import katex from 'katex';
import {
  CompositeDisposable,
  Disposable
} from 'atom';
import ParseMath from './parse-math.js';
import {evaluate} from 'mathjs';

// import defineMacro from 'katex'

// helper functions

// sort the first array in the order of the second
// complexity doesn't matter here.
function refSort (targetData, refData) {
  // Create an array of indices [0, 1, 2, ...N].
  var indices = Object.keys(refData);

  // Sort array of indices according to the reference data.
  indices.sort(function(indexA, indexB) {
    if (refData[indexA] < refData[indexB]) {
      return -1;
    } else if (refData[indexA] > refData[indexB]) {
      return 1;
    }
    return 0;
  });

  // Map array of indices to corresponding values of the target array.
  return indices.map(function(index) {
    return targetData[index];
  });
}

//return a number precise to 5 significant figures
function precise(x) {
  return Number.parseFloat(x).toPrecision(5);
}

// defineMacro("\\thisarbitraryfuckyoumacro", function(context) {return "fuck you"})


export default class KatexQuickRenderView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('katex-quick-render');
    this.editorSubs = new CompositeDisposable();
    this.subscriptions = atom.workspace.getCenter().observeActivePaneItem(item => {
      if (atom.workspace.isTextEditor(item)) {
        this.attachToEditor(item);
        console.log("attaching to editor");
      } else {
        console.log("not a text editor item", item);
        return;
      }
    });
    this.attachToEditor();
    this.editorSubs.add(this.addCss());
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
    this.subscriptions.dispose();
    this.editorSubs.dispose();
  }

  hasEditor() {
    return this.editor !== null && typeof this.editor != "undefined";
  }

  attachToEditor(editor) {
    this.editor = null;
    this.editor = editor || atom.workspace.getActiveTextEditor();
    if (this.hasEditor()) {
      this.editorSubs.add(this.editor.onDidChange(() => this.update()));
      this.editorSubs.add(this.editor.onDidChangeCursorPosition(() =>
        this.update()));
      this.update();
    } else console.warn("Couldn't attach to editor!");
  }

  // Call this every time the current math content could have updated,
  // including initially.
  update() {
    if (this.hasEditor()) {
      let [mathString, displayMode] = ParseMath.getMathFromEditor(this.editor);
      if (mathString != null) {
        this.render(mathString, displayMode);
      } else {
        this.clear();
      }
    }
  }

  getElement() {
    return this.element;
  }

  clear() {
    Array.prototype.forEach.call(this.element.children, child =>
      this.element.removeChild(child));
  }

  // Renders KaTeX maths string into the element.
  render(mathStr, displayMode) {
    this.clear();

    // Step through slices of mathStr starting with the longest and move to
    // just the first character and attempt to render the string.
    for (var i = mathStr.length; i >= 1; i--) {
      try {
        katex.render(mathStr.slice(0, i), this.element, {
          displayMode: displayMode,
          throwOnError: false, // Render errors rather than raise an error if possible
          trust: true,
          macros: {
            "\\pmat": "\\begin{pmatrix} #1 \\end{pmatrix}",
            "\\ev":      "\\left\\langle #1 \\right\\rangle",
            "\\bv":      "\\vec{\\mathbf{#1}}",
            "\\fuckyou": function(context) {
                            const args = context.consumeArgs(2);
                            return {tokens: args[0], numArgs: 0};
                        },
            "\\fpeval": function (context) {
                    const args = context.consumeArgs(1)

                    if (args.length == 0 || args[0].length == 0)
                    {
                        return ""
                    }

                    var sortorder = args[0].map(function(tok) {return tok.loc.start})

                    var expr = refSort(args[0].map(function(tok) {return tok.text}), sortorder).join('')

                    console.log(args)
                    console.log(expr)

                    try {
                        return precise(evaluate(expr)).toString()
                    } catch (e) {
                        return "\\textcolor{red}{\\text{undef}}"
                    }

            }
          }
        });
        break; // If haven't got an error at this point then its rendered
      } catch (e) {
        if (!(e instanceof katex.ParseError)) {
          throw e;
        }
      }
    }
    if (i != mathStr.length) {
      // Add a span containing the rest of the string that failed to be rendered.
      let failedStuff = document.createElement('span');
      failedStuff.classList.add('katex-failure');
      failedStuff.innerText = mathStr.slice(i);
      this.element.appendChild(failedStuff);
    }
  }

  addCss() {
    var link = document.createElement("link");

    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = atom.packages.getLoadedPackage('katex-quick-render').path +
                  "/node_modules/katex/dist/katex.css";

    document.head.appendChild(link);
    return new Disposable(() => {
      document.head.removeChild(link);
    });
  }

  getTitle() {
    return 'Katex Quick Render';
  }

  getURI() {
    return 'atom://katex-quick-render';
  }

  getDefaultLocation() {
    return 'bottom';
  }

  getAllowedLocations() {
    return ['left', 'right', 'bottom'];
  }
}
