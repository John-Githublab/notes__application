//const varibles
const noteArea = document.querySelector("#app");
const noteSidebar = document.querySelector(".notes__sidebar");
const notesAdd = document.querySelector(".notes__add");
const notesList = document.querySelector(".notes__list");
const notesPreview = document.querySelector(".notes__preview");
const notesTitle = document.querySelector(".notes__title");
const notesBody = document.querySelector(".notes__body");
const saveBtn = document.querySelector(".save__btn");
const notesListItem = document.getElementsByClassName("notes__list-item ");
// changing variables

let storage = [];
// day analyse swich case function
let dayWeek = function (day) {
  switch (day) {
    case 0:
      return "sunday";
    case 1:
      return "monday";
    case 2:
      return "tuesday";
    case 3:
      return "wednesday";
    case 4:
      return "thursday";
    case 5:
      return "friday";
    case 6:
      return "saturday";
  }
};

//function area
let dateUpdate = function () {
  let date = new Date();
  let today = dayWeek(date.getDay());
  let time = date.toLocaleTimeString();
  // am or pm check if time <12 its am other is pm
  let amORpm = time < 12 ? "am" : "pm";
  //time = time.slice(0, 2) > 12 ? time.slice(0, 2) - 12 : time;
  var hrs = time.slice(0, 2);
  if (time.slice(0, 2) > 12) {
    var hrs = time.slice(0, 2) - 12;
  }
  var sec = time.slice(3, 5);
  time = hrs + ":" + sec;
  let todaysdatetime = today + " " + time + " " + amORpm;
  return todaysdatetime;
};
// unique id generator
let uniqueIdGenerator = () => "id" + Math.random().toString(36).slice(6);

// localstorage updating with argument storage function

let localstorageUPdate = (storageArea = 0) => {
  // checking whther the key local storage is found
  // if not updating with a new one
  let localstorageData = localStorage.getItem("data");
  let timeAndDate = dateUpdate();
  if (!localstorageData) {
    let demo = {
      uniqueID: "34567",
      title: `Demo Notes`,
      para: `how to use this app 
      * AddNote => To add aa new note
      * SaveButton => click on save button for saving the text
      * DoubleClick => Double click a note to remove it `,
      date: timeAndDate,
    };
    storage.push(demo);
    let storageNew = JSON.stringify(storage);
    localStorage.setItem("data", storageNew);
  }

  // check whther storage is found
  if (storageArea) {
    let storageNew = JSON.stringify(storageArea);
    localStorage.setItem("data", storageNew);
  }
  // return the new local storage
  let Data = JSON.parse(localStorage.getItem("data"));
  return Data;
};
// update title and para accordingly
let updateTexts = function (newData, existdata) {
  // updating storage and localstorage
  existdata.title = newData.title;
  existdata.para = newData.para;
  localstorageUPdate(storage);

  // updating text and para
  let dataclassName = document.querySelector(`.demo${newData.title}`);
  dataclassName.querySelector(".notes__small-title").textContent =
    newData.title;
  dataclassName.querySelector(".notes__small-body").textContent = newData.para;
};

// first time view update
let updateView = function (newstorage) {
  // updating everyone at loading or starting time
  console.log(newstorage);
  notesList.textContent = "";
  newstorage.forEach((val, ind) => {
    let selected =
      ind === newstorage.length - 1 ? "notes__list-item--selected" : "";
    let html = `<div class="notes__list-item ${selected}" data-id="${val.uniqueID}">
    <div class="notes__small-title"> ${val.title}</div>
    <div class="notes__small-body">${val.para}.</div>
    <div class="notes__small-updated"> ${val.date} </div>
    </div>`;
    notesList.insertAdjacentHTML("afterbegin", html);
  });
};
// start function executes first
let startFunction = function () {
  notesPreview.setAttribute("style", "display: none");
  // updating localstorage
  storage = localstorageUPdate();
  console.log(storage);
  updateView(storage);
};

startFunction();
// realtime UI
function realtimeUI(demo) {
  // realtime updation of ui when notes added
  let html = `<div class="notes__list-item notes__list-item--selected" data-id="${demo.uniqueID}">
    <div class="notes__small-title"> ${demo.title}</div>
    <div class="notes__small-body">${demo.para}</div>
    <div class="notes__small-updated"> ${demo.date} </div>
    </div>`;
  notesList.insertAdjacentHTML("afterbegin", html);
}
//event listeners

notesAdd.addEventListener("click", function (e) {
  e.preventDefault();
  // resetting notesPreview
  //move the view to preview area data need to be fetched
  notesTitle.value = "Lecture Notes";
  notesBody.value = "I learnt nothing today.";
  notesPreview.setAttribute("style", "display: flex");
  let arr = [...notesListItem];
  arr.forEach((val) => val.classList.remove("notes__list-item--selected"));

  // setting the loading realtime ui and data is stored with uid number
  let timeAndDate = dateUpdate();
  let id = uniqueIdGenerator();
  let data = {
    uniqueID: id,
    title: notesTitle.value,
    para: notesBody.value,
    date: timeAndDate,
  };
  realtimeUI(data);
  notesPreview.setAttribute("data-id", data.uniqueID);

  storage.push(data);
  localstorageUPdate(storage);
});
let shiftArray = function (data) {
  // find the data to shift delete it
  let indexofData = storage.indexOf(data);
  storage.splice(indexofData, 1);

  // add it to final of the list
  storage.push(data);
};
// notepreviewing while clicking on the side note
noteSidebar.addEventListener("click", function (e) {
  // finding target element its parent and checking condition
  let target = e.target.parentElement;
  if (!target.classList.contains("notes__list-item")) return;
  let arr = [...notesListItem];
  arr.forEach((val) => val.classList.remove("notes__list-item--selected"));
  target.classList.add("notes__list-item--selected");
  // getattribute of data-id and view it in preview by finding the array
  let dataID = target.getAttribute("data-id");
  let data = storage.find((val) => val.uniqueID === dataID);
  notesPreview.setAttribute("style", "display: flex");
  notesPreview.setAttribute("data-id", dataID);
  notesTitle.value = data.title;
  notesBody.value = data.para;
});
function saving(e) {
  //selecting parent element and fin data id
  targetarea = e.target.parentElement;
  let dataId = targetarea.getAttribute("data-id");
  let datanew = storage.find((val) => val.uniqueID === dataId);

  // fetching data and saving to storage and update local storage
  datanew.title = notesTitle.value;
  datanew.para = notesBody.value;
  localstorageUPdate(storage);
  // sidebarupdate on seconds time
  let timeout = setTimeout(() => {
    shiftArray(datanew);
    updateView(storage);
  }, 300);
}
function Newsaving(e) {
  //selecting parent element and fin data id
  targetarea = e.target.parentElement;
  let dataId = targetarea.getAttribute("data-id");
  let datanew = storage.find((val) => val.uniqueID === dataId);

  // fetching data and saving to storage and update local storage
  datanew.title = notesTitle.value;
  datanew.para = notesBody.value;
  localstorageUPdate(storage);
  // sidebarupdate on seconds time
  let timeout = setTimeout(() => {
    shiftArray(datanew);
    // updateView(storage);
  }, 300);
}
saveBtn.addEventListener("click", saving);
notesTitle.addEventListener("focusout", Newsaving);
notesBody.addEventListener("focusout", Newsaving);

noteSidebar.addEventListener("dblclick", function (e) {
  let parentElement = e.target.closest(".notes__list-item");
  if (!parentElement) return;
  let userConfirme = confirm("Do you wanna delete the Note");
  if (!userConfirme) return;
  selectedData = parentElement.getAttribute("data-id");
  removingData = storage.find((val) => val.uniqueID === selectedData);
  removingDataIndex = storage.indexOf(removingData);
  storage.splice(removingDataIndex, 1);
  // updating local storage
  localstorageUPdate(storage);
  updateView(storage);
});

navigator.geolocation.getCurrentPosition(
  function (position) {
    console.log(position);
    let latitute = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log(`https://www.google.com/maps/@${latitute},${longitude}`);
  },
  function (position) {
    console.log("not working", position);
  }
);
