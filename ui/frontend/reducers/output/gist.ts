import { Action, ActionType } from '../../actions';
import { Channel, Edition, Mode } from '../../types';
import { finish, RequestsInProgress, start } from './sharedStateManagement';

const DEFAULT: State = {
  requestsInProgress: 0,
  id: null,
  url: null,
  code: null,
  stdout: null,
  stderr: null,
  channel: null,
  mode: null,
  edition: null,
  error: null,
};

interface State extends RequestsInProgress {
  id?: string;
  url?: string;
  code?: string;
  stdout?: string;
  stderr?: string;
  channel?: Channel;
  mode?: Mode;
  edition?: Edition;
  error?: string;
}

export default function gist(state = DEFAULT, action: Action): State {
  switch (action.type) {
    case ActionType.RequestGistLoad:
    case ActionType.RequestGistSave:
      return start(DEFAULT, state);

    case ActionType.GistLoadSucceeded:
    case ActionType.GistSaveSucceeded: {
      const { id, url, code, stdout, stderr, channel, mode, edition } = action;
      return finish(state, { id, url, code, stdout, stderr, channel, mode, edition });
    }

    case ActionType.GistLoadFailed: {
      const { id, error } = action;
      return finish(state, { error: `Error loading gist ${id}: ${error}` });
    }

    case ActionType.GistSaveFailed: {
      const { error } = action;
      return finish(state, { error: `Error saving gist: ${error}` });
    }

    default:
      return state;
  }
}
