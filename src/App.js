import { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    device: '',
    name: '',
    address: '',
    gmail: '',
    phoneNumber: '',
    monthlyFee: '',
    firstPayment: '',
    receiveTime: '',
    platform: '',
    infoLink: '',
  });

  const [errors, setErrors] = useState({});
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [displayResult, setDisplayResult] = useState('');
  const deliveryFee = 1500;

  // List of device options
  const deviceOptions = [
    'Sim Unlimited call + 1Gb',
    'Sim Unlimited call + 5Gb',
    'Sim Unlimited call + 25Gb',
    'Sim Unlimited call + 50GB (DCM)',
    'Sim Unlimited call + 50GB (SB)',
    'Sim Unlimited call + 100GB',
    'Sim data 2GB',
    'Sim data 4GB',
    'Sim data 6GB',
    'Sim data 10GB',
    'Sim data 35GB',
    'Sim data 50GB',
    'Sim data 100GB',
    'Sim data Unlimited',
    'Pocket wifi 100GB',
    'Pocket wifi 250GB',
    'Pocket wifi Unlimited',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Format specific fields for currency
    let formattedValue = value;
    if (name === 'monthlyFee' || name === 'firstPayment') {
      formattedValue = `¥${value.replace(/[^\d.]/g, '')}`;
    }

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));

    // Update filtered devices for the "device" field
    if (name === 'device') {
      const searchValue = value.toLowerCase();
      const newFilteredDevices = deviceOptions.filter((option) =>
        searchValue
          .split(' ')
          .every((word) => option.toLowerCase().includes(word))
      );
      setFilteredDevices(newFilteredDevices);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.gmail)) {
      newErrors.gmail = 'Invalid email address';
    }

    if (formData.phoneNumber && !/^\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number should contain only digits';
    }

    if (!/^[¥]?\d+(\.\d{1,2})?$/.test(formData.monthlyFee)) {
      newErrors.monthlyFee = 'Enter a valid amount for monthly fee';
    }

    if (!/^[¥]?\d+(\.\d{1,2})?$/.test(formData.firstPayment)) {
      newErrors.firstPayment = 'Enter a valid amount for first payment';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (language) => {
    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }

    // Calculated total first payment with delivery fee
    const firstPaymentTotal = parseFloat(formData.firstPayment.replace(/¥/, '')) + deliveryFee;

    // Display result based on selected language
    if (language === 'ENG') {
      setDisplayResult(`
        **Devices: ${formData.device}
- Name: ${formData.name}
- Address: ${formData.address}
- Gmail: ${formData.gmail}
- Phone number: ${formData.phoneNumber}
- Monthly fee: ${formData.monthlyFee}
- Total of first payment: ${formData.firstPayment} + ¥1500 (delivery fee)
- Time to receive: ${formData.receiveTime}
      `.trim());
    } else {
      setDisplayResult(`
        **Thiết bị: ${formData.device}
- Tên: ${formData.name}
- Địa chỉ: ${formData.address}
- Gmail: ${formData.gmail}
- sđt: ${formData.phoneNumber}
- smp: ${formData.monthlyFee}
- Ship daibiki freeship: ¥${firstPaymentTotal}
- Thời gian nhận: ${formData.receiveTime}
${formData.platform}
${formData.infoLink}
      `.trim());
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(displayResult)
      .then(() => {
        alert("Text copied to clipboard!");
      })
      .catch((error) => {
        console.error("Copy failed", error);
      });
  };

  return (
    <div className="App flex-col">
      <header className="App-header w-[100%] center p-5 my-5">
        <h1 className='font-bold text-2xl text-cyan-600'>
          QDA - Order Information
        </h1>
      </header>
      <div className='w-[100%] flex justify-center flex-col'>
        <div className='Info-enter w-fit py-4 px-10 bg-white rounded m-auto'>
          <form className="flex flex-col" onSubmit={handleSubmit}>

            <label htmlFor="device">Device:</label>
            <input
              className="form-input"
              name="device"
              type="text"
              value={formData.device}
              onChange={handleChange}
              placeholder="Search device"
            />
            {filteredDevices.length > 0 && (
              <ul className="border border-gray-300 mt-1">
                {filteredDevices.map((device) => (
                  <li
                    key={device}
                    className="cursor-pointer p-1 hover:bg-gray-200"
                    onClick={() => {
                      setFormData((prevData) => ({ ...prevData, device }));
                      setFilteredDevices([]);
                    }}
                  >
                    {device}
                  </li>
                ))}
              </ul>
            )}

            <label htmlFor="name">Customer Name:</label>
            <input
              className="form-input"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />

            <label htmlFor="address">Address:</label>
            <input
              className="form-input"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
            />

            <label htmlFor="gmail">Gmail:</label>
            <input
              className="form-input"
              name="gmail"
              type="text"
              value={formData.gmail}
              onChange={handleChange}
            />
            {errors.gmail && <p className="text-red-500">{errors.gmail}</p>}

            <label htmlFor="phoneNumber">Phone Number (optional):</label>
            <input
              className="form-input"
              name="phoneNumber"
              type="text"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}

            <label htmlFor="monthlyFee">Monthly Fee:</label>
            <input
              className="form-input"
              name="monthlyFee"
              type="text"
              value={formData.monthlyFee}
              onChange={handleChange}
            />
            {errors.monthlyFee && <p className="text-red-500">{errors.monthlyFee}</p>}

            <label htmlFor="firstPayment">First Payment:</label>
            <input
              className="form-input"
              name="firstPayment"
              type="text"
              value={formData.firstPayment}
              onChange={handleChange}
            />
            {errors.firstPayment && <p className="text-red-500">{errors.firstPayment}</p>}

            <label htmlFor="receiveTime">Time to Receive:</label>
            <input
              className="form-input"
              name="receiveTime"
              type="text"
              value={formData.receiveTime}
              onChange={handleChange}
            />

            <label htmlFor="platform">Platform:</label>
            <input
              className="form-input"
              name="platform"
              type="text"
              value={formData.platform}
              onChange={handleChange}
            />

            <label htmlFor="infoLink">Information Link:</label>
            <input
              className="form-input"
              name="infoLink"
              type="text"
              value={formData.infoLink}
              onChange={handleChange}
            />

            <div className="flex gap-4 mt-4 w-[100%] flex justify-around">
              <button type="button" onClick={() => handleSubmit('ENG')} className="bg-blue-500 hover:bg-blue-400 text-white w-[5rem] rounded-md p-2">ENG</button>
              <button type="button" onClick={() => handleSubmit('VN')} className="bg-red-500 hover:bg-red-400 text-white w-[5rem] rounded-md p-2">VN</button>
            </div>
            {displayResult && <pre className="mt-4 border p-2" onClick={handleCopy}>{displayResult}</pre>}
          </form>
        </div>
        <div>.</div>
      </div>
    </div>
  );
}

export default App;
