# Machine Learning Prediction Script - Script untuk prediksi status mahasiswa menggunakan Random Forest
# Machine Learning Prediction Script for student status prediction using Random Forest model

import sys
import json
import joblib
import numpy as np
import urllib.request
import os
import tempfile

def download_model():
    """
    Download model Random Forest dari Google Cloud Storage
    Download Random Forest model from Google Cloud Storage
    
    Returns:
        str: Path ke file model yang telah didownload / Path to downloaded model file
        None: Jika download gagal / If download fails
    """
    # URL public untuk model Random Forest yang sudah ditraining
    # Public URL for pre-trained Random Forest model
    model_url = "https://storage.googleapis.com/model-random-forest/random_forest_model.pkl"
    model_path = os.path.join(tempfile.gettempdir(), 'random_forest_model.pkl')
    
    # Download hanya jika file belum ada di temporary directory
    # Download only if file doesn't exist in temporary directory
    if not os.path.exists(model_path):
        try:
            print("Downloading model...", file=sys.stderr)
            urllib.request.urlretrieve(model_url, model_path)
            print(f"Model downloaded successfully!", file=sys.stderr)
        except Exception as e:
            print(f"Error downloading model: {e}", file=sys.stderr)
            return None
    
    return model_path

def decode_prediction(pred):
    """
    Konversi hasil prediksi ke format lowercase untuk konsistensi
    Convert prediction result to lowercase format for consistency
    
    Args:
        pred: Hasil prediksi dari model / Prediction result from model
        
    Returns:
        str: Status prediksi dalam format lowercase / Prediction status in lowercase format
    """
    pred_str = str(pred).lower()
    return pred_str

def predict_status(ipk, skor_psikologi, finansial):
    """
    Fungsi utama untuk prediksi status mahasiswa berdasarkan data akademik, psikologi, dan finansial
    Main function for student status prediction based on academic, psychological, and financial data
    
    Args:
        ipk (float): Indeks Prestasi Kumulatif mahasiswa (0.0-4.0) / Student's Cumulative GPA (0.0-4.0)
        skor_psikologi (float): Skor hasil tes psikologi (0-100) / Psychology test score (0-100)
        finansial (int): Status finansial mahasiswa (0/1) / Student's financial status (0/1)
        
    Returns:
        dict: Hasil prediksi dengan confidence dan probabilitas / Prediction result with confidence and probabilities
    """
    try:
        # Download dan load model Random Forest
        # Download and load Random Forest model
        model_path = download_model()
        if not model_path:
            return {"success": False, "error": "Failed to download model"}
        
        # Load model menggunakan joblib
        # Load model using joblib
        model = joblib.load(model_path)
        
        # Konversi input ke tipe data numerik yang sesuai
        # Convert inputs to appropriate numeric data types
        ipk_val = float(ipk)
        skor_psikologi_val = float(skor_psikologi)
        finansial_val = int(finansial)
        
        # Validasi range input untuk memastikan data valid
        # Validate input ranges to ensure valid data
        if not (0.0 <= ipk_val <= 4.0):
            return {"success": False, "error": "IPK must be between 0.0 and 4.0"}
        
        if not (0 <= skor_psikologi_val <= 100):
            return {"success": False, "error": "Skor psikologi must be between 0 and 100"}
            
        if finansial_val not in [0, 1]:
            return {"success": False, "error": "Finansial must be 0 or 1"}
        
        # Siapkan input array dalam format yang diharapkan model
        # Prepare input array in the format expected by the model
        # Format: [IPK, Skor_Psikologi, Finansial]
        input_data = np.array([[ipk_val, skor_psikologi_val, finansial_val]])
        
        # Output debug untuk monitoring (dikirim ke stderr agar tidak mengganggu JSON output)
        # Debug output for monitoring (sent to stderr to not interfere with JSON output)
        print(f"Input: IPK={ipk_val}, Skor_Psikologi={skor_psikologi_val}, Finansial={finansial_val}", file=sys.stderr)
        
        # Lakukan prediksi menggunakan model
        # Perform prediction using the model
        prediction = model.predict(input_data)
        prediction_proba = model.predict_proba(input_data)
        
        # Output debug untuk hasil prediksi
        # Debug output for prediction results
        print(f"Prediction: {prediction[0]}", file=sys.stderr)
        print(f"Classes: {model.classes_}", file=sys.stderr)
        
        # Hitung confidence level (probabilitas tertinggi)
        # Calculate confidence level (highest probability)
        confidence = float(np.max(prediction_proba) * 100)
        
        # Decode hasil prediksi ke format yang konsisten
        # Decode prediction result to consistent format
        predicted_status = decode_prediction(prediction[0])
        
        # Buat detail probabilitas untuk semua kelas
        # Create probability details for all classes
        prob_details = {}
        for i, class_name in enumerate(model.classes_):
            prob_details[class_name.lower()] = round(float(prediction_proba[0][i]) * 100, 2)
        
        # Return hasil prediksi lengkap dengan metadata
        # Return complete prediction result with metadata
        return {
            "success": True,
            "predicted_status": predicted_status,
            "confidence": round(confidence, 2),
            "probabilities": prob_details,
            "input_data": {
                "ipk": ipk_val,
                "skor_psikologi": skor_psikologi_val,
                "finansial": finansial_val
            }
        }
        
    except ValueError as e:
        # Handle error konversi tipe data
        # Handle data type conversion errors
        return {
            "success": False,
            "error": f"Invalid input values: {str(e)}"
        }
    except Exception as e:
        # Handle error umum lainnya
        # Handle other general errors
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    # Baca input dari command line arguments
    # Read input from command line arguments
    if len(sys.argv) != 4:
        print(json.dumps({"success": False, "error": "Usage: python predict.py <ipk> <skor_psikologi> <finansial>"}))
        sys.exit(1)
    
    # Ekstrak parameter dari command line
    # Extract parameters from command line
    ipk = sys.argv[1]           # Parameter IPK mahasiswa / Student's GPA parameter
    skor_psikologi = sys.argv[2] # Parameter skor psikologi / Psychology score parameter
    finansial = sys.argv[3]      # Parameter status finansial / Financial status parameter
    
    # Jalankan prediksi dengan parameter yang diberikan
    # Run prediction with given parameters
    result = predict_status(ipk, skor_psikologi, finansial)
    
    # Output hasil dalam format JSON untuk konsumsi oleh Node.js
    # Output result in JSON format for consumption by Node.js
    print(json.dumps(result))