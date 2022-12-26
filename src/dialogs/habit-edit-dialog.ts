import { LitElement, html, css } from 'lit'
import { customElement, query } from 'lit/decorators.js';
import { Dialog } from '@material/mwc-dialog';
import { Habit } from '../objects/Habit.js';
import { TextField } from '@material/mwc-textfield';
import { Select } from '@material/mwc-select';
import { getIconId, iconExists, iconNameValidationPattern } from '../icons.js';

const icons = [
  'smoking_rooms',
  'fastfood',
  'cake',
  'local_cafe',
  'local_drink',
  'wine_bar',
  'directions_run',
  'directions_bike',
  'fitness_center',
  'favorite',
  'theaters',
  'school',
  'sports_esports',
  'shower',
  'wash',
  'local_laundry_service',
  'cleaning_services',
  'smartphone',
  'auto_stories',
  'edit_square',
  'assignment',
  'photo_camera'
]

@customElement('habit-edit-dialog')
export class HabitEditDialog extends LitElement {
  private habit: Habit;

  @query('mwc-dialog') private dialog!: Dialog;
  @query('mwc-select[name=unit]') private unitSelect!: Select;
  @query('mwc-textfield[name=length]') private lengthTextField!: TextField;
  @query('mwc-textfield[name=icon]') private iconTextField!: TextField;
  @query('mwc-textfield[name=color]') private colorTextField!: TextField;

  constructor (hostElement: HTMLElement, habit?: Habit) {
    super()
    hostElement.appendChild(this)
    this.habit = habit || new Habit('', '2d', 1, '#000', 0)
  }

  static styles = css`
  mwc-textfield, mwc-select {
    width: 100%;
  }
  h3 {
    margin-top: 32px;
  }
  `

  render() {
    return html`
    <mwc-dialog heading="Habit">

      <mwc-textfield label="name" outlined value=${this.habit.name} required
        style="margin-top:12px"></mwc-textfield>

      <h3>Frequency</h3>
      <div style="display:flex">
        <mwc-textfield type="number" name="length" min="1" max="999" value=${this.habit.length}></mwc-textfield>
        <mwc-select name="unit" value="${this.habit.unit}" @closed=${(e: CustomEvent) => e.stopPropagation()}>
          <mwc-list-item value="d">days</mwc-list-item>
          <mwc-list-item value="h">hours</mwc-list-item>
          <mwc-list-item value="m">minutes</mwc-list-item>
        </mwc-select>
      </div>

      <h3>Icon</h3>
      <div>
        ${icons.map(icon => {
          return html`<mwc-icon-button icon=${icon} @click=${()=>{this.changeIconValue(icon)}}></mwc-icon-button>`
        })}
      </div>
      <mwc-textfield
        name=icon
        value=${this.habit.iconName}
        pattern="${iconNameValidationPattern}"
        validationMessage="This icon doesn't exist"
        @input=${(e: CustomEvent) => {this.validateIconValue()}} required></mwc-textfield>

      <h3>Color</h3>
      <mwc-textfield type="color" name=color outlined value="#000"></mwc-textfield>

      <mwc-button outlined slot=secondaryAction dialogAction=close>close</mwc-button>
      <mwc-button unelevated slot=primaryAction dialogAction="submit">add</mwc-button>
    </mwc-dialog>
    `
  }

  async open () {
    await this.updateComplete
    this.dialog.show()
    return new Promise((resolve: (habit: Habit) => void, reject) => {
      // @ts-ignore
      this.dialog.addEventListener('closed', (e: CustomEvent) => {
        if (e.detail.action == 'close') {
          reject()
        }
        else {
          const unit = this.unitSelect.value
          const length = this.lengthTextField.value
          const frequency = `${length}${unit}`
          // @todo: should validate here

          resolve(new Habit(
            this.shadowRoot!.querySelector<TextField>('mwc-textfield[label=name]')!.value,
            frequency,
            getIconId(this.iconTextField.value)!,
            this.colorTextField.value,
            this.habit.touch
          ))
        }
        this.remove()
      })
    })
  }


  async changeIconValue (iconName: string) {
    this.iconTextField.value = iconName;
    await this.iconTextField.updateComplete
    this.validateIconValue()
  }
  validateIconValue () {
    this.iconTextField.reportValidity()
    // const icon = this.iconTextField.value
    // if (!iconExists(icon)) {
    //   console.log('yes')
    //   this.iconTextField.reportValidity()
    // }
  }
}