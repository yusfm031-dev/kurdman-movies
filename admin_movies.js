// ===============================
// KurdMan Admin CMS v2
// admin_movies.js
// Part 1
// ===============================

const API = "https://kurdmantv.com/kurdmantv_api/";

const movieList = document.getElementById("movieList");
const addMovieBtn = document.getElementById("addMovie");
const addMovieForm = document.getElementById("addMovieForm");
const saveMovieBtn = document.getElementById("saveMovie");

// Toggle Add Movie Form
addMovieBtn.addEventListener("click", () => {

    if (addMovieForm.style.display === "none" || addMovieForm.style.display === "") {

        addMovieForm.style.display = "block";

    } else {

        addMovieForm.style.display = "none";

    }

});

// Page Loaded
document.addEventListener("DOMContentLoaded", () => {

    loadMovies();

});
// ===============================
// Part 2
// Load Movies
// ===============================

async function loadMovies() {

    movieList.innerHTML = "<h3>Loading...</h3>";

    try {

        const response = await fetch(API + "get_movies.php");

        if (!response.ok) {
            throw new Error("API Error");
        }

        const movies = await response.json();

        if (!Array.isArray(movies)) {
            movieList.innerHTML = "<h3>No Movies Found</h3>";
            return;
        }

        let html = "";

        movies.forEach(movie => {

    html += `
    <div class="movie-card"
         style="display:flex;
                justify-content:space-between;
                align-items:center;
                background:#1e293b;
                padding:15px;
                margin-bottom:15px;
                border-radius:10px;">

        <div style="display:flex;align-items:center;gap:15px;">

            <img src="${movie.poster}"
                 width="80"
                 style="border-radius:8px;">

            <div>

                <h3>${movie.title}</h3>

                <p>${movie.category}</p>

                <p>${movie.year}</p>

                <p>${movie.vip == 1 ? "👑 VIP" : "🆓 Free"}</p>

            </div>

        </div>

        <div>

            <button class="btn"
                onclick="editMovie(${movie.id})">
                ✏️ Edit
            </button>

            <button class="btn"
                onclick="deleteMovie(${movie.id})">
                🗑 Delete
            </button>

        </div>

    </div>
    `;

});

        movieList.innerHTML = html;

    } catch (error) {

        console.error(error);

        movieList.innerHTML = "<h3>❌ Failed To Load Movies</h3>";

    }

}
// ===============================
// Part 3
// Save Movie
// ===============================

saveMovieBtn.addEventListener("click", saveMovie);

async function saveMovie() {

    const title = document.getElementById("title").value.trim();
    const poster = document.getElementById("poster").value.trim();
    const video_url = document.getElementById("video_url").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value.trim();
    const year = document.getElementById("year").value.trim();
    const quality = document.getElementById("quality").value.trim();
    const vip = document.getElementById("vip").value;

    if (!title || !poster || !video_url) {
        alert("Please fill Title, Poster and Video URL");
        return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("poster", poster);
    formData.append("video_url", video_url);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("year", year);
    formData.append("quality", quality);
    formData.append("vip", vip);

    try {

        const response = await fetch(API + "add_movie.php", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        alert(result.message);

        if (result.success) {

            addMovieForm.style.display = "none";

            document.getElementById("title").value = "";
            document.getElementById("poster").value = "";
            document.getElementById("video_url").value = "";
            document.getElementById("description").value = "";
            document.getElementById("category").value = "";
            document.getElementById("year").value = "";
            document.getElementById("quality").value = "";
            document.getElementById("vip").value = "0";

            loadMovies();

        }

    } catch (error) {

        console.error(error);

        alert("Connection Error");

    }

}
// ===============================
// Part 4
// Edit & Delete
// ===============================

function editMovie(id){

    alert("Edit Movie ID : " + id);

}

async function deleteMovie(id){

    if(!confirm("Delete this movie?")) return;

    try{

        const formData = new FormData();

        formData.append("id", id);

        const response = await fetch(API + "delete_movie.php",{
            method:"POST",
            body:formData
        });

        const result = await response.json();

        alert(result.message);

        if(result.success){

            loadMovies();

        }

    }catch(error){

        console.error(error);

        alert("Delete Failed");

    }

       }

