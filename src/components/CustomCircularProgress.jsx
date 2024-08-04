import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

export function CustomCircularProgress({ value }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = ((100 - value) / 100) * circumference;

  return (
    <svg width={120} height={120}>
      <circle
        stroke="#D9D9D9"
        fill="transparent"
        cx="60"
        cy="60"
        r="50"
        strokeWidth="10"
      />
      <circle
        stroke="#FF7443"
        fill="transparent"
        cx="60"
        cy="60"
        r="50"
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="butt"
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="65" fill="black" fontSize="15" textAnchor="middle">{value}%</text>
    </svg>
  );
}
