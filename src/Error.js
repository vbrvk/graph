import React from 'react';

import './Error.css';
//eslint-disable-next-line
const Error = ({ text, isActive }) => isActive ? (<div className="Error"><p>{text}</p></div>) : null;

export default Error;
