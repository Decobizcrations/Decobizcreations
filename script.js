let panier = JSON.parse(localStorage.getItem("panier")) || [];

function enregistrerPanier() {
  localStorage.setItem("panier", JSON.stringify(panier));
}

function afficherPanier() {
  const liste = document.getElementById("panier-liste");
  const vide = document.getElementById("panier-vide");
  const total = document.getElementById("total-panier");
  const bouton = document.getElementById("commander-whatsapp");

  if (!liste || !vide || !total || !bouton) return;

  liste.innerHTML = "";

  if (panier.length === 0) {
    vide.style.display = "block";
    bouton.style.display = "none";
    total.textContent = "";
    return;
  }

  vide.style.display = "none";
  bouton.style.display = "inline-block";

  let totalPrix = 0;
  panier.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.nom} (${item.personnalisation || "Aucune"}) - ${item.prix} MAD`;

    const btn = document.createElement("button");
    btn.textContent = "×";
    btn.onclick = () => {
      panier.splice(index, 1);
      enregistrerPanier();
      afficherPanier();
    };

    li.appendChild(btn);
    liste.appendChild(li);
    totalPrix += item.prix;
  });

  total.textContent = `Total : ${totalPrix.toFixed(2)} MAD`;
}

function ajouterEvenementsProduits() {
  const boutons = document.querySelectorAll(".product-card button");
  boutons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const carte = btn.closest(".product-card");
      const nom = carte.querySelector("h4").textContent;
      const prix = Number(carte.querySelector(".prix").textContent.replace(" MAD", ""));
      const personnalisation = carte.querySelector("input").value.trim();

      panier.push({ nom, prix, personnalisation });
      enregistrerPanier();
      carte.querySelector("input").value = "";
      alert(`${nom} ajouté au panier !`);
    });
  });
}

function initialiser() {
  ajouterEvenementsProduits();
  afficherPanier();

  const boutonWhatsApp = document.getElementById("commander-whatsapp");
  if (boutonWhatsApp) {
    boutonWhatsApp.addEventListener("click", () => {
      if (panier.length === 0) return alert("Panier vide.");

      let msg = "Bonjour, je souhaite commander :%0A";
      panier.forEach(item => {
        msg += `- ${item.nom} (${item.personnalisation || "Sans"}) - ${item.prix} MAD%0A`;
      });

      const total = panier.reduce((acc, item) => acc + item.prix, 0);
      msg += `%0ATotal : ${total.toFixed(2)} MAD.%0AMerci !`;

      window.open(`https://wa.me/212610236889?text=${msg}`, "_blank");
    });
  }
}

document.addEventListener("DOMContentLoaded", initialiser);
