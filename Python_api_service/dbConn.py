from datetime import datetime
import psycopg2
import cx_Oracle




def psqlPostgresconnection():
    connection = psycopg2.connect(database="berar", user="postgres", password="", port=5432, host="192.168.1.32")
    return connection

def psqlOracleconnection():
    # con = cx_Oracle.connect(user="atm_recon_new", password="atm_recon_new",dsn="97.253.1.36:2522/jsbipr")
    # con = cx_Oracle.connect(user="atm_recon_new", password="atm_recon_new",dsn="97.253.1.25/wnsblpr")
    #atm_recon_new/atm_recon_new@192.168.1.50:2522/mcabpr
    con = cx_Oracle.connect(user="atmrecon_sav", password="atmrecon_sav", dsn="192.168.1.89/testing")
    return con
