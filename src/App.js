import * as React from 'react';

const useSemiPersistentState = (key, initialState) => {
  const[value, setValue] = React.useState(localStorage.getItem(key) || initialState)

  React.useEffect( () => {
    localStorage.setItem(key, value);
  }, [value, key])
  return [value, setValue]
}

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: "yell",
  }, {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
]
//resolve is a function arg!
const getAsynchStories = () => 
  new Promise((resolve) => 
    //simulating async task and invoking resolve to resolve promise w/ a value when task complete
    setTimeout(
      () => resolve({data:{stories: initialStories}}),
      2000
    )
  )

const App = () => {
  //custom hook
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search","React")
   //state hook
  const [stories, setStories] = React.useState([])
   //Effect
  React.useEffect(() => {
    getAsynchStories().then(result => {
      setStories(result.data.stories)
    })
  }, [])
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  };
  const handleRemoveStory= (item) => {
    const newStories = stories.filter(
      (story) => item.objectID !== story.objectID
    )
    setStories(newStories)
  }

  const searchedStories = stories.filter(function (story) {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase())
  });

  return (
    <div>
          <h1> My Hacker Stories</h1>
          <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={handleSearch}>
            <strong>Search for:</strong>
          </InputWithLabel>
          <hr/>
          <List list={searchedStories} onRemoveItem ={handleRemoveStory}/>{/*passing props into a component. variable assigned to the list html attribute */}
    </div>
  );
};
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
            )
          })}
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
        