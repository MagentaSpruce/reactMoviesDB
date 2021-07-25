import React, { useState, useContext, useEffect } from 'react'
// make sure to use https
export const API_ENDPOINT = `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}`
// console.log(API_ENDPOINT);

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [ error, setError] = useState({show:false,msg:''})
  const [movies, setMovies] = useState([])
  const [query, setQuery] = useState("Forrest Gump")

  const fetchMovies = async (url) => {
    setLoading(true);
    try{
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      if(data.Response === 'True'){
        setMovies(data.Search)
        setError({show:false, msg: ""})
      }
      else{
        setError({show:true, msg:"That movie was not found!"})
      }
      
    }catch(error){
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchMovies(`${API_ENDPOINT}&s={Forrest Gump}`)
  },[query])
  
  return <AppContext.Provider value={{setLoading, error, movies, query, setQuery}}>{children}</AppContext.Provider>
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
