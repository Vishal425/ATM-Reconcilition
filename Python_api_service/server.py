# file name : script 
# description: combine and execute all api routes.
# Create Date : 23/07/2021
# Create By : Manish Waghmare




from flask_cors import CORS
from flask import Flask,jsonify,request,json, flash,render_template,session,abort
import restApiKeyword
from flask_restful import Resource, Api
from waitress import serve
from werkzeug.exceptions import HTTPException
import dbConn
import pages.fileUploadRecon
import logging

app = Flask(__name__ ,template_folder='./templates', static_folder='./sarvatra')
api = Api(app)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['JSON_SORT_KEYS'] = False
app.secret_key = 'abc@123'

# logging.basicConfig(filename='record.log', level=logging.DEBUG, format=f'%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')
 



@app.route('/', methods=['GET'])
def root():
    return render_template('index.html') # Return index.html

@app.route('/login', methods=['POST'])
def checklogin():
    keyword = ''
    if request.method == 'POST':
        keyword = request.json
        data = restApiKeyword.procedure_name_list(keyword)
    finalResp = json.loads(data)
    if "error" in finalResp[0].keys():
        return jsonify(finalResp)
    else:
        session['user_id'] = finalResp[0]['USERID']
        # session.permanent = True
        return jsonify(finalResp)


@app.route('/', methods=['POST'])
def main():
    keyword = ''
    if request.method == 'POST':
        keyword = request.json
        data = restApiKeyword.procedure_name_list(keyword)
    finalResp = json.loads(data)
    # app.logger.info(finalResp)
    return jsonify(finalResp)

@app.route('/checkDevice', methods=['POST'])
def checkDevice():
    keyword = ''
    if request.method == 'POST':
        keyword = request.json
        data = restApiKeyword.procedure_name_list(keyword)
    finalResp = json.loads(data)
    return jsonify(finalResp)

@app.route('/registerDevice', methods=['POST'])
def registerDevice():
    keyword = ''
    if request.method == 'POST':
        keyword = request.json
        data = restApiKeyword.procedure_name_list(keyword)
    finalResp = json.loads(data)
    return jsonify(finalResp)        
    
@app.errorhandler(404)

def not_found(e):
  if 'user_id' in session:
    USERID = session['user_id']
    logoutInfo = restApiKeyword.procedure_name_list({
        "keyword": "LOGOUT",
        "transaction_date": "2021-09-02",
        "transaction_time": "",
        "request_from": "CBS",
        "app_mode": "ATM",
        "transaction_key": "VGIPL",
        "user_id": USERID,
        "error": None,
        "message": None,
        "logout_data": None  
    })
    print(logoutInfo)   
  return render_template("404.html")


if __name__ == "__main__":
    # serve(app, host='0.0.0.0', port=8080, threads=1) #WAITRESS!
    # clsEnDec.decrypt("U2FsdGVkX1+sd23WdzpE/9kt5JPYRKKHc4ORDtV1vRc=" , "secretkey123")
    #app.run(host='0.0.0.0', port=8080, debug=True)
    app.run(host='0.0.0.0', port=45799, debug=True)
    



