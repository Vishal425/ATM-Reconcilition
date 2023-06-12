import cx_Oracle
import pandas as pd
import json
import dbConn
import datetime
from datetime import date
d=date.today()



def dashboardReport(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'DASHBOARD_REPORT':
                cur = con.cursor()
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                cur.callproc('pkg_recon_reports.pr_dashboard_report', (
                req.get('enter_user_id'),
                req.get('enter_desc'),    
                myvar,   
                err
                ))
                con.commit()
                data = myvar.getvalue().fetchall()
                if len(data) == 0:
                    data = {}
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                for columName in df.columns:
                    if columName == 'MIN_NON_RECON_DATE':
                        df['MIN_NON_RECON_DATE'] = df['MIN_NON_RECON_DATE'].astype(str)
                        df['MAX_NON_RECON_DATE'] = df['MAX_NON_RECON_DATE'].astype(str)
                        df['MIN_RECON_DATE'] = df['MIN_RECON_DATE'].astype(str)
                        df['MAX_RECON_DATE'] = df['MAX_RECON_DATE'].astype(str)           
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
            error = er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)


def reconReportsHeaders(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'REPORTS_HEADERS':
                cur = con.cursor()
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                transaction_date = datetime.datetime.strptime(req.get("transaction_date"), '%Y-%m-%d')
                cur.callproc('pr_report_header', (
                transaction_date,
                req.get('transaction_time'),
                req.get('request_from'),
                req.get('app_mode'),
                myvar,
                req.get('userid'),
                err
                ))
                con.commit()
                data = myvar.getvalue().fetchall()
                if len(data) == 0:
                    data = {}
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                for columName in df.columns:
                    if columName == 'BANK_LOGO':
                        df['BANK_LOGO'] = df['BANK_LOGO'].astype(str)        
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
            error = er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)


def reconReports(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'RECON_REPORTS':
                cur = con.cursor()
                err = cur.var(cx_Oracle.STRING)
                myvar = cur.var(cx_Oracle.CURSOR)
                # trandate = datetime.datetime.strptime(req.get("trandate"), '%Y-%m-%d')
                fromdate= datetime.datetime.strptime(req.get("fromdate"), '%Y-%m-%d')
                todate = datetime.datetime.strptime(req.get("todate"), '%Y-%m-%d')
                cur.callproc('Pkg_Recon_Reports.Pr_Reconcilation_report', (req.get('recon_type_mst_id'),d, fromdate, todate, req.get('enter_user_id'), req.get('enter_desc'), myvar,err))
                con.commit()
                data = myvar.getvalue().fetchall()
                if len(data) == 0:
                    data = {}
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
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



def rejectTransactionReport(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'REJECT_TRANSACTION_REPORT':
                cur = con.cursor()
                err = cur.var(cx_Oracle.STRING)
                myvar = cur.var(cx_Oracle.CURSOR)
                fromdate= datetime.datetime.strptime(req.get("fromdate"), '%Y-%m-%d')
                todate = datetime.datetime.strptime(req.get("todate"), '%Y-%m-%d')
                cur.callproc('pkg_recon_reports.pr_rejected_transaction_report', (
                req.get('filename_mst_id'),
                fromdate, 
                todate, 
                req.get('enter_user_id'), 
                req.get('enter_desc'), 
                myvar,
                err
                ))
                con.commit()
                data = myvar.getvalue().fetchall()
                if len(data) == 0:
                    data = {}
                    errorKey = 'error'
                    errorObj = {errorKey:'No Record Found'}
                    return json.dumps(errorObj)
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                for columName in df.columns:
                    if columName == 'RECON_BASE_DATE':
                        df['RECON_BASE_DATE'] = df['RECON_BASE_DATE'].astype(str)
                        df['ATM_TRAN_DATE'] = df['ATM_TRAN_DATE'].astype(str)
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


def reconNonReport(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'RECON_NONRECON_REPORT':
                cur = con.cursor()
                err = cur.var(cx_Oracle.STRING)
                myvar = cur.var(cx_Oracle.CURSOR)
                # trandate = datetime.datetime.strptime(req.get("trandate"), '%Y-%m-%d')
                fromdate= datetime.datetime.strptime(req.get("fromdate"), '%Y-%m-%d')
                todate = datetime.datetime.strptime(req.get("todate"), '%Y-%m-%d')
                cur.callproc('pkg_recon_reports.pr_recon_nonrecon_report', (
                req.get('recon_type_mst_id'),    
                req.get('recon_flag'),
                req.get('file_format_type'),
                fromdate, 
                todate, 
                req.get('summery_detail_flag'), 
                req.get('enter_user_id'), 
                req.get('enter_desc'), 
                myvar,
                err
                ))
                con.commit()
                data = myvar.getvalue().fetchall()
                if len(data) == 0:
                    data = {}
                    errorKey = 'error'
                    errorObj = {errorKey:'No Record Found'}
                    return json.dumps(errorObj)
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                for columName in df.columns:
                    if columName == 'RECON_BASE_DATE':
                        df['RECON_BASE_DATE'] = df['RECON_BASE_DATE'].astype(str)
                        df['ATM_TRAN_DATE'] = df['ATM_TRAN_DATE'].astype(str)
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


def rrnAllrecordReport(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'RRN_ALLRECORD_REPORT':
                cur = con.cursor()
                err = cur.var(cx_Oracle.STRING)
                myvar = cur.var(cx_Oracle.CURSOR)
                cur.callproc('pkg_recon_reports.pr_rrn_allrecord_report', (
                req.get('rrn_number'),
                req.get('enter_user_id'), 
                req.get('enter_desc'), 
                myvar,
                err
                ))
                con.commit()
                data = myvar.getvalue().fetchall()
                if len(data) == 0:
                    data = {}
                    errorKey = 'error'
                    errorObj = {errorKey:'No Record Found'}
                    return json.dumps(errorObj)
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                for columName in df.columns:
                    if columName == 'RECON_BASE_DATE':
                        df['RECON_BASE_DATE'] = df['RECON_BASE_DATE'].astype(str)
                        df['ATM_TRAN_DATE'] = df['ATM_TRAN_DATE'].astype(str)
                        df['RECON_DATE'] = df['RECON_DATE'].astype(str)
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



def recentLoadedFileRpt(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'RECENT_LOADED_FILE_REPORT':
                cur = con.cursor()
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                cur.callproc('pkg_recon_reports.pr_recent_loded_file_rpt', (
                req.get('filename_mst_id'),
                req.get('enter_user_id'),
                req.get('enter_desc'),    
                myvar,   
                err
                ))
                con.commit()
                data = myvar.getvalue().fetchall()
                if len(data) == 0:
                    data = {}
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                for columName in df.columns:
                    if columName == 'MAX_RECON_DATE':
                        df['MAX_RECON_DATE'] = df['MAX_RECON_DATE'].astype(str)       
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
            error = er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)




def ej_log_details(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'EJ_LOG_DETAILS':
                cur = con.cursor()
                err = cur.var(cx_Oracle.STRING)
                myvar = cur.var(cx_Oracle.CURSOR)
                trandate = datetime.datetime.strptime(req.get("trandate"), '%Y-%m-%d')
                fromdate= datetime.datetime.strptime(req.get("fromdate"), '%Y-%m-%d')
                upto_date  = datetime.datetime.strptime(req.get("upto_date"), '%Y-%m-%d')
                cur.callproc('pkg_recon_reports.pr_ej_log_details_rpt', (
                req.get('filename_mst_id'),
                trandate, 
                fromdate, 
                upto_date , 
                req.get('enter_user_id'),
                req.get('enter_desc'), 
                myvar,
                err))
                con.commit()
                data = myvar.getvalue().fetchall()
                if len(data) == 0:
                    data = {}
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
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
