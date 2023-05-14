let btnbuscar = document.getElementById('BuscarJuego');
btnbuscar.addEventListener('click', BuscarJuego);


function BuscarJuego() {
  const searchInput = document.querySelector('.form-control');
  const searchText = searchInput.value.toLowerCase();
  fetch('https://www.moogleapi.com/api/v1/games')
    .then(response => response.json())
    .then(data => {
      const filteredData = data.filter(game => game.title.toLowerCase().includes(searchText));
      if (filteredData.length === 0) {
        document.getElementById('mensaje-error').style.display = 'block';
      } else {
        document.getElementById('mensaje-error').style.display = 'none';
        mostrarResultados(filteredData, resultadosPorPagina, 1);
      }
    })
    .catch(error => console.error(error));
}

const input = document.querySelector('.form-control');
const button = document.getElementById('BuscarJuego');

button.addEventListener('click', () => {
  const value = parseInt(input.value);
  if (value > 15) {
    alert('Tengo información hasta la versión 15, kupó!');
  }
});

let boton_siguiente = document.getElementById('boton_siguiente');
let boton_anterior = document.getElementById('boton_anterior');
let boton_todo = document.getElementById('boton_todo');

let cargando = document.getElementById('cargando');

const resultadosPorPagina = 5;
let paginaActual = 1;

// Fetch games data from API
fetch('https://www.moogleapi.com/api/v1/games')
  .then(response => response.json())
  .then(data => {
    // Loop through games and create table rows
    const totalResultados = data.length;
    const totalPaginas = Math.ceil(totalResultados / resultadosPorPagina);
    mostrarResultados(data, resultadosPorPagina, paginaActual);

    boton_siguiente.addEventListener('click', () => {
      if (paginaActual < totalPaginas) {
        paginaActual++;
        mostrarResultados(data, resultadosPorPagina, paginaActual);
      }
    });

    boton_anterior.addEventListener('click', () => {
      if (paginaActual > 1) {
        paginaActual--;
        mostrarResultados(data, resultadosPorPagina, paginaActual);
      }
    });

    boton_todo.addEventListener('click', () => {
      mostrarResultados(data, totalResultados, 1);
    });

    // Add event listener to search input
    const searchInput = document.querySelector('.form-control');
    searchInput.addEventListener('input', () => {
      const searchText = searchInput.value.toLowerCase();
      const filteredData = data.filter(game => game.title.toLowerCase().includes(searchText));
      mostrarResultados(filteredData, resultadosPorPagina, 1);
    });
  })
  .catch(error => console.error(error));

function mostrarResultados(data, resultadosPorPagina, pagina) {
  const inicio = (pagina - 1) * resultadosPorPagina;
  const fin = inicio + resultadosPorPagina;
  const resultadosActuales = data.slice(inicio, fin);

  let rows = '';
  resultadosActuales.forEach(game => {
    const row = `
      <tr>
        <td>${game.title}</td>
        <td><img src="${game.picture}" alt="${game.title}" style="max-width: 200px;"></td>
        <td>${game.releaseDate}</td>
        <td>${game.platform}</td>
        <td>${game.description}</td>
      </tr>
    `;
    rows += row;
  });

  // Clear table body before adding new rows
  document.getElementById('games-list').innerHTML = '';
  document.getElementById('games-list').innerHTML = rows;

  // Hide previous button if on first page
  if (pagina === 1) {
    boton_anterior.style.display = 'none';
  } else {
    boton_anterior.style.display = 'block';
  }
}