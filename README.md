## redis




---


 ## RESTFUL-API
--- 
 * 登陆请求
    - path:/login
    - method:POST
    - 请求发送数据：
    ```
    {
        authcode:"123456789"
    }
    ```
    - 返回数据：
    ```
    {
        status_code : number
        /*
            status_code = 0 => 密码有误
            status_code = 1 => 审核员登陆
            status_code = 2  => 抽奖登陆
        */
    } 
    ```
---

* 登出请求
    - path:/logout
    - method : GET 
    - 返回数据：
    ```
    {
        status_code : number
        /*
            status_code = 0 => 登出失败
            status_code = 1 => 登出成功
        */
    }
    ```
---


* 审核人员轮询待审核的信息
    - path:/checkerGetMessage
    - method:GET
    - 返回数据：
    ```
    {
        status_code:number,
        MsgId : String ,
        content : String,
        /*
            status_code => 是为1，不是为0
            MsgId => 每条信息的Id
            content => 信息的具体内容
            没信息时返回空对象{}
        */
    }
    ```
---
* 审核人员提交审核通过的信息
    - path:/checkerPostMessage
    - method : POST
    ```
    {
        MsgId : 每条信息的唯一标识ID
    }
    ```
    - 返回数据：
    ```
    {
        status_code : number
        /*
            status_code = 0 => 调节失败
            status_code = 1 => 调节成功
        */
    }
    ```

--- 
* 展示页面轮询待上墙信息
 - path : /wallGetMessage
 - method : GET
 - 返回数据：
 ```
 {
        content: '苟利国家生死以，岂因福祸避趋之！',
        nickname: 'MZI',
        headimgurl:'http://wx.qlogo.cn/mmopen/ajNVdqHZLLCJ55FL3BALxkE2ZOyY2oLCEOzyVCkkIrQscfcEb6T83DdAIichTDjk9un1J5utliaLCNzBVulG9Y5g/0'
     /*
        content => 信息内容
        nickname => 用户名
        headimgurl => 用户头像
        没信息时返回空对象{}
     */
 }
 ```
---

* 抽奖
- path : /wallGetWinners
- method : GET
- 返回数据：
  ``` 
  [
        {   
            nickname: 'MZI',
            headimgurl:'http://wx.qlogo.cn/mmopen/ajNVdqHZLLCJ55FL3BALxkE2ZOyY2oLCEOzyVCkkIrQscfcEb6T83DdAIichTDjk9un1J5utliaLCNzBVulG9Y5g/0'
        },
        {
            nickname: 'MZI',
            headimgurl:'http://wx.qlogo.cn/mmopen/ajNVdqHZLLCJ55FL3BALxkE2ZOyY2oLCEOzyVCkkIrQscfcEb6T83DdAIichTDjk9un1J5utliaLCNzBVulG9Y5g/0'
        },
        ......
       
     /*
        返回所有能抽奖的用户
        nickname => 用户名
        headimgurl => 用户头像 
     */
  ]
  ```


