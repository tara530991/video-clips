import React from "react";

const ForwardIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    {...props}
  >
    <polygon points="11,5 21,12 11,19" fill="currentColor" />
    <polygon points="3,5 13,12 3,19" fill="currentColor" />
  </svg>
);

export default ForwardIcon;
