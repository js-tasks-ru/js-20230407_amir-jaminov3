export default class NotificationMessage {
  static notification;

  constructor(message, {
    duration = 1000,
    type = 'success',
  } = {}) {
    this._message = message;
    this._type = type;
    this.duration = duration;

    this.createNotification();
  }

  get template() {
    return `
        <div class="notification ${this._type}" style="--value:${this.duration / 1000}s">
          <div class="timer"></div>
          <div class="inner-wrapper">
            <div class="notification-header">success</div>
            <div class="notification-body">
              ${this._message}
            </div>
          </div>
        </div>
    `;
  }

  createNotification() {
    if (NotificationMessage.notification) {
      NotificationMessage.notification.remove();
    }

    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;

    NotificationMessage.notification = this.element;
  }

  show(div = document.body) {
    this._timer = setTimeout(() => this.remove(), this.duration);

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
