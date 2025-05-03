from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS 

# Inisialisasi Flask dan CORS
app = Flask(__name__)
CORS(app)  # Mengizinkan semua origin

# Memuat model Random Forest yang sudah disimpan
model = joblib.load('random_forest_model.pkl')

@app.route('/')
def home():
    return "Welcome to the Random Forest API!"

# Endpoint untuk prediksi
@app.route('/predict', methods=['POST'])
def predict():
    # Mendapatkan data input dari body request (JSON)
    data = request.get_json()

    # Memastikan data lengkap
    if not all(k in data for k in ('ipk', 'skor_psikologi', 'finansial')):
        return jsonify({"error": "Missing data"}), 400

    # Mendapatkan fitur dari inputan
    ipk = data['ipk']
    skor_psikologi = data['skor_psikologi']
    finansial = data['finansial']

    # Membuat array input untuk prediksi
    input_data = np.array([[ipk, skor_psikologi, finansial]])

    # Melakukan prediksi
    prediction = model.predict(input_data)

    # Mengembalikan hasil prediksi sebagai JSON
    return jsonify({'status': prediction[0]})

# Menjalankan aplikasi Flask
if __name__ == '__main__':
    app.run(debug=True)
