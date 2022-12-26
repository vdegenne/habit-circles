import { LitElement, html, PropertyValueMap, css, nothing } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { PageValue, pageValues, setPage, User } from './redux/slices/app.js'
import { RootState, store } from './redux/store.js'
import { connect } from 'pwa-helpers'
import { signOut } from 'firebase/auth'
import { auth } from './firebase.js'
import { HabitEditDialog } from './dialogs/habit-edit-dialog.js'
import { Firestore } from './firestore.js'
import { sharedStyles } from './styles/sharedStyles.js'
import { HabitDialog } from './dialogs/habit-dialog.js'
import { appName } from './constants.js'
// import { connect, watch } from 'lit-redux-watch'


@customElement('app-container')
export class AppContainer extends connect(store)(LitElement) {

  @state() page!: PageValue;
  @state() user?: User;

  stateChanged (state: RootState) {
    this.page = state.app.page
    this.user = state.app.user
  }

  @query('habit-dialog') habitDialog!: HabitDialog;


  processHash () {
    const crumbs = window.location.hash.slice(2).split('/')
    const page = crumbs[0]
    if (pageValues.includes(page as PageValue)) {
      store.dispatch(setPage(page as PageValue))
    }
    else {
      store.dispatch(setPage('404'))
    }
  }


  static styles = [sharedStyles, css`
  header {
    display: flex;
    justify-content: space-between;
    /* padding-left: 12px; */
  }
  .page {
    display: none;
    margin-top: 42px;
  }
  .page[active] {
    display: block;
  }
  `]

  render () {
    return html`
    <header>
      <!-- <mwc-button disabled icon=join_full><span style="text-transform:none !important">HabitCircles</span></mwc-button> -->
      <div flexcenter style="align-items:center">
        <img src="./img/android-chrome-192x192.png" width=22 style="margin:15px;filter:grayscale(1)">
        <!-- <span style=";font-size:1.3em;color:grey">${appName}</span> -->
      </div>
      ${this.user ? html`
      <div style="display:flex;align-items:center">
        <mwc-button @click=${()=>{this.onAddHabitButtonClick()}} icon="add" outlined>new habit</mwc-button>
        <mwc-icon-button @click=${()=>{signOut(auth)}}>
          <img src="${this.user?.photoURL}" style="border-radius:50%">
        </mwc-icon-button>
      </div>
      ` : nothing}
    </header>

    <div id=pages>
      <habits-view class=page ?active=${this.page == ''}></habits-view>
      <login-view class=page ?active=${this.page == 'login'}></login-view>
    </div>

    <mwc-fab icon="add"></mwc-fab>

    <habit-dialog></habit-dialog>
    `
  }

  async onAddHabitButtonClick() {
    const dialog = new HabitEditDialog(document.body)
    try {
      const habit = await dialog.open()
      Firestore.createHabit(habit)
    } catch (e) {
      /* canceled */
    }
  }
}
