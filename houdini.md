# CSS HOUDINI

> The objective of the CSS-TAG Houdini Task Force (CSS Houdini) is to jointly develop features that explain the “magic” of Styling and Layout on the web.

__CSS-TAG Houdini Task Force (CSS Houdini)__ 是W3C和各大厂商组成的一个工作组，志在建立一系列的API，让开发者能够介入浏览器的CSS引擎操作。

Houdini让开发者可以直接访问CSS对象模型(CSSOM),开发人员可以编写浏览器理解并可以解析为CSS的代码，（从而创建新的CSS功能，而无需等待它们在浏览器中本机实现。）而不是在Javascript中更新样式。

包括：

- Paint API
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

### 面临的问题

```javascript
const el = document.getElementById('el')

const opacity = window.getComputedStyle(el).opacity

typeof opacity === 'string' // true

el.style.opacity = 0.2
el.style.opacity += 0.1
// "0.20.1"   ???
```

Typed OM通过给CSS值添加类型、方法和适当的对象模型来进行扩展。值不再是字符串，而是作为 JavaScript 对象的值，用于提升 CSS 的性能和更加合理的操作。

在Typed OM中，CSS值都是 `CSSStyleValue` 基类中的成员，基类下有许多子类可以更详细的描述CSS值，包括：

<!-- > - `CSSPositionValue` : Position (x and y) values（好像没有这个了） -->
> - `CSSKeywordValue` : CSS Keywords and other identifiers (like inherit or grid)
> - `CSSImageValue` : An object representing the value properties for an image
> - `CSSUnitValue` : Numeric values that can be expressed as a single value with single unit (like 50px) or a single value or percentage without a unit
> - `CSSMathValue` : Complicated numeric values, like you would find with calc, min, and max. This includes subclasses CSSMathSum, CSSMathProduct, CSSMathMin, CSSMathMax, CSSMathNegate, and CSSMathInvert
> - `CSSTransformValue` : A list of CSS transforms consisting of CSSTransformComponents, including CSSTranslate, CSSRotate, CSSScale, CSSSkew, CSSSkewX, CSSSkewY, CSSPerspective, and/or CSSMatrixComponent
> - `CSSUnparsedValue` : CSSUnparsedValue objects represent property values that reference custom properties.

### 可用性检测方法

```javascript
window.CSS && CSS.number
```

### CSS 数值

数字由 Typed OM 中 CSSNumericValue 对象的两种类型来表示：

- `CSSUnitValue` - 包含单个单位类型（例如 "42px"）的值
- `CSSMathValue` - 包含多个值/单位的值，如数学表达式（例如 "calc(56em + 10%)"）

```javascript
// 单位制
const {value, unit} = CSS.number('10');
// value === 10, unit === 'number'

const {value, unit} = CSS.px(42);
// value === 42, unit === 'px'

const {value, unit} = CSS.vw('100');
// value === 100, unit === 'vw'

const {value, unit} = CSS.percent('10');
// value === 10, unit === 'percent'

const {value, unit} = CSS.deg(45);
// value === 45, unit === 'deg'

const {value, unit} = CSS.ms(300);
// value === 300, unit === 'ms'


// 数学值
new CSSMathSum(CSS.vw(100), CSS.px(-10)).toString(); // "calc(100vw + -10px)"

new CSSMathNegate(CSS.px(42)).toString() // "calc(-42px)"

new CSSMathInvert(CSS.s(10)).toString() // "calc(1 / 10s)"

new CSSMathProduct(CSS.deg(90), CSS.number(Math.PI/180)).toString();
// "calc(90deg * 0.0174533)"

new CSSMathMin(CSS.percent(80), CSS.px(12)).toString(); // "min(80%, 12px)"

new CSSMathMax(CSS.percent(80), CSS.px(12)).toString(); // "max(80%, 12px)"
```

### 获取和设置Typed OM值

- `attributeStyleMap` : 用于获取和设置内联样式
- `computedStyleMap` : 获取元素的完整Typed OM样式

#### attributeStyleMap Get and Set

```javascript
el.attributeStyleMap.set('font-size', CSS.em(2));
el.attributeStyleMap.get('font-size');
// CSSUnitValue { value: 2, unit: 'em' }

el.attributeStyleMap.set('opacity', CSS.number(.5));
el.attributeStyleMap.get('opacity');
// CSSUnitValue { value: 0.5, unit: 'number' };
```

#### computedStyleMap Output

```javascript
// css
.el {
  vertical-align: baseline;
  width: calc(100% - 3em);
}

// js
const cs = $('.foo').computedStyleMap();

cs.get('vertical-align');
// CSSKeywordValue {
//  value: 'baseline',
// }

cs.get('width');
// CSSMathSum {
//   operator: 'sum',
//   values: CSSNumericArray {
//     0: CSSUnitValue { value: -90, unit: 'px' },
//     1: CSSUnitValue { value: 100, unit: 'percent' },
//     length: 2
//   },
// }
```

### 优点

- 更少的bug。例如数字值总是以数字形式返回，而不是字符串。
- 算术运算和单位转换。在绝对长度单位（例如 px -> cm）之间进行转换并进行基本的数学运算。

  ```javascript
  // Convert px to other absolute/physical lengths.
  el.attributeStyleMap.set('width', '500px');
  const width = el.attributeStyleMap.get('width');
  width.to('mm'); // CSSUnitValue {value: 132.29166666666669, unit: "mm"}
  width.to('cm'); // CSSUnitValue {value: 13.229166666666668, unit: "cm"}
  width.to('in'); // CSSUnitValue {value: 5.208333333333333, unit: "in"}

  CSS.deg(200).to('rad').value // "3.49066rad"
  CSS.s(2).to('ms').value // 2000
  ```

- 数值范围限制和舍入。Typed OM 通过对值进行范围限制和舍入，以使其在属性的可接受范围内。
- 更好的性能。浏览器必须做更少的工作序列化和反序列化字符串值。
- 错误处理。新的解析方法带来了 CSS 世界中的错误处理。

  ```javascript
  // 检查 CSS 解析器是否符合 transform 值
  try {
    const css = CSSStyleValue.parse('transform', 'translate4d(bogus value)');
      // use css
  } catch (err) {
    console.log(err);
  }
  ```

- “我应该使用骆驼式的 CSS 名称还是字符串呢？” 你不再需要猜测名字是骆驼还或字符串（例如 el.style.backgroundColor vs el.style['background-color']）。Typed OM 中的 CSS 属性名称始终是字符串，与您实际在 CSS 中编写的内容一致:)

减少错误、提升性能。

## Custom Properties

### CSS变量

```CSS
  :root {
    --num: 10;
    --content: 'content';
    --length: 100px;
  }
  .class {
    width: calc(var(--num) * 1px);
    height: var(--length);
  }
  .class:after {
    content: var(--content);
  }

/* 问题 */
/* Current Situation (CSS Variables) */
.thing {
  --my-color: green;
  --my-color: url('not-a-color'); // It's just a variable! It doesn't know any better
  color: var(--my-color); // This is now sad!
}
```

### CSS自定义属性和自定义变量有什么区别？

实际上，CSS自定义属性和CSS变量之间没有区别，CSS自定义属性被 `var()` 调用的时候，它就从CSS自定义属性变成了CSS变量。但CSS中的自定义属性和CSS Houdini中的CSS自定义属性在声明的时候有明显的差异，在CSS Houdini中使用 `CSS.registerProperty` 来声明一个自定义属性，你还能更好的控制它。因为这样声明的CSS自定义属性，你可以给自定义属性分配**CSS类型**、**设置初始值**和**继承**。

### 注册自定义属性

```javascript
if ('registerProperty' in CSS ) {
  CSS.registerProperty({
  name: '--foo', // String, name of the custom property
  syntax: '<color>', // String, how to parse this property. Defaults to *
  inherits: false, // Boolean, if true should inherit down the DOM tree
  initialValue: 'black', // String, initial value of this property
});
}
```

There are a number of supported syntaxes from the CSS Values and Units spec that can be used when registering a Custom Property:

- `<length>` - Any valid length value
- `<number>` - Any valid number value
- `<percentage>` - Any valid percentage value
- `<length-percentage>` - Any valid length or percentage value, or any calc expression combining length and percentage components
- `<color>` - Any valid color value
- `<image>` - Any Any valid image value
- `<url>` - Any valid url value
- `<integer>` - Any valid integer value
- `<angle>` - Any valid angle value
- `<time>` - Any valid time value
- `<resolution>` - Any valid resolution value
- `<transform-list>` - Any valid transform function value
- `<custom-ident>` - Any valid ident value

You can also use `+` to allow for a space-separarted list of one or more items of that syntax, and separate syntaxes with `|` to allow one syntax or another

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
  - <https://zhuanlan.zhihu.com/p/35029796>
  - <https://www.miaoroom.com/code/cssom-css-typed-om.html>
  - <https://drafts.css-houdini.org/css-typed-om/>
  - <https://houdini.glitch.me/typed-om>

- Custom Properties
  - <https://www.w3cplus.com/css/css-property-and-value-in-css-houdini.html>
  - <https://houdini.glitch.me/custom-properties>

- 例子
  - <https://css-houdini.rocks/>
  - <https://github.com/GoogleChromeLabs/houdini-samples>

<!-- The Dark Side of Polyfilling CSS
https://philipwalton.com/articles/the-dark-side-of-polyfilling-css/ -->
