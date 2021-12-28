api_key = "xjYxIlrLZQq1z0cRFUWc09N9xH66Z4hs"
misGifosArray = []
misGifosString = localStorage.getItem("misGifos")
let pantallaMisGifos = document.getElementById('resultados-misgifos')
let modalMobileMG = document.createElement("div")
let modalDesktopMG = document.createElement("div")
buscarMisGifos()

//funciones para mostrar mis gifos en la paginaS
function buscarMisGifos() {
    let pantallaMisGifosVacio = document.getElementById('misgifos-vacio')
    if (misGifosString == null || misGifosString == "[]") {
        //1. si no tengo gif creados, muestro la pantalla mis gifos vacia
        pantallaMisGifosVacio.style.display = "flex"
        pantallaMisGifos.style.display = "none"
    } else {
        misGifosArray = JSON.parse(misGifosString);
        let urlMisGifos = `https://api.giphy.com/v1/gifs?ids=${misGifosArray.toString()}&api_key=${api_key}`
        fetch(urlMisGifos)
            .then(response => response.json())
            .then(content => {
                mostrarMisGifos(content);
            })
            .catch(err => {
                console.error('fetch mis gifos fallo', err);
            })
    }
}


function mostrarMisGifos(content) {
    let gifosMisGifosArray = content.data;
    for (let i = 0; i < gifosMisGifosArray.length; i++) {
        pantallaMisGifos.innerHTML += `
        <div class="resultados-gif-box-misgifos" onclick="maxGifMobileMG('${content.data[i].images.downsized.url}', '${content.data[i].id}', '${content.data[i].slug}', '${content.data[i].username}', '${content.data[i].title}')">
            <div class="gif-acciones-resultados-misgifos">
                <div class="iconos-acciones-gif">
                    <button class="iconos-acciones-box borrar" onclick="borrarGifo('${content.data[i].id}')">
                        <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-trash-normal.svg" alt="icon-borrar">
                    </button>
                    <button class="iconos-acciones-box download" onclick="descargarGif('${content.data[i].images.downsized.url}', '${content.data[i].slug}')">
                        <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-download.svg" alt="icon-download" >
                    </button>
                    <button class="iconos-acciones-box max" onclick="maxGifDesktopMG('${content.data[i].images.downsized.url}', '${content.data[i].id}', '${content.data[i].slug}', '${content.data[i].username}', '${content.data[i].title}')">
                        <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-max-normal.svg" alt="icon-max">
                    </button>
                </div>
                <div class="textos-descripcion-gif-misgifos">
                    <p class="user-gif-misgifos">${content.data[i].username}</p>
                    <p class="titulo-gif-misgifos">${content.data[i].title}</p>
                </div>
            </div>
            <img src="${content.data[i].images.downsized.url}" alt="${content.data[i].title}" class="resultados-gif">
        </div>`;
    }
}

// AGREGAR A FAVORITOS
let favoritosArray = [];
let favoritosString = localStorage.getItem("gifosFavoritos");

function agregarFavoritoMG(gif) {
    //cambio el icono del corazon
    let iconFav = document.getElementById('icon-fav-' + gif);
    iconFav.setAttribute("src", "Recursos/SpecExport-SketchMeasure2.4_files/icon-fav-active.svg");

    agregarFavorito(gif);

}

function agregarFavorito(gif) {

    //si en el local storage no hay nada, el array queda vacio
    if (favoritosString == null) {
        favoritosArray = [];

    } else {
        //si tengo contenido, necesito parsearlo para poder agregar uno nuevo independiente
        favoritosArray = JSON.parse(favoritosString);
    }

    favoritosArray.push(gif);
    //vuelvo a pasar a texto el array para subirlo al localStorage
    favoritosString = JSON.stringify(favoritosArray);
    localStorage.setItem("gifosFavoritos", favoritosString);
}


//FUNCION BORRAR GIF
function borrarGifo(gif) {
    let arrayAuxGifos = [];
    arrayAuxGifos = JSON.parse(misGifosString);
    let indiceGif = arrayAuxGifos.indexOf(gif);
    console.log(arrayAuxGifos);
    console.log(indiceGif);
    arrayAuxGifos.splice(indiceGif, 1);
    let nuevoMisGifosString = JSON.stringify(arrayAuxGifos);
    localStorage.setItem("misGifos", nuevoMisGifosString);
    location.reload();
}

//FUNCION DESCARGAR GIF
async function descargarGif(gifImg, gifNombre) {
    let blob = await fetch(gifImg).then(img => img.blob());;
    invokeSaveAsDialog(blob, gifNombre + ".gif");
}

//FUNCION MAXIMIZAR GIF mobile
function maxGifMobileMG(img, id, slug, user, title) {
    if (window.matchMedia("(max-width: 1023px)").matches) {
        modalMobileMG.style.display = "block";
        modalMobileMG.innerHTML = `
    <button class="modal-btn-close" onclick="cerrarModalMobileMG()"><img src="Recursos/SpecExport-SketchMeasure2.4_files/close.svg" alt=""></button>
    <img src="${img}" alt="${id}" class="modal-gif">
    <div class="modal-bar">
        <div class="modal-textos">
            <p class="modal-user">${user}</p>
            <p class="modal-titulo">${title}</p>
        </div>
        <div class="div-max">
        <button class="modal-btn" onclick="borrarGifo('${id}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-trash-normal.svg" alt="fav-gif" id="icon-borrar-fav-${id}"></button>
            <button class="modal-btn" onclick="descargarGif('${img}', '${slug}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-download.svg" alt="download-gif"></button>
        </div>
    </div>`
        modalMobileMG.classList.add("modal-activado");
        document.body.appendChild(modalMobileMG);
    }
}

function cerrarModalMobileMG() {
    modalMobileMG.style.display = "none";
}

//FUNCION MAXIMIZAR DESKTOP
function maxGifDesktopMG(img, id, slug, user, title) {
    if (window.matchMedia("(min-width: 1023px)").matches) {
        modalDesktopMG.style.display = "block";
        modalDesktopMG.innerHTML = `
    <button class="modal-btn-close" onclick="cerrarModalDesktopMG()"><img src="Recursos/SpecExport-SketchMeasure2.4_files/close.svg" alt=""></button>
    <img src="${img}" alt="${id}" class="modal-gif">
    <div class="modal-bar">
        <div class="modal-textos">
            <p class="modal-user">${user}</p>
            <p class="modal-titulo">${title}</p>
        </div>
        <div class="div-max">
            <button class="modal-btn" onclick="borrarGifo('${id}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-trash-normal.svg" alt="delete-gif"></button>
            <button class="modal-btn" onclick="descargarGif('${img}', '${slug}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-download.svg" alt="download-gif"></button>
        </div>
    </div>`
        modalDesktopMG.classList.add("modal-activado");
        document.body.appendChild(modalDesktopMG);
    }
}

function cerrarModalDesktopMG() {
    modalDesktopMG.style.display = "none";
}

// TRENDING GIFOS FAVORITOS

url = `https://api.giphy.com/v1/gifs/trending?api_key=${api_key}&limit=15`
sliderTrendingGifosMisGif = document.getElementById('gifos-view')
function trendingGifosMisGif() {
    fetch(url)
        .then(resp => resp.json()) 
        .then(content => {
            let trendingGifArray = content.data;
            let trendingGIFOhtml = "";
            for (let i = 0; i < trendingGifArray.length; i++) {
                let trendingGif = trendingGifArray[i];
                trendingGIFOhtml += `
                <div class="gif-contenedor" onclick="maxGifMobileTrendingMG('${trendingGif.images.downsized.url}', '${trendingGif.id}', '${trendingGif.slug}', '${trendingGif.username}', '${trendingGif.title}')">
                    <div class="gif-acciones">
                        <div class="iconos-acciones-gif">
                            <button class="iconos-acciones-box favorito" onclick="agregarFavoritoMG('${trendingGif.id}')">
                                <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-fav.svg" alt="icon-favorito" id="icon-fav-${trendingGif.id}">
                            </button>
                            <button class="iconos-acciones-box download" onclick="descargarGif('${trendingGif.images.downsized.url}', '${trendingGif.slug}')">
                                <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-download.svg" alt="icon-download">
                            </button>
                            <button class="iconos-acciones-box max" onclick="maxGifDesktopTrendingMG('${trendingGif.images.downsized.url}', '${trendingGif.id}', '${trendingGif.slug}', '${trendingGif.username}', '${trendingGif.title}')">
                                <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-max-normal.svg" alt="icon-max">
                            </button>
                        </div>
                        <div class="textos-descripcion-gif">
                            <p class="user-gif">${trendingGif.username}</p>
                            <p class="titulo-gif">${trendingGif.title}</p>
                        </div>
                    </div>
                    <img src="${trendingGif.images.downsized.url}" alt="${trendingGif.title}" class="trending-gif">
                </div>`
            }
            sliderTrendingGifosMisGif.innerHTML = trendingGIFOhtml;
        })
    .catch(err => {
        console.log(err);
    })
}

trendingGifosMisGif()

//FUNCION MAXIMIZAR GIF mobile
function maxGifMobileTrendingMG(img, id, slug, user, title) {
    if (window.matchMedia("(max-width: 1023px)").matches) {
        modalMobileMG.style.display = "block";
        modalMobileMG.innerHTML = `
    <button class="modal-btn-close" onclick="cerrarModalMobileMG()"><img src="Recursos/SpecExport-SketchMeasure2.4_files/close.svg" alt=""></button>
    <img src="${img}" alt="${id}" class="modal-gif">
    <div class="modal-bar">
        <div class="modal-textos">
            <p class="modal-user">${user}</p>
            <p class="modal-titulo">${title}</p>
        </div>
        <div class="div-max">
        <button class="modal-btn" onclick="agregarFavoritoMG('${id}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-fav.svg" alt="fav-gif" id='icon-fav-${id}'></button>
            <button class="modal-btn" onclick="descargarGif('${img}', '${slug}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-download.svg" alt="download-gif"></button>
        </div>
    </div>`
        modalMobileMG.classList.add("modal-activado");
        document.body.appendChild(modalMobileMG);
    }
}

//FUNCION MAXIMIZAR TRENDING DESKTOP
function maxGifDesktopTrendingMG(img, id, slug, user, title) {
    if (window.matchMedia("(min-width: 1023px)").matches) {
        modalDesktopMG.style.display = "block";
        modalDesktopMG.innerHTML = `
    <button class="modal-btn-close" onclick="cerrarModalDesktopMG()"><img src="Recursos/SpecExport-SketchMeasure2.4_files/close.svg" alt=""></button>
    <img src="${img}" alt="${id}" class="modal-gif">
    <div class="modal-bar">
        <div class="modal-textos">
            <p class="modal-user">${user}</p>
            <p class="modal-titulo">${title}</p>
        </div>
        <div class="div-max">
            <button class="modal-btn" onclick="agregarFavoritoMG('${id}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-fav.svg" alt="favorito" id='icon-fav-${id}'></button>
            <button class="modal-btn" onclick="descargarGif('${img}', '${slug}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-download.svg" alt="download-gif"></button>
        </div>
    </div>`
        modalDesktopMG.classList.add("modal-activado");
        document.body.appendChild(modalDesktopMG);
    }
}

