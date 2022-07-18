import "./App.css";
import ParkingLot from "./pages/ParkingLot";

import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

function App() {
  return (
    <div className="App">
      <header className="headers">
					<h1>Automated Parking Lot</h1>
				</header>
      <div className="max-w-screen-lg m-auto">
        <ParkingLot />
      </div>
    </div>
  );
}

export default App;
