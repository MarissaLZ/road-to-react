import * as React from 'react';

  
const list = [
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
},]

const App = () => {
  return (
    <div>
          <h1> My Hacker Stories</h1>
          <Search/>
          <hr/>
          <List/>
    </div>
  );
};

//Search component
const Search = () => {
  //event handler for onChange
  const handleChange = (event) => {
    console.log(event)
  }  

  return(
    <div>
      <label htmlFor="search"> Search </label>
      <input id="search" type="text" onChange={handleChange}/>
    </div>
  );
}

//List component
const List = () => 
    <ul>
      {list.map((item) => (
          <li key={item.objectID}>
            <span>
              <a href={item.url}> {item.title}</a>
            </span>
            <span>{item.author} </span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
          </li>
   
      ))}
    </ul>



export default App

//callback handler
 // const handleSearch = (event) => {
 //   console.log(event.target.value);
 // }
 /* search componenet can use this callback handler now*/

 /* JS in HTML can pass fucntions to HTML element's attributes for handling user interactions
        
        onChange is a handler/onchange handler fucntion is a specific type o fhandler function. it is an event handler
         onChange will execute the fuctio handlechange when there is an event on search box.
          we are giving an html element in JSX a handler function which respond to user interaction
        ** Always pass fucntions (function handleChange), not a return value, to the handler (onChange)
        ex This is no no onChange={handleChange()} */

