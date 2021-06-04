import React, { Component } from "react";
import Modal from "./components/Modal";
import LoginModal from "./components/LoginModal"
import axios from "axios";
axios.defaults.baseURL = 'https://andikaherup-django-react-backend.zeet.app/';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      todoList: [],
     token: "",
      loginModal : false,
      modal: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
        asigned_by: "",
        asigned_to: 0
      },
      login: {
        username: "",
        password: "",
      },
    };
  }

  componentDidMount() {
    const token = this.getToken();
    console.log("a",token)
  if(!token || token === undefined) {
    this.setState({loginModal : true});
  }else{
    this.refreshList();
  }
    
  }

  refreshList = () => {
    axios
      .get("/api/todos/",{
        headers: {
            'authorization': 'Bearer ' + this.getToken(), 
        }
    })
      .then((res) => this.setState({ todoList: res.data }))
      .catch((err) => console.log(err));
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };
  loginToggle = () => {
    this.setState({ loginModal: !this.state.loginModal });
  };
  logout(){
    sessionStorage.clear();
    window.location.reload()
  }

  handleSubmit = (item) => {
    this.toggle();

    if (item.id) {
      axios
        .put(`/api/todos/${item.id}/`, item,{
          headers: {
              'authorization': 'Bearer ' + this.getToken(), 
          }
      })
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post("/api/todos/", item,{
        headers: {
            'authorization': 'Bearer ' + this.getToken(), 
        }
    })
      .then((res) => this.refreshList());
  };
 
  handleSubmitLogin = (item) => {
    axios
      .post("/api/token/", item,)
      .then((res) => this.setToken(res.data));
  };
  async setToken(data) {
    await sessionStorage.setItem('token', JSON.stringify(data.access));
    await sessionStorage.setItem('refresh', JSON.stringify(data.refresh));
    await sessionStorage.setItem('user', JSON.stringify(data.id));
    this.setState({token : data.access})
    axios.defaults.headers.common = {'Authorization': `Bearer ${this.getToken()}`,'content-type': 'application/json'}
    this.refreshList();
    this.loginToggle()
  }

  
  getToken() {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken
  }

  handleDelete = (item) => {
    axios
      .delete(`/api/todos/${item.id}/`,{
        headers: {
            'authorization': 'Bearer ' + this.getToken(), 
        }
    })
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { title: "", description: "", completed: false, asigned_by: "",asigned_to: 0  };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }

    return this.setState({ viewCompleted: false });
  };

  renderTabList = () => {
    return (
      
      <div className="nav nav-tabs">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
        >
          Complete
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
        >
          Incomplete
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      (item) => item.completed === viewCompleted
    );

    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.editItem(item)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => this.handleDelete(item)}
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main className="container">
        <div class="row">
         <h3>Welcome</h3>    <button
            className="btn btn-danger"
            onClick={() => this.logout()}
          >
            Logout
          </button>
        </div>
        <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button
                  className="btn btn-primary"
                  onClick={this.createItem}
                >
                  Add task
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            token={this.state.token}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
        {this.state.loginModal ? (
          <LoginModal
            login={this.state.login}
            toggle={this.toggle}
            onSave={this.handleSubmitLogin}
          />
        ) : null}
      </main>
    );
  }
}

export default App;