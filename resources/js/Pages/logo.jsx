import React, { useState } from 'react';
import { Link } from '@inertiajs/react';


// logo ballon foot 
function BallonFootIcon({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 496"
      fill="currentColor"
    >
      <path d="M248 0C111 0 0 111 0 248s111 248 248 248 248-111 248-248S385 0 248 0zm0 464C123.5 464 32 372.5 32 248S123.5 32 248 32s216 91.5 216 216-91.5 216-216 216z"/>
      <path d="M248 104c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144S327.5 104 248 104zm0 256c-61.9 0-112-50.1-112-112S186.1 136 248 136s112 50.1 112 112-50.1 112-112 112z"/>
    </svg>
  );
}

export default BallonFootIcon;