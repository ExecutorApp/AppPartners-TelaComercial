import React from 'react';
import { SvgXml } from 'react-native-svg';

export const DISCOUNT_MANAGE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="none">
  <g opacity="0.1">
    <circle cx="160" cy="40" r="3" fill="#1777CF" />
    <circle cx="45" cy="55" r="2" fill="#1777CF" />
    <circle cx="170" cy="90" r="2" fill="#1777CF" />
    <circle cx="30" cy="120" r="2.5" fill="#1777CF" />
    <circle cx="175" cy="150" r="2" fill="#1777CF" />
    <path d="M155 35 L165 45" stroke="#1777CF" stroke-width="1" />
    <path d="M40 50 L50 60" stroke="#1777CF" stroke-width="1" />
  </g>

  <path d="M85 28 Q90 18 100 16 Q110 18 115 28" stroke="#3A3F51" stroke-width="2" fill="none" stroke-linecap="round" />
  <path d="M92 22 Q97 14 103 22" stroke="#3A3F51" stroke-width="1.5" fill="none" stroke-linecap="round" />

  <circle cx="100" cy="45" r="24" stroke="#3A3F51" stroke-width="2" fill="none" />

  <circle cx="92" cy="44" r="3" fill="#3A3F51" />
  <circle cx="108" cy="44" r="3" fill="#3A3F51" />

  <path d="M86 36 Q91 33 97 36" stroke="#3A3F51" stroke-width="2" fill="none" stroke-linecap="round" />
  <path d="M103 36 Q109 33 114 36" stroke="#3A3F51" stroke-width="2" fill="none" stroke-linecap="round" />

  <ellipse cx="100" cy="56" rx="4" ry="3" stroke="#3A3F51" stroke-width="1.5" fill="none" />

  <line x1="100" y1="69" x2="100" y2="75" stroke="#3A3F51" stroke-width="2" stroke-linecap="round" />

  <line x1="100" y1="75" x2="100" y2="120" stroke="#3A3F51" stroke-width="2" stroke-linecap="round" />

  <line x1="80" y1="82" x2="120" y2="82" stroke="#3A3F51" stroke-width="2" stroke-linecap="round" />

  <path d="M80 82 L65 105 L55 130" stroke="#3A3F51" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="55" cy="130" r="4" stroke="#3A3F51" stroke-width="1.5" fill="none" />

  <path d="M120 82 L130 95 L125 110" stroke="#3A3F51" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="125" cy="110" r="3" stroke="#3A3F51" stroke-width="1.5" fill="none" />

  <path d="M90 120 L100 120 L110 120" stroke="#3A3F51" stroke-width="2" fill="none" stroke-linecap="round" />

  <path d="M90 120 L80 150 L75 170" stroke="#3A3F51" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M75 170 L68 172" stroke="#3A3F51" stroke-width="2" fill="none" stroke-linecap="round" />

  <path d="M110 120 L120 150 L125 170" stroke="#3A3F51" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M125 170 L132 172" stroke="#3A3F51" stroke-width="2" fill="none" stroke-linecap="round" />

  <line x1="55" y1="130" x2="50" y2="175" stroke="#3A3F51" stroke-width="2.5" stroke-linecap="round" />
  <path d="M50 175 Q45 182 38 180" stroke="#3A3F51" stroke-width="2.5" fill="none" stroke-linecap="round" />
</svg>
`;

type Props = {
  width?: number | string;
  height?: number | string;
  style?: any;
};

const DiscountManageIllustration: React.FC<Props> = ({ width = 200, height = 200, style }) => {
  return (
    <SvgXml xml={DISCOUNT_MANAGE_SVG} width={width as any} height={height as any} style={style} />
  );
};

export default DiscountManageIllustration;

