import React, { Component } from 'react'
import {API, graphqlOperation } from 'aws-amplify'
import { createPost } from '../graphql/mutations'

class CreatePost extends Component {

    state = {
        postOwnerId: "",
        postOwnerUsername: "",
        postTitle: "",
        postBody: ""
    }

    componentDidMount = async () => {
        
    }

    handleChangePost = event => {
        return this.setState({ [event.target.name]: event.target.value })
        // setting the state values from the form
    }


    handleAddPost = async (event) => {
        event.preventDefault()

        const input = {
            postOwnerId: "stephane23",
            postOwnerUsername: "Stephane",
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