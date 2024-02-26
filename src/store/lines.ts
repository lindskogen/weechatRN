import { AnyAction } from 'redux';

export type LineState = { [key: string]: WeechatLine[] };

const initialState: LineState = {};

export default (
  state: LineState = initialState,
  action: AnyAction
): LineState => {
  switch (action.type) {
    case 'FETCH_LINES':
      return {
        ...state,
        [action.bufferId]: action.payload as WeechatLine[]
      };
    case 'BUFFER_CLOSED': {
      const { [action.bufferId]: _, ...rest } = state;
      return rest;
    }
    case 'BUFFER_CLEARED': {
      return {
        ...state,
        [action.bufferId]: []
      };
    }
    case 'BUFFER_LINE_ADDED':
      return {
        ...state,
        [action.bufferId]: [
          action.payload as WeechatLine,
          ...(state[action.bufferId] || [])
        ]
      };
    case 'FETCH_BUFFERS_REMOVED': {
      return Object.fromEntries(
        Object.entries(state).filter(
          ([bufferId]) => !(action.payload as string[]).includes(bufferId)
        )
      );
    }
    case 'UPGRADE':
      return initialState;
    default:
      return state;
  }
};
