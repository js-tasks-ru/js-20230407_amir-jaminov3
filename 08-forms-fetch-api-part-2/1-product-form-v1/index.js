import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  productData = {
    title: '',
    description: '',
    images: [],
    subcategory: '',
    price: 0,
    discount: 0,
    amount: 0,
    status: 0,
  }

  constructor (productId = null) {
    this.productId = productId;
  }

  renderFieldSet(name,
    type,
    title,
    placeholder = '',
    value = '' | 0
  ) {
    const v = type === 'text' ? escapeHtml(value) : value;

    return `<fieldset>
                <label class="form-label">${title}</label>
                <input required="" type="${type}" name="${name}" value="${v}" class="form-control" placeholder="${placeholder}">
            </fieldset>`;
  }

  renderTextArea(value = '') {
    return `<div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">${value}</textarea>
      </div>`;
  }

  renderSubFormImage(images) {
    return images.map(item => {
      return `<li class="products-edit__imagelist-item sortable-list__item" style="">
                <input type="hidden" name="url" value="${item.url}">
                <input type="hidden" name="source" value="${item.source}">
                <span>
                  <img src="icon-grab.svg" data-grab-handle="" alt="grab">
                  <img class="sortable-table__cell-img" alt="Image" src="${item.url}">
                  <span>${item.source}</span>
                </span>
                <button type="button">
                  <img src="icon-trash.svg" data-delete-handle="" alt="delete">
                </button>
              </li>`;
    }).join('');
  }

  renderFormImage(images = []) {
    return `<div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer"><ul class="sortable-list">${this.renderSubFormImage(images)}</ul></div>
        <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>`;
  }

  renderSubcategoryOptions(categoryName, subcategory, selected) {
    return subcategory.map(item => {
      return `<option ${item.id === selected ? 'selected="selected"' : ''} value="progulki-i-detskaya-komnata">${categoryName} > ${escapeHtml(item.title)}</option>`;
    }).join('');
  }

  renderCategoryOptions(category, selected) {
    return category.map(item => {
      return this.renderSubcategoryOptions(item.title, item.subcategories, selected);
    }).join('');
  }

  renderCategoryList(category, selected = '') {
    return `<div class="form-group form-group__half_left">
              <label class="form-label">Категория</label>
              <select class="form-control" name="subcategory">
                ${this.renderCategoryOptions(category, selected)}
              </select>
            </div>`;
  }

  renderAmount(amount = 0) {
    return `<div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" value="${amount}" class="form-control" name="quantity" placeholder="1">
      </div>`;
  }

  renderStatus(status = 0) {
    return `<div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" name="status">
          <option ${status === 1 ? 'selected="selected"' : ''}  value="1">Активен</option>
          <option ${status === 0 ? 'selected="selected"' : ''} value="0">Неактивен</option>
        </select>
      </div>`;
  }

  get template() {
    return `<div class="product-form">
              <form data-element="productForm" class="form-grid">
                ${this.renderFieldSet('title', 'text', 'Название товара', 'Название товара', this.productData.title)}
                ${this.renderTextArea(this.productData.description)}
                ${this.renderFormImage(this.productData.images)}
                ${this.renderCategoryList(this.category, this.productData.subcategory)}
                <div class="form-group form-group__half_left form-group__two-col">
                    ${this.renderFieldSet('price', 'number', 'Цена', '100', this.productData.price)}
                    ${this.renderFieldSet('discount', 'number', 'Скидка', '0', this.productData.discount)}
                </div>
                ${this.renderAmount(this.productData.amount)}
                ${this.renderStatus(this.productData.status)}
                <div class="form-buttons">
                  <button type="submit" name="save" class="button-primary-outline">
                    Сохранить товар
                  </button>
                </div>
              </form>
            </div>`;
  }

  async fetchData() {
    const categoryUrl = new URL('api/rest/categories', BACKEND_URL);
    categoryUrl.searchParams.set('_sort', 'weight');
    categoryUrl.searchParams.set('_refs', 'subcategory');

    const promises = [fetchJson(categoryUrl)];
    if (this.productId) {
      const productUrl = new URL('api/rest/products', BACKEND_URL);
      productUrl.searchParams.set('id', this.productId);

      promises.push(fetchJson(productUrl));
    } else {
      const plugPromise = Promise.resolve([this.productData]);
      promises.push(plugPromise.then());
    }

    return await Promise.all(promises);
  }

  addListeners() {
    this.subElements.productForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const body = new FormData(this.subElements.productForm);

      let method = 'POST';

      if (this.productId) {
        body.append('id', this.productId);
        method = 'PATCH';
      }

      await fetchJson(new URL('api/rest/products', BACKEND_URL), {
        method: method,
        body: body
      });
    });
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

  async render () {
    const wrapper = document.createElement('div');

    [this.category, [this.productData]] = await this.fetchData();

    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.addListeners();
  }

  destroy() {
    this.element.remove();
  }
}
