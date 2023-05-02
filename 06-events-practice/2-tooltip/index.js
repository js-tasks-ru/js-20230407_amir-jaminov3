class Tooltip {
  static instance;

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    }

    return Tooltip.instance;
  }

  initialize () {
    this.initListeners();
  }

  render (html) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<div class="tooltip">${html}</div>`;

    this.element = wrapper.firstElementChild;

    document.body.append(this.element);
  }

  documentPointMove = event => {
    this.element.style.left = (event.clientX + 10) + 'px';
    this.element.style.top = (event.clientY + 10) + 'px';
  }

  documentPointOver = event => {
    const element = event.target.closest('[data-tooltip]');

    if (element) {
      this.render(element.dataset.tooltip);
      document.body.addEventListener('pointermove', this.documentPointMove);
    }
  }

  documentPointerOut = () => {
    this.destroy();
    document.body.removeEventListener('pointermove', this.documentPointMove);
  }

  initListeners () {
    document.body.addEventListener('pointerover', this.documentPointOver);
    document.body.addEventListener('pointerout', this.documentPointerOut);
  }

  destroy () {
    if (this.element) {
      this.element.remove();
    }
  }
}

export default Tooltip;
