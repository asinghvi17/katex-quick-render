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
    Array.prototype.forEach.call(this.element.children, child =>
      this.element.removeChild(child));
    // Create message element
    const message = document.createElement('div');
    message.textContent = 'Nothing here - try moving to a LaTeX math element.';
    // message.classList.add('message');
    this.element.appendChild(message);
  }

  // Renders KaTeX maths string into the element.
  render(mathStr) {
    try {
      katex.render(mathStr, this.element);
    } catch (e) {
      if (e instanceof katex.ParseError)
        console.log("parse error!");
      else {
        console.log("Another error...!");
        debugger;
      }
    }
  }

}
