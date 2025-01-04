let activeCategory = 'all';
let petsData = [];

const loadCategories = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/categories")
        .then(res => res.json())
        .then(data => displayCategories(data.categories))
        .catch(error => showError('Failed to load categories'));
};

// Load and display pets from API, with optional category filter
const loadPets = (category = 'all') => {
    fetch("https://openapi.programming-hero.com/api/peddy/pets")
        .then(res => res.json())
        .then(data => {
            petsData = data.pets;
            displayPets(petsData, category);
        })
        .catch(error => showError('Failed to load pets'));
};

// Display categories in the category section
const displayCategories = (categories) => {
    const categoryContainer = document.getElementById("categories");
    categoryContainer.innerHTML = "";

    const allCategoryButton = document.createElement("button");
    allCategoryButton.classList = 'category-btn flex items-center justify-center font-bold gap-2 px-14 py-4 border-2 rounded-lg shadow-md hover:bg-gray-100';
    allCategoryButton.innerHTML = `<span>All</span>`;
    allCategoryButton.addEventListener('click', () => {
        activeCategory = 'all';
        showCategoryPets('all', allCategoryButton);
    });
    categoryContainer.append(allCategoryButton);

    categories.forEach((item) => {
        const button = document.createElement("button");
        button.classList = 'category-btn flex items-center justify-center font-bold gap-2 px-14 py-4 border-2 rounded-lg shadow-md hover:bg-gray-100';

        button.innerHTML = `
            <img src="${item.category_icon}" alt="${item.category}" class="w-10 h-10"> 
            <span>${item.category}</span>
        `;
        button.addEventListener('click', () => {
            activeCategory = item.category;
            showCategoryPets(item.category, button);
        });

        categoryContainer.append(button);
    });
};

// Function to handle loading spinner and showing pets by category
const showCategoryPets = (category, button) => {
    displaySpinner();

    setTimeout(() => {
        displayPets(petsData, category);
        hideSpinner();
        updateActiveCategory(button);
    }, 2000);
};

// Display pets in the pets section, with optional category filter
const displayPets = (pets, category) => {
    const petContainer = document.getElementById("pets");
    petContainer.innerHTML = "";

    // Filter pets by category if not 'all'
    const filteredPets = category === 'all' ? pets : pets.filter(pet => pet.category === category);

    // Handle no pets available for the selected category
    if (filteredPets.length === 0) {
        petContainer.classList.remove("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3");
        petContainer.classList.add("flex", "flex-col", "items-center", "justify-center");
        petContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center text-center py-16">
            <img src="images/error.webp" alt="No Information Available" class="w-40 h-40 mb-4">
            <h2 class="text-2xl font-bold">No Information Available</h2>
            <p class="text-gray-600">Unfortunately, we currently don't have any information about the pet you're looking for.</p>
        </div>`;
        return;
    } else {
        petContainer.classList.add("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3");
        petContainer.classList.remove("flex", "flex-col", "items-center", "justify-center");
    }

    // Create a card for each pet
    filteredPets.forEach((pet) => {
        const card = document.createElement("div");
        card.classList = "card bg-white shadow-lg rounded-lg p-3 w-80";

        card.innerHTML = `
            <figure>
                <img src="${pet.image}" alt="${pet.pet_name}" class="w-full h-48 object-cover rounded-lg" />
            </figure>
            <div class="card-body p-3">
                <h2 class="text-lg font-bold mb-2">${pet.pet_name}</h2>
                <p class="text-gray-600"><strong>Breed:</strong> ${pet.breed || 'Unknown'}</p>
                <p class="text-gray-600"><strong>Birth:</strong> ${pet.date_of_birth || 'N/A'}</p>
                <p class="text-gray-600"><strong>Gender:</strong> ${pet.gender || 'N/A'}</p>
                <p class="text-gray-600"><strong>Price:</strong> $${pet.price || 'N/A'}</p>
                <div class="flex justify-between mt-2">
                    <button class="btn btn-outline btn-sm flex items-center gap-2" onclick="likePet('${pet.image}', '${pet.pet_name}')">👍</button>
                    <button class="btn btn-outline btn-sm text-[#0E7A81]">Adopt</button>
                    <button class="btn btn-outline btn-sm text-[#0E7A81]" onclick="showPetDetails('${pet.pet_name}', '${pet.breed}', '${pet.date_of_birth}', '${pet.gender}', '${pet.price}', '${pet.image}', '${pet.vaccinated_status}', '${pet.pet_details}')">Details</button>
                </div>
            </div>
        `;
        petContainer.append(card);
    });
};

// Show pet details in the modal
const showPetDetails = (name, breed, birth, gender, price, image, vaccinatedStatus, details) => {
    const modalContent = `
        <div class="text-center">
            <img src="${image}" alt="${name}" class="w-full h-60 object-cover rounded-lg mb-4">
            <h2 class="text-xl font-bold mb-2">${name}</h2>
            <p><strong>Breed:</strong> ${breed || 'Unknown'}</p>
            <p><strong>Birth:</strong> ${birth || 'N/A'}</p>
            <p><strong>Gender:</strong> ${gender || 'N/A'}</p>
            <p><strong>Price:</strong> $${price || 'N/A'}</p>
            <p><strong>Vaccinated status:</strong> ${vaccinatedStatus || 'Unknown'}</p>
            <h3 class="text-lg font-bold mt-4">Details Information</h3>
            <p>${details || 'No additional information available.'}</p>
            <button class="btn bg-teal-500 text-white mt-4" id="cancelBtn">Cancel</button>
        </div>
    `;

    document.getElementById('modalContent').innerHTML = modalContent;
    document.getElementById('petDetailsModal').classList.remove('hidden');

    document.getElementById('cancelBtn').addEventListener('click', () => {
        document.getElementById('petDetailsModal').classList.add('hidden');
    });
};

document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('petDetailsModal').classList.add('hidden');
});

const displaySpinner = () => {
    document.getElementById("spinner").classList.remove("hidden");
};

const hideSpinner = () => {
    document.getElementById("spinner").classList.add("hidden");
};

const likePet = (image, petName) => {
    const likedPetsContainer = document.getElementById("likedPets");
    const likedPetDiv = document.createElement("div");
    likedPetDiv.innerHTML = `<img src="${image}" alt="Liked pet ${petName}" class="w-full h-24 object-cover rounded-lg" />`;
    likedPetsContainer.append(likedPetDiv);
};

const updateActiveCategory = (clickedButton) => {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('bg-[#008080]', 'text-white'));

    clickedButton.classList.add('bg-[#008080]', 'text-white');
};

document.getElementById("sortByPrice").addEventListener('click', () => {
    petsData.sort((a, b) => b.price - a.price);
    displayPets(petsData, activeCategory);
});

const showError = (message) => {
    alert(message);
};

loadCategories();
loadPets();
