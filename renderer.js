const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');


const input = document.getElementById('myFile');
let inputFile = null;

input.addEventListener('change', () => {
  inputFile = input.files[0];
  document.getElementById('fName').innerText = inputFile.name;
});


const dropArea = document.getElementById('dropArea');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
});
   
dropArea.addEventListener('drop', (e) => {
  inputFile = e.dataTransfer.files[0];
  document.getElementById('fName').innerText = inputFile.name;
});

const submitButton = document.getElementById('submit');

submitButton.addEventListener('click', () => {
  handleSubmit();
});

const handleSubmit = () => {
  
  const allowed = ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/mp4', 'video/mp4', 'video/webm'];
  const extension = inputFile?.name?.split('.').pop()?.toLowerCase();

  if (!inputFile) {
    document.getElementById('error').innerText = "No file chosen!";
  } else if (inputFile && (allowed.includes(inputFile.type) || ['mp3','wav','m4a','mp4','webm'].includes(extension))) {
      saveFile().then(() => {
        ipcRenderer.send('trigger-transcription', 'Transcribe!');
      });
  } else {
    document.getElementById('error').innerText = "Invalid file type! \n Supported Types: mp3, wav, m4a, mp4, webm";
  }
}

const saveFile = async () => {
  fs.writeFileSync("./toConvert/" + inputFile.name, Buffer.from(await inputFile.arrayBuffer()));
}

ipcRenderer.on('finished', () => {
  const dl_link = document.getElementById('download');
  dl_link.href = "./converted/transkribed.txt";
  dl_link.innerText = "Download Transcription";
});