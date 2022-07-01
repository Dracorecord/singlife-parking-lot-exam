
export const changeInput = (name,value) => {
	return {
		type: 'UPDATE_FORM',
		field: {name, value}
	}
}

export const populateData = () => {
	return{
		type: 'POPULATE'
	}
}

export const clearSlot = (slotId) => {
	return{
		type: 'CLEAR_SLOT',
		slotId
	}
}

export const addNew = (reg, colour) => {
	return{
		type: 'ADD_NEW',
		reg,
		colour
	}
}

export const updateFilter = (name, val) => {
	return{
		type: 'UPDATE_FILTER',
		filter: {name, val}
	}
}