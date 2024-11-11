document.addEventListener('DOMContentLoaded', () => {
    generateLinkForPlan("básico")
    generateLinkForPlan("pro")
    generateLinkForPlan("premium")
})

function generateLinkForPlan(plan) {
    const message = encodeURIComponent("Buenas, me gustaría obtener información sobre el plan " + plan + " de FrankMenu.\n¿Podría saber más al respecto?\nDesde ya, muchas gracias."); // Mensaje predeterminado con saltos de línea
    const link = `https://wa.me/3854769930?text=${message}`;
    const btn = document.getElementById(plan +"-btn");
    btn.href = link;
}

document.addEventListener('click', function (event) {
    const target = event.target;

    if (target.tagName === 'A' && target.getAttribute('href').startsWith('#')) {
        event.preventDefault();

        const id = target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(id);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    }
});

document.getElementById("header-btn").onclick = () => {
    const element = document.getElementById('mobile-btns');
    const btn = document.getElementById('header-btn');
    element.classList.toggle("hidden");
    if (element.classList.contains("hidden")) {
        btn.name = "menu-outline";
    } else {
        btn.name = "close-outline"
    }
}