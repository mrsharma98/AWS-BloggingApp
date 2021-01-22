import React, { Component } from 'react'
import {API, Auth, graphqlOperation } from 'aws-amplify'
import { createPost } from '../graphql/mutations'

class CreatePost extends Component {

    state = {
        postOwnerId: "",
        postOwnerUsername: "",
        postTitle: "",
        postBody: ""
    }

    componentDidMount = async () => {
        // Auth, getting current user
        await Auth.currentUserInfo()
            .then((user) => {
                // console.log("Current User: ", user.username) -- username
                // console.log("Attr.Sub User: ", user.attributes.sub) -- userId
                this.setState({
                    postOwnerId: user.attributes.sub,
                    postOwnerUsername: user.username
                })
            })
    }

    handleChangePost = event => {
        return this.setState({ [event.target.name]: event.target.value })
        // setting the state values from the form
    }


    handleAddPost = async (event) => {
        event.preventDefault()

        const input = {
            postOwnerId: this.state.postOwnerId,
            postOwnerUsername: this.state.postOwnerUsername,
            postTitle: this.state.postTitle,
            postBody: this.state.postBody,
            createdAt: new Date().toISOString()
        }
        // this input is same as what we have in mutation

        await API.graphql(graphqlOperation(createPost, { input }))
        // calling API for createPost
        // input -- something that we wanna pass

        this.setState({ postTitle: "", postBody: "" })
        // making fields blank once got saved to backend

    }

    render() {
        return(
            <form 
                className="add-post" 
                onSubmit={this.handleAddPost}
            >
                <input 
                    style={{ font: '19px' }} 
                    type="text"
                    placeholder="Title"
                    name="postTitle"
                    required
                    value={this.state.postTitle}
                    onChange={this.handleChangePost}
                />

                <textarea 
                    type="text"
                    name="postBody"
                    rows="3"
                    cols="40"
                    required
                    placeholder="New Blog Post"
                    value={this.state.postBody}
                    onChange={this.handleChangePost}
                />

                <input 
                    type="submit"
                    className="btn"
                    style={{ fontSize: '19px' }}
                />
            </form>
        )
    }
}

export default CreatePost