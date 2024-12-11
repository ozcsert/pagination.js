let List = []
let currentPage = 1
const itemsPerPage = 9

let sayfalama = [1, 2, 3]
//numaralandirma fonksiyonlari boyunca
//bu saylafama arrayini manipule edecegiz ve sayfa numaralari
//buradan alinacak
let toplamSayfaSayisi = []

const getProduct = () => {
  fetch("./db.json")
    .then((res) => res.json())
    .then((list) => {
      List = list
      toplamSayfaSayisi = Math.floor(List.length / itemsPerPage) + 1
      console.log(toplamSayfaSayisi)

      renderProducts()
    })
    .catch((error) => console.error("Error fetching products:", error))
}

const setRating = (rating) => {
  let starsHTML = ""
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      starsHTML += '<div class="star full"></div>'
    } else if (i <= Math.ceil(rating)) {
      starsHTML += '<div class="star half"></div>'
    } else {
      starsHTML += '<div class="star empty"></div>'
    }
  }
  return starsHTML
}

const renderSayfalama = () => {
  const pageNumbersContainer = document.querySelector(".page-numbers")
  pageNumbersContainer.innerHTML = ""

  sayfalama.forEach((pageNumber, index) => {
    //pagination array'i icerisindeki her bir numara icin ilgili
    //pageButton'ununu olustur.
    const pageButton = document.createElement("button")
    //icerisindeki her itemin degerini textContent olarak atiyoruz.
    //(pageNumber ismini biz verdik. herhangi bir
    //isim verebiliriz for each fonksiyonunda. array icerisindeki
    //her bir item'i temsil eder)
    pageButton.textContent = `${pageNumber}`

    if (pageNumber === currentPage) {
      //secili sayfanin rengini degistirir. css icerisinde tanimli
      pageButton.classList.add("current")
    }

    pageButton.onclick = () => {
      currentPage = pageNumber

      switch (index) {
        //Sayfalarin numarasi eger sol tarafta ise sayfalama arrayinin icerisindeki
        //her sayiyi kucultur,
        //Sag tarafta ise siralamayi buyutur
        //Ortada ise mudahale etmez
        case 0:
          if (sayfalama[index] !== 1) {
            sayfalama = sayfalama.map((number) => number - 1)
          }
          break

        case 1:
          if (sayfalama[index] === 2) {
            //burasi islevsiz bir durumda. silinebilir. secenekler daha net
            //gorunsun diye biraktim
          }
          break

        case 2:
          if (sayfalama[index] < 10) {
            sayfalama = sayfalama.map((number) => number + 1)
          }
          break

        default:
          break
      }
      renderSayfalama()
      renderProducts()
    }
    //butonlari yapistirma
    pageNumbersContainer.appendChild(pageButton)
  })

  nextButton.disabled = currentPage >= toplamSayfaSayisi
  prevButton.disabled = currentPage === 1
}

const renderProducts = async () => {
  const container = document.querySelector(".products")
  container.innerHTML = ""

  renderSayfalama()

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const productsToShow = List.slice(startIndex, endIndex)

  productsToShow.forEach((eleman) => {
    const itemHTML = `
<div class="product">
<div class="image-container">
              <img class="category-page-image"
                src="${eleman.image}"
                alt="${eleman.title}"
              />
              </div> 
              <h2>${eleman.title}</h2>
              <div class="nt-stars-and-puan">
          <div class="stars">
            ${setRating(eleman.rating.rate)} 
              </div>  
            <div id="point-stars">${eleman.rating.rate}/5</div>
         </div>

         <div class="price">
         <p class="original-price">$${eleman.price}</p>
         </div> 
          </div>
    `
    container.innerHTML += itemHTML
  })
}

const prevButton = document.querySelector(".previous")
prevButton.onclick = () => sayfayi("dusur")
const nextButton = document.querySelector(".next")
nextButton.onclick = () => sayfayi("artir")

const sayfayi = (direction) => {
  //ARTIRMA FONKS
  if (direction === "artir" && currentPage < toplamSayfaSayisi) {
    currentPage += 1

    if (
      //sayfa numaralari array'ini gunceller
      sayfalama[sayfalama.length - 1] < toplamSayfaSayisi &&
      currentPage >= 3
    ) {
      sayfalama = sayfalama.map((number) => number + 1)
    }
  }

  //DUSURME FONKS
  else if (direction === "dusur" && currentPage > 1) {
    currentPage -= 1
    if (
      //sayfa numaralari array'ini gunceller
      sayfalama[0] > 1 &&
      currentPage <= toplamSayfaSayisi - 2
    ) {
      console.log("Previous:", currentPage)

      sayfalama = sayfalama.map((number) => number - 1)
    }
  }

  renderSayfalama()
  renderProducts()
}

getProduct()
