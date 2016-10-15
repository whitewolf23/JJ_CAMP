/**
 * --------------------------------
 * Utility Helper Functions
 * ----------------------------- */
/** @function isDataType() */
// 자바스크립트의 데이터 유형을 완벽하게 체크함.
function isDataType(data) {
  return Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
}
/** @function isFunction() */
function isFunction(data) { return isDataType(data) === 'function'; }
/** @function isString() */
function isString(data) { return isDataType(data) === 'string'; }
/** @function isArray() */
function isArray(data) { return isDataType(data) === 'array'; }
/** @function isElement() */
function isElement(node) {
  if (!node) { return false; }
  return node.nodeType === 1;
}
/** @function validate() */
// 조건 확인 후, 조건이 참이면 오류 메시지를 띄움과 동시에 코드를 정지시킴.
function validate(condition, error_message) {
  if (condition) { throw new Error(error_message); }
}
/** @function isValidate() */
function isValidate(condition, success, fail) {
  // condition 조건이 참이고,
  // 사용자가 success 인자를 전달했고,
  // 그 인자가 함수 유형이라면 success 함수를 실행하라.
  if ( condition && success && isFunction(success) ) { success(); }
  if ( !condition && fail && isFunction(fail) ) { fail(); }
  return condition ? true : false;
}
/** @function detectFeature() */
function detectFeature(property) {
  validate( !isString(property), '첫번째 인자는 문자 유형이어야 합니다.' );
  return property in detectFeature.dummy.style;
}
// 메모이제이션 패턴
detectFeature.dummy = document.createElement('div');

// --------------------------------------------------------------------------------
// 함수 표현식 + 클로저
// IIFE 패턴 (즉시 실행하는 함수)
var detectFeatures = (function(){
  // 외부와 단절된 독립된 공간이 형성
  // 지역(Local Scope)
  var el           = null;
  var property     = null;
  var root_element = document.documentElement; // <html>
  function success(){ el.classList.add(property); }
  function fail(){ el.classList.add('no-' + property); }
  // 클로저 함수
  function _detectFetures(properties, element) {
      el = ((element && isElement(element)) && element) || root_element;
      validate( !isArray(properties), 'properties는 배열 유형이어야 합니다.' );
      for( var i=properties.length; properties[--i]; ) {
        property = properties[i];
        isValidate( detectFeature(property), success, fail );
      }
  }
  // 클로저 함수 반환
  return _detectFetures;
}());

// --------------------------------------------------------------------------------
// 함수 선언식 + 메모이제이션 패턴
// function detectFeatures(properties, element) {
//   detectFeatures.element = ((element && isElement(element)) && element) || detectFeatures.root_element;
//   validate( !isArray(properties), 'properties는 배열 유형이어야 합니다.' );
//   for( var property, i=properties.length; (property = properties[--i]); ) {
//     detectFeatures.property = property;
//     isValidate( detectFeature(property), detectFeatures.success, detectFeatures.fail );
//   }
// }
// detectFeatures.element = null;
// detectFeatures.property = null;
// detectFeatures.root_element = document.documentElement; // <html>
// detectFeatures.success = function(){
//   detectFeatures.element.classList.add(detectFeatures.property);
// };
// detectFeatures.fail = function(){
//   detectFeatures.element.classList.add('no-' + detectFeatures.property);
// };

/**
 * --------------------------------
 * DOM API: Selection
 * ----------------------------- */

/** @function id() */
function id(name) {
  // 타입 검증
  validate(typeof name !== 'string', '전달된 인자는 문자 유형이어야만 합니다.');
  return document.getElementById(name);
}

/** @function tag() */
function tag(name, context) {
  // 타입 검증
  validate(typeof name !== 'string', '전달된 인자는 문자 유형이어야만 합니다.');
  if ( context && context.nodeType !== document.ELEMENT_NODE ) {
    throw new Error('context 객체는 문서 요소 객체여야만 합니다.');
  }
  // 만약 사용자가 context 객체를 전달했고,
  // context 객체는 문서 요소객체라면
  // context를 사용한다.
  // 하지만 context 객체가 없다면
  // 기본값으로 document 객체를 사용한다.
  if( !context ) {
    context = document;
  }
  return context.getElementsByTagName(name);
}

/** @function queryAll() */
function queryAll(selector, context ) {
  // 첫번째 전달인자(Argument)의 유효성 검사
  var _ex = function(){
    console.info('전달인자는 문자열로 전달해야 합니다.');
    return null;
  };

  isValidate(typeof selector !== 'string', _ex)

  // 사용자 정의 값이 없을 경우, 값을 초기화
  context = context || document;
  // if ( !context ) {
  //   context = document;
  // }
  // 두번째 전달인자(Argument)의 유효성 검사
  if ( typeof context === 'string' ) {
    context = query(context);
  }
  validate(
    context.nodeType !== 1 && context.nodeType !== 9,
    '두번째 전달인자는 요소노드여야 합니다.'
  );
  return context.querySelectorAll(selector); // Nodelist []
}

/** @function query() */
function query(selector, context) {
  return queryAll(selector, context)[0];
}