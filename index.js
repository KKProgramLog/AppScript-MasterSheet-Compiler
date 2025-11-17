function compilingMasterSheetScript() {

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    // Logger.log(spreadsheet.getSheetName()); - Comfirmed Actice sheet opens

    var configSourceSheet = spreadsheet.getSheetByName('Config Source Data');
    var masterCompilingSheet = spreadsheet.getSheetByName('Master Compiled Sheet');

    // We fetch the whole range
    var getAllConfigSourceSheetRange = configSourceSheet.getDataRange();
    var getAllMasterCompileRange = masterCompilingSheet.getDataRange();


    // We fetch the vlaues
    var getAllConfigSourceSheetValues = getAllConfigSourceSheetRange.getValues();
    var getAllMasterCompileValues = getAllMasterCompileRange.getValues();




    // below we will store all the headers in a var - This to prep the Master Headers to be keys.
    Logger.log(typeof getAllMasterCompileValues)
    var masterHeaders = getAllMasterCompileValues[0];
    Logger.log('Here are all the headers: ' + JSON.stringify(masterHeaders))

    // the every METHOD takes in 3 values and meassures is state Boolean - TRUE/FALSE
    var isHeaderRowEmpty = masterHeaders.every(cell => !cell || cell.toString().trim() === '');
    Logger.log('Check here what is the cell?: ' + isHeaderRowEmpty)


    // If it is true it will run the error block below and stop the Code
    if (isHeaderRowEmpty) {
        Logger.log("Error: Master sheet headers are missing or empty.");
        return;
    } // this error will kick in it the header row (1,1) is empty on the Master Compiled Sheet


    // Logger.log('This is the configSource Data: ' + JSON.stringify(getAllConfigSourceSheetValues)) // confirms it works
    // Logger.log('This is the MasterSheet Data: ' + getAllMasterCompileValues.toString().trim()) // confirms it works
    // Logger.log('This is the MasterSheet Data: ' + JSON.stringify(getAllMasterCompileValues)) // confirms it works



    var sourceUrlWorkbooks = [];

    for (let i = 1; i < getAllConfigSourceSheetValues.length; i++){
        Logger.log('These are the urls: ' + getAllConfigSourceSheetValues[i])
        var urlPrepChecker = getAllConfigSourceSheetValues[i][0];
        sourceUrlWorkbooks.push(urlPrepChecker)
    }

    // the exteral sources links have been stored in an array below
    Logger.log(sourceUrlWorkbooks)


    var targetSheet = configSourceSheet.getRange(2, 2);
    var targetSheetValue = targetSheet.getValue();

    Logger.log('Checking if Im pulling the correct cell B2:' + JSON.stringify(targetSheetValue))


    // here we will open the external sheet

    for (let urlCounter = 0; urlCounter < sourceUrlWorkbooks.length; urlCounter++){

        var externalSheetUrl = sourceUrlWorkbooks[urlCounter];
        var externalSpreadSheet = SpreadsheetApp.openByUrl(externalSheetUrl);



        // here we will open the specific spreadsheet so we can get the values
        var openSheetWithDataToBeCompiled  = externalSpreadSheet.getSheetByName('Data Input');


        // Here we are going to pull the Headser to prep for Key matches with the SOURCE URL Sheets
        var triggerSheetHeaderompilerCheck = openSheetWithDataToBeCompiled.getDataRange().getValues();
        Logger.log('This is a list: ' + triggerSheetHeaderompilerCheck);

        // Here we store the headers in an Array
        var externalSheetHeaders = triggerSheetHeaderompilerCheck[0];
        // here it will show what headers are in the external sheets
        Logger.log("External Sheet Headers: " + JSON.stringify(externalSheetHeaders))

        var isExternalHeadersEmpty = externalSheetHeaders.every(cell => !cell || cell.toString().trim() === '');

        if (isExternalHeadersEmpty) {
            Logger.log("Warning: External sheet " + externalSheetUrl +  " headers are missing or empty. Skipping this sheet.");
            continue;
        }

        var headerIndexMap = {};

        // When using the every method, it will return the number/index of that element if true (headers in Data Sheet matches Headers is MasterSheet) otherwise it will return -1
        masterHeaders.forEach(function(masterHeader, index){
            var externalIndex = externalSheetHeaders.findIndex(h => h && h.toString().trim().toLowerCase() === masterHeader.toString().trim().toLowerCase());
            Logger.log('If true what is the index otherwise if false return -1: ' + externalSheetHeaders[index] + "  " + externalIndex)

            if(externalIndex !== -1) {
                headerIndexMap[masterHeader] = externalIndex;
            }



        })

        // var headerIndexMapJSON = JSON.stringify(headerIndexMap)

        // here it will return the index mapping in JSON for Object.Keys check to make sure keys can extract the values
        Logger.log("Header Index Map: " + JSON.stringify(headerIndexMap));

        if(Object.keys(headerIndexMap) === 0) {
            Logger.log("Warning: No matching headers found between master and external sheet. Skipping.");
            continue
        }


        var fetchLastRow = masterCompilingSheet.getLastRow() -1;
        Logger.log('This is the last row: ' + fetchLastRow);

        for(let rowIndexCounter = 1; rowIndexCounter < triggerSheetHeaderompilerCheck.length; rowIndexCounter++) {

            // Here we want to iterate through list to count because it detects the values from the triggerSheetHeaderompilerCheck which will set the row
            var row = triggerSheetHeaderompilerCheck[rowIndexCounter];

            // As per the Header check values we'll do the same. We'll now check the values with an arrow function
            var isRowEmpty = row.every(cell => !cell || cell.toString.toString === '');

            // The following condition checks if the row is empty to stop the loop with a "Break" that breaks the current for loop.
            if (isRowEmpty){
                Logger.log("Reached empty row at index " + rowIndex + ". Stopping.");
                break;
            }
            // Logger.log(`This is the current row number and it data: ${rowIndexCounter} - ${row}`)



            var alignedRowWithMaster = masterHeaders.map(function(header) {
                var externalIndex = headerIndexMap[header];

                if (externalIndex === undefined) return '';

                var cellValue = row[externalIndex];

                // Try to coerce to number if it's numeric
                if (!isNaN(cellValue) && cellValue !== '') {
                    return Number(cellValue);
                }
                return cellValue;


                // return externalIndex !== undefined ? row[externalIndex] : '';
            })



            Logger.log(`The aligned row to append to the Master Sheet: ${rowIndexCounter} = ${JSON.stringify(alignedRowWithMaster)}`)



            if (alignedRowWithMaster && alignedRowWithMaster.length > 0) {
                // masterCompilingSheet.appendRow(alignedRowWithMaster);
                masterCompilingSheet.insertRowBefore(fetchLastRow);
                // This variable will help us write directly on the row that is being inserted
                var newRowIndex = fetchLastRow;
                masterCompilingSheet.getRange(newRowIndex, 1, 1, alignedRowWithMaster.length).setValues([alignedRowWithMaster]);

                Logger.log('The Sheets have been compiled onto the Master sheet!');
            }


        }

        // --------------------------------- Here We are creating formulas for the column -------------------

    }


    var columGetLastRow = masterCompilingSheet.getLastRow();

    var targetCellSumViewOne = masterCompilingSheet.getRange("J" + (columGetLastRow))
    var targetCellSumViewTwo = masterCompilingSheet.getRange("M" + (columGetLastRow))


    // var targetedCellToSum = masterCompilingSheet.getRange("M17");
    var columnToFormulaSumOne = "J";
    var columnToFormulaSumTwo = "M";

    var startSumRow = 2;

    var endSumRow = masterCompilingSheet.getLastRow() - 2;

    Logger.log('Is this function even working?');
    Logger.log('This is the starting row ' + startSumRow);
    Logger.log('This is the ending of that row ' + endSumRow);

    var columnCalculationRangeOne = masterCompilingSheet.getRange('J:J');
    var columnCalculationRangeTwo = masterCompilingSheet.getRange('M:M');

    var columnCalcultationValuesOne = columnCalculationRangeOne.getValues();
    var columnCalcultationValuesTwo = columnCalculationRangeTwo.getValues();

    Logger.log("For Interest Sake what would it be " + typeof columnCalcultationValuesOne);
    Logger.log("For Interest Sake what would it be " + typeof columnCalcultationValuesOne[5][0]);
    Logger.log("For Interest Sake what would it be " + columnCalcultationValuesOne[1][1]);

    Logger.log("For Interest Sake what would it be " + typeof columnCalcultationValuesTwo);
    Logger.log("For Interest Sake what would it be " + typeof columnCalcultationValuesTwo[5][0]);
    Logger.log("For Interest Sake what would it be " + columnCalcultationValuesTwo[1][1]);

    targetCellSumViewOne.setFormula(`=SUM(${columnToFormulaSumOne}${startSumRow}:${columnToFormulaSumOne}${endSumRow})`)
    targetCellSumViewTwo.setFormula(`=SUM(${columnToFormulaSumTwo}${startSumRow}:${columnToFormulaSumTwo}${endSumRow})`)


}

















