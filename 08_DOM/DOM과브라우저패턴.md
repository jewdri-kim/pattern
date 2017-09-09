## 8장 DOM과 브라우저 패턴

- 브라우저는 **자바스크립트의 실행환경**이다.

- 브라우저별로 일관성이 없는 환경이기 때문에, 클라이언트 **스크립팅을 도와주는 패턴**들을 사용한다면 어려움을 덜 수 있다. 

- 이 장에서는 여러 패턴들을 몇가지 영역으로 나누어 살펴볼 것이다.

  DOM스크립팅, 이벤트 핸들링, 원격 스크립팅, 페이지에서의 자바스크립트 로딩 전략 그리고 웹사이트에 자바스크립트를 배포하는 단계로 구성된다.

## 8.1 관심사의 분리 

웹 개발에서의 주요 관심사는 다음의 세가지로 나누어 볼 수 있다. 

#### 내용

HTML 문서

#### 표현

CSS 스타일 

#### 행동

자바스크립트 - 사용자 인터랙션과 문서의 동적인 변경을 처리 

이 세가지를 최대한 분리할수록, 좀 더 광범위한 사용자 에이전트 ( ex: 그래픽브라우저, 텍스트만 지원하는 브라우저, 장애인을 위한 보조공학기기, 모바일 기기)에 애플리케이션을 탑재하기가 용이해진다. 

**-> 웹표준 :  html,js,css를 분리하고 표준화 하는것에 있고, 웹접근성 : 좀 더 다양한 기기와 환경에서 웹을 제공**

- **시멘틱한 마크업 : 다양한 태그들을 의미에 맞게 사용 **CSS를 끈 상태에서 페이지를 테스트한다. 이 상태로도 사용 가능하고 내용이 표시되며 읽을 수 있어야 한다 . (헤딩태그사용 , 목록태그와 강조 태그 등등)
- 자바스크립트를 끈 상태에서 페이지를 테스트한다. 여전이 목적에 맞게 제대로 동작하고, 링크와 전송도 가능해야한다. (script를 썼다면 noscript 도)
- **js를 태그와 분리**한다. 태그는 컨텐츠의 의미와 구조를 파악하는데 있기에 마크업과 js는 분리 : 인라인 이벤트 핸들러, 인라인 style속성은 내용이 아니므로 태그에 사용하지 않는다.
- 페이지가 자바스크립틍 의존적으로 만들어서는 안되며, 필수요건이 되어서는 안된다. 자바스크립트는 페이지를 향상 시키기만 해야한다.

```javascript
//안티패턴
console.log(navigator.userAgent.indexOf('MSIE'));
if (navigator.userAgent.indexOf('MSIE') !== -1) {
  document.attachEvent('onclick', console.log);
}

// 더 좋은방법
if (document.attachEvent) {
  document.attachEvent('onclick', console.log);
}

// 조금 더 정확한 방법
if (typeof document.attachEvent !== "undefined") {
  document.attachEvent('onclick', console.log);
}
```

사용자 에이전트를 감지해 코드를 분기하는 대신에, 위와같이 기능탐지를 쓴다. 사용자 에이전트 감지는 안티패턴이므로 최후의 선택사항으로 고려해야 한다.



## 8.2 DOM 스크립팅

### DOM 접근

DOM 접근은 비용이 많이 드는 작업이기 때문에 DOM 접근을 최소화 해야한다. 

- 루프 내에서 DOM접근을 피한다. 
- DOM 참조를 지역변수에 할당하여 사용한다. 
- 가능하면 셀렉터 API를 사용한다. 
- HTML 콜렉션을 순회할 때 length를 캐시하여 사용한다 (2장참고)

```javascript
// 안티패턴
var padding = document.getElementById('result').style.padding,
margin = document.getElementById('result').style.margin;

// 개선안
var style = document.getElementById('result').style,
padding = style.padding,
margin = style.margin;

// 셀렉터 API를 사용하는 예제 
document.querySelector("ul .selected");
document.querySelector("#widget .class");
```
- 위에 셀렉터 메서드는 DOM 메서드를 사용한 선택방식보다 항상 빠르다. 
- 자주 접근하는 엘리먼트에 id속성을 추가하는 것도 성능 향상에 도움이 될 수 있다. document.getElementById 가 노드를 찾는 가장 빠른 방법이다. 

### DOM조작

- DOM업데이트시 브라우저는 화면을 다시 그리고, 엘리먼트들을 재구조화 하는데, 비용이 많이 들기 때문에 업데이트를 최소화 하는것이 좋다. 
- 이를 위해 변경사항들을 일괄 처리하거나, 실제 문서 트리 외부에서 변경작업을 수행해야 한다. 

문서에 노드를 붙일 때 피해야 할 안티패턴

```javascript
// 안티패턴
// 노드를 만들고 곧바로 문서에 붙인다. 

var p, t;

p = document.createElement("p");
t = document.createTextNode("first paragraph");
p.appendChild(t);
document.body.appendChild(p);

p = document.createElement("p");
t = document.createTextNode("second paragraph");
p.appendChild(t);
document.body.appendChild(p);
```

개선안은 문서조각을 생성해 외부에서 수정한 후, 처리가 완전히 끝난 다음에 실제 DOM에 추가하는 것이다. 

```javascript
var p, t, frag;

frag = document.createDocumentFragment();

p = document.createElement("p");
t = document.createTextNode("first paragraph");
p.appendChild(t);
frag.appendChild(p);

p = document.createElement("p");
t = document.createTextNode("second paragraph");
p.appendChild(t);
frag.appendChild(p);

document.body.appendChild(frag);
```

위와같은 방식은 <p>엘리먼트를  생성할때마다 문서를 변경하지 않고, 마지막에 단 한번만 문서를 변경한다. 

하지만 문서에 이미 존재하는 트리를 변경할 때는??

```javascript
var oldnode = document.getElementById("result"),
    clone = oldnode.cloneNode(true);

// 본제본을 가지고 변경작업을 처리
// 변경이 끝나고 나면 원래의 노드와 교체
oldnote.parentNode.replaceChild(clone, oldnode);
```



## 8.3 이벤트

### 이벤트 처리

클릭할 떄마다 카운터의 숫자를 증가시키는 버튼.

```html
<button id="clickme">Click me : 0 </button>
```

```javascript
// 차선책
var b = document.getElementById("clickme"),
    count = 0;
b.onclick = function () {
  count += 1;
  b.innerHTML = "Click me : " + count;
}
```

*이 패턴으로는 하나의 클릭이벤트에 여러개의 함수가 실행되게 하면서 동시에 낮은 결합도를 유지하기 어렵다. onclick에 이미 함수가 할당되었는지 확인하고, 할당되어 있다면 이미 존재하는 함수를 새로운 함수에 추가하고 이를 onclick의 값으로 대체하면된다. ???*

addEventListener() 메서드를 사용하면 깔끔하다. IE8버전 이하에서는 attachEvent() 메서드를 사용해야 한다. 

4장 초기화 시점 분기 패턴을 다룰 때 브라우저이벤트 리스너 유틸리티를 정의하는 구현예제를 보았다. 여기서는 버튼에 리스터를 붙여보자. 

```javascript
var b = document.getElementsById("clickme");

if (document.addEventListener) { //W3C
  b.addEventListener("click", myHandler, false);
} else if (document.attachEvent) { //IE
  b.attachEvent("onclick", myHandler);
} else { //최후의 수단
  b.onclick = myHandler;
}
function myHandler(e) {
  var src, parts;

  // 이벤트 객체와 소스 엘리먼트를 가져온다.
  e = e || window.event;
  src = e.target || e.srcElement;

  // 버튼의 라벨을 변경한다.
  parts = src.innerHTML.split(":");
  parts[1] = parseInt(parts[1], 10) + 1;
  src.innerHTML = parts[0] + ": " + parts[1];

  // 이벤트가 상위노드로 전파되지 않게 한다.
  if (typeof e.stopPropagation === "function") {
    e.stopPropagation();
  }
  if (typeof e.cancelBubble !== "undefined") {
    e.cancelBubble = true;
  }
  // 기본 동작이 수쟁되지 않게한다.
  if (typeof e.preventDefault === "function") {
    e.preventDefault();
  }
  if (typeof e.returnValue !== "undefined") {
    e.returnValue = false;
  }
}
```



### 이벤트위임

이벤트 위임패턴은 이벤트 버블링을 이용해서 개별노드에 붙는 이벤트 리스너의 개수를 줄여준다. div 내에 열개의 버튼이 있다면 각 버튼 엘리먼트에 리스터를 붙이는 대신 div엘리먼트에 하나의 이벤트 리스너만 붙인다. 

```html
<div id="click_wrap">
  <button class="clickme">Click me : 0 </button>
  <button class="clickme">Click me : 0 </button>
  <button class="clickme">Click me : 0 </button>
  <button class="clickme">Click me : 0 </button>
</div>
```

```javascript
function myHandler(e) {
  var src, parts;

  // 이벤트 객체와 소스 엘리먼트를 가져온다.
  e = e || window.event;
  src = e.target || e.srcElement;

  if (src.nodeName.toLowerCase() !== "button") {
    return;
  }

  // 버튼의 라벨을 변경한다.
  parts = src.innerHTML.split(":");
  parts[1] = parseInt(parts[1], 10) + 1;
  src.innerHTML = parts[0] + ": " + parts[1];

  // 이벤트가 상위노드로 전파되지 않게 한다.
  if (typeof e.stopPropagation === "function") {
    e.stopPropagation();
  }
  if (typeof e.cancelBubble !== "undefined") {
    e.cancelBubble = true;
  }
  // 기본 동작이 수쟁되지 않게한다.
  if (typeof e.preventDefault === "function") {
    e.preventDefault();
  }
  if (typeof e.returnValue !== "undefined") {
    e.returnValue = false;
  }
}

var b = document.getElementById("click_wrap");

if (document.addEventListener) { //W3C
  b.addEventListener("click", myHandler, false);
} else if (document.attachEvent) { //IE
  b.attachEvent("onclick", myHandler);
} else { //최후의 수단
  b.onclick = myHandler;
}
```



최신의 자바스크립트 라이브러리는 이벤트 위임을 쉽게 사용할 수 있도록 편리한 API를 제공한다. ex: YUI3의 Y.delegate() 메서드 

```html
<script src="http://yui.yahooapis.com/3.0.0/build/yui/yui-min.js"></script>
```



## 8.4 장시간 수행되는 스크립트

자바스크립트에는 스레드가 없지만, setTimeout()이나 최신브라우저에서 지원하는 웹워커(web worker)를 사용해 스레드를 흉내낼 수 있다.



###setTimeout()

많은 양의 작업을 작은 덩어리로 쪼개고 각 덩어리를 setTimeout()을 이용해 1밀리초 간격의 타임아웃을 두고 실행하는 방법으로 스레드를 시뮬레이션 할 수 있다. UI를 응답가능한 상태로 유지함으로서 사용자가 더 편하게 브라우저를 제어할 수 있게 해준다. 

1밀리초 단위는 브라우저와 운영체제에 따라 다르다. 

```javascript
if (privateMember.scrollSync) {
  if (!privateMember.vertical.visible && privateMember.parentElement.innerHeight() < privateMember.element.client.outerHeight()) {
    privateMember.vertical.visible = true;
    privateMember.element.vertical.body.show();
    privateMember.vertical.maxSize = privateMember.element.client.outerHeight();

    setTimeout(function () {
      privateMember.element.vertical.scrollBarArea.scrollBar.css("height", (privateMember.element.vertical.scrollBarArea.body.innerHeight() * ((privateMember.element.vertical.scrollBarArea.body.innerHeight() - privateMember.element.vertical.scrollBarArea.scrollBar.outerHeight()) / privateMember.vertical.maxSize - privateMember.parentElement.innerHeight())) + "px");
    }, 0);
```



### web worker

최신의 브라우저들은 장시간 수행되는 스키립트에 대한 또 다른 해결책을 제공한다. 

바로 웹워커다. 웹워커는 브라우저 내에서 백그라운드 스레드를 제공한다. 

복잡한 계산을 분리된 파일, 예를들어 my_web_worker.js에 두고, 메인 프로그램에서 다음과 같디 호출한다. 

```javascript
var ww = new Worker('my_web_worker.js');

ww.onmessage = function (event) {
  document.body.innerHTML +=
    '<p>백그라운드 스레드의 메시지 : ' +
    event.data + '</p > ';
};

var end = 1e8, tmp = 1;
ww.postMessage("안녕하세요");

while (end) {
  end -= 1;
  tmp += end;
  if (end === 5e7) {
    ww.postMessage("절반정도 진행되었습니다. 현재 tmp값은 " + tmp + "입니다.");
  }
}

ww.postMessage("작업종료");
```

