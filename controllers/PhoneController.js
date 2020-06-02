const fs = require('fs')
const excelToJson = require('convert-excel-to-json')

const upload = (req, res) => {
	try {
		//parsing data
		const path = fs.createReadStream(req.file.path).path
		const sheet = 'IPHONES'
		const buyNameColumnKeyMapping = { A:'name' }
		const buyColumnKeyMapping = {
			B: 'Storage Size',
			C: 'New',
			D: 'A1',
			E: 'A2',
			F: 'B1',
			G: 'B2',
			H: 'C',
			I: 'C/B',
			J: 'C/D',
		}
		const buyRange = 'A3:J*'
		const sellNameColumnKeyMapping = { L:'name' }
		const sellColumnKeyMapping = {
			M: 'Storage Size',
			N: 'New',
			O: 'A1',
			P: 'A2',
			Q: 'B1',
			R: 'B2',
			S: 'C',
			T: 'C/B',
			U: 'C/D',
		}
		const sellRange = 'L3:U*'

		const buy = processDocument(path, sheet, buyRange, buyColumnKeyMapping, buyNameColumnKeyMapping)
		const sell = processDocument(path, sheet, sellRange, sellColumnKeyMapping, sellNameColumnKeyMapping)

		fs.unlinkSync(req.file.path) // Empty temp folder
		return res.status(200).send({ message: 'product uploaded successfully', data: {
			buy,
			sell
		} })

	} catch (error) {
		return res.status(500).send({ message: 'Internal Server Error', data: error.message })
	}
}

const processDocument = (path, sheet ,range, columnKeyMapping, nameColumnKeyMapping) => {
	const initialExcelConversion = excelToJson({
		sourceFile: path,
		sheets: [sheet],
		range,
		columnToKey: columnKeyMapping
	})
	let phoneNames = excelToJson({
		sourceFile: path,
		sheets: [sheet],
		range,
		columnToKey: nameColumnKeyMapping
	})
	phoneNames = phoneNames['IPHONES'].filter((item) => (item.name !== 'Unlocked'))
	const groupedConversion = initialExcelConversion[sheet].reduce((arr, el) => {
		if(el['Storage Size'] === 'Storage Size'){
			arr.push([])
		}
		else {
			arr[arr.length - 1].push({...el})
		}
		return arr
	}, [])

	let finalJSON = []
	for(let i=0; i<groupedConversion.length; i++){
		const phones = groupedConversion[i]
		for(let storage of phones ){
			let grades = Object.keys(storage)
			const storage_size = storage['Storage Size']
			grades = grades.filter((item) => (item !== 'Storage Size'))
			for(let grade of grades)
			{
				finalJSON.push({
					phone: phoneNames[i].name,
					storage: storage_size,
					grade: grade,
					price: storage[grade]

				})
			}
		}
	}
    
	return finalJSON
}

module.exports = {
	upload
}