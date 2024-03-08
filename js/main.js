
  const url = 'https://dummyjson.com/products'

  const getProducts = async () => {
    const res = await fetch(url)
    const data = await res.json()
    
    const products = data.products.map((product, index) => {
        let storedStock = localStorage.getItem(`stock-${index}`);
        if (storedStock) {
            product.stock = Number(storedStock);
        }
        return `
            <div class="product rounded-lg bg-white w-52 m-4">
            
                <div class="relative overflow-hidden bg-cover bg-no-repeat" data-te-ripple-init data-te-ripple-color="light">
                    <img class="rounded-lg  sm:m-h-48 md:h-48 w-full carts" src="${product.thumbnail}" alt="${product.brand}" />
                    <a href="#!">
                        <div
                            class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100">
                        </div>
                    </a>
                </div>
                
                <div class="p-2">
                    <div class="flex justify-between">
                        <h5 class="mb-2 text-sm font-bold leading-tight text-neutral-800">
                            ${product.title}
                        </h5>
                        <h5 class="mb-2 text-sm font-bold leading-tight text-neutral-800 ">
                            ${product.rating} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="w-4 h-4 ml-1">
                                <path fill-rule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                    clip-rule="evenodd" />
                            </svg>
                        </h5>
                    </div>
                    <p class="mb-1 text-sm text-neutral-600">
                        ${product.description}
                    </p>
        
                    <p class="mb-4 text-base text-neutral-600">
                        $${product.price}
                    </p>
                </div>
                    <div class="flex flex-row flex-wrap justify-between content-end "> 
                        <button id="btn-comprar-${index}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Comprar
                        </button>

                        <p id="stock-${index}"> Stock: ${product.stock} </p>
                    </div>
            </div>
        `
    }).join('')


        document.getElementById('products').innerHTML = products
        let total = 0; // Inicializar el total

        data.products.forEach((product, index) => {
              // Obtener el stock del localStorage
                let storedStock = localStorage.getItem(`stock-${index}`);
                if (storedStock) {
                    product.stock = Number(storedStock);
                }
            document.getElementById(`btn-comprar-${index}`).addEventListener('click', () => {
              if (product.stock > 0) {
                product.stock--;
                total += product.price; // Sumar el precio al total
                localStorage.setItem(`stock-${index}`, product.stock);
                document.getElementById('total').innerText = `Total a Pagar: ${total}`;
                // Agregar la compra a la tabla
                let table = document.getElementById('tabla-compras');
                let row = table.insertRow();
                let cell1 = row.insertCell(0);
                let cell2 = row.insertCell(1);
                let cell3 = row.insertCell(2);
                cell1.innerHTML = product.title;
                cell2.innerHTML = product.price;
                 cell3.innerHTML = `<button id="btn-eliminar-${index}" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Eliminar</button>`;

                 // Agregar evento de clic al botón de eliminar
                document.getElementById(`btn-eliminar-${index}`).addEventListener('click', () => {
                total -= product.price; // Restar el precio del total
                product.stock++;
                localStorage.setItem(`stock-${index}`, product.stock);
                document.getElementById('total').innerText = `Total a Pagar: ${total}`;
                
                table.deleteRow(row.rowIndex); // Eliminar la fila de la tabla
                document.getElementById(`stock-${index}`).innerText = `Stock: ${product.stock}`;
            });
      

              }if (product.stock === 0) {
                document.getElementById(`btn-comprar-${index}`).disabled = false;
                document.getElementById(`btn-comprar-${index}`).innerText = 'Agotado';
                document.getElementById(`btn-comprar-${index}`).classList.remove('bg-blue-500');
                document.getElementById(`btn-comprar-${index}`).classList.add('bg-red-500');
                Swal.fire({
                    icon: 'error',
                    title: 'Producto Agotado',
                    text: 'El producto se ha agotado 😔',
                  });

              }
              document.getElementById(`stock-${index}`).innerText = `Stock: ${product.stock}`;
            });
          });
          document.getElementById('total').innerText = `Total a Pagar: $${total}`;
          const btnPagar = document.getElementById('pagar');
          btnPagar.addEventListener('click', () => {
             if(total > 0){
                Swal.fire({
                    icon: 'success',
                    title: 'Compra Exitosa',
                    text: `El total de la compra es: $${total}`,
                  });
             }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No hay productos en el carrito',
                  });
             }
             
              }
          );
  }



    getProducts()