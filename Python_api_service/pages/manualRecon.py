import cx_Oracle
import pandas as pd
# from datetime import date
import json
import dbConn
import datetime
# d=date.today()


def manualReconDataShow(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'MANUAL_RECON_DATA_SHOW':
                cur = con.cursor()
                err = cur.var(cx_Oracle.STRING)
                cbs_cursor = cur.var(cx_Oracle.CURSOR)
                switch_cursor = cur.var(cx_Oracle.CURSOR)
                npci_cursor = cur.var(cx_Oracle.CURSOR)
                ej_cursor = cur.var(cx_Oracle.CURSOR)
                cursor_position = cur.var(cx_Oracle.STRING)
                reconway = cur.var(cx_Oracle.STRING)
                trandate = datetime.datetime.strptime(req.get("trandate"), '%Y-%m-%d')
                recon_base_date = datetime.datetime.strptime(req.get("recon_base_date"), '%Y-%m-%d')
                cur.callproc('Pkg_Recon_Process.Pr_Manual_Recon_Data_Show', (trandate, recon_base_date, req.get('recon_type_mst_id'),req.get('filename_mst_id'),req.get('enter_user_id') ,req.get('enter_desc'),cursor_position, cbs_cursor,switch_cursor,npci_cursor, ej_cursor,reconway, err))
                con.commit()
                cursorPosition = cursor_position.getvalue()
                reconWay = reconway.getvalue()
                if cursorPosition[0] == '1':
                    cbsCursor = cbs_cursor.getvalue().fetchall()
                    cbsObject = pd.DataFrame(cbsCursor, columns=[i[0] for i in cbs_cursor.getvalue().description])
                    for columName in cbsObject.columns:
                        if columName == 'RECON_BASE_DATE' or columName == 'TRANSACTION_DATE' or columName == 'ATM_TRAN_DATE' or columName == 'VALUE_DATE' or columName == 'SYS_DATE' or columName == 'CBS_DATE':
                            cbsObject['ATM_TRAN_DATE'] = cbsObject['ATM_TRAN_DATE'].astype(str)
                            cbs_list = json.loads(json.dumps(list(cbsObject.T.to_dict().values())))
                else:
                    cbs_list = []
                if cursorPosition[2] == '1':
                    switchCursor = switch_cursor.getvalue().fetchall()
                    switchObject = pd.DataFrame(switchCursor, columns=[i[0] for i in switch_cursor.getvalue().description])
                    for columName in switchObject.columns:
                        if columName == 'ATM_TRAN_DATE':
                            switchObject['ATM_TRAN_DATE'] = switchObject['ATM_TRAN_DATE'].astype(str)
                            switch_list = json.loads(json.dumps(list(switchObject.T.to_dict().values())))
                else:
                    switch_list = []

                if cursorPosition[4] == '1':
                    npciCursor = npci_cursor.getvalue().fetchall()
                    npciObject = pd.DataFrame(npciCursor, columns=[i[0] for i in npci_cursor.getvalue().description])
                    for columName in  npciObject.columns:
                        if columName == 'ATM_TRAN_DATE':
                            npciObject['ATM_TRAN_DATE'] = npciObject['ATM_TRAN_DATE'].astype(str)
                            npci_list = json.loads(json.dumps(list(npciObject.T.to_dict().values())))
                else:
                    npci_list = []

                if cursorPosition[6] == '1':
                    ejCursor =  ej_cursor.getvalue().fetchall()
                    ejObject  = pd.DataFrame(ejCursor, columns=[i[0] for i in ej_cursor.getvalue().description])
                    for columName in   ejObject.columns:
                        if columName == 'ATM_TRAN_DATE':
                            ejObject['ATM_TRAN_DATE'] =  ejObject['ATM_TRAN_DATE'].astype(str)
                            ej_list = json.loads(json.dumps(list(ejObject.T.to_dict().values())))
                else:
                    ej_list = []
                                  
                moduleResp = dict()
                moduleResp['reconWay'] = reconWay
                moduleResp['cbs_cursor'] = cbs_list
                moduleResp['switch_cursor'] = switch_list
                moduleResp['npci_cursor'] = npci_list
                moduleResp['ej_cursor'] = ej_list
                moduleResp['cursorPosition'] =  cursorPosition
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



def manualReconDataProcess(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'MANUAL_RECON_DATA_PROCESS':
                cur = con.cursor()
                err = cur.var(cx_Oracle.STRING)
                myvar = cur.var(cx_Oracle.CURSOR)
                trandate = datetime.datetime.strptime(req.get("trandate"), '%Y-%m-%d')
                recon_base_date = datetime.datetime.strptime(req.get("recon_base_date"), '%Y-%m-%d')
                cur.callproc('Pkg_Recon_Process.Pr_Manually_Recon', (trandate, recon_base_date, req.get('recon_det_id'),req.get('flag'),req.get('enter_user_id') ,req.get('enter_desc'),myvar,err))
                con.commit()
                data = myvar.getvalue().fetchall()
                if len(data) == 0:
                    data = {}
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                # df.isnull()
                for columName in df.columns:
                    if columName == 'RECON_BASE_DATE':
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



def autoReconDataProcess(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'AUTO_RECON_PROCESS':
                cur = con.cursor()
                err = cur.var(cx_Oracle.STRING)
                myvar = cur.var(cx_Oracle.CURSOR)
                trandate = datetime.datetime.strptime(req.get("trandate"), '%Y-%m-%d')
                recon_base_date = datetime.datetime.strptime(req.get("recon_base_date"), '%Y-%m-%d')
                reconway = cur.var(cx_Oracle.STRING)
                cur.callproc('pkg_recon_process.pr_auto_recon_process', (trandate, recon_base_date, req.get('recon_type_mst_id'),req.get('file_format_type'),req.get("file_type"),req.get('enter_user_id') ,req.get('enter_desc'),reconway,myvar,err))
                con.commit()
                data = myvar.getvalue().fetchall()
                reconWay = reconway.getvalue()
                if len(data) == 0:
                    data = {}
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                # for columName in df.columns:
                #     if columName == 'RECON_BASE_DATE':
                #         df['RECON_BASE_DATE'] = df['RECON_BASE_DATE'].astype(str)        
                json_list = json.loads(json.dumps(list(df.T.to_dict().values())))
                moduleResp = dict()
                moduleResp['reconWay'] = reconWay
                moduleResp['cursor'] = json_list
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

