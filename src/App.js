
import React, {useEffect, useState} from 'react';


// 태그를 활용한 업데이트




  // 즉시 실행함수를 사용하여 dataModule 을 생성하고 모듈 내에서 DOM 요소를 가져오는 코드임
  const dataModule = (function() {

    // 웹 페이지에서 사용하는 여러 요소를 저장
    const DOM = {
      addTag: document.querySelector('.addTag'),
      container: document.querySelector('.container'),
      tagContainer: document.querySelector('.container__tag'),
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
      searchByTag(keyword){
        fetch(`https://source.unsplash.com/featured/?${keyword.toLowerCase()}`)
        // fetch() 함수를 사용해서 Unplacsh API에서 Keyword에 해당하는 이미지를 가져오는 HTTP 요청
        .then((response) => {
          // 그리고나서 .then() 메서드를 이용해서 응답response 객체를 받아 응답객체의 url 속성을 사용하여 이미지 URL을 가져옴
          // 그리고 document.body.style.backgroundImage 속성에 할당을 통해 웹페이지의 배경이미지 변경
          document.body.style.backgroundImage = `url(${response.url})`;
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
        this.searchByTag(target.value);
        // 새로운 태그에 해당하는 이미지를 가져와서 웹페이지의 배경 이미지를 변경
        target.value = '';
        // target 엘리먼트 값을 초기화
        target.focus();
        // 포커스로 이동

        // 즉 searchByTag와 addNewTag 메서드를 함께 사용하여 태그를 추가할때마다 해당하는 이미지를 가져와서 배경이미지를 변경할 수 있음.
      },
    }
  })();

  //검색한 사진 저장 배열 선언
  const images = [];

  //검색한 사진 배열에 추가
  const searchImage= async (query) => {
  const response = await fetch(`https://source.unsplash.com/featured/?${keyword.toLowerCase()}`);
  //const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=YOUR_ACCESS_KEY`);
  const data = await response.json();
  const imageUrls = data.results.map((result) => result.urls.regular);
  images.push(...imageUrls);
};

 //슬라이드를 표시할 컴포넌트 생성
 const Slide = ({ image, nextImage }) => {
  return (
    <div className="slide">
      <img src={image} alt="slide" />
      <img src={nextImage} alt="slide" className="next-slide" />
    </div>
  );
};

 //슬라이드쇼를 표시할 컴포넌트 생성
 const Slideshow = ({ images }) => {
  const [index, setIndex] = useState(0);
  const nextIndex = (index + 1) % images.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [index, nextIndex]);

  return (
    <div className="slideshow">
      <Slide image={images[index]} nextImage={images[nextIndex]} />
    </div>
  );
};


//const [query, setQuery] = useState('');

const handleSubmit = (event) => {
  event.preventDefault();
  searchImage(query);
}




  // DOM을 이용한 데이터관리
  const UIController = (function() {

    const DOM = dataModule.getDOM();
    // 맨 위의 dataModule에서 가져온 getDOM() 메서드를 호출하여 DOM요소를 가리키는 객체를 반환

    // DOM.tagContainer 요소에 클릭 이벤트 리스너를 추가. 클릭된 엘리먼트가 tag 클래스를 포함하지 않을 경우 함수 종료 
    DOM.tagContainer.addEventListener('click', event => {

      if (!event.target.classList.contains('tag')) return;

      const keyword = event.target.dataset.keyword;

      controller.searchByTag(keyword)
      // 1. 만약 클릭된 엘리먼트가 tag 클래스를 포함하고 있다면, 
      // 2. 클릭된 태그의 data-keyword 속성값을 keyword 변수에 저장하고
      // 3. ontroller.searchByTag() 메서드를 호출하여 해당키워드에 맞는 이미지 호출
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


  const msg = "%cWonkook Lee ⓒ oneook";
  // ⓒ 는 텍스트에 스타일 적용하기 위한 토큰
  // msg는 출력한 문자열이 저장 돼 있음
  const css = "font-size: 2em; color: #FEDC45; background-color: #000;font-family: 'Libre Baskerville', serif;";
  // css는 스타일을 지정하는 CSS코드가 저장돼 있음
  console.log(msg, css);
  // 문자열 msg와 스타일을 적용하기 위한 css 변수를 전달한다
  // msg문자열이 지정한 스타일로 출력 / 스타일은 CSS문법으로 출력

// 원본

// "use strict"

// const dataModule = (function() {

//   const DOM = {
//     addTag: document.querySelector('.addTag'),
//     container: document.querySelector('.container'),
//     tagContainer: document.querySelector('.container__tag'),
//     tags: document.querySelectorAll('.tag'),
//   };

//   return {
    
//     getDOM() {
//       return DOM;
//     },

//   }
// })();



// const controller = (function() {

//   const tagHTML = function (keyword, [R, G, B]) {
//     return `<article style="background-color: rgba(${R}, ${G}, ${B}, 0.7);" class="tag" data-keyword="${keyword}">#${keyword}</article>`
//   };

//   const randomRGB = function(min, max) {
//     return Math.floor(Math.random() * (max - min) + 1) + min;
//   }

//   const getRandomRGB = function(min, max) {
//     let arrRGB = [];
//     arrRGB.push(randomRGB(min, max));
//     arrRGB.push(randomRGB(min, max));
//     arrRGB.push(randomRGB(min, max));
//     return arrRGB;
//   }

//   return {

//     searchByTag(keyword) {
//       fetch(`https://source.unsplash.com/featured/?${keyword.toLowerCase()}`)
//       .then((response) => {
//         document.body.style.backgroundImage = `url(${response.url})`;
//       });
//     },

//     addNewTag(target, parentNode) {
//       const newColor = getRandomRGB(180, 230);
//       const newHTML = tagHTML(target.value, newColor);
//       parentNode.insertAdjacentHTML('beforeend', newHTML);
//       this.searchByTag(target.value);
//       target.value = '';
//       target.focus();
//     },

//   }

// })();




// const UIController = (function() {

//   const DOM = dataModule.getDOM();
//   DOM.tagContainer.addEventListener('click', event => {
//     if (!event.target.classList.contains('tag')) return;
//     const keyword = event.target.dataset.keyword;
//     controller.searchByTag(keyword)
//   });

//   DOM.addTag.addEventListener('keydown', e => {
//     if (e.key === 'Enter') {
//       controller.addNewTag(e.target, DOM.tagContainer);
//     }
//   })

//   DOM.addTag.focus();

// })();


// const msg = "%cWonkook Lee ⓒ oneook";
// const css = "font-size: 2em; color: #FEDC45; background-color: #000;font-family: 'Libre Baskerville', serif;";
// console.log(msg, css);

// const dataModule = (function() {

//   const DOM = {
//     addTag: document.querySelector('.addTag'),
//     container: document.querySelector('.container'),
//     tagContainer: document.querySelector('.container__tag'),
//     tags: document.querySelectorAll('.tag'),
//   };

//   return {

//     getDOM() {
//       return DOM;
//     },

//   }
// })();



// const controller = (function() {

//   const tagHTML = function (keyword, [R, G, B]) {
//     return `<article style="background-color: rgba(${R}, ${G}, ${B}, 0.7);" class="tag" data-keyword="${keyword}">#${keyword}</article>`
//   };

//   const randomRGB = function(min, max) {
//     return Math.floor(Math.random() * (max - min) + 1) + min;
//   }

//   const getRandomRGB = function(min, max) {
//     let arrRGB = [];
//     arrRGB.push(randomRGB(min, max));
//     arrRGB.push(randomRGB(min, max));
//     arrRGB.push(randomRGB(min, max));
//     return arrRGB;
//   }

//   return {

//     searchByTag(keyword) {
//       fetch(`https://source.unsplash.com/featured/?${keyword.toLowerCase()}`)
//       .then((response) => {
//         document.body.style.backgroundImage = `url(${response.url})`;
//       });
//     },


//     addNewTag(target, parentNode) {
//       const newColor = getRandomRGB(190, 255);
//       const newHTML = tagHTML(target.value, newColor);
//       parentNode.insertAdjacentHTML('beforeend', newHTML);
//       this.searchByTag(target.value);
//       target.value = '';
//       target.focus();
//     },

//   }

// })();


// const UIController = (function() {

//   const DOM = dataModule.getDOM();
//   DOM.tagContainer.addEventListener('click', event => {
//     if (!event.target.classList.contains('tag')) return;
//     const keyword = event.target.dataset.keyword;
//     controller.searchByTag(keyword)
//   });


//   DOM.addTag.addEventListener('keydown', e => {
//     if (e.key === 'Enter') {
//       controller.addNewTag(e.target, DOM.tagContainer);
//     }
//   })

//   DOM.addTag.focus();

// })();

