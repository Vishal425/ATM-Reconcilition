import cx_Oracle
import pandas as pd
from datetime import date
import json
import dbConn
from flask import Flask,request, make_response, jsonify
d=date.today()


def getMenuData(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'GET_MENU':
                cur = con.cursor()
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                Bank_Logo = cur.var(cx_Oracle.STRING)
                cur.callproc('pr_get_menu', (d, req.get('transaction_time'), req.get('request_from'), req.get('app_mode'),req.get('transaction_key'),req.get('module_id'),req.get('user_id') ,err, myvar,Bank_Logo))
                con.commit()
                data = myvar.getvalue().fetchall()
                bank_logo = Bank_Logo.getvalue() 
                if len(data) == 0:
                    data = {}
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                json_list = json.loads(json.dumps(list(df.T.to_dict().values())))
                json_list.append({'BANK_LOGO':'data:image/png;base64,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'})
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


def menuInfo(req):
    try:
        # con = cx_Oracle.connect(user="atm_recon", password="atm_recon",dsn="192.168.1.91/testdb")
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'MENU_MASTER':
                cur = con.cursor()
                if req.get("opflag") == 'N':
                    mstId = cur.var(int)
                else:
                    mstId =  req.get("menu_mst_id"),
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                cur.callproc('pr_menu_master', (
                req.get("opflag"),
                req.get("request_from"),
                req.get("app_mode"),
                d,
                # req.get("transaction_date"),
                req.get("transaction_time"),
                d,
                # req.get("appli_from_date"),
                req.get("transaction_key"),
                req.get("device_details"),
                mstId,
                req.get("caption_name"),
                req.get("parent_menu_mst_id"),
                req.get("print_position"),
                req.get("page_name"),
                req.get("parameters"),
                req.get("visible_flag"),
                req.get("bank_type"),
                req.get("caption_name_ol"),
                req.get("menu_desc"),
                req.get("menu_desc_ol"),
                req.get("hot_key"),
                req.get("menu_type"),
                req.get("visible_after_cb_over"),
                req.get("remarks"),
                req.get("module_mst_id"),
                req.get("password_required"),
                req.get("help_page_name"),
                req.get("user_level_mst_id"),
                req.get("branch_type_id"),
                req.get("enter_user_id"),
                req.get("enter_desc"),
                req.get("batch_type"),
                req.get("show_menu_screen_flag"),
                req.get("menu_app_mode"),
                err, 
                myvar))
                if req.get("opflag") == 'V':
                    data = myvar.getvalue().fetchall()
                    con.commit() 
                    if len(data) == 0:
                        data = {}
                    df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                    json_list = list(df.T.to_dict().values())
                    resp = json_list[0]
                    cur.close()
                    con.close()
                    return resp
                elif req.get("opflag") == 'N':   
                    data = mstId.getvalue()
                    con.commit()
                    mstKey = 'menu_mst_id'
                    mstObj = {mstKey:data}
                    resp = json.dumps(mstObj)
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



def helpData(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'HELP':
                cur = con.cursor()
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                cur.callproc('pr_help_data', (
                d,
                req.get("transaction_time"),    
                req.get("request_from"),
                req.get("app_mode"),
                req.get("transaction_key"),
                req.get("help_keyword"),
                req.get("help_param"),
                req.get("enter_user_id"),
                req.get("enter_desc"),
                err,
                myvar))
                con.commit() 
                data = myvar.getvalue().fetchall()
                if len(data) == 0:
                    data = {}
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                for columName in df.columns:
                    if columName == 'TRANSACTION_DATE':
                        df['TRANSACTION_DATE'] = df['TRANSACTION_DATE'].astype(str)
                        json_list = json.loads(json.dumps(list(df.T.to_dict().values())))
                        resp = json.dumps(json_list)
                        cur.close()
                        con.close()
                        return resp
                else:
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









