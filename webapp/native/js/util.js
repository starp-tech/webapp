const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];
const products = [];
let cart = [];
let currentPage = 1;
const itemsPerPage = 8;
let selectedCategory = 'All';
let currentOrder = null;
let provider, signer, address;

function generateRandomProduct() {
    const category = categories[Math.floor(Math.random() * (categories.length - 1)) + 1];
    const id = products.length + 1;
    return {
        id,
        title: `${category} Item ${id}`,
        price: (Math.random() * 100 + 10).toFixed(2),
        category,
        image: `https://picsum.photos/seed/${id}/300/200`
    };
}

function renderCategories() {
    const categoriesContainer = document.getElementById('categories');
    categories.forEach(category => {
        const chip = document.createElement('div');
        chip.classList.add('category-chip');
        chip.textContent = category;
        chip.addEventListener('click', () => filterByCategory(category));
        if (category === selectedCategory) {
            chip.classList.add('active');
        }
        categoriesContainer.appendChild(chip);
    });
}

function renderProducts(productsToRender) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-price">$${product.price}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    });
}

function loadMoreProducts() {
    for (let i = 0; i < itemsPerPage; i++) {
        products.push(generateRandomProduct());
    }
    filterByCategory(selectedCategory);
    currentPage++;
}

function filterByCategory(category) {
    selectedCategory = category;
    const filteredProducts = category === 'All' 
        ? products 
        : products.filter(product => product.category === category);
    renderProducts(filteredProducts.slice(0, currentPage * itemsPerPage));
    updateCategoryChips();
}

function updateCategoryChips() {
    const chips = document.querySelectorAll('.category-chip');
    chips.forEach(chip => {
        if (chip.textContent === selectedCategory) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <span>${item.title}</span>
            <span>$${item.price}</span>
        `;
        cartItems.appendChild(cartItem);
        total += parseFloat(item.price);
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartCount.textContent = cart.length;
    localStorage.setItem('cart', JSON.stringify(cart));

    // Add bounce animation to cart button
    const cartButton = document.getElementById('cart-button');
    cartButton.classList.add('bounce');
    setTimeout(() => cartButton.classList.remove('bounce'), 500);
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

function validateAddress(address) {
    return address && address.trim() !== '';
}

function showRating() {
    const ratingContainer = document.getElementById('rating-container');
    ratingContainer.style.display = 'block';
    ratingContainer.innerHTML = `
        <h4>Rate your order:</h4>
        <div class="rating">
            <span class="star" data-rating="1">&#9733;</span>
            <span class="star" data-rating="2">&#9733;</span>
            <span class="star" data-rating="3">&#9733;</span>
            <span class="star" data-rating="4">&#9733;</span>
            <span class="star" data-rating="5">&#9733;</span>
        </div>
    `;

    ratingContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('star')) {
            const rating = e.target.getAttribute('data-rating');
            setRating(rating);
        }
    });
}

function setRating(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    // Here you can send the rating to your backend or store it locally
    console.log(`User rated: ${rating} stars`);
    
    // Show rating modal with coins animation
    showRatingModal();

    // Hide order popup and show cart button after rating
    setTimeout(() => {
        document.getElementById('order-popup').style.display = 'none';
        document.getElementById('cart-button').style.display = 'flex';
        document.getElementById('order-button').style.display = 'none';
    }, 3000);
}

function showDeliveryModal() {
    const modal = document.getElementById('delivery-modal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 3000);
}

function showRatingModal() {
    const modal = document.getElementById('rating-modal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 3000);
}

document.getElementById('product-grid').addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        cart.push(product);
        updateCart();
    }
});

document.getElementById('cart-button').addEventListener('click', () => {
    const cartPopup = document.getElementById('cart-popup');
    cartPopup.style.display = cartPopup.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('purchase-button').addEventListener('click', () => {
    document.getElementById('delivery-address').style.display = 'block';
    document.getElementById('confirm-delivery-button').style.display = 'block';
    document.getElementById('purchase-button').style.display = 'none';
});

document.getElementById('confirm-delivery-button').addEventListener('click', () => {
    const address = document.getElementById('delivery-address').value;
    if (validateAddress(address)) {
        document.getElementById('cart-popup').style.display = 'none';
        showDeliveryModal();
        setTimeout(() => {
            document.getElementById('order-popup').style.display = 'block';
            document.getElementById('order-status').innerHTML = `
                <p>Order Placed</p>
                <p>Delivery Address: ${address}</p>
                <p>Status: Processing</p>
            `;
            document.getElementById('receive-order-button').style.display = 'block';
            currentOrder = {
                items: [...cart],
                address: address,
                status: 'Processing'
            };
            cart = [];
            updateCart();
            document.getElementById('cart-button').style.display = 'none';
            document.getElementById('order-button').style.display = 'flex';
        }, 3000);
    } else {
        alert('Please enter a valid delivery address');
    }
});

document.getElementById('order-button').addEventListener('click', () => {
    const orderPopup = document.getElementById('order-popup');
    orderPopup.style.display = orderPopup.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('receive-order-button').addEventListener('click', () => {
    document.getElementById('order-status').innerHTML = `
        <p>Order Received</p>
        <p>Delivery Address: ${currentOrder.address}</p>
        <p>Status: Completed</p>
    `;
    document.getElementById('receive-order-button').style.display = 'none';
    showRating();
});

document.getElementById('load-more').addEventListener('click', loadMoreProducts);

document.getElementById('chat-button').addEventListener('click', () => {
    const chatPopup = document.getElementById('chat-popup');
    chatPopup.style.display = chatPopup.style.display === 'none' ? 'flex' : 'none';
});

document.getElementById('chat-send').addEventListener('click', sendChatMessage);

document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
});

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.textContent = `You: ${message}`;
        chatMessages.appendChild(messageElement);
        input.value = '';
        
        // Simulate shopkeeper response
        setTimeout(() => {
            const response = document.createElement('div');
            response.textContent = `Shopkeeper: Thank you for your message. How can I assist you?`;
            chatMessages.appendChild(response);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
}

async function checkMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        document.getElementById('metamask-modal').style.display = 'none';
        document.getElementById('password-modal').style.display = 'flex';
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            address = await signer.getAddress();
            
            // Switch to BNB Testnet
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x61' }], // BSC Testnet chain ID
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: '0x61',
                                chainName: 'Binance Smart Chain Testnet',
                                nativeCurrency: {
                                    name: 'BNB',
                                    symbol: 'bnb',
                                    decimals: 18
                                },
                                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                                blockExplorerUrls: ['https://testnet.bscscan.com']
                            }]
                        });
                    } catch (addError) {
                        console.error('Failed to add the BSC Testnet:', addError);
                    }
                }
            }
            
            updateWalletInfo();
        } catch (error) {
            console.error('Failed to connect to MetaMask:', error);
        }
    } else {
        console.log('MetaMask is not installed!');
        document.getElementById('metamask-modal').style.display = 'flex';
    }
}

async function updateWalletInfo() {
    const walletInfo = document.getElementById('wallet-info');
    if (address) {
        const balance = await provider.getBalance(address);
        const etherBalance = ethers.utils.formatEther(balance);
        
        // Get USDT balance (replace with actual USDT contract address on BSC Testnet)
        const usdtContractAddress = '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd'; // Example USDT contract on BSC Testnet
        const usdtAbi = ['function balanceOf(address) view returns (uint256)'];
        const usdtContract = new ethers.Contract(usdtContractAddress, usdtAbi, provider);
        const usdtBalance = await usdtContract.balanceOf(address);
        const usdtBalanceFormatted = ethers.utils.formatUnits(usdtBalance, 18); // Assuming 18 decimals, adjust if different

        walletInfo.textContent = `Address: ${address.slice(0, 6)}...${address.slice(-4)} | BNB: ${parseFloat(etherBalance).toFixed(4)} | USDT: ${parseFloat(usdtBalanceFormatted).toFixed(2)}`;
    } else {
        walletInfo.textContent = 'Wallet not connected';
    }
}

document.getElementById('enable-metamask').addEventListener('click', checkMetaMask);

document.getElementById('password-submit').addEventListener('click', () => {
    const password = document.getElementById('password-input').value;
    if (password === 'secret') { // Replace 'secret' with your actual password
        document.getElementById('password-modal').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        initShop();
    } else {
        alert('Incorrect password');
    }
});

function initShop() {
    renderCategories();
    loadMoreProducts();
    loadCart();
    updateWalletInfo();
}
