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
  
  return (
    <div>
          <h1> My Hacker Stories</h1>
          <Search /> 
          <hr/>
          <List list={stories}/>{/*passing props into a component. variable assigned to the list html attribute */}
    </div>
  );
};

//Search component
const Search = () => {
  const [searchTerm, setSearchTerm] = React.useState('')


  // callback /event handler for onChange
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };  
  return(
    <div>
      <label htmlFor="search"> Search </label>
      <input id="search" type="text" onChange={handleChange}/>

      <p> You are searching for {searchTerm }</p>
    </div>
  );
}

//List component
const List = (props) => {
//receiving props (object parameter) in a compnent. 
//props is an object and includes all the passed attributes as properties.
return(
    <ul>
      {props.list.map((item) => {
        return(
          //Item component
          <Item key={item.objectID} item={item} /> //passing item in each iteration
        )
      })}
    </ul>
)
} 

const Item = (props) => {
  return(
    <li key={props.item.objectID}>
      <span>
        <a href={props.item.url}> {props.item.title}</a>
      </span>
      <span>{props.item.author} </span>
      <span>{props.item.num_comments}</span>
      <span>{props.item.points}</span>
    </li>
  );
}



export default App

 /* JS in HTML can pass fucntions to HTML element's attributes for handling user interactions
        
        onChange is a handler/onchange handler fucntion is a specific type o fhandler function. it is an event handler
         onChange will execute the fuctio handlechange when there is an event on search box.
          we are giving an html element in JSX a handler function which respond to user interaction
        ** Always pass fucntions (function handleChange), not a return value, to the handler (onChange)
        ex This is no no onChange={handleChange()} */

        