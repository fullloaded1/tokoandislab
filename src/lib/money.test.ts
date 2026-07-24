import { describe, it, expect } from 'vitest'
import { money } from './money'
import { Prisma } from '@prisma/client'

describe('Money Library (Decimal)', () => {
  it('toDecimal converts correctly', () => {
    expect(money.toDecimal('100.50').toNumber()).toBe(100.5)
    expect(money.toDecimal(50).toNumber()).toBe(50)
  })

  it('sum arrays of mixed types correctly', () => {
    const total = money.sum(['10.5', 20, new Prisma.Decimal('30')])
    expect(total.toNumber()).toBe(60.5)
  })

  it('calculates tax accurately without floating point errors', () => {
    // Standard JS: 1000 * 0.11
    const tax = money.applyTax('1000000', '11')
    expect(tax.toNumber()).toBe(110000)
  })

  it('formats IDR strings properly', () => {
    const formatted = money.formatIDR(1500000)
    // Replace non-breaking space used by Intl.NumberFormat
    const cleanFormatted = formatted.replace(/\xa0/g, ' ').replace(/\u202F/g, ' ')
    expect(cleanFormatted).toBe('Rp 1.500.000')
  })

  it('serializes Prisma.Decimal to string', () => {
    const serialized = money.serialize(new Prisma.Decimal('150.25'))
    expect(serialized).toBe('150.25')
  })
})
