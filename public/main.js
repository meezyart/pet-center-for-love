(function () {

  // my little fake mock server
  // Enter your local host here
  const baseURL = "http://127.0.0.1:8080/public/",
        dogURL = "assets/data/dogs.json"

  // generatePetGallery(baseURL, term, element)
  generatePetGallery(baseURL + dogURL, 'dogs', 'gallery');

  // makes a call to the Pet Api and builds the gallery
  function generatePetGallery(baseURL, term, element) {
    const apiPromise = fetch(baseURL);
    const gallery = document.querySelector(`.${element}`);

    apiPromise
      .then(handleErrors)
      .then(data => data.json())
      .then(data => {
        try{
          if(!data[term]) return;
          const dataArr = data[term];

          dataArr.forEach((item, index) => {
            let photoObj = item;
            let galhtml = convertGalleryObjToHtml(photoObj, element, index + 1);
            gallery.innerHTML += galhtml;
          });

          setupModal(dataArr,element);
        } catch (e){
          throw Error('please Check the user or baseurl Information',e);
        }
      })
      .catch(err => {
        console.log(err, err.message);
      });
  }

  function setupModal(images, element) {
    const nextBtn = document.querySelector('.next'),
      prevBtn = document.querySelector('.prev'),
      img = document.querySelector('.modal__img'),
      modal = document.querySelector('.modal')
      closeBtn = document.querySelector('.modal__close'),
      galleryImages = document.querySelectorAll(`.${element}__item`),
      len = images.length;

    let countIndex = 0;

    galleryImages.forEach(function (item, index) {
      let enlargeBtn = item.querySelector('.btn');
      enlargeBtn.addEventListener('click', () => {
        modal.classList.add('modal--active');
        img.src = baseURL + images[index].image;
      })
    })

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('modal--active');
      })


    nextBtn.addEventListener('click', () => {
      countIndex++;
      if (countIndex >= len) {
        countIndex = 0;
      }
      img.src = baseURL + images[countIndex].image;
    })

    prevBtn.addEventListener('click', () => {
      countIndex--;
      if (countIndex < 0) {
        countIndex = len - 1;
      }
      img.src = baseURL + images[countIndex].image;
    })
  }



  function convertGalleryObjToHtml(galleryObj, element = 'gallery', index) {
    if (!galleryObj) return;

    let title = 'Image ' + index

    console.log(galleryObj.source);
    return `<figure class="${element}__item ${element}__item--${index}">
              <div class="${element}__side ${element}__side--front ">
                <img src="${baseURL + galleryObj.image}" alt="gallery_image_${galleryObj.title || title}" class="${element}__img ">
              </div>
              <div class="${element}__side ${element}__side--back ">
                <p> ${galleryObj.title || title}</p>
                <button class="btn btn-md">enlarge	&#128269;</button>
              </div>
            </figure>`;
  }



  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }





})()
