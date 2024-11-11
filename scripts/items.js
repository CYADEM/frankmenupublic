const PRODUCTS = [];
const CATEGORIES = [];
var CURRENT_SECTION = "ALL"

// Función principal para cargar productos
async function loadProducts() {
    const sheetNumber = '1';
    const tag = document.querySelector("script[e-id]");
    const id = tag.getAttribute('e-id');
    const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&sheet=${sheetNumber}`;

    try {
        const response = await fetch(url);
        const text = await response.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const rows = json.table.rows;
        const itemsContainer = document.getElementById('items-header');

        // Obtener categorías y crear secciones
        const categories = [...new Set(rows.map(row => row.c[2]?.v || "").filter(Boolean))];
        categories.forEach(category => createCategorySection(itemsContainer, category));

        // Límite de productos
        let itemsCount = 0;
        let canLoad = true;

        // Crear tarjetas de productos
        rows.forEach(row => {
            const rowData = row.c.map(cell => cell?.v || "");
            const [id, nombre, categoria, , disponible, descripcion, precio, imagenUrl] = rowData;

            if (categoria && disponible === "Si" && canLoad) {
                const product = { id, nombre, categoria, descripcion, precio, imagenUrl };
                PRODUCTS.push(product);

                preloadImage(imagenUrl);

                if (itemsCount++ >= ITEMS_LIMITE && PLAN === "Básico") {
                    canLoad = false;
                    console.warn("Límite de productos alcanzado. Cambia al plan Pro para cargar más productos.");
                }

                if (canLoad) createProductCard(categoria, product);
            }
        });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        if(isInCart(btn.id)) {
            const txt = document.getElementById(btn.id + "-txt")
            const button = document.getElementById(btn.id)
            txt.textContent = "Quitar del Carrito"
            button.classList.add("bg-red-600", "hover:bg-red-700")
        }
        btn.addEventListener('click', () => {
            if(isInCart(btn.id)) {
                removeFromCart(btn.id)
            } else {
                addToCart(btn.id)
            }
        });
    });

    displaySection(CURRENT_SECTION)
}

// Crear secciones de categorías
function createCategorySection(container, category) {
    const section = document.createElement('button')
    section.textContent = category;
    section.classList.add("py-1", "px-5", "border", "border-gray-400", "text-gray-400", "rounded-full", "hover:bg-green-200", "hover:text-black")
    
    section.addEventListener('click', () => {
        displaySection(`${category}Items`)
    })
    container.append(section)

    const itemsSection = document.getElementById('items-section')
    const div = document.createElement('div')

    div.id = `${category}Items`
    div.classList.add("w-full","hidden", "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-5")
    itemsSection.append(div)

    CATEGORIES.push(category)
    /*
    const section = document.createElement('section');
    section.classList.add('pb-2');

    const categoryItems = document.createElement('div');
    categoryItems.id = `${category}Items`;
    categoryItems.classList.add("hidden", "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "max-w-[85%]", "w-full", "mx-auto", "gap-10", "mt-10");

    const headerDiv = document.createElement('div');
    headerDiv.classList.add("py-3", "bg-primary", "text-xl", "text-white", "text-center", "font-semibold", "flex", "justify-center", "items-center", "gap-2");

    headerDiv.innerHTML = `<p>${category}</p><ion-icon onclick="toggleSection(this, '${category}Items')" name="caret-down-outline" class="hover:text-secondary cursor-pointer"></ion-icon>`;

    section.append(headerDiv, categoryItems);
    container.append(section);
    */
}

// Pre-cargar imágenes
function preloadImage(url) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => URL.createObjectURL(blob))
        .catch(err => console.error("Error precargando imagen:", err));
}

// Crear tarjeta de producto
function createProductCard(category, product) {
    const mainSection = document.getElementById(`${category}Items`);
    const mainDiv = document.createElement('div');
    mainDiv.classList.add("flex", "items-center", "justify-center", "px-2");

    const secondDiv = document.createElement('div');
    secondDiv.classList.add("w-full", "max-w-md", "mx-auto", "bg-white", "rounded-3xl", "shadow-xl", "overflow-hidden");

    const thirdDiv = document.createElement('div');
    thirdDiv.classList.add("max-w-md", "mx-auto");

    const fourthDiv = document.createElement('div');
    fourthDiv.classList.add("p-4", "sm:p-6");

    thirdDiv.innerHTML = `<div class="h-[236px] bg-[url('${product.imagenUrl}')] bg-cover"></div>`;
    fourthDiv.innerHTML = `
        <p class='font-bold text-gray-700 text-[22px] leading-7 mb-1'>${product.nombre}</p>
        <p class='text-xl font-bold text-[#0FB478]'>${product.precio}</p>
        <p class='text-[#7C7C80] font-[15px] mt-6'>${product.descripcion}</p>`;

    if (PLAN !== "Básico") {
        const cartDiv = document.createElement('div');
        cartDiv.id = product.id
        cartDiv.classList.add("flex", "justify-center", "items-center", "gap-2", "cursor-pointer","add-to-cart-btn", "w-full", "bg-green-500", "hover:bg-green-600", "mt-10", "py-3", "rounded-md", "text-white");

        const icon = document.createElement('ion-icon');
        icon.name = "bag-add-outline"
        icon.classList.add("text-2xl", "font-bold")

        const txt = document.createElement('p');
        txt.id = product.id + "-txt"
        txt.textContent = "Agregar al Carrito"

        cartDiv.append(icon)
        cartDiv.append(txt)
        fourthDiv.append(cartDiv)
    }

    thirdDiv.append(fourthDiv);
    secondDiv.append(thirdDiv);
    mainDiv.append(secondDiv);
    mainSection.append(mainDiv);
}

// Agregar al carrito
function addToCart(productId) {
    const item = {
        id: productId,
        precio: 1,
        cantidad: 1 // Inicializar cantidad en 1
    };
    const carrito = JSON.parse(localStorage.getItem(`${NAME}-Cart`)) || [];
    carrito.push(item);
    localStorage.setItem(`${NAME}-Cart`, JSON.stringify(carrito));

    const txt = document.getElementById(productId + "-txt")
    const btn = document.getElementById(productId)
    txt.textContent = "Quitar del Carrito"
    btn.classList.add("bg-red-600", "hover:bg-red-700")
}

function isInCart(productId) {
    const carrito = JSON.parse(localStorage.getItem(`${NAME}-Cart`)) || [];
    return carrito.some(item => item.id === productId);
}

function removeFromCart(productId) {
    var carrito = JSON.parse(localStorage.getItem(`${NAME}-Cart`)) || [];
    carrito = carrito.filter(product => product.id !== productId);

    // Actualiza el carrito en localStorage
    localStorage.setItem(`${NAME}-Cart`, JSON.stringify(carrito));

    const txt = document.getElementById(productId + "-txt")
    const btn = document.getElementById(productId)
    txt.textContent = "Agregar al Carrito"
    btn.classList.remove("bg-red-600", "hover:bg-red-700")
}

document.addEventListener('DOMContentLoaded', loadProducts);
