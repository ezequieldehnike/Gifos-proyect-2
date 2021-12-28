let btnSwitchNoc = document.querySelector('#switchNoc')

//utilizo un evento para realizar el modo oscuro
btnSwitchNoc.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    btnSwitchNoc.classList.toggle('active');
    //cuando el modo oscuro esta activo cambio la palabra modo oscuro y viceversa
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('dark-mode', 'true');
        btnSwitchNoc.innerHTML = 'MODO DIURNO';
    } else {
        localStorage.setItem('dark-mode', 'false');
        btnSwitchNoc.innerHTML = 'MODO NOCTURNO';
    }
});
// cuando actualice la pagina queda guardado en el localStorage el modo seleccionado
if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark');
    btnSwitchNoc.innerHTML = 'MODO DIURNO';
} else {
    document.body.classList.remove('dark');
    btnSwitchNoc.innerHTML = 'MODO NOCTURNO';
}