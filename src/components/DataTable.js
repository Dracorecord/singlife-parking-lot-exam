import React, { Component } from 'react';


const DataRow = (props) => {
	return (
		<div className="row table-row">
			<div className="col-4">{props.data.registration}</div>
			<div className="col-4">{props.data.color}</div>
			<div className="col-2">{props.data.slot}</div>
			<div className="col-2"><button className="btn btn-sm btn-danger" onClick={() => props.onClick(props.data.slot)}>Exit</button></div>
		</div>
	)
}

const Filters = (props) => {
	return (
			<div className="row filters">
				<div className="col-4"><input type="text" name="regfilter" onChange={props.onChange} value={props.filterVals.rfil}/></div>
				<div className="col-4"><input type="text" name="colorfilter" onChange={props.onChange} value={props.filterVals.cfil}/></div>
				<div className="col-2"><input type="number" name="slotfilter" onChange={props.onChange} value={props.filterVals.sfil}/></div>
				<div className="col-2"></div>
			</div>
		);
}

const TableWrapper = (props) => {
	return (
		<div className="data-table">
			<div className="row table-header">
				<div className="col-4 h4">Registration Number</div>
				<div className="col-4 h4">Colour</div>
				<div className="col-2 h4">Slot</div>
				<div className="col-2 h4"></div>
			</div>
			<hr />
			{props.children}
			<div className="row table-footer">
			</div>
		</div>
		)
}
export class DataTable extends Component {

	filterHandler = (e) => {
		if(e.target.name === 'slotfilter'){
			let n = (e.target.value === '') ? '': parseInt(e.target.value, 10);
			this.props.getFilter('slotfilter', n);
		}
		else
			this.props.getFilter(e.target.name, e.target.value.toUpperCase());
	}

	render() {

		if(this.props.data.length > 0){
			let data = this.props.data;
			
			data = (this.props.filters.rfil === '') ?  data : data.filter(val => { 
					return val.registration.includes(this.props.filters.rfil);	
			});

			data = (this.props.filters.cfil === '') ?  data : data.filter(val => { 
					return val.color.includes(this.props.filters.cfil);	
			});

			data = (this.props.filters.sfil === '') ?  data : data.filter(val => { 
					return this.props.filters.sfil === val.slot;	
			});

			const rows = data.map(item => {
				return <DataRow key={item.slot} data={item} onClick={this.props.removeBtnHandler}/>
			});

			return (
				<div className="col-12">
					<TableWrapper>
					<Filters filterVals={this.props.filters} onChange={this.filterHandler}/>
					{rows}
					</TableWrapper>
				</div>
			);
		}
		else
			return (
				<div className="m-5 p-5 pull-center">
					<div className="h3 justify-content-center">No Parking</div>
				</div>
			);
	}
}


export default DataTable;