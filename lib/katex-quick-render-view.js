'use babel';

import katex from 'katex';
import {
  CompositeDisposable,
  Disposable
} from 'atom';
import ParseMath from './parse-math.js';

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
          throwOnError: false // Render errors rather than raise an error if possible
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
