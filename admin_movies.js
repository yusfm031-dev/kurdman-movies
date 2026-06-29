// ================================
// KurdMan Admin CMS v2
// admin_movies.js
// Part 3
// ================================

const API = "https://kurdmantv.com/kurdmantv_api/";

const movieList = document.getElementById("movieList");
const addMovieBtn = document.getElementById("addMovieBtn");
const addMovieForm = document.getElementById("addMovieForm");
const saveMovieBtn = document.getElementById("saveMovie");

// Show / Hide Form

addMovieBtn.onclick = () => {

    if (addMovieForm.style.display === "none" || addMovieForm.style.display === "") {

        addMovieForm.style.display = "block";

    } else {

        addMovieForm.style.display = "none";

    }

};

// Page Loaded

document.addEventListener("DOMContentLoaded", () => {

    loadMovies();

});

// ================================
// Load Movies
// ================================

async function loadMovies() {

    movieList.innerHTML = "<h3>Loading...</h3>";

    try {

        const response = await fetch(API + "get_movies.php");

        if (!response.ok) {

            throw new Error("API Error");

        }

        const movies = await response.json();
        window.moviesData = movies;

        if (!Array.isArray(movies)) {

            movieList.innerHTML = "<h3>No Movies Found</h3>";

            return;

        }

        let html = "";
        movies.forEach(movie => {

            html += `

            <div class="movie-card">

                <img src="${movie.poster}" alt="${movie.title}">

                <div class="movie-info">

                    <h2>${movie.title}</h2>

                    <p>📂 ${movie.category}</p>

                    <p>📅 ${movie.year}</p>

                    <p>🎞 ${movie.quality}</p>

                    <p>${movie.vip == 1
                        ? '<span class="vip">👑 VIP</span>'
                        : '<span class="free">🆓 Free</span>'}</p>

                    <p>⭐ Rating : ${movie.rating} (${movie.rating_count})</p>

                    <p>👁 Views : ${movie.views}</p>

                    <p>❤️ Favorites : ${movie.favorites}</p>

                    <div class="actions">

                        <button
                        class="btn edit-btn"
                        onclick="editMovie(${movie.id})">

                        ✏ Edit

                        </button>

                        <button
                        class="btn delete-btn"
                        onclick="deleteMovie(${movie.id})">

                        🗑 Delete

                        </button>

                    </div>

                </div>

            </div>

            `;

        });

        movieList.innerHTML = html;

    }

    catch(error){

        console.error(error);

        movieList.innerHTML = "<h2>❌ Failed To Load Movies</h2>";

    }

}
// ================================
// Save Movie
// ================================

saveMovieBtn.addEventListener("click", saveMovie);

async function saveMovie() {

    const formData = new FormData();

    formData.append("title", document.getElementById("title").value.trim());
    formData.append("poster", document.getElementById("poster").value.trim());
    formData.append("video_url", document.getElementById("video_url").value.trim());
    formData.append("description", document.getElementById("description").value.trim());
    formData.append("category", document.getElementById("category").value.trim());
    formData.append("year", document.getElementById("year").value.trim());
    formData.append("quality", document.getElementById("quality").value.trim());
    formData.append("vip", document.getElementById("vip").value);

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



}
// ================================
// Edit Movie
// ================================

function editMovie(id){

    const movie = window.moviesData.find(m => m.id == id);

    if(!movie) return;

    addMovieForm.style.display = "block";

    document.getElementById("title").value = movie.title;
    document.getElementById("poster").value = movie.poster;
    document.getElementById("video_url").value = movie.video_url;
    document.getElementById("description").value = movie.description;
    document.getElementById("category").value = movie.category;
    document.getElementById("year").value = movie.year;
    document.getElementById("quality").value = movie.quality;
    document.getElementById("vip").value = movie.vip;

    saveMovieBtn.innerHTML = "💾 Update Movie";

    saveMovieBtn.onclick = () => updateMovie(id);

}

// ================================
// Update Movie
// ================================

async function updateMovie(id){

    const formData = new FormData();

    formData.append("id", id);
    formData.append("title", document.getElementById("title").value.trim());
    formData.append("poster", document.getElementById("poster").value.trim());
    formData.append("video_url", document.getElementById("video_url").value.trim());
    formData.append("description", document.getElementById("description").value.trim());
    formData.append("category", document.getElementById("category").value.trim());
    formData.append("year", document.getElementById("year").value.trim());
    formData.append("quality", document.getElementById("quality").value.trim());
    formData.append("vip", document.getElementById("vip").value);

    const response = await fetch(API + "update_movie.php",{
        method:"POST",
        body:formData
    });

    const result = await response.json();

    alert(result.message);

    if(result.success){

        saveMovieBtn.innerHTML="💾 Save Movie";
        saveMovieBtn.onclick=saveMovie;

        addMovieForm.style.display="none";

        loadMovies();

    }

}

// ================================
// Delete Movie
// ================================

async function deleteMovie(id){

    if(!confirm("Delete this movie?")) return;

    const formData = new FormData();

    formData.append("id",id);

    const response = await fetch(API+"delete_movie.php",{
        method:"POST",
        body:formData
    });

    const result = await response.json();

    alert(result.message);

    if(result.success){

        loadMovies();

    }

}
