// https://codepen.io/ivillamil/pen/dokmG/
import React from 'react';
import './spinner.css';

const Spinner = ({ className }) => (
  <div id="loader" className="flex flex-col items-center justify-center">
    <div id="box" className={className} />
    <div id="shadow" />
  </div>
);

export default Spinner;
