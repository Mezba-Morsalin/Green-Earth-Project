// DOM Elements
const loadingSpinner = document.getElementById("loading-spinner");
const treesContainer = document.getElementById("trees-container");
const allTreesBtn = document.getElementById("all-trees-btn");
const treeShowing = document.getElementById("trees_showing");

// Show all category buttons
const allBtnShow = () => {
    fetch("https://openapi.programming-hero.com/api/categories")
    .then(res => res.json())
    .then(data => {
        displayBtnShow(data.categories);
    })
    .catch(err => console.error("Category fetch error:", err));
}

const displayBtnShow = (btns) => {
    const btnContainer = document.getElementById("btn-container");
    btnContainer.innerHTML = "";

    btns.forEach(element => {
        const div = document.createElement("div");
        div.innerHTML = `
        <div>
            <button onclick="selectCategory(${element.id}, this)" class="btn w-full btn-outline rounded">${element.category_name}</button>
        </div>
        `;
        btnContainer.append(div);
    });
}

// Category select
const selectCategory = (categoryId, btn) => {
    showLoading();

    const allBtns = document.querySelectorAll("#btn-container button");
    allBtns.forEach(element => {
        element.classList.remove("btn-success");
        element.classList.add("btn-outline");
    });

    btn.classList.add("btn-success");
    btn.classList.remove("btn-outline");

    allTreesBtn.classList.remove("btn-success");
    allTreesBtn.classList.add("btn-outline");

    fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
    .then(res => res.json())
    .then(data => {
        displayTrees(data.plants);
        hideLoading();
    })
    .catch(e => {
        console.error("Category fetch error:", e);
        hideLoading();
        alert("Something went wrong!");
    });
}

// All Trees button click

allTreesBtn.addEventListener("click", () => {
    showLoading();
    const allBtns = document.querySelectorAll("#btn-container button, #all-trees-btn");
    allBtns.forEach(btn => {
        btn.classList.remove("btn-success");
        btn.classList.add("btn-outline");
    });

    allTreesBtn.classList.add("btn-success");
    allTreesBtn.classList.remove("btn-outline");
    allTrees();
});

// Fetch all trees
const allTrees = () => {
    showLoading();

    fetch("https://openapi.programming-hero.com/api/plants")
    .then(res => res.json())
    .then(data => {
        displayTrees(data.plants);
        hideLoading();
    })
    .catch(err => {
        console.error("All trees fetch error:", err);
        hideLoading();
        alert("Something went wrong!");
    });
}

// Display trees
const displayTrees = (trees) => {
    treesContainer.innerHTML = "";

    trees.forEach(element => {
        const div = document.createElement("div");

        div.innerHTML = `
        <div class="space-y-4 bg-white p-4 rounded-2xl">
            <img onclick='treeModal(${element.id})' class="rounded-2xl h-80 w-full object-cover" src="${element.image}" alt="${element.name}">
            <h3 class="text-xl font-semibold cursor-pointer">${element.name}</h3>
            <p class="line-clamp-3">${element.description}</p>

            <div class="flex justify-between">
                <button class="btn bg-[#DCFCE7] text-[#15803D] rounded-full cursor-default">
                    ${element.category}
                </button>
                <h3 class="font-semibold">৳${element.price}</h3>
            </div>

            <button class="btn btn-success text-white w-full rounded-full">
                Add to Cart
            </button>
        </div>
        `;

        treesContainer.append(div);
    });
}

// Tree Modal
const treeModal = (treeID) => {
    fetch(`https://openapi.programming-hero.com/api/plant/${treeID}`)
    .then(response => response.json())
    .then(data => {

        const tree = data.plants;

        document.getElementById("modal-title").innerText = tree.name;
        document.getElementById("modal-img").src = tree.image;
        document.getElementById("modal-category").innerText = tree.category;
        document.getElementById("modal-desc").innerText = tree.description;
        document.getElementById("modal-price").innerText = "৳" + tree.price;

        treeShowing.showModal();

    });
}
// Spinner functions
const showLoading = () => {
    loadingSpinner.classList.remove("hidden");
    treesContainer.innerHTML = "";
}

const hideLoading = () => {
    loadingSpinner.classList.add("hidden");
}

// Initial call the functions
allBtnShow();
allTrees();

// {/* <dialog id="my_modal_1" class="modal"></dialog> */}