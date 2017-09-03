'use babel';

import KatexQuickRenderView from './katex-quick-render-view';
import CompositeDisposable from 'atom';

export default {

  katexQuickRenderView: null,
  modalPanel: null,
  subscriptions: null,

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

  toggle() {
    console.log('KatexQuickRender was toggled!');
    this.katexQuickRenderView.render("c = \\pm\\sqrt{a^2 + b^2}");
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
