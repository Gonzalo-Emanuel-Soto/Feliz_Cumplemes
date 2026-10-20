const container = document.getElementById('hearts-container');

function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');

  // Posición horizontal aleatoria
  heart.style.left = Math.random() * 100 + 'vw';

  // Tamaño aleatorio entre 15px y 40px
  const size = Math.random() * 25 + 15;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;

  // Duración de elevación aleatoria entre 3s y 7s
  const duration = Math.random() * 4 + 3;
  heart.style.animationDuration = `${duration}s`;

  container.appendChild(heart);

  // Elimina el corazón cuando termina su animación
  setTimeout(() => {
    heart.remove();
  }, duration * 1000);
}

// Crea un corazón nuevo cada 300ms
setInterval(createHeart, 300);