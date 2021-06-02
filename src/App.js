import React, { Component } from "react";
import Modal from "./components/Modal";
import LoginModal from "./components/LoginModal"
import axios from "axios";
axios.defaults.baseURL = 'https://dlintin-django-react-backend.zeet.app';

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
  if(!token) {
    this.setState({loginModal : true});
  }else{
    this.refreshList();
  }
    
  }

  refreshList = () => {
    axios
      .get("/api/todos/",{
        headers: {
            'authorization': this.getToken(),
            
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

  handleSubmit = (item) => {
    this.toggle();

    if (item.id) {
      axios
        .put(`/api/todos/${item.id}/`, item, {
          headers: {
              'authorization': this.state.token,
              
          }
      })
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post("/api/todos/", item,{
        headers: {
            'authorization': this.state.token,
            
        }
    })
      .then((res) => this.refreshList());
  };
 
  handleSubmitLogin = (item) => {
    axios
      .post("/token-auth/", item)
      .then((res) => this.setToken(res.data.token,res.data.user));


  };
  setToken(userToken,userData) {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    sessionStorage.setItem('user', JSON.stringify(userData));
    this.setState({token : userToken})
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
            'authorization': this.state.token,
            
        }
    })
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { title: "", description: "", completed: false };

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