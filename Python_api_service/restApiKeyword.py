# File Name : respApiKeyword
# Create Date : 23/07/2021
# Create By : Manish Waghmare
# procedure_name_list and get procedure keyword wise.

import re
from flask import Flask,jsonify,request
from pages.login import checkLogin,checkDeviceInfo,checkPassword, getLoginInfo,registerDeviceInfo,logout, passwordCheck,changePassword
from pages.menuMaster import getMenuData,menuInfo,helpData
from pages.recon import bankInfoMaster,reconFileConfig,reconFileNameFormat,reconTypeMaster,globalParameter,userInfoMaster,getatmunPostedRec,atmunPostedTransaction, atmRecordRejected,reconFlagUpdate
from pages.fileUploadRecon import reconDataImport,reconDataShow,reconDataProcess,reconDataUpdate, reconAutoDataShow,reconBulkDataImport, reconBulkDataShow,reconBulkDataDelete,reconTempDelete
from pages.manualRecon import manualReconDataShow,manualReconDataProcess,autoReconDataProcess
from pages.reconReport import reconReports,reconReportsHeaders,rejectTransactionReport,reconNonReport,rrnAllrecordReport,dashboardReport,recentLoadedFileRpt,ej_log_details

def procedure_name_list(argument):
   if argument.get('keyword') == 'CHECK_LOGIN':
      loginCheck = checkLogin(request.json)
      return loginCheck
   elif argument.get('keyword') == 'CHANGE_PASSWORD':
      changepwd = changePassword(request.json)
      return changepwd
   elif argument.get('keyword') == 'GET_MENU':
      getMenu = getMenuData(request.json)
      return getMenu      
   elif argument.get('keyword') == 'USER_MASTER':
      userMaster = userInfoMaster(request.json)
      return userMaster
   elif argument.get('keyword') == 'HELP':
      helpMaster = helpData(request.json)
      return helpMaster
   elif argument.get('keyword') == 'MANUAL_RECON_DATA_SHOW':
      manualReconShow = manualReconDataShow(request.json)
      return manualReconShow 
   elif argument.get('keyword') == 'MANUAL_RECON_DATA_PROCESS':
      manualReconProcess = manualReconDataProcess(request.json)
      return manualReconProcess
   elif argument.get('keyword') == 'AUTO_RECON_PROCESS':
      autoReconProcess = autoReconDataProcess(request.json)
      return autoReconProcess
   elif argument.get('keyword') == 'RECON_DATA_IMPORT':
      autoReconDataImport = reconDataImport(request.json)
      return autoReconDataImport
   elif argument.get('keyword') == 'RECON_DATA_PROCESS':
      reconprocessData = reconDataProcess(request.json)
      return reconprocessData
   elif argument.get('keyword') == 'RECON_DATA_UPDATE':
      reconDataUpdates = reconDataUpdate(request.json)
      return reconDataUpdates
   elif argument.get('keyword') == 'RECON_REPORTS':
      reconDataReports = reconReports(request.json)
      return reconDataReports
   elif argument.get('keyword') == 'BANK_INFO':
      reconBankInfo = bankInfoMaster(request.json)
      return reconBankInfo
   elif argument.get('keyword') == 'RECON_FILE_CONFIG':
      reconfile = reconFileConfig(request.json)
      return reconfile
   elif argument.get('keyword') == 'RECON_FILENAME_FORMAT':
      reconfileformat = reconFileNameFormat(request.json)
      return reconfileformat
   elif argument.get('keyword') == 'RECON_TYPE_MASTER':
      recontypemaster = reconTypeMaster(request.json)
      return recontypemaster
   elif argument.get('keyword') == 'GLOBAL_PARAMETERS_MASTER':
      globalmaster = globalParameter(request.json)
      return globalmaster
   elif argument.get('keyword') == 'GET_LOGIN':
      loginGet = getLoginInfo(request.json)
      return loginGet 
   elif argument.get('keyword') == 'REGISTER_DEVICE':
      registerdevice = registerDeviceInfo(request.json)
      return registerdevice 
   elif argument.get('keyword') == 'MENU_MASTER':
      menuMasterInfo = menuInfo(request.json)
      return menuMasterInfo 
   elif argument.get('keyword') == 'CHECK_DEVICE':
      checkdevice = checkDeviceInfo(request.json)
      return checkdevice 
   elif argument.get('keyword') == 'CHECK_PASSWORD':
      checkdevice = checkPassword(request.json)
      return checkdevice                           
   elif argument.get('keyword') == 'LOGOUT':
      logoutUser = logout(argument)
      return logoutUser
   elif argument.get('keyword') == 'REPORTS_HEADERS':
      reportHeadersInfo = reconReportsHeaders(request.json)
      return reportHeadersInfo
   elif argument.get('keyword') == 'GET_ATM_UNPOSTED_RECON':
      getatmunPosted = getatmunPostedRec(request.json)
      return getatmunPosted
   elif argument.get('keyword') == 'ATM_UNPOSTED_TRANSACTION':
      atmTran = atmunPostedTransaction(request.json)
      return atmTran
   elif argument.get('keyword') == 'RECORD_REJECTED':
      atmRecRej = atmRecordRejected(request.json)
      return atmRecRej 
   elif argument.get('keyword') == 'REJECT_TRANSACTION_REPORT':
      rejecTrans = rejectTransactionReport(request.json)
      return rejecTrans
   elif argument.get('keyword') == 'RECON_NONRECON_REPORT':
      recon_nonrecon_report = reconNonReport(request.json)
      return recon_nonrecon_report
   elif argument.get('keyword') == 'RRN_ALLRECORD_REPORT':
      rrn_nonrecon_report = rrnAllrecordReport(request.json)
      return rrn_nonrecon_report
   elif argument.get('keyword') == 'RECON_AUTO_DATA_SHOW':
      reconAutoShow = reconAutoDataShow(request.json)
      return reconAutoShow
   elif argument.get('keyword') == 'RECON_BULK_DATA_IMPORT':
      reconbulkImport = reconBulkDataImport(request.json)
      return reconbulkImport
   elif argument.get('keyword') == 'RECON_BULK_DATA_SHOW':
      reconbulk = reconBulkDataShow(request.json)
      return reconbulk
   elif argument.get('keyword') == 'RECON_BULK_DATA_DELETE':
      reconbulkdelete = reconBulkDataDelete(request.json)
      return reconbulkdelete
   elif argument.get('keyword') == 'PASSWORD_CHECK':
      passwordcheck = passwordCheck(request.json)
      return passwordcheck
   elif argument.get('keyword') == 'TEMP_DATA_DELETE':
      deleteTemp = reconTempDelete(request.json)
      return deleteTemp
   elif argument.get('keyword') == 'RECON_FLAG_UPDATE':
      reconflagupdate = reconFlagUpdate(request.json)
      return reconflagupdate
   elif argument.get('keyword') == 'DASHBOARD_REPORT':
      dashboardReportShow = dashboardReport(request.json)
      return dashboardReportShow
   elif argument.get('keyword') == 'RECENT_LOADED_FILE_REPORT':
      recentfilereport = recentLoadedFileRpt(request.json)
      return recentfilereport
   elif argument.get('keyword') == 'EJ_LOG_DETAILS':
      ejlogDetails = ej_log_details(request.json)
      return ejlogDetails                                                  
   else:
      return '{"error":"Something Went Wrong"}'   


   