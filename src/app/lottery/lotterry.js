import _ from 'lodash'
import { InputNumber, Button, Form, message } from 'antd'
import React, { Component } from 'react'
import escapeEmoji from '../../util/emoji'

const FormItem = Form.Item

const SelectForm = Form.create()(class extends Component {
  handleSubmit = (e) => {
    e.preventDefault()
    const { validateFields } = this.props.form
    validateFields((err, fieldsValue) => {
      if (err && err['selectNum']) {
        const msg = message.error(_.join(_.map(err['selectNum'].errors, er => er.message), ',')),
          timer = setTimeout(() => {
            msg()
            clearTimeout(timer)
          }, 1000)
        return
      }
      const { selectNum } = fieldsValue,
        { handleInputNum, handleStart } = this.props
      handleInputNum(selectNum)
      handleStart()
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form,
      { peopleLen, handleInputNum } = this.props
    return (
      <Form className='select-from' onSubmit={this.handleSubmit}>
        <FormItem
          label='抽奖人数'
          hasFeedback
        >
          {getFieldDecorator('selectNum', {
            rules: [{
              type: 'integer', message: '抽奖人数必须为数字',
            }, {
              validator: (rule, value, callback) => {
                if (value < 0 || value > Math.min(5, peopleLen)) {
                  const err = new Error(`抽奖人数必须大于0且小于总人数${Math.min(5, peopleLen)}`)
                  return callback(err)
                }
                callback()
              }
            }, {
              required: true, message: '请输入抽奖人数!'
            }],
          })(
            <InputNumber className='wrapper' onChange={handleInputNum} />
            )}
        </FormItem>
        <FormItem>
          <Button className='wrapper' type='primary' htmlType='submit'>开始</Button>
        </FormItem>
      </Form>
    )
  }
})

class LuckyGuy extends Component {
  render() {
    const { nickname, headimgurl } = this.props
    return (
      <li className='selected-person'>
        <div className='lucky-avatar-container'>
          <img className='lucky-avatar' src={headimgurl} alt={nickname} />
        </div>
        <div className='lucky-name' dangerouslySetInnerHTML={{
          __html: escapeEmoji(nickname)
        }} />
      </li>
    )
  }
}

class Lottery extends Component {
  constructor(props) {
    super()
    this.state = {
      people: props.people,
      selected: false,
      lotteryEnd: false,
      selectNum: 1
    }
  }

  handleSelect = () => {
    this.setState({
      selected: true
    })
  }

  handleRetry = (peopleOut) => {
    let people = _.cloneDeep(this.state.people)
    people = _.reject(people, person => -1 !== _.findIndex(
      peopleOut,
      p => (p.nickname === person.nickname && p.headimgurl === person.headimgurl)
    ))
    this.setState({
      selected: false,
      lotteryEnd: false,
      people: people,
      selectNum: 0
    })
  }

  handleInputNum = (selectNum) => {
    const { people } = this.state
    if (_.isNaN(selectNum) || selectNum < 0 || selectNum > Math.min(5, people.length)) {
      return
    }
    this.setState({
      selectNum: selectNum
    })
  }

  handleLotteryEnd = () => {
    this.setState({
      lotteryEnd: true
    })
  }

  handleStart = () => {
    this.setState({
      selected: true
    }, () => {
      window.addEventListener('keydown', (e) => {
        const { keyCode } = e
        if (keyCode === 32) {
          this.setState({
            lotteryEnd: true
          })
        }
      })
      const ROLLING = () => {
        const { lotteryEnd } = this.state
        if (lotteryEnd) {
          return
        }
        const _people = _.shuffle(_.cloneDeep(this.state.people))
        this.setState({
          people: _people
        }, () => {
          const timer = setTimeout(() => {
            ROLLING()
            clearTimeout(timer)
          })
        }, 50)
      }
      ROLLING()
    })
  }

  render() {
    const { selected, selectNum, people, lotteryEnd } = this.state
    if (_.isEmpty(people)) {
      return (<div className='msg'>没有获取有效的用户数据！</div>)
    }
    const selectedPeople = _.slice(people, 0, selectNum)
    if (!selected) {
      return (
        <SelectForm
          peopleLen={people.length}
          handleInputNum={this.handleInputNum.bind(this)}
          handleStart={this.handleStart.bind(this)}
        />
      )
    }
    if (_.isEmpty(selectedPeople)) {
      return (<div className='msg'>没有有效的用户数据！</div>)
    }
    return (
      <div className='selected'>
        <ul className='selected-people'>
          {_.map(selectedPeople, (p, idx) => (
            <LuckyGuy key={idx} {...p} />
          ))}
        </ul>
        <div className='extra'>
          <Button size='large' className='control' onClick={this.handleLotteryEnd} disabled={lotteryEnd} type='danger'>停&nbsp;&nbsp;&nbsp;&nbsp;止</Button>
          <Button size='large' className='control' onClick={this.handleRetry.bind(this, selectedPeople)} type='primary' disabled={!lotteryEnd}>再抽一次</Button>
        </div>
      </div>
    )
  }
}

export default Lottery
