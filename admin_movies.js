async function loadMovies(){

    const res = await fetch("https://kurdmantv.com/kurdmantv_api/get_movies.php");

    const movies = await res.json();

    let html = "";

    movies.forEach(movie=>{

        html += `
        <div class="movie-card">

            <img src="${movie.poster}" width="80">

            <div class="info">

                <h3>${movie.title}</h3>

                <p>${movie.category}</p>

                <p>${movie.year}</p>

                <p>${movie.vip==1?"👑 VIP":"🆓 Free"}</p>

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

    document.getElementById("movieList").innerHTML = html;

}

loadMovies();

function editMovie(id){

    alert("Edit Movie ID : "+id);

}

async function deleteMovie(id){

    if(!confirm("Delete Movie?")) return;

    await fetch("https://kurdmantv.com/kurdmantv_api/delete_movie.php",{

        method:"POST",

        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },

        body:"id="+id

    });

    loadMovies();

}
document.getElementById("addMovie").onclick = function(){

    const form = document.getElementById("addMovieForm");

    if(form.style.display=="none"){

        form.style.display="block";

    }else{

        form.style.display="none";

    }

};

async function saveMovie(){
    alert("Save Button Works");

    const formData = new FormData();

    formData.append("title",document.getElementById("title").value);
    formData.append("description",document.getElementById("description").value);
    formData.append("poster",document.getElementById("poster").value);
    formData.append("video_url",document.getElementById("video_url").value);
    formData.append("category",document.getElementById("category").value);
    formData.append("year",document.getElementById("year").value);
    formData.append("quality",document.getElementById("quality").value);
    formData.append("vip",document.getElementById("vip").value);

    const res = await fetch(
        "https://kurdmantv.com/kurdmantv_api/add_movie.php",
        {
            method:"POST",
            body:formData
        }
    );

    const text = await res.text();

alert(text);

    loadMovies();

}
