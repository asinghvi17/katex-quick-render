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
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.katex-quick-render')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'katex-quick-render:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.katex-quick-render')).toExist();

        let katexQuickRenderElement = workspaceElement.querySelector('.katex-quick-render');
        expect(katexQuickRenderElement).toExist();

        let katexQuickRenderPanel = atom.workspace.panelForItem(katexQuickRenderElement);
        expect(katexQuickRenderPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'katex-quick-render:toggle');
        expect(katexQuickRenderPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.katex-quick-render')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'katex-quick-render:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let katexQuickRenderElement = workspaceElement.querySelector('.katex-quick-render');
        expect(katexQuickRenderElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'katex-quick-render:toggle');
        expect(katexQuickRenderElement).not.toBeVisible();
      });
    });

    it('parses maths correctly', () => {
      expect(KatexQuickRender.parseText("$math$")).toEqual(["math"]);
      expect(KatexQuickRender.parseText("$$math$$")).toEqual(["math"]);
      expect(KatexQuickRender.parseText("$$mat\nh$$")).toEqual(["mat\nh"]);
    });
  });
});
