import React, { Component } from 'react';

export default class EntryForm extends Component {

	constructor(props){
		super(props);
		this.state = {error:''};
	}

	changeHandler = (e) => {
		let name = e.target.name;
		let value = (e.target.value === '') ? '': parseInt(e.target.value, 10);
		this.props.onChange(name, value);
	}

	submitHandler = () => {

		let er = '';
		if(this.props.total_slots !== '')
			if(!isNaN(this.props.total_slots))
				if(!isNaN(this.props.filled))
					if(this.props.filled <= this.props.total_slots)
						this.props.populateLot();
					else
						er = 'Cars cannot be more than slots.';
				else
					er = 'Enter correct value for initial cars.';
			else
				er = 'Enter correct value for total slots';
		else
			er = 'Enter total number of parking slots';

		this.setState({error:er});

	}

	render() {
		return (
			<div className="entry-block">
				<div className="row">
					<label className="col-5"><span className="col-6">Total Parking Slots </span><input className="col-6" type="number" name="total_slots" onChange={this.changeHandler} value={this.props.total_slots} /></label>
					<label className="col-4"><span className="col-6">Initial Cars </span><input type="number" className="col-6" name="filled" onChange={this.changeHandler} value={this.props.filled } /></label>
					<div className="col-3"><button className="btn btn-primary btn-sm" onClick={this.submitHandler}>Generate</button></div>
				</div>
				<div className="error ml-3 mt-2">{this.state.error}</div>
			</div>
		);
	}
}