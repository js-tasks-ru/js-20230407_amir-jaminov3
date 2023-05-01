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
    this.addListeners();
  }

  addListeners() {
    const headerCells = this.subElements.header.querySelectorAll('.sortable-table__cell');

    const sortableTable = this;

    for (const cell of headerCells) {
      cell.addEventListener('pointerdown', function () {
        if (this.dataset.sortable) {
          if (sortableTable.sorted.id === this.dataset.id) {
            sortableTable.sorted.order = sortableTable.sorted.order === 'desc' ? 'asc' : 'desc';
          } else {
            sortableTable.sorted = {
              id: this.dataset.id,
              order: 'asc'
            };
          }
        }

        sortableTable.sort(sortableTable.sorted);
      });
    }

    this.sort(sortableTable.sorted);
  }

  sort({id, order}) {
    const sortedData = this.data.sort(function (a, b) {
      let sortOrder;
      if (typeof a[id] === 'number') {
        sortOrder = a[id] - b[id];
      } else {
        sortOrder = a[id].toLowerCase().localeCompare(b[id].toUpperCase(), ['ru', 'en']);
      }

      return order === 'asc' ? sortOrder : -sortOrder;
    });

    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }
}
