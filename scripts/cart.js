function loadCart() {
    const carrito = JSON.parse(localStorage.getItem(`${NAME}-Cart`)) || [];
    const cartSection = document.getElementById("cart-full")
    const cartEmpty = document.getElementById("cart-empty")
    const cartItems = document.getElementById("cart-items")
    const cartSize = document.getElementById("cart-size")

    if (carrito.length < 1) {
        cartEmpty.classList.remove("hidden")
        cartSection.classList.add("hidden")
    } else {
        cartEmpty.classList.add("hidden")
        cartSection.classList.remove("hidden")

        carrito.forEach(target => {

            PRODUCTS.forEach(product => {
                if (product.id == target.id) {
                    const div = document.createElement('div')
                    div.classList.add("flex", "items-center", "justify-between", "w-full", "bg-gray-300", "p-5", "font-bold")

                    const secondDiv = document.createElement('div')
                    secondDiv.innerHTML = '<p>' + product.nombre + "</p>\n<p>" + product.precio + " c/u</p>"

                    const quantityInput = document.createElement('input')
                    quantityInput.value = target.cantidad
                    quantityInput.id = product.id
                    quantityInput.classList.add("font-bold", "py-1", "px-2", "w-[50px]", "outline-none", "bg-gray-200")
                    quantityInput.addEventListener('input', () => {
                        if (quantityInput.value != "") {
                            var quantity = quantityInput.value;
                            if (isNaN(quantity)) {
                                alert("Debe ser un número")
                            } else {
                                target.cantidad = quantity
                                localStorage.setItem(`${NAME}-Cart`, JSON.stringify(carrito));

                                updateTotal()
                            }
                        }
                    });

                    const icon = document.createElement('ion-icon')
                    icon.name = "trash-outline"
                    icon.classList.add("text-2xl", "hover:text-red-500", "cursor-pointer")

                    icon.addEventListener('click', () => {
                        div.remove()
                        removeItemFromCart(target.id)
                    })

                    div.append(secondDiv)
                    div.append(quantityInput)
                    div.append(icon)

                    cartItems.appendChild(div)
                }
            })
        })

        cartSize.textContent = carrito.length + " producto" + (carrito.length == 1 ? "" : "s");
    }

    updateTotal()
}

function removeItemFromCart(id) {
    removeFromCart(id)

    var carrito = JSON.parse(localStorage.getItem(`${NAME}-Cart`)) || [];

    if (carrito.length == 0) {
        const cartSection = document.getElementById("cart-full")
        const cartEmpty = document.getElementById("cart-empty")

        cleanCartItems()

        cartSection.classList.toggle("hidden")
        cartEmpty.classList.toggle("hidden")
    }

}

function cleanCartItems() {
    document.getElementById("cart-items").innerHTML = ''
}

function updateTotal() {
    var total = 0;

    const carrito = JSON.parse(localStorage.getItem(`${NAME}-Cart`)) || [];
    carrito.forEach(product => {
        PRODUCTS.forEach(target => {
            if (product.id == target.id) {
                total += (parseInt(target.precio.replace("$", "").replace(".", "")) * product.cantidad)
            }
        })
    })

    document.getElementById("total-cost").textContent = formatBalance(total)
}

function formatBalance(balance) {
    return balance.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS', // Cambia esto según la moneda deseada
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });;
}