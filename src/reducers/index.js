
const initialize = { total_slots:'',
					filled: '',
					colors: ['BLACK', 'WHITE', 'BLUE', 'RED'],
					vehicles: [],
					available_slots: [],
					dup_err:0,
					regfilter:'',
					colorfilter:'',
					slotfilter:''};


const parking_lot = (state=initialize, action) => {

	switch(action.type){

		case 'UPDATE_FORM':
			return Object.assign({}, state, {
				[action.field.name] : action.field.value
			});
		
		case 'POPULATE':
			let s = [];
			for (let i = state.filled+1; i <= state.total_slots; i++) {
				s.push(i);
			}
			return Object.assign({}, state, {
			vehicles:generateData(state.filled, state.colors),
			available_slots:s 
			});

		case 'CLEAR_SLOT':
			return Object.assign({}, state, {
				vehicles: state.vehicles.filter( item => {
					return item.slot !== action.slotId
				}),
				filled: state.filled-1,
				available_slots: [...state.available_slots, action.slotId].sort((m,n) => {return m-n})
			});

		case 'ADD_NEW':
			if(!checkExists(state.vehicles, action.reg)){
				let [slot, ...available] = state.available_slots;
				return Object.assign({}, state, {
					vehicles: [{slot,registration: action.reg, color:action.colour}, ...state.vehicles],
					available_slots: available,
					filled: state.filled+1,
					dup_err: 0
				});
			}
			else
				return Object.assign({}, state, {
					dup_err:1
				});

		case 'UPDATE_FILTER':
			return Object.assign({}, state, {
				[action.filter.name]: action.filter.val
			});

		default:
			return state;
	}
}

function generateData(records, colors){

	let cars = [];
	
	let getRegistration = () => {

		let reg;
		do{
		reg = 'KA-';
		let area = () => {
			let num = getRandom(21);
			return (num > 9) ? num.toString() : '0'+num.toString();
		}

		let code = () => {
			let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			return chars[getRandom(chars.length)]+chars[getRandom(chars.length)];
		}

		let num = (getRandom(9)+1).toString()+getRandom(10).toString()+getRandom(10).toString()+getRandom(10).toString();
		reg += area()+'-'+code()+'-'+num;
		}while(checkExists(cars, reg));

		return reg;
	}

	for (let i=1; i<=records; i++){
		cars.push({slot:i,
					registration: getRegistration(),
					color:colors[getRandom(colors.length)]
		});
	}

	return cars;
}


function checkExists(data, key){

		let result = false;
		for (let i = 0; i < data.length; i++){

			if (data[i].registration === key){
				result = true;
				break;
			}
		}

		return result;
	}

function getRandom(length){

	return Math.floor(Math.random()*length);
}

export default parking_lot;