class Tooltip {
  static instance;
  static flag;

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    }

    return Tooltip.instance;
  }

  initialize () {
    this.render();
  }

  render () {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<div class="tooltip"></div>`;

    this.element = wrapper.firstElementChild;

    document.body.append(this.element);

    this.addListeners();
  }

  addListeners () {
    const divs = document.querySelectorAll('div');
    const element = Tooltip.instance.element;

    for (const div of divs) {
      div.addEventListener('pointerover', function (e) {
        if (e.defaultPrevented) {
          return false;
        }

        if (e.target.dataset.tooltip) {
          document.body.append(element);
          Tooltip.flag = true;

          element.innerHTML = e.target.dataset.tooltip;
          element.style.left = e.clientX + 'px';
          element.style.top = e.clientY + 'px';
          e.preventDefault();
        }
      });

      div.addEventListener('pointermove', function (e) {
        if (Tooltip.flag) {
          element.style.left = e.clientX + 'px';
          element.style.top = e.clientY + 'px';
        }
      });

      div.addEventListener('pointerout', function (e) {
        if (e.defaultPrevented) {
          return false;
        }

        Tooltip.flag = false;
        element.remove();

        e.preventDefault();
      });
    }
  }

  destroy () {
    if (this.element) {
      this.element.remove();
    }
  }
}

export default Tooltip;
