# @rdecojs

## 概念

rdecojs 是一个 JavaScript 代码封装库，通过 rdecojs 的 create api，你可以将你的 JavaScript 代码封装起来，并暴露供调用的一些 api 方法，然后通过任意的构建工具例如 webpack rollup vite 构建你的代码，然后将构建结果发布到任意的 cdn 平台，随后你就可以通过 imc api 来调用这些代码，实现 “one bundle，use anywhere”

## QuickStart

### 封装代码

```js
import { create } from '@rdecojs/core'
import React from 'react'

function HelloWorld() {
  return <div> hello world </div>
}

function income(num, resolve) {
  resolve(num + 1)
}

create('myFirstModule', () => ({
  getComponent(resolve) {
    resolve(HelloWorld)
  },
  income,
}))
```

将上述代码打包后得到一个 cdn 的入口地址例如 //cdn.com/myFirstModule/index.js，例如使用 surge.sh，我们可以很方便的将代码上传 cdn

### 使用代码

在入口 html 中加载 cdn 地址

```js
<html>
  <head>
    <script src="//my.surge.sh/myFirstModule/index.js"></script>
    <body>
      <script src="./index.js"></script>
    </body>
  </head>
</html>
```

然后在 index.js 中编写以下代码

```js
import { imc } from '@rdecojs/core'

const myFirstModule = imc('myFirstModule')

const Component = await myFirstModule.getComponent()

function App() {
  return <Component></Component> // display hello world
}

const incomeNumb = await myFirstModule.income(10) // 11
```
