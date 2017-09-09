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
