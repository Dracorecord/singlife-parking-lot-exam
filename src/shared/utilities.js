export const getNearest = (slots, entry) => {
  return slots
    .filter((slot) => slot.isOccupied === false)
    .filter((slot) => slot.distance[entry] !== undefined)
    .sort((a, b) => a.distance[entry] - b.distance[entry])[0];
};

export const getRank = (slots, entry, id) => {
  console.log(slots[0].distance[3]);
  return slots
    .filter((slot) => slot.isOccupied === false)
    .filter((slot) => slot.distance[entry] !== undefined)
    .sort((a, b) => a.distance[entry] - b.distance[entry])
    .findIndex((slot) => slot.id === id);
};

export const getSizeText = (size) => {
  switch (size) {
    case 0:
      return "Small";
    case 1:
      return "Medium";
    case 2:
      return "Large";
    default:
      return;
  }
};

export const getAvailableSizes = (slots, size) => {
  return slots.filter((slot) => slot.size >= size && slot.isOccupied === false);
};

export const parkingFeeDict = {
  0: 20,
  1: 60,
  2: 100,
};

export const isReturnee = (vehicle) => {
  if (!vehicle.lastParkOut) return false;

  const lastTimeOut = new Date(vehicle.lastParkOut);
  const timeIn = new Date(vehicle.parkIn);

  const hours = getHours(lastTimeOut, timeIn);

  if (hours > 1) return false;
  else return true;
};

export const getDays = (timeIn, timeOut) => {
  return parseInt((timeOut - timeIn) / (1000 * 60 * 60 * 24));
};
export const getHours = (timeIn, timeOut) => {
  return parseInt((Math.abs(timeOut - timeIn) / (1000 * 60 * 60)) % 24);
};
export const getMinutes = (timeIn, timeOut) => {
  return parseInt(
    (Math.abs(timeOut.getTime() - timeIn.getTime()) / (1000 * 60)) % 60
  );
};
export const getSeconds = (timeIn, timeOut) => {
  return parseInt((Math.abs(timeOut.getTime() - timeIn.getTime()) / 1000) % 60);
};

export const calculateFee = (vehicle) => {
  var fee = 0;
  const timeIn = new Date(vehicle.parkIn);

  const timeOut = new Date();

  const days = getDays(timeIn, timeOut);
  var hours = getHours(timeIn, timeOut);
  const minutes = getMinutes(timeIn, timeOut);
  const seconds = getSeconds(timeIn, timeOut);

  if (minutes > 0 || seconds > 0) {
    hours += 1;
  }

  const returnee = isReturnee(vehicle);

  if (returnee) {
    const timeLeft = 3 - vehicle.timeConsumed.hours;
    if (timeLeft > 0) {
      if (hours > timeLeft) fee += (hours - timeLeft) * vehicle.parkingFee;
    } else {
      fee += hours * vehicle.parkingFee;
    }
  } else {
    fee += 40;
    if (days > 0) {
      fee += 5000;
    }
    if (hours > 3) {
      fee += (hours - 3) * vehicle.parkingFee;
    }
  }
  return { returnee, days, hours, minutes, seconds, fee };
};

export const hasRecord = (vehicles, plate) => {
  return vehicles.find((vehicle) => vehicle.plate === plate);
};
