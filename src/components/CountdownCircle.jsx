import React from 'react';

export default function CountdownCircle({ value, max, label }) {
  const radius = 32;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = max === 0 ? 0 : Math.min(1, value / max);
  const strokeDashoffset = circumference * (1 - percent);

  return (
    <div style={{ display: 'inline-block', textAlign: 'center', margin: '0 18px' }}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#444a"
          fill="none"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#00c8ff"
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="22"
          fontWeight="bold"
          fill="#fff"
        >
          {String(value).padStart(2, '0')}
        </text>
      </svg>
      <div style={{ color: '#fff', fontSize: 16, marginTop: 4 }}>{label}</div>
    </div>
  );
}
