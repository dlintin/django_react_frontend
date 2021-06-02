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
      activeItem: this.props.login,
      userLists : []
    };
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
      <Modal isOpen={true} >
        <ModalHeader >LOGIN</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="todo-title">Username</Label>
              <Input
                type="text"
                id="todo-title"
                name="username"
                value={this.state.activeItem.username}
                onChange={this.handleChange}
                placeholder="Username"
              />
            </FormGroup>
            <FormGroup>
              <Label for="todo-description">Password</Label>
              <Input
                type="password"
                id="todo-description"
                name="password"
                value={this.state.activeItem.password}
                onChange={this.handleChange}
                placeholder="Password"
              />
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