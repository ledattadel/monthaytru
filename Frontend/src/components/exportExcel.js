import * as FileSaver from 'file-saver';
//import XLSX from 'sheetjs-style';
import XLSX from 'xlsx-js-style';
import { Button, Tooltip } from '@mui/material';
import Iconify from './Iconify';
import formatMoneyWithDot from '../utils/formatMoney';
const ExcelJS = require('exceljs');

const ExportExcel = ({ excelData, fileName }) => {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

	// ------------------------------------------Old-------------------------------------------
  //const exportToExcel = () => {
  //  const ws = XLSX.utils.json_to_sheet(excelData);
  //  const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
  //  const merge = [{ s: { r: excelData.length + 1, c: 0 }, e: { r: excelData.length + 1, c: 3 } }];
  //  ws['!merges'] = merge;
  //  XLSX.utils.sheet_add_aoa(ws, [['Total', '', '', '', '1999238478đ']], { origin: -1 });
  //  ws[['A1']].s = {
  //    // set the style for target cell
  //    font: {
  //      sz: 24,
  //      bold: true,
  //      color: { rgb: 'FFFFAA00' },
  //    },
  //  };
  //  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  //  const data = new Blob([excelBuffer], { type: fileType });
  //  FileSaver.saveAs(data, fileName + fileExtension);
  //};

	const getData = () => {
		return excelData.map(value => ({
			...value,
			Price: formatMoneyWithDot(value?.Price),		
		}))
	}

	const getFooter = () => {
		const totalPrice = excelData.reduce((total, current) => {
			return total += current.Price;
		}, 0);
		return ['Total', '', '', '', formatMoneyWithDot(totalPrice), '']
	}

	const exportToExcelNew = () => {
		const wb = XLSX.utils.book_new();
		const footer = getFooter();
		const data = getData();
		const report = 'Thống kê doanh thu tại garage Enmasys';
		const myHeader = ['Cart', 'Owner', 'CreateAt', 'CompleteAt', 'Price', 'ConfirmBy'];
		exportToExcelPro(
			data,
			'Thống kê doanh thu garage Enmasys',
			'Thống kê doanh thu garage Enmasys',
			report,
			myHeader,
			footer,
			[
				{width: 15},
				{width: 40},
				{width: 40},
				{width: 40},
				{width: 40},
				{width: 40},
			],
		)
	}

	const exportToExcelPro = async (myData, fileName, sheetName, report, myHeader, myFooter, widths) => {
		if(!myData || myData.length === 0) {
			return ;
		}

		const wb = new ExcelJS.Workbook();
		const ws = wb.addWorksheet(sheetName);
		const columns = myHeader.length;
		const title = {
			border: true,
			money: false,
			height: 100,
			font: {size: 30, bold: false, color: {argb: "000000"}},
			alignment: {horizontal: 'center', vertical: 'middle'},
			fill: null
		}

		const header = {
			border: true,
			money: false,
			height: 50,
			font: {size: 15, bold: false, color: {argb: "000000"}},
			alignment: {horizontal: 'center', vertical: 'middle'},
			fill: {
				type: 'pattern',
				pattern: 'solid',
				fgColor: {
					argb: '7DCCFF',
				}
			}
		}

		const data = {
			border: true,
			money: false,
			height: 30,
			font: {size: 12, bold: false, color: {argb: "000000"}},
			alignment: {horizontal: 'center', vertical: 'middle'},
			fill: null,
		}

		const footer = {
			border: true,
			money: false,
			height: 50,
			font: {size: 15, bold: false, color: {argb: "FF0000"}},
			alignment: {horizontal: 'center', vertical: 'middle'},
			fill: null,
		}

		if(widths && widths.length > 0) {
			ws.columns = widths;
		}

		let row = addRow(ws, [report], title);
		mergeCells(ws, row, 1, columns);

		addRow(ws, myHeader, header);

		myData.forEach(r => {
			addRow(ws, Object.values(r), data);
		})

		row = addRow(ws, myFooter, footer);
		mergeCells(ws, row, 1, columns - 2);

		const buf = await wb.xlsx.writeBuffer();
		FileSaver.saveAs(new Blob([buf]), `${fileName}.xlsx`)
	}

	const addRow = (ws, data, section) => {
		const borderStyles = {
			top: {style: 'thin'},
			left: {style: 'thin'},
			bottom: {style: 'thin'},
			right: {style: 'thin'},
		}
		const row = ws.addRow(data);
		row.eachCell({includeEmpty: true}, (cell, colNumber) => {
			if(section?.border) {
				cell.border = borderStyles;
			}
			if(section?.money && typeof cell.value === 'number') {
				cell.alignment = {horizontal: 'right', vertical: 'middle'};
			}
			if(section?.alignment) {
				cell.alignment = section.alignment;
			} else {
				cell.alignment = {vertical: 'middle'};
			}
			if(section?.font) {
				cell.font = section.font;
			}
			if(section?.fill) {
				cell.fill = section.fill;
			}
		});
		if(section?.height > 0) {
			row.height = section.height;
		}
		return row;
	}

	const mergeCells = (ws, row, from, to) => {
		//console.log(
		//	'mergeCells',
		//	row,
		//	from,
		//	to,
		//	row.getCell(from)._address,
		//	row.getCell(to)._address,
		//)
		ws.mergeCells(`${row.getCell(from)._address}:${row.getCell(to)._address}`)
	}

  return (
    <>
      <Tooltip title="Excel Export">
        <Button
          variant="contained"
          //onClick={(e) => exportToExcel(fileName)}
          onClick={exportToExcelNew}
          color="primary"
          startIcon={<Iconify icon="ri:file-excel-2-line" />}
        >
          Excel Export
        </Button>
      </Tooltip>
    </>
  );
};

export default ExportExcel;
