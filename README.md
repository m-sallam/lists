# Lists

an Application to make lists of Movies, Show, Songs, Actor, Artists, Albums, and Books.
 [live demo](https://lists-indigo.herokuapp.com)

## APIs used:

 - [TheMovieDB](https://www.themoviedb.org/documentation/api)
 - [Last.fm](https://www.last.fm/api)
 - [Google Books](https://developers.google.com/books/)
 

### Installation

*You need [Node.js](https://nodejs.org/en/) installed on your machine.
First make a '.env' file in the application main directory as follow :

    DBURL = 'mongo database url here'
    TMDBAPI = 'themoviedb API key here'
    LASTFMAPI = 'last.fm API key here'
    BOOKSAPI = 'google books API key here'
    APPSECRET = 'app secret here'
or add the variables to the env variables.
then to install dependencies:

    npm install
  and then just start the application by:
  

    npm start


