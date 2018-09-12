
import { TYPES } from './actions';

const initialStates = {
  ip: ''
}

export const reducer =  (state = initialStates, action) => {
  switch (action.type) {
    case TYPES.LOAD_IP:
      return Object.assign({}, state, { ip: action.ip });
    default:
      return state;
  }
}
