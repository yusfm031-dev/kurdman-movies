const API = "https://kurdmantv.com/kurdmantv_api/";

const movieList = document.getElementById("movieList");
const addMovieBtn = document.getElementById("addMovie");
const movieModal = document.getElementById("movieModal");
const closeModal = document.getElementById("closeModal");
const saveMovieBtn = document.getElementById("saveMovie");

let movies = [];

window.onload = () => {
    loadMovies();
};

addMovieBtn.onclick = () => {
    movieModal.style.display = "block";
};

closeModal.onclick = () => {
    movieModal.style.display = "none";
};

window.onclick = (e) => {
    if (e.target == movieModal) {
        movieModal.style.display = "none";
    }
};
movieList.innerHTML
function updateStats() {

    document.getElementById("totalMovies").innerText = movies.length;

    let vip = movies.filter(m => Number(m.vip) === 1).length;
    let free = movies.filter(m => Number(m.vip) === 0).length;

    let views = 0;

    movies.forEach(movie => {
        views += Number(movie.views || 0);
    });

    document.getElementById("vipMovies").innerText = vip;
    document.getElementById("freeMovies").innerText = free;
    document.getElementById("totalViews").innerText = views;

}

const searchInput = document.getElementById("searchMovie");

searchInput.addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    const result = movies.filter(movie => {

        return (
            movie.title.toLowerCase().includes(keyword) ||
            movie.category.toLowerCase().includes(keyword)
        );

    });

    renderMovies(result);

});
async function saveMovie() {

    const formData = new FormData();

    formData.append("title", document.getElementById("title").value.trim());
    formData.append("description", document.getElementById("description").value.trim());
    formData.append("poster", document.getElementById("poster").value.trim());
    formData.append("video_url", document.getElementById("video_url").value.trim());
    formData.append("category", document.getElementById("category").value.trim());
    formData.append("year", document.getElementById("year").value.trim());
    formData.append("quality", document.getElementById("quality").value.trim());
    formData.append("vip", document.getElementById("vip").value);

    try {

        const res = await fetch(API + "add_movie.php", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (data.success) {

            alert("✅ Movie Added Successfully");

            movieModal.style.display = "none";

            document.getElementById("title").value = "";
            document.getElementById("description").value = "";
            document.getElementById("poster").value = "";
            document.getElementById("video_url").value = "";
            document.getElementById("category").value = "";
            document.getElementById("year").value = "";
            document.getElementById("quality").value = "";
            document.getElementById("vip").value = "0";

            loadMovies();

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.error(err);

        alert("❌ Failed To Connect API");

    }

}

saveMovieBtn.onclick = saveMovie;
async function deleteMovie(id) {

    if (!confirm("Are you sure you want to delete this movie?")) {
        return;
    }

    try {

        const formData = new FormData();
        formData.append("id", id);

        const res = await fetch(API + "delete_movie.php", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (data.success) {

            alert("🗑️ Movie Deleted");

            loadMovies();

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.error(err);

        alert("❌ Delete Failed");

    }

}

function editMovie(id) {

    const movie = movies.find(m => Number(m.id) === Number(id));

    if (!movie) {
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

    movieModal.style.display = "block";

    alert("✏️ Edit Mode\n(Update Movie API لە Part 6 زیاد دەکەین)");

}
let editMovieId = null;

function resetForm() {

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("poster").value = "";
    document.getElementById("video_url").value = "";
    document.getElementById("category").value = "";
    document.getElementById("year").value = "";
    document.getElementById("quality").value = "";
    document.getElementById("vip").value = "0";

    editMovieId = null;

}

closeModal.onclick = () => {

    movieModal.style.display = "none";

    resetForm();

};

function showLoading() {

    movieList.innerHTML = `
    <tr>
        <td colspan="8" style="text-align:center;padding:30px;">
            ⏳ Loading...
        </td>
    </tr>
    `;

}

window.addEventListener("load", () => {

    showLoading();

    loadMovies();

});

console.log("✅ KurdMan Admin Movies Loaded");
