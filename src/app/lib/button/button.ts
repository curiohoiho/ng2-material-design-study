import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import './button.scss';

@Component({
  selector: 'button-test',
  templateUrl: 'button.html',
  // styleUrls: ['button.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdButton
{


} // class MdButton