import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import NasaService from './nasa.js';
import './styles.css';

function getPotd(response) {
  if (response.copyright) {
    $('#potd').append(`<img src="${response.hdurl}" class="picture">`);
  }
}

function clearPage() {
  $('#potd').text("");
  $('#roverPotd').text("");
}

function getRoverPotd(response) {
  console.log(response);
  if (response.photos.length===0) { // []
    return new Error("empty photo array");
  } else if (response.photos) { // []
    $('#roverPotd').append(`<img src="${response.photos[0].img_src}" class="picture">`);
    return;
  }
}

async function apiCallPotd() {
  const response = await NasaService.getPhoto();
  getPotd(response);
}

$(document).ready(function() {
  $('#potd-button').click(function() {
    clearPage();
    apiCallPotd();
  });
  $('#button').click(function() {
    clearPage();
    const camera = $("#camera").val();

    let val = NasaService.getRoverPhoto(camera)
      .then(function(response){
        return response;
      });
      
    val.then(function(response) {
      asyncFunc(response);
    });
    function asyncFunc(response) {
      try {
        const isRoverActive = getRoverPotd(response);
        if (isRoverActive instanceof Error) {
          $('#roverPotd').append(`<p>"No photos available at this time. Try another camera!"</p>`);
          throw Error("empty photo array");
        }
      } catch(error) {
        console.error(`${error.message}`);
      }
    }
  });
});