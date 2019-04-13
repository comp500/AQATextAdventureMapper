import React, { Component } from 'react';
import Container from '../../components/Container';
import ContentBox from '../../components/ContentBox';
import UploadArea from '../../components/UploadArea';

class HomePage extends Component {
  render() {
    return (
      <Container>
        <ContentBox>
					<h1>Hello world!</h1>
					<UploadArea/>
				</ContentBox>
      </Container>
    );
  }
}

export default HomePage;
