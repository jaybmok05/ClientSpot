import { Container, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Hero = () => {
  return (
    <div className='py-5' style={{ backgroundColor: '#DEF9FF' }}>
      <Container className='d-flex justify-content-center'>
        <Card className='p-5 d-flex flex-column align-items-center hero-card' style={{ backgroundColor: '#fff', maxWidth: '75%' }}>
          <h1 className='text-center mb-4' style={{ color: '#023047' }}>Welcome to ClientSpot. Our Growth, Your success</h1>
          <p className='text-center mb-4' style={{ color: '#121F23' }}>
            ClientSpot is a unique solution developed by Corviton Company, offering clients the opportunity to showcase their companies after receiving services from Corviton. Enhance your visibility and reach by showcasing your company on our platform!
          </p>
          <div className='d-flex'>
            <LinkContainer to='/login'>
              <Button variant='primary' className='me-3' style={{ backgroundColor: '#FB8500', borderColor: '#FB8500' }}>
                Sign In
              </Button>
            </LinkContainer>
            <LinkContainer to='/signup'>
              <Button variant='secondary' style={{ backgroundColor: '#023047', borderColor: '#023047' }}>
                Register
              </Button>
            </LinkContainer>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Hero;
