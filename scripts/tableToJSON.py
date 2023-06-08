import pandas as pd
import os
import json
#PMCBernardsVilleTakeoff.xlsx
fileName=input(str("Enter file name with extension: "))
xlsxFile = pd.ExcelFile(fileName)
outputDir = './jsons/'
for sheet in xlsxFile.sheet_names:
    print(sheet)
    # Read the individual sheet
    df = pd.read_excel(xlsxFile, sheet_name=sheet)
    # Convert the dataframe to JSON
    json_data = df.to_json(orient='records')
    outputPath = os.path.join(outputDir,f'{sheet}.json')
    with open(outputPath,'w') as f:
        f.write(json.dumps(json.loads(json_data), indent=4))