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
  checkUser(superUser) {
    
    const myUsername = sessionStorage.getItem('userId');
    // console.log(myUsername === "1")
    if(myUsername === "1"){
      return false
    }
    if(myUsername !== "1" && !superUser){
      return false
    }
    if(myUsername !== "1" && superUser){
      return true
    }
  }
  getUserId(){
    const id = sessionStorage.getItem('userId')
    const user = JSON.parse(id);
    console.log("USER",user)
    return user
  }
  getUsername(){
    const username = sessionStorage.getItem('username');
    const user = JSON.parse(username);
    return user
  }
  disableChecker(){
    const username = sessionStorage.getItem('username');
    const id = sessionStorage.getItem('userId');
    const user = JSON.parse(username);
    // false (not disabled ) condition  :
    // 1. user to other user
    // 2. admin to other user
    // 3. admin to admin
    // console.log("assigned by", this.state.activeItem.asigned_by, 'user',user)
    if(id === "1" ||this.state.activeItem.asigned_by === user || !this.state.activeItem.id || this.state.activeItem.asigned_by ===id){
      return false
    }else {
      return true
    }
  }
  disableCheckerCompleted(){

    const username = sessionStorage.getItem('username');
    const userId = sessionStorage.getItem('userId');
    const user = JSON.parse(username);
    // console.log("username",user,"to", this.state.activeItem.assigned_to ,"By", this.state.activeItem.asigned_by)
    //only available for the one who have been assigned to and the one who assign the task if it is in edit mode
    if(userId === "1"|| this.state.activeItem.asigned_by === user || !this.state.activeItem.id ||this.state.activeItem.assigned_to === parseInt(userId)){
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
    const { toggle, onSave,onDelete } = this.props;
 
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
              <Input type="select" name="assigned_to" onChange={this.handleChange} disabled={this.disableChecker()} value={this.state.activeItem.assigned_to}id="exampleSelect" placeholder={this.state.activeItem.assigned_to}>
               
              {this.state.userLists.map(team => ( team.id === this.state.activeItem.assigned_to ? 
              [ <option selected disabled hidden >{team.username}</option> ,
               <option
               key={team.id}
               disabled={ this.checkUser(team.is_superuser) }
               value={team.id}
             >
               {team.username}
             </option> ]:
            <option
              key={team.id}
              disabled={ this.checkUser(team.is_superuser) }
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
          <button
            className="btn btn-danger"
            disabled={this.disableChecker()}
            onClick={() => onDelete(this.state.activeItem)}
          >
            Delete
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}