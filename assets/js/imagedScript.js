const { ipcRenderer } = require("electron");
const form = document.querySelector("form");
const fs = require("fs");
const path = require("path");

let fileName; //معرف اسم الصوره
let filePath; //معرف المسار الجديد
let imagePath; //معرف المسار الاصلى للصوره

let btn = document.querySelector(".img-upload");
let urlImg = document.querySelector(".url-image__input");
let preview = document.querySelector(".preview");
let divPreview = document.querySelector(".image-preview");

btn.addEventListener("click", function () {
  if (urlImg.value.length == 0) {
    ipcRenderer.send("upload-image");
  }
});

ipcRenderer.on("open-file", (event, arg, appPath) => {
  if (urlImg.value.length == 0) {
    imagePath = arg[0]; //المسار الأصلي  للصوره
    fileName = path.basename(imagePath); //اسم الصوره  فقط
    filePath =
      process.platform === "win32"
        ? appPath + "\\" + fileName
        : appPath + fileName; //المسار الجديد لحفظ الصوره
    preview.src = imagePath;
    divPreview.style.display = "block";
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.querySelector(".note").value;
  const urlImgPath = urlImg.value;
  if (urlImg.value.length == 0) {
    //نسخ الصوره المختارة إلى المكان المخصص لها
    fs.copyFile(imagePath, filePath, (err) => {
      if (err) throw err;
    });
    ipcRenderer.send("add-imaged-task", input, filePath);
  } else if (urlImg.value.length !== 0) {
    ipcRenderer.send("add-imaged-task", input, urlImgPath);
  }
});
