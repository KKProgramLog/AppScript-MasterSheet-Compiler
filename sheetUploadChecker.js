function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp, SlidesApp or FormApp.
  ui.createMenu('Manager Menu')
      .addItem('Check Uploaded Sheets', 'usersSheetLinks')
      .addSeparator()
      .addItem('Pull External Sheets', 'openExternalSheets')
      .addToUi();
}

// Manager Constant
const getManagerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Manger Dashboard")
  
  
// Compiling Sheet Overview Constant 
const compiledDataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Main Sheet")

// userExternalSpreadSheet - Range and VALUES = Constant Declaration 
const userExternalSpreadSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("usersExternalSheets")
const range = userExternalSpreadSheet.getRange("A1:D10")
const  values = range.getValues()

// var externalSheetLinks = [] - Was used for checks

////---------------------------------------- External Sheet Upload Checker (Checks who uploaded their sheets and who didn't)----------------------------------------------------------------------- 
function usersSheetLinks() {

  for (let i = 0; i < values.length; i++) {

      
      // Those who have NOT uploaded their sheet will execute the following below      
      if(values[i][0] == '' && values[i][1] != ''){
        userExternalSpreadSheet.getRange(i+1, 3).setValue('FALSE')
        // userExternalSpreadSheet.getRange(i+1, 4).setValue(`${values[i][1]} did not upload the sheet yet.`)

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
        userExternalSpreadSheet.getRange(i+1, 3).setValue('TRUE')

        // push the external sheet to the array:

  
        // This is for the manager view ------------------------------------------
        getManagerSheet.getRange(i+2, 1).setBackground('#57cc99')
        getManagerSheet.getRange(i+2, 2).setBackground('#57cc99').setValue('TRUE')
        getManagerSheet.getRange(i+2, 3).setBackground('#57cc99').setValue(new Date())
        getManagerSheet.getRange(i+2, 4).setBackground('#57cc99').setValue(`${values[i][1]} has Completed`)
        //------------------------------------------ 
      }
      // externalSheetLinks.push(values[i][0]) - working pushing the URL's into the externalSheetLinks array
 
    // Logger.log(values[i][0])


    // Changing the state of the the checkbox to check of compiler
    getManagerSheet.getRange(10,2).setBackground('#57cc99').setValue('TRUE')
    getManagerSheet.getRange(10,3).setValue(new Date())

  }
  // Logger.log(numRows.length())
  // Logger.log(numRows)
  // Logger.log(numColumns)
  // openExternalSheets(externalSheetLinks) - Was a check to see it pulled throught to the next function - Worked - Not using


}
//---------------------------------------------------------------------------------------------------------------
//-------------------------------------- Open External Sheet --------------------------------------
function openExternalSheets(){

  var uploadUserChecker = getManagerSheet.getRange(10,2).getValue()

  if(uploadUserChecker == true) {

    var externalSharedSheetsList = []
    SOURCE_SHEET_NAMES = []
    SOURCE_RANGE = 'A1:D10'


    // This FOR LOOP is stricly to pull URL's 
    for (let i = 1; i < values.length; i++) {

      // Logger.log(values[i])
      if(values[i][2] == true && values[i][1] != '')  {
        externalSharedSheetsList.push(values[i][0])
        SOURCE_SHEET_NAMES.push(values[i][3])


        // confirms that we are pushing the correct names of users that uploaded their sheets
        // Logger.log(`You've made it:` +  values[i][1])


      } else if (values[i][2] == false && values[i][1] != '' && values[i][0] != '') {

        // Checks if we are at the end of the list where names were entered - With additional conditional checks.
        // Logger.log("you need to checkManagerCompiled his sheet") - working


      } else if (values[i][2] == false && values[i][1] != '' && values[i][0] == '') {

        // Checks which sheet was not uploaded and returns the name
        // Logger.log(`You're still missing user's sheet:` +  values[i][1]) - working 


      }

    }

    
    Logger.log(externalSharedSheetsList)
    Logger.log(SOURCE_SHEET_NAMES)


    for(let j = 0; j < SOURCE_SHEET_NAMES.length; j++) {
      var urlOpener = SpreadsheetApp.openByUrl(externalSharedSheetsList[j])
      var sheetNameOpener = urlOpener.getSheetByName(SOURCE_SHEET_NAMES[j])



      var fetchSheetContentValues = sheetNameOpener.getDataRange().getValues()
      Logger.log(fetchSheetContentValues)

      compiledDataSheet.appendRow(fetchSheetContentValues[0])

    }

  } else {
    var errorCheck = `Remember to check sheet and confirm uploads first`
    SpreadsheetApp.getUi().alert(`Source sheet "${errorCheck}" not found in the external URL.`);
    return
  }
}






























