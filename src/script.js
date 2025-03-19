const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsConteiner = document.getElementById("cart-items") 
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const addressWarnEmptyCart = document.getElementById("address-warn-cart-empty")

let cart = []

// abir o modal do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
})

// fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if (event.target===cartModal) {
        cartModal.style.display = "none"
    }
})

// ao clicar em "fechar" o modal é fechado
closeModalBtn.addEventListener("click", function(){
   cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    //console.log(event.target)
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))           
        
        //adicionar item ao carrinho
        addToCart(name, price)
    }
})

// função para adicionar item ao carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)
    if (existingItem) {
        //se o item já existe, aumenta apenas a quantidade + 1
        existingItem.quantity += 1;

     }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })  
     }

    updateCartModal() 

    if (cart.length > 0) {
        const addressWarnEmptyCart = document.getElementById('address-warn-cart-empty');
        if (addressWarnEmptyCart) {
            addressWarnEmptyCart.classList.add("hidden");
        }
    }

}

// Atualiza o carrinho
function updateCartModal(){
    cartItemsConteiner.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between","mb-4", "flex-col")

        cartItemElement.innerHTML = `   
        <div class="flex items-center justify-between">
            <div>
                <p class= "font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class= "font-medium mt-2">R$ ${item.price.toFixed(2)}<p/>
            </div> 

             <button class="remove-from-cart-btn" data-name="${item.name}">  
                 Remover
            </button>
           
        </div>
    ` 
    total += item.price * item.quantity;

    cartItemsConteiner.appendChild(cartItemElement)
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
    // Atualiza o contador com a quantidade total de itens no carrinho
    cartCounter.innerHTML = cart.reduce((total, item) => total + item.quantity, 0);
}

//Função para remover o item do carrinho

cartItemsConteiner.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        
        removeItemCart(name);
    }
})

function removeItemCart(name){
    
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];
    

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        } 

        cart.splice(index, 1);
        updateCartModal();
    }
}

    // aviso de mensagem de erro ao invalidar email, e borda vermelha na box de mensg, e sumir a borda quando digitar de novo.

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

    //Finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkrestauranteopen();
    if(!isOpen){
        
        Toastify({
        text: "Ops, o restaurante esta fechado!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444)",
        },
     }).showToast();

     
        return;
    }

    if (cart.length === 0) {
        // Exibe a mensagem de erro se o carrinho estiver vazio
         Toastify({
            text: "O carrinho está vazio!",
            duration: 6000,
            close: true,
            gravity: "top", // A gravidade vai controlar se é "top" ou "bottom", mas não muda muito o centralizado
            position: "center", // Isso coloca a notificação no centro da tela
            stopOnFocus: true,
            style: {
                background: "#ef4444", // Definindo a cor do fundo da mensagem
                padding: "16px 32px", // Aumentando o padding para tornar o toast maior
                borderRadius: "8px", // Fazendo os cantos arredondados
                fontSize: "18px", // Aumentando o tamanho da fonte
                textAlign: "center", // Garantindo que o texto esteja centralizado dentro do toast
                width: "auto", // Fazendo com que o toast tenha largura automática com base no conteúdo
                maxWidth: "400px", // Define um limite de largura para o toast
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Adiciona uma sombra para o toast
            },
        }).showToast();

         addressWarnEmptyCart.classList.remove("hidden")
         addressInput.classList.add("border-red-500")

        return; // Impede a execução do restante do código se o carrinho estiver vazio
    }
    
    //if(cart.length === 0) return;
    if(addressInput.value === ""){
      addressWarn.classList.remove("hidden")
      addressInput.classList.add("border-red-500")
      return;
    }

    // Enviar pedido para API Whatsapp 
const cartItems = cart.map((item) => {
    return (
        `${item.name} 
        | Quantidade: (${item.quantity}) 
        | Preço: R$${item.price.toFixed(2)} 
        `
    );
}).join("\n"); // Adicionando quebra de linha entre cada item

// Calcular o total
let total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
const totalFormatted = `--------------------------------------------------\n| Total: R$ ${total.toFixed(2)}\n| Endereço: ${addressInput.value}`;
const message = encodeURIComponent(cartItems + "\n" + totalFormatted);

const phone = "91980842421";

window.open(`https://wa.me/${phone}?text=${message}`, "_blank");


cart = [];
updateCartModal();


})

function checkrestauranteopen(){
    const data = new Date();
    const hora = data.getHours ();
    return hora >= 10 && hora <23;
    //restaurante está aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkrestauranteopen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}