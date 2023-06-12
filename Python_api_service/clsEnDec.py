# from Cryptodome import Random
# from Cryptodome.Cipher import AES
# import base64
# from hashlib import md5
# from pkcs7 import PKCS7Encoder

# BLOCK_SIZE = 16

# def pad(data):
#     length = BLOCK_SIZE - (len(data) % BLOCK_SIZE)
#     return data + (chr(length)*length).encode()

# def unpad(data):
#     return data[:-(data[-1] if type(data[-1]) == int else ord(data[-1]))]

# def bytes_to_key(data, salt, output=48):
#     assert len(salt) == 8, len(salt)
#     # salt = str(salt)
#     data = bytes(data, 'utf-8')
#     data += salt
#     key = md5(data).digest()
#     final_key = key
#     while len(final_key) < output:
#         key = md5(key + data).digest()
#         final_key += key
#     return final_key[:output]

# def encrypt(message, passphrase):
#     salt = Random.new().read(8)
#     key_iv = bytes_to_key(passphrase, salt, 32+16)
#     key = key_iv[:32]
#     iv = key_iv[32:]
#     aes = AES.new(key, AES.MODE_CBC, iv)
#     return base64.b64encode(b"Salted__" + salt + aes.encrypt(pad(str(message))))

# def decrypt(encrypted, passphrase):
#     encrypted = base64.b64decode(encrypted)
#     assert encrypted[0:8] == b"Salted__"
#     salt = encrypted[8:16]
#     key_iv = bytes_to_key(passphrase, salt, 32+16)
#     key = key_iv[:32]
#     iv = key_iv[32:]
#     aes = AES.new(key, AES.MODE_CBC, iv)
#     return unpad(aes.decrypt(encrypted[16:]))


# def encryptCSharpText(plaintext):
#     key = bytes('hcxilkqbbhczfeultgbskdmaunivmfuo', 'utf-8')
#     iv = bytes('ryojvlzmdalyglrj', 'utf-8')
#     aes = AES.new(key, AES.MODE_CBC, iv)
#     encoder = PKCS7Encoder()
#     text = plaintext
#     pad_text = encoder.encode(text)
#     result = bytes(pad_text, 'utf-8')
#     cipher = aes.encrypt(result)
#     enc_cipher = base64.b64encode(cipher)
#     finalResp = enc_cipher.decode("utf-8")
#     return finalResp


# def decryptCSharp(plaintext):
#     key = bytes('hcxilkqbbhczfeultgbskdmaunivmfuo', 'utf-8')
#     iv = bytes('ryojvlzmdalyglrj', 'utf-8')
#     aes = AES.new(key, AES.MODE_CBC, iv)
#     encoder = PKCS7Encoder()
#     text = plaintext
#     pad_text = encoder.encode(text)
#     result = bytes(pad_text, 'utf-8')
#     cipher = aes.decrypt(result)
#     enc_cipher = base64.b64encode(cipher)
#     finalResp = enc_cipher.decode("utf-8")
#     return finalResp    



# password = "yahskasuknaejrob"
# ct_b64 = "U2FsdGVkX1+R9FKtmNeQpB7bk61OtOovhla2GWRjvzo="

# pt = decrypt(ct_b64, password)
# # return pt
# print("pt", pt)

# print("pt", decrypt(encrypt(pt, password), password))