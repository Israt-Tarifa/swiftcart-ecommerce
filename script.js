let cartCount = 0;

// Fetch Categories on Load
const loadCategories = async () => {
    const res = await fetch('https://fakestoreapi.com/products/categories');
    const data = await res.json();
    displayCategories(data);
};

const displayCategories = (categories) => {
    const container = document.getElementById('category-container');
    container.innerHTML = `<button class="btn btn-sm btn-outline active-btn" onclick="loadProducts('all')">All</button>`;
    
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.classList = 'btn btn-sm btn-outline capitalize';
        btn.innerText = cat;
        btn.onclick = () => loadProducts(cat, btn);
        container.appendChild(btn);
    });
};

// Fetch Products
const loadProducts = async (category, btnElement = null) => {
    const grid = document.getElementById('product-grid');
    const loader = document.getElementById('loader');
    
    grid.innerHTML = "";
    loader.classList.remove('hidden');

    // Handle Active Button State
    if(btnElement){
        document.querySelectorAll('#category-container btn').forEach(b => b.classList.remove('btn-primary', 'text-white'));
        btnElement.classList.add('btn-primary', 'text-white');
    }

    let url = category === 'all' ? 'https://fakestoreapi.com/products' : `https://fakestoreapi.com/products/category/${category}`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    loader.classList.add('hidden');
    displayProducts(data);
};

const displayProducts = (products) => {
    const grid = document.getElementById('product-grid');
    products.forEach(product => {
        const div = document.createElement('div');
        div.classList = "card bg-base-100 shadow-xl border border-gray-100 p-4";
        div.innerHTML = `
            <figure class="h-48"><img src="${product.image}" class="h-full object-contain" alt="product"/></figure>
            <div class="mt-4">
                <span class="badge badge-sm badge-ghost mb-2">${product.category}</span>
                <h2 class="font-bold text-sm truncate">${product.title}</h2>
                <div class="flex justify-between items-center my-2">
                    <p class="text-primary font-bold">$${product.price}</p>
                    <p class="text-xs text-yellow-500">⭐ ${product.rating.rate} (${product.rating.count})</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="showDetails(${product.id})" class="btn btn-xs btn-outline flex-1">Details</button>
                    <button onclick="addToCart()" class="btn btn-xs btn-primary flex-1">Add</button>
                </div>
            </div>
        `;
        grid.appendChild(div);
    });
};

// Show Product Details in Modal
const showDetails = async (id) => {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const data = await res.json();
    
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <div class="flex flex-col md:flex-row gap-6">
            <img src="${data.image}" class="w-full md:w-1/2 h-64 object-contain">
            <div>
                <h3 class="font-bold text-lg">${data.title}</h3>
                <p class="py-4 text-sm text-gray-600">${data.description}</p>
                <p class="font-bold text-xl text-primary">$${data.price}</p>
                <div class="modal-action">
                    <button class="btn btn-primary">Add To Cart</button>
                </div>
            </div>
        </div>
    `;
    product_modal.showModal();
};

const addToCart = () => {
    cartCount++;
    document.getElementById('cart-count').innerText = cartCount;
};

// Initial Loads
loadCategories();
loadProducts('all');