import { getData } from "./src/getData.js";
import { appendFunc } from "./src/append.js";
import { searchStart } from "./src/search.js";
import { clickShow } from "./src/go.js";

let cardContainer = document.querySelector(".cardContainer");
let isSearch = false;
let num = 1;
let temp = ""; //temp가 undefined 되는거 해결

function urlAdr(num, what) {
  return `https://api.themoviedb.org/3/movie/${what}?language=ko-KR&page=${num}`;
}

//높은 평점순 데이터 가져오기
let datas = await getData(urlAdr(num, "top_rated"));
let total = datas.total_pages;
// datasRepeat(datas.results, {sort: "hightAvg"});

//인기영화 데이터 가져오기.
let popularDatas = await getData(urlAdr(num, "popular"));

datasRepeat(popularDatas.results, { sort: "popular" });

function datasRepeat(data, sortType) {
  for (let i = 0; i < data.length; i++) {
    Object.assign(data[i], sortType);
    console.log(data[i]);
    temp += appendFunc(data[i]);
  }
  // console.log(temp);
  if (sortType.sort === "popular") {
    return (document.querySelector(".swiper-wrapper").innerHTML += temp);
  } else if (sortType.sort === "hightAvg") {
    return (cardContainer.innerHTML += temp);
  }
}

//more버튼 누르면  more 함수 실행
document.querySelector("#more").addEventListener("click", () => more());

//추가 데이터 가져와서 붙여주기.
async function more() {
  if (!isSearch && num < total) {
    num++;
    temp = "";
    let datas = await getData(urlAdr(num));
    console.log(total, " 페이지 중 ", num);
    datasRepeat(datas.results);
  } else if (isSearch) {
    num++;
    temp = "";
    await searchStart();
  }
}

//검색 버튼 누르면 인풋값 가져오는 함수 실행
document
  .querySelector("#searchBtn")
  .addEventListener("click", async function () {
    temp = "";
    cardContainer.innerHTML = "";
    num = 1;
    isSearch = true;

    return await searchStart();
  });

//엔터키 입력하면 인풋값 가져오는 함수 실행
document
  .querySelector("#searchInput")
  .addEventListener("keypress", async function (e) {
    if (e.keyCode == 13 || e.which == 13) {
      temp = "";
      cardContainer.innerHTML = "";
      num = 1;
      isSearch = true;

      return await searchStart();
    }
  });

//카드 누르면 아이디 값 보여주고, 해당 페이지로 이동
document
  .querySelector(".cardContainer")
  .addEventListener("click", (e) => clickShow(e));

//화살표 누르면 좌표 맨 위로
document.querySelector(".upIconWarp").addEventListener("click", function () {
  window.scrollTo(0, 0);
});

export { cardContainer, num, temp, isSearch, datasRepeat };
