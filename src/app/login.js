import _ from 'lodash'
import ReactDOM from 'react-dom'
import { baseURL } from '../constant'
import React, { Component } from 'react'
import { Form, Input, Icon, Button, message } from 'antd'

const FormItem = Form.Item

import '../less/login.less'

class Login extends Component {
  state = {
    authcode: ''
  }

  handleAuthCodeChange = (e) => {
    const { value } = e.target
    this.setState({
      authcode: value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { authcode } = this.state
    if (!authcode) {
      const msg = message.warn('权限码不得为空！'),
        timer = setTimeout(() => {
          msg()
          clearTimeout(timer)
        }, 1000)
      return
    }
    fetch(`${baseURL}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        authcode: authcode
      })
    }).then(res => res.json()).then(({ status_code }) => {
      if (!status_code) {
        const msg = message.error('权限码错误！'),
          timer = setTimeout(() => {
            msg()
            clearTimeout(timer)
          }, 300)
        return
      }
      if (status_code === 1) {
        const msg = message.success('登录成功！'),
          timer = setTimeout(() => {
            msg()
            clearTimeout(timer)
            global.location.href = '/check'
          }, 300)
        return
      }
      if (status_code === 2) {
        const msg = message.success('登录成功！'),
          timer = setTimeout(() => {
            msg()
            clearTimeout(timer)
            global.location.href = '/lottery'
          }, 300)
        return
      }
    })
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          <Input
            onChange={this.handleAuthCodeChange}
            prefix={<Icon type='lock' style={{ fontSize: 13 }} />}
            placeholder='请输入权限码'
          />
        </FormItem>
        <FormItem>
          <Button type='primary' htmlType='submit' className='login-form-button'>
            登录
          </Button>
        </FormItem>
      </Form>
    )
  }
}

ReactDOM.render(<Login />, document.getElementById('login-form'))

