import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ParkingLot.css';


import EntryForm from './components/EntryForm';
import AddForm from './components/AddForm';
import LotConsole from './components/LotConsole';
import { changeInput, populateData, addNew } from './actions';


export default class ParkingLot extends Component {

	mapFormState = (lot) => {
		return {total_slots: lot.total_slots,
				filled : lot.filled
			}
	}

	mapFormActions = (dispatch) => {
		return {
			onChange: (name, value) => {dispatch(changeInput(name,value))},
			populateLot: () => {dispatch(populateData())}
		}
	}

	addFormData = (lot) => {
		return{
			duplicate_err:lot.dup_err,
			available: lot.available_slots.length
		}
	}

	addFormActions = (dispatch) => {
		return {
			onSubmit: (reg, colour) => { dispatch(addNew(reg, colour))}
		}
	}

	render() {

		const EntryStore =  connect(this.mapFormState, this.mapFormActions)(EntryForm);
		const AddStore = connect(this.addFormData, this.addFormActions)(AddForm);
		return (
			<div className="main container-fluid">
				<header className="nav navbar justify-content-center">
					<h1>Automated Parking Lot</h1>
				</header>
				
				<div className="content container">
					<EntryStore />
					<AddStore />
					<LotConsole />
				</div>
				
			</div>
		);
	}
}

