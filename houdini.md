# CSS HOUDINI

> The objective of the CSS-TAG Houdini Task Force (CSS Houdini) is to jointly develop features that explain the “magic” of Styling and Layout on the web.

__CSS-TAG Houdini Task Force (CSS Houdini)__ 是W3C和各大厂商组成的一个工作组，志在建立一系列的API，让开发者能够介入浏览器的CSS引擎操作。

Houdini让开发者可以直接访问CSS对象模型(CSSOM),开发人员可以编写浏览器理解并可以解析为CSS的代码，（从而创建新的CSS功能，而无需等待它们在浏览器中本机实现。）而不是在Javascript中更新样式。

包括：

- Paint API：
- Typed OM API
- Properties & Values API
- Animation API
- Layout API
- Parser API
- Font Metrics API

Much like Service Workers are a low-level JavaScript API for the browser's cache, *Houdini introduces low-level JavaScript APIs for the browser's render engines*

## workLet

> The Worklet interface is a lightweight version of Web Workers and gives developers access to low-level parts of the rendering pipeline. With Worklets, you can run JavaScript and WebAssembly code to do graphics rendering or audio processing where high performance is required.

### Worklet types:

- PaintWorklet
- AnimationWorklet
- LayoutWorklet

## Typed OM

## Custom Properties

## Paint API

## Animation API

## Layout API

## Is Houdini ready yet?

<https://ishoudinireadyyet.com/>

## 总结

- 优点

- 

## REFERENCE

- Houdini
  - <https://imweb.io/topic/5be2f11221ff0e9610a66470>
  - <https://coalya.github.io/2018/08/01/houdni/>
  <!-- 下面两个里面有优缺点 -->
  - <https://blog.logrocket.com/new-horizons-in-css-houdini-and-the-paint-api-8b307cf387bb/>
  - <https://qianduan.group/posts/5ac9b45c9fd64d5a7458a8c1>
  - <https://developer.mozilla.org/en-US/docs/Web/Houdini>

- Worklet
  - <https://developer.mozilla.org/en-US/docs/Web/API/Worklet>

- Typed OM
  - <https://www.miaoroom.com/code/cssom-css-typed-om.html>
  - <https://developers.google.com/web/updates/2018/03/cssom>

- Custom Properties
  - <https://www.w3cplus.com/css/css-property-and-value-in-css-houdini.html>

- 例子
  - <https://css-houdini.rocks/>
  - <https://github.com/GoogleChromeLabs/houdini-samples>

<!-- The Dark Side of Polyfilling CSS
https://philipwalton.com/articles/the-dark-side-of-polyfilling-css/ -->
