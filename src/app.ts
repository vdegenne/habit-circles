import { LitElement, html, PropertyValueMap, css, nothing } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { PageValue, pageValues, setPage, User } from './redux/slices/app.js'
import { RootState, store } from './redux/store.js'
import { connect } from 'pwa-helpers'
import { signOut } from 'firebase/auth'
import { auth } from './firebase.js'
import { HabitEditDialog } from './dialogs/habit-edit-dialog.js'
import { Firestore } from './firestore.js'
import { sharedStyles } from './styles/sharedStyles.js'
// import { connect, watch } from 'lit-redux-watch'


@customElement('app-container')
export class AppContainer extends connect(store)(LitElement) {

  @state() page!: PageValue;
  @state() user?: User;

  stateChanged (state: RootState) {
    this.page = state.app.page
    this.user = state.app.user
  }


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
    align-items: center;
    padding-left: 6px;
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
      <mwc-button disabled icon=join_full><span style="text-transform:none !important">HabitCircles</span></mwc-button>
      ${this.user ? html`
      <div style="display:flex;align-items:center">
        <mwc-button @click=${()=>{this.onAddHabitButtonClick()}} icon="add" outlined>new habit</mwc-button>
        <mwc-icon-button @click=${()=>{signOut(auth)}}>
          <img src="${this.user?.photoURL}">
        </mwc-icon-button>
      </div>
      ` : nothing}
    </header>

    <div id=pages>
      <habits-view class=page ?active=${this.page == ''}></habits-view>
      <login-view class=page ?active=${this.page == 'login'}></login-view>
    </div>
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
