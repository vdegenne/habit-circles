import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { connect } from 'pwa-helpers';
import { store } from '../redux/store.js';

@customElement('view-element')
export class ViewElement extends connect(store)(LitElement) {
  @property({ type: Boolean }) protected active = false

  shouldUpdate () {
    return this.active;
  }
}