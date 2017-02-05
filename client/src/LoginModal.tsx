import {
  Modal,
  Button,
  ModalDialog,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  FormControl
} from 'react-bootstrap';
import * as React from 'react';
import FormEvent = React.FormEvent;

interface LoginModalProps {
  onLogin: (username: string) => void
  onClose: () => void;
  showModal: boolean;
}

interface LoginModalState {
  value: string
}

class LoginModal extends React.Component<LoginModalProps, LoginModalState> {

  constructor(props) {
    super(props);
    this.state = {
      value: ""
    }
  }

  render() {
    return (
      <div className="static-modal">
        <Modal show={this.props.showModal} onHide={() => {}}>
          <ModalHeader>
            <ModalTitle>Login</ModalTitle>
          </ModalHeader>

          <ModalBody>
            <FormControl autoFocus={true}
                         type="text"
                         value={this.state.value}
                         label="Login"
                         placeholder="Username"
                         onChange={this.handleChante.bind(this)}
            />
          </ModalBody>

          <ModalFooter>
            <Button onClick={this.onClose.bind(this)}>Close</Button>
            <Button bsStyle="primary" onClick={this.onSubmit.bind(this)}>Submit</Button>
          </ModalFooter>

        </Modal>
      </div>
    )
  }

  handleChante(event) {
    this.setState({value: event.target.value})
  }

  onSubmit() {
    this.setState({value: ""});
    this.props.onLogin(this.state.value);
  }

  onClose() {
    this.setState({value: ""});
    this.props.onClose();
  }
}
;

export default LoginModal;