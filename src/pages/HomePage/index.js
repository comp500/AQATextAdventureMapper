import React, { Component } from 'react';
import Container from '../../components/Container';
import ContentBox from '../../components/ContentBox';
import UploadArea from '../../components/UploadArea';
import flagData from '../../data/flag1.json';
import Map from '../../components/Map';

//
//               Up     North
//               y    -z
//               |
//               |   /
//               |
//   West        | /
//   -x _   _   _|__________x
//              /           East
//             / |
//            /
//           /   |
//          /
//   South z     -y Down
//

class HomePage extends Component {
  render() {
    return (
      <Container>
        <ContentBox>
					<h1>Hello world!</h1>
					<UploadArea/>
				</ContentBox>
				<Map data={flagData} />
      </Container>
    );
  }
}

export default HomePage;
