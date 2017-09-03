'use babel';

import KatexQuickRenderView from './katex-quick-render-view';
import {
  CompositeDisposable
} from 'atom';
import ParseMath from './parse-math.js';

export default {

  katexQuickRenderView: null,
  modalPanel: null,
  subscriptions: null,
  editor: null,
  _editorDisposable: null,

  activate(state) {
    this.katexQuickRenderView = new KatexQuickRenderView(state.katexQuickRenderViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.katexQuickRenderView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'katex-quick-render:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.katexQuickRenderView.destroy();
  },

  serialize() {
    return {
      katexQuickRenderViewState: this.katexQuickRenderView.serialize()
    };
  },

  // Call this every time the current math content could have updated,
  // including initially.
  update() {
    if (this._hasEditor() && this.modalPanel.isVisible()) {
      console.debug('Update is on!');
      let selection = this.editor.getSelectedText();
      let mathString = ParseMath.getMathFromEditor(this.editor);
      if (mathString != null) {
        this.katexQuickRenderView.render(mathString);
      }
    } else console.debug('Update failed', this.editor,
      this.modalPanel.isVisible());
  },

  _hasEditor() {
    return this.editor !== null && typeof this.editor != "undefined";
  },

  _attachToEditor() {
    this._detachFromEditor(); // Remove event listeners
    this.editor = atom.workspace.getActiveTextEditor();
    if (this._hasEditor()) {
      console.debug('Attached to editor', this.editor);
      this.subscriptions.add(this.editor.onDidChange(() => this.update()));
      this.update();
    } else console.debug('No editor to attach to!');
  },

  _detachFromEditor() {
    this.editor = null;
    this.subscriptions.remove(this._editorDisposable);
  },

  // Toggle the pane visibility.
  toggle() {
    console.debug('KatexQuickRender was toggled!');
    if (this.modalPanel.isVisible()) {
      console.debug('KatexQuickRender.modalPanel was already visible');
      this.modalPanel.hide();
      this.katexQuickRenderView.reset();
      this._detachFromEditor();
    } else {
      console.debug('KatexQuickRender.modalPanel wasn\'t already visible');
      this.modalPanel.show();
      this._attachToEditor();
    }
  }

};
