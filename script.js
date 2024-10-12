let loadMoreBtn = document.querySelector('#load-more');
let currentItem = 8;

loadMoreBtn.onclick = () => {
  let boxes = [...document.querySelectorAll('.box-container .box')];
  for(var i = currentItem; i < currentItem + 4; i++) {
    boxes[i].style.display = 'inline-block';
  }
  currentItem += 4;
  if (currentItem >= boxes.length) {
       loadMoreBtn.style.display = 'none'
    }
}



// Variables
const carrito = document.getElementById('carrito');
const elementos1 = document.getElementById('lista-1');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
let totalPrecio = 0;
const totalDisplay = document.getElementById('total-precio'); 

cargarEventListeners();

function cargarEventListeners() {
    elementos1.addEventListener('click', comprarElemento);
    carrito.addEventListener('click', eliminarElemento);
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
}

function comprarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const elemento = e.target.parentElement.parentElement;
        leerDatosElemento(elemento);
        alert('¡Producto agregado al carrito!');
    }
}

function leerDatosElemento(elemento) {
    const infoElemento = {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h3').textContent,
        precio: parseFloat(elemento.querySelector('.precio').textContent.replace('$', '')), 
        id: elemento.querySelector('a').getAttribute('data-id')
    };
    insertarCarrito(infoElemento);
    actualizarTotal(infoElemento.precio); 
}

function insertarCarrito(elemento) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <img src="${elemento.imagen}" width="100" height="150px">
        </td>
        <td>
            ${elemento.titulo}
        </td>
        <td>
            $${elemento.precio.toFixed(2)} <!-- Mostrar el precio formateado -->
        </td>
        <td>
            <a href="#" class="borrar" data-id="${elemento.id}">X</a>
        </td>
    `;
    lista.appendChild(row);
}

function eliminarElemento(e) {
    e.preventDefault();
    let elemento, elementoId;

    if (e.target.classList.contains('borrar')) {
        elemento = e.target.parentElement.parentElement;
        const precioEliminado = parseFloat(elemento.querySelector('td:nth-child(3)').textContent.replace('$', ''));
        elemento.remove();
        actualizarTotal(-precioEliminado);
    }
}

function vaciarCarrito() {
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    totalPrecio = 0; 
    totalDisplay.textContent = '$0.00'; 
    return false;
}

function actualizarTotal(precio) {
    totalPrecio += precio;
    totalDisplay.textContent = `$${totalPrecio.toFixed(2)}`; 
}




document.getElementById('guardar-comprobante').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Comprobante de Compra', 10, 10);

    doc.setFontSize(12);
    doc.text('Productos Seleccionados:', 10, 20);

    const productos = document.querySelectorAll('#lista-carrito tbody tr');

    let y = 30; 

    productos.forEach((producto, index) => {
        const titulo = producto.querySelector('td:nth-child(2)').textContent;
        const precio = producto.querySelector('td:nth-child(3)').textContent;
        const tituloLimpio = doc.splitTextToSize(titulo, 120); 
        doc.text(`${index + 1}.`, 10, y); 
        doc.text(tituloLimpio, 20, y);   
        doc.text(precio, 160, y); 
        y += 10 + (tituloLimpio.length - 1) * 7; 
    });

    const total = document.getElementById('total-precio').textContent;
    doc.text(`Total a pagar: ${total}`, 10, y + 10);

    doc.save('comprobante.pdf');
});




