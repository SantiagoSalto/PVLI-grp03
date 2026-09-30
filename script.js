function mostrarPestana(idPanel, boton) {
  // Ocultar todos los paneles
  var paneles = document.querySelectorAll('.panel');
  for (var i = 0; i < paneles.length; i++) {
    paneles[i].classList.remove('activo');
  }

  // Quitar el color de todos los botones
  var botones = document.querySelectorAll('.pestana');
  for (var j = 0; j < botones.length; j++) {
    botones[j].classList.remove('activa');
  }

  // Mostrar el panel elegido y marcar su botón
  document.getElementById(idPanel).classList.add('activo');
  boton.classList.add('activa');
}
