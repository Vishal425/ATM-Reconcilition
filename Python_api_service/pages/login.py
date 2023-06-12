
import cx_Oracle
from numpy import mod
import pandas as pd
from datetime import date
import json
import dbConn
d=date.today()


def registerDeviceInfo(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'REGISTER_DEVICE':
                cur = con.cursor()
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                Reg_Dev_Det_Id = cur.var(int)
                cur.callproc('Pr_Register_Device', (req.get("opflag"),d,
            # req.get("transaction_date"),
                req.get("transaction_time"),
                req.get("request_from"),
                req.get("app_mode"),
                req.get("transaction_key"),
                Reg_Dev_Det_Id,
                # req.get("Reg_Dev_Det_Id"),   
                req.get("device_type"),
                req.get("mac_device_id"),
                req.get("mac_device_name"),
                req.get("machin_ip_add"),
                req.get("check_ip_flag"),
                d,
                # req.get("operation_date"),
                req.get("enter_user_id"),
                req.get("enter_desc"), 
                err,myvar))
                con.commit()
                data =  Reg_Dev_Det_Id.getvalue()
                con.commit()
                mstKey = 'Reg_Dev_Det_Id'
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
            error = er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)

def checkDeviceInfo(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'CHECK_DEVICE':
                cur = con.cursor()
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                cur.callproc('pr_check_device', (d, req.get('transaction_time'), req.get('request_from'), req.get('app_mode'),req.get('device_type'),req.get('mac_device_id'),req.get('mac_device_name'),req.get('machin_ip_add') ,err, myvar))
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
            error = er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)


def checkLogin(req):
    try:
       
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
            error = er.args[0].message
            errorKey = 'error'
            errorObj = {errorKey:error}
            errorArray = [errorObj] 
            return json.dumps(errorArray)

    else:
        try:
            if req.get("keyword") == 'CHECK_LOGIN':
                cur = con.cursor()
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                cur.callproc('pr_check_login', (d, req.get('transaction_time'), req.get('request_from'), req.get('app_mode'),req.get('device_type'),req.get('device_id'),req.get('user_type'),req.get('login_type'),req.get('login_code'),req.get('login_pass') ,err, myvar))
                con.commit()
                data = myvar.getvalue().fetchall() 
                if len(data) == 0:
                    data = {}
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                dfs_query='Select u.current_password From User_Master u Where u.Userid = 1'
                dfs=pd.read_sql_query(dfs_query,con)
                df['CURRENT_PASSWORD'] = dfs['CURRENT_PASSWORD']
                df['WORKING_DATE'] = df['WORKING_DATE'].astype(str)
                json_list = json.loads(json.dumps(list(df.T.to_dict().values())))
                json_list[0]['token'] = req.get("token")
                resp = json.dumps(json_list)
                cur.close()
                con.close()
                return resp

        except cx_Oracle.DatabaseError as er:
            error = err.getvalue() or er.args[0].message
            errorKey = 'error'
            errorObj = {errorKey:error}
            errorArray = [errorObj] 
            return json.dumps(errorArray)
            # return json.dumps('There is an error in the database' + err.getvalue())

        except Exception as er:
            cur.close()
            con.close()
            error = er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)


def  getLoginInfo(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'GET_LOGIN':
                cur = con.cursor()
                login_data = cur.var(cx_Oracle.CURSOR)
                module = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                cur.callproc('pr_login_data', (d, req.get('transaction_time'), req.get('request_from'), req.get('app_mode'),req.get('transaction_key'),req.get('user_id'),err,login_data,module))
                data = login_data.getvalue().fetchall() 
                moduleObj = module.getvalue().fetchall()
                con.commit()
                if len(moduleObj) == 0:
                    moduleObj = {}
                if len(data) == 0:
                    data = {}
                df = pd.DataFrame(data, columns=[i[0] for i in login_data.getvalue().description])
                objModule = pd.DataFrame(moduleObj, columns=[i[0] for i in module.getvalue().description])
                json_list = json.loads(json.dumps(list(df.T.to_dict().values())))
                json_moduleList = json.loads(json.dumps(list(objModule.T.to_dict().values())))
                moduleResp = dict()
                moduleResp['login_data'] = json_list
                moduleResp['module'] = json_moduleList
                # moduleResp = json_list + json_moduleList
                resp = json.dumps(moduleResp)
                cur.close()
                con.close()
                return resp

        except cx_Oracle.DatabaseError as er:
            error = err.getvalue() or er.args[0].message
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)
            # return json.dumps('There is an error in the database' + err.getvalue())

        except Exception as er:
            cur.close()
            con.close()
            error = er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)            

def checkPassword(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'CHECK_PASSWORD':
                cur = con.cursor()
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                cur.callproc('pr_check_device', (d, req.get('transaction_time'), req.get('request_from'), req.get('app_mode'),req.get('device_type'),req.get('user_type'),req.get('login_type'),req.get('login_code') ,err, myvar))
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
            # return json.dumps('There is an error in the database ' + err.getvalue())

        except Exception as er:
            cur.close()
            con.close()
            error = er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)



def logout(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'LOGOUT':
                cur = con.cursor()
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                message = cur.var(cx_Oracle.STRING)
                cur.callproc('pr_logout_user', (d, req.get('transaction_time'), req.get('request_from'), req.get('app_mode'),req.get('transaction_key'),req.get('user_id'),err,message, myvar))
                con.commit()
                # data = myvar.getvalue().fetchall()
                mess = message.getvalue() 
                # if len(data) == 0:
                #     data = {}
                # df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                # json_list = json.loads(json.dumps(list(df.T.to_dict().values())))
                moduleResp = dict()
                moduleResp['message'] = mess
                resp = json.dumps(moduleResp)
                cur.close()
                con.close()
                return resp

        except cx_Oracle.DatabaseError as er:
            error = err.getvalue() or er.args[0].message
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)
            # return json.dumps('There is an error in the database' + err.getvalue())

        except Exception as er:
            cur.close()
            con.close()
            error = er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)



def passwordCheck(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            mess = None
            if req.get("keyword") == 'PASSWORD_CHECK':
                cur = con.cursor()
                # mess = cur.callfunc('fn_password_check', (req.get('user_code'),req.get('password')))
                mess = cur.callfunc("fn_password_check", int, [req.get('user_code'),req.get('password')])
                # mess = cur.callfunc('fn_password_check', (req.get('user_code'),req.get('password')))
                con.commit()
                if mess == 0:
                    moduleResp = dict()
                    moduleResp['error'] = mess
                    resp = json.dumps(moduleResp)
                    cur.close()
                    con.close()
                    return resp
                moduleResp = dict()
                moduleResp['user_id'] = mess
                resp = json.dumps(moduleResp)
                cur.close()
                con.close()
                return resp    

        except cx_Oracle.DatabaseError as er:
            error =  er.args[0].message
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


def changePassword(req):
    try:
       
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
            error = er.args[0].message
            errorKey = 'error'
            errorObj = {errorKey:error}
            errorArray = [errorObj] 
            return json.dumps(errorArray)

    else:
        try:
            if req.get("keyword") == 'CHANGE_PASSWORD':
                cur = con.cursor()
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                cur.callproc('Pr_Reset_Password', (req.get('user_id'), req.get('txtPassword'), req.get('newpasswd'),d, req.get('transaction_time'), req.get('request_from'), req.get('app_mode'),err))
                con.commit()
                data = err.getvalue() 
                # if len(data) == 0:
                #     data = {}
                # df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                # df['WORKING_DATE'] = df['WORKING_DATE'].astype(str)
                # json_list = json.loads(json.dumps(list(df.T.to_dict().values())))
                # json_list[0]['token'] = req.get("token")
                resp = json.dumps(data)
                print('change password :',resp)
                cur.close()
                con.close()
                return resp

        except cx_Oracle.DatabaseError as er:
            error = err.getvalue() or er.args[0].message
            errorKey = 'error'
            errorObj = {errorKey:error}
            errorArray = [errorObj] 
            return json.dumps(errorArray)
            # return json.dumps('There is an error in the database' + err.getvalue())

        except Exception as er:
            cur.close()
            con.close()
            error = er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)








        

