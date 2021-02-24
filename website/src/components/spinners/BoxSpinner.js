// https://codepen.io/ivillamil/pen/dokmG/
import React from 'react';
import './boxSpinner.css';

const BoxSpinner = ({ className }) => (
  <div id="box-spinner" className="flex flex-col items-center justify-center">
    <div id="box-spinner-box" className={className} />
    <div id="box-spinner-shadow" />
  </div>
);

export default BoxSpinner;
