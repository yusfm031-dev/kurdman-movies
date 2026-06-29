const API = "https://kurdmantv.com/kurdmantv_api/";

const movieList = document.getElementById("movieList");
const addMovieBtn = document.getElementById("addMovie");
const movieModal = document.getElementById("movieModal");
const closeModal = document.getElementById("closeModal");
const saveMovieBtn = document.getElementById("saveMovie");

let movies = [];
let editMovieId = null;
let currentPage = 1;
const perPage = 10;

window.onload = () => {
    loadMovies();
};

addMovieBtn.onclick = () => {
    resetForm();
    movieModal.style.display = "block";
};

closeModal.onclick = () => {
    movieModal.style.display = "none";
};

window.onclick = (e) => {
    if (e.target === movieModal) {
        movieModal.style.display = "none";
    }
};

saveMovieBtn.onclick = saveMovie;
async function loadMovies() {

    try {

        const res = await fetch(API + "get_movies.php");

        movies = await res.json();

        renderMovies(movies);

        updateStats();

    } catch (err) {

        console.error(err);

        movieList.innerHTML = `
            <div style="padding:20px;color:red;text-align:center;">
                Failed To Load Movies
            </div>
        `;

    }

}

function renderMovies(list) {

    if (!list.length) {

        movieList.innerHTML = `
            <div style="padding:20px;text-align:center;">
                No Movies Found
            </div>
        `;

        return;
    }

    let html = "";

    list.forEach(movie => {

        html += `
        <div class="movie-card">

            <img src="${movie.poster}" width="80">

            <div class="info">

                <h3>${movie.title}</h3>

                <p>${movie.category}</p>

                <p>${movie.year}</p>

                <p>${movie.quality}</p>

                <p>${Number(movie.vip)===1?"👑 VIP":"🆓 Free"}</p>

            </div>

            <div>

                <button onclick="editMovie(${movie.id})">
                    ✏️ Edit
                </button>

                <button onclick="deleteMovie(${movie.id})">
                    🗑 Delete
                </button>

            </div>

        </div>
        `;

    });

    movieList.innerHTML = html;

}
function updateStats() {

    const totalMovies = document.getElementById("totalMovies");
    const vipMovies = document.getElementById("vipMovies");
    const freeMovies = document.getElementById("freeMovies");
    const totalViews = document.getElementById("totalViews");

    if(totalMovies) totalMovies.innerText = movies.length;

    let vip = movies.filter(m => Number(m.vip) === 1).length;
    let free = movies.filter(m => Number(m.vip) === 0).length;

    if(vipMovies) vipMovies.innerText = vip;
    if(freeMovies) freeMovies.innerText = free;

    let views = 0;

    movies.forEach(movie => {
        views += Number(movie.views || 0);
    });

    if(totalViews) totalViews.innerText = views;

}

const searchInput = document.getElementById("searchMovie");

if(searchInput){

    searchInput.addEventListener("keyup", function(){

        const keyword = this.value.toLowerCase();

        const result = movies.filter(movie => {

            return (
                movie.title.toLowerCase().includes(keyword) ||
                movie.category.toLowerCase().includes(keyword)
            );

        });

        renderMovies(result);

    });

}
async function saveMovie() {

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const poster = document.getElementById("poster").value.trim();
    const video_url = document.getElementById("video_url").value.trim();
    const category = document.getElementById("category").value.trim();
    const year = document.getElementById("year").value.trim();
    const quality = document.getElementById("quality").value.trim();
    const vip = document.getElementById("vip").value;

    if (
        title === "" ||
        poster === "" ||
        video_url === ""
    ) {
        alert("⚠️ Title, Poster and Video URL are required.");
        return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("poster", poster);
    formData.append("video_url", video_url);
    formData.append("category", category);
    formData.append("year", year);
    formData.append("quality", quality);
    formData.append("vip", vip);

    try {

        const response = await fetch(API + "add_movie.php", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {

            alert("✅ Movie Added Successfully");

            movieModal.style.display = "none";

            resetForm();

            loadMovies();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("❌ API Connection Error");

    }

}
function resetForm(){

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("poster").value = "";
    document.getElementById("video_url").value = "";
    document.getElementById("category").value = "";
    document.getElementById("year").value = "";
    document.getElementById("quality").value = "";
    document.getElementById("vip").value = "0";

}

async function deleteMovie(id){

    if(!confirm("Delete this movie?")) return;

    const formData = new FormData();

    formData.append("id", id);

    try{

        const response = await fetch(API + "delete_movie.php",{
            method:"POST",
            body:formData
        });

        const data = await response.json();

        if(data.success){

            alert("✅ Movie Deleted");

            loadMovies();

        }else{

            alert(data.message);

        }

    }catch(error){

        console.error(error);

        alert("❌ Delete Failed");

    }

}
function editMovie(id){

    const movie = movies.find(m => Number(m.id) === Number(id));

    if(!movie){

        alert("Movie Not Found");

        return;

    }

    document.getElementById("title").value = movie.title;
    document.getElementById("description").value = movie.description;
    document.getElementById("poster").value = movie.poster;
    document.getElementById("video_url").value = movie.video_url;
    document.getElementById("category").value = movie.category;
    document.getElementById("year").value = movie.year;
    document.getElementById("quality").value = movie.quality;
    document.getElementById("vip").value = movie.vip;

    editMovieId = movie.id;

    movieModal.style.display = "block";

}
document.getElementById("prevPage").onclick = function(){

    if(currentPage > 1){

        currentPage--;

        renderMovies(movies);

    }

};

document.getElementById("nextPage").onclick = function(){

    currentPage++;

    renderMovies(movies);

};
console.log("✅ KurdMan Admin Ready");
