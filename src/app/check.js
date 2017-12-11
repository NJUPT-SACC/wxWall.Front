import _ from 'lodash'
import { message } from 'antd'
import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import { connect, Provider } from 'react-redux'
import { baseURL } from '../constant'
import checkStore from '../redux/check'

import escapeEmoji from '../util/emoji'

import '../less/check.less'

const InMsg = connect(state => ({
  curIdx: state.curIdx
}), dispatch => ({
  drop: MsgId => { dispatch({ type: 'REMOVE_MESSAGE', data: MsgId }) },
  set_curidx: idx => { dispatch({ type: 'SET_CURIDX', data: idx }) }
}))(class extends Component {
  passMsg = () => {
    const { drop, MsgId } = this.props
    fetch(`${baseURL}/checkerPostMessage`, {
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
      drop(MsgId)
      const msg = message.success('通过成功！'),
        timer = setTimeout(() => {
          msg()
          clearTimeout(timer)
        }, 500)
    })
  }

  dropMsg = () => {
    const { drop, MsgId } = this.props
    drop(MsgId)
    const msg = message.success('已打回！'),
      timer = setTimeout(() => {
        msg()
        clearTimeout(timer)
      }, 500)
  }

  setCurIdx = () => {
    const { set_curidx, idx } = this.props
    set_curidx(idx)
  }

  render() {
    const { content, idx, curIdx } = this.props
    return (
      <li className={`check-list-item ${idx === curIdx ? 'active' : ''}`}>
        <div className='list-item'>
          <div onClick={this.passMsg} className='item-tab item-btn item-left'>
            通过√
          </div>
          <div onClick={this.setCurIdx} className='item-tab item-content' dangerouslySetInnerHTML={{
            __html: escapeEmoji(_.truncate(content, {
              length: 40
            }))
          }} />
          <div onClick={this.dropMsg} className='item-tab item-btn item-right'>
            打回×
          </div>
        </div>
      </li>
    )
  }
})

const CheckList = connect(state => ({
  messages: _.slice(state.checkMessages, 0, 5)
}))(class extends Component {
  render() {
    const { messages } = this.props
    if (_.isEmpty(messages)) {
      return (
        <li className='check-list-item msg'>
          当前没有待审核内容！
        </li>
      )
    }
    return _.map(messages, (m, idx) => (<InMsg
      key={m.MsgId}
      idx={idx}
      {...m}
    />))
  }
})

class CheckListApp extends Component {
  render() {
    return (
      <Provider store={checkStore}>
        <CheckList />
      </Provider>
    )
  }
}

ReactDOM.render(<CheckListApp />, document.getElementById('check-list'))

