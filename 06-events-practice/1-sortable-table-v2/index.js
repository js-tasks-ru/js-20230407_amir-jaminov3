export default class SortableTable {
  constructor(headerConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;

    this.render();
  }

  render() {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;
    this.initSubElements();
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
        ? '<div class="sortable-table__cell"></div>'//template(product[id])
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
      const sortedData = this.sort(id, newOrder);
      const arrow = column.querySelector('.sortable-table__sort-arrow');

      column.dataset.order = newOrder;

      if (!arrow) {
        column.append(this.subElements.arrow);
      }

      this.subElements.body.innerHTML = this.getTableRows(sortedData);
    }
  }

  get tableBody() {
    return `<div data-element="body" class="sortable-table__body">
                ${this.getTableRows(this.data)}
            </div>`;
  }

  get template() {
    return `
        <div class="sortable-table">
            ${this.tableHeader}
            ${this.tableBody}
        </div>
    `;
  }

  initListeners() {
    const headerCells = this.subElements.header;
    headerCells.addEventListener('pointerdown', this.onClick);
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
