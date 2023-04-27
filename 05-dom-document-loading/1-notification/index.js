export default class NotificationMessage {
  constructor(message, {
    duration = 1000,
    type = 'success',
  } = {}) {
    this._message = message;
    this._type = type;
    this._duration = duration;

    this.createNotification();
  }

  get template() {
    return `
      <div class="notification ${this._type}">
        <div class="notification-header">
          Header
        </div>
        <div class="notification-body">
           ${this._message}
        </div>
        <div class="timer"></div>
      </div>
    `;
  }

  createNotification() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.template;

    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
      oldNotification.remove();
    }

    this.element = wrapper.firstElementChild;
  }

  show(div = document.body) {
    this._timer = setTimeout(() => this.remove(), this._duration);

    div.append(this.element);
  }

  remove() {
    clearTimeout(this._timer);

    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
  }
}
