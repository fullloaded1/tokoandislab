import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Checking distinct values for future Enums...')

  const checkColumn = async (model: string, column: string) => {
    try {
      // @ts-ignore
      const results = await prisma[model].findMany({
        select: { [column]: true },
        distinct: [column]
      })
      const values = results.map((r: any) => r[column])
      console.log(`- ${model}.${column}:`, values)
      return values
    } catch (e) {
      console.log(`- ${model}.${column}: ERROR or Table Empty`)
      return []
    }
  }

  await checkColumn('institution', 'type')
  await checkColumn('inquiry', 'status')
  await checkColumn('quotation', 'status')
  await checkColumn('project', 'status')
  await checkColumn('invoice', 'type')
  await checkColumn('invoice', 'status')
  await checkColumn('delivery', 'status')
  await checkColumn('reminder', 'type')
  await checkColumn('reminder', 'status')
  await checkColumn('activityLog', 'action')
  await checkColumn('whatsAppLog', 'status')

  console.log('Check complete.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
