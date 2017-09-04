'use babel';

import KatexQuickRender from '../lib/katex-quick-render';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('KatexQuickRender', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('katex-quick-render');
  });

  describe('when the katex-quick-render:toggle event is triggered', () => {

  });
});
