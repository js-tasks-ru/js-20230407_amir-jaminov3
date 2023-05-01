export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  getSubElements(element) {
    const result = {} ;
    const elements = element.querySelectorAll('[data-element]');
    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result [name] = subElement;
    }

    return result;
  }

  getHeaderRow({id, title, sortable}) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}"">
        <span>${title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
        </span>
      </div>`;
  }

  get tableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.headerConfig.map(item => this.getHeaderRow(item)).join('')}
            </div>`;
  }

  getTableRow(product) {
    const cells = this.headerConfig.map(({id, template}) => {
      return {
        id,
        template
      };
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

  render() {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  sort(fieldValue, orderValue) {
    const sortedData = this.data.sort(function (a, b) {
      let sortOrder;
      if (typeof a[fieldValue] === 'number') {
        sortOrder = a[fieldValue] - b[fieldValue];
      } else {
        sortOrder = a[fieldValue].toLowerCase().localeCompare(b[fieldValue].toUpperCase(), ['ru', 'en']);
      }

      return orderValue === 'asc' ? sortOrder : -sortOrder;
    });

    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }
}

