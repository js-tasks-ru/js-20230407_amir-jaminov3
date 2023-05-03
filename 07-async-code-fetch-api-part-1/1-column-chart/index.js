import fetchJson, {FetchError} from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  subElements = {};
  chartHeight = 50;
  data = [];

  constructor({
    url = '',
    range = {},
    label = '',
    link = '#'
  } = {}) {
    this.url = url;
    this.label = label;
    this.link = link;
    this.fullUrl = this.getFullUrl(url, range);

    this.render();
  }

  getFullUrl(url, range) {
    const fullUrl = new URL(url, BACKEND_URL);
    if (range.from) {
      fullUrl.searchParams.set('from', range.from.toISOString());
    }
    if (range.to) {
      fullUrl.searchParams.set('to', range.to.toISOString());
    }

    return fullUrl;
  }

  get template() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${ this.chartHeight }">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
           <div data-element="header" class="column-chart__header">
             ${this.value}
           </div>
          <div data-element="body" class="column-chart__chart">
            ${this.getColumnBody()}
          </div>
        </div>
      </div>
    `;
  }

  initData = (data) => {
    this.rawData = data;
    this.updateChart(Object.values(data));
    this.element.classList.remove("column-chart_loading");
  }

  render() {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;

    this.getFetchPromise().then(this.initData);

    this.subElements = this.getSubElements();
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  getFetchPromise () {
    try {
      return fetchJson(this.fullUrl, {
        method: 'GET',
      });
    } catch (FetchError) {
      return new Promise(() => []);
    }
  }

  getColumnBody() {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    return this.data
      .map(item => {
        const percent = ((item / maxValue) * 100).toFixed(0);

        return `<div style="--value: ${Math.floor(
          item * scale
        )}" data-tooltip="${percent}%"></div>`;
      })
      .join("");
  }

  getLink() {
    return this.link
      ? `<a class="column-chart__link" href="${this.link}">View all</a>`
      : "";
  }

  updateChart(data = []) {
    if (!data.length) {
      this.element.classList.add("column-chart_loading");
    }

    this.data = data;
    this.subElements.body.innerHTML = this.getColumnBody();
  }

  update(from, to) {
    this.fullUrl = this.getFullUrl(this.url, { from, to });
    this.getFetchPromise().then(this.initData);

    return this.rawData;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element.remove();
  }
}
