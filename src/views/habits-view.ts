import { html, nothing, PropertyValueMap, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Habit } from '../objects/Habit.js';
import { RootState } from '../redux/store.js';
import { ViewElement } from './view-element.js';
import { red } from '../constants.js';
import styles from '../styles/HabitsViewStyles.css';
// import styleSheet from '../styles/HabitsViewStyles.css' assert { type: "css" };
import ms from 'ms';

@customElement('habits-view')
export class HabitsView extends ViewElement {

  @state() habits?: Habit[] = []

  stateChanged (state: RootState) {
    this.habits = state.data.habits
  }

  static styles = [unsafeCSS(styles)]

  render () {
    if (this.habits == undefined) { return nothing }

    const permitteds = this.habits.filter(habit => habit.isAllowed)
    const prohibiteds = this.habits.filter(habit => !habit.isAllowed)

    return html`
    <p style="margin-bottom:10px;display:flex;align-items:center"><mwc-icon style="margin-right:4px">thumb_up</mwc-icon>Todo</p>
    <div class="rack" style="border-left-color:grey;${permitteds.length == 0 ? 'justify-content:center;align-items:center;' : ''}">
    ${permitteds.length == 0 ? html`<p style="color:#9e9e9e;">No habits allowed yet.</p>` : nothing}
    ${permitteds.map(habit => {
      return html`
      <mwc-icon-button
        icon=${habit.iconName}
        @click=${()=>{this.onHabitIconClick(habit)}}
        style="color:${habit.color}"
      ></mwc-icon-button>
      `
    })}
    </div>

    <p style="margin-bottom:10px;display:flex;align-items:center"><mwc-icon style="margin-right:4px">block</mwc-icon>Forbidden</p>
    <div class="rack" style="border-left-color:${red}">
    ${prohibiteds.map(habit => {
      const progress = habit.getAbstinenceTime() / ms(habit.frequency)
      return html`
      <mwc-icon-button
        icon=${habit.iconName!}
        @click=${()=>{this.onHabitIconClick(habit)}}
        style="color:${habit.color};opacity:0.3"
      >
        <mwc-circular-progress progress=${progress} style="position:absolute;top:0;left:0;--mdc-theme-primary:${habit.color}"></mwc-circular-progress>
      </mwc-icon-button>
      `
    })}
    </div>
    `
  }

  async onHabitIconClick(habit: Habit) {

    window.app.habitDialog.open(habit)

    return
    window.snackbar.stacked = true
    window.toast(`${habit.name} (every ${habit.frequency})`, -1, html`
    <div slot="action" style="width:320px;display:flex;align-items:center;justify-content:space-between">
      <mwc-button raised slot="action" style="--mdc-theme-primary:${habit.isAllowed ? '#81c784' : '#f44336'};color:${habit.isAllowed ? 'black' : 'white'}--mdc-theme-on-primary:black"
        icon="${habit.isAllowed ? '' : 'block'}"
        @click=${(e: CustomEvent)=>{
          e.stopPropagation()
          habit.updateTouchTime()
        }}>I DID IT</mwc-button>
      <div>
        <mwc-icon-button slot="action" icon="edit" style="color:white"></mwc-icon-button>
        <mwc-icon-button slot="action" icon="delete" style="color:white"
          @click=${async (e: CustomEvent)=>{
            e.stopPropagation() // prevent the snackbar to close
            if (confirm('Are you sure you want to delete this habit?')) {
              await habit.destroy()
              window.snackbar.stacked = false
              window.toast('deleted', 3000)
            }
          }}></mwc-icon-button>
        </div>

        <mwc-icon-button icon=close @click=${(e: CustomEvent)=>{e.stopPropagation(); window.toast('', 0)}}></mwc-icon-button>
      </div>
    `)
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    setInterval(() => this.requestUpdate(), 1000)
  }
}