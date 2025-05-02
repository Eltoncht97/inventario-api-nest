import { IvaType as CustomIvaType } from 'src/common/constants';

import { IvaType } from '@prisma/client';

const IVA_MAP: Record<IvaType, number> = {
  IVA_0: 0,
  IVA_10: 0.1,
  IVA_21: 0.21,
  IVA_27: 0.27,
};

interface PricingInput {
  cost: number;
  ivaType: CustomIvaType | IvaType;
  utilitiesPercent?: number;
  utilitiesValue?: number;
  discountPercent?: number;
  discountValue?: number;
}

export function calculatePricing(input: PricingInput) {
  const { cost, ivaType } = input;

  if (cost === undefined) {
    throw new Error('El campo "cost" es obligatorio para calcular el precio.');
  }

  if (ivaType === undefined) {
    throw new Error(
      'El campo "ivaType" es obligatorio para calcular el precio.',
    );
  }

  const ivaRate = IVA_MAP[ivaType];
  const ivaValue = cost * ivaRate;

  const costTotal = cost + ivaValue;

  let utilitiesPercent = input.utilitiesPercent;
  let utilitiesValue = input.utilitiesValue;

  if (utilitiesPercent !== undefined) {
    utilitiesValue = cost * (utilitiesPercent / 100);
  } else if (utilitiesValue !== undefined) {
    utilitiesPercent = (utilitiesValue / cost) * 100;
  } else {
    utilitiesPercent = 0;
    utilitiesValue = 0;
  }

  let discountPercent = input.discountPercent;
  let discountValue = input.discountValue;

  if (discountPercent !== undefined) {
    discountValue = cost * (discountPercent / 100);
  } else if (discountValue !== undefined) {
    discountPercent = (discountValue / cost) * 100;
  } else {
    discountPercent = 0;
    discountValue = 0;
  }

  const price = cost + ivaValue + utilitiesValue - discountValue;

  return {
    costTotal,
    ivaValue,
    utilitiesValue,
    utilitiesPercent,
    discountValue,
    discountPercent,
    price,
  };
}
