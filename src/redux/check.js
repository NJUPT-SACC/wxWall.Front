import _ from 'lodash'
import thunkMiddleware from 'redux-thunk'
import { message } from 'antd'
import { createStore, applyMiddleware } from 'redux'
import { baseURL } from '../constant'

const initState = {
  curIdx: 0,
  checkMessages: []
}

const reducer = (state = initState, { type, data }) => {
  switch (type) {
    case 'PUSH_MESSAGE': {
      const checkMessages = _.cloneDeep(state.checkMessages)
      checkMessages.push(data)
      return {
        ...state,
        checkMessages: checkMessages
      }
    }
    case 'REMOVE_MESSAGE': {
      const curIdx = state.curIdx, checkMessages = _.cloneDeep(state.checkMessages)
      _.remove(checkMessages, m => m.MsgId === data)
      return {
        curIdx: Math.min(curIdx, Math.min(4, Math.max(0, checkMessages.length - 1))),
        checkMessages: checkMessages
      }
    }
    case 'SET_CURIDX': {
      return {
        ...state,
        curIdx: data
      }
    }
    case 'IDX--': {
      const curIdx = (state.curIdx - 1)
      return {
        ...state,
        curIdx: Math.max(curIdx, 0)
      }
    }
    case 'IDX++': {
      const curIdx = (state.curIdx + 1), checkMessages = state.checkMessages
      return {
        ...state,
        curIdx: Math.min(curIdx, Math.min(4, Math.max(0, checkMessages.length - 1)))
      }
    }
    default: {
      return state
    }
  }
}

const fetchMessage = () => {
  return dispatch => {
    return fetch(`${baseURL}/checkerGetMessage`, {
      method: 'GET',
      credentials: 'include'
    }).then(res => res.json()).then((message) => {
      if (_.isEmpty(message)) {
        return
      }
      dispatch({ type: 'PUSH_MESSAGE', data: message })
    })
  }
}

const IdxUp = () => {
  return dispatch => {
    dispatch({ type: 'IDX--' })
  }
}

const IdxDown = () => {
  return dispatch => {
    dispatch({ type: 'IDX++' })
  }
}

const store = createStore(
  reducer,
  applyMiddleware(thunkMiddleware)
)

const passCurIdx = () => {
  return dispatch => {
    const { curIdx, checkMessages } = store.getState()
    if (!checkMessages[curIdx]) {
      return
    }
    const { MsgId } = checkMessages[curIdx]
    return fetch(`${baseURL}/checkerPostMessage`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        MsgId: MsgId
      })
    }).then(res => res.json()).then(({ status_code }) => {
      if (!status_code) {
        const msg = message.error('操作错误！'),
          timer = setTimeout(() => {
            msg()
            clearTimeout(timer)
          }, 500)
        return
      }
      dispatch({ type: 'REMOVE_MESSAGE', data: MsgId })
      const msg = message.success('通过成功！'),
        timer = setTimeout(() => {
          msg()
          clearTimeout(timer)
        }, 500)
    })
  }
}

const dropCurIdx = () => {
  return dispatch => {
    const { curIdx, checkMessages } = store.getState()
    if (!checkMessages[curIdx]) {
      return
    }
    const { MsgId } = checkMessages[curIdx]
    dispatch({ type: 'REMOVE_MESSAGE', data: MsgId })
    const msg = message.success('已打回！'),
      timer = setTimeout(() => {
        msg()
        clearTimeout(timer)
      }, 500)
  }
}

const ROLLING = () => {
  const timer = setTimeout(() => {
    clearTimeout(timer)
    const state = store.getState(),
      { checkMessages } = state
    if (checkMessages.length < 10) {
      store.dispatch(fetchMessage())
    }
    ROLLING()
  }, 1000)
}

ROLLING()

window.addEventListener('keydown', (e) => {
  const { keyCode } = e
  switch (keyCode) {
    case 38: {
      return store.dispatch(IdxUp())
    }
    case 40: {
      return store.dispatch(IdxDown())
    }
    case 37: {
      return store.dispatch(passCurIdx())
    }
    case 39: {
      return store.dispatch(dropCurIdx())
    }
    default:
      return
  }
})

export default store
