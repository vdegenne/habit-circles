import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { auth } from '../firebase.js';
import { ViewElement } from './view-element.js';

@customElement('login-view')
export class LoginView extends ViewElement {
  render () {
    return html`
    <mwc-button raised @click=${()=>{this.onConnectButtonClick()}}>connect</mwc-button>
    `
  }

  onConnectButtonClick() {
    signInWithPopup(auth, new GoogleAuthProvider)
  }
}