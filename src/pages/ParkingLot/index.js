import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  calculateFee,
  getAvailableSizes,
  getNearest,
  getRank,
  getSizeText,
  hasRecord,
  parkingFeeDict,
} from "../../shared/utilities";
import { addVehicle, getVehicles, updateVehicle } from "../../api/vehicles";
import { addSlot, getSlots, updateSlot } from "../../api/slots";
import { addEntryPoint, getSettings } from "../../api/settings";

function ParkingLot() {
  // INITIAL GET
  useEffect(() => {
    getVehicles()
      .then((result) => setVehicles(result.data.data))
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    getSlots()
      .then((result) => {
        setSlots(result.data.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    getSettings()
      .then((result) => setSettings(result.data.data))
      .catch((err) => console.log(err));
  }, []);

  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [unparkModal, setUnparkModal] = useState(false);
  const [slotModal, setSlotModal] = useState(false);
  const [addSlotModal, setAddSlotModal] = useState(false);

  //   PARK VEHICLE
  const [entryPoint, setEntryPoint] = useState(null);
  const [size, setSize] = useState(null);
  const [plate, setPlate] = useState("");

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  //   ADD PARKING SLOT
  const [slotSize, setSlotSize] = useState(0);
  const [distance, setDistance] = useState([]);

  const handleEditSlot = (slot) => {
    setSelectedSlot(slot);
    setSlotModal(true);
  };

  const handleSubmitSlot = () => {
    updateSlot(selectedSlot.id, { distance: selectedSlot.distance }).then(
      (res) => {
        setSelectedSlot(null);
        window.location.reload();
      }
    );
  };

  const updateSlots = (id) => {
    updateSlot(id, {
      isOccupied: true,
      vehicle: plate,
    }).then((res) => {
      window.location.reload();
    });
  };

  const addEntryPoints = () => {
    addEntryPoint(settings.id, {
      points: settings.points + 1,
    }).then((res) => {
      alert("Successfully added new entry points!");
      window.location.reload();
    });
  };

  const updateVehicles = async (id, fee) => {
    const record = hasRecord(vehicles, plate) || null;

    if (record) {
      await updateVehicle(record.id, {
        parkingSlot: id,
        parkingFee: fee,
        status: "parking",
        parkIn: new Date(),
      });
    } else {
      await addVehicle({
        parkingSlot: id,
        parkingFee: fee,
        status: "parking",
        parkIn: new Date(),
        plate: plate,
      });
    }
  };

  const handleSubmit = () => {
    if (plate.length === 0 || size === null || entryPoint === null) {
      alert("Incomplete Vehicle Details");
      return;
    }
    const record = hasRecord(vehicles, plate) || null;
    if (record && record.status === "parking") {
      alert("Plate number is already used");
      return;
    }
    setModalShow(false);
    var slotId = "";
    var parkingFee = 0;
    if (size === 0) {
      const nearest = getNearest(slots, entryPoint);
      if (nearest === undefined) {
        alert("No parking slot available");
        return;
      }
      slotId = nearest.id;
      parkingFee = parkingFeeDict[nearest.size];
    } else {
      const result = getAvailableSizes(slots, size);
      if (result.length < 1) {
        alert("No parking slot available");
        return;
      }
      const nearest = getNearest(result, entryPoint);
      if (nearest === undefined) {
        alert("No parking slot available");
        return;
      }
      slotId = nearest.id;
      parkingFee = parkingFeeDict[nearest.size];
    }
    updateSlots(slotId);
    updateVehicles(slotId, parkingFee);
  };

  const handleEntryChange = (point) => {
    setEntryPoint(point);
  };

  const handleSizeChange = (size) => {
    setSize(size);
  };

  const handleUnpark = () => {
    setUnparkModal(false);
    const { returnee, days, hours, minutes, seconds, fee } =
      calculateFee(selectedVehicle);
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Returnee: {returnee.toString()}</p>
          <p>Days: {days}</p>
          <p>Hours: {hours - 1}</p>
          <p>Minutes: {minutes}</p>
          <p>
            Parking slot hourly rate (if exceed 3hrs):{" "}
            {selectedVehicle.parkingFee}
          </p>
          <h1>Total Fee: {fee}</h1>
        </div>
      ),
      onOk: async () => {
        await updateSlot(selectedVehicle.parkingSlot, {
          isOccupied: false,
          vehicle: null,
        });
        await updateVehicle(selectedVehicle.id, {
          lastParkOut: new Date(),
          parkIn: null,
          status: "away",
          timeConsumed: { hours, minutes, seconds },
        });
        window.location.reload();
      },
    });
  };

  const handleDistanceChange = (value, index) => {
    var newDistance = selectedSlot.distance;
    newDistance[index] = parseInt(value);
    setSelectedSlot({ ...selectedSlot, distance: newDistance });
  };

  const handleAddDistanceChange = (value, index) => {
    var newDistance = distance;
    newDistance[index] = parseInt(value);
    setDistance(newDistance);
  };

  const handleAddSlot = async () => {
    await addSlot({
      distance: distance,
      size: slotSize,
      isOccupied: false,
    });

    setAddSlotModal(false);
    window.location.reload();
  };

  const handlePark = () => {
    if (slots.some((slot) => slot.isOccupied === false)) {
      setModalShow(true);
    } else {
      alert("No parking slot available");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <Spin />
      </div>
    );
  }
  return (
    <div className="py-10">
      <div className="flex gap-2 justify-center">
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={handlePark}
        >
          Park Vehicle
        </button>
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={() => setUnparkModal(true)}
        >
          Unpark Vehicle
        </button>
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={addEntryPoints}
        >
          Add entry point
        </button>
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={() => setAddSlotModal(true)}
        >
          Add parking slot
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-10">
        {slots.map((slot, index) => (
          <div
            key={slot.id}
            className={`${
              slot.isOccupied ? "bg-Slate-400" : "bg-blue-400"
            } flex-1 px-4 py-4 flex justify-between rounded-sm shadow-sm cursor-pointer`}
            onClick={() => handleEditSlot(slot)}
          >
            <div>
              <h1 className="text-xs">Parking #{slot.id.slice(0, 5)}</h1>
              {slot.isOccupied === false && (
                <div className="flex">
                  <p>|</p>
                  {[...new Array(settings.points)].map((item, index) => (
                    <p>{getRank(slots, index, slot.id) + 1}|</p>
                  ))}
                </div>
              )}
            </div>
            <div>
              <p>Size: {getSizeText(slot.size)}</p>
              {slot.vehicle && (
                <p>
                  <strong>Vehicle</strong>: {slot.vehicle}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADD PARKING SLOT MODAL */}
      <Modal
        title="Parking Slot Details"
        visible={addSlotModal}
        onOk={handleAddSlot}
        onCancel={() => setAddSlotModal(false)}
      >
        <div>
          <div className="flex items-center gap-2">
            <input
              onClick={() => setSlotSize(0)}
              type="radio"
              checked={slotSize === 0}
            />
            <p>Small</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              onClick={() => setSlotSize(1)}
              type="radio"
              checked={slotSize === 1}
            />
            <p>Medium</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              onClick={() => setSlotSize(2)}
              type="radio"
              checked={slotSize === 2}
            />
            <p>Large</p>
          </div>
          <div className="flex flex-col gap-2">
            {[...new Array(settings.points)].map((item, index) => (
              <div className="flex items-center gap-2" key={index}>
                <p>Entry point {index + 1}: </p>
                <input
                  type="text"
                  name=""
                  id=""
                  className="border border-gray-900 px-2"
                  value={distance[index]}
                  onChange={(e) =>
                    handleAddDistanceChange(e.target.value, index)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* EDIT PARKING SLOT MODAL */}
      <Modal
        title="Parking Slot Details"
        visible={slotModal}
        onOk={handleSubmitSlot}
        onCancel={() => setSlotModal(false)}
      >
        <div>
          <p>Size: {selectedSlot?.size}</p>
          <div className="flex flex-col gap-2">
            {[...new Array(settings.points)].map((item, index) => (
              <div className="flex items-center gap-2" key={index}>
                <p>Entry point {index + 1}: </p>
                <input
                  type="text"
                  name=""
                  id=""
                  className="border border-gray-400 px-2"
                  value={selectedSlot?.distance[index] || ""}
                  onChange={(e) => handleDistanceChange(e.target.value, index)}
                />
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* UNPARK VEHICLE MODAL */}
      <Modal
        title="Vehicle Details"
        visible={unparkModal}
        onOk={handleUnpark}
        onCancel={() => setUnparkModal(false)}
      >
        <div>
          {vehicles
            .filter((vehicle) => vehicle.status === "parking")
            .map((vehicle) => (
              <div className="flex items-center gap-2" key={vehicle.id}>
                <input
                  onClick={() => setSelectedVehicle(vehicle)}
                  type="radio"
                  checked={selectedVehicle?.id === vehicle.id}
                />
                <p>{vehicle.plate}</p>
              </div>
            ))}
        </div>
      </Modal>

      {/* PARK VEHICLE MODAL */}
      <Modal
        title="Vehicle Details"
        visible={modalShow}
        onOk={handleSubmit}
        onCancel={() => setModalShow(false)}
      >
        <div>
          <p>Plate number</p>
          <input
            type="text"
            className="border border-gray-200 w-full py-1 px-2 mb-2"
            autoFocus
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
          />
          <h2>Entry point:</h2>
          {[...new Array(settings.points)].map((item, index) => (
            <div className="flex items-center gap-2" key={index}>
              <input
                onClick={() => handleEntryChange(index)}
                type="radio"
                checked={entryPoint === index}
              />
              <p>{index + 1}</p>
            </div>
          ))}
        </div>
        <div>
          <h2>Size:</h2>
          <div className="flex items-center gap-2">
            <input
              onClick={() => handleSizeChange(0)}
              type="radio"
              checked={size === 0}
            />
            <p>Small</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              onClick={() => handleSizeChange(1)}
              type="radio"
              checked={size === 1}
            />
            <p>Medium</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              onClick={() => handleSizeChange(2)}
              type="radio"
              checked={size === 2}
            />
            <p>Large</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ParkingLot;
