// Layar Kuis Kedip
export function kedipLayar(layarKuis) {
    if (!layarKuis) return;

    layarKuis.style.backgroundColor = "#0f380f"
    layarKuis.style.color = "#8bac0f"

    setTimeout(function() {
        layarKuis.style.backgroundColor = ""
        layarKuis.style.color = ""
    }, 100) 
}


// fungsi Healt Live
export function updateTampilanHealt(live) {
    const heartImages = document.querySelectorAll(".nyawa-img")

    heartImages.forEach((icon, index) => {
        if (index < live) {
            icon.style.webkitMaskImage = "url('./assets/pixel-heart.png')"
            icon.style.maskImage = "url('./assets/pixel-heart.png')"
        } 
        else {
            icon.style.webkitMaskImage = "url('./assets/pixel-heart-none.png')"
            icon.style.maskImage = "url('./assets/pixel-heart-none.png')"
        }
    });
}


export function tampilkanPeringatan(text) {
    const textPeringatan = document.getElementById("text-peringatan");
    const modalPeringatan = document.getElementById("modal-peringatan");

    if (textPeringatan && modalPeringatan) {
        textPeringatan.innerText = text;
        modalPeringatan.style.display = "flex";
    }
}


export function tutupPeringatan() {
    const modalPeringatan = document.getElementById("modal-peringatan");

    if (modalPeringatan) {
        modalPeringatan.style.display = "none";
    }
}