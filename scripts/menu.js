var CURRENT_PAGE = "Items";
const ITEMS_LIMITE = 10;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("logo").src = LOGO_URL;
    
    if (PLAN != "Básico") {
        document.getElementById('cartBtn').classList.remove("hidden")
    } else {
        const buttons = document.getElementsByClassName('add-to-cart-btn');
        if (buttons.length > 0) {
            buttons.array.forEach(element => {
                element.classList.add("hidden")
            });
        }
    }

    displayStatus()
    displayTime()

    const loc = document.getElementById("location")
    loc.textContent = LOCATION + ", " + CITY
    if (LOC_URL != null) {
        loc.href = LOC_URL
        loc.classList.add("hover:font-bold", "hover:text-secondary")
    }

    const menu = document.getElementById('menu');
    const overlay = document.getElementById('overlay');
    const closeMenuButton = document.getElementById('closeMenu');

    // Cerrar el menú
    closeMenuButton.addEventListener('click', () => {
        menu.classList.add('hidden');
        overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden'); // Permitir scroll
    });

    // Cerrar el menú si se hace clic en el overlay
    overlay.addEventListener('click', () => {
        menu.classList.add('hidden');
        overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden'); // Permitir scroll
    });

    const selectElement = document.getElementById('send-method');
    const homeInfo = document.getElementById("home-info")

    selectElement.addEventListener('change', (event) => {
        if (event.target.value === 'Enviar a Domicilio') {
            homeInfo.classList.remove('hidden'); // Muestra el menú
        } else {
            homeInfo.classList.add('hidden'); // Oculta el menú para otras opciones
        }
    });
})

function openConfirmMenu() {
    const menu = document.getElementById('menu');
    const overlay = document.getElementById('overlay');
    menu.classList.remove('hidden');
    overlay.classList.remove('hidden');
}
function orderMessage() {
    const carrito = JSON.parse(localStorage.getItem(`${NAME}-Cart`)) || [];
    const fullName = document.getElementById("order-fullname").value;
    const paymentMethod = document.getElementById("payment-method").value
    const orderMethod = document.getElementById("send-method").value
    const infoExtra = document.getElementById("order-info").value

    if (!fullName) return alert("Debes completar con tu nombre completo");

    let itemsCounter = 0;
    let totalPayment = 0;
    let message = `*Nuevo pedido - ${NAME}*\n\n*Nombre Completo:* ${fullName}\n*Método de pago:* ${paymentMethod}\n*Pedido para:* ${orderMethod}`;

    if (orderMethod === "Enviar a Domicilio") {
        const street = document.getElementById("home-street").value.trim();
        const homeNum = document.getElementById("home-num").value.trim();
        const info = document.getElementById("home-info-extra").value.trim();

        if (!street || !homeNum) return alert("Debes completar los datos de tu domicilio");

        message += `\n(El precio del envío maneja con delivery)\n\n*Datos del Domicilio*\n*Calle:* ${street} - *Número:* ${homeNum}`;
        if (info) message += `\n*Datos extras:* ${info}`;
    }

    if (infoExtra) message += `\n\n*Dato extra:* ${infoExtra}`;
    message += "\n\n*Pedidos*";
    
    carrito.forEach(item => {
        PRODUCTS.forEach(product => {
            if (item.id == product.id) {
                const price = parseInt(product.precio.replace("$","").replace(".",""))
                itemsCounter++;
                totalPayment += item.cantidad * price
                message += `\n${itemsCounter}. ${product.nombre} (${item.cantidad}) - ${formatBalance(item.cantidad * price)}`;
            }
        })
    })

    message += `\n\n*Total a Pagar:* ${formatBalance(totalPayment)}`;
    const link = `https://wa.me/${NUMBER}?text=${encodeURIComponent(message)}`;

    document.getElementById("confirm-order").href = link;
}

function formatTime(horaStr) {
    const [hora, minutos] = horaStr.split(":").map(Number);
    const ahora = new Date();
    ahora.setHours(hora, minutos, 0, 0);
    return ahora;
}

function displayStatus() {
    const ahora = new Date();
    const dia = ahora.getDay();
    const horarioDia = horario[dia];

    const status = document.getElementById("localStatus")
    if (!horarioDia) {
        status.classList.add("bg-red-700")
        status.textContent = "Local cerrado"
        return;
    }

    // Obtener tiempos de apertura y cierre en formato Date
    const aperturaMañana = formatTime(horarioDia.turnoMañana.apertura);
    const cierreMañana = formatTime(horarioDia.turnoMañana.cierre);
    const aperturaTarde = formatTime(horarioDia.turnoTarde.apertura);
    const cierreTarde = formatTime(horarioDia.turnoTarde.cierre);

    const diferenciaMinutos = (hora1, hora2) => Math.floor((hora2 - hora1) / (1000 * 60));

    // Verificar condiciones de apertura y cierre para cada turno
    if ((diferenciaMinutos(ahora, aperturaMañana) <= 15 && diferenciaMinutos(ahora, aperturaMañana) > 0) || (diferenciaMinutos(ahora, aperturaTarde) <= 15 && diferenciaMinutos(ahora, aperturaTarde) > 0)) {
        status.classList.add("bg-yellow-600")
        status.textContent = "Próximamente abre"
    } else if ((diferenciaMinutos(cierreMañana, ahora) <= 15 && diferenciaMinutos(cierreMañana, ahora) > 0) || (diferenciaMinutos(ahora, cierreTarde) <= 15 && diferenciaMinutos(ahora, cierreTarde) > 0)) {
        status.classList.add("bg-yellow-600")
        status.textContent = "Próximamente cierra"
    } else if ((ahora >= aperturaMañana && ahora < cierreMañana) || (ahora >= aperturaTarde && ahora < cierreTarde)) {
        status.classList.add("bg-green-700")
        status.textContent = "Local abierto"
    } else {
        status.classList.add("bg-red-700")
        status.textContent = "Local cerrado"
    }
}

function convertTime(hora24) {
    let [hora, minutos] = hora24.split(':');
    hora = parseInt(hora);
    const periodo = hora >= 12 ? 'pm' : 'am';
    hora = hora % 12 || 12; // Ajuste para formato 12 horas
    return `${hora}:${minutos}${periodo}`;
}

function displayTime() {
    const hoy = new Date();
    const dia = hoy.getDay();
    const horarioDia = horario[dia];

    const localTime = document.getElementById("localTime")
    if (!horarioDia) {
        localTime.textContent = "Hoy no abre";
    } else {
        const { turnoMañana, turnoTarde } = horarioDia;
        localTime.textContent = `${convertTime(turnoMañana.apertura)} - ${convertTime(turnoTarde.cierre)}`;
    }
}

function displaySection(id) {
    CATEGORIES.forEach(category => {
        document.getElementById(category + "Items").classList.add("hidden")
    })
    if(id == "ALL") {
        CATEGORIES.forEach(category => {
            document.getElementById(category + "Items").classList.remove("hidden")
        })
    } else {
        document.getElementById(id).classList.remove("hidden")
    }

    CURRENT_SECTION = id;
}
function toggleSection(btn, id) {
    document.getElementById(id).classList.toggle("hidden")
}

function displayItems() {
    togglePage("Items")
}
function displayCart() {
    togglePage("Cart")
}

function togglePage(page) {
    if (page == CURRENT_PAGE) return
    const cartButton = document.getElementById("cartBtn");
    const cartSection = document.getElementById("cart");
    const itemsSection = document.getElementById("items-section");
    const itemsButton = document.getElementById("itemsBtn");
    const itemsHeader = document.getElementById("items-header")

    const isCartPage = page === "Cart";

    cartSection.classList.toggle("hidden", !isCartPage);
    itemsSection.classList.toggle("hidden", isCartPage);

    itemsButton.classList.toggle("bg-primary", !isCartPage);
    itemsButton.classList.toggle("text-secondary", !isCartPage);
    itemsButton.classList.toggle("text-primary", isCartPage);

    cartButton.classList.toggle("bg-primary", isCartPage);
    cartButton.classList.toggle("text-secondary", isCartPage);

    CURRENT_PAGE = page;

    if (isCartPage) {
        cleanCartItems()
        loadCart();
        itemsHeader.classList.add("hidden")
    } else {
        itemsHeader.classList.remove("hidden")
    }
}
