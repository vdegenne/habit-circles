import { css, html, nothing, PropertyValueMap } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getIconName } from '../icons.js';
import { Habit } from '../objects/Habit.js';
import { RootState } from '../redux/store.js';
import { ViewElement } from './view-element.js';
import ms from 'ms';

@customElement('habits-view')
export class HabitsView extends ViewElement {

  @state() habits?: Habit[] = []

  stateChanged (state: RootState) {
    this.habits = state.data.habits
  }

  static styles = css`
  :host {
    margin: 24px;
  }
  mwc-icon-button {
    margin:4px;
  }
  `

  render () {
    if (this.habits == undefined) { return nothing }

    const permitteds = this.habits.filter(habit => habit.isPermitted())
    const prohibiteds = this.habits.filter(habit => !habit.isPermitted())

    return html`
    <p style="margin-bottom:6px;color:#979797">Allowed</p>
    <div style="margin:0px;border-radius:6px;background-color:#e0e0e0;min-height:200px;display:flex;align-items: flex-start;padding: 12px;">
    ${permitteds.map(habit => {
      return html`
      <mwc-icon-button
        icon=${getIconName(habit.icon)!}
        title="${ms(Math.abs(habit.getRemainingTime()))} ago"
        @click=${()=>{this.onHabitIconClick(habit)}}
        style="color:${habit.color}"
      ></mwc-icon-button>
      `
    })}
    </div>

    <p style="margin-bottom:6px;color:#979797">Forbidden</p>
    <div style="margin:0px;border-radius:6px;background-color:#b71c1c;min-height:200px;display:flex;align-items: flex-start;padding: 12px;">
    ${prohibiteds.map(habit => {
      return html`
      <mwc-icon-button icon=${getIconName(habit.icon)!} title="in ${ms(habit.getRemainingTime())}" style="color:${habit.color}"></mwc-icon-button>
      `
    })}
    </div>
    `
  }

  async onHabitIconClick(habit: Habit) {
    window.snackbar.stacked = true
    window.toast(`${habit.name} (${habit.isNew ? 'new' : `allowed from ${ms(habit.getProcrastinationTime())} ago`})`, -1, html`
    <mwc-button unelevated slot="action" style="--mdc-theme-primary:#fdd835;--mdc-theme-on-primary:black"
      @click=${(e: CustomEvent)=>{
        e.stopPropagation()
        habit.updateTouchTime()
      }}>I DID</mwc-button>
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
    `)
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    setInterval(() => this.requestUpdate(), 5000)
  }
}