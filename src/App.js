import * as React from 'react';
import axios from 'axios'

const useSemiPersistentState = (key, initialState) => {
  const[value, setValue] = React.useState(localStorage.getItem(key) || initialState)

  React.useEffect( () => {
    localStorage.setItem(key, value);
  }, [value, key])
  return [value, setValue]
}
const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {...state,
      isLoading: true,
      isError: false,
    }
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading:false,
        isError: false,
        data: action.payload
      }
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter( 
          (story) => action.payload.objectID !== story.objectID),
      }
    default:
      throw new Error();
  }
}
const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query="

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search","React")
  
  const [stories, dispatchStories] = React.useReducer(storiesReducer, 
    { data: [], isLoading: false, isError: false }
  )
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`)

//useCallback hook creates a memoized function every time its dependency array changes
//as a result the effect hook runs again bc it depends on the new function
/*hook changes the funxtion only when the searchTerm changes */
/*
    implicitly change: handleFetchStories
    run: side effect
 */
  const handleFetchedStories = React.useCallback( async() => {
    dispatchStories({type: "STORIES_FETCH_INIT"})
    try {
      const result = await axios.get(url) //returns a promise
      //actions after await are not exectued until promise resolves
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      })
    } catch {
      dispatchStories({type: "STORIES_FETCH_FAILURE"})
    }
  }, [url])

  React.useEffect(() => {
    handleFetchedStories()
  },[handleFetchedStories])
    
  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`)
    e.preventDefault()
  }
  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
  });
};

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} 
      onSearchSubmit={handleSearchSubmit}/>
      <hr/>
      {stories.isError && <p>Something went wrong...</p>}
      {stories.isLoading ? <p>loading</p> :
        <List list={stories.data} onRemoveItem={handleRemoveStory} />}
      {/*passing props into a component. variable assigned to the list html attribute */}
    </div>
  );
};

const SearchForm = ({searchTerm, onSearchInput, onSearchSubmit}) => {
  return(
    <form onSubmit={onSearchSubmit}>
      <InputWithLabel
        id="search" value={searchTerm} isFocused onInputChange={onSearchInput}>
        <strong>Search for:</strong>
      </InputWithLabel>
      <button type="submit" disabled={!searchTerm} >
        Submit
      </button>
    </form>
  )
}
//InputWithLabel component
const InputWithLabel = ({id, value, type="text", onInputChange, isFocused, children}) => {
  //ref hook. creates a ref w/propert
  const inputRef = React.useRef()

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  return(
    <>
    <label htmlFor={id}>{children}</label> &nbsp;
    <input id={id} ref={inputRef} type={type} value={value} onChange={onInputChange}/>
  </>
  )
}
//List component destrucuturing props within fucntion and can directly use list
//instead of props.list
const List = ({ list, onRemoveItem}) => {
  return(
    <ul> 
      {list.map((item) => {
        return(
          //Item component
          //passing item in each iteration
          <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>
        )})}
    </ul>
  )
} 
//Item component
//destructures props which is an object withiin and object {item: {…}}
const Item = ({ item, onRemoveItem }) => {
  return(
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item) }>Dismiss</button>
      </span>
    </li>
  );
}
export default App
        