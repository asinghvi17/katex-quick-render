'use babel';

import KatexQuickRenderView from './katex-quick-render-view';
import {
  CompositeDisposable,
  Disposable
} from 'atom';

export default {

  subscriptions: null,
  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable(
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://katex-quick-render') {
          return new KatexQuickRenderView();
        }
      }),
      atom.commands.add('atom-workspace', {
        'katex-quick-render:toggle': () => this.toggle()
      }),
      new Disposable(() => {  // call this when the packge is deactivated
        atom.workspace.getPaneItems().forEach(item => {
          if (item instanceof ActiveEditorInfoView) {
            item.destroy();
          }
        });
      })
    );
    this.editorSubs = new CompositeDisposable(); // To be disposed when editor changed.

  },

  deactivate() {
    this.subscriptions.dispose();
  },

  // Toggle the pane visibility.
  toggle() {
    atom.workspace.toggle('atom://katex-quick-render');
  }

};
