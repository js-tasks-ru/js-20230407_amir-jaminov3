export default class DoubleSlider {
  slider = '';

  leftPosition = 0;
  rightPosition = 0;

  constructor({
    min = 0,
    max = 100,
    selected: {
      from = min,
      to = max
    } = {},
    formatValue = data => data
  } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;

    this.selected = {
      from: formatValue(from),
      to: formatValue(to)
    };

    this.render();
  }

  get template() {
    return `<div class="range-slider">
      <span data-element="from">${this.selected.from}</span>
      <div data-element="slider" class="range-slider__inner">
        <span data-element="progress" class="range-slider__progress" style="
            left: ${ (this.selected.from - this.min) / (this.max - this.min) * 100 }%;
            right: ${ (this.max - this.selected.to) / (this.max - this.min) * 100 }%
        "></span>
        <span data-element="leftSlider" style="left:
            ${ (this.selected.from - this.min) / (this.max - this.min) * 100 }%
        " class="range-slider__thumb-left"></span>
        <span data-element="rightSlider" style="right:
            ${ (this.max - this.selected.to) / (this.max - this.min) * 100 }%
        " class="range-slider__thumb-right"></span>
      </div>
      <span data-element="to">${this.selected.to}</span>
    </div>`;
  }

  initSubElements() {
    const result = {} ;
    const elements = this.element.querySelectorAll('[data-element]');
    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    this.subElements = result;
  }

  render() {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    this.initSubElements();
    this.initListeners();
  }

  moveRightSlider(event, maxWidth) {
    this.rightPosition = maxWidth - (event.clientX - 85);
    if (maxWidth - this.rightPosition > this.leftPosition && this.rightPosition >= 0) {
      this.subElements.rightSlider.style.right = this.rightPosition + 'px';
      this.subElements.progress.style.right = this.rightPosition + 'px';

      this.subElements.to.innerHTML = `${this.formatValue(Math.round(
        (maxWidth - this.rightPosition) / maxWidth * (this.max - this.min) + this.min
      ))}`;
    }
  }

  moveLeftSlider(event, maxWidth) {
    this.leftPosition = event.clientX - 80;
    if (maxWidth - this.rightPosition > this.leftPosition && this.leftPosition >= 0) {
      this.subElements.leftSlider.style.left = this.leftPosition + 'px';
      this.subElements.progress.style.left = this.leftPosition + 'px';
      this.subElements.from.innerHTML = `${this.formatValue(Math.round(
        (this.leftPosition) / maxWidth * (this.max - this.min) + this.min
      ))}`;
    }
  }

  pointerMoveOnSlider = (event) => {
    const maxWidth = this.subElements.slider.offsetWidth;

    if (event.target.dataset.element === 'leftSlider') {
      this.slider = 'left';
    } else if (event.target.dataset.element === 'rightSlider') {
      this.slider = 'right';
    }

    if (this.slider === 'right') {
      this.moveRightSlider(event, maxWidth);
    }

    if (this.slider === 'left') {
      this.moveLeftSlider(event, maxWidth);
    }
  }

  pointerDownOnSlider = () => {
    document.addEventListener('pointermove', this.pointerMoveOnSlider);
  }

  pointerUpOnSlider = () => {
    this.slider = null;
    document.removeEventListener('pointermove', this.pointerMoveOnSlider);
  }

  pointerOverOnSlider = () => {
    document.addEventListener('pointerdown', this.pointerDownOnSlider);
    document.addEventListener('pointerup', this.pointerUpOnSlider);
  }

  initListeners() {
    this.element.addEventListener('pointerover', this.pointerOverOnSlider);
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }
}
