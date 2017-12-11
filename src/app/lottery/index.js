import _ from 'lodash'
import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import { baseURL } from '../../constant'

import Lottery from './lotterry'

import '../../less/lottery.less'

class LotteryWall extends Component {
  state = {
    loading: true,
    loaded: false,
    preLoaded: false,
    totalHeadImgs: 0,
    loadedHeadImgs: 0,
    people: []
  }

  componentWillMount() {
    const { loading } = this.state
    if (loading) {
      fetch(`${baseURL}/wallGetWinners`, {
        method: 'GET',
        credentials: 'include',
      }).then(res => res.json()).then(winners => {
        this.setState({
          loading: false,
          loaded: true,
          people: winners,
          totalHeadImgs: winners.length
        }, () => {
          _.forEach(winners, person => {
            const image = new global.Image()
            image.src = person.headimgurl
            image.onload = () => {
              const loadedHeadImgs = this.state.loadedHeadImgs + 1,
                totalHeadImgs = this.state.totalHeadImgs
              this.setState({
                loadedHeadImgs: loadedHeadImgs
              }, () => {
                if (loadedHeadImgs === totalHeadImgs) {
                  const loadingMsg = document.querySelector('.loading-msg')
                  let timer = setTimeout(() => {
                    loadingMsg.classList.add('leave')
                    clearTimeout(timer)
                    timer = setTimeout(() => {
                      this.setState({
                        preLoaded: true
                      }, () => {
                        clearTimeout(timer)
                      })
                    }, 1000)
                  }, 0)
                }
              })
            }
          })
        })
      })
    }
  }

  render() {
    const { loading, loaded, preLoaded, loadedHeadImgs, totalHeadImgs, people } = this.state
    if (loading) {
      return <div className='loading-msg msg'>获取数据中...</div>
    }
    if (!preLoaded && loaded) {
      return (
        <div className='loading-msg msg'>
          {`获取数据中...(${loadedHeadImgs}/${totalHeadImgs})`}
        </div>
      )
    }
    return (
      <div>
        <div className='title'>
          幸运抽奖
        </div>
        <Lottery people={people} />
      </div>
    )
  }
}

ReactDOM.render(<LotteryWall />, document.getElementById('lottery-body'))
