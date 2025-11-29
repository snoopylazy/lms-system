import moment from "moment";
export const formatDate = (timestamp) => {
  if (timestamp) {
    return moment(timestamp).format("DD-MMM-YYYY HH:mm:ss A");
  } else {
    return null
  }

};


export const formatDate2 = (timestamp) => {
  if (timestamp) {
    return moment(timestamp).format("DD-MMM-YYYY");
  } else {
    return null;
  }

};

export const formatDate3 = (timestamp) => {
  if (timestamp) {
    return moment(timestamp).format("DD/MM/YYYY");
  } else {
    return null;
  }

};

export const formatDateScheduleRepayment = (timestamp) => {
  return moment(timestamp).format("DD-MM-YYYY");
};


const khmerDays = [
  'អាទិត្យ',   // Sunday
  'ច័ន្ទ',     // Monday
  'អង្គារ',    // Tuesday
  'ពុធ',      // Wednesday
  'ព្រហស្បតិ៍', // Thursday
  'សុក្រ',     // Friday
  'សៅរ៍'      // Saturday
];

export const formatDateKhmerDay = (timestamp) => {
  const dayIndex = moment(timestamp).day();
  return khmerDays[dayIndex];
};