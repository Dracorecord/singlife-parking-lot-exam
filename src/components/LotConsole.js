import React, { Component } from 'react';
import { connect } from 'react-redux';

import DataTable from './DataTable';
import { clearSlot, updateFilter } from '../actions';

export default class LotConsole extends Component {

	mapTableData = (lot) => {
		return {
			data: lot.vehicles,
			available: lot.available_slots.length,
			filters: {rfil:lot.regfilter, cfil:lot.colorfilter, sfil: lot.slotfilter}
		}
	}

	mapTableActions = (dispatch) => {
		return {
			removeBtnHandler: (slotID) => {dispatch(clearSlot(slotID))},
			getFilter: (name, value) => {dispatch(updateFilter(name, value))}
		}
	}
	render() {

		const DataTableStore = connect(this.mapTableData, this.mapTableActions)(DataTable);

		return (
			<div className="console">
				<DataTableStore />
			</div>
		);
	}
}
