const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recipesDiv = document.getElementById("recipes");
const tagList = document.getElementById("tagList");

const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

// Вход в полноэкранный режим
function toggleFull() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

async function searchRecipes(query = "Chicken") {
    recipesDiv.innerHTML = "<p style='color:white; text-align:center;'>Загрузка...</p>";
    try {
        const response = await fetch(API_URL + query);
        const data = await response.json();
        recipesDiv.innerHTML = "";

        if (!data.meals) {
            recipesDiv.innerHTML = "<p style='color:white; text-align:center;'>Ничего не найдено 😢</p>";
            return;
        }

        data.meals.forEach(meal => {
            const card = document.createElement("div");
            card.className = "recipe-card";

            // Собираем краткий список ингредиентов
            let ings = "";
            for (let i = 1; i <= 6; i++) { // Берем первые 6 для краткости
                const ing = meal[`strIngredient${i}`];
                if (ing) ings += `- ${ing}\n`;
            }

            card.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal.substring(0, 18)}</h3>
                <pre class="ingredients-list">${ings}</pre>
            `;
            recipesDiv.appendChild(card);
        });
    } catch (e) {
        recipesDiv.innerHTML = "<p style='color:white;'>Ошибка загрузки</p>";
    }
}

// Поиск по клику на теги
tagList.addEventListener("click", (e) => {
    if (e.target.classList.contains("category-tag")) {
        searchRecipes(e.target.dataset.query);
    }
});

// Обычный поиск
searchBtn.addEventListener("click", () => searchRecipes(searchInput.value.trim()));
searchInput.addEventListener("keypress", (e) => { if (e.key === "Enter") searchRecipes(searchInput.value.trim()); });

// Загрузка при старте
searchRecipes("Pizza");