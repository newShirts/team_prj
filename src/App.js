

// 즉시 실행함수를 사용하여 dataModule 을 생성하고 모듈 내에서 DOM 요소를 가져오는 코드임
const dataModule = (function() {

  // 웹 페이지에서 사용하는 여러 요소를 저장
  const DOM = {
    addTag: document.querySelector('.addTag'),
    container: document.querySelector('.container'),
    tagContainer: document.querySelector('.container_tag'),
    tags: document.querySelectorAll('.tag'),
  };



  return {
    // getDom() 메서드를 정의하고 DOM 객체를 반환 - 모듈 내에서 DOM 객체를 캡슐화하여 다른 모듈에서 간편하게 사용
    getDOM() {
      return DOM;
    },

    // 따라서 다른 모듈에서 dataModule.getDom() 메서드를 호출하여 DOM요소를 가져올 수 있음
  }
})();

const image1 = document.querySelector('.image1');
const image2 = document.querySelector('.image2');
const image3 = document.querySelector('.image3');
const image4 = document.querySelector('.image4');
const image5 = document.querySelector('.image5');

const images = [image1, image2, image3, image4, image5];

// 태그를 활용한 업데이트
const controller = (function(){

  const tagHTML = function (keyword, [R, G, B]) {
    // 매개변수들을 사용하여 article 요소를 생성하고 이 요소를 문자열 형태로 반환
    // 반환되는 문자열을 article 요소의 style 속성값으로 rgba 색상값을 지정 그리고 0.7은 불투명값
    // 즉 tagHTML은 주어진 keyword 와 R, G, B 값을 이용하여 배경색을 가진 HTML 태그를 반환하는 함수 = 일반적으로 태그 검색 및 필터링 등에서 사용
    return `<article style="background-color: rgba(${R}, ${G}, ${B}, 0.7);" class="tag" data-keyword="${keyword}">#${keyword}</article>`
  };

  // min과 max 사이의 랜덤한 정수값을 반환 ex) randomRGB(0, 255)라면 0~255 사이의 랜덤한 값을 반환하여 RGB 색상 호출
  const randomRGB = function(min, max) {
    return Math.floor(Math.random() * (max - min) + 1) + min;
  }

  // 위와 마찬가지로 mix, max 범위내에서 랜덤한 값을 순서대로 push를 통해 arrRGB 배열을 정의 및 반환
  // 일반적으로 색상을 랜덤으로 지정해야 할 때 사용된다. ex) `getRandomRGB(0, 255)` 와 같이 호출하면 그 사이의 값의 색상값을 만들어 냄
  const getRandomRGB = function(min, max) {
    let arrRGB = [];
    arrRGB.push(randomRGB(min, max));
    arrRGB.push(randomRGB(min, max));
    arrRGB.push(randomRGB(min, max));
    return arrRGB;
  }

  // API를 이용한 사진 랜덤기술
  return {

      // searchByTag는 keyword를 매개변수로 받아들임
      searchByTag(event, keyword){
      fetch(`https://source.unsplash.com/featured/?${keyword.toLowerCase()}`)
      // fetch() 함수를 사용해서 Unplacsh API에서 Keyword에 해당하는 이미지를 가져오는 HTTP 요청
      .then((response) => {
        // 그리고나서 .then() 메서드를 이용해서 응답response 객체를 받아 응답객체의 url 속성을 사용하여 이미지 URL을 가져옴
        // images.push(imageUrl);
        const imageUrl = response.url;
        images[currentIndex].src = imageUrl; // 이미지 URL을 이미지 태그의 src 속성 -이미지경로 에 할당
        images[currentIndex].alt = keyword; // 이미지 태그의 alt - 대체텍스트 속성에 검색어 할당
        // images[currentIndex].classList.add('visible'); // 이미지 태그를 보이게 함

        images[currentIndex].addEventListener('load', () => {
        
        
        document.body.style.backgroundImage = `url(${response.url})`; //클릭 시 배경 이미지 전환

        showNextImage();

        // 이미지를 배열에 추가하고 첫 번째 이미지를 보여주기
        // 그리고 document.body.style.backgroundImage 속성에 할당을 통해 웹페이지의 배경이미지 변경
          });
        });
      },

      addNewTag(target, parentNode) {
        // target 은 HTML input 엘리먼트를 그러니까 원래 지정되어 있는, parentNode은 새로운 태그가 추가될 부모 엘리멘트를 가리킴
        const newColor = getRandomRGB(180, 230);
        // getRandomRGB 함수를 사용하여 랜덤 색을 배정
        const newHTML = tagHTML(target.value, newColor);
        // tagHTML 함수를 사용하여 새로운 태그의 HTML코드 생성
        parentNode.insertAdjacentHTML('beforeend', newHTML);
        // beforeend 위치에 newHTML을 삽입하여 새로운 태그를 추가 - insert 끼워넣다 Adjacent 인접한
        this.searchByTag(null, target.value);
        // 새로운 태그에 해당하는 이미지를 가져와서 웹페이지의 배경 이미지를 변경
        target.value = '';
        // target 엘리먼트 값을 초기화
        target.focus();
        // 포커스로 이동

        // 즉 searchByTag와 addNewTag 메서드를 함께 사용하여 태그를 추가할때마다 해당하는 이미지를 가져와서 배경이미지를 변경할 수 있음.
      },
    }
  })();

  let currentIndex = 0; 

  function showNextImage() {
    // 현재 인덱스 1 증가시키기
    currentIndex++;
  
    // 배열의 끝에 도달한 경우 처음부터 다시 시작하기
    if (currentIndex >= images.length) {
      currentIndex = 0;
    }
  
    // 현재 인덱스를 제외한 모든 이미지 태그를 감추기
      images.forEach((image, index) => {
        if (index !== currentIndex) {
          image.classList.remove('visible');
        }
      });
    };
    

  // DOM을 이용한 데이터관리
  const UIController = (function() {

    const DOM = dataModule.getDOM();
    // 맨 위의 dataModule에서 가져온 getDOM() 메서드를 호출하여 DOM요소를 가리키는 객체를 반환

    // DOM.tagContainer 요소에 클릭 이벤트 리스너를 추가. 클릭된 엘리먼트가 tag 클래스를 포함하지 않을 경우 함수 종료 
    DOM.tagContainer.addEventListener('click', event => {

      if (!event.target.classList.contains('tag')) return;
      const keyword = event.target.dataset.keyword;
      controller.searchByTag(null, keyword)
      // 1. 만약 클릭된 엘리먼트가 tag 클래스를 포함하고 있다면, 
      // 2. 클릭된 태그의 data-keyword 속성값을 keyword 변수에 저장하고
      // 3. controller.searchByTag() 메서드를 호출하여 해당키워드에 맞는 이미지 호출
    });

    // DOM.addTag 요소에 키다운 이벤트리스너 추가
    DOM.addTag.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        controller.addNewTag(e.target, DOM.tagContainer);
      }
    })
    // 1. 만약 눌린 키가 Enter 일 경우 controller.addNewTag() 메서드를 호출
    // 2. 이 메서드는 Dom.addTag 요소의 값을 가져와서 새로운 태그 생성
    // 3. 해당 태그에 맞는 이미지를 가져와 웹페이지의 배경 이미지 변경

    // 4. 마지막으로 DOM.addTag 요소에 포커스를 설정
    DOM.addTag.focus();

    // UIController 모듈은 DOM 요소에 이벤트 리스너를 추가하여 사용자 인터페이스를 제어
    // 사용자가 태그를 클릭하거나 새로운 추가할때마다 해당 키워드에 맞는 이미지를 가져와서 웹 페이지의 배경이미지를 변경
  })();

