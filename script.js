document.getElementById('searchBox').addEventListener('keyup', function() {
    const searchText = this.value.toLowerCase();
    fetch(`https://rickandmortyapi.com/api/character/?name=${searchText}`)
        .then(response => response.json())
        .then(data => displayCharacters(data.results)); // Исправлено здесь
});

// Функция для получения названия первого эпизода
function fetchFirstEpisodeName(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => data.name); // Возвращаем название эпизода
}

// Обновлённая функция для отображения персонажей
function displayCharacters(characters) {
    const grid = document.getElementById('characterGrid');
    grid.innerHTML = ''; // Очистка предыдущих результатов
    characters.forEach(character => {
        fetchFirstEpisodeName(character.episode[0]).then(episodeName => {
            const card = document.createElement('div');
            card.className = 'character-card';
            card.innerHTML = `
                <img src="${character.image}" alt="${character.name}">
                <div class="character-info">
                    <h2>${character.name}</h2>
                    <div><span class="status-dot ${character.status.toLowerCase()}"></span><span>${character.status} - ${character.species}</span></div>
                    <p>Last known location: ${character.location.name}</p>
                    <p>First seen in: ${episodeName}</p>
                </div>
            `;
            card.onclick = () => showCharacterDetail(character.id);
            grid.appendChild(card);
        }).catch(error => {
            console.error('Ошибка при загрузке данных об эпизоде:', error);
            const card = document.createElement('div');
            card.className = 'character-card';
            card.innerHTML = `
                <img src="${character.image}" alt="${character.name}">
                <div class="character-info">
                    <h2>${character.name}</h2>
                    <div><span class="status-dot ${character.status.toLowerCase()}"></span><span>${character.status} - ${character.species}</span></div>
                    <p>Last known location: ${character.location.name}</p>
                    <p>First seen in: Error loading episode</p>
                </div>
            `;
            card.onclick = () => showCharacterDetail(character.id);
            grid.appendChild(card);
        });
    });

}


// При начальной загрузке тоже должны использовать results
fetch('https://rickandmortyapi.com/api/character')
    .then(response => response.json())
    .then(data => displayCharacters(data.results)); // Исправлено здесь
let currentPage = 1;
const resultsPerPage = 20;  // Количество результатов на странице

function fetchCharacters(page) {
    const url = `https://rickandmortyapi.com/api/character/?page=${page}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCharacters(data.results);
            updatePagination(data.info.pages);
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));
}


function updatePagination(totalPages) {
    const currentPageSpan = document.getElementById('currentPage');
    currentPageSpan.textContent = `${currentPage} из ${totalPages}`;
    document.querySelector("#pagination button:first-of-type").disabled = currentPage === 1;
    document.querySelector("#pagination button:last-of-type").disabled = currentPage === totalPages;
}

function changePage(step) {
    currentPage += step;
    fetchCharacters(currentPage);
}

// Первоначальная загрузка данных
document.addEventListener('DOMContentLoaded', () => {
    fetchCharacters(currentPage);
});
function applyFilters() {
    const status = document.getElementById('statusFilter').value;
    const species = document.getElementById('speciesFilter').value;
    const gender = document.getElementById('genderFilter').value;

    let query = `https://rickandmortyapi.com/api/character/?`;
    if (status) query += `status=${status}&`;
    if (species) query += `species=${species}&`;
    if (gender) query += `gender=${gender}&`;

    fetch(query)
        .then(response => response.json())
        .then(data => displayCharacters(data.results))
        .catch(error => console.error('Ошибка при фильтрации данных:', error));
}
function showCharacterDetail(characterId) {
    fetch(`https://rickandmortyapi.com/api/character/${characterId}`)
        .then(response => response.json())
        .then(character => {
            const detailDiv = document.getElementById('characterDetail');
            detailDiv.innerHTML = `
                <h1>${character.name}</h1>
                <img src="${character.image}" alt="${character.name}">
                <p>Статус: ${character.status}</p>
                <p>Вид: ${character.species}</p>
                <p>Пол: ${character.gender}</p>
                <p>Последнее известное местоположение: ${character.location.name}</p>
                <p>Впервые появился в: ${character.origin.name}</p>
            `;
            document.getElementById('characterGrid').style.display = 'none';
            document.getElementById('detailPage').style.display = 'block';
        });
}

function backToList() {
    document.getElementById('characterGrid').style.display = 'flex';
    document.getElementById('detailPage').style.display = 'none';
}



