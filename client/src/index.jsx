import React from 'react';
import ReactDOM from 'react-dom';
import SideBar from './components/SideBar.jsx';
import AppRouter from './Router.jsx';
// import { ifError } from 'assert';
// import fakeData from './../../database/fakeData'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      followedUser: null,
      followedCategory: null,
      followedLogo: null,
      users: null,
      /* users: fakeData, */
      selectedUser: 0
    }

    this.handleClick = this.handleClick.bind(this);
    this.displayStreamerVideos = this.displayStreamerVideos.bind(this);
  }

  handleClick (e) {
    if(!this.state.toggle || this.state.followedUser === null) {
      this.setState({
        toggle: 'On',
        followedUser: this.state.users[this.state.selectedUser].display_name,
        followedCategory: this.state.users[this.state.selectedUser].category,
        followedLogo: this.state.users[this.state.selectedUser].logo,
      })
    } else {
      this.setState({
        followedUser: null,
        followedCategory: null,
        followedLogo: null,
      })
    }
  }

  displayStreamerVideos(e, index) {
    this.setState({ selectedUser: index })
  }


  componentDidMount() {
    fetch('http://54.153.16.245:3015/username' /* 'http://localhost:3015/username' */)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            users: [...result]
          })
        },
        (error) => {
          console.log('error')
        }
      )
  }

  render() {
    if (this.state.users === null) {
      return ( <div>Loading . . .</div>);
    } else {
      const sidebar = this.state.users.length ? <SideBar userInfo={this.state} onSelect={this.displayStreamerVideos} /> : null;
      const appRouter = this.state.users.length ? <AppRouter userInfo={this.state} onClick={(e) => this.handleClick(e)} /> : null;
      return (
        <div>
          {appRouter}
          {sidebar}
        </div>
      );
    }
  }
}

/*
following = users from the database in reverse order
square (background = profile_image_url), display_name underneath logo (centered)
*/

ReactDOM.render(<App />, document.getElementById('app'));