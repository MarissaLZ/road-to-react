import * as React from 'react';

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
  const [searchTerm, setSearchTerm] = React.useState('React')
  console.log("SearchTerm is :" + searchTerm)

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
const List = ({list}) => {
//receiving props an object and includes all the passed attributes as properties.
  console.log(list)
return(
      <ul> {/* item is an object. destructuring item object*/}
        {list.map(({ objectID, ...item }) => {
          return(
            //Item component
            //passing item in each iteration
            //using spread operator to pass all the object's key/value pairs 
            //as attribute/value pairs to jsx element
       
            <Item key={objectID} {...item} /> //*what is the difference b/w {...item} and {item}
     
          )
        })}
      </ul>
  )
} 
//Item component
//destructures props which is an object withiin and object {item: {…}}
const Item = ({ title, url, author, num_comments, points, objectID }) => {
  return(
    <li key={objectID}>
      <span>
        <a href={url}> {title}</a>
      </span>
      <span>{author} </span>
      <span>{num_comments}</span>
      <span>{points}</span>
    </li>
  );
}
export default App

 /* JS in HTML can pass fucntions to HTML element's attributes for handling user interactions
  */

        