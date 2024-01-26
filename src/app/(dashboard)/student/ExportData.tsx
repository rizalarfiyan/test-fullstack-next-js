import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/DropdownMenu'
import { downloadFile, getFileName } from '@/lib/utils'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

type ExportDataProps = {
  children: React.ReactNode
  data: any[]
  header: string[]
  keys: string[]
}

const ExportData: React.FC<ExportDataProps> = ({ children, header, keys, data }) => {
  const getMapData = (): string[][] => {
    const mapData = []
    for (let i = 0; i < data.length; i++) {
      const row: string[] = []
      for (let j = 0; j < keys.length; j++) {
        if (keys[j] === 'sequence') {
          row.push(`${i + 1}`)
          continue
        }
        row.push(`${data?.[i]?.[keys?.[j]] || ''}`)
      }
      mapData.push(row)
    }
    return mapData
  }

  const onExportExcel = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()

    const mapData = []
    for (let i = 0; i < data.length; i++) {
      const row: Record<string, string> = {}
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j]
        const head = header?.[j] || key
        if (key === 'sequence') {
          row[head] = `${i + 1}`
          continue
        }
        row[head] = `${data?.[i]?.[keys?.[j]] || ''}`
      }
      mapData.push(row)
    }

    const sheet = XLSX.utils.json_to_sheet(mapData, { header })
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, sheet, 'Students')
    XLSX.writeFile(workbook, getFileName('student', 'xlsx'))
  }

  const onExportCsv = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()

    const mapData = []
    for (let i = 0; i < data.length; i++) {
      const row: string[] = []
      for (let j = 0; j < keys.length; j++) {
        if (keys[j] === 'sequence') {
          row.push(`${i + 1}`)
          continue
        }
        row.push(`${data?.[i]?.[keys?.[j]] || ''}`)
      }
      mapData.push(row)
    }

    const csvString = Papa.unparse({ fields: header, data: mapData })
    const csvData = new Blob([csvString], { type: 'text/csv' })
    downloadFile(csvData, 'student', 'csv')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[140px]'>
        <DropdownMenuItem onClick={onExportExcel}>Excel</DropdownMenuItem>
        <DropdownMenuItem onClick={onExportCsv}>CSV</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ExportData
