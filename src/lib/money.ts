import { Prisma } from '@prisma/client'

export type DecimalValue = string | number | Prisma.Decimal

export const money = {
  /**
   * Mengubah tipe data campuran menjadi Decimal instance untuk kalkulasi.
   */
  toDecimal: (value: DecimalValue): Prisma.Decimal => {
    return new Prisma.Decimal(value || 0)
  },

  /**
   * Menjumlahkan array nominal secara aman (menghindari JS floating point error).
   */
  sum: (values: DecimalValue[]): Prisma.Decimal => {
    return values.reduce(
      (acc: Prisma.Decimal, val) => acc.add(new Prisma.Decimal(val || 0)),
      new Prisma.Decimal(0)
    )
  },

  /**
   * Menghitung nilai PPN dari sejumlah nominal.
   * Cth: applyTax(1000000, 11) -> 110000
   */
  applyTax: (amount: DecimalValue, taxRate: DecimalValue): Prisma.Decimal => {
    const decAmount = new Prisma.Decimal(amount || 0)
    const decTaxRate = new Prisma.Decimal(taxRate || 0)
    return decAmount.mul(decTaxRate).dividedBy(100)
  },

  /**
   * Memformat Decimal atau angka menjadi string mata uang Rupiah.
   * Cth: 1000000 -> "Rp 1.000.000"
   */
  formatIDR: (amount: DecimalValue): string => {
    const val = new Prisma.Decimal(amount || 0)
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0, // B2B lab jarang menggunakan pecahan sen
    }).format(val.toNumber())
  },

  /**
   * Serialisasi tipe Decimal menjadi String agar aman dikirim melalui API (JSON).
   */
  serialize: (amount: Prisma.Decimal | null | undefined): string => {
    if (!amount) return '0'
    return amount.toString()
  }
}
