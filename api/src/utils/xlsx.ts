import { readFile, utils } from 'xlsx'

export const xlsxToJson = (filePath: string): any[] => {
	const file = readFile(filePath, { raw: true })
	let jsonData = []

	for (const sheetName of file.SheetNames) {
		const json = utils.sheet_to_json(file.Sheets[sheetName], { raw: false })
		if (json.length > jsonData.length) jsonData = json
	}
	return jsonData
}

