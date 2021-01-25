import React, { Component } from 'react'
import { listPosts } from '../graphql/queries'
import { Auth, API, graphqlOperation } from 'aws-amplify'
import { FaThumbsUp } from 'react-icons/fa'

import DeletePost from './DeletePost'
import EditPost from "./EditPost";
import { onCreateComment, onCreateLike, onCreatePost, onDeletePost, onUpdatePost } from '../graphql/subscriptions';
import CreateCommentPost from './CreateCommentPost';
import CommentPost from './CommentPost';


class DisplayPosts extends Component {
    state = {
        ownerId: "",
        ownerUsername: "",
        isHovering: false,
        posts: []
    }

    componentDidMount = async () => {

        this.getPosts()

        await Auth.currentUserInfo()
            .then(user => {
                this.setState({
                    ownerId: user.attributes.sub,
                    ownerUsername: user.username
                })
            })


        // Subscription (to render the post w/o manual reload)
        this.createPostListener = API.graphql(graphqlOperation(onCreatePost))
            .subscribe({ 
                next: postData => {
                    // next -- what happens next
                    // postData -- will have our new post
                    const newPost = postData.value.data.onCreatePost
                    // to get new post

                    const prevPosts = this.state.posts.filter(post => post.id !== newPost.id)

                    const updatedPosts = [newPost, ...prevPosts]

                    this.setState({ posts: updatedPosts })
                }
             })

        this.DeletePostListener = API.graphql(graphqlOperation(onDeletePost))
             .subscribe({
                 next: postData => {
                     const deletedPost = postData.value.data.onDeletePost
                     const updatedPosts = this.state.posts.filter(post => post.id !== deletedPost.id)

                     this.setState({ posts: updatedPosts })
                 }
             })

             
        this.UpdatePostListener = API.graphql(graphqlOperation(onUpdatePost))
             .subscribe({
                 next: postData => {
                     const { posts } = this.state
                     const updatePost = postData.value.data.onUpdatePost

                     const index = posts.findIndex(post => post.id === updatePost.id)

                     const updatedPosts = [ ...posts.slice(0, index), updatePost, ...posts.slice(index+1)]

                     this.setState({ posts: updatedPosts })
                 }
             })

            
        this.createPostCommentListener = API.graphql(graphqlOperation(onCreateComment))
             .subscribe({
                 next: commentData => {
                     const createdComment = commentData.value.data.onCreateComment
                     let posts = [ ...this.state.posts ]

                     for (let post of posts) {
                         if (createdComment.post.id === post.id) {
                             post.comments.items.push(createdComment)
                         }
                     }

                     this.setState({ posts })
                 }
             })


        this.createPostLikeListener = API.graphql(graphqlOperation(onCreateLike))
             .subscribe({
                 next: postData => {
                     const createdLike = postData.value.data.onCreateLike
                     let posts = [...this.state.posts]

                     for (let post of posts) {
                         if (createdLike.post.id === post.id) {
                             post.likes.items.push(createdLike)
                         }
                     }

                     this.setState({ posts })
                 }
             })
    }

    componentWillUnmount() {
        // we need to Unmount our Subscription/unsubscribing or else it will keep on getting the post
        // that will be costly
        this.createPostListener.unsubscribe()

        this.DeletePostListener.unsubscribe()

        this.UpdatePostListener.unsubscribe()

        this.createPostCommentListener.unsubscribe()

        this.createPostLikeListener.unsubscribe()
    }

    getPosts = async () => {
        const result = await API.graphql(graphqlOperation(listPosts))
        // graphqlOperation(query)
        // console.log(result.data.listPosts.items);
        
        this.setState({ posts: result.data.listPosts.items })
    
    }

    // for checking if the person has liked the post or not.
    likedPost = (postId) => {

        for (let post of this.state.posts) {
            if (post.id === postId) {
                if (post.postOwnerId === this.state.ownerId) return true
                for (let like of post.likes.items) {
                    if (like.likeOwnerId === this.state.ownerId) {
                        return true
                    }
                }
            }
        }

        return false
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
                        <DeletePost data={post} />
                        <EditPost { ...post } />
                    </span>

                    <span>
                        <CreateCommentPost postId={post.id} />
                        { post.comments.items.length > 0
                            ? (
                                <span style={{ fontSize: '19px', color:"gray" }}>
                                    Comments:
                                    {
                                        post.comments.items.map((comment, index) => {
                                            return <CommentPost key={index} commentData={comment} />
                                        })
                                    }
                                </span>
                            ) : null
                        }
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