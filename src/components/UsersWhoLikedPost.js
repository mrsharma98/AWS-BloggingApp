import React, { Component } from 'react'

class UsersWhoLikedPost extends Component {
    render() {
        const allUsers = this.props.data
        return allUsers.map((user) => {
            return(<React.Fragment key={user}>
                <div>
                    <span style={{ fontStyle:"bold", color: "#ged" }}>
                        {user}
                    </span>
                </div>
            </React.Fragment>)
        })
    }
}

export default UsersWhoLikedPost