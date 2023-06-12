import cx_Oracle
from numpy import mod, record
import pandas as pd
from datetime import date
import json
import dbConn
d=date.today()
import datetime

# def OutputTypeHandler(cursor, name, defaultType, size, precision, scale):
#     if defaultType == cx_Oracle.CLOB:
#         return cursor.var(cx_Oracle.LONG_STRING, arraysize=cursor.arraysize)
def remove(string):
    return string.replace("\u0000", "")

def reconDataImport(req):
    try:
        con = dbConn.psqlOracleconnection()
        # con.outputtypehandler = OutputTypeHandler

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'RECON_DATA_IMPORT':
                cur = con.cursor()
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                transaction_date = datetime.datetime.strptime(req.get("trandate"), '%Y-%m-%d')
                # recon_base_date = datetime.datetime.strptime(req.get("recon_base_date"), '%Y-%m-%d')
                # record = (cx_Oracle.CLOB)
                # record = 'Some test data' * 10000
                record = remove(req.get("record"))
                # cur.setinputsizes(HERP = cx_Oracle.CLOB)
                cur.callproc('pkg_recon_process.pr_recon_data_import', (req.get('recon_type_mst_id'), req.get('filename_mst_id'), transaction_date,req.get('file_name'),record,req.get('enter_user_id') ,req.get('enter_desc'),myvar,err))
                con.commit()
                data = myvar.getvalue().fetchall()
                if len(data) == 0:
                    data = {}
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                df['TEXT_1'] = df['TEXT_1'].apply(lambda x: x.read())
                json_list = json.loads(json.dumps(list(df.T.to_dict().values())))
                statusObj = {'status':'Sucess'}
                json_list.append(statusObj)
                # status = 'Sucess'
                # statusKey = 'status'
                # statusObj = {statusKey:status}
                resp = json.dumps(json_list)
                cur.close()
                con.close()
                return resp
                # if err.getvalue() == None:
                #     con.commit()
                #     status = 'Sucess'
                #     statusKey = 'status'
                #     statusObj = {statusKey:status} 
                # resp = json.dumps(statusObj)
                # print(resp)
                # cur.close()
                # con.close()
                # return resp
        except cx_Oracle.DatabaseError as er:
            error = err.getvalue() or er.args[0].message
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)
        except Exception as er:
            cur.close()
            con.close()
            error = err.getvalue() or er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)


def reconDataShow(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'RECON_DATA_SHOW':
                cur = con.cursor()
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                # fileUpload = cur.var(cx_Oracle.BLOB)
                transaction_date = datetime.datetime.strptime(req.get("trandate"), '%Y-%m-%d')
                # recon_base_date = datetime.datetime.strptime(req.get("recon_base_date"), '%Y-%m-%d')
                cur.callproc('Pkg_Recon_Process.Pr_Recon_Data_Show', (req.get('recon_type_mst_id'), req.get('filename_mst_id'), transaction_date,req.get('file_name'),req.get('enter_user_id') ,req.get('enter_desc'),myvar, err))
                con.commit() 
                data = myvar.getvalue().fetchall()
                if len(data) == 0:
                    data = {}
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                df['TEXT_1'] = df['TEXT_1'].apply(lambda x: x.read())
                json_list = json.loads(json.dumps(list(df.T.to_dict().values())))
                resp = json.dumps(json_list)
                cur.close()
                con.close()
                return resp
        except cx_Oracle.DatabaseError as er:
            error = err.getvalue() or er.args[0].message
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)
        except Exception as er:
            cur.close()
            con.close()
            error = err.getvalue() or er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)


def reconDataProcess(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'RECON_DATA_PROCESS':
                cur = con.cursor()
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                transaction_date = datetime.datetime.strptime(req.get("trandate"), '%Y-%m-%d')
                # recon_base_date = datetime.datetime.strptime(req.get("recon_base_date"), '%Y-%m-%d')
                cur.callproc('Pkg_Recon_Process.Pr_Recon_Data_Process', (
                req.get('recon_type_mst_id'), 
                req.get('filename_mst_id'), 
                transaction_date,
                req.get('file_name'),
                req.get('enter_user_id'),
                req.get('enter_desc'),
                req.get('fileid'),
                myvar,
                err
                ))
                con.commit() 
                data = myvar.getvalue().fetchall() 
                if len(data) == 0:
                    data = {}
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                json_list = json.loads(json.dumps(list(df.T.to_dict().values())))
                resp = json.dumps(json_list)
                print(resp)
                cur.close()
                con.close()
                return resp
        except cx_Oracle.DatabaseError as er:
            error = err.getvalue() or er.args[0].message
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)
        except Exception as er:
            cur.close()
            con.close()
            error = err.getvalue() or er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj) 


def reconDataUpdate(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'RECON_DATA_UPDATE':
                cur = con.cursor()
                err = cur.var(cx_Oracle.STRING)
                cur.callproc('Pkg_Recon_Process.Pr_Recon_Data_Update', (req.get('temp_mst_id'), req.get('flag'), req.get('enter_user_id') ,req.get('enter_desc'),err))
                con.commit() 
                if err.getvalue() == None:
                    con.commit()
                    status = 'Sucess'
                    statusKey = 'status'
                    statusObj = {statusKey:status} 
                resp = json.dumps(statusObj)
                cur.close()
                con.close()
                return resp
        except cx_Oracle.DatabaseError as er:
            error = err.getvalue() or er.args[0].message
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)
        except Exception as er:
            cur.close()
            con.close()
            error = err.getvalue() or er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)



def reconAutoDataShow(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'RECON_AUTO_DATA_SHOW':
                cur = con.cursor()
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                # fileUpload = cur.var(cx_Oracle.BLOB)
                trandate = datetime.datetime.strptime(req.get("trandate"), '%Y-%m-%d')
                fromdate = datetime.datetime.strptime(req.get("fromdate"), '%Y-%m-%d')
                upto_date = datetime.datetime.strptime(req.get("upto_date"), '%Y-%m-%d')
                cur.callproc('pkg_recon_process.pr_cbs_data_auto_upload', (
                req.get('recon_type_mst_id'), 
                req.get('file_format_type'), 
                trandate,
                fromdate,
                upto_date,
                req.get('enter_user_id'),
                req.get('enter_desc'),
                myvar, 
                err
                ))
                data = myvar.getvalue().fetchall()
                con.commit() 
                if len(data) == 0:
                    data = {}
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                for columName in df.columns:
                            if columName == 'TRANSACTION_DATE':
                                df['ATM_TRAN_DATE'] = df['ATM_TRAN_DATE'].astype(str)
                                df['VALUE_DATE'] = df['VALUE_DATE'].astype(str)
                                df['TRANSACTION_DATE'] = df['TRANSACTION_DATE'].astype(str)
                                df['CBS_DATE'] = df['CBS_DATE'].astype(str)
                                df['RECON_BASE_DATE'] = df['RECON_BASE_DATE'].astype(str)
                json_list = json.loads(json.dumps(list(df.T.to_dict().values())))
                resp = json.dumps(json_list)
                cur.close()
                con.close()
                return resp
        except cx_Oracle.DatabaseError as er:
            error = err.getvalue() or er.args[0].message
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)
        except Exception as er:
            cur.close()
            con.close()
            error = err.getvalue() or er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)



def reconBulkDataImport(req):
    try:
        con = dbConn.psqlOracleconnection()
        # con.outputtypehandler = OutputTypeHandler

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'RECON_BULK_DATA_IMPORT':
                cur = con.cursor()
                if req.get('fileid'):
                   fileid = req.get('fileid')
                else:
                    fileid = cur.var(cx_Oracle.STRING)
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)              
                trandate = datetime.datetime.strptime(req.get("trandate"), '%Y-%m-%d')
                record = remove(req.get("record"))
                cur.callproc('pkg_recon_process.pr_recon_bulk_data_import', (
                req.get('recon_type_mst_id'), 
                req.get('filename_mst_id'), 
                trandate,
                req.get('file_name'),
                record,
                req.get('enter_user_id') ,
                req.get('enter_desc'),
                fileid,
                myvar,
                err
                ))
                con.commit()
                data = myvar.getvalue().fetchall()
                if req.get('fileid'):
                    fileId =  fileid
                else:
                    fileId =  fileid.getvalue()    
                if len(data) == 0:
                    data = {}
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                df['TEXT_1'] = df['TEXT_1'].apply(lambda x: x.read())
                json_list = json.loads(json.dumps(list(df.T.to_dict().values())))
                statusObj = {'status':'Sucess', 'fileid':fileId}
                json_list.append(statusObj)
                resp = json.dumps(json_list)
                cur.close()
                con.close()
                return resp
        except cx_Oracle.DatabaseError as er:
            error = err.getvalue() or er.args[0].message
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)
        except Exception as er:
            cur.close()
            con.close()
            error = err.getvalue() or er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)


def reconBulkDataShow(req):
    try:
        con = dbConn.psqlOracleconnection()
        # con.outputtypehandler = OutputTypeHandler

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'RECON_BULK_DATA_SHOW':
                cur = con.cursor()
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                fileid = req.get('fileid')
                trandate = datetime.datetime.strptime(req.get("trandate"), '%Y-%m-%d')
                cur.callproc('pkg_recon_process.pr_recon_bulk_data_show', (
                req.get('recon_type_mst_id'), 
                req.get('filename_mst_id'), 
                trandate,
                req.get('file_name'),
                req.get('enter_user_id') ,
                req.get('enter_desc'),
                fileid,
                myvar,
                err
                ))
                data = myvar.getvalue().fetchall()
                con.commit()
                if len(data) == 0:
                    data = {}
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                df['TEXT_1'] = df['TEXT_1'].apply(lambda x: x.read())
                json_list = json.loads(json.dumps(list(df.T.to_dict().values())))
                # statusObj = {'status':'Sucess', 'cursor':json_list}
                # json_list.append(statusObj)
                resp = json.dumps(json_list)
                cur.close()
                con.close()
                return resp
        except cx_Oracle.DatabaseError as er:
            error = err.getvalue() or er.args[0].message
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)
        except Exception as er:
            cur.close()
            con.close()
            error = err.getvalue() or er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)



def reconBulkDataDelete(req):
    try:
        con = dbConn.psqlOracleconnection()
        # con.outputtypehandler = OutputTypeHandler

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'RECON_BULK_DATA_DELETE':
                cur = con.cursor()
                if req.get('fileid'):
                   fileid = req.get('fileid')
                else:
                    fileid = cur.var(cx_Oracle.STRING)
                err = cur.var(cx_Oracle.STRING)              
                trandate = datetime.datetime.strptime(req.get("trandate"), '%Y-%m-%d')
                # record = remove(req.get("record"))
                cur.callproc('pkg_recon_process.pr_recon_bulk_data_delete', (
                req.get('recon_type_mst_id'), 
                req.get('filename_mst_id'), 
                trandate,
                req.get('file_name'),
                req.get('enter_user_id') ,
                req.get('enter_desc'),
                fileid,
                err
                ))
                con.commit()
                if req.get('fileid'):
                    fileId =  fileid
                else:
                    fileId =  fileid.getvalue()    
                statusObj = {'status':'Sucess', 'fileid':fileId}
                resp = json.dumps(statusObj)
                cur.close()
                con.close()
                return resp
        except cx_Oracle.DatabaseError as er:
            error = err.getvalue() or er.args[0].message
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)
        except Exception as er:
            cur.close()
            con.close()
            error = err.getvalue() or er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)




def reconTempDelete(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'TEMP_DATA_DELETE':
                cur = con.cursor()
                err = cur.var(cx_Oracle.STRING)
                transaction_date = datetime.datetime.strptime(req.get("transaction_date"), '%Y-%m-%d')
                cur.callproc('pr_temp_del', (
                transaction_date,    
                req.get('transaction_time'), 
                req.get('request_from'),
                req.get('app_mode'),
                req.get('userid'),
                err
                ))
                con.commit() 
                moduleResp = dict()
                moduleResp['message'] = "SUCCESS"
                resp = json.dumps(moduleResp)
                cur.close()
                con.close()
                return resp
        except cx_Oracle.DatabaseError as er:
            error = err.getvalue() or er.args[0].message
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)
        except Exception as er:
            cur.close()
            con.close()
            error = err.getvalue() or er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)