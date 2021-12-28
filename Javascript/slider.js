// FUNCION PARA EL SLIDE TRENDING
let trendslider = document.getElementById("gifos-view");
let start;
let change;
/**Slider mobile**/
trendslider.addEventListener("touchstart", (e) => {
    start = e.touches[0].clientX;
});
trendslider.addEventListener("touchmove", (e) => {
    e.preventDefault();
    let touch = e.touches[0];
    change = start - touch.clientX;
});

trendslider.addEventListener("touchend", slideShow);

function slideShow() {
    if (change > 0) {
        trendslider.scrollLeft += 80;
    } else {
        trendslider.scrollLeft -= 80;
    }
}
/**Slider Desktop */
let prev_btn = document.getElementById("trending-btn-previous");
let next_btn = document.getElementById("trending-btn-next");
prev_btn.addEventListener("click", (e) => {
    e.preventDefault();
    trendslider.scrollLeft -= 240;
});
next_btn.addEventListener("click", (e) => {
    e.preventDefault();
    trendslider.scrollLeft += 240;
});