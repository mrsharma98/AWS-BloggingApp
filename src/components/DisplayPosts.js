import React, { Component } from 'react'
import { listPosts } from '../graphql/queries'
import { API, graphqlOperation } from 'aws-amplify'

import DeletePost from './DeletePost'
import EditPost from "./EditPost";
import { onCreatePost } from '../graphql/subscriptions';

class DisplayPosts extends Component {
    state = {
        posts: []
    }

    componentDidMount = async () => {
        this.getPosts()

        // Subscription (to render the post w/o manual reload)
        this.createPostListener = API.graphql(graphqlOperation(onCreatePost))
            .subscribe({ 
                next: postData => {
                    // next -- what happens next
                    // postData -- will have our new post
                    const newPost = postData.value.data.onCreatePost
                    const prevPosts = this.state.posts.filter(post => post.id !== newPost.id)

                    const updatedPosts = [newPost, ...prevPosts]

                    this.setState({ posts: updatedPosts })
                }
             })
    }

    componentWillUnmount() {
        // we need to Unmount our Subscription/unsubscribing or else it will keep on getting the post
        // that will be costly
        this.createPostListener.unsubscribe()
    }

    getPosts = async () => {
        const result = await API.graphql(graphqlOperation(listPosts))
        // graphqlOperation(query)
        // console.log(result.data.listPosts.items);
        
        this.setState({ posts: result.data.listPosts.items })
    
    }

    render() {
        const { posts } = this.state
        
        return posts.map(post => {
            return (
                <div key={post.id} className="posts" style={rowStyle}>
                    <h1>{ post.postTitle }</h1>
                    <span style={{ fontStyle: "italic", color: "#0ca5e297" }}>
                        { "Wrote by: "} { post.postOwnerUsername }
                        {" on "}
                        <time style={{ fontStyle: "italic" }}>
                            {" "}
                            { new Date(post.createdAt).toDateString() }
                        </time>
                    </span>

                    <p>
                        { post.postBody }
                    </p>

                    <br />
                    <span>
                        <DeletePost />
                        <EditPost />
                    </span>

                </div>
            )
        })
    }
}

const rowStyle = {
    background: '#f4f4f4',
    padding: '10px',
    border: '1px #ccc dotted',
    margin: '14px'
}

export default DisplayPosts