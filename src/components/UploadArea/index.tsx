import React, { Component } from 'react';

class UploadArea extends Component {
	fileInputRef: React.Ref;

	constructor(props) {
		super(props);
		this.fileInputRef = React.createRef();
	}
	render() {
		return (
			<p>Upload files here: <input type="file" ref={this.fileInputRef} onChange={this.onFilesAdded}/></p>
		);
	}
}

export default UploadArea;