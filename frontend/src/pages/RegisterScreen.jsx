import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [code, setCode] = useState('');

  const navigate = useNavigate();
  const [signUp, { isLoading }] = useRegisterMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        await signUp({ email, firstName, lastName, password1, password2, code });
        toast.success('Registration successful');
        navigate('/login');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to sign up');
      }
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='code'>
          <Form.Label>Verification Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter verification code'
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId='firstName'>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter first name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='lastName'>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter last name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </Form.Group>


        <Button type='submit' variant='primary'>
          Sign Up
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
          Already have an account? <Link to='/login'>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
