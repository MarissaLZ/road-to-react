import * as React from 'react';

const useSemiPersistentState = (key, initialState) => {
  const[value, setValue] = React.useState(localStorage.getItem(key) || initialState)

  React.useEffect( () => {
    localStorage.setItem(key, value);
  }, [value, key])
  return [value, setValue]
}

const App = () => {

  const stories = [
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
  //custom hook
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search","React")
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  };

  const searchedStories = stories.filter(function (story) {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase())
  });
  return (
    <div>
          <h1> My Hacker Stories</h1>
          <Search search={searchTerm} onSearch={handleSearch} /> 
          <hr/>
          <List list={searchedStories}/>{/*passing props into a component. variable assigned to the list html attribute */}
    </div>
  );
};

//Search component
const Search = ({search, onSearch}) => { //destrucuturing props within function signature

  return(
    <div>
      <label htmlFor="search"> Search </label>
      <input 
      id="search" 
      type="text" 
      value={search}
      onChange={onSearch}/>
    </div>
  );
}

//List component destrucuturing props within fucntion and can directly use list
//instead of props.list
const List = ({ list }) => {
  console.log(list)
  return(
        <ul> 
          {list.map((item) => {
            return(
              //Item component
              //passing item in each iteration
              <Item key={item.objectID} item={item}/>
            )
          })}
        </ul>
    )
} 
//Item component
//destructures props which is an object withiin and object {item: {…}}
const Item = ({ item }) => {
  return(
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
    </li>
  );
}
export default App

 /* JS in HTML can pass fucntions to HTML element's attributes for handling user interactions
  */

        