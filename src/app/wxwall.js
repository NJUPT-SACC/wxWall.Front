import _ from 'lodash'
import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import { connect, Provider } from 'react-redux'
import wxWallStore from '../redux/wxwall'

import escapeEmoji from '../util/emoji'

import '../less/wxwall.less'

const WXMsg = connect(null, dispatch => ({
  drop: MsgId => { dispatch({ type: 'REMOVE_PREMESSAGE', data: MsgId }) }
}))(class extends Component {
  componentDidMount() {
    const { idx } = this.props
    const wxMsg = ReactDOM.findDOMNode(this),
      timer = setTimeout(() => {
        clearTimeout(timer)
        wxMsg.style.opacity = 1
        wxMsg.style.top = idx * 150 + 'px'
      }, 0)
  }

  componentDidUpdate() {
    const { canLeave, drop, MsgId, idx } = this.props
    if (canLeave) {
      drop(MsgId)
    } else {
      const wxMsg = ReactDOM.findDOMNode(this),
        timer = setTimeout(() => {
          clearTimeout(timer)
          wxMsg.style.opacity = 1
          wxMsg.style.top = idx * 150 + 'px'
        }, 0)
    }
  }

  render() {
    const { headimgurl, nickname, content } = this.props
    return (
      <li className='wx-msg' >
        <div className='wx-avatar wx-tab'>
          <img src={headimgurl}
            alt={nickname} />
        </div>
        <div className='wx-content wx-tab'>
          <div className='wx-nickname'
            dangerouslySetInnerHTML={{ __html: escapeEmoji(nickname) }} />
          <div className='wx-msgtxt'
            dangerouslySetInnerHTML={{ __html: escapeEmoji(content) }}
          />
        </div>
      </li>
    )
  }
})

const WXWall = connect(state => ({
  messages: _.slice(state.dspMessages, 0, 5)
}))(class extends Component {
  render() {
    const messages = this.props.messages
    if (_.isEmpty(messages)) {
      return <li>当前微信墙没有内容</li>
    }
    return _.map(messages, (m, idx) => (<WXMsg
      key={m.MsgId}
      idx={idx}
      canLeave={!idx && messages.length > 4}
      {...m}
    />))
  }
})

class WXWallApp extends Component {
  render() {
    return (
      <Provider store={wxWallStore}>
        <WXWall />
      </Provider>
    )
  }
}

ReactDOM.render(<WXWallApp />, document.getElementById('launch-space'))
