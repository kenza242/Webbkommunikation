// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {getFirestore} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";



const firebaseConfig = {
  apiKey: "AIzaSyBB6U75Xw_0HQLXQHFknm3xN80PFB2tCaY",
  authDomain: "movies-e0eaa.firebaseapp.com",
  projectId: "movies-e0eaa",
  storageBucket: "movies-e0eaa.appspot.com",
  messagingSenderId: "301708102251",
  appId: "1:301708102251:web:79500e451270194a26ff2e",
  measurementId: "G-JDZHRPNE5B"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore();

const addBtn = document.getElementById("addMovie");


async function addMovieFirestore(title, genre, releaseDate, watched) {
  try {
    
    const querySnapshot = await getDocs(collection(db, "movies"));
    const existingMovie = querySnapshot.docs.find(doc => doc.data().title === title);

    
    if (existingMovie) {
      console.log("Movie already exists in the database");
      alert("Movie with the same title already exists in the database");
      return;
    }

    
    const moviesCollection = collection(db, "movies");
    const newMovieDoc = await addDoc(moviesCollection, {
      title: title,
      genre: genre,
      releaseDate: releaseDate,
      watched: watched,
    });

    console.log("Movie added successfully with ID: ", newMovieDoc.id);
    alert("Movie created successfully");
  } catch (error) {
    console.error("Error adding movie: ", error);
  }
}


addBtn.addEventListener("click", async () => {
  var title = document.getElementById("title").value;
  var genre = document.getElementById("genre").value;
  var releaseDate = document.getElementById("releaseDate").value;
  var watched = document.getElementById("watched").value;

  await addMovieFirestore(title, genre, releaseDate, watched);
  getMoviesFirestore()
  populateDeleteDropdownFirestore()
});



async function getMoviesFirestore() {
  try {
    const moviesCollection = collection(db, "movies");
    const querySnapshot = await getDocs(moviesCollection);
    const moviesArray = [];

    querySnapshot.forEach((doc) => {
      const movieData = doc.data();
      moviesArray.push({ ...movieData, id: doc.id });
    });

    console.log("Movies:", moviesArray);
    displayMoviesFirestore(moviesArray);
  } catch (error) {
    console.error("Error getting movies: ", error);
  }
}



function displayMoviesFirestore(moviesArray) {
  const movieList = document.getElementById("movieList");
  movieList.innerHTML = ``;

  moviesArray.forEach((movie) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${movie.title} - (${movie.releaseDate}) - ${movie.genre} - ${movie.watched === "true" ? "Watched" : "Not Watched"}`;
    movieList.appendChild(listItem);
  });
}

getMoviesFirestore()

// Sök efter film
async function searchMovieFirestore(title) {
  try {
    const moviesCollection = collection(db, 'movies');
    const querySnapshot = await getDocs(moviesCollection);
    
    let movieFound = false;

    querySnapshot.forEach((doc) => {
      const movieData = doc.data();
      if (movieData.title === title) {
        movieFound = true;
        console.log("Movie found: ", movieData);
        alert(`Movie Found:\nTitle: ${movieData.title}\nGenre: ${movieData.genre}\nRelease Data: ${movieData.releaseDate}\nWached: ${movieData.watched ? "Yes" : "No"}`);
      }
    });

    if (!movieFound) {
      console.log("Movie not found");
      alert(`Movie not found`);
    }
  } catch (error) {
    console.error("Error searching for movie: ", error);
  }
}


const searchBtn = document.getElementById("searchMovieBtn");
searchBtn.addEventListener("click", () => {
  const titleData = document.getElementById("searchTitle").value;
  searchMovieFirestore(titleData);
});


async function populateDeleteDropdownFirestore() {
  try {
    const moviesCollection = collection(db, 'movies');
    const querySnapshot = await getDocs(moviesCollection);

    const selectElement = document.getElementById("movieToDelete");

    
    selectElement.innerHTML = '';

    querySnapshot.forEach((doc) => {
      const title = doc.data().title;
      const option = document.createElement("option");
      option.value = title;
      option.textContent = title;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("Error getting movies for dropdown: ", error);
  }
}


populateDeleteDropdownFirestore();

// Function to delete a movie from Firestore
async function deleteMovieFirestore(title) {
  try {
    const moviesCollection = collection(db, 'movies');
    const querySnapshot = await getDocs(moviesCollection);

    let movieIdToDelete;

    querySnapshot.forEach((doc) => {
      const movieData = doc.data();
      if (movieData.title === title) {
        movieIdToDelete = doc.id;
      }
    });

    if (movieIdToDelete) {
      const movieDocToDelete = doc(moviesCollection, movieIdToDelete);

      await deleteDoc(movieDocToDelete);
      alert("Movie deleted successfully");
      getMoviesFirestore();
      populateDeleteDropdownFirestore();
      getWatchedMoviesFirestore();
      populateUpdateDropdownFirestore();
    } else {
      console.log("Movie not found");
    }
  } catch (error) {
    console.error("Error deleting movie: " + error);
  }
}


const deleteBtn = document.getElementById("deleteBtn");
deleteBtn.addEventListener("click", () => {
  const selectedTitle = document.getElementById("movieToDelete").value;
  deleteMovieFirestore(selectedTitle);
});



async function populateUpdateDropdownFirestore() {
  try {
    const moviesCollection = collection(db, 'movies');
    const querySnapshot = await getDocs(moviesCollection);

    const selectElement = document.getElementById("movieToUpdate");

    
    selectElement.innerHTML = '';

    querySnapshot.forEach((doc) => {
      const title = doc.data().title;
      const option = document.createElement("option");
      option.value = title;
      option.textContent = title;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("Error getting movies for update dropdown: ", error);
  }
}


populateUpdateDropdownFirestore();


async function updateMovieStatusFirestore(title, newStatus) {
  try {
    const moviesCollection = collection(db, 'movies');
    const querySnapshot = await getDocs(moviesCollection);

    let movieIdToUpdate;

    querySnapshot.forEach((doc) => {
      const movieData = doc.data();
      if (movieData.title === title) {
        movieIdToUpdate = doc.id;
      }
    });

    if (movieIdToUpdate) {
      const movieDocToUpdate = doc(moviesCollection, movieIdToUpdate);

      await updateDoc(movieDocToUpdate, { watched: newStatus });
      alert(`Watched status of ${title} updated successfully!`);
      getMoviesFirestore();
    } else {
      console.log("Movie not found");
    }
  } catch (error) {
    console.error("Error updating watched status: ", error);
  }
}


const updateBtn = document.getElementById("updateBtn");
updateBtn.addEventListener("click", () => {
  const selectedTitle = document.getElementById("movieToUpdate").value;
  const selectedStatus = document.getElementById("status").value;

  updateMovieStatusFirestore(selectedTitle, selectedStatus);
});



async function getWatchedMoviesFirestore() {
  try {
    const moviesCollection = collection(db, 'movies');
    const querySnapshot = await getDocs(moviesCollection);

    const watchedMoviesArray = [];

    querySnapshot.forEach((doc) => {
      const movieData = doc.data();
      if (movieData.watched === "true") {
        watchedMoviesArray.push({ ...movieData, id: doc.id });
      }
    });

    console.log("Watched Movies: ", watchedMoviesArray);
    displayWatchedMovies(watchedMoviesArray);
  } catch (error) {
    console.error("Error getting watched movies: ", error);
  }
}


// getWatchedMoviesFirestore();


function displayWatchedMovies(moviesArray) {
  const movieList = document.getElementById("watchedMoviesList");
  movieList.innerHTML = ``;

  moviesArray.forEach((movie) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${movie.title} - (${movie.releaseDate}) - ${movie.genre}`;
    movieList.appendChild(listItem);
  });
}


const watchMoviesBtn = document.getElementById("watchedMovies");
watchMoviesBtn.addEventListener("click", () => {
  getWatchedMoviesFirestore()
});
   




 
       
  


      
  
     



   
 
