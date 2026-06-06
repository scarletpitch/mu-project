export interface CreditPackage {
  id: string
  label: string
  priceThb: number
  credits: number
}

export const creditPackages: CreditPackage[] = [
  { id: 'package_99', label: 'แพ็กเริ่มต้น', priceThb: 99, credits: 10 },
  { id: 'package_199', label: 'แพ็กยอดนิยม', priceThb: 199, credits: 25 },
  { id: 'package_499', label: 'แพ็กคุ้มค่า', priceThb: 499, credits: 70 }
]

export function findCreditPackage(packageId: string): CreditPackage | undefined {
  return creditPackages.find((item) => item.id === packageId)
}
