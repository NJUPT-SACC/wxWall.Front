import _ from 'lodash'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { baseURL } from '../constant'

const initState = {
  rawMessages: [],
  dspMessages: []
}

const reducer = (state = initState, { type, data }) => {
  switch (type) {
    case 'PUSH_RAWMESSAGE': {
      const rawMessages = _.cloneDeep(state.rawMessages)
      if (!data) {
        return state
      }
      rawMessages.push(data)
      return {
        ...state,
        rawMessages: rawMessages
      }
    }
    case 'PUSH_PREMESSAGE': {
      const dspMessages = _.cloneDeep(state.dspMessages),
        rawMessages = _.cloneDeep(state.rawMessages)
      _.remove(rawMessages, m => m.MsgId === data.MsgId)
      dspMessages.push(data)
      return {
        ...state,
        rawMessages: rawMessages,
        dspMessages: dspMessages
      }
    }
    case 'REMOVE_PREMESSAGE': {
      const dspMessages = _.cloneDeep(state.dspMessages)
      _.remove(dspMessages, m => m.MsgId === data)
      return {
        ...state,
        dspMessages: dspMessages
      }
    }
    default: {
      return state
    }
  }
}

const getMessage = (callback) => {
  return dispatch => {
    return fetch(`${baseURL}/wallGetMessage`, {
      method: 'GET',
      credentials: 'include'
    }).then(res => res.json()).then((message) => {
      if (_.isEmpty(message)) {
        return
      }
      dispatch({ type: 'PUSH_RAWMESSAGE', data: message })
      callback && callback(dispatch, message)
    })
  }
}

const preLoadAvatar = (dispatch, message) => {
  const Image = new global.Image(),
    { headimgurl } = message
  Image.src = headimgurl
  Image.onload = () => {
    dispatch({ type: 'PUSH_PREMESSAGE', data: message })
  }
}

const store = createStore(
  reducer,
  applyMiddleware(thunkMiddleware)
)

const ROLLING = () => {
  const timer = setTimeout(() => {
    clearTimeout(timer)
    const state = store.getState(),
      { dspMessages } = state
    if (dspMessages.length < 10) {
      store.dispatch(getMessage(preLoadAvatar))
    }
    ROLLING()
  }, 2500)
}

ROLLING()

export default store
