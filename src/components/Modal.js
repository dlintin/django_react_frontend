import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import axios from "axios";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
      userLists : [],
      token : this.props.token
    };
  }
  componentDidMount() {
   
    this.userList();
  }

  userList = () => {
    // console.log("assigned by", this.state.activeItem.asigned_by)
    axios
      .get("/api/users/",{
        headers: {
            'authorization': 'Bearer ' + this.getToken(), 
        }
    })
      .then((res) => this.setState({ userLists: res.data }))
      .catch((err) => console.log(err));
      
  };
  getToken() {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken
  }
  checkUser() {
    const username = sessionStorage.getItem('username');
    if( username === "admin"){
      return false
    }else {
      return true
    }
  }
  getUsername(){
    const username = sessionStorage.getItem('username');
    const user = JSON.parse(username);
    return user
  }
  disableChecker(){
    const username = sessionStorage.getItem('username');
    const user = JSON.parse(username);
    if(this.state.activeItem.asigned_by === user || !this.state.activeItem.id){
      return false
    }else {
      return true
    }
  }
  disableCheckerCompleted(){
    const username = sessionStorage.getItem('username');
    const userId = sessionStorage.getItem('userId');
    const user = JSON.parse(username);
    if(this.state.activeItem.asigned_by === user || !this.state.activeItem.id ||this.state.activeItem.assigned_to === userId){
      return false
    }else {
      return true
    }
  }
  

  handleChange = (e) => {
    let { name, value } = e.target;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem });
  };

  render() {
    const { toggle, onSave } = this.props;
 
    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Todo Item (Assigned By : {this.state.activeItem.asigned_by === null || this.state.activeItem.asigned_by === "" ?  this.getUsername() : this.state.activeItem.asigned_by })</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="todo-title">Title</Label>
              <Input
                type="text"
                id="todo-title"
                name="title"
                disabled={this.disableChecker()}
                value={this.state.activeItem.title}
                onChange={this.handleChange}
                placeholder="Enter Todo Title"
              />
            </FormGroup>
            <FormGroup>
              <Label for="todo-description">Description</Label>
              <Input
                type="text"
                id="todo-description"
                name="description"
                disabled={this.disableChecker()}
                value={this.state.activeItem.description}
                onChange={this.handleChange}
                placeholder="Enter Todo description"
              />
            </FormGroup>
            <FormGroup>
              <Label for="todo-description">Date</Label>
              <Input
                type="date"
                id="todo-date"
                name="date"
                disabled={this.disableChecker()}
                value={this.state.activeItem.date}
                onChange={this.handleChange}
                placeholder="dd/mm/yy"
              />
            </FormGroup>
            <FormGroup>
              <Label for="todo-description">Assign To</Label>
              <Input type="select" name="assigned_to" onChange={this.handleChange} value={this.state.activeItem.assigned_to}id="exampleSelect">
                <option>a</option>
              {this.state.userLists.map(team => (
            <option
              key={team.id}
              disabled={team.is_superuser && this.checkUser() }
              value={team.id}
            >
              {team.username}
            </option>
          ))}
        </Input>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  disabled={this.disableCheckerCompleted()}
                  name="completed"
                  checked={this.state.activeItem.completed}
                  onChange={this.handleChange}
                />
                Completed
              </Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => onSave(this.state.activeItem)}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}