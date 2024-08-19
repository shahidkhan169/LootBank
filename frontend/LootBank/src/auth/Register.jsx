import React, { useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Ensure you have these icons installed
import { useNavigate } from 'react-router-dom';

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phoneNumber: '',
    dob: '',
    age: '',
    nationality: '',
    address: '',
    state: '',
    district: '',
    email: '',
    mpin: '',
    confirmMpin: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');

  const navigate = useNavigate();

  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.firstname && formData.lastname && formData.phoneNumber && formData.dob && formData.age;
      case 2:
        return formData.nationality && formData.address && formData.state && formData.district;
      case 3:
        return formData.email && formData.mpin && formData.confirmMpin && formData.password && formData.confirmPassword;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
      setError('');
    } else {
      setError('Please fill out all required fields.');
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError(''); // Clear any error message when going back
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/register', formData);
      setSubmissionStatus('success');
      setSubmissionMessage('Successfully registered');
      setFormData({
        firstname: '',
        lastname: '',
        phoneNumber: '',
        dob: '',
        age: '',
        nationality: '',
        address: '',
        state: '',
        district: '',
        email: '',
        mpin: '',
        confirmMpin: '',
        password: '',
        confirmPassword: ''
      });
      setStep(1);
      setTimeout(() => {
        navigate('/login');
      }, 4000); // Navigate to /login after 4 seconds
    } catch (error) {
      setSubmissionStatus('failure');
      setSubmissionMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl text-center font-bold mb-6">Personal Information</h2>
            <div className="mb-4">
              <input type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-sm" required />
            </div>
            <div className="mb-4">
              <input type="text" name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-sm" required />
            </div>
            <div className="mb-4">
              <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-sm" required />
            </div>
            <div className="mb-4">
              <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-sm" required />
            </div>
            <div className="mb-4">
              <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-sm" required />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl text-center font-bold mb-6">Address Information</h2>
            <div className="mb-4">
              <input type="text" name="nationality" placeholder="Nationality" value={formData.nationality} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-sm" required />
            </div>
            <div className="mb-4">
              <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-sm" required />
            </div>
            <div className="mb-4">
              <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-sm" required />
            </div>
            <div className="mb-4">
              <input type="text" name="district" placeholder="District" value={formData.district} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-sm" required />
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl text-center font-bold mb-6">Credential Information</h2>
            <div className="mb-4">
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-sm" required />
            </div>
            <div className="mb-4">
              <input type="password" name="mpin" placeholder="MPIN" value={formData.mpin} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-sm" required />
            </div>
            <div className="mb-4">
              <input type="password" name="confirmMpin" placeholder="Confirm MPIN" value={formData.confirmMpin} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-sm" required />
            </div>
            <div className="mb-4">
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-sm" required />
            </div>
            <div className="mb-4">
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-sm" required />
            </div>
          </div>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-cyan-900">
      <h1 className="text-5xl font-bold mb-2">Register to be a Thief</h1>
      <p className="text-sm mb-8">Please read the fields and fill the form carefully</p>
      <form onSubmit={handleSubmit} className="w-[600px] max-w-3xl h-[500px] bg-cyan-900 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-black font-bold ${step >= 1 ? 'bg-blue-600' : 'bg-white'}`}>1</div>
          <div className={`flex-grow h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-white'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-black font-bold ${step >= 2 ? 'bg-blue-600' : 'bg-white'}`}>2</div>
          <div className={`flex-grow h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-white'}`}></div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-black font-bold ${step >= 3 ? 'bg-blue-600' : 'bg-white'}`}>3</div>
      </div>

      {renderStep()}

      <div className="flex justify-between mt-4">
        {step > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="py-1 px-3 bg-slate-500 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 focus:outline-none"
          >
            Previous
          </button>
        )}
        {step < 3 && (
          <button
            type="button"
            onClick={nextStep}
            className="py-1 px-3 bg-slate-500 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 focus:outline-none"
          >
            Next
          </button>
        )}
        {step === 3 && (
          <button
            type="submit"
            className="py-1 px-3 bg-slate-500 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 focus:outline-none"
          >
            Submit
          </button>
        )}
      </div>
      {error && <div className="mt-4 text-red-500 font-semibold">{error}</div>}
      
      {submissionStatus && (
        <div className={`mt-4 p-4 text-center rounded-lg ${submissionStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {submissionStatus === 'success' ? (
            <div>
              <FaCheckCircle className="inline-block text-3xl mr-2" />
              <span>{submissionMessage}</span>
            </div>
          ) : (
            <div>
              <FaTimesCircle className="inline-block text-3xl mr-2" />
              <span>{submissionMessage}</span>
            </div>
          )}
        </div>
      )}
    </form>
  </div>
);
};

export default MultiStepForm;
