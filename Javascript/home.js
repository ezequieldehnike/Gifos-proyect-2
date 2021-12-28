let api_key = "xjYxIlrLZQq1z0cRFUWc09N9xH66Z4hs"
let inputSearch = document.getElementById('input-search')
let bloqueBuscador = document.getElementById('buscador')
let iconSearch = document.getElementById('icon')
let btnBuscar = document.getElementById('buscador-lupa-gris')
let btnCerrarBusqueda = document.getElementById('cerrar-busqueda')
let btnCerrarBusquedaNocturno = document.getElementById('cerrar-busqueda-nocturno')
let listaSugerencias = document.getElementById('buscador-sugerencias')

let slidersearchGifos = document.getElementById('gifos-view-principal')
let sliderTrendingGifos = document.getElementById('gifos-view')
let nombre = ''
let busqueda
let offsetBusqueda = 0
let resultadosBusquedaGIFOS = document.getElementById('resultados-busqueda')
let btnVerMasResultados = document.getElementById('vermas')
let modalMobile = document.createElement("div")
let modalDesktop = document.createElement("div")


// BUSCADOR
// cuando se agranda el div y se muestran sugerencias:
inputSearch.addEventListener('keyup', buscadorActivo);

function buscadorActivo() {
    busqueda = inputSearch.value;

    //agrego las clases del buscador activo
    bloqueBuscador.classList.remove('buscador');
    bloqueBuscador.classList.add('buscador-activo');
    iconSearch.style.display = "none";
    btnCerrarBusqueda.style.display = "block";
    listaSugerencias.style.display = "block"

    //agrego la funcion de traer sugerencias y reemplazarlas en los elementos
    if (busqueda.length >= 1) {
        fetch(`https://api.giphy.com/v1/tags/related/${busqueda}?api_key=${api_key}&limit=4`)
            .then(response => response.json())
            .then(data => {
                sugerenciasData(data);
            })
            .catch(err => {
                console.error("error al traer sugerencias de busqueda", err);
            })
    } else {
        //funcion para cerrar el buscador cuando se borra todo
        cerrarBoxBusqueda();
    }
}

function cerrarBoxBusqueda() {
    //achico el contenedor de la busqueda
    bloqueBuscador.classList.add('buscador');
    bloqueBuscador.classList.remove('buscador-activo');
    iconSearch.style.display = "block";
    btnCerrarBusqueda.style.display = "none";
    listaSugerencias.style.display = "none"
}

//trae las sugerencias que van a ser mostradas en pantalla
function sugerenciasData(data) {
    let sugerencia = data.data;
    listaSugerencias.innerHTML = `
    <li class="sugerencia">
        <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-search-gris.svg" alt="sugerencia-lupa-gris"
        class="sugerencia-lupa-gris" id="buscador-lupa-gris">
        <p class="buscador-sugerencia-texto">${sugerencia[0].name}</p>
    </li>
    <li class="sugerencia">
        <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-search-gris.svg" alt="sugerencia-lupa-gris"
        class="sugerencia-lupa-gris" id="buscador-lupa-gris">
        <p class="buscador-sugerencia-texto">${sugerencia[1].name}</p>
    </li>
    <li class="sugerencia">
        <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-search-gris.svg" alt="sugerencia-lupa-gris"
        class="sugerencia-lupa-gris" id="buscador-lupa-gris">
        <p class="buscador-sugerencia-texto">${sugerencia[2].name}</p>
    </li>
    <li class="sugerencia">
        <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-search-gris.svg" alt="sugerencia-lupa-gris"
        class="sugerencia-lupa-gris" id="buscador-lupa-gris">
        <p class="buscador-sugerencia-texto">${sugerencia[3].name}</p>
    </li>`;
}

//funcion sugerencias: cuando se clickea una, se hace la busqueda de ese termino
listaSugerencias.addEventListener('click', function(li) {
    inputSearch.value = li.target.textContent;
    nombre = inputSearch.value
    searchGifo(nombre, offsetBusqueda, tranding = true);
    cerrarBoxBusqueda()
})

//cuando cierro la busqueda:
btnCerrarBusqueda.addEventListener('click', limpiarBusqueda);
btnCerrarBusquedaNocturno.addEventListener('click', limpiarBusqueda);

function limpiarBusqueda() {
    //vacío el input y devuelvo las clases del contenedor a como estaban
    inputSearch.value = "";
    inputSearch.placeholder = "Busca GIFOS y más";
    bloqueBuscador.classList.add('buscador');
    bloqueBuscador.classList.remove('buscador-activo');
    iconSearch.style.display = "block";
    btnCerrarBusqueda.style.display = "none";
    listaSugerencias.style.display = "none"
}

// FUNCION PARA TRAER LOS GIFOS EN LA SECCION DEL BUSCADOR

async function searchGifo(nombre, offsetBusqueda, tranding = false) {
    let response = await fetch(`https://api.giphy.com/v1/gifs/search?q=${nombre}&api_key=${api_key}&limit=12&offset=${offsetBusqueda}`)
    response = await response.json()
    renderView(response, tranding)
}

searchGifo()

function renderView(response, tranding) {
    gifos(response, slidersearchGifos, tranding)
}

//trae los gifos que van a ser mostrados en pantalla
function gifos(response, id, tranding) {
    if (tranding != false) {
        let gifArray = response.data;
        let gifoHtml = "";
        if (nombre.length > 0 || tranding === true) {
            for (let i = 0; i < gifArray.length; i++) {
                let array = gifArray[i];
                gifoHtml +=
                    `<div class="gif-contenedor" onclick="maxGifMobile('${array.images.downsized.url}', '${array.id}', '${array.slug}', '${array.username}', '${array.title}')">
                        <div class="gif-acciones">
                            <div class="iconos-acciones-gif">
                                <button class="iconos-acciones-box favorito" onclick="agregarFavoritoBusqueda('${array.id}')">
                                    <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-fav.svg" alt="icon-favorito" id="icon-fav-${array.id}">
                                </button>
                                <button class="iconos-acciones-box download" onclick="descargarGif('${array.images.downsized.url}', '${array.slug}')">
                                    <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-download.svg" alt="icon-download">
                                </button>
                                <button class="iconos-acciones-box max" onclick="maxGifDesktop('${array.images.downsized.url}', '${array.id}', '${array.slug}', '${array.username}', '${array.title}')">
                                    <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-max-normal.svg" alt="icon-max" id="icon-fav-maximizar" >
                                </button>
                            </div>
                            <div class="textos-descripcion-gif">
                                <p class="user-gif">${array.username}</p>
                                <p class="titulo-gif">${array.title}</p>
                            </div>
                        </div>
                        <img src="${array.images.downsized.url}" alt="${array.title}" class="trending-gif">
                    </div>`
            }
        }
        id.innerHTML = gifoHtml
    }
}

//FUNCION PARA BUSCAR APRETANDO ENTER 

btnBuscar.addEventListener('click', searchGifo);
inputSearch.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) {
        nombre = inputSearch.value
        searchGifo(nombre, offsetBusqueda, tranding = true);
    }
})

// FUNCION PARA TRAER LOS GIFOS EN LA SECCION DE TRENDING SLIDE

async function trendingGifos() {
    let content = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${api_key}&limit=15`)
    content = await content.json()
    viewTrending(content)
}

trendingGifos()

function viewTrending(content) {
    gifos(content, sliderTrendingGifos, trending = true)
}
btnBuscar.addEventListener('click', () => {
    offsetBusqueda = 0
    nombre = inputSearch.value
    searchGifo(nombre, offsetBusqueda, tranding = true)
})

// FUNCION PARA TRAER MAS GIFOS EN SECCION VER MAS

function gifosVermas(response, id, tranding) {
    if (tranding != false) {
        let gifArray = response.data;
        let gifoHtml = "";
        if (nombre.length > 0 || tranding === true) {
            for (let i = 0; i < gifArray.length; i++) {
                let array = gifArray[i];
                gifoHtml +=
                    `<div class="gif-contenedor" onclick="maxGifMobile('${array.images.downsized.url}', '${array.id}', '${array.slug}', '${array.username}', '${array.title}')">
                        <div class="gif-acciones">
                            <div class="iconos-acciones-gif">
                                <button class="iconos-acciones-box favorito" onclick="agregarFavoritoBusqueda('${array.id}')">
                                    <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-fav.svg" alt="icon-favorito" id="icon-fav-${array.id}">
                                </button>
                                <button class="iconos-acciones-box download" onclick="descargarGif('${array.images.downsized.url}', '${array.slug}')">
                                    <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-download.svg" alt="icon-download">
                                </button>
                                <button class="iconos-acciones-box max" onclick="maxGifDesktop('${array.images.downsized.url}', '${array.id}', '${array.slug}', '${array.username}', '${array.title}')">
                                    <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-max-normal.svg" alt="icon-max" id="icon-fav-maximizar" >
                                </button>
                            </div>
                            <div class="textos-descripcion-gif">
                                <p class="user-gif">${array.username}</p>
                                <p class="titulo-gif">${array.title}</p>
                            </div>
                        </div>
                        <img src="${array.images.downsized.url}" alt="${array.title}" class="trending-gif">
                    </div>`
            }
        }
        id.innerHTML += gifoHtml
    }
}

btnVerMasResultados.addEventListener('click', verMasResultados)

function verMasResultados() {
    offsetBusqueda = offsetBusqueda + 12
    busquedaGifosVerMas()
}
//el boton ver mas, trae gifos cuando el buscador se encuantra activo con una busqueda
function busquedaGifosVerMas() {
    event.preventDefault()
    let urlBusqueda = `https://api.giphy.com/v1/gifs/search?api_key=${api_key}&limit=12&offset=${offsetBusqueda}&q=`;
    let strBusqueda = inputSearch.value.trim()
    urlBusqueda = urlBusqueda.concat(strBusqueda)

    fetch(urlBusqueda)
        .then(response => response.json())
        .then(content => {
            // aparece el div con el titulo y resultados
            let contenedorResultadosBusqueda = document.getElementById('gifos-view-principal')
            contenedorResultadosBusqueda.style.display = "flex"

            if (content.data == 0) {
                resultadosBusquedaGIFOS.innerHTML = `
                    <div class="busqueda-error-contenedor">
                    <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-busqueda-sin-resultado.svg" alt="Busqueda sin resultado" class="busqueda-error-img">
                    <h3 class="busqueda-error-texto">Intenta con otra búsqueda</h3>
                    </div>
                    `
            } else {
                gifosVermas(content, slidersearchGifos, tranding = true)
            }
        })
        .catch(error => {
            console.log("error busqueda ver mas" + error)
        })
}

// TRENDING TOPICS (traigo los 5 primer trending topics de la API)

let trendingTopicsTexto = document.getElementById('trend-sub')
window.onload = trendingTopics()

function trendingTopics() {
    let url = `https://api.giphy.com/v1/trending/searches?api_key=${api_key}`
    return fetch(url)
        .then(resp => resp.json())
        .then(content => {
            let topics = content.data
            trendingTopicsTexto.innerHTML = `<span class="trend-sub-link">${topics[0]}, </span><span class="trend-sub-link">${topics[1]}, </span><span class="trend-sub-link">${topics[2]}, </span><span class="trend-sub-link">${topics[3]}, </span><span class="trend-sub-link">${topics[4]}</span>`

            let topicBtn = document.getElementsByClassName('trend-sub-link')
            for (let x = 0; x < topicBtn.length; x++) {
                topicBtn[x].addEventListener('click', function(e) {
                    searchGifo(topics[x], offsetBusqueda, tranding = true);
                    inputSearch.value = topics[x];
                    btnCerrarBusqueda.style.display = "block";
                    iconSearch.style.display = "none";
                    
                })
            }
        })
        .catch(err => {
            console.log("error trending topics" + err)
        })
}

//FUNCIONES ACCIONES GIF:

//FAVORITOS
function agregarFavoritoBusqueda(gif) {
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


//DESCARGAR GIF
async function descargarGif(gifImg, gifNombre) {
    let blob = await fetch(gifImg).then(img => img.blob());;
    invokeSaveAsDialog(blob, gifNombre + ".gif");
}


//MAXIMIZAR GIF MOBILE mobile
function maxGifMobile(img, id, slug, user, title) {
    if (window.matchMedia("(max-width: 1023px)").matches) {
        modalMobile.style.display = "block";
        modalMobile.innerHTML = `
    <button class="modal-btn-close" onclick="cerrarModalMobile()"><img src="Recursos/SpecExport-SketchMeasure2.4_files/close.svg" alt=""></button>
    <img src="${img}" alt="${id}" class="modal-gif">

    <div class="modal-bar">
        <div class="modal-textos">
            <p class="modal-user">${user}</p>
            <p class="modal-titulo">${title}</p>
        </div>
        <div class="div-max">
            <button class="modal-btn" onclick="agregarFavoritoMaxMobile('${id}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-fav-hover.svg" alt="fav-gif" id="icon-fav-max-mob-${id}"></button>
            <button class="modal-btn" onclick="descargarGif('${img}', '${slug}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-download.svg" alt="download-gif"></button>
        </div>
    </div>
    `;
        modalMobile.classList.add("modal-activado");
        document.body.appendChild(modalMobile);
    }
}

function cerrarModalMobile() {
    modalMobile.style.display = "none";
}

function agregarFavoritoMaxMobile(gif) {

    let iconFavMaxMobile = document.getElementById('icon-fav-max-mob-' + gif);
    iconFavMaxMobile.setAttribute("src", "Recursos/SpecExport-SketchMeasure2.4_files/icon-fav-active.svg");

    agregarFavorito(gif);
}


//MAXIMIZAR GIF DESKTOP
function maxGifDesktop(img, id, slug, user, title) {
    if (window.matchMedia("(min-width: 1023px)").matches) {
        modalDesktop.style.display = "block";
        modalDesktop.innerHTML = `
    <button class="modal-btn-close" onclick="cerrarModalDesktop()"><img src="Recursos/SpecExport-SketchMeasure2.4_files/close.svg" alt=""></button>
    <img src="${img}" alt="${id}" class="modal-gif">

    <div class="modal-bar">
        <div class="modal-textos">
            <p class="modal-user">${user}</p>
            <p class="modal-titulo">${title}</p>
        </div>
        <div class="div-max">
            <button class="modal-btn" onclick="agregarFavoritoMax('${id}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-fav.svg" alt="fav-gif" id="icon-fav-max-${id}"></button>
            <button class="modal-btn" onclick="descargarGif('${img}', '${slug}')"><img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-download.svg" alt="download-gif"></button>
        </div>
    </div>
    `;
        modalDesktop.classList.add("modal-activado");
        document.body.appendChild(modalDesktop);
    }
}

function cerrarModalDesktop() {
    modalDesktop.style.display = "none";
}

function agregarFavoritoMax(gif) {

    let iconFavMax = document.getElementById('icon-fav-max-' + gif);
    iconFavMax.setAttribute("src", "Recursos/SpecExport-SketchMeasure2.4_files/icon-fav-active.svg");

    agregarFavorito(gif);
}