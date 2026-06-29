const API = "https://kurdmantv.com/kurdmantv_api/";

const addMovieBtn = document.getElementById("addMovie");
const addMovieForm = document.getElementById("addMovieForm");
const saveMovieBtn = document.getElementById("saveMovie");
const movieList = document.getElementById("movieList");

addMovieBtn.onclick = function () {

    if (addMovieForm.style.display === "none" || addMovieForm.style.display === "") {
        addMovieForm.style.display = "block";
    } else {
        addMovieForm.style.display = "none";
    }

};

window.onload = function () {
    loadMovies();
};
async function loadMovies() {

    try {

        const response = await fetch("https://kurdmantv.com/kurdmantv_api/get_movies.php");

        const movies = await response.json();

        let html = "";

        movies.forEach(movie => {

            html += `
                <div style="background:#1e293b;padding:15px;border-radius:10px;margin-bottom:15px;display:flex;justify-content:space-between;align-items:center;">

                    <div>

                        <h3>${movie.title}</h3>

                        <p>${movie.category}</p>

                        <p>${movie.year}</p>

                        <p>${movie.vip == 1 ? "👑 VIP" : "🆓 Free"}</p>

                    </div>

                    <img src="${movie.poster}" width="80">

                </div>
            `;

        });

        movieList.innerHTML = html;

    } catch (error) {

        console.log(error);

        movieList.innerHTML = "❌ Failed To Load Movies";

    }

}
saveMovieBtn.onclick = async function () {

    const formData = new FormData();

    formData.append("title", document.getElementById("title").value);
    formData.append("poster", document.getElementById("poster").value);
    formData.append("video_url", document.getElementById("video_url").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("category", document.getElementById("category").value);
    formData.append("year", document.getElementById("year").value);
    formData.append("quality", document.getElementById("quality").value);
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

            loadMovies();

        }

    } catch (error) {

        console.log(error);

        alert("❌ Failed To Save Movie");

    }

};
