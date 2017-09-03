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
  render(mathStr) {
    this.clear();
    // Step through slices of mathStr starting with the longest and move to
    // just the first character and attempt to render the string.
    for (var i = mathStr.length; i >= 1; i--) {
      try {
        katex.render(mathStr.slice(0, i), this.element);
        break;  // If haven't got an error at this point then its rendered
      } catch (e) {
        if (!(e instanceof katex.ParseError)) {
          console.log("Failed... but not a parse error...");
          debugger;
          throw e;
        }
      }
    }
    // Add a span containing the rest of the string that failed to be rendered.
    let failedStuff = document.createElement('span');
    failedStuff.classList.add('katex-failure');
    failedStuff.innerText = mathStr.slice(i);
    this.element.appendChild(failedStuff);
  }
}
