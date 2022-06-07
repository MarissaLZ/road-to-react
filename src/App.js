import * as React from 'react';
import axios from 'axios'
import styled from "styled-components"
import {ReactComponent as Check} from './check.svg'

const StyledContainer = styled.div`
  height: 100vw;
  padding: 20px;
  background: linear-gradient(to left, #b6fbff, #83a4d4);
  color: #171212;
`;
const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;
const StyledItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;
const StyledColumn = styled.span`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  a {
    color:inherit
  }
  width: ${(props) => props.width};
`;
//width prop is accessible in the styled component's template literal
// as an arg of an inline function

const StyledButton = styled.button`
  background: transparent;
  border: 1px solid #171212; padding: 5px;
  cursor: pointer;
  transition: all 0.1s ease-in;

  &:Hover {
    background: #171212;
    color: #ffffff;
  }
`;
const StyledButtonSmall = styled(StyledButton)`
  padding: 10px;
`;
const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`;
const StyledSearchForm = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;
const StyledLabel = styled.label`
  border-top: 1px solid #171212;
  border-left: 1px solid #171212;
  padding-left: 5px;
  font-size: 24px;
`;
const StyledInput = styled.input`
  border: none;
  border-bottom: 1px solid #171212; background-color: transparent;
  font-size: 24px;
`;
 
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
    <StyledContainer>
      <StyledHeadlinePrimary>My Hacker Stories</StyledHeadlinePrimary>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput} 
        onSearchSubmit={handleSearchSubmit}
      />
      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ?
        <p>loading</p> :
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      }
      {/*passing props into a component. variable assigned to the list html attribute */}
    </StyledContainer>
  );
};

const SearchForm = ({searchTerm, onSearchInput, onSearchSubmit}) => {
  return (
    <StyledSearchForm onSubmit={onSearchSubmit}>
      <InputWithLabel
        id="search" value={searchTerm} isFocused onInputChange={onSearchInput}>
        <strong>Search for:</strong>
      </InputWithLabel>
      <StyledButtonLarge type="submit" disabled={!searchTerm}>
        Submit
      </StyledButtonLarge>
    </StyledSearchForm>
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
  return (
    <>
    <StyledLabel htmlFor={id}>{children}</StyledLabel>
    &nbsp;
    <StyledInput id={id} ref={inputRef} type={type} value={value} onChange={onInputChange}/>
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
    <StyledItem>
      <StyledColumn width="40%"> {/* pass width as a prop */}
        <a href={item.url}>{item.title}</a>
      </StyledColumn>
      <StyledColumn width="30%">{item.author}</StyledColumn>
      <StyledColumn width="30%">{item.num_comments}</StyledColumn>
      <StyledColumn width="30%">{item.points}</StyledColumn>
      <StyledColumn width="10%">
        <StyledButtonSmall
          type="button"
          onClick={() => onRemoveItem(item)} 
        >
          <Check height="18px" width="18px" />
        </StyledButtonSmall>
      </StyledColumn>
    </StyledItem>
  );
}
export default App