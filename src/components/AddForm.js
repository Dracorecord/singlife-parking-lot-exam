import React, { Component } from 'react';

export class AddForm extends Component {

	constructor(props){
		super(props);
		this.state = {regis:'', colour:'', er:''};
	}

	changeHandler = (e) => {
		this.setState({[e.target.name]: e.target.value.toUpperCase()});
	}

	submitHandler = () => {

		let er = '';
		if (this.state.regis.match(/^[A-Z]{2}-\d{2}-[A-Z]{2}-[1-9]\d{3}$/))
			if(this.state.colour.match(/[A-Za-z]+/)){
				this.props.onSubmit(this.state.regis, this.state.colour);
				this.setState({regis:'', colour:''});
			}
			else
				er = "Enter correct colour value";
		else
			er = "Enter registration number in correct format - AB-12-XY-1234";

		this.setState({error:er});
	}

	render() {

		if(this.props.available > 0)
			return (
				<div className="add-block row">
					<div className="col-12 h4">Available space: {this.props.available}</div>
					<div className="error">{this.state.error}</div>
					<div className="error">{(this.state.error === '' && this.props.duplicate_err)? "This Registration number already exist. Please enter correct number.": ""}</div>
					<div className="row ml-4">
						<label className="col-5"><span className="col-6">Registration No </span><input className="col-6" type="text" name="regis" placeholder="AB-12-XY-1234" value={this.state.regis} onChange={this.changeHandler}/></label>
						<label className="col-4"><span className="col-4">Colour </span><input className="col-7" type="text" name="colour" value={this.state.colour} onChange={this.changeHandler}/></label>
						<div className="col-3"><button className="btn btn-sm btn-success" onClick={this.submitHandler}>Add</button></div>
					</div>
				</div>
			);
		else
			return null;
	}
}

export default AddForm;