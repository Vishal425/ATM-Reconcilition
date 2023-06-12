import cx_Oracle
import pandas as pd
from datetime import date
import json
import dbConn
d=date.today()
import datetime
# from clsEnDec import encryptCSharpText,decryptCSharp

def userInfoMaster(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'USER_MASTER':
                cur = con.cursor()
                if req.get("opflag") == 'N':
                    mstId = cur.var(int)
                    user_code = cur.var(cx_Oracle.STRING)
                    # current_password = req.get("current_password")
                    # current_pwd_slt = req.get("current_pwd_slt")
                    # short_password = req.get("short_password")
                    # short_pwd_slt =  req.get("short_pwd_slt")
                elif req.get("opflag") == 'M':
                    mstId =  int(req.get("userid"))
                    user_code = req.get("user_code")    
                else:
                    mstId =  req.get("userid")
                    user_code = req.get("user_code")
                    # current_password = None
                    # current_pwd_slt = None
                    # short_password = None
                    # short_pwd_slt = None 
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                # transaction_date = d
                # appli_from_date = d
                # pass_change_date = d
                # pin_change_date = d
                # creation_date = d
                # expiry_date = d
                # status_from_date = d
                # status_upto_date = d
                transaction_date = datetime.datetime.strptime(req.get("transaction_date"), '%Y-%m-%d')
                appli_from_date = datetime.datetime.strptime(req.get("appli_from_date"), '%Y-%m-%d')
                pass_change_date = datetime.datetime.strptime(req.get("pass_change_date"), '%Y-%m-%d')
                pin_change_date = datetime.datetime.strptime(req.get("pin_change_date"), '%Y-%m-%d')
                creation_date = datetime.datetime.strptime(req.get("creation_date"), '%Y-%m-%d')
                expiry_date = datetime.datetime.strptime(req.get("expiry_date"), '%Y-%m-%d')
                status_from_date = d or datetime.datetime.strftime(req.get("status_from_date"),'%Y-%m-%d')
                status_upto_date = d or datetime.datetime.strftime(req.get("status_upto_date"),'%Y-%m-%d')
                cur.callproc('pr_user_master', (
                req.get("opflag"),
                req.get("request_from"),
                req.get("app_mode"),
                transaction_date,
                req.get("transaction_time"),
                appli_from_date,
                req.get("transaction_key"),
                mstId,
                user_code,
                # req.get("userid"),
                # req.get("user_code"),
                req.get("user_type"),
                req.get("user_short_name"),
                req.get("user_short_name_ol"),
                req.get("login_name"),
                req.get("user_level_mst_id"),
                req.get("current_password"),
                req.get("current_pwd_slt"),
                req.get("short_password"),
                req.get("short_pwd_slt"),
                req.get("mpin"),
                req.get("mpin_slt"),
                req.get("tpin"),
                req.get("tpin_slt"),
                req.get("user_language_id"),
                pass_change_date,
                pin_change_date,
                creation_date,
                expiry_date,
                req.get("status"),
                status_from_date,
                status_upto_date,
                req.get("user_inact_reason"),
                req.get("first_login_attemp"),
                req.get("enter_user_id"),
                req.get("enter_desc"),
                err,
                myvar))
                con.commit()
                if req.get("opflag") == 'V':
                    data = myvar.getvalue().fetchall() 
                    if len(data) == 0:
                        data = {}
                    df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                    for columName in df.columns:
                        if columName == 'TRANSACTION_DATE' or columName == 'SYS_DATE' or columName == 'OPERATION_DATE':
                            df['TRANSACTION_DATE'] = df['TRANSACTION_DATE'].astype(str)
                            df['SYS_DATE'] = df['SYS_DATE'].astype(str)
                            df['PASS_CHANGE_DATE'] = df['PASS_CHANGE_DATE'].astype(str)
                            df['PIN_CHANGE_DATE'] = df['PIN_CHANGE_DATE'].astype(str)
                            df['CREATION_DATE'] = df['CREATION_DATE'].astype(str)
                            df['EXPIRY_DATE'] = df['EXPIRY_DATE'].astype(str)
                            df['STATUS_FROM_DATE'] = df['STATUS_FROM_DATE'].astype(str)
                            df['STATUS_UPTO_DATE'] = df['STATUS_UPTO_DATE'].astype(str)
                            df['OPERATION_DATE'] = pd.DataFrame(data=df['OPERATION_DATE'].astype(str))
                            json_list = list(df.T.to_dict().values())
                            resp = json.dumps(json_list[0])
                            cur.close()
                            con.close()
                            return resp
                elif req.get("opflag") == 'N':   
                    data = mstId.getvalue()
                    if data:
                        mstKey = 'userid'
                        mstObj = {mstKey:data}
                        resp = json.dumps(mstObj)
                        cur.close()
                        con.close()
                        return resp
                    else:
                        error = err.getvalue()
                        errorKey = 'error'
                        errorObj = {errorKey:error}
                        return json.dumps(errorObj)    
                elif req.get("opflag") == 'M':
                    if err.getvalue():
                        error = err.getvalue()
                        errorKey = 'error'
                        errorObj = {errorKey:error}
                        return json.dumps(errorObj)
                    else:      
                        data = mstId
                        con.commit()
                        mstKey = 'userid'
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


def bankInfoMaster(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'BANK_INFO':
                cur = con.cursor()
                if req.get("opflag") == 'N':
                    mstId = cur.var(int)
                elif req.get("opflag") == 'M':
                    mstId =  int(req.get("bank_mst_id"))    
                else:
                    mstId =  req.get("bank_mst_id")
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)

                # bank_logo = cur.var(cx_Oracle.CLOB)
                # bank_logo.setvalue(0,req.get("bank_logo"))
                bank_logo = req.get("bank_logo")
                transaction_date = datetime.datetime.strptime(req.get("transaction_date"), '%Y-%m-%d')
                bank_establishment_date = datetime.datetime.strptime(req.get("bank_establishment_date"), '%Y-%m-%d')
                cbs_start_date = datetime.datetime.strptime(req.get("cbs_start_date"), '%Y-%m-%d')
                cur.callproc('pr_bank_info_mast', (
                req.get("opflag"),
                transaction_date,
                req.get("transaction_time"),
                req.get("request_from"),
                req.get("app_mode"),
                req.get("transaction_key"),
                mstId,
                # req.get("bank_mst_id"),
                req.get("bank_code"),
                req.get("bank_name"),
                req.get("bank_name_ol"),
                req.get("address_1"),
                req.get("bank_type"),
                req.get("bank_short_name"),
                bank_establishment_date,
                cbs_start_date,
                bank_logo,
                # req.get("bank_logo"),
                req.get("total_branches"),
                req.get("online_branches"),
                req.get("total_onsite_atm"),
                req.get("total_offsite_atm"),
                req.get("pan"),
                req.get("tan"),
                req.get("rbi_regi_code"),
                req.get("gst_no"),
                req.get("bank_rbi_grade"),
                req.get("clg_bank_code"),
                req.get("micr_code"),
                req.get("bank_bsr_code"),
                req.get("ifsc_code"),
                req.get("eft_code"),
                req.get("ecs_code"),
                req.get("enter_user_id"),
                req.get("enter_desc"),
                err,
                myvar))
                if req.get("opflag") == 'V':
                    data = myvar.getvalue().fetchall() 
                    if len(data) == 0:
                        data = {}
                    df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                    for columName in df.columns:
                        if columName == 'TRANSACTION_DATE' or columName == 'SYS_DATE' or columName == 'OPERATION_DATE':
                            df['TRANSACTION_DATE'] = df['TRANSACTION_DATE'].astype(str)
                            df['SYS_DATE'] = df['SYS_DATE'].astype(str)
                            df['BANK_ESTABLISHMENT_DATE'] = df['BANK_ESTABLISHMENT_DATE'].astype(str)
                            df['CBS_START_DATE'] = df['CBS_START_DATE'].astype(str)
                            df['OPERATION_DATE'] = pd.DataFrame(data=df['OPERATION_DATE'].astype(str))
                            json_list = list(df.T.to_dict().values())
                            if json_list[0]['BANK_LOGO'] == None:
                                json_list[0]['BANK_LOGO'] == 'Null'
                            else:    
                                json_list[0]['BANK_LOGO'] = json_list[0]['BANK_LOGO'].read()
                            resp = json.dumps(json_list[0])
                            cur.close()
                            con.close()
                            return resp     
                elif req.get("opflag") == 'N':   
                    data = mstId.getvalue()
                    if data:
                        con.commit()
                        mstKey = 'bank_mst_id'
                        mstObj = {mstKey:data}
                        resp = json.dumps(mstObj)
                        cur.close()
                        con.close()
                        return resp
                    else:
                        error = err.getvalue()
                        errorKey = 'error'
                        errorObj = {errorKey:error}
                        return json.dumps(errorObj)  
                elif req.get("opflag") == 'M':   
                    data = mstId
                    con.commit()
                    mstKey = 'bank_mst_id'
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


def reconFileConfig(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'RECON_FILE_CONFIG':
                cur = con.cursor()
                if req.get("opflag") == 'N':
                    mstId = cur.var(int)
                elif req.get("opflag") == 'M':
                    mstId =  int(req.get("file_config_det_id"))    
                else:
                    mstId =  req.get("file_config_det_id")
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                transaction_date = datetime.datetime.strptime(req.get("transaction_date"), '%Y-%m-%d')
                cur.callproc('pr_recon_file_config', (req.get("opflag"),transaction_date,req.get("transaction_time"),req.get("request_from"),req.get("app_mode"),req.get("transaction_key"),mstId,req.get("filename_mst"),req.get("file_falg"),req.get("field_desc"),req.get("field_code"),req.get("field_position"),req.get("field_length"),req.get("from_position"),req.get("to_position"),req.get("pad_type"),req.get("pad_char"),req.get("field_type"),req.get("db_column"),req.get("field_format"),req.get("mandetory_flag"),req.get("enter_user_id"),req.get("enter_desc"),err, myvar))
                if req.get("opflag") == 'V':
                    data = myvar.getvalue().fetchall() 
                    if len(data) == 0:
                        data = {}
                    df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                    for columName in df.columns:
                        if columName == 'TRANSACTION_DATE' or columName == 'SYS_DATE' or columName == 'OPERATION_DATE':
                            df['TRANSACTION_DATE'] = df['TRANSACTION_DATE'].astype(str)
                            df['SYS_DATE'] = df['SYS_DATE'].astype(str)
                            df['OPERATION_DATE'] = pd.DataFrame(data=df['OPERATION_DATE'].astype(str))
                            json_list = list(df.T.to_dict().values())
                            resp = json.dumps(json_list[0])
                            cur.close()
                            con.close()
                            return resp
                elif req.get("opflag") == 'N':   
                    data = mstId.getvalue()
                    con.commit()
                    mstKey = 'file_config_det_id'
                    mstObj = {mstKey:data}
                    resp = json.dumps(mstObj)
                    cur.close()
                    con.close()
                    return resp
                elif req.get("opflag") == 'M':   
                    data = mstId
                    con.commit()
                    mstKey = 'file_config_det_id'
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
            # return json.dumps('There is an error in the database ' + err.getvalue())

        except Exception as er:
            cur.close()
            con.close()
            error = err.getvalue() or er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj) 


def reconFileNameFormat(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'RECON_FILENAME_FORMAT':
                cur = con.cursor()
                if req.get("opflag") == 'N':
                    mstId = cur.var(int)
                elif req.get("opflag") == 'M':
                    mstId =  int(req.get("filename_mst_id"))    
                else:
                    mstId =  req.get("filename_mst_id")
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                transaction_date = datetime.datetime.strptime(req.get("transaction_date"), '%Y-%m-%d')
                cur.callproc('pr_recon_filename_format', (
                req.get("opflag"),
                transaction_date,
                req.get("transaction_time"),
                req.get("request_from"),
                req.get("app_mode"),
                req.get("transaction_key"),
                mstId,
                req.get("recon_type_mst_id"),
                req.get("recon_type_flag"),
                req.get("file_format_type"),
                req.get("file_type"),
                req.get("file_name"),
                req.get("onus_number"),
                req.get("file_extension"),
                req.get("SEPRATED_flag"),
                req.get("SEPRATED_char"),
                req.get("RECON_WAY"),
                req.get("enter_user_id"),
                req.get("enter_desc"),
                err, 
                myvar))
                con.commit()
                if req.get("opflag") == 'V':
                    data = myvar.getvalue().fetchall() 
                    if len(data) == 0:
                        data = {}
                    df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                    for columName in df.columns:
                        if columName == 'TRANSACTION_DATE' or columName == 'SYS_DATE' or columName == 'OPERATION_DATE':
                            df['TRANSACTION_DATE'] = df['TRANSACTION_DATE'].astype(str)
                            df['SYS_DATE'] = df['SYS_DATE'].astype(str)
                            df['OPERATION_DATE'] = pd.DataFrame(data=df['OPERATION_DATE'].astype(str))
                            json_list = list(df.T.to_dict().values())
                            resp = json.dumps(json_list[0])
                            cur.close()
                            con.close()
                            return resp
                if req.get("opflag") == 'A':
                    data = myvar.getvalue().fetchall() 
                    if len(data) == 0:
                        data = {}
                    df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                    for columName in df.columns:
                        if columName == 'TRANSACTION_DATE' or columName == 'SYS_DATE' or columName == 'OPERATION_DATE':
                            df['TRANSACTION_DATE'] = df['TRANSACTION_DATE'].astype(str)
                            df['SYS_DATE'] = df['SYS_DATE'].astype(str)
                            df['OPERATION_DATE'] = pd.DataFrame(data=df['OPERATION_DATE'].astype(str))
                            df['OPERATION_DATE'].replace({'NaT': '0'}, inplace=True)
                            # df['OPERATION_DATE'] = df['OPERATION_DATE'].astype(str)
                            json_list = json.loads(json.dumps(list(df.T.to_dict().values())))
                            resp = json.dumps(json_list)
                            cur.close()
                            con.close()
                            return resp    
                elif req.get("opflag") == 'N':
                    data = mstId.getvalue()
                    con.commit()
                    if data:
                        mstKey = 'filename_mst_id'
                        mstObj = {mstKey:data}
                        resp = json.dumps(mstObj)
                        cur.close()
                        con.close()
                        return resp
                    else:
                        error = err.getvalue()
                        errorKey = 'error'
                        errorObj = {errorKey:error}
                        return json.dumps(errorObj)
                elif req.get("opflag") == 'M':
                    if err.getvalue():
                        error = err.getvalue()
                        errorKey = 'error'
                        errorObj = {errorKey:error}
                        return json.dumps(errorObj)
                    else:      
                        data = mstId
                        con.commit()
                        mstKey = 'filename_mst_id'
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



def reconTypeMaster(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'RECON_TYPE_MASTER':
                cur = con.cursor()
                if req.get("opflag") == 'N':
                    mstId = cur.var(int)
                elif req.get("opflag") == 'M':
                    mstId =  int(req.get("recon_type_mst_id"))
                else:
                    mstId =  req.get("recon_type_mst_id")   
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                transaction_date = datetime.datetime.strptime(req.get("transaction_date"), '%Y-%m-%d')
                cur.callproc('pr_recon_type_master', (
                req.get("opflag"),
                transaction_date,
                req.get("transaction_time"),
                req.get("request_from"),
                req.get("app_mode"),
                req.get("transaction_key"),
                mstId,
                # req.get("recon_type_mst_id"),
                req.get("type_name"),
                req.get("type_code"),
                req.get("bin_number"),
                req.get("switch_link_flag"),
                req.get("switch_user_dblink"),
                req.get("enter_user_id"),
                req.get("enter_desc"),
                err, myvar
                ))
                con.commit()
                if req.get("opflag") == 'V':
                    data = myvar.getvalue().fetchall() 
                    if len(data) == 0:
                        data = {}
                    df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                    for columName in df.columns:
                        if columName == 'TRANSACTION_DATE' or columName == 'SYS_DATE' or columName == 'OPERATION_DATE':
                            df['TRANSACTION_DATE'] = df['TRANSACTION_DATE'].astype(str)
                            df['SYS_DATE'] = df['SYS_DATE'].astype(str)
                            df['OPERATION_DATE'] = pd.DataFrame(data=df['OPERATION_DATE'].astype(str))
                            json_list = list(df.T.to_dict().values())
                            resp = json.dumps(json_list[0])
                            cur.close()
                            con.close()
                            return resp
                elif req.get("opflag") == 'N':   
                    data = mstId.getvalue()
                    con.commit()
                    mstKey = 'recon_type_mst_id'
                    mstObj = {mstKey:data}
                    resp = json.dumps(mstObj)
                    cur.close()
                    con.close()
                    return resp
                elif req.get("opflag") == 'M':   
                    data = mstId
                    con.commit()
                    mstKey = 'recon_type_mst_id'
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
            # return json.dumps('There is an error in the database ' + err.getvalue())

        except Exception as er:
            cur.close()
            con.close()
            error = err.getvalue() or er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)


def globalParameter(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'GLOBAL_PARAMETERS_MASTER':
                cur = con.cursor()
                myvar = cur.var(cx_Oracle.CURSOR)
                err = cur.var(cx_Oracle.STRING)
                mstId = cur.var(int)
                transaction_date = datetime.datetime.strptime(req.get("transaction_date"), '%Y-%m-%d')
                cur.callproc('pr_global_parameter_master', (
                req.get("opflag"),
                req.get("request_from"),
                req.get("app_mode"),
                transaction_date,
                req.get("transaction_time"),
                req.get("appli_from_date"),
                req.get("transaction_key"),
                mstId,
                # req.get("recon_type_mst_id"),
                req.get("parameter_description"),
                req.get("module_mst_id"),
                req.get("parameter_type"),
                req.get("global_para_flag"),
                req.get("parameter_value"),
                req.get("parameter_sub_value"),
                req.get("remark"),
                req.get("modify_allow_flag"),
                req.get("enter_user_id"),
                req.get("enter_desc"),err, myvar))
                data = mstId.getvalue()
                con.commit()
                mstKey = 'recon_type_mst_id'
                mstObj = {mstKey:data}
                resp = json.dumps(mstObj)
                cur.close()
                con.close()
                return resp
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
            error = err.getvalue() or er.args[0]
            errorKey = 'error'
            errorObj = {errorKey:error}
            return json.dumps(errorObj)



def getatmunPostedRec(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'GET_ATM_UNPOSTED_RECON':
                cur = con.cursor()
                err = cur.var(cx_Oracle.STRING)
                myvar = cur.var(cx_Oracle.CURSOR)
                recon_base_date = datetime.datetime.strptime(req.get("recon_base_date"), '%Y-%m-%d')
                cur.callproc('pkg_recon_process.pr_get_atm_unposted_rec', (
                req.get('filename_mst_id'),
                recon_base_date,
                myvar,
                err))
                con.commit()
                data = myvar.getvalue().fetchall()
                if len(data) == 0:
                    data = {}
                    errorKey = 'error'
                    errorObj = {errorKey:'No Record Found'}
                    return json.dumps(errorObj)
                df = pd.DataFrame(data, columns=[i[0] for i in myvar.getvalue().description])
                for columName in df.columns:
                    if columName == 'TRANSACTION_DATE':
                        df['TRANSACTION_DATE'] = df['TRANSACTION_DATE'].astype(str)        
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


def atmunPostedTransaction(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'ATM_UNPOSTED_TRANSACTION':
                cur = con.cursor()
                err = cur.var(cx_Oracle.STRING)
                myvar = cur.var(cx_Oracle.CURSOR)
                cbs_trandate  = datetime.datetime.strptime(req.get("cbs_trandate"), '%Y-%m-%d')
                cur.callproc('pkg_recon_process.pr_atm_unposted_transaction', (
                req.get('recon_det_id'),
                cbs_trandate,
                req.get('userid'),
                req.get('userdesc'),
                err
                ))
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

def atmRecordRejected(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'RECORD_REJECTED':
                cur = con.cursor()
                err = cur.var(cx_Oracle.STRING)
                myvar = cur.var(cx_Oracle.CURSOR)
                trandate  = datetime.datetime.strptime(req.get("trandate"), '%Y-%m-%d')
                cur.callproc('pkg_recon_process.pr_record_rejected', (
                req.get('recon_det_id'),
                trandate,
                req.get('userid')
                ))
                con.commit()
                statusKey = "status"
                statusObj = {statusKey:"SUCCESS"}
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



def reconFlagUpdate(req):
    try:
        con = dbConn.psqlOracleconnection()

    except cx_Oracle.DatabaseError as er:
        return 'There is an error in the Oracle database:', er

    else:
        try:
            if req.get("keyword") == 'RECON_FLAG_UPDATE':
                cur = con.cursor()
                err = cur.var(cx_Oracle.STRING)
                transaction_date = datetime.datetime.strptime(req.get("transaction_date"), '%Y-%m-%d')
                cur.callproc('pr_recon_flagupdate', (
                transaction_date,
                req.get('transaction_time'),
                req.get('request_from'),
                req.get('app_mode'),
                req.get('recon_det_id'),
                req.get('userid'),
                err    
                ))
                con.commit()        
                statusObj = {'status':'Sucess'}
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