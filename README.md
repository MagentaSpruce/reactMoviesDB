# reactMoviesDB
This React app allows for movies to be queried and returned along with some relevant info about each. Includes separate movie page.

This project utilizes a 3rd party API (Open Movie Database) to fetch movie data from: https://www.omdbapi.com/

A general overview of the pertinent React code is given below:

First the global context is set up.
```React
const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  return <AppContext.Provider value='hello'>{children}</AppContext.Provider>
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
```

Then the App is wrapped with AppProvider to grant access to all components the global context. Next the API key is inserted from the .env file created to hold it and tested to ensure it is working correctly. It is exported for later use with single movie. ***Remember to restart server after making changes to API key
```React
export const API_ENDPOINT = `https://www.omdbapi.com/?apikey=${process.env._REACT_APP_API_KEY}`
```

Next react router is set up.
```React
   <Router>
      <App />
    </Router>

function App() {
  return <Switch>
    <Route path="/" exact >
      <Home/>
    </Route>
    <Route path="/movies/:id" children={<Movie/>}/>
  </Switch>
}
```

Next Home component is worked on to construct the form and movies display.
```React
const Home = () => {
  return <main>
    <Form/>
    <Movies/>
  </main>
}
```

Next movies are fetched from the api starting with state values.
```React
const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [ error, setError] = useState({show:false,msg:''})
  const [movies, setMovies] = useState([])
  const [query, setQuery] = useState("Forrest Gump")
```

Next the fetch movies function is constructed.
```React
  const fetchMovies = async (url) => {
    setLoading(true);
    try{
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      
    }catch(error){
      console.log(error)
      setLoading(false)
    }
  }
  
  useEffect(()=>{
    fetchMovies(`${API_ENDPOINT}&s={Forrest Gump}`)
  },[query])
 ```
 
 Next handling of no results is done.
 ```React
      if(data.Response === 'True'){
        setMovies(data.Search)
        setError({show:false, msg: ""})
      }
      else{
        setError({show:true, msg:"That movie was not found!"})
      } 
```

Next the values in the context provider are exported.
```React
  return <AppContext.Provider value={{setLoading, error, movies, query, setQuery}}>{children}</AppContext.Provider>
```


Next the movies are rendered to the screen.
```React
const Movies = () => {
  const {movies, isLoading} = useGlobalContext();

  if(isLoading){
    return <div className="loading"></div>
  }
  return <section className='movies'>
  {movies.map((movie) =>{
    const {imdbID:id,Poster:poster,Title:title,Year:year} = movie
    return <Link to={`/movies/${id}`} key={id} className='movie'>
      <article>
        <img src={poster} alt={title} />
        <div className="movie-info">
          <h4 className="title">{title}</h4>
          <p>{year}</p>
        </div>
      </article>
    </Link>
  })}
  </section>
}
```

To take care if instances where no movie poster is listed the following was done:
```React
      <img src={poster === 'N/A' ? url : poster} alt={title} />
```

Now the input form is worked on to update the content as the user types.
```React
const SearchForm = () => {
  const {query, setQuery, error} = useGlobalContext();
  return <form className="search-form" onSubmit={(e)=>e.preventDefault()}>
    <h2>Search movies</h2>
    <input type="text" className="form-input" value={query} onChange={(e)=> setQuery(e.target.value)} />
  </form>
}
```

Next error handling is done on the search input.
```React
    <input type="text" className="form-input" value={query} onChange={(e)=> setQuery(e.target.value)} />
    {error.show && <div className='error'>
      {error.msg}
    </div>}
```


Next the single movie page is set up to display specific movie info. This is started by using useParams to get the id value passed in to the search input.
```React
const SingleMovie = () => {
  const {id} = useParams()
  console.log(id);
```

Next state values are set up
```React
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState({show:false,msg:""})
```

Next the function is set up for fetching the single movie.
```React
  const fetchMovie = async (url) =>{
    const response= await fetch(url);
    const data = await response.json();
    console.log(data);
  }
```

Then the useEffect is set up to invoke the fetchMovie function whenever the id changes.
```React
  useEffect(()=>{
    fetchMovie(`${API_ENDPOINT}&i=${id}`)
  },[id])
```

At this point the data should be returned to the console for the single movie. NExt error handling is done.
```React
  const fetchMovie = async (url) =>{
    const response= await fetch(url);
    const data = await response.json();
   if(data.Response === 'False'){
    setError({show:true,msg:data.Error})
    setIsLoading(false)
   }else{
     setMovie(data)
     setIsLoading(false)
   }
  }
```

Next the returns are done. 1 for loading, 1 for error, 1 for successful fetch. Loading and error are below.
```React
  if(isLoading){
    return <div className='loading'></div>
  }
  if(error.show){
    return <div className='page-error'>
      <h1>{error.msg}</h1>
      <Link to="/" className='btn'>
        back to movies
      </Link>
    </div>
  }
  return <h2>single movie</h2>
}
```

Then fetch.
```React
  const {Poster:poster,Title:title,Plot:plot,Year:year} = movie;
  return <section className="single-movie">
    <img src={poster === 'N/A' ? url : poster} alt={title} />
    <div className="single-movie-info">
      <h2>{title}</h2>
      <p>{plot}</p>
      <h4>{year}</h4>
      <Link to="/" className='btn' >
        back to movies
      </Link>
    </div>
  </section>
```

***End walkthrough
