// DOM elements
const loadingSpinner = document.getElementById("loading-spinner");
const treesContainer = document.getElementById("trees-container");
const allTreesBtn = document.getElementById("all-trees-btn");
const treeShowing = document.getElementById("trees_showing");
const cardContainer = document.getElementById("card-container");
const totalPrice = document.getElementById("total-price")
let carts = [];

// Spinner functions
const showLoading = () => {
  loadingSpinner.classList.remove("hidden");
  treesContainer.innerHTML = "";
};
const hideLoading = () => {
  loadingSpinner.classList.add("hidden");
};

// Fetch & show all buttons
const allBtnShow = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => displayBtnShow(data.categories))
    .catch((err) => console.error("Category fetch error:", err));
};

const displayBtnShow = (btns) => {
  const btnContainer = document.getElementById("btn-container");
  btnContainer.innerHTML = "";

  btns.forEach((element) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <button onclick="selectCategory(${element.id}, this)" class="btn w-full btn-outline rounded">
        ${element.category_name}
      </button>
    `;
    btnContainer.append(div);
  });
};

// Select category
const selectCategory = (categoryId, btn) => {
  showLoading();

  // Toggle button 
  document.querySelectorAll("#btn-container button").forEach((b) => {
    b.classList.remove("btn-success");
    b.classList.add("btn-outline");
  });
  btn.classList.add("btn-success");
  btn.classList.remove("btn-outline");

  allTreesBtn.classList.remove("btn-success");
  allTreesBtn.classList.add("btn-outline");

  // Fetch category trees
  fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
    .then((res) => res.json())
    .then((data) => {
      displayTrees(data.plants);
      hideLoading();
    })
    .catch((e) => {
      console.error("Category fetch error:", e);
      hideLoading();
      alert("Something went wrong!");
    });
};

// All Trees button click
allTreesBtn.addEventListener("click", () => {
  showLoading();

  document.querySelectorAll("#btn-container button, #all-trees-btn").forEach((all) => {
    all.classList.remove("btn-success");
    all.classList.add("btn-outline");
  });

  allTreesBtn.classList.add("btn-success");
  allTreesBtn.classList.remove("btn-outline");

  allTrees();
});

// Fetch all trees
const allTrees = () => {
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => {
      displayTrees(data.plants);
      hideLoading();
    })
    .catch((err) => {
      console.error("All trees fetch error:", err);
      hideLoading();
      alert("Something went wrong!");
    });
};

// Display trees
const displayTrees = (trees) => {
  treesContainer.innerHTML = "";

  trees.forEach((element) => {
    const div = document.createElement("div");
    div.className = "space-y-4 bg-white p-4 rounded-2xl";
    div.innerHTML = `
      <img onclick='treeModal(${element.id})' class="rounded-2xl h-80 w-full object-cover cursor-pointer" src="${element.image}" alt="${element.name}">
      <h3 class="text-xl font-semibold">${element.name}</h3>
      <p class="line-clamp-3">${element.description}</p>
      <div class="flex justify-between items-center">
        <button class="btn bg-[#DCFCE7] text-[#15803D] rounded-full cursor-default">${element.category}</button>
        <h3 class="font-semibold">৳${element.price}</h3>
      </div>
      <button onclick="addCards('${element.id}', '${element.name}', '${element.price}')" class="btn btn-success text-white w-full rounded-full">
        Add to Cart
      </button>
    `;
    treesContainer.append(div);
  });
};

// Tree Modal
const treeModal = (treeID) => {
  fetch(`https://openapi.programming-hero.com/api/plant/${treeID}`)
    .then((res) => res.json())
    .then((data) => {
      const modalTrees = data.plants;
      document.getElementById("modal-img").src = modalTrees.image;
      document.getElementById("modal-title").innerText = modalTrees.name;
      document.getElementById("modal-description").innerText = modalTrees.description;
      document.getElementById("modal-category").innerText = modalTrees.category;
      document.getElementById("modal-price").innerText = modalTrees.price;
      treeShowing.showModal();
    })
    .catch((err) => console.log("Modal Error:", err));
};

// Add to Cart
const addCards = (id, name, price) => {
  const existingItem = carts.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    carts.push({ id, name, price, quantity: 1 });
  }
  updateCards();
};

// Update Cart
const updateCards = () => {
  cardContainer.innerHTML = "";
    let total = 0;
  carts.forEach((item) => {
    total += item.price * item.quantity;
    const div = document.createElement("div");
    div.className = "card bg-white card-body shadow mt-4";
    div.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl">${item.name}</h2>
          <p class="text-base mt-2">${item.price} x ${item.quantity}</p>
        </div>
        <button onclick="removeCards('${item.id}')" class="btn btn-success rounded-full">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <p class="text-lg text-green-600 mt-3">${item.price * item.quantity}</p>
    `;
    cardContainer.append(div);
  });
  totalPrice.innerText = total;
};

// Remove from Cart
const removeCards = (treeId) => {
  const item = carts.find((item) => item.id === treeId);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      carts = carts.filter((item) => item.id !== treeId);
    }
    updateCards();
  }
};

// Initial calls
allBtnShow();
allTrees();