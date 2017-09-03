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
  editorSubs: null,

  activate(state) {
    this.katexQuickRenderView = new KatexQuickRenderView(state.katexQuickRenderViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.katexQuickRenderView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    this.editorSubs = new CompositeDisposable(); // To be disposed when editor changed.

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
    if (this.hasEditor() && this.modalPanel.isVisible()) {
      console.debug('Ready to update');
      let selection = this.editor.getSelectedText();
      let mathString = ParseMath.getMathFromEditor(this.editor);
      if (mathString != null) {
        this.katexQuickRenderView.render(mathString);
      } else {
        this.katexQuickRenderView.reset();
      }
    } else console.debug('Not ready to update', this.editor,
      this.modalPanel.isVisible());
  },

  hasEditor() {
    return this.editor !== null && typeof this.editor != "undefined";
  },

  attachToEditor() {
    this.detachFromEditor(); // Remove event listeners
    this.editor = atom.workspace.getActiveTextEditor();
    if (this.hasEditor()) {
      console.debug('Attached to editor', this.editor);
      this.editorSubs.add(this.editor.onDidChange(() => this.update()));
      this.editorSubs.add(this.editor.onDidChangeCursorPosition(() =>
        this.update()));
      this.update();
    } else console.debug('No editor to attach to!');
  },

  detachFromEditor() {
    this.editor = null;
    this.editorSubs.dispose();
  },

  // Toggle the pane visibility.
  toggle() {
    console.debug('KatexQuickRender was toggled!');
    if (this.modalPanel.isVisible()) {
      console.debug('Hiding KatexQuickRender.modalPanel...');
      this.modalPanel.hide();
      this.katexQuickRenderView.reset();
      this.detachFromEditor();
    } else {
      console.debug('Showing KatexQuickRender.modalPanel...');
      this.modalPanel.show();
      this.attachToEditor();
    }
  }

};
