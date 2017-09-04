'use babel';

import katex from 'katex';
import {
  CompositeDisposable,
} from 'atom';
import ParseMath from './parse-math.js';

export default class KatexQuickRenderView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('katex-quick-render');
    this.editorSubs = new CompositeDisposable();
    this.subscriptions = atom.workspace.getCenter().observeActivePaneItem(item => {
      if (atom.workspace.isTextEditor(item)){
        this.attachToEditor(item);
        console.log("attaching to editor");
      } else {
        console.log("not a text editor item", item);
        return;
      }
    });
    this.attachToEditor();
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
    this.detachFromEditor(); // Remove event listeners
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
      console.debug("katex-quick-render update()");
      let [mathString, displayMode] = ParseMath.getMathFromEditor(this.editor);
      if (mathString != null) {
        this.render(mathString, displayMode);
      } else {
        this.clear();
      }
    }
  }

  detachFromEditor() {
    this.editor = null;
    this.editorSubs.dispose();
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
    try {
      katex.render(mathStr, this.element, {
        displayMode: displayMode,
        throwOnError: false // Render errors rather than raise an error
      });
    } catch (e) {
      console.log("Error while rendering!");
    }
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
