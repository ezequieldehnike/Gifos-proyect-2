let btnSwitchNocMobile = document.querySelector('#switchNocMobile')

//utilizo un evento para realizar el modo oscuro en el modo mobile
btnSwitchNocMobile.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    btnSwitchNocMobile.classList.toggle('active');
    //cuando el modo oscuro esta activo cambio la palabra modo oscuro y viceversa
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('dark-mode', 'true');
        btnSwitchNocMobile.innerHTML = 'Modo Diurno';
    } else {
        localStorage.setItem('dark-mode', 'false');
        btnSwitchNocMobile.innerHTML = 'Modo Nocturno';
    }console.log('jjjj');

});
// cuando actualice la pagina queda guardado en el localStorage el modo seleccionado
if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark');
    btnSwitchNocMobile.innerHTML = 'Modo Diurno';
} else {
    document.body.classList.remove('dark');
    btnSwitchNocMobile.innerHTML = 'Modo Nocturno';
}