import React from 'react';

import './Error.css';
//eslint-disable-next-line
const Error = ({ text, isActive }) => isActive ? (<p className="Error">{text}</p>) : null;

export default Error;
