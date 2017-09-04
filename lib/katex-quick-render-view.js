'use babel';

import katex from 'katex';

export default class KatexQuickRenderView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('katex-quick-render');
    this.reset();
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  reset() {
    this.clear();
  }

  clear() {
    Array.prototype.forEach.call(this.element.children, child =>
      this.element.removeChild(child));
  }

  // Renders KaTeX maths string into the element.
  render(mathStr, displayMode) {
    this.clear();
    katex.render(mathStr, this.element, {
      displayMode: displayMode,
      throwOnError: false // Render errors rather than raise an error
    });
  }
}
