import React from 'react'
import './App.css';
import CreatePost from './components/CreatePost';
import { withAuthenticator } from 'aws-amplify-react'

import DisplayPosts from './components/DisplayPosts'

function App() {
  return (
    <div className="App">

      <CreatePost />
      <DisplayPosts/>
    </div>
  );
}

export default withAuthenticator(
  App,
  { includeGreetings: true }
);
// for Authentication we need to wrap the app by withAuthenticator
// then we need to pass whether we need greeting or not
// we can pass true or a object