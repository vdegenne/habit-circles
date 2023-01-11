import { Dialog } from '@material/mwc-dialog';
import { html, LitElement, nothing, PropertyValueMap } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import ms from 'ms';
import { connect } from 'pwa-helpers';
import { green, strictRed } from '../constants.js';
import { Habit } from '../objects/Habit.js';
import { RootState, store } from '../redux/store.js';
import { sharedStyles } from '../styles/sharedStyles.js';


@customElement('habit-dialog')
export class HabitDialog extends connect(store)(LitElement) {
  @state() private habits?: Habit[] = []
  @state() private habitId?: string;

  @query('mwc-dialog') dialog!: Dialog;

  stateChanged (state: RootState) {
    this.habits = state.data.habits;
  }

  static styles = [sharedStyles]

  render () {
    const habit = this.habits?.find(habit => habit.id == this.habitId)

    return html`
    <mwc-dialog>

      <div id=content style="margin-top:29px;line-height:32px;">
        <div><b>Frequency</b>: every ${ms(ms(habit?.frequency || '1d'), {long:true})}</div>
        ${!habit?.isAllowed ? html`
        <div flexcenter><mwc-icon>lock_clock</mwc-icon>next unlock in ${ms(habit?.getRemainingTime() || 0, {long:true})}</div>
        ` : nothing}
      </div>

      <div slot="secondaryAction" flexcenter>
        <mwc-icon-button icon="edit"></mwc-icon-button>
        <mwc-icon-button slot="secondaryAction" unelevated icon="delete"
          @click=${async ()=>{
            if (!confirm('Are you sure you want to delete this habit?')) { return }
            await habit?.destroy();
            this.dialog.close()
            window.toast('deleted', 1500)
          }}
        ></mwc-icon-button>

        <mwc-button slot="secondaryAction" unelevated
          raised
          style="--mdc-theme-primary:${habit?.isAllowed ? green : strictRed};margin-left:12px;"
          icon="${habit?.isAllowed ? 'thumb_up' : 'block'}"
          @click=${async ()=>{
            if (!confirm('Do you confirm you did this action?')) { return }
            await habit?.updateTouchTime();
            // this.dialog.close()
            // window.toast('updated', 1500)
            }}
        >I DID IT</mwc-button>
      </div>
      <mwc-button slot="primaryAction" dialogAction="close" outlined>close</mwc-button>
    </mwc-dialog>
    `
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    setInterval(() => this.requestUpdate(), 1000)
  }

  open (habit: Habit) {
    this.habitId = habit.id;

    // @ts-ignore
    this.dialog.heading = html`
    <style> #title::before { height: 0px !important; } </style>
    <div style="display:flex;align-items:center;height:6px;">
      <mwc-icon style="margin-right:8px;color:${habit.color}">${habit.iconName}</mwc-icon><span>${habit.name}</span>
    </div>
    `

    this.dialog.show()
  }
}