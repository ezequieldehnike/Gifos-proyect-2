api_key = "xjYxIlrLZQq1z0cRFUWc09N9xH66Z4hs"
let pantallaFavoritos = document.getElementById('gifos-view-principal-fav');
let favoritosArray = [];
let favoritosString = localStorage.getItem("gifosFavoritos");
let modalMobileFav = document.createElement("div");
let modalDesktopFav = document.createElement("div");
let urlActual = window.location.pathname;

buscarFavoritos()

//funciones para mostrar los favoritos en la pagina
function buscarFavoritos() {
    let pantallaFavoritosVacio = document.getElementById('favoritos-vacio');

    if (favoritosString == null || favoritosString == "[]") {
        //1. si no tengo favoritos, muestro la pantalla favoritos vacia
        pantallaFavoritosVacio.style.display = "flex";
        pantallaFavoritos.style.display = "none";

    } else {
        favoritosArray = JSON.parse(favoritosString);
        let urlFavoritos = `https://api.giphy.com/v1/gifs?ids=${favoritosArray.toString()}&api_key=${api_key}`;

        fetch(urlFavoritos)
            .then(response => response.json())
            .then(content => {
                mostrarFavoritos(content);
            })
            .catch(err => {
                console.error('fetch favoritos fallo', err);
            })
    }
}

function mostrarFavoritos(content) {
    let gifosFavoritosArray = content.data;

    for (let i = 0; i < gifosFavoritosArray.length; i++) {
        pantallaFavoritos.innerHTML +=
            `<div class="resultados-gif-box-fav" onclick="maxGifMobileFav('${content.data[i].images.downsized.url}', '${content.data[i].id}', '${content.data[i].slug}', '${content.data[i].username}', '${content.data[i].title}')">
            <div class="gif-acciones-favoritos">
                <div class="iconos-acciones-gif">
                    <button class="iconos-acciones-box favorito" onclick="borrarFav('${content.data[i].id}')">
                        <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-fav-active.svg" alt="icon-favorito" id="icon-borrar-fav-${content.data[i].id}">
                    </button>
                    <button class="iconos-acciones-box download" onclick="descargarGif('${content.data[i].images.downsized.url}', '${content.data[i].slug}')">
                        <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-download.svg" alt="icon-dowlnoad">
                    </button>
                    <button class="iconos-acciones-box max" onclick="maxGifDesktopFav('${content.data[i].images.downsized.url}', '${content.data[i].id}', '${content.data[i].slug}', '${content.data[i].username}', '${content.data[i].title}')">
                        <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-max-normal.svg" alt="icon-max">
                    </button>
                </div>
                <div class="textos-descripcion-gif">
                    <p class="user-gif">${content.data[i].username}</p>
                    <p class="titulo-gif">${content.data[i].title}</p>
                </div>
            </div>
            <img src="${content.data[i].images.downsized.url}" alt="${content.data[i].title}" class="trending-gif">
        </div>`
    }
}

//FUNCION BORRAR FAV
function borrarFav(gif) {
    let arrayAux = [];
    arrayAux = JSON.parse(favoritosString);
    let indice = arrayAux.indexOf(gif);

    arrayAux.splice(indice, 1);

    let nuevoFavoritosString = JSON.stringify(arrayAux);
    localStorage.setItem("gifosFavoritos", nuevoFavoritosString);

    //cambio icono
    let iconFavBorrar = document.getElementById('icon-borrar-fav-' + gif);
    iconFavBorrar.setAttribute("src", "Recursos/SpecExport-SketchMeasure2.4_files/icon-fav-hover.svg");

    //refresco pag
    location.reload();
}

//FUNCION DESCARGAR GIF
async function descargarGif(gifImg, gifNombre) {
    let blob = await fetch(gifImg).then(img => img.blob());;
    invokeSaveAsDialog(blob, gifNombre + ".gif");
}

//FUNCION MAXIMIZAR GIF mobile
function maxGifMobileFav(img, id, slug, user, title) {
    if (window.matchMedia("(max-width: 1023px)").matches) {
        modalMobileFav.style.display = "block";
        modalMobileFav.innerHTML = `
    <button class="modal-btn-close" onclick="cerrarModalMobileFav()"><img src="Recursos/SpecExport-SketchMeasure2.4_files/close.svg" alt=""></button>
    <img src="${img}" alt="${id}" class="modal-gif">

    <div class="modal-bar">
        <div class="modal-textos">
            <p class="modal-user">${user}</p>
            <p class="modal-titulo">${title}</p>
        </div>
        <div class="div-max">
            <button class="modal-btn" onclick="borrarFavMaxMob('${id}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-fav-active.svg" alt="fav-gif" id="icon-borrar-fav-max-mobile-${id}"></button>
            <button class="modal-btn" onclick="descargarGif('${img}', '${slug}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-download.svg" alt="download-gif"></button>
        </div>
    </div>
    `;
        modalMobileFav.classList.add("modal-activado");
        document.body.appendChild(modalMobileFav);
    }
}

function cerrarModalMobileFav() {
    modalMobileFav.style.display = "none";
}

function borrarFavMaxMob(gif) {
    let iconNoFavMaxMob = document.getElementById('icon-borrar-fav-max-mobile-' + gif);
    iconNoFavMaxMob.setAttribute("src", "Recursos/SpecExport-SketchMeasure2.4_files/icon-fav-hover.svg");
    borrarFav(gif);
}


//MAXIMIZAR GIF DESKTOP
function maxGifDesktopFav(img, id, slug, user, title) {
    if (window.matchMedia("(min-width: 1023px)").matches) {
        modalDesktopFav.style.display = "block";
        modalDesktopFav.innerHTML = `
    <button class="modal-btn-close" onclick="cerrarModalDesktopFav()"><img src="Recursos/SpecExport-SketchMeasure2.4_files/close.svg" alt=""></button>
    <img src="${img}" alt="${id}" class="modal-gif">

    <div class="modal-bar">
        <div class="modal-textos">
            <p class="modal-user">${user}</p>
            <p class="modal-titulo">${title}</p>
        </div>
        <div class="div-max">
            <button class="modal-btn" onclick="borrarFav('${id}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-fav-active.svg" alt="fav-gif" id="icon-borrar-fav-max-${id}"></button>
            <button class="modal-btn" onclick="descargarGif('${img}', '${slug}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-download.svg" alt="download-gif"></button>
        </div>
    </div>
    `;
        modalDesktopFav.classList.add("modal-activado");
        document.body.appendChild(modalDesktopFav);
    }
}

function cerrarModalDesktopFav() {
    modalDesktopFav.style.display = "none";
}

function borrarFavMax(gif) {
    let iconNoFavMax = document.getElementById('icon-borrar-fav-max-' + gif);
    iconNoFavMax.setAttribute("src", "Recursos/SpecExport-SketchMeasure2.4_files/icon-fav-hover.svg");
    borrarFav(gif);
}


// AGREGAR A FAVORITOS

function agregarFavoritoFav(gif) {
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

// TRENDING GIFOS FAVORITOS

url = `https://api.giphy.com/v1/gifs/trending?api_key=${api_key}&limit=15`
sliderTrendingGifosFav = document.getElementById('gifos-view')
function trendingGifosFav() {
    fetch(url)
        .then(resp => resp.json()) 
        .then(content => {
            let trendingGifArray = content.data;
            let trendingGIFOhtml = "";
            for (let i = 0; i < trendingGifArray.length; i++) {
                let trendingGif = trendingGifArray[i];
                trendingGIFOhtml += `
                <div class="gif-contenedor" onclick="maxGifMobileTrendingFav('${trendingGif.images.downsized.url}', '${trendingGif.id}', '${trendingGif.slug}', '${trendingGif.username}', '${trendingGif.title}')">
                    <div class="gif-acciones">
                        <div class="iconos-acciones-gif">
                            <button class="iconos-acciones-box favorito" onclick="agregarFavoritoFav('${trendingGif.id}')">
                                <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-fav.svg" alt="icon-favorito" id="icon-fav-${trendingGif.id}">
                            </button>
                            <button class="iconos-acciones-box download" onclick="descargarGif('${trendingGif.images.downsized.url}', '${trendingGif.slug}')">
                                <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-download.svg" alt="icon-download">
                            </button>
                            <button class="iconos-acciones-box max" onclick="maxGifDesktopTrendingFav('${trendingGif.images.downsized.url}', '${trendingGif.id}', '${trendingGif.slug}', '${trendingGif.username}', '${trendingGif.title}')">
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
            sliderTrendingGifosFav.innerHTML = trendingGIFOhtml;
        })
    .catch(err => {
        console.log(err);
    })
}

trendingGifosFav()

//FUNCION MAXIMIZAR GIF mobile
function maxGifMobileTrendingFav(img, id, slug, user, title) {
    if (window.matchMedia("(max-width: 1023px)").matches) {
        modalMobileFav.style.display = "block";
        modalMobileFav.innerHTML = `
    <button class="modal-btn-close" onclick="cerrarModalMobileFav()"><img src="Recursos/SpecExport-SketchMeasure2.4_files/close.svg" alt=""></button>
    <img src="${img}" alt="${id}" class="modal-gif">
    <div class="modal-bar">
        <div class="modal-textos">
            <p class="modal-user">${user}</p>
            <p class="modal-titulo">${title}</p>
        </div>
        <div class="div-max">
            <button class="modal-btn" onclick="agregarFavoritoFav('${id}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-fav.svg" alt="fav-gif" id="icon-fav-${id}"></button>
            <button class="modal-btn" onclick="descargarGif('${img}', '${slug}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-download.svg" alt="download-gif"></button>
        </div>
    </div>`
        modalMobileFav.classList.add("modal-activado");
        document.body.appendChild(modalMobileFav);
    }
}

//FUNCION MAXIMIZAR TRENDING DESKTOP
function maxGifDesktopTrendingFav(img, id, slug, user, title) {
    if (window.matchMedia("(min-width: 1023px)").matches) {
        modalDesktopFav.style.display = "block";
        modalDesktopFav.innerHTML = `
    <button class="modal-btn-close" onclick="cerrarModalDesktopFav()"><img src="Recursos/SpecExport-SketchMeasure2.4_files/close.svg" alt=""></button>
    <img src="${img}" alt="${id}" class="modal-gif">
    <div class="modal-bar">
        <div class="modal-textos">
            <p class="modal-user">${user}</p>
            <p class="modal-titulo">${title}</p>
        </div>
        <div class="div-max">
            <button class="modal-btn" onclick="agregarFavoritoFav('${id}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-fav.svg" alt="favorito" id="icon-fav-${id}"></button>
            <button class="modal-btn" onclick="descargarGif('${img}', '${slug}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-download.svg" alt="download-gif"></button>
        </div>
    </div>`
        modalDesktopFav.classList.add("modal-activado");
        document.body.appendChild(modalDesktopFav);
    }
}

