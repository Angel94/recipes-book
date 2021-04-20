import { Action } from '@ngrx/store';

import { User } from '../user.model';

export interface State {
  user: User;
}

export function authReducer(state: State, action: Action): State {
  return state;
}
