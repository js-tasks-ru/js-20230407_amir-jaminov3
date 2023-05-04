import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  static instance

  sorted = {
    id: 'title',
    order: 'asc'
  }

  pagination = 30

  range = {
    start: 0,
    end: this.pagination
  }

  data = []

  constructor(headerConfig, {
    url = '',
    isSortLocally = false,

  } = {}) {
    if (SortableTable.instance) {
      return SortableTable.instance;
    }
    this.isSortLocally = isSortLocally;
    this.url = url;
    this.headerConfig = headerConfig;

    this.updateFullUrl();
    this.render();
    SortableTable.instance = this;
  }

  increaseRange() {
    this.range = {
      start: this.range.start + 30,
      end: this.range.end + 30
    };
  }

  setDefaultRange() {
    this.range = {
      start: 0,
      end: 30
    };
  }

  updateFullUrl() {
    const fullUrl = new URL(this.url, BACKEND_URL);
    fullUrl.searchParams.set('_start', this.range.start);
    fullUrl.searchParams.set('_end', this.range.end);
    fullUrl.searchParams.set('_sort', this.sorted.id);
    fullUrl.searchParams.set('_order', this.sorted.order);

    this.fullUrl = fullUrl;
  }

  async render() {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;
    this.initSubElements();

    if (this.isSortLocally) {
      this.data = this.sortOnClient(this.sorted.id, this.sorted.order);
      this.subElements.body.innerHTML = this.getTableRows(this.data);
    } else {
      await this.getFetchPromise().then(this.loadData);
    }

    this.initListeners();
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

  getHeaderRow({id, title, sortable}) {
    const arrow = this.sorted.id === id
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
      : '';
    return `
      <div class="sortable-table__cell" data-id="${id}" data-order="${this.sorted.id === id ? this.sorted.order : 'asc'}" data-sortable="${sortable}">
        <span>${title}</span>
        ${arrow}
      </div>`;
  }

  get tableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.headerConfig.map(item => this.getHeaderRow(item)).join('')}
            </div>`;
  }

  getTableRow(product) {
    const cells = this.headerConfig.map(({id, template}) => {
      return { id, template };
    });

    return cells.map(({id, template}) => {
      return template
        ? template(product[id])
        : `<div class="sortable-table__cell">${product[id]}</div>`;
    }).join('');
  }

  getTableRows(data = []) {
    return data.map(item => {
      return `<a href="/products/${item.id}" class= "sortable-table__row">
            ${this.getTableRow(item)}
        </a>`;
    }).join('');
  }

  onClick = event => {
    const column = event.target.closest('[data-sortable="true"]');

    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc'
      };

      return orders[order];
    };

    if (column) {
      const { id, order } = column.dataset;
      const newOrder = toggleOrder(order);
      const arrow = column.querySelector('.sortable-table__sort-arrow');
      if (!arrow) {
        column.append(this.subElements.arrow);
      }

      column.dataset.order = newOrder;

      if (this.isSortLocally) {
        this.data = this.sortOnClient(this.sorted.id, this.sorted.order);
        this.subElements.body.innerHTML = this.getTableRows(this.data);
      } else {
        this.sortOnServer(id, newOrder);
      }
    }
  }

  get tableBody() {
    return `<div data-element="body" class="sortable-table__body">
                ${this.getTableRows(this.data)}
            </div>`;
  }

  get template() {
    return `
        <div data-element="main" class="sortable-table sortable-table_loading">
            ${this.tableHeader}
            ${this.tableBody}
        </div>
    `;
  }

  scrollEndEvent(event) {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement;
    const table = SortableTable.instance;
    if (scrollTop + clientHeight >= scrollHeight - 5 && !table.isSortLocally) {
      table.increaseRange();
      table.getFetchPromise().then(table.appendData);
    }

  }

  initListeners() {
    const headerCells = this.subElements.header;
    headerCells.addEventListener('pointerdown', this.onClick);

    window.addEventListener('scroll', this.scrollEndEvent);
  }

  sortOnClient (id, order) {
    return this.sort(id, order);
  }

  sortOnServer (id, order) {
    this.sorted = { id, order };
    this.setDefaultRange();

    this.getFetchPromise().then(this.loadData);
    return this.sort(id, order);
  }

  loadData = (data) => {
    if (data) {
      this.data = data;
      this.subElements.body.innerHTML = this.getTableRows(this.data);
      this.element.classList.remove("sortable-table_loading");
    }
  }

  appendData = (data) => {
    if (data) {
      this.data = data;
      this.subElements.body.innerHTML += this.getTableRows(this.data);
    }
  }

  getFetchPromise () {
    try {
      this.updateFullUrl();
      return fetchJson(this.fullUrl, {
        method: 'GET',
      });
    } catch (FetchError) {
      return new Promise(() => []);
    }
  }

  sort(id, order) {
    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === id);
    const {sortType, customSorting} = column;
    const direction = order === 'asc' ? 1 : -1;

    return arr.sort(function (a, b) {
      switch (sortType) {
      case 'number':
        return direction * (a[id] - b[id]);
      case 'string':
        return direction * a[id].localeCompare(b[id], ['ru', 'en']);
      default:
        throw new Error();
      }
    });
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }
}
