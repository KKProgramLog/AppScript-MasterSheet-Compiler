function onOpen() {
    var ui = SpreadsheetApp.getUi();
    // Or DocumentApp, SlidesApp or FormApp.
    ui.createMenu('Manager Menu')
        .addItem('Check Uploaded Sheets', 'usersSheetLinks')
        .addSeparator
        .addItem('Pull External Sheets', 'openExternalSheets')
        .addToUi();
}

// Manager Constant
const getManagerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Manger Dashboard")

var externalSheetLinks = []



////---------------------------------------- External Sheet Upload Checker (Checks who uploaded their sheets and who didn't)-----------------------------------------------------------------------
function usersSheetLinks() {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("usersExternalSheets")
    range = sheet.getRange("A1:C10")
    values = range.getValues()

    Logger.log(values)



    for (let i = 0; i < values.length; i++) {


        // Those who have NOT uploaded their sheet will execute the following below
        if(values[i][0] == '' && values[i][1] != ''){
            SpreadsheetApp.getActiveSpreadsheet().getSheetByName("usersExternalSheets").getRange(i+1, 3).setValue('FALSE')
            SpreadsheetApp.getActiveSpreadsheet().getSheetByName("usersExternalSheets").getRange(i+1, 4).setValue(`${values[i][1]} did not upload the sheet yet.`)

            // This is for the manager view ------------------------------------------
            getManagerSheet.getRange(i+2, 1).setBackground('#e63946')
            getManagerSheet.getRange(i+2, 2).setBackground('#e63946').setValue('FALSE')
            getManagerSheet.getRange(i+2, 3).setBackground('#e63946').setValue(new Date())
            getManagerSheet.getRange(i+2, 4).setBackground('#e63946').setValue(`${values[i][1]} did not upload the sheet yet.`)

            //------------------------------------------

            Logger.log(values[i][1])

        } else if(values[i][0] == '' && values[i][1] == ''){
            break
        }


        // Those who have uploaded their sheet will execute the following below
        if (values[i][0] != '' && values[i][1] != '' && values[i][2] == false){
            SpreadsheetApp.getActiveSpreadsheet().getSheetByName("usersExternalSheets").getRange(i+1, 3).setValue('TRUE')

            // push the external sheet to the array:


            // This is for the manager view ------------------------------------------
            getManagerSheet.getRange(i+2, 1).setBackground('#57cc99')
            getManagerSheet.getRange(i+2, 2).setBackground('#57cc99').setValue('TRUE')
            getManagerSheet.getRange(i+2, 3).setBackground('#57cc99').setValue(new Date())
            getManagerSheet.getRange(i+2, 4).setBackground('#57cc99').setValue(`${values[i][1]} has Completed`)
            //------------------------------------------
        }
        externalSheetLinks.push(values[i][0])

        // Logger.log(values[i][0])



    }
    // Logger.log(numRows.length())
    // Logger.log(numRows)
    // Logger.log(numColumns)
    openExternalSheets(externalSheetLinks)


}
//---------------------------------------------------------------------------------------------------------------
//-------------------------------------- Open External Sheet --------------------------------------

function openExternalSheets(links){
    Logger.log(`Seems like the links are working ${links}`)

    getManagerSheet.getRange(7,1).setValue("WE GOT ALL THE LINKS HERE WE GO")
}



