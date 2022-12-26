import './redux/store.js'
import './app.js'
import './dialogs/habit-edit-dialog.js'
import { AppContainer } from './app.js';

// views
import './views/habits-view.js'
import './views/login-view.js'
import './firebase.js'
// dialogs
import './dialogs/habit-dialog.js'

import '@material/mwc-snackbar'
import '@material/mwc-button'
import '@material/mwc-icon-button'
import '@material/mwc-dialog'
import '@material/mwc-textfield'
import '@material/mwc-select'
import '@material/mwc-fab'
import { html, render, TemplateResult } from 'lit';
import { Snackbar } from '@material/mwc-snackbar';
// import '@material/mwc-checkbox'


declare global {
  interface Window {
    app: AppContainer;
    snackbar: Snackbar;
    toast: (label: string, timeoutMs?: number, content?: TemplateResult) => void;
  }
}


let toastTimeout: NodeJS.Timeout|undefined
window.toast = async function (label: string, timeoutMs = 4000, content?: TemplateResult) {
  if (toastTimeout) {
    clearTimeout(toastTimeout)
    toastTimeout = undefined
  }
  window.snackbar.close()
  await window.snackbar.updateComplete
  window.snackbar.labelText = label;
  if (content)
    render(content, window.snackbar)
  else {
    render(html``, window.snackbar)
  }

  if (timeoutMs >= 4000 || timeoutMs === -1) {
    window.snackbar.timeoutMs = timeoutMs;
    window.snackbar.open = true;
  }
  else {
    window.snackbar.timeoutMs = -1;
    window.snackbar.open = true;
    toastTimeout = setTimeout(function () {
      window.snackbar.close()
    }, timeoutMs)
  }
}